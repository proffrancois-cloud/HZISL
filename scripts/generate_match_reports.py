#!/usr/bin/env python3
"""Generate source-derived, prefilled HZISL match-report DOCX files."""

from __future__ import annotations

import argparse
import copy
import json
import zipfile
from datetime import date
from pathlib import Path

from lxml import etree


ROOT = Path(__file__).resolve().parents[1]
DOCUMENTS_DIR = ROOT / "public" / "documents"
DEFAULT_MANIFEST = DOCUMENTS_DIR / "matches" / "manifest.json"
DEFAULT_OUTPUT_DIR = DOCUMENTS_DIR / "matches"
DEFAULT_PEOPLE = ROOT / "scripts" / "match_report_people.json"

TEMPLATES = {
    "football": DOCUMENTS_DIR / "HZISL_Official_Match_Report_Football_2026-27.docx",
    "basketball": DOCUMENTS_DIR / "HZISL_Official_Match_Report_Basketball_2026-27.docx",
    "volleyball": DOCUMENTS_DIR / "HZISL_Official_Match_Report_Volleyball_Tennis_Table_Tennis_2026-27.docx",
}

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
DC_NS = "http://purl.org/dc/elements/1.1/"
XML_NS = "http://www.w3.org/XML/1998/namespace"
W = f"{{{W_NS}}}"
NS = {"w": W_NS}


def xml_bytes(root: etree._Element) -> bytes:
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")


def set_run_format(run: etree._Element, *, size: int, bold: bool = False) -> None:
    run_properties = etree.SubElement(run, f"{W}rPr")
    fonts = etree.SubElement(run_properties, f"{W}rFonts")
    for attribute in ("ascii", "hAnsi", "eastAsia"):
        fonts.set(f"{W}{attribute}", "Calibri")
    color = etree.SubElement(run_properties, f"{W}color")
    color.set(f"{W}val", "0B2545")
    font_size = etree.SubElement(run_properties, f"{W}sz")
    font_size.set(f"{W}val", str(size))
    font_size_complex = etree.SubElement(run_properties, f"{W}szCs")
    font_size_complex.set(f"{W}val", str(size))
    if bold:
        etree.SubElement(run_properties, f"{W}b")
        etree.SubElement(run_properties, f"{W}bCs")


def replace_paragraph_text(
    paragraph: etree._Element,
    text: str,
    *,
    size: int | None = None,
    bold: bool = False,
) -> None:
    properties = paragraph.find(f"{W}pPr")
    for child in list(paragraph):
        if child is not properties:
            paragraph.remove(child)

    lines = text.split("\n")
    run = etree.SubElement(paragraph, f"{W}r")
    if size is not None:
        set_run_format(run, size=size, bold=bold)
    elif bold:
        run_properties = etree.SubElement(run, f"{W}rPr")
        etree.SubElement(run_properties, f"{W}b")
        etree.SubElement(run_properties, f"{W}bCs")

    for index, line in enumerate(lines):
        if index:
            etree.SubElement(run, f"{W}br")
        text_node = etree.SubElement(run, f"{W}t")
        if line.startswith(" ") or line.endswith(" "):
            text_node.set(f"{{{XML_NS}}}space", "preserve")
        text_node.text = line


def replace_cell_text(
    table: etree._Element,
    row_index: int,
    column_index: int,
    text: str,
    *,
    size: int = 18,
    bold: bool = False,
) -> None:
    rows = table.findall(f"{W}tr")
    cells = rows[row_index].findall(f"{W}tc")
    cell = cells[column_index]
    paragraph = cell.find(f"{W}p")
    if paragraph is None:
        paragraph = etree.SubElement(cell, f"{W}p")
    replace_paragraph_text(paragraph, text, size=size, bold=bold)


def long_date(iso_date: str) -> str:
    value = date.fromisoformat(iso_date)
    return f"{value.day} {value.strftime('%B %Y')}"


def match_title(match: dict[str, object]) -> str:
    return (
        f"HZISL {match['competition']} — Matchday {match['matchday']} — "
        f"{match['home']} vs {match['away']}"
    )


