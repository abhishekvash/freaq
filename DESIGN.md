---
name: Freaq
description: Weekly sealed-seed music ritual identity for bedroom producers.
colors:
  primary: "#F04436"
  bg-dark: "#080909"
  surface-dark: "#111313"
  raised-dark: "#181B1B"
  line-dark: "#303434"
  text-dark: "#E8E2D8"
  muted-dark: "#AFA89D"
  dim-dark: "#77736B"
  accent-dark: "#F04436"
  accent-deep-dark: "#9F1F18"
  success-dark: "#57B77A"
  warning-dark: "#D6A84A"
  danger-dark: "#F04436"
  focus-dark: "#FF6A5E"
  bg-light: "#F3F0EA"
  surface-light: "#E7E2D8"
  raised-light: "#FAF7F1"
  line-light: "#C9C1B5"
  text-light: "#151615"
  muted-light: "#4F4A43"
  dim-light: "#736C63"
  accent-light: "#C92F24"
  accent-deep-light: "#7E1D17"
  success-light: "#257A48"
  warning-light: "#906515"
  danger-light: "#B72A20"
  focus-light: "#D93A2E"
typography:
  display:
    fontFamily: "Bai Jamjuree, system-ui, sans-serif"
    fontSize: "128px"
    fontWeight: 700
    lineHeight: 0.72
    letterSpacing: "0px"
  headline:
    fontFamily: "Bai Jamjuree, system-ui, sans-serif"
    fontSize: "72px"
    fontWeight: 700
    lineHeight: 0.9
    letterSpacing: "0px"
  title:
    fontFamily: "Bai Jamjuree, system-ui, sans-serif"
    fontSize: "42px"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0px"
  body:
    fontFamily: "Bai Jamjuree, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "0px"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "28px"
  pill: "999px"
spacing:
  tick: "4px"
  inline: "8px"
  field: "16px"
  panel: "32px"
  section: "64px"
  hero: "128px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.bg-dark}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
    typography: "{typography.label}"
  instrument-panel:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.lg}"
    padding: "28px"
  timer-readout:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.accent-dark}"
    typography: "{typography.label}"
  state-success:
    backgroundColor: "{colors.success-dark}"
    textColor: "{colors.bg-dark}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    typography: "{typography.label}"
  state-warning:
    backgroundColor: "{colors.warning-dark}"
    textColor: "{colors.bg-dark}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    typography: "{typography.label}"
  state-danger:
    backgroundColor: "{colors.danger-dark}"
    textColor: "{colors.bg-dark}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    typography: "{typography.label}"
  focus-indicator:
    backgroundColor: "{colors.focus-dark}"
    textColor: "{colors.bg-dark}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
    typography: "{typography.label}"
---

# Design System: Freaq

## 1. Overview

**Creative North Star: "Redline Instrument"**

Freaq should feel like a calibrated audio instrument under creative pressure. It is dark-first, exact, and tense, but not sterile. The human side comes through in the premise: one sealed seed, one hour, one bounce, and a circle waiting to hear the result.

The active visual expression can move between hardware panel, sci-fi instrument, waveform lab, zine mark, or scope readout. The core identity is locked in the typography and colors below.

**Key Characteristics:**

- Dark, tinted-near-black source theme.
- One red accent used as signal, clipping, arming, timer heat, and consequence.
- Geometric but human typography.
- Mono readouts used sparingly for operational metadata.
- No generic music-platform gloss, no SaaS gradient polish, no stock illustration.

## 2. Colors

The palette is a restrained redline system: warm near-black neutrals, bone text, and one peaking red accent.

### Primary

- **Peak Red** (`#F04436` dark, `#C92F24` light): Use for Start, primary CTA, live timer, clipping indicators, armed states, and irreversible actions.
- **Deep Peak Red** (`#9F1F18` dark, `#7E1D17` light): Use for pressed states and deeper red fills.

### Secondary

- **Accepted Green** (`#57B77A` dark, `#257A48` light): Use for submitted, eligible, accepted, and successful upload states.
- **Deadline Amber** (`#D6A84A` dark, `#906515` light): Use for low-time warnings and deadline pressure.

### Neutral

- **Instrument Black** (`#080909` dark, `#F3F0EA` light): Page and app shell background.
- **Panel Black** (`#111313` dark, `#E7E2D8` light): Nav, panels, and modal bases.
- **Raised Graphite** (`#181B1B` dark, `#FAF7F1` light): Cards, inputs, and elevated modules.
- **Hairline Graphite** (`#303434` dark, `#C9C1B5` light): Borders, dividers, and module seams.
- **Bone Text** (`#E8E2D8` dark, `#151615` light): Primary text.
- **Muted Bone** (`#AFA89D` dark, `#4F4A43` light): Secondary copy and captions.

### Named Rules

**The Red Is Signal Rule.** Red has two jobs depending on the surface, and the rule splits accordingly. Freaq's single-red palette is the identity; do not introduce a second chromatic to "balance" it.

