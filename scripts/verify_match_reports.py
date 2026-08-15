#!/usr/bin/env python3
"""Validate the generated HZISL per-fixture DOCX set."""

from __future__ import annotations

import json
import zipfile
from pathlib import Path

from lxml import etree


ROOT = Path(__file__).resolve().parents[1]
DOCUMENTS_DIR = ROOT / "public" / "documents"
MATCHES_DIR = DOCUMENTS_DIR / "matches"
MANIFEST = MATCHES_DIR / "manifest.json"
PEOPLE = ROOT / "scripts" / "match_report_people.json"
TEMPLATES = {
    "football": DOCUMENTS_DIR / "HZISL_Official_Match_Report_Football_2026-27.docx",
    "basketball": DOCUMENTS_DIR / "HZISL_Official_Match_Report_Basketball_2026-27.docx",
    "volleyball": DOCUMENTS_DIR
    / "HZISL_Official_Match_Report_Volleyball_Tennis_Table_Tennis_2026-27.docx",
}
ALLOWED_CHANGED_MEMBERS = {"word/document.xml", "docProps/core.xml"}
W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"


def visible_text(document_xml: bytes) -> str:
    root = etree.fromstring(document_xml)
    return " ".join(root.xpath("//w:t/text()", namespaces={"w": W_NS}))


def main() -> None:
    matches = json.loads(MANIFEST.read_text(encoding="utf-8"))["matches"]
    people = json.loads(PEOPLE.read_text(encoding="utf-8"))
    expected = {
        MATCHES_DIR / match["sportId"] / match["filename"] for match in matches
    }
    actual = set(MATCHES_DIR.glob("*/*.docx"))
    if len(matches) != 360 or len(expected) != 360:
        raise RuntimeError(f"Expected 360 unique fixtures, found {len(expected)}")
    if expected != actual:
        missing = sorted(str(path.relative_to(ROOT)) for path in expected - actual)
        extra = sorted(str(path.relative_to(ROOT)) for path in actual - expected)
        raise RuntimeError(f"Match-report set mismatch. Missing={missing}; extra={extra}")

    template_cache: dict[str, dict[str, bytes]] = {}
    for sport, template in TEMPLATES.items():
        with zipfile.ZipFile(template) as package:
            template_cache[sport] = {
                info.filename: package.read(info.filename) for info in package.infolist()
            }

    for match in matches:
        target = MATCHES_DIR / match["sportId"] / match["filename"]
        source = template_cache[match["sport"]]
        with zipfile.ZipFile(target) as package:
            generated = {
                info.filename: package.read(info.filename) for info in package.infolist()
            }
        if source.keys() != generated.keys():
            raise RuntimeError(f"Package members changed in {target}")
        unexpected = {
            name
            for name in source
            if source[name] != generated[name] and name not in ALLOWED_CHANGED_MEMBERS
        }
        if unexpected:
            raise RuntimeError(f"Unexpected package edits in {target}: {sorted(unexpected)}")

        text = visible_text(generated["word/document.xml"])
        required = [
            str(match["competition"]),
            str(match["homeSchool"]),
            str(match["awaySchool"]),
            people[str(match["home"])]["headCoach"],
            people[str(match["home"])]["leadOfficial"],
            people[str(match["away"])]["headCoach"],
            str(match["kickoff"]),
            str(match["venue"]),
        ]
        if match["sport"] == "volleyball":
            required.extend(["Official Match Report Volleyball", "N/A"])
        missing_text = [value for value in required if value not in text]
        if missing_text:
            raise RuntimeError(f"Missing fixture data in {target}: {missing_text}")

    print("Verified 360 unique, source-derived, prefilled match-report DOCX files")


if __name__ == "__main__":
    main()
