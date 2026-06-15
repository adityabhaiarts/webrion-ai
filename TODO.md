# TODO - Webrion AI UI and Generation Hardening

## 1. Audit current app flow
- [x] Inspect routes, dashboard layout, generator page, code viewer, and API routes.
- [x] Confirm local environment variables exist without exposing secret values.
- [ ] Run TypeScript and production build checks.

## 2. Make generation reliable
- [ ] Harden `/api/generate` request validation and AI fallback errors.
- [ ] Make AI JSON parsing tolerant of fenced JSON, extra prose, and alternate file shapes.
- [ ] Confirm OpenAI/Gemini-backed generation returns usable website files.

## 3. Improve clean responsive UI
- [ ] Refresh generator into a cleaner ChatGPT-like workspace.
- [ ] Fix prompt suggestion contrast and mobile behavior.
- [ ] Polish generated code/preview viewer for desktop and mobile.
- [ ] Remove mojibake characters from visible UI.

## 4. Verify pages
- [ ] Check dashboard generator, auth pages, landing page, and generated preview path.
- [ ] Fix any lint/build issues found during verification.
