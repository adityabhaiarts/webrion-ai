# Webrion AI Deploy Checklist

## Vercel Build Settings
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Required Vercel Environment Variables

### Firebase frontend variables
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

### AI server variables
```
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

### Razorpay variables
```
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
VITE_RAZORPAY_KEY_ID=...
```

## Firebase Auth
Firebase Console → Authentication → Settings → Authorized domains:
```
ai.webrion.online
ai-webrion-git-main-adityabhaiarts-projects.vercel.app
```

## Firestore
Enable Firestore Database in Firebase. If you see `client is offline`, check that Firestore exists, rules are published, and the env project ID matches the Firebase project.

## After upload
Redeploy without build cache in Vercel.
