#!/usr/bin/env python3
"""Adopt user-approved HZISL DOCX files and assemble the handbook annexes.

The retained input files are never modified. Match-report pages are split by
top-level body ranges so their OOXML, styles, media, headers and tables remain
source-derived. The combined handbook keeps its own header/footer system and
appends the approved annex bodies on explicit new pages.
"""

from __future__ import annotations

import argparse
import copy
import shutil
import zipfile
from pathlib import Path

from lxml import etree


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
CP_NS = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
DC_NS = "http://purl.org/dc/elements/1.1/"
EP_NS = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
NS = {"w": W_NS}

W = f"{{{W_NS}}}"

REPORT_PARTS = (
    ("HZISL_Official_Match_Report_Football_2026-27.docx", 0, 12, "Official Match Report Football"),
    ("HZISL_Official_Match_Report_Basketball_2026-27.docx", 12, 24, "Official Match Report Basketball"),
    (
        "HZISL_Official_Match_Report_Volleyball_Tennis_Table_Tennis_2026-27.docx",
        24,
        36,
        "Official Match Report Volleyball / Tennis / Table Tennis",
    ),
    ("HZISL_Official_Match_Report_Template_2026-27.docx", 36, 47, "Official Match Report Template"),
)

ANNEXES = (
    ("Annex A", "Host a Game Guide", "HZISL_Host_a_Game_Guide_2026-27.docx"),
    ("Annex B", "School Participation Agreement", "HZISL_School_Participation_Agreement_2026-27.docx"),
    ("Annex C", "Team Roster & Eligibility Declaration", "HZISL_Team_Roster_and_Eligibility_2026-27.docx"),
    ("Annex D", "Official Match Report Template", "HZISL_Official_Match_Report_Template_2026-27.docx"),
)


def xml_bytes(root: etree._Element) -> bytes:
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")


def replace_zip_parts(source: Path, target: Path, replacements: dict[str, bytes]) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(source, "r") as zin, zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as zout:
        for info in zin.infolist():
            zout.writestr(info, replacements.get(info.filename, zin.read(info.filename)))


def update_doc_properties(zf: zipfile.ZipFile, title: str) -> dict[str, bytes]:
    replacements: dict[str, bytes] = {}
    if "docProps/core.xml" in zf.namelist():
        core = etree.fromstring(zf.read("docProps/core.xml"))
        title_node = core.find(f"{{{DC_NS}}}title")
        if title_node is None:
            title_node = etree.SubElement(core, f"{{{DC_NS}}}title")
        title_node.text = title
        replacements["docProps/core.xml"] = xml_bytes(core)
    if "docProps/app.xml" in zf.namelist():
        app = etree.fromstring(zf.read("docProps/app.xml"))
        pages = app.find(f"{{{EP_NS}}}Pages")
        if pages is not None:
            pages.text = "1"
        replacements["docProps/app.xml"] = xml_bytes(app)
    return replacements


def split_match_report(source: Path, output_dir: Path) -> list[Path]:
    outputs: list[Path] = []
    with zipfile.ZipFile(source, "r") as zf:
        document_root = etree.fromstring(zf.read("word/document.xml"))
        source_body = document_root.find(f"{W}body")
        if source_body is None:
            raise RuntimeError("The match report has no w:body")
        children = list(source_body)
        if len(children) != 48 or children[-1].tag != f"{W}sectPr":
            raise RuntimeError(f"Unexpected match-report body structure: {len(children)} children")
        section_properties = children[-1]

        for filename, start, end, title in REPORT_PARTS:
            selected_children = [copy.deepcopy(child) for child in children[start:end]]
            while selected_children:
                trailing = selected_children[-1]
                has_content = bool(trailing.xpath(".//w:t[normalize-space()] | .//w:drawing | .//w:object", namespaces=NS))
                if trailing.tag != f"{W}p" or has_content:
                    break
                selected_children.pop()

            split_root = copy.deepcopy(document_root)
            split_body = split_root.find(f"{W}body")
            assert split_body is not None
            for child in list(split_body):
                split_body.remove(child)
            for child in selected_children:
                split_body.append(child)
            split_body.append(copy.deepcopy(section_properties))

            replacements = update_doc_properties(zf, title)
            replacements["word/document.xml"] = xml_bytes(split_root)
            target = output_dir / filename
            replace_zip_parts(source, target, replacements)
            outputs.append(target)
    return outputs


