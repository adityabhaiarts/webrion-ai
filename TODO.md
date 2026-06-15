# TODO - Webrion AI UI and Generation Hardening

## 1. Audit current app flow
- [x] Inspect routes, dashboard layout, generator page, code viewer, and API routes.
- [x] Confirm local environment variables exist without exposing secret values.
- [x] Run TypeScript and production build checks.

## 2. Make generation reliable
- [x] Harden `/api/generate` request validation and AI fallback errors.
- [x] Make AI JSON parsing tolerant of fenced JSON, extra prose, and alternate file shapes.
- [ ] Confirm OpenAI/Gemini-backed generation returns usable website files. Blocked by provider responses during smoke test: OpenAI 429 insufficient quota, Gemini 503 high demand.

## 3. Improve clean responsive UI
- [x] Refresh generator into a cleaner ChatGPT-like workspace.
- [x] Fix prompt suggestion contrast and mobile behavior.
- [x] Polish generated code/preview viewer for desktop and mobile.
- [x] Remove mojibake characters from visible UI.

## 4. Verify pages
- [x] Check dashboard generator, auth pages, landing page, and generated preview path.
- [x] Fix any lint/build issues found during verification.
