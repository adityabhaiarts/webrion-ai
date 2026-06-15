# Webrion AI Premium Upgrade - Implementation Checklist

## UI/UX Premium Redesign (glassmorphism SaaS)
- [x] Update `src/components/DashboardLayout.tsx`
  - [x] Glass sidebar on desktop
  - [x] Mobile bottom navigation
  - [x] Remove/replace Gemini wording in sidebar
  - [x] Ensure no mobile horizontal overflow
- [x] Update `src/pages/Landing.tsx`
  - [x] Glass/premium visual polish
  - [x] Remove Gemini wording from marketing copy
- [x] Update `src/pages/Login.tsx`
  - [x] Glass/premium visual polish
  - [x] Remove Gemini wording
- [x] Update `src/pages/Signup.tsx`
  - [x] Glass/premium visual polish
  - [x] Remove Gemini wording


## Dashboard restyles (next phase)
- [ ] `src/pages/dashboard/Generator.tsx`
- [ ] `src/pages/dashboard/Templates.tsx`
- [ ] `src/pages/dashboard/Websites.tsx`
- [ ] `src/pages/dashboard/Chats.tsx`
- [ ] `src/pages/dashboard/Settings.tsx`
- [ ] `src/pages/dashboard/Pricing.tsx`
- [ ] `src/pages/Pricing.tsx`

## Animations / polish
- [ ] Tailwind transitions + shimmer/loading polish
- [ ] Consistent glass cards/gradient glows
- [ ] Responsive audit

## Verification
- [ ] `npm run build` (or `npm run dev`) and validate flows
- [ ] Ensure no frontend references OpenAI/Gemini/OpenRouter keys

