"""
MindSprint AI — Standalone Automated Test Runner & Executive Dashboard
Executes all 4 Tiers of the Test Suite programmatically, verifies 100% pass rate,
and generates an executive visual report. Exits with 0 on success, 1 on failure.
"""

import sys
import os
import time
import json
from pathlib import Path
import pytest

# Ensure project directories are in sys.path
PROJECT_ROOT = Path(__file__).resolve().parent
BACKEND_DIR = PROJECT_ROOT / "backend"
APP_DIR = BACKEND_DIR / "app"

for p in [str(PROJECT_ROOT), str(BACKEND_DIR), str(APP_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)


class TierResultCollector:
    """Pytest plugin to intercept test results and group them by Tier."""
    def __init__(self):
        self.tiers = {
            "Tier 1: Feature Coverage (Happy Path)": {"passed": 0, "failed": 0, "skipped": 0, "total": 0, "tests": []},
            "Tier 2: Boundary & Corner Cases": {"passed": 0, "failed": 0, "skipped": 0, "total": 0, "tests": []},
            "Tier 3: Cross-Feature Combinations": {"passed": 0, "failed": 0, "skipped": 0, "total": 0, "tests": []},
            "Tier 4: Real-World Workload Scenarios": {"passed": 0, "failed": 0, "skipped": 0, "total": 0, "tests": []},
        }
        self.failures = []

    def pytest_runtest_logreport(self, report):
        if report.when == "call":
            nodeid = report.nodeid
            if "test_tier1" in nodeid:
                tier_name = "Tier 1: Feature Coverage (Happy Path)"
            elif "test_tier2" in nodeid:
                tier_name = "Tier 2: Boundary & Corner Cases"
            elif "test_tier3" in nodeid:
                tier_name = "Tier 3: Cross-Feature Combinations"
            elif "test_tier4" in nodeid:
                tier_name = "Tier 4: Real-World Workload Scenarios"
            else:
                tier_name = "Tier 1: Feature Coverage (Happy Path)"

            test_name = nodeid.split("::")[-1]
            self.tiers[tier_name]["total"] += 1
            if report.passed:
                self.tiers[tier_name]["passed"] += 1
                self.tiers[tier_name]["tests"].append({"name": test_name, "status": "PASSED"})
            elif report.failed:
                self.tiers[tier_name]["failed"] += 1
                self.tiers[tier_name]["tests"].append({"name": test_name, "status": "FAILED"})
                self.failures.append((nodeid, str(report.longrepr)))
            elif report.skipped:
                self.tiers[tier_name]["skipped"] += 1
                self.tiers[tier_name]["tests"].append({"name": test_name, "status": "SKIPPED"})


def main():
    print("=" * 80)
    print("        MINDSPRINT AI — 4-TIER AUTOMATED TEST SUITE & QA RUNNER")
    print("=" * 80)
    print(" Workspace :", str(PROJECT_ROOT))
    print(" Target    : 100% Pass Rate across 9 REST Endpoints + AI & Stats Extensions")
    print("=" * 80)
    print()

    start_time = time.time()
    collector = TierResultCollector()

    pytest_args = [
        "-v",
        "--tb=short",
        str(PROJECT_ROOT / "tests")
    ]

    exit_code = pytest.main(pytest_args, plugins=[collector])
    duration = time.time() - start_time

    total_passed = sum(t["passed"] for t in collector.tiers.values())
    total_failed = sum(t["failed"] for t in collector.tiers.values())
    total_skipped = sum(t["skipped"] for t in collector.tiers.values())
    total_tests = sum(t["total"] for t in collector.tiers.values())

    print("\n" + "=" * 80)
    print("                     EXECUTIVE QA SCOREBOARD")
    print("=" * 80)

    for tier_name, data in collector.tiers.items():
        if data["total"] > 0 and data["failed"] == 0:
            status_badge = "[ PASS ]"
        elif data["failed"] > 0:
            status_badge = "[ FAIL ]"
        else:
            status_badge = "[ NONE ]"
        print(f" {status_badge}  {tier_name:<45} {data['passed']}/{data['total']} passed")

    print("-" * 80)
    pass_rate = (total_passed / total_tests * 100.0) if total_tests > 0 else 0.0

    print(f" Total Tests Executed : {total_tests}")
    print(f" Total Tests Passed   : {total_passed}")
    print(f" Total Tests Failed   : {total_failed}")
    if total_skipped > 0:
        print(f" Total Tests Skipped  : {total_skipped}")
    print(f" Overall Pass Rate    : {pass_rate:.1f}%")
    print(f" Execution Duration   : {duration:.2f} seconds")
    print("=" * 80)

    # Save test results JSON artifact
    results_payload = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_tests": total_tests,
        "total_passed": total_passed,
        "total_failed": total_failed,
        "total_skipped": total_skipped,
        "pass_rate": pass_rate,
        "duration_seconds": round(duration, 2),
        "tiers": collector.tiers,
        "failures": [{"nodeid": f[0], "error": f[1]} for f in collector.failures]
    }
    results_path = PROJECT_ROOT / "test_results.json"
    try:
        with open(results_path, "w", encoding="utf-8") as f:
            json.dump(results_payload, f, indent=2)
        print(f" Executive Test Report saved to: {results_path.name}")
    except Exception as e:
        print(f" Warning: Could not save test_results.json: {e}")

    if total_failed == 0 and total_tests > 0 and pass_rate == 100.0:
        print("\n" + "*" * 80)
        print("    SUCCESS: ALL TESTS PASSED! 100% PASS RATE VERIFIED AND CONFIRMED!")
        print("*" * 80 + "\n")
        sys.exit(0)
    else:
        print("\n" + "!" * 80)
        print(f"    FAILURE: {total_failed} TEST(S) FAILED! 100% PASS RATE NOT ACHIEVED.")
        print("!" * 80)
        for nodeid, err in collector.failures:
            print(f"\n[FAILURE DETAILS] {nodeid}:\n{err}")
        sys.exit(1)


if __name__ == "__main__":
    main()
