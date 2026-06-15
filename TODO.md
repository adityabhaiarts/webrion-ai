# TODO - Fix auth redirect + improve AI API failures

## Step 1
- [x] Update `src/lib/ai.ts` to improve provider error handling (clear provider + model + likely cause) and ensure failures are returned cleanly.

## Step 2
- [x] Update `api/generate.ts` to return consistent error shape (and include `hint` when keys are missing).

## Step 3
- [ ] Verify production SPA routing for `ai.webrion.online`: ensure all non-`/api/*` routes rewrite to `index.html` (check/update `vercel.json`).


## Step 4
- [ ] Verify auth guard works on deep links: `/dashboard/*` should redirect to `/login` when logged out.

## Step 5
- [ ] Build/test locally: `npm run build` (and run dev server if available).

