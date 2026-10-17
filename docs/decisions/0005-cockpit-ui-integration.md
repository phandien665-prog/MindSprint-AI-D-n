# 0005 — Integrate Study Cockpit with the functional frontend

Status: accepted

The Study Cockpit import (`966ffc6`, branch `codex/mindsprint-source-import`)
introduced a cream/lime visual design alongside a separate client using sample
study data. Its merge into main was reverted by `a5948d1`. Merging that ancestor
again cannot restore its changes.

Apply its visual direction and brand asset to the established functional
frontend instead. `cockpit.css` supplies the skin; `cockpit.js` supplies the
profile, daily checklist and mobile navigation while delegating feature actions
to the existing navigation and shared authentication. Checklist state is local,
scoped to account and day; learning data continues through the existing API.
The adapter was recovered from the local integration backup and adapted to load
as a standalone browser script with relative asset URLs.

Keep the existing HTML entry point, frontend build/deployment, Vietnamese voice
controls, ASP.NET Core backend, PostgreSQL and migrations. Do not reintroduce the
sample study client, its Node/Vite runtime or pet dependencies. The login modal
uses email/Google instead of offering the shared demo account. Bump the PWA cache
and precache the new assets so returning users receive the integrated UI.

Verify the existing frontend checks plus browser coverage for profile login,
account-scoped checklist state, feature navigation and mobile drawer behavior.
Browser API/speech fixtures do not establish that the local PostgreSQL or Google
OAuth account is configured; those require their own environment checks.

Validation on 2026-10-17: frontend build passed; the existing frontend suites and
new Cockpit browser check had 52 passes and one PostgreSQL integration check
skipped. The drawer test reproduced and caught interference from desktop focus
mode before the fix. A temporary mutation sharing checklist state across users
was rejected by the account-isolation test. The live guest page at port 5500
loaded the brand and profile without uncaught JavaScript errors.
