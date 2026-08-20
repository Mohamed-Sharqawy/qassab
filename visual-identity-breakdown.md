# Visual Identity Breakdown — kwbutcher.com

## Template Structure

**Platform:** WordPress 6.8  
**Theme:** Publisher (BetterStudio) — Clean Magazine Style  
**Layout:** RTL (Right-to-Left) Arabic  
**Grid System:** Bootstrap-based (`col-sm-8` content + sidebar)  
**Page Layout:** 2-column with right sidebar  

---

## Template Sections (Top to Bottom)

| # | Section | Class/ID | Description |
|---|---------|----------|-------------|
| 1 | Top Line | `.active-top-line` | Thin accent bar at very top of page |
| 2 | Header | `#header` `.header-style-2` | Boxed style, centered logo, full-width below |
| 3 | Main Navigation | `#menu-main` | 11 menu items, smart sticky behavior |
| 4 | Mobile Header | `.rh-header` | Responsive header with hamburger menu + logo |
| 5 | Banner Ad | `.adcontainer` | Full-width image banner below header |
| 6 | Hero Slider | `.slider-container` | Modern Grid style, 6 posts in asymmetric grid |
| 7 | Main Content | `#content` `.layout-2-col` | Blog listing (left) + sidebar (right) |
| 8 | Footer | `.footer-widget` | Widgetized 3-column layout |
| 9 | Mobile CTA Bar | `.callusbtnag` | Fixed bottom bar (green, phone number) |

---

## Color Scheme

### Primary Colors

| Role | Color Name | Hex Code | Usage |
|------|------------|----------|-------|
| Primary Accent | Deep Red | `#e00000` | Review summary links, hover states |
| Secondary Accent | Dark Gray | `#404040` | Review link hovers |
| CTA Button (Mobile) | Green | `#090` (`#009900`) | Fixed bottom call button |
| CTA Hover | Red | `#dd3333` | Call button hover state |
| Widget Text | Purple | `#5d2e8f` | Sidebar text widget content |

### Neutral Colors

| Role | Color Name | Hex Code | Usage |
|------|------------|----------|-------|
| Background | White | `#ffffff` | Page background, review box container |
| Review Header BG | Light Gray | `#ededed` | Review box header, user rate wrapper |
| Review Item BG | Lighter Gray | `#f0f0f0` | Review stars, percentage bars, summary |
| Review Score BG | Soft Gray | `#f2f2f2` | Percentage bar fills, final score background |
| Review Text | Dark Gray | `#505050` | Review item headings |
| Review Border | Medium Gray | `#cccccc` | Review stars, summary borders |
| Body Text | Near-Black | Inherited | All body copy |

---

## Color Distribution

### Header Zone
- **Background:** White / near-white
- **Logo:** Image-based (no color definition in CSS)
- **Navigation Text:** Dark on white
- **Border:** Subtle bottom border

### Hero / Slider Zone
- **Background:** Full-width image cards
- **Overlay:** Dark gradient overlays on images
- **Text:** White text over images
- **Category Badges:** Colored backgrounds (`.term-badge`)

### Content Area (Blog Listing)
- **Card Backgrounds:** White
- **Title Text:** Dark
- **Excerpt Text:** Dark gray
- **Read More Links:** Accent color
- **Category Badges:** Colored backgrounds
- **Featured Images:** Subtle shadows

### Sidebar
- **Widget Text:** Purple (`#5d2e8f`)
- **Widget Backgrounds:** Standard gray styling
- **Spacing:** Reduced (`margin-bottom: 10px`)

### Footer
- **Layout:** Widgetized 3-column
- **Spacing:** Reduced margins on widgets
- **Background:** Default/white

### Mobile-Specific
- **CTA Bar:** Fixed at bottom
- **CTA Background:** Green (`#090`)
- **CTA Text:** White
- **CTA Hover:** Red (`#dd3333`)
- **Display:** Hidden on desktop, shown on mobile (`max-width: 768px`)

---

## Typography

| Font | Source | Usage |
|------|--------|-------|
| Droid Arabic Kufi | Google Fonts (Early Access) | Primary Arabic font |
| Roboto 500 | Google Fonts | Secondary / Latin font |

---

## Visual Style Characteristics

| Feature | Implementation |
|---------|----------------|
| Layout Style | Clean Magazine (`bs-publisher-clean-magazine`) |
| Lightbox | Active (`active-light-box`) |
| Navigation | Smart sticky (`main-menu-sticky-smart`) |
| Header Style | Boxed (`main-menu-boxed`) |
| Direction | RTL (`dir="rtl"`) |
| Content Width | Full-width |

---

## Review System (Taqyeem Plugin)

The site uses the Taqyeem WordPress review plugin with custom styling:

```css
.review-final-score { border-color: #ffffff; }
.review-box { background-color: #ffffff; }
#review-box h2.review-box-header,
.user-rate-wrap { background-color: #ededed; }
.review-stars .review-item,
.review-percentage .review-item span,
.review-summary { background-color: #f0f0f0; }
.review-percentage .review-item span span,
.review-final-score { background-color: #f2f2f2; }
.review-summary a { color: #e00000; }
.review-summary a:hover { color: #404040; }
#review-box .review-item h5 { color: #505050; }
.review-stars .review-item,
.review-summary { border: 1px solid #ccc; }
```

---

## Mobile CTA Button

```css
.callusbtnag {
    display: none;
    position: fixed;
    z-index: 2147483647;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 60px;
    text-align: center;
    color: #fff;
    font-weight: 600;
    font-size: 120%;
    background: #090;
}

.callusbtnag:hover {
    background: #dd3333;
    color: #fff;
}

@media (max-width: 768px) {
    .callusbtnag {
        display: flex;
    }
}
```

---

## Summary

The kwbutcher.com website uses a **minimal, clean color palette** dominated by:

- **Grayscale tones** (white, light grays, dark gray) for structure and text
- **Deep red** (`#e00000`) as the primary accent for interactive elements
- **Green** (`#090`) for the mobile call-to-action button
- **Purple** (`#5d2e8f`) for sidebar widget text

The overall aesthetic is **professional and functional**, prioritizing readability and clear call-to-action hierarchy. The Publisher theme provides a structured magazine-style layout with RTL Arabic support, while the Taqyeem review system adds visual rating components with a consistent gray-scale design.
