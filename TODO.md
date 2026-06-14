# TODO - Auth & Firebase Fixes

## Step 1: Implement Firebase env-based configuration
- Update `src/lib/firebase.ts` to use `import.meta.env` Firebase config.
- Remove dependency on `firebase-applet-config.json` for client init.

## Step 2: Fix duplicate email signup handling
- Update `src/pages/Signup.tsx` to catch `auth/email-already-in-use`.
- Show inline error message (no toast).

## Step 3: Fix login provider mismatch (Google vs password)
- Update `src/pages/Login.tsx` to catch relevant Firebase auth errors.
- If user exists with different credential/provider, show a message to use Google.

## Step 4: Build & quick manual test
- Run `npm run lint` (tsc) and `npm run build`.
- Manually test:
  - Google signup/login
  - Password signup/login for new email
  - Password login for Google-created email
  - Duplicate signup same email