def add_page_break_before(element: etree._Element) -> None:
    if element.tag != f"{W}p":
        paragraph = etree.Element(f"{W}p")
        properties = etree.SubElement(paragraph, f"{W}pPr")
        etree.SubElement(properties, f"{W}pageBreakBefore")
        element.addprevious(paragraph)
        return
    properties = element.find(f"{W}pPr")
    if properties is None:
        properties = etree.Element(f"{W}pPr")
        element.insert(0, properties)
    if properties.find(f"{W}pageBreakBefore") is None:
        etree.SubElement(properties, f"{W}pageBreakBefore")


def paragraph(text: str, style: str | None = None, *, bold_lead: str | None = None) -> etree._Element:
    node = etree.Element(f"{W}p")
    properties = etree.SubElement(node, f"{W}pPr")
    if style:
        style_node = etree.SubElement(properties, f"{W}pStyle")
        style_node.set(f"{W}val", style)
    if bold_lead and text.startswith(bold_lead):
        lead_run = etree.SubElement(node, f"{W}r")
        run_properties = etree.SubElement(lead_run, f"{W}rPr")
        etree.SubElement(run_properties, f"{W}b")
        lead_text = etree.SubElement(lead_run, f"{W}t")
        lead_text.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
        lead_text.text = bold_lead
        remaining = text[len(bold_lead):]
        body_run = etree.SubElement(node, f"{W}r")
        body_text = etree.SubElement(body_run, f"{W}t")
        body_text.text = remaining
    else:
        run = etree.SubElement(node, f"{W}r")
        text_node = etree.SubElement(run, f"{W}t")
        text_node.text = text
    return node


def next_numeric_id(elements: list[etree._Element], attribute: str) -> int:
    values = [int(value) for element in elements if (value := element.get(attribute)) is not None]
    return max(values, default=0) + 1


def import_numbering(
    base_numbering: etree._Element,
    source_numbering: etree._Element,
    body_elements: list[etree._Element],
) -> dict[int, int]:
    used_num_ids = sorted(
        {int(value) for element in body_elements for value in element.xpath(".//w:numId/@w:val", namespaces=NS)}
    )
    if not used_num_ids:
        return {}

    abstract_nodes = base_numbering.findall(f"{W}abstractNum")
    num_nodes = base_numbering.findall(f"{W}num")
    next_abstract_id = next_numeric_id(abstract_nodes, f"{W}abstractNumId")
    next_num_id = next_numeric_id(num_nodes, f"{W}numId")
    num_mapping: dict[int, int] = {}

    for old_num_id in used_num_ids:
        source_num = source_numbering.find(f"{W}num[@{W}numId='{old_num_id}']")
        if source_num is None:
            raise RuntimeError(f"Missing numbering definition for numId {old_num_id}")
        abstract_ref = source_num.find(f"{W}abstractNumId")
        if abstract_ref is None:
            raise RuntimeError(f"Missing abstract numbering reference for numId {old_num_id}")
        old_abstract_id = int(abstract_ref.get(f"{W}val"))
        source_abstract = source_numbering.find(f"{W}abstractNum[@{W}abstractNumId='{old_abstract_id}']")
        if source_abstract is None:
            raise RuntimeError(f"Missing abstract numbering definition {old_abstract_id}")

        imported_abstract = copy.deepcopy(source_abstract)
        imported_abstract.set(f"{W}abstractNumId", str(next_abstract_id))
        imported_num = copy.deepcopy(source_num)
        imported_num.set(f"{W}numId", str(next_num_id))
        imported_ref = imported_num.find(f"{W}abstractNumId")
        assert imported_ref is not None
        imported_ref.set(f"{W}val", str(next_abstract_id))
        base_numbering.append(imported_abstract)
        base_numbering.append(imported_num)
        num_mapping[old_num_id] = next_num_id
        next_abstract_id += 1
        next_num_id += 1

    for element in body_elements:
        for num_id in element.xpath(".//w:numId", namespaces=NS):
            old_value = int(num_id.get(f"{W}val"))
            if old_value in num_mapping:
                num_id.set(f"{W}val", str(num_mapping[old_value]))
    return num_mapping


