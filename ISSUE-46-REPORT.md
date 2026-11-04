# Issue #46: NFR-05 Security Verification

## Result

Local security changes and isolated checks have been added. Public deployment URLs found in a legacy report were verified, but appear to be a live deployment rather than an isolated staging environment. This report does not mark the issue accepted: the deployed frontend currently fails the secret-artifact and AI-disclosure criteria, while the Production demo POST and deployed logs remain unverified. The local frontend also removes the unused legacy fixed-password login flow from source, not only from the build artifact. Backend and frontend tests pass locally. Changes are in this Git clone's uncommitted working tree; nothing has been committed, pushed, or deployed.

Assessment time: 2026-11-04 09:18:53 +07:00 (Asia/Saigon). Deployed image/commit were not recorded; no deployment was performed.

## Acceptance status

| Criterion | Status | Evidence / remaining work |
| --- | --- | --- |
| Demo endpoint and fixed demo credentials are unavailable in Production | Pass (isolated controller harness) | `SecurityChecks`: Production demo route returns 404 without account creation; fixed demo identity is rejected at regular login; Development demo still works. |
| Production JWT/CORS configuration fails startup when missing or unsafe | Pass (configuration harness) | `SecurityChecks`: missing DB/JWT/CORS, short/placeholder JWT, localhost DB, and HTTP CORS origin are rejected; valid HTTPS allowlist is accepted. |
| Frontend build excludes fixed demo password | Local source/artifact pass; deployed fail | Legacy source flow is removed and temporary artifact test passes, but public `GET /js/auth.js` still serves the fixed demo credential. Redeploy, then repeat the GET/scan. |
| AI privacy disclosure is visible | Local pass; deployed fail | Local source test passes; deployed `GET /notebook.js` lacks the Gemini disclosure. Redeploy and capture a browser screenshot. |
| JWT/refresh token and other-account source data are absent from AI prompts | Pass (mock-provider harness) | `TutorChecks` proves cross-account sources and request-header token sentinels are absent from the prompt. |
| HTTPS frontend/API and live CORS headers | Pass (public deployment check) | Frontend runtime config points to HTTPS API. Allowed Vercel Origin preflight returned `204` with matching CORS allow-origin; an untrusted Origin had no CORS allow headers. |
| Production Swagger | Pass (public deployment check) | `GET /swagger/index.html` returned `404`. |
| Production demo endpoint | Blocked | Did not POST to the live service because it is not confirmed as isolated staging and the endpoint can create an account/write to the database. |
| Deployed logs and response secret scan | Blocked | No hosting log access. |
| No secrets in newly produced frontend artifact | Local pass; deployed fail | Temporary artifact scan passes, but the live legacy JavaScript asset exposes the fixed demo credential. This is not a repository-history scan. |

## Local commands

```powershell
dotnet run --project backend/SecurityChecks/SecurityChecks.csproj
dotnet run --project backend/TutorChecks/TutorChecks.csproj
node --test tests/frontend-session.test.cjs tests/frontend-text.test.cjs tests/frontend-validation.test.cjs tests/nfr05-frontend.test.cjs
```

Results: `SecurityChecks` 15/15 passed; `TutorChecks` 60/60 passed; frontend tests 22/22 passed. .NET harnesses use SQLite in memory; TutorChecks uses a mocked provider. No check calls Gemini or alters production data. Deployment evidence must be collected separately with synthetic test accounts and redacted HAR/logs.

GitHub Actions run for commit `4bbdcae` initially failed because the `WeakAreaService` EF projection was missing `.ToListAsync()`. That call was restored in `3eda0a5`; Release build and backend harnesses then passed. Workflow run #86 passed the Release backend build and all seven backend-check jobs, but failed the browser job: `#nb-tutor-messages` did not meet its 750px expanded-height assertion. Browser measurements showed the privacy disclosure was auto-placed into a narrow composer grid column, making the composer about 294px tall; after placing it in its own full-width row, expanded reading height measured about 732px. A further CSS-only adjustment tightens expanded-mode gaps and composer vertical padding to satisfy the existing 750px reading-space contract. This final CSS adjustment has not yet been committed or verified by CI. Render deployment was skipped for run #86 and will depend on a passing workflow.

## Public deployment spot checks

At 2026-11-04 09:00:25 +07:00, the frontend at `https://mindsprint-ai-d-n-frontend.vercel.app` pointed to `https://mindsprint-api-zyur.onrender.com`. API `/healthz` returned `200`; Vercel Origin preflight received the expected allow-origin header; `https://untrusted.example` received none; `/swagger/index.html` returned `404`.

The deployed `/js/auth.js` asset returned `200` and contains the fixed demo credential; `/notebook.js` returned `200` but lacks the privacy disclosure. No credential is reproduced here. These findings indicate the local fixes have not been deployed. Do not invoke the live demo POST until isolated staging is available.