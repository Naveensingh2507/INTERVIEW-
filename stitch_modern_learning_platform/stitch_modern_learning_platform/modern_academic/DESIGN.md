---
name: Modern Academic
colors:
  surface: '#f9f9ff'
  surface-dim: '#d4daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e8eeff'
  surface-container-high: '#e3e8f9'
  surface-container-highest: '#dde2f3'
  on-surface: '#161c27'
  on-surface-variant: '#43474e'
  inverse-surface: '#2a303d'
  inverse-on-surface: '#ecf0ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#476558'
  on-secondary: '#ffffff'
  secondary-container: '#c9ead9'
  on-secondary-container: '#4d6b5d'
  tertiary: '#1e2122'
  on-tertiary: '#ffffff'
  tertiary-container: '#333637'
  on-tertiary-container: '#9d9fa0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#c9ead9'
  secondary-fixed-dim: '#adcebe'
  on-secondary-fixed: '#022016'
  on-secondary-fixed-variant: '#304d40'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f9f9ff'
  on-background: '#161c27'
  surface-variant: '#dde2f3'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system for HireVault is anchored in the "Modern Academic" aesthetic, projecting an image of intellectual rigor, institutional trust, and contemporary efficiency. It is designed for high-stakes professional environments where clarity of information and authoritative presentation are paramount.

The style is a refined mix of **Minimalism** and **Corporate Modernism**. It prioritizes high-quality typography and generous whitespace to reduce cognitive load during complex decision-making. The visual language avoids trendy ephemeral effects in favor of structured layouts, thin lines, and a restrained palette that suggests longevity and reliability. The emotional response should be one of calm confidence, as if interacting with a prestigious university or a top-tier global consultancy.

## Colors
The palette is grounded in a "Library & Ink" philosophy. The primary background is a crisp white or very subtle off-white to maintain a scholarly feel.

- **Primary (Scholar Navy):** Used for key actions, navigation headers, and primary branding elements. It conveys stability and institutional authority.
- **Secondary (Academy Green):** A deep forest green used for success states, specialized markers, and secondary calls to action. It suggests growth and heritage.
- **Neutral (Slate/Charcoal):** The foundation for all typography and structural borders. Avoid pure black (#000) to keep the contrast sophisticated rather than harsh.
- **Surface (Parchment White):** A secondary background color used for cards and container backgrounds to subtly distinguish layers without heavy shadows.

## Typography
The typography strategy relies on the tension between a sophisticated serif and a utilitarian sans-serif.

- **Headings:** Use Playfair Display for all headlines and display text. It provides the "Academic" character. Use optical sizing when available to maintain elegance at larger scales.
- **Body:** Use Inter for all functional text, data, and long-form reading. Its high x-height and neutral character ensure maximum legibility for resumes and candidate profiles.
- **Labels:** Small labels and metadata should use Inter in semi-bold weight with slight letter spacing and uppercase styling to mimic traditional document headers.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for desktop to maintain the feel of a structured manuscript, while transitioning to a **Fluid Grid** for mobile devices.

- **Grid:** A 12-column grid system with a 24px gutter. On desktop, the content is centered with a maximum width of 1280px.
- **Rhythm:** An 8px base unit drives all padding and margin decisions. 
- **Whitespace:** Emphasize "editorial" margins. Content containers should have generous internal padding (32px or 40px) to prevent the UI from feeling cluttered or "SaaS-generic."
- **Breakpoints:** 
  - Mobile: < 768px (16px margins, 4 columns)
  - Tablet: 768px - 1024px (24px margins, 8 columns)
  - Desktop: > 1024px (40px margins, 12 columns)

## Elevation & Depth
Depth is created primarily through **Tonal Layers** and **Refined Outlines** rather than aggressive shadows.

- **Layering:** Backgrounds use a light grey (#F8F9FA), while primary content cards use a pure white (#FFFFFF). This creates a subtle stack without needing shadow.
- **Outlines:** Use 1px solid borders in a very light slate (#E2E8F0) to define boundaries. 
- **Shadows:** When necessary for floating elements (like dropdowns or modals), use a "Paper Shadow": a very soft, multi-layered blur with low opacity (e.g., `0px 4px 20px rgba(26, 32, 44, 0.05)`).
- **Z-Index:** Maintain a strict hierarchy where the "Canvas" is lowest, "Cards/Sections" are level 1, and "Navigation/Modals" are level 2.

## Shapes
The shape language is conservative and architectural. 

- **Corner Radius:** Elements use a "Soft" (0.25rem / 4px) radius. This provides just enough softening to feel modern without losing the structured, professional look of a traditional document.
- **Hard Edges:** Vertical and horizontal dividers should always have 0px roundedness to maintain the grid's integrity.
- **Interactive States:** Hover states for buttons or list items should maintain the same 4px radius. Avoid pill-shaped buttons as they appear too casual for the Academic narrative.

## Components
- **Buttons:** Primary buttons use the Scholar Navy background with white Inter Bold text. Secondary buttons use a refined 1px border in Navy with no fill. Padding should be generous (12px 24px).
- **Inputs:** Text fields use a 1px Slate-200 border. On focus, the border transitions to Scholar Navy with a subtle 2px inset shadow to simulate the "pressing" of a typewriter key or formal stamp.
- **Cards:** Cards should be flat with a 1px border. Do not use shadows for standard content cards. Title sections within cards should use the Playfair Display font.
- **Chips/Badges:** Use Academy Green for positive status chips and a light Slate for neutral metadata. Shapes should be rectangular with the system-standard 4px radius.
- **Lists:** Use "Horizontal Rule" separators (1px light slate) with ample vertical padding (16px-20px) between items to ensure high legibility of candidate data.
- **Specialty Component - The 'Dossier' Header:** A specific layout component for candidate profiles featuring a large Playfair Display name, a subtle horizontal rule, and metadata labels in uppercase Inter.