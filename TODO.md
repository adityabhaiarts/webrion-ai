# TODO - Webrion AI Fixes & Redesign

## Step 1: Inspect + fix AI security/route contract
- [x] Inspect existing `/api/generate` and generator UI
- [ ] Ensure server route returns `{ success: true, result: string }`
- [ ] Ensure OpenRouter request happens only on server
- [ ] Map OpenRouter errors to UI-friendly messages


## Step 2: Fix Firebase null/auth runtime errors
- [ ] Guard `onAuthStateChanged` usage when Firebase auth is not initialized
- [ ] Ensure missing Firebase env vars never crash the app (show setup notice)

## Step 3: Update AI Generator UI error handling + premium polish (core page)
- [ ] Improve prompt validation + empty prompt errors
- [ ] Ensure loading/disabled/copy/download states work
- [ ] Make Generator page match premium dark/green glass style

## Step 4: Premium UI redesign across app
- [ ] Landing page premium hero + CTA
- [ ] Login/Signup premium dark glass UI with setup fallback
- [ ] DashboardLayout dark/green glass sidebar + mobile responsiveness

## Step 5: Env files + build quality checks
- [ ] Update `.env.example` with required variables (OpenRouter + Firebase if used)
- [ ] Run `npm run build` and fix all errors
- [ ] Run lint/typecheck if available
- [ ] Smoke-test `/api/generate` contract locally

