# Design System Documentation
## No-Code Data Analyst - Modern UI Theme

This comprehensive design system provides a clean, minimalistic, and highly user-friendly interface with both **Bright Theme** and **Dark Theme** support.

---

## 🎨 Design Principles

### Core Values
- **Minimalistic**: Clean interfaces with purposeful elements
- **Consistent**: 8px grid system for predictable spacing
- **Accessible**: WCAG AA compliant color contrast
- **Responsive**: Mobile-first approach with adaptive layouts
- **Professional**: Enterprise-grade typography and hierarchy

### Visual Language
- **Rounded Corners**: 8-20px for modern, friendly feel
- **Soft Shadows**: Subtle elevation for depth perception
- **High Contrast**: Clear visual hierarchy and readability
- **Smooth Transitions**: 150-350ms cubic-bezier animations

---

## 📐 Spacing System (8px Grid)

```
xs:    4px   - Tiny gaps (icon margins, tight spacing)
sm:    8px   - Small gaps (list items, badges)
md:    16px  - Medium gaps (card padding, form fields)
lg:    24px  - Large gaps (section spacing, headers)
xl:    32px  - Extra large (page margins)
xxl:   48px  - Section separators
xxxl:  64px  - Hero sections
```

**Usage Rules:**
- Use multiples of 8 for consistency
- Stack spacing: prefer margin-bottom over margin-top
- Container padding: 16px mobile, 24px tablet, 32px desktop

---

## 🔤 Typography

### Font Family
- **Primary**: Inter (modern, clean, highly legible)
- **Fallback**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto
- **Mono**: Fira Code (for code snippets)

### Font Scale
```
xs:   12px  - Captions, timestamps
sm:   14px  - Secondary text, labels
base: 16px  - Body text (default)
lg:   18px  - Emphasized text
xl:   20px  - Small headings
2xl:  24px  - Section titles
3xl:  30px  - Page titles
4xl:  36px  - Hero headings
5xl:  48px  - Display headings
```

### Font Weights
- Light: 300 (de-emphasized)
- Normal: 400 (body text)
- Medium: 500 (navigation, labels)
- Semibold: 600 (sub-headings)
- Bold: 700 (headings, important)

### Line Height
- Tight: 1.25 (headings)
- Normal: 1.5 (body text)
- Relaxed: 1.75 (long-form content)

---

## 🎨 Color Palette

### Bright Theme

#### Primary (Blue)
```
Main: #3b82f6 - Primary actions, links, brand
Light: #60a5fa - Hover states
Dark: #2563eb - Active/pressed states
```

#### Semantic Colors
```
Success: #22c55e (green) - Success messages, positive actions
Warning: #f59e0b (amber) - Warnings, caution
Error: #ef4444 (red) - Errors, destructive actions
Info: #0ea5e9 (cyan) - Information, neutral notifications
```

#### Neutral/Background
```
Background: #ffffff - Page background
Surface: #f8fafc - Card backgrounds, elevated surfaces
Card: #ffffff - Content cards
Border: #e2e8f0 - Dividers, borders
Text Primary: #0f172a - Headings, important text
Text Secondary: #475569 - Body text, descriptions
Text Disabled: #94a3b8 - Disabled states
```

#### Chart Colors
```
Blue: #3b82f6
Purple: #8b5cf6
Pink: #ec4899
Orange: #f97316
Green: #10b981
Teal: #14b8a6
Cyan: #06b6d4
Indigo: #6366f1
```

### Dark Theme

#### Primary (Blue - adjusted for dark)
```
Main: #60a5fa - Primary actions (lighter for contrast)
Light: #93c5fd - Hover states
Dark: #3b82f6 - Active/pressed states
```

#### Semantic Colors
```
Success: #4ade80 (brighter green)
Warning: #fbbf24 (brighter amber)
Error: #f87171 (softer red)
Info: #38bdf8 (brighter cyan)
```

#### Neutral/Background
```
Background: #0a0a0a - Page background (near-black)
Surface: #151515 - Slightly elevated surfaces
Card: #1a1a1a - Content cards
Border: #2a2a2a - Dividers, borders
Text Primary: #f5f5f5 - Headings, important text
Text Secondary: #a3a3a3 - Body text, descriptions
Text Disabled: #525252 - Disabled states
```

