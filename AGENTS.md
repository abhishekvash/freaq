## Project

**Freaq** — a weekly hidden-brief music challenge platform for music producers. The product is currently at the starter stage: a Nuxt 4 scaffold plus two long-form brand documents that govern all design decisions.

The "what" of the product lives in `PRODUCT.md`; the "how it should look and feel" lives in `DESIGN.md`. Both are authoritative — read them before building any UI.

## Stack & commands

- **Nuxt 4** (Vue 3, Vue Router 5) with TypeScript, managed by **pnpm 11** (declared in `packageManager`). Use `pnpm`, not npm/yarn.
- Dev: `pnpm dev` (http://localhost:3000)
- Build: `pnpm build` · Preview prod build: `pnpm preview` · Static generate: `pnpm generate`
- `pnpm install` triggers `nuxt prepare` (postinstall), which regenerates `.nuxt/` type references that `tsconfig.json` points at. If TS types look broken, run `pnpm install` or `nuxt prepare` to rebuild them.
- No test runner, linter, or formatter is configured yet. Don't claim "tests pass" — there are none. If you add tooling, wire it into `package.json` scripts.

Use the `nuxt-freaq` skill as the Nuxt router/entrypoint for tasks in this repository.

## Repo layout

Nuxt 4 uses `app/` (not `src/`) as the source root — this is the v4 default and is why `app/app.vue` is the entry. Add `pages/`, `components/`, `composables/`, `layouts/`, etc. **inside `app/`**, not at the repo root. `public/` stays at the repo root (static assets served as-is). Configuration is `nuxt.config.ts`; `.nuxt/` and `.output/` are generated and gitignored.

## UI styling

- Tailwind v4 is wired through `@tailwindcss/vite` in `nuxt.config.ts`; do not add PostCSS Tailwind plumbing.
- The token system lives in `app/assets/css/tailwind.css`. Keep that file focused on `@theme` tokens, theme variable aliases, and base rules.
- Build UI with Tailwind classes and existing design tokens. Do not add separate CSS files or ad hoc global CSS for ordinary view styling.
- Put component styling in Vue components with Tailwind class tags. Reusable UI primitives such as buttons, readouts, marks, panels, and form controls should be Vue components in `app/components/`, not global `@utility` classes.
- Do not use hardcoded one-off values in Tailwind classes unless the existing token scale cannot express the design and you have first checked `app/assets/css/tailwind.css`.
- If custom CSS is unavoidable for a one-off view/component, first try creating a class with @apply and tailwind tokens and then resort to vanilla CSS. Put it in a scoped `<style scoped>` block inside that Vue file. Shared CSS belongs in `app/assets/css/tailwind.css` only when it is truly a reusable token, theme value, or base rule.
- When stacking context is involved, use `isolate` on the parent. Do not use runaway z-index values.
- If you truly need to resort to CSS over tailwind classes directly,

### Adding a new design token

When a new token is truly needed, make it available as a first-class Tailwind utility:

1. Add the raw token or alias in `app/assets/css/tailwind.css` under `@theme`, following the existing naming pattern:
    ```css
    --color-my-token: #abc123;
    ```
2. Use the generated utility (`bg-my-token`, `text-my-token`, `border-my-token`, etc.) instead of interpolation syntax like `bg-[--my-token]` or raw hex values.

## Conventions

- Always use types and not interfaces in TS
- Always use undefined over null