def import_numbered_styles(
    base_styles: etree._Element,
    source_styles: etree._Element,
    body_elements: list[etree._Element],
    num_mapping: dict[int, int],
    annex_index: int,
) -> None:
    style_mapping: dict[str, str] = {}
    for style_reference in [element for body in body_elements for element in body.xpath(".//w:pStyle", namespaces=NS)]:
        old_style_id = style_reference.get(f"{W}val")
        if not old_style_id:
            continue
        source_style = source_styles.find(f"{W}style[@{W}styleId='{old_style_id}']")
        if source_style is None:
            continue
        style_num_ids = source_style.xpath(".//w:numId/@w:val", namespaces=NS)
        if not style_num_ids or int(style_num_ids[0]) not in num_mapping:
            continue

        if old_style_id not in style_mapping:
            new_style_id = f"Annex{annex_index}{old_style_id}"
            imported_style = copy.deepcopy(source_style)
            imported_style.set(f"{W}styleId", new_style_id)
            name = imported_style.find(f"{W}name")
            if name is not None:
                name.set(f"{W}val", f"Annex {annex_index} {name.get(f'{W}val', old_style_id)}")
            for num_id in imported_style.xpath(".//w:numId", namespaces=NS):
                old_num_id = int(num_id.get(f"{W}val"))
                if old_num_id in num_mapping:
                    num_id.set(f"{W}val", str(num_mapping[old_num_id]))
            base_styles.append(imported_style)
            style_mapping[old_style_id] = new_style_id

        style_reference.set(f"{W}val", style_mapping[old_style_id])


def restart_numbered_run(
    numbering_root: etree._Element,
    body_elements: list[etree._Element],
    first_text: str,
    start_value: int,
) -> None:
    paragraphs: list[etree._Element] = []
    for body in body_elements:
        if body.tag == f"{W}p" and body.find(f"{W}pPr/{W}numPr") is not None:
            paragraphs.append(body)
        paragraphs.extend(body.xpath(".//w:p[w:pPr/w:numPr]", namespaces=NS))
    start_index = next(
        (
            index
            for index, paragraph_node in enumerate(paragraphs)
            if " ".join(paragraph_node.xpath(".//w:t/text()", namespaces=NS)).startswith(first_text)
        ),
        None,
    )
    if start_index is None:
        return

    first_paragraph = paragraphs[start_index]
    original_num_id = int(first_paragraph.xpath("string(w:pPr/w:numPr/w:numId/@w:val)", namespaces=NS))
    original_num = numbering_root.find(f"{W}num[@{W}numId='{original_num_id}']")
    if original_num is None:
        raise RuntimeError(f"Missing numbering definition for restart numId {original_num_id}")

    new_num_id = next_numeric_id(numbering_root.findall(f"{W}num"), f"{W}numId")
    restarted_num = copy.deepcopy(original_num)
    restarted_num.set(f"{W}numId", str(new_num_id))
    level_override = etree.SubElement(restarted_num, f"{W}lvlOverride")
    level_override.set(f"{W}ilvl", "0")
    start_override = etree.SubElement(level_override, f"{W}startOverride")
    start_override.set(f"{W}val", str(start_value))
    numbering_root.append(restarted_num)

    for paragraph_node in paragraphs[start_index:]:
        num_id = paragraph_node.find(f"{W}pPr/{W}numPr/{W}numId")
        if num_id is None or int(num_id.get(f"{W}val")) != original_num_id:
            break
        num_id.set(f"{W}val", str(new_num_id))


