#!/usr/bin/env python3
"""Add the volleyball option to the retained roster declaration."""

from __future__ import annotations

import argparse
import zipfile
from pathlib import Path

from lxml import etree


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
CP_NS = "http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
W = f"{{{W_NS}}}"
NS = {"w": W_NS}
SOURCE_TEXT = "□ Football  □ Basketball     □ MS  □ HS     □ Boys  □ Girls"
TARGET_TEXT = "□ Football  □ Basketball  □ Volleyball     □ MS  □ HS     □ Boys  □ Girls"


def xml_bytes(root: etree._Element) -> bytes:
    return etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone="yes")


def update_document(document_xml: bytes) -> bytes:
    root = etree.fromstring(document_xml)
    matches = 0
    for text_node in root.xpath(".//w:t", namespaces=NS):
        if text_node.text and SOURCE_TEXT in text_node.text:
            text_node.text = text_node.text.replace(SOURCE_TEXT, TARGET_TEXT)
            matches += 1
    if matches != 1:
        if sum(TARGET_TEXT in (node.text or "") for node in root.xpath(".//w:t", namespaces=NS)) != 1:
            raise RuntimeError(f"Expected one roster competition field, changed {matches}")
    return xml_bytes(root)


def update_core(core_xml: bytes) -> bytes:
    root = etree.fromstring(core_xml)
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
        / "HZISL_Team_Roster_and_Eligibility_2026-27.docx",
    )
    args = parser.parse_args()
    update_in_place(args.path)
    print(f"Updated {args.path}")


if __name__ == "__main__":
    main()
