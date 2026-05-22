---
name: Technical Glassmorphism
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4e44e2'
  primary: '#3e32d3'
  on-primary: '#ffffff'
  primary-container: '#5850ec'
  on-primary-container: '#e9e5ff'
  inverse-primary: '#c3c0ff'
  secondary: '#276954'
  on-secondary: '#ffffff'
  secondary-container: '#abeed2'
  on-secondary-container: '#2c6e58'
  tertiary: '#4b4b7e'
  on-tertiary: '#ffffff'
  tertiary-container: '#636398'
  on-tertiary-container: '#e8e5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3424ca'
  secondary-fixed: '#adf0d5'
  secondary-fixed-dim: '#92d4ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#03513d'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c2c1fd'
  on-tertiary-fixed: '#151546'
  on-tertiary-fixed-variant: '#414174'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 80px
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: 0.04em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  stats-md:
    fontFamily: Bebas Neue
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0.05em
  body-md:
    fontFamily: Bebas Neue
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Arimo
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  grid-unit: 24px
  gutter: 16px
  margin-safe: 32px
  container-padding: 24px
---

## Brand & Style

The brand personality of this design system is **intelligent, precise, and futuristic**. It is tailored for high-stakes business analytics where data density must meet visual clarity. The emotional response should be one of "controlled power"—users should feel they are operating a sophisticated instrument that is nonetheless effortless to navigate.

The aesthetic merges **Glassmorphism** with **Corporate Modern** sensibilities, now enhanced with high-impact typography. It utilizes a technical grid background to imply structure and accuracy, while floating frosted-glass surfaces provide a sense of depth and lightness. The visual language is defined by high-tech elegance, favoring subtle translucency over heavy shadows and vibrant data accents over decorative fluff.

## Colors

The palette is anchored by **Electric Indigo**, a high-energy primary color used for key actions and focus states. The neutral foundation is a cool, surgical off-white (`#f8fafc`), which prevents the interface from feeling clinical.

- **Primary (Electric Indigo):** Used for primary buttons, active states, and primary data trend lines.
- **Secondary (Deep Sea Green):** A sophisticated, muted green (`#357660`) used for secondary indicators and stable growth states.
- **Accents:** A range of Slate Lavenders (`#6c6ca2`) and blues are used in data visualization to create depth within charts.
- **Surface Strategy:** Backgrounds utilize a technical dot-grid pattern. UI containers use a semi-transparent white (80-90% opacity) with a background blur to create the "frosted" effect. Dark-mode surfaces are high-contrast charcoal to maintain legibility.

## Typography

This system utilizes a bold, high-impact typographic pairing to create a "Mission Control" aesthetic. **Anton** is used for display and headlines, providing a condensed, powerful presence. **Bebas Neue** is employed for body text and numerical data, maintaining the technical, vertical-focused look. For critical legibility at small sizes, **Arimo** is used for labels and functional UI elements.

The typography follows a strict hierarchy where headlines feel like "impact" statements, while Arimo labels use increased letter-spacing for maximum legibility at small sizes. For large-scale data dashboards, a specific `stats-md` style in Bebas Neue is employed to make numerical values pop.

## Layout & Spacing

The layout philosophy is built on a **Fluid Grid** with a technical underlay. A visible 24px dot-grid serves as the rhythmic foundation, ensuring all elements align to a systematic "blueprint."

- **Desktop:** A 12-column system with 24px gutters. Content cards should span multiples of these columns.
- **Tablet:** An 8-column system with 16px gutters.
- **Mobile:** A 4-column system. Glassmorphic effects are reduced on mobile to ensure performance and legibility under varying lighting conditions.

The spacing rhythm follows a base-8 scale (8, 16, 24, 32, 48, 64), ensuring that the technical nature of the brand is reflected in the mathematical consistency of the white space.

## Elevation & Depth

Hierarchy is achieved through **Glassmorphism and Tonal Layers** rather than traditional heavy shadows.

1.  **Level 0 (Background):** The technical grid layer. Fixed and non-interactive.
2.  **Level 1 (The Glass Card):** Semi-transparent white background (`rgba(255, 255, 255, 0.7)`) with a `backdrop-filter: blur(12px)`. It features a subtle 1px white border (20% opacity) to define the edge against the grid.
3.  **Level 2 (Active/Focus):** Elements that are interactive or "lifted" use an ultra-diffused, low-opacity indigo shadow (`rgba(88, 80, 236, 0.1)`) to suggest a soft glow rather than a physical weight.
4.  **Level 3 (Overlays):** Modals and dropdowns use a darker tint of glass to clearly separate them from the primary dashboard layer.

## Shapes

The design system utilizes **Rounded (Level 2)** geometry. This choice softens the "technical" edge of the Anton typography and the rigid grid, making the system feel more approachable and modern.

- **Standard Cards:** 1rem (16px) corner radius.
- **Buttons & Small Inputs:** 0.5rem (8px) corner radius.
- **Inner Elements:** Elements nested inside cards should have a slightly smaller radius (12px) to maintain visual concentricity.

## Components

### Cards
The signature component. Must feature a `backdrop-filter` and a subtle inner stroke. Cards should appear to "float" above the technical grid. Padding is generous (24px) to give data room to breathe.

### Buttons
- **Primary:** Solid Electric Indigo with white text (Anton). High-contrast and no transparency.
- **Secondary/Ghost:** A thin 1px border matching the text color, with a slight background tint on hover.

### Data Visualization
- **Line Charts:** Use a 2px stroke width with a gradient fill beneath the line. The line should have a subtle "glow" effect.
- **Bar Charts:** Use high-contrast Slate Lavenders and Indigos. Top corners of bars should be slightly rounded (4px).

### Input Fields
Inputs are treated as "sunken" glass. Use a slightly darker background opacity than the card surface and a 1px border that glows Indigo on focus. User input text uses Arimo for clarity.

### Chips
Used for filtering and status. They should be semi-transparent with a border color that indicates the category (e.g., Deep Sea Green for "active", Slate Lavender for "pending").