def build_handbook_with_annexes(base: Path, output_dir: Path) -> Path:
    with zipfile.ZipFile(base, "r") as base_zip:
        document_root = etree.fromstring(base_zip.read("word/document.xml"))
        handbook_text = " ".join(document_root.xpath(".//w:t/text()", namespaces=NS))
        if "Annex register" in handbook_text:
            raise RuntimeError("The handbook already contains the annex bundle; use the core handbook as input")
        body = document_root.find(f"{W}body")
        if body is None:
            raise RuntimeError("The handbook has no w:body")
        section_properties = body[-1]
        if section_properties.tag != f"{W}sectPr":
            raise RuntimeError("The handbook body does not end with w:sectPr")
        body.remove(section_properties)

        for text_node in document_root.xpath(".//w:t", namespaces=NS):
            if text_node.text:
                text_node.text = text_node.text.replace("08:00", "09:00").replace("09:30", "10:30")

        body.append(paragraph("Annex register", "Heading1"))
        for code, title, _ in ANNEXES:
            body.append(paragraph(f"{code} — {title}", bold_lead=code))

        numbering_root = etree.fromstring(base_zip.read("word/numbering.xml"))
        styles_root = etree.fromstring(base_zip.read("word/styles.xml"))
        for annex_index, (_, _, filename) in enumerate(ANNEXES, start=1):
            source = output_dir / filename
            with zipfile.ZipFile(source, "r") as source_zip:
                source_root = etree.fromstring(source_zip.read("word/document.xml"))
                source_body = source_root.find(f"{W}body")
                if source_body is None:
                    raise RuntimeError(f"{filename} has no w:body")
                source_children = [copy.deepcopy(child) for child in list(source_body) if child.tag != f"{W}sectPr"]
                if not source_children:
                    continue
                add_page_break_before(source_children[0])
                source_numbering = etree.fromstring(source_zip.read("word/numbering.xml"))
                num_mapping = import_numbering(numbering_root, source_numbering, source_children)
                source_styles = etree.fromstring(source_zip.read("word/styles.xml"))
                import_numbered_styles(styles_root, source_styles, source_children, num_mapping, annex_index)
                if filename == "HZISL_Host_a_Game_Guide_2026-27.docx":
                    restart_numbered_run(
                        numbering_root,
                        source_children,
                        "The responsible school adult contacts",
                        5,
                    )
                for child in source_children:
                    body.append(child)

        body.append(section_properties)
        replacements = {
            "word/document.xml": xml_bytes(document_root),
            "word/numbering.xml": xml_bytes(numbering_root),
            "word/styles.xml": xml_bytes(styles_root),
        }
        target = output_dir / "HZISL_Competition_Handbook_2026-27.docx"
        temporary = output_dir / ".HZISL_Competition_Handbook_2026-27.tmp.docx"
        replace_zip_parts(base, temporary, replacements)
        temporary.replace(target)
        return target


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--roster", type=Path, required=True)
    parser.add_argument("--host", type=Path, required=True)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--agreement", type=Path, required=True)
    parser.add_argument("--handbook", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    approved_copies = (
        (args.host, args.output_dir / "HZISL_Host_a_Game_Guide_2026-27.docx"),
        (args.agreement, args.output_dir / "HZISL_School_Participation_Agreement_2026-27.docx"),
        (args.roster, args.output_dir / "HZISL_Team_Roster_and_Eligibility_2026-27.docx"),
    )
    for source, target in approved_copies:
        shutil.copy2(source, target)
        print(f"[OK] adopted {target}")

    for target in split_match_report(args.report, args.output_dir):
        print(f"[OK] split {target}")

    handbook = build_handbook_with_annexes(args.handbook, args.output_dir)
    print(f"[OK] assembled {handbook}")


if __name__ == "__main__":
    main()