- **Inside the running ritual** (timer, brief, bounce, submit, vote, and any live ritual screen): red stays disciplined and rare. Reserve it for `ARMED`, `LIVE`, peak, clipping, timer heat, and irreversible action. The live timer has to win every collision; nothing else gets to compete with it for redness.
- **On brand and marketing surfaces** (landing, manifesto, archive, about, long-form): red is the brand's typographic accent and identity color. It is free to land on charged headline accents, thesis or punchline phrases, brand marks, and primary CTAs. Maximum one thesis/punchline red phrase per section, so each instance stays declarative rather than decorative.

In both modes, never use red on body copy, ordinary borders, or as a general section fill.

**The Dark Is Source Rule.** Dark mode is the source of truth. Light mode is a portability layer, not a separate brand.

## 3. Typography

**Display Font:** Bai Jamjuree, with `system-ui, sans-serif` fallback  
**Body Font:** Bai Jamjuree, with `system-ui, sans-serif` fallback  
**Label/Mono Font:** JetBrains Mono, with `ui-monospace, SFMono-Regular, monospace` fallback

**Character:** Bai Jamjuree gives Freaq engineered geometry without sterile enterprise polish. JetBrains Mono supplies stable timer and metadata readouts without turning the whole product into terminal cosplay.

Recommended import:

```css
@import url("https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700;800&display=swap");
```

### Hierarchy

- **Display** (700, `clamp(5.6rem, 22vw, 18rem)`, `0.72`): Use for the Freaq wordmark and highest-impact hero moments.
- **Headline** (700, `clamp(2.8rem, 7vw, 7.4rem)`, `0.9`): Use for page and section headings.
- **Title** (700, `clamp(2rem, 5vw, 4.8rem)`, `0.95`): Use for major panels and screen titles.
- **Body** (400, `16px`, `1.62`): Use for prose and UI explanations. Keep line length between 65 and 75 characters.
- **Label** (500, `12px`, `1.4`): Use for seed IDs, metadata, timers, dB labels, run IDs, and compact operational states.
- **Stagger 1** (700, `clamp(2.4rem, 6vw, 5rem)`): Art-directed small scale for typographic stagger moments. Pair with Stagger 2 and 3.
- **Stagger 2** (700, `clamp(3.4rem, 8vw, 6.6rem)`): Art-directed medium scale for typographic stagger moments. Also usable for oversize numerals.
- **Stagger 3** (700, `clamp(4.6rem, 10.4vw, 8.6rem)`): Art-directed large scale for typographic stagger moments. Reserve for the page's mantra or punchline.

### Named Rules

**The Readout Rule.** Mono is for readings, not personality. Never set long paragraphs in mono.

**The Charged Headline Rule.** Landing-hero and section-hero headlines should be charged verb-statements in all caps, not marketing taglines. Pair the wordmark (Display) with a declarative phrase (Headline). Example: `FREAQ` over `ONE SEED. ONE CLOCK. ONE BOUNCE.` The wordmark is identity; the phrase does the work.

## 4. Elevation

Freaq should default to tonal layering, hard borders, and luminous red energy rather than soft shadows. Panels can feel like instrument vessels, but they should not become glassmorphic. Depth comes from surface contrast, hairlines, red glow used sparingly, and stateful emphasis.

### Shadow Vocabulary

- **Red Energy Glow** (`0 0 90px rgba(240, 68, 54, 0.16)`): Use only around active instrument panels or live energy elements.
- **Inset Vessel Edge** (`inset 0 1px 0 rgba(232, 226, 216, 0.08)`): Use on raised modules that need a subtle hardware edge.

### Named Rules

**The No Glass Rule.** Do not use decorative blur, frosted cards, or Apple-store glassiness.

**The Subtle Grain Rule.** Raised Graphite surfaces may carry a 2–4% opacity noise overlay to suggest screen-print wear and resist sterile gloss. The intent is dust on an instrument panel, not retro affectation. If grain reads as vintage or distressed at a glance, remove it. This rule is optional; use it sparingly and only on raised surfaces, never on backgrounds or text.

**The Vessel Section Rule.** Long-form pages (landing, manifesto, archive) may include at most one full-bleed section that is tonally lifted from the page floor, to read as a vessel inset rather than more page. Use Raised Graphite (`#181B1B` dark) for the section background, paired with the Inset Vessel Edge shadow on the top edge. Reserve this for the page's manifesto, mantra, or thesis moment; if every section is a vessel, no section is. The lift must be clearly perceptible — if it reads as a render artifact, push to Raised Graphite or remove the lift entirely.

## 5. Components

### Buttons

