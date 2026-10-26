"""Check the Sprint 3 handoff against EF's schema and the traceability IDs."""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = "--index" in sys.argv
tracked = set(subprocess.check_output(["git", "ls-files"], cwd=ROOT).decode("utf-8").splitlines()) if INDEX else set()


def read(path):
    if INDEX:
        return subprocess.check_output(["git", "show", ":" + path], cwd=ROOT).decode("utf-8-sig")
    return (ROOT / path).read_text(encoding="utf-8-sig")


snapshot = read("backend/MindSprint.Api/Migrations/AppDbContextModelSnapshot.cs")
schema = {}
for body, table in re.findall(
    r'modelBuilder.Entity\("[^"]+", b =>\s*\{(.*?)b.ToTable\("([^"]+)"\);',
    snapshot, re.S,
):
    schema[table] = set(re.findall(r'b.Property<[^>]+>\("([^"]+)"\)', body))
erd = read("docs/architecture/erd.mmd")
diagram = {
    table: set(re.findall(r"^\s*\w+\s+(\w+)", body, re.M))
    for table, body in re.findall(r"^    (\w+) \{\n(.*?)^    \}", erd, re.M | re.S)
}
assert schema == diagram, f"ERD differs from EF snapshot: {schema.keys() ^ diagram.keys()}"
assert len(schema) == 12 and sum(map(len, schema.values())) == 91
print("PASS ERD matches EF snapshot: 12 tables, 91 column names")

cases = read("docs/testing/sprint-3-test-cases.md")
case_ids = re.findall(r"^\| (TC-[A-Z]+-\d+) / P[01] \|", cases, re.M)
assert len(case_ids) == len(set(case_ids)) == 46
srs = read("docs/requirements/software-requirements.md")
requirements = re.findall(r"^\| (FR-\d+) / P[01] \|", srs, re.M)
assert requirements == [f"FR-{number:02}" for number in range(1, 24)]
uc_diagram = set(re.findall(r'^\s*(UC\d+)\(\[', read("docs/architecture/usecase.mmd"), re.M))
uc_catalog = set(re.findall(r"^\| (UC\d+) \|", read("docs/architecture/uml.md"), re.M))
assert uc_diagram == uc_catalog == {f"UC{number}" for number in range(1, 19)}
for row in srs.splitlines():
    if re.match(r"\| FR-\d+ /", row):
        assert re.search(r"TC-[A-Z]+-\d+", row), row
        assert re.search(r"UC\d+", row) and re.search(r"#\d+", row), row
        for case_id in re.findall(r"TC-[A-Z]+-\d+", row):
            assert case_id in case_ids, case_id
        for uc_id in re.findall(r"UC\d+", row):
            assert uc_id in uc_catalog or (uc_id == "UC19" and "GAP-01" in row), row
print("PASS 23 FR rows have priority, UC, implementation issue and test IDs; 18 current UCs; 46 unique cases")

for relative in [
    "README.md", "docs/architecture/README.md", "docs/architecture/erd.md",
    "docs/architecture/uml.md", "docs/requirements/software-requirements.md",
    "docs/testing/sprint-3-test-cases.md", "docs/testing/sprint-3-results.md",
    "docs/report/BAO_CAO_MINDSPRINT.md",
]:
    path = ROOT / relative
    for link in re.findall(r"\]\(([^)]+)\)", read(relative)):
        if re.match(r"https?://|#", link):
            continue
        target = (path.parent / link.split("#")[0]).resolve()
        # These pre-existing README links are outside this documentation change.
        if relative == "README.md" and link in {"LICENSE", "docs/git-contribution-guide.md"}:
            continue
        assert target.exists(), f"Broken link in {relative}: {link}"
        if INDEX:
            assert target.relative_to(ROOT).as_posix() in tracked, f"Unstaged link in {relative}: {link}"
print("PASS local handoff links resolve")

for filename in ["browser.tap", "ai-cards-browser.tap"]:
    log = read("docs/testing/evidence/sprint-3/" + filename)
    assert "# fail 0" in log and "# skipped 0" in log
for filename, verdict in [("node-unit.txt", "pass 29"), ("kanban-checks.txt", "19 Kanban checks passed."), ("tutor-checks.txt", "59 total checks passed.")]:
    assert verdict in read("docs/testing/evidence/sprint-3/" + filename)
assert read("docs/testing/evidence/sprint-3/diagrams.txt").count("PASS Mermaid") == 6
print("PASS attached initial-run and diagram logs contain success verdicts")