#### Chart Colors (optimized for dark bg)
```
Blue: #60a5fa
Purple: #a78bfa
Pink: #f472b6
Orange: #fb923c
Green: #34d399
Teal: #2dd4bf
Cyan: #22d3ee
Indigo: #818cf8
```

---

## 🧩 Component Styles

### Buttons

#### Primary (Filled)
```css
Background: Primary color
Color: White
Padding: 12px 24px (md), 8px 16px (sm), 16px 32px (lg)
Border-radius: 12px
Shadow: Subtle (sm) → Elevated on hover (md)
Hover: Darker shade + translateY(-1px)
Active: Original position + reduced shadow
```

#### Outline
```css
Border: 2px solid primary
Color: Primary color
Background: Transparent
Hover: Light primary background (50 shade in bright, 10% opacity in dark)
```

#### Ghost
```css
Background: Transparent
Color: Text secondary
Border: None
Hover: Surface background + text primary color
```

### Cards

```css
Background: Card color
Border: 1px solid border color
Border-radius: 16px (lg)
Shadow: sm default → md on hover
Padding: 24px
Hover: translateY(-2px) + elevated shadow
```

### Inputs

```css
Height: 40px
Padding: 10px 16px
Border: 1px solid border color
Border-radius: 12px
Focus: Primary border + 3px soft glow shadow
Background: Card/surface color
```

### Navigation Bar

```css
Height: 64px
Background: Card color (bright: white, dark: #1a1a1a)
Border-bottom: 1px solid border
Shadow: sm
Padding: 0 24px
Sticky positioning recommended
```

### Sidebar

```css
Width: 260px (expanded), 64px (collapsed)
Background: Surface color
Border-right: 1px solid border
Transition: 250ms ease for collapse
Fixed positioning from top: 64px (below navbar)
```

### Tables

```css
Background: Card
Border-radius: 16px (lg)
Header: Surface background, 600 weight, 2px border-bottom
Row hover: Surface background
Cell padding: 16px
Border between rows: 1px border color
```

### Modals

```css
Background: Card
Border-radius: 16px (lg)
Shadow: xl (strong elevation)
Border: 1px solid border
Header/Footer: Surface background with border separator
Body: Card background
Max-width: 600px (default)
```

### Alerts

```css
Border-radius: 12px
Padding: 16px 24px
Border: None (bright) / 1px colored (dark)
Background: Semantic color with opacity
- Success: Green background (bright: solid light, dark: 10% opacity)
- Warning: Amber background
- Error: Red background
- Info: Cyan background
```

### Badges

```css
Font-size: 12px (xs)
Padding: 4px 12px
Border-radius: 8px (sm)
Font-weight: 500
Background: Light semantic color / 15% opacity in dark
Color: Dark semantic shade / bright in dark mode
```

### Search Bar

```css
Input with left icon (40px padding-left)
Icon: Positioned absolute at 12px from left
Border-radius: 12px
Full styling inherits from input component
```

---

## 📱 Responsive Breakpoints

```javascript
xs:  475px  - Extra small devices
sm:  640px  - Small devices (phones)
md:  768px  - Medium devices (tablets)
lg:  1024px - Large devices (desktops)
xl:  1280px - Extra large screens
2xl: 1536px - Ultra-wide screens
```

### Mobile Behavior (< 768px)
- Sidebar: Hidden by default, slides in from left
- Buttons: Full width
- Cards: 12px border-radius (reduced)
- Grid: Single column layout
- Spacing: Reduced padding (16px instead of 24px)
- Font sizes: Slightly reduced
- Navigation: Hamburger menu with collapse

### Tablet (768px - 1024px)
- Sidebar: Collapsible
- Grid: 2 column layout for cards
- Spacing: 24px standard
- Navbar: Full with all items visible

### Desktop (> 1024px)
- Sidebar: Always visible
- Grid: 3-4 column layout
- Spacing: 32px for content areas
- Max-width container: 1536px

---

## ♿ Accessibility Guidelines (WCAG AA)

### Color Contrast
- **Normal text**: Minimum 4.5:1 ratio
- **Large text** (18px+ or 14px+ bold): Minimum 3:1 ratio
- **Graphical objects**: Minimum 3:1 ratio

