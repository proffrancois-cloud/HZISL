#!/usr/bin/env python3
"""Add volleyball to the retained handbook without disturbing its annex bundle."""

from __future__ import annotations

import argparse
import zipfile
from pathlib import Path

from lxml import etree


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
CP_NS = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
W = f"{{{W_NS}}}"
NS = {"w": W_NS}

REPLACEMENTS = {
    "football and basketball division": "football, basketball and volleyball division",
    "Sports: football and basketball.": "Sports: football, basketball and volleyball.",
    "Football Rules and Basketball Rules": "Football, Basketball and Volleyball Rules",
    "incorporated IFAB or FIBA rules": "incorporated IFAB, FIBA or FIVB rules",
    "□ Football  □ Basketball     □ MS  □ HS     □ Boys  □ Girls": "□ Football  □ Basketball  □ Volleyball     □ MS  □ HS     □ Boys  □ Girls",
}


def xml_bytes(root: etree._Element) -> bytes:
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")


def update_document(document_xml: bytes) -> bytes:
    root = etree.fromstring(document_xml)
    replacement_counts = {source: 0 for source in REPLACEMENTS}
    for text_node in root.xpath(".//w:t", namespaces=NS):
        if not text_node.text:
            continue
        for source, target in REPLACEMENTS.items():
            if source in text_node.text:
                text_node.text = text_node.text.replace(source, target)
                replacement_counts[source] += 1
    all_text = [text_node.text or "" for text_node in root.xpath(".//w:t", namespaces=NS)]
    missing = []
    for source, count in replacement_counts.items():
        target_count = sum(REPLACEMENTS[source] in text for text in all_text)
        if count != 1 and target_count != 1:
            missing.append(source)
    if missing:
        raise RuntimeError(f"Expected one exact handbook replacement for: {missing}")

    volleyball_officials = root.xpath(
        ".//w:p[.//w:t[contains(., 'Volleyball: the referee crew controls play')]]",
        namespaces=NS,
    )
    if not volleyball_officials:
        basketball_officials = root.xpath(
            ".//w:p[.//w:t[contains(., 'Basketball: the referee crew controls play')]]",
            namespaces=NS,
        )
        if len(basketball_officials) != 1:
            raise RuntimeError("Could not locate the handbook basketball-officials paragraph")
        volleyball_paragraph = etree.fromstring(etree.tostring(basketball_officials[0]))
        for text_node in volleyball_paragraph.xpath(".//w:t", namespaces=NS):
            if text_node.text:
                text_node.text = text_node.text.replace(
                    "Basketball: the referee crew controls play; the scorer and timer maintain the table record under the crew’s authority.",
                    "Volleyball: the referee crew controls play; the scorer records rotations, set scores, substitutions and sanctions under the crew’s authority.",
                )
        basketball_officials[0].addnext(volleyball_paragraph)
    return xml_bytes(root)


def update_core(core_xml: bytes) -> bytes:
    root = etree.fromstring(core_xml)
    for node in root.iter():
        if node.text:
            node.text = node.text.replace(
                "HZISL, interschool sports, football, basketball",
                "HZISL, interschool sports, football, basketball, volleyball",
            )
    revision = root.find(f"{{{CP_NS}}}revision")
    if revision is not None and revision.text and revision.text.isdigit():
        revision.text = str(int(revision.text) + 1)
    return xml_bytes(root)


def update_in_place(path: Path) -> None:
    temporary = path.with_name(f".{path.name}.tmp")
    with zipfile.ZipFile(path, "r") as source, zipfile.ZipFile(
        temporary, "w", zipfile.ZIP_DEFLATED
    ) as output:
        replacements = {
            "word/document.xml": update_document(source.read("word/document.xml")),
            "docProps/core.xml": update_core(source.read("docProps/core.xml")),
        }
        for info in source.infolist():
            output.writestr(info, replacements.get(info.filename, source.read(info.filename)))
    temporary.replace(path)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "path",
        type=Path,
        nargs="?",
        default=Path(__file__).resolve().parents[1]
        / "public"
        / "documents"
        / "HZISL_Competition_Handbook_2026-27.docx",
    )
    args = parser.parse_args()
    update_in_place(args.path)
    print(f"Updated {args.path}")


if __name__ == "__main__":
    main()
