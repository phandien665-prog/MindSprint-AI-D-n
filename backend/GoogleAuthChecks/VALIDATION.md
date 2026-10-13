# Google sign-in validation — 2026-10-06

Branch: `frontend-redesign`.

- Baseline before implementation: `node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs` — **16/16 pass**.
- Final Node run, including `backend/GoogleAuthChecks/frontend-google.test.cjs` — **22/22 pass** (16 baseline + 6 Google session checks).
- Backend checks with `-- --live-keys` — **34/34 pass**. SQLite in memory; no real users inserted or linked.
- Real Google validator rejects malformed, wrong audience, wrong issuer, expired and RSA-forged credentials. Forged signature check downloaded Google's actual public keys; no real Google account or OAuth client needed.
- Browser checks: **11 scenarios pass**, desktop 1440×1000 and mobile 375×812, with mocked GIS SDK/API. Covers missing config, official render options, callback after changing mode/closing, session exchange, password linking, wrong password, overflow, invalid credentials, SDK failure/retry, email and Demo. No JavaScript exceptions. Screenshots visually inspected.
- `dotnet build` — **0 warnings, 0 errors**. JS syntax checks and `git diff --check` pass.
- Actual server restarted on 5000/5100; new migration added nullable GoogleSubject and its unique index successfully.
- Actual HTTP checks: Google config reports `enabled: false` on both ports; foreign origin rejected with 403; unissued nonce rejected with 401.
- Protected files (`tests/`, `pytest.ini`, `requirements.txt`, server/test launchers, `standalone.html`, `frontend/js/`, vocabulary and KaTeX vendor files) unchanged.
- Private `appsettings.json` preserved byte-for-byte during this task.

## Real Client ID configured — 2026-10-06

The user supplied a Web Client ID. It is now stored in the ignored local
`MindSprint.Api/appsettings.Development.json`; the private base appsettings file
remains byte-for-byte unchanged. The backend was restarted and reports
`enabled: true` with the supplied ID on both ports. An allowed-origin request
obtains a valid 64-character nonce with a 300-second lifetime.

Browser verification used the **real** GIS SDK/API: the script and stylesheet
returned 200, the official Google button appeared, and clicking it opened
Google Accounts at `/v3/signin/identifier` without an OAuth error page.
The button iframe returned 403 at both local origins; the actual SDK console
message confirmed: `The given origin is not allowed for the given client ID.`
The user needs to add `http://localhost:5500` and `http://127.0.0.1:5500` to
Authorized JavaScript origins in the Google Cloud Web Client settings.
No Google credentials were entered and no real Google account was signed in.
End-to-end account sign-in remains unverified until the provider settings are
updated and the user completes sign-in. Follow [setup instructions](../GOOGLE_SIGN_IN.md).

The nonce store and rate limiter currently run in one backend process. Multiple
instances require a shared atomic nonce store and shared rate limiting. When
deploying behind a reverse proxy, configure trusted forwarded headers so the IP
limit applies to the intended client IP, rather than the proxy's address.