### Interactive Elements
- Minimum touch target: 44px × 44px
- Focus indicator: 2px solid ring in primary color with 3px offset
- Keyboard navigation: All interactive elements must be reachable via Tab
- Skip links: Provide "Skip to main content" for screen readers

### Visual Hierarchy
- Semantic HTML: Use proper heading levels (h1 → h2 → h3)
- ARIA labels: For icons and interactive elements without text
- Alt text: For all meaningful images
- Color independence: Never rely on color alone to convey information

---

## 🎭 Interaction & Animations

### Hover Effects
```css
Scale: 1.02 (subtle grow)
Shadow: Increase elevation
Color: Darken/lighten by one shade
Cursor: pointer for clickables
```

### Press/Active States
```css
Scale: 0.98 (press down)
Shadow: Reduce to base level
Color: Darker/lighter by two shades
```

### Transitions
```css
Fast: 150ms - Hover states, color changes
Normal: 250ms - General animations, transforms
Slow: 350ms - Page transitions, large movements
Easing: cubic-bezier(0.4, 0, 0.2, 1) - Smooth, natural
```

### Loading States
- Skeleton screens for content loading
- Spinner: Primary color, 24px default size
- Progress bars: Primary fill, surface background, rounded

---

## 🏗️ Layout Patterns

### Dashboard Layout
```
┌─────────────────────────────────────┐
│         Navbar (64px)               │
├──────┬──────────────────────────────┤
│      │                              │
│ Side │     Content Area             │
│ bar  │     (max-width: 1536px)      │
│260px │     Grid: 24px gap           │
│      │                              │
└──────┴──────────────────────────────┘
```

### Content Area Padding
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

### Card Grid
- Gap: 24px
- Min card height: 200px
- Chart aspect ratio: 16:9
- Columns: 
  - Mobile: 1
  - Tablet: 2
  - Desktop: 3-4

---

## 📦 Usage in Code

### React/JSX
```jsx
import { brightTheme, darkTheme } from './theme/designSystem';

const theme = isDark ? darkTheme : brightTheme;
```

### CSS Variables
```css
/* Automatically switches based on data-bs-theme attribute */
color: var(--color-primary);
padding: var(--spacing-lg);
border-radius: var(--radius-md);
```

### JSON Import
```javascript
import themes from './theme/themes.json';
const primaryColor = themes.brightTheme.colors.primary.main;
```

---

## 🚀 Quick Start

1. **Import CSS files:**
```javascript
import './theme/brightTheme.css';
import './theme/darkTheme.css';
```

2. **Set theme on root element:**
```javascript
document.documentElement.setAttribute('data-bs-theme', 'light');
// or 'dark'
```

3. **Use design system tokens:**
```jsx
<button className="btn-primary">Click me</button>
<div className="card shadow-md rounded-lg">Card content</div>
```

---

## 📄 Files Created

1. **designSystem.js** - JavaScript/ES6 module with full theme objects
2. **themes.json** - JSON format for any framework (React, Vue, Flutter, etc.)
3. **brightTheme.css** - Complete CSS for bright/light mode
4. **darkTheme.css** - Complete CSS for dark mode
5. **DESIGN_SYSTEM.md** - This documentation file

---

## 🎨 Example Component Implementations

### Button Examples
```html
<!-- Primary -->
<button class="btn-primary">Save Changes</button>

<!-- Outline -->
<button class="btn-outline-primary">Cancel</button>

<!-- Ghost -->
<button class="btn-ghost">Learn More</button>
```

### Card Example
```html
<div class="card shadow-md rounded-lg">
  <div class="card-header">
    <h3>Dashboard</h3>
  </div>
  <div class="card-body">
    <p class="text-secondary">Your content here</p>
  </div>
</div>
```

### Alert Example
```html
<div class="alert alert-success">
  ✓ Data uploaded successfully!
</div>
```

---

## 🔧 Customization Tips

1. **Adjust primary color**: Update all primary-* shades in both themes
2. **Change spacing**: Modify base 8px grid in spacing system
3. **Typography**: Swap Inter font with your brand font
4. **Border radius**: Adjust radius-* values for sharper/rounder look
5. **Shadows**: Increase/decrease shadow opacity for depth preference

---

**Design System Version**: 1.0.0  
**Last Updated**: November 15, 2025  
**Compatible with**: React, Vue, Angular, Vanilla JS, Bootstrap 5+
