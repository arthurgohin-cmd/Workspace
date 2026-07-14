---
name: frontend-design
description: Use whenever writing or editing frontend UI code — React/Vue/Svelte components, HTML/CSS, or a styled page/view — not just for one-off visual polish requests. Read it before choosing layout, typography, color, spacing, or component structure. Produces interfaces that feel like a deliberate product rather than a generic AI scaffold: a real visual hierarchy, a restrained and consistent style, and responsive/accessible markup by default. Triggers on "build a UI", "component", "page", "landing page", "form", "dashboard", "style this", "make it look better", "responsive", "dark mode", CSS/Tailwind/styled-components work, and React/Vue/Svelte view code.
---

# Frontend Design

Frontend work fails in two different ways: it's functionally broken, or it's functionally fine but looks like default-Bootstrap-meets-ChatGPT — centered card, purple gradient, generic sans-serif, no hierarchy, everything the same size. This skill is about avoiding the second failure. Correctness (state, data flow, tests) is not in scope here — that's ordinary engineering. This is about the 20% of decisions that make an interface look considered instead of generated.

## Before writing markup

Answer these in your own head first; they determine everything downstream:

1. **What is this, actually?** A marketing page reads differently than an internal admin tool than a data-dense dashboard. Don't default to the same card-with-shadow-and-rounded-corners look for all three.
2. **What does the user look at first?** Name it. Everything else is visually subordinate to it — smaller, lower-contrast, or just further away.
3. **Is there an existing design system?** Check for a theme file, Tailwind config, CSS variables, or component library already in the repo before inventing new colors, spacing, or components. Matching what's there beats introducing a second visual language.

If there's no existing system and this is a from-scratch page, treat the choices below as the system you're establishing — keep it small and reuse it exactly, don't restate variations of it per component.

## Hierarchy over decoration

The most common failure is flat design: every element the same weight, so nothing stands out and the user has to read everything to find anything.

- Pick **one** primary action or focal element per view. Make it visually unambiguous (size, weight, contrast, or position) — not through a louder color alone.
- Everything else gets demoted: secondary actions become plain buttons or links, tertiary info shrinks and mutes.
- Use a type scale with real jumps (e.g. 13 / 15 / 18 / 24 / 32), not five sizes that are all within 2px of each other. Body text is not the same size as a section label.
- Use whitespace to group related things and separate unrelated things — don't rely on borders/dividers as the only grouping signal. A border around everything is the same as a border around nothing.

## Color

- Constrain the palette: one neutral scale (backgrounds, borders, body text) plus one or two accent colors for actions/emphasis. Resist adding a new color per feature.
- Don't default to purple-to-blue gradients, glassmorphism, or neon-on-dark unless the product actually calls for that register — they read as "unstyled AI output" specifically because they're the default.
- Check contrast for real: body text vs. background should clear WCAG AA (4.5:1). Don't rely on eyeballing it, especially for muted/secondary text — that's where contrast quietly breaks first.
- Support both color schemes if the app has a theme toggle or the platform implies one (e.g. `prefers-color-scheme`). Define colors as tokens/variables, not hardcoded hex values scattered through components, so both themes stay in sync and future changes are a one-line edit.

## Layout and spacing

- Use a consistent spacing unit (4px or 8px base) and stick to a small set of multiples (4, 8, 12, 16, 24, 32, 48). Arbitrary one-off values (13px, 22px) are a sign of eyeballing instead of a system.
- Prefer flex/grid over manual positioning. Let content set intrinsic size; avoid fixed pixel widths/heights on containers that hold text or that need to work across viewports.
- Design mobile-first or at minimum verify the narrow viewport: what collapses, what stacks, what truncates. A layout that's only tested at 1440px wide is not done.
- Respect safe content widths — unconstrained line length (a paragraph spanning the full width of a wide screen) hurts readability; cap text containers with `max-width`.

## Motion and interactive states

- Every interactive element needs a hover, focus, active, and disabled state — not just the default. Missing focus states are both a visual gap and an accessibility bug.
- Keep transitions short (120–200ms) and use them for state changes (hover, open/close, appear), not as decoration on every element. Motion should clarify what changed, not perform.
- Don't animate on page load by default (fade-ins, staggered reveals) unless asked — it adds latency to perceived usefulness and rarely earns its cost.

## Accessibility (do this by default, not on request)

- Semantic HTML first: `<button>` for actions, `<a>` for navigation, real heading levels in order, `<label>` tied to inputs. Don't reach for `<div onClick>` when a native element does the job with the right behavior for free (focus, keyboard, screen readers).
- Every image needs `alt`; every icon-only button needs an accessible name (`aria-label` or visually-hidden text).
- Keyboard: everything clickable should be reachable and operable via keyboard (tab order, Enter/Space activation) without extra work.
- Don't encode meaning in color alone (error states, required fields, status) — pair color with an icon, label, or text.

## Process

1. Identify the page/component type and the one primary focus (see "Before writing markup").
2. Check the repo for an existing design system (theme/tokens/component library) and reuse it; only introduce new tokens if none exist.
3. Build the structure with semantic HTML and layout primitives (flex/grid) before adding visual styling.
4. Apply the type scale, spacing scale, and constrained palette from above.
5. Add interactive states and verify keyboard operability.
6. Check the result at a narrow viewport and, if the app has theming, in both color schemes.
7. If you can run the app, actually look at the rendered result (browser or screenshot) before calling it done — don't rely on reading the JSX/CSS alone to judge whether it looks right.
