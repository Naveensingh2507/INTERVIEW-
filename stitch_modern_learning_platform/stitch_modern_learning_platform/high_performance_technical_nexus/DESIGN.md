---
name: High-Performance Technical Nexus
colors:
  surface: '#081425'
  surface-dim: '#081425'
  surface-bright: '#2f3a4c'
  surface-container-lowest: '#040e1f'
  surface-container-low: '#111c2d'
  surface-container: '#152031'
  surface-container-high: '#1f2a3c'
  surface-container-highest: '#2a3548'
  on-surface: '#d8e3fb'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#d8e3fb'
  inverse-on-surface: '#263143'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#fbabff'
  on-secondary: '#580065'
  secondary-container: '#ae05c6'
  on-secondary-container: '#ffd8fd'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffd6fd'
  secondary-fixed-dim: '#fbabff'
  on-secondary-fixed: '#36003e'
  on-secondary-fixed-variant: '#7c008e'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#081425'
  on-background: '#d8e3fb'
  surface-variant: '#2a3548'
  bg-deep: '#0a0a0a'
  border-slate: '#1e293b'
  danger-rose: '#f43f5e'
  text-muted: '#94a3b8'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for high-performance utility, catering to ambitious Indian tech students. The aesthetic is "Pro-Tool" — prioritizing speed, data density, and functional clarity over decorative trends. It evokes the feeling of a sophisticated IDE or a mission-control terminal, stripping away "AI sludge" (soft gradients, blobby shapes) in favor of precision and technical rigor.

The style is **Modern Corporate with a Developer edge**, utilizing:
- **High-Density Information:** Maximizing screen real estate for audit logs, code snippets, and metrics.
- **Atmospheric Dark Mode:** A deep `#0a0a0a` foundation that makes chromatic accents pop without causing eye strain during long prep sessions.
- **Rigid Structure:** A reliance on 1px borders and strict grid alignment to convey reliability and "HireReady" professionalism.

## Colors

The palette is anchored in a monochromatic dark environment, using high-saturation chromatic accents strictly for functional signaling and brand recognition.

- **Primary (Indigo-600):** Reserved for primary actions, the Resume Auditor flow, and focused states.
- **Secondary (Fuchsia-500):** Specific to the Interview flow and accent highlights to differentiate the two core product pillars.
- **Success (Emerald-500):** Used for passing ATS scores, "HireReady" status, and suggested resume improvements.
- **Danger (Rose-500):** High-visibility signaling for cheating flags, missing keywords, or critical resume errors.
- **Neutral/Surface:** We use a deep slate scale for borders and secondary text to maintain low-contrast hierarchy against the `#0a0a0a` background.

## Typography

The typography strategy separates **Narrative** from **Data**. 

- **Inter** is the workhorse for UI labels, navigation, and body copy. It is selected for its exceptional legibility in dark mode and neutral character.
- **JetBrains Mono** is used for "Technical Data" and "Accents." This includes terminal outputs, code snippets in the whiteboard, ATS keyword chips, and small metadata labels. This distinction reinforces the "technical performance" narrative.

Headlines should use tight letter-spacing and heavy weights to appear impactful, while data-heavy tables should utilize the monospace font to ensure vertical alignment of numbers and metrics.

## Layout & Spacing

This design system employs a **Fixed-Fluid Hybrid Grid**. Content is contained within a 1280px max-width wrapper on desktop but expands to fill the viewport on mobile/tablet.

- **Grid:** A 12-column system is used for the Dashboard and Audit results.
- **Density:** We utilize a "Compact" spacing rhythm. Use 8px increments for internal component spacing, but prioritize 16px or 24px gutters to allow the technical UI to "breathe" despite the high data density.
- **Split-Screen:** The `/interview/room` uses a strict 50/50 vertical split on desktop, transitioning to a stacked layout or "Overlay Whiteboard" on mobile devices to preserve the webcam visibility.

## Elevation & Depth

In a deep-dark theme, depth is communicated through **Tonal Elevation** and **1px Borders** rather than heavy shadows.

- **Surface Levels:** 
    - Level 0: `#0a0a0a` (Background)
    - Level 1: `#111111` (Cards/Panels)
    - Level 2: `#1a1a1a` (Modals/Hovered states)
- **Borders:** Use `slate-800` (`#1e293b`) for all structural borders. Borders should be solid and 1px wide.
- **Glow Accents:** Subtle, low-opacity outer glows (15-20% opacity) may be applied to active state elements (e.g., the active Interviewer Wave or a selected CTA card) to simulate "Power-On" states without breaking the flat, technical aesthetic.

## Shapes

The shape language is "Soft-Sharp." We avoid perfectly square corners to prevent an overly aggressive "90s terminal" feel, but keep the radii tight (8px/0.25rem - 0.5rem) to maintain a modern, engineered look. 

- **Buttons & Inputs:** Use a consistent 8px radius.
- **Keyword Chips:** May use a full pill-shape (rounded-full) to distinguish them as interactive, removable tokens.
- **Score Rings:** Use clean, circular SVG paths with no rounded caps on the progress stroke to maintain a precise, mathematical appearance.

## Components

- **Buttons:**
    - *Primary:* Indigo-600 background, white text, 8px radius. High-contrast.
    - *Technical:* Transparent background, 1px Slate-800 border, JetBrains Mono text.
- **Input Fields:** Background should be slightly lighter than the page (`#111111`), with a 1px border. On focus, the border transitions to Primary Indigo or Secondary Fuchsia depending on the flow.
- **Correction Cards:** A split layout showing "Original" (Rose-500 tint/border) and "Suggested" (Emerald-500 tint/border). Use JetBrains Mono for the text content to emphasize the "editing" nature.
- **WaveVisualizer:** The waveform should be rendered as a thin, 2px stroke. Avoid thick, filled bars. The colors must cycle through IDLE (Slate), LISTENING (Indigo), THINKING (Fuchsia/Glow), and SPEAKING (Indigo/Rapid Pulse).
- **Metric Cards:** Large numeric score in the center (Inter Bold) with a small mono-label (JetBrains Mono) at the top. Use subtle border tints to indicate if the score is "Good" (Green) or "Critical" (Red).