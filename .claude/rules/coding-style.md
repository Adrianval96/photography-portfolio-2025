# Coding Style Rules — Cinematic State Photography

## Component Structure
Every component MUST follow this exact pattern:
```
src/components/ComponentName/
  index.tsx   ← structure and logic only, no inline styles
  styles.css  ← all visual styling, plain CSS only
```

## CSS Rules
- **Always** write styles in `styles.css` — never inline styles, never CSS-in-JS, never Tailwind
- Plain CSS with string class names: `className="hero-headline"` — NOT CSS Modules syntax
- Global styles live in `src/app/(frontend)/globals.css`
- Never use `className={styles.something}` — class names are always plain strings

## Theme
- Background: `#0a0a0a` — dark throughout, never white or light grey on the main site
- CTA buttons: thin border style or plain underlined links — never solid filled buttons
- Aesthetic: minimal, cinematic, editorial — no decorative elements

## Images
- Always use Next.js `<Image>` component — never plain `<img>` tags
- Compress hero images to under 300kb before adding
- Use proper `width` and `height` props for Vercel image optimisation

## Fonts
- Geist Sans for all body and UI text (already loaded in layout.tsx)
- Geist Mono as accent/code font (already loaded)
- Do NOT introduce new font dependencies without asking

## TypeScript
- Strict mode is on — do not use `any` unless absolutely unavoidable
- Always type component props explicitly
- Payload-generated types live in `payload-types.ts` — use them, don't re-declare

## File Naming
- Components: PascalCase directory + index.tsx
- Utilities: camelCase
- API routes: Next.js App Router conventions (route.ts in appropriate folder)
- Never mix conventions within a directory

## Payload CMS
- Collections and globals are configured in `src/collections/` and `src/globals/`
- Always use `getPayload` from `@payloadcms/next/utilities` — never instantiate Payload directly
- After any schema change, generate types with `npx payload generate:types`