- **Shape:** Squared by default (`4px`), pill only when matching channel or readout controls.
- **Primary:** Peak Red background (`#F04436`) with Instrument Black text (`#080909`), `12px 16px` padding, JetBrains Mono label.
- **Hover / Focus:** Red may brighten or glow slightly. Focus uses explicit ring treatment and must not rely on color alone.
- **Secondary / Ghost:** Dark surface or transparent background, bone text, full border, no side-stripe accent.
- **Verb Vocabulary:** CTA text inside the running ritual uses armed-and-loaded language from the studio: `Arm sample seed`, `Strike start`, `Print bounce`, `Lock bounce`, `Bounce final`, `Cue seed`. Never use soft marketing verbs (`Try`, `Get started`, `Learn more`, `Explore`, `Continue`). The verb matches the consequence of the action.
- **Community CTA carve-out:** Landing and marketing surfaces may use the circle-vocabulary CTA `ENTER THE CIRCLE` (and close kin like `INTO THE CIRCLE`) for the pre-ritual join action. This is distinct from in-ritual buttons (Start, Lock, Submit, Bounce), which stay armed-and-loaded. Do not mix the two vocabularies on the same surface.

### Chips

- **Style:** Compact mono labels, full border, restrained fill.
- **State:** Active chips may use red border and text. Pair color with a label or icon.

### Status Stamps

Status communicates ritual state at a glance and should read like printed stamps on an instrument panel, not abstract labels.

- **Style:** Mono label, all caps, full border, restrained fill. Pair every state with text; never color alone.
- **Vocabulary:** `LOCKED`, `LIVE`, `ARMED`, `BOUNCED`, `FINAL`, `ANON`, `VOTING`, `TOP 3`, `EXPIRED`, `VAULT OPEN`, `CIRCLE OPEN`, `SOFT RESET`. Short, specific to ritual state. Avoid abstract product words (`Active`, `Pending`, `In progress`).
- **Color pairing:** Red border for live, armed, locked, or peak states. Green for accepted or bounced. Amber for warning or deadline. Hairline Graphite for ANON or neutral.
- **Placement:** Inline with metadata (week, brief, run) in mono readouts. Never standalone as decoration.

### Cards / Containers

- **Corner Style:** `8px` for ordinary panels, `28px` for sci-fi instrument vessels, `999px` for channel controls.
- **Background:** Use Panel Black or Raised Graphite.
- **Shadow Strategy:** Use tonal layering and borders. Red glow only for live instrument contexts.
- **Border:** `1px` Hairline Graphite. Never use thick side-stripe borders.
- **Internal Padding:** Default panel padding is `32px`; compact modules can use `16px`.

### Inputs / Fields

- **Style:** Raised Graphite background, `1px` Hairline Graphite border, `4px` radius.
- **Focus:** Focus Red ring (`#FF6A5E`) plus visible outline or border shift.
- **Error / Disabled:** Error uses text plus full border state. Disabled uses Dim text and reduced surface contrast.

### Navigation

Navigation should feel like a compact instrument strip. Use Bai Jamjuree for readable labels and JetBrains Mono only for phase, week, seed, or run metadata. Active states should use a red mark plus text, not red alone.

### Full-Bleed Strips

Long-form pages (landing, manifesto, week archive) can break container with edge-to-edge waveform, spectrogram, or scope strips as section dividers or hero anchors.

- **Render:** Clean digital phosphor only. Sharp lines, single accent color (Peak Red on dark, Deep Peak Red on light), Hairline Graphite for inactive states.
- **No grunge:** No photocopy texture, no scan distortion, no jitter or noise. Imperfection lives in the grain rule, not here.
- **Height:** `60–160px` depending on emphasis. Hero strips can be taller; section dividers stay compact.
- **Source:** Prefer real waveform data over decorative shapes. If decorative, base on a believable amplitude envelope.
- **Use sparingly:** One full-bleed strip per page section, never stacked.

### Signature Component

**Redline Instrument Panel:** A rounded dark module containing a stable mono timer, seed/channel controls, and red dB meter bars. It represents sealed-seed pressure and should be reused as the main visual metaphor for active ritual states.

## 6. Do's and Don'ts

### Do:

- **Do** keep `#F04436` rare and consequential.
- **Do** use `Bai Jamjuree` for display, body, and button text.
- **Do** use `JetBrains Mono` for timers, seed IDs, run IDs, and operational metadata.
- **Do** preserve AA contrast for body text and controls.
- **Do** make irreversible actions explicit in text: Start, Submit final, locked, no restart.
- **Do** respect reduced motion preferences for pulsing, scanline, timer, and reveal effects.
- **Do** use armed-and-loaded CTA vocabulary: `Arm`, `Strike`, `Print`, `Lock`, `Bounce`, `Cue`.
- **Do** pair every status with a text label; never communicate state through color alone.
- **Do** pair the wordmark with a charged verb-statement in hero moments.

### Don't:

- **Don't** use Apple-store glassiness, decorative blur, or generic SaaS gradients.
- **Don't** use stock illustration as the primary visual language.
- **Don't** make it feel like a generic beat battle, social music platform, crypto leaderboard, or developer terminal.
- **Don't** use red as a general decorative color.
- **Don't** rely on color alone for selected, live, warning, error, or anonymous states.
- **Don't** use thick side-stripe borders as accents.
- **Don't** set long body copy in mono.
- **Don't** use soft marketing verbs in CTAs (`Try`, `Get started`, `Learn more`, `Explore`, `Continue`).
- **Don't** introduce photocopy or scan-distortion textures; the grain rule is the only permitted imperfection.
