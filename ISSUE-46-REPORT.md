# Issue #46: NFR-05 Security Verification

## Result

Issue #46 changes have been pushed to `main`. GitHub Actions run #87 for `83d8ed9` succeeded, including Release backend build, all 7 backend-check jobs, and frontend/browser tests. This report does not mark the issue accepted: Render deployment was skipped because deployment credentials are missing, and Vercel is still serving stale assets that fail the secret-artifact and AI-disclosure criteria. The live Production demo POST and deployed logs remain unverified.

Assessment time: 2026-11-04 12:41:52 +07:00 (Asia/Saigon). Git commit: `83d8ed97930e08360e2697f016bd5f19ef7ba998`. No deployed image/commit was verified.

## Acceptance status

| Criterion | Status | Evidence / remaining work |
| --- | --- | --- |
| Demo endpoint and fixed demo credentials are unavailable in Production | Pass (isolated controller harness) | `SecurityChecks`: Production demo route returns 404 without account creation; fixed demo identity is rejected at regular login; Development demo still works. |
| Production JWT/CORS configuration fails startup when missing or unsafe | Pass (configuration harness) | `SecurityChecks`: missing DB/JWT/CORS, short/placeholder JWT, localhost DB, and HTTP CORS origin are rejected; valid HTTPS allowlist is accepted. |
| Frontend build excludes fixed demo password | Local source/artifact pass; deployed fail | Legacy source flow is removed and temporary artifact test passes, but cache-busted public `GET /js/auth.js` still has the fixed demo credential/handler pattern. Deploy the Vercel frontend, then repeat the GET/scan. |
| AI privacy disclosure is visible | Local and CI pass; deployed fail | Local source/test and CI browser job pass; cache-busted deployed `GET /notebook.js` still lacks the Gemini disclosure. Deploy Vercel and capture a browser screenshot. |
| JWT/refresh token and other-account source data are absent from AI prompts | Pass (mock-provider harness) | `TutorChecks` proves cross-account sources and request-header token sentinels are absent from the prompt. |
| HTTPS frontend/API and live CORS headers | Pass (public deployment check) | Frontend runtime config points to HTTPS API. Allowed Vercel Origin preflight returned `204` with matching CORS allow-origin; an untrusted Origin had no CORS allow headers. |
| Production Swagger | Pass (public deployment check) | `GET /swagger/index.html` returned `404`. |
| Production demo endpoint | Blocked | Did not POST to live production because it is not confirmed as isolated staging and could write to the database. The isolated Production controller harness passes. |
| Deployed logs and response secret scan | Blocked | No hosting log access. |
| No secrets in newly produced frontend artifact | Local pass; deployed fail | Temporary artifact scan passes, but the live legacy JavaScript asset exposes the fixed demo credential. This is not a repository-history scan. |

## Local commands

```powershell
dotnet run --project backend/SecurityChecks/SecurityChecks.csproj
dotnet run --project backend/TutorChecks/TutorChecks.csproj
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs tests/frontend-validation.test.cjs tests/nfr05-frontend.test.cjs
```

Results: `SecurityChecks` 15/15 passed; `TutorChecks` 60/60 passed; frontend tests 22/22 passed. .NET harnesses use SQLite in memory; TutorChecks uses a mocked provider. No check calls Gemini or alters production data. Deployment evidence must be collected separately with synthetic test accounts and redacted HAR/logs.

GitHub Actions run #85 for `4bbdcae` failed compilation because `WeakAreaService` was missing `.ToListAsync()`. Commit `3eda0a5` fixed this. Run #86 passed backend build and all 7 backend checks but its browser test failed the expanded-height assertion. Measurement showed the disclosure made the composer too tall; commit `83d8ed9` gives it a full-width row and tightens expanded-mode spacing. Run #87 then succeeded: Release build, all backend checks, and frontend/browser tests passed. Its Render job completed successfully but skipped the trigger step and ran “Report missing deployment credentials”; configure `RENDER_SERVICE_ID` and `RENDER_API_KEY` in GitHub Actions secrets to enable backend deployment. Vercel's cache-busted frontend assets still show the old release; a Vercel deployment is also required.

## Public deployment spot checks

At 2026-11-04 09:00:25 +07:00, the frontend at `https://mindsprint-ai-d-n-frontend.vercel.app` pointed to `https://mindsprint-api-zyur.onrender.com`. API `/healthz` returned `200`; Vercel Origin preflight received the expected allow-origin header; `https://untrusted.example` received none; `/swagger/index.html` returned `404`. After run #87, `/healthz` again returned `{"status":"ok"}`.

At 2026-11-04 12:41:52 +07:00, cache-busted public requests still returned the fixed-demo pattern/handler in `/js/auth.js` and no Gemini disclosure in `/notebook.js`. No credential is reproduced here. Do not invoke the live demo POST until isolated staging is available.