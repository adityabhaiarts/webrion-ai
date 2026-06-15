# Webrion AI Premium Upgrade - Implementation TODO

## Security (OpenRouter-only keys)
- [x] Update `src/lib/ai.ts` to remove OpenAI/Gemini clients and implement OpenRouter-only generation + chat via backend/server env var `OPENROUTER_API_KEY`.
- [x] Update `api/generate.ts` and `api/chat.ts` responses/errors to reflect OpenRouter-only.

- [x] Update `server.ts` health/log endpoints to remove Gemini/OpenAI env checks.


- [ ] Ensure no frontend code references OpenRouter/OpenAI/Gemini keys.


## UI/UX Premium Redesign (glassmorphism SaaS)
- [ ] Redesign `src/components/DashboardLayout.tsx` to match premium left icon sidebar + mobile bottom navigation.
- [ ] Update `src/pages/Landing.tsx`, `src/pages/Login.tsx`, `src/pages/Signup.tsx` to match premium onboarding/auth UI.
- [ ] Restyle `src/pages/dashboard/Generator.tsx` (prompt card glow/focus, tabs, device toggle, suggestion chips, improved chat/code output polish).
- [ ] Restyle `src/pages/dashboard/Templates.tsx` into a premium template gallery with categories and polished cards.
- [ ] Restyle `src/pages/dashboard/Websites.tsx` into horizontal-scroll project cards for desktop + swipe on mobile.
- [ ] Restyle `src/pages/dashboard/Chats.tsx` into premium saved chats list.
- [ ] Restyle `src/pages/dashboard/Settings.tsx` into premium settings cards.
- [ ] Restyle `src/pages/dashboard/Pricing.tsx` and `src/pages/Pricing.tsx` into modern pricing UI with 3 tiers.

## Animations / polish
- [ ] Add subtle Tailwind transitions + shimmer/loading polish (use Framer Motion only if already installed).
- [ ] Add consistent glass cards + gradient glows across pages.
- [ ] Ensure all pages are responsive (no mobile horizontal overflow).

## Verification
- [ ] Run `npm test` / `npm run build` (or `npm run dev`) and validate main flows: auth -> generator -> generation -> copy/download; templates -> generator; settings; logout.