def update_core_title(core_xml: bytes, title: str) -> bytes:
    root = etree.fromstring(core_xml)
    title_node = root.find(f"{{{DC_NS}}}title")
    if title_node is None:
        title_node = etree.SubElement(root, f"{{{DC_NS}}}title")
    title_node.text = title
    return xml_bytes(root)


def build_document_xml(
    template_xml: bytes,
    match: dict[str, object],
    people: dict[str, dict[str, str]],
) -> bytes:
    root = etree.fromstring(template_xml)
    body = root.find(f"{W}body")
    if body is None:
        raise RuntimeError("Match-report template has no document body")
    paragraphs = body.findall(f"{W}p")
    tables = body.findall(f"{W}tbl")
    if len(paragraphs) != 5 or len(tables) != 5:
        raise RuntimeError(
            f"Unexpected source structure: {len(paragraphs)} paragraphs and {len(tables)} tables"
        )

    sport = str(match["sport"])
    home_people = people[str(match["home"])]
    away_people = people[str(match["away"])]
    if sport == "volleyball":
        replace_paragraph_text(paragraphs[0], "Official Match Report Volleyball")

    facts = (
        f"Date: {long_date(str(match['date']))}  •  Matchday {match['matchday']}  •  "
        f"Start: {match['kickoff']}\nVenue: {match['venue']}"
    )
    replace_cell_text(tables[1], 1, 1, facts, size=17)
    replace_cell_text(tables[1], 2, 1, str(match["competition"]), size=18, bold=True)
    replace_cell_text(
        tables[1],
        3,
        1,
        f"Home: {match['home']} — {match['homeSchool']}\nAway: {match['away']} — {match['awaySchool']}",
        size=17,
    )
    replace_cell_text(
        tables[1],
        4,
        1,
        f"Lead referee: {home_people['leadOfficial']}",
        size=17,
    )

    replace_cell_text(tables[2], 1, 0, str(match["home"]), size=17, bold=True)
    replace_cell_text(tables[2], 2, 0, str(match["away"]), size=17, bold=True)
    replace_cell_text(tables[3], 1, 0, f"{match['home']} (HOME)", size=17, bold=True)
    replace_cell_text(tables[3], 2, 0, f"{match['away']} (AWAY)", size=17, bold=True)
    if sport == "volleyball":
        # HZISL volleyball is best-of-three. Keep the retained seven-column
        # source table intact while making the two unused set columns explicit.
        replace_cell_text(tables[3], 0, 4, "N/A", size=16, bold=True)
        replace_cell_text(tables[3], 0, 5, "N/A", size=16, bold=True)

    signature_line = "    Signature: ____________________"
    replace_cell_text(
        tables[4], 1, 1, f"{home_people['headCoach']}{signature_line}", size=16
    )
    replace_cell_text(
        tables[4], 2, 1, f"{away_people['headCoach']}{signature_line}", size=16
    )
    replace_cell_text(
        tables[4], 3, 1, f"{home_people['leadOfficial']}{signature_line}", size=16
    )

    return xml_bytes(root)


def write_source_derived_docx(
    template: Path,
    target: Path,
    match: dict[str, object],
    people: dict[str, dict[str, str]],
) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(template, "r") as source:
        replacements = {
            "word/document.xml": build_document_xml(
                source.read("word/document.xml"), match, people
            ),
            "docProps/core.xml": update_core_title(
                source.read("docProps/core.xml"), match_title(match)
            ),
        }
        with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as output:
            for info in source.infolist():
                output.writestr(info, replacements.get(info.filename, source.read(info.filename)))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--people", type=Path, default=DEFAULT_PEOPLE)
    parser.add_argument("--expected-count", type=int, default=360)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    payload = json.loads(args.manifest.read_text(encoding="utf-8"))
    matches = payload["matches"]
    people = json.loads(args.people.read_text(encoding="utf-8"))
    if len(matches) != args.expected_count:
        raise RuntimeError(f"Expected {args.expected_count} matches, found {len(matches)}")

    for match in matches:
        template = TEMPLATES[match["sport"]]
        target = args.output_dir / match["sportId"] / match["filename"]
        write_source_derived_docx(template, target, match, people)

    print(f"Generated {len(matches)} source-derived match reports in {args.output_dir}")


if __name__ == "__main__":
    main()
