# NFR-02 load and resource checks

This harness follows the NFR-01/02 profile in `docs/architecture/non-functional-requirements.md`: 50 isolated accounts, 1,814 system cards, 500 owned cards and 100 tasks per account, 10 notebooks with 5 text sources of 5,000 characters each, 1 second think time, and the 35/25/20/10/10 route mix. It asserts response shape and per-account ownership; failures and timeouts count as errors.

## Isolated local setup

1. Run the API against a disposable PostgreSQL 17 database. The server must be isolated from user data and Gemini must use a placeholder key because the CRUD benchmark must not call a real provider. Finish the final API restart before preparing the fixture: startup runs `DataSeeder`, which removes synthetic system cards not present in the checked-in vocabulary seed.
2. Register exactly 50 test accounts and save their short-lived tokens under ignored `artifacts/issue43/<run-id>/tokens.json`:

   ```powershell
   $env:NFR02_RUN_ID = '20261104-local-01'
   node tests/Nfr02/prepare.mjs
   ```

3. After the API has started and all 50 accounts exist, replace `{{RUN_ID}}` in `tests/Nfr02/seed-fixture.sql` with that run ID and execute it against the disposable test database. It requires exactly 50 accounts, tops the system-card set up to 1,814, and verifies all fixture row counts. Do not restart the API after this step; if a restart is necessary, restore the missing synthetic system-card rows before running the load script.
4. Run the fake-provider check:

   ```powershell
   dotnet run --project tests/GeminiReliability/GeminiReliability.csproj -c Release
   ```

5. Run the full load profile:

   ```powershell
   node tests/Nfr02/load.mjs
   ```

   The runner performs a two minute warm-up at 20 VU, then three cycles of a two minute ramp from 20 to 50 VU, ten minutes at 50 VU, and five idle minutes. It records route-level p50/p95/p99, counts, unexpected failures, and cycle markers in ignored `artifacts/issue43/<run-id>/load-metrics.json`.
6. Sample API process and host/database resources every five seconds with `tests/Nfr02/monitor.ps1`. Record the API PID, sample CSV, baseline after warm-up, and the nearest sample after each idle window.

The renderer concurrency requirement still needs a successful browser runtime check. In the 2026-11-04 local run, the two-slot peak and cancellation of two requests passed, but the remaining eight render requests timed out; the checker then exited on an unhandled final assertion and Windows showed `0xe0434352`. This was the checker process, while the API health endpoint remained available. Do not count the `SemaphoreSlim(2, 2)` source setting alone as runtime evidence.

The private fixture uses only generated accounts and content. The load runner calls only flashcards/tasks/notebooks CRUD endpoints. Provider limits are tested with a fake HTTP handler; renderer limits use an in-process fake source handler and do not make outbound HTTP requests. Never point this harness at production or a shared staging database.
