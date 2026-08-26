# SEO Follow-Up Optimization for Qassab Al Kuwait

## Section 0: Framework / Optimization Path

**Finding: Static HTML/CSS/JS site on Vercel — NO Next.js, NO image pipeline.**

- No `package-lock.json`, no framework dependencies. `package.json` only has `live-server` and `serve` scripts.
- All images are raw static JPEGs/JFIF files in the root directory, ranging from **19 KB to 6,735 KB** (several over 3 MB).
- No `next/image` or any automatic image optimization — **manual techniques apply** for all image sections.
- Vercel Edge Network serves all static assets by default. No second CDN needed.

> [!IMPORTANT]
> Since there is no image pipeline, we will use Node.js + `sharp` to convert and resize images manually, then update all HTML references.

---

## Proposed Changes

### 1. Image Conversion & Resizing (Sections 1–5)

#### Image Inventory

**Images actively used across all 6 pages (in area cards JS + index hero/about):**

| Image | Current Size | Used In |
|-------|-------------|---------|
| `derrick-pare-TdhqDEjeNuM-unsplash.jpg` | 5,169 KB | Hero (index), Area cards |
| `kyle-mackie-effAM7L50fI-unsplash.jpg` | 5,163 KB | About section (index) |
| `gabriella-clare-marino-WgqZ1q_nkPE-unsplash.jpg` | 3,738 KB | Area cards |
| `inigo-de-la-maza-LQJg_PXPPUs-unsplash.jpg` | 3,259 KB | Area cards |
| `madie-hamilton-l9vXx8aEYJ8-unsplash.jpg` | 6,735 KB | Area cards |
| `thapanee-srisawat-ahnczgYo2Fo-unsplash.jpg` | 4,768 KB | Area cards |
| `_95787611_gettyimages-647011416.jpg` | 94 KB | Area cards |
| `brown-headed-sheep-looking-at-the-preview-19727.jpg` | 93 KB | Area cards |
| `images.jfif` | 19 KB | Area cards |
| `images (1).jfif` | 65 KB | Area cards |
| `images (2).jfif` | 35 KB | Area cards |

**11 images in the directory are completely UNUSED** (pexels-*, john-fowler, judith-prins, krzysztof, j-schiemann, sam-carter) — total ~25 MB of dead weight. These are served by Vercel but never referenced. They won't be deleted (safe approach) but are noted.

#### Plan

1. **Install `sharp`** as a dev dependency for image processing.
2. **Create a conversion script** (`scripts/optimize-images.js`) that:
   - Converts each actively-used image to WebP (quality 80) at appropriate dimensions:
     - **Hero image** (`derrick-pare`): 1600w and 800w variants
     - **About image** (`kyle-mackie`): 900w and 450w variants
     - **Area card images**: 600w variant (cards render at ~370px on desktop, 600w covers 2x DPI)
   - Outputs to an `images/` subdirectory with clean naming
3. **Update all HTML** references to use `<picture>` with WebP source + JPEG fallback for the hero and about images
4. **Update area card JS** across all 6 pages to reference the optimized WebP images with `width` and `height` attributes
5. **Hero image**: Keep `fetchpriority="high"`, `loading="eager"`, update preload to WebP
6. **Area card images**: Already have `loading="lazy"` ✓ — add `width="600" height="400"` for CLS

#### Aspect Ratio Assessment

- **Hero image**: CSS uses `width:100%; height:100%; object-fit:cover` — this is intentional cover behavior in a full-bleed hero. ✅ No distortion.
- **About image**: CSS uses `width:100%; height:auto; object-fit:cover` — respects natural ratio. ✅ No distortion.
- **Area card images**: CSS uses `height:220px; object-fit:cover` — intentional fixed-height crop. ✅ No distortion, but JS-generated `<img>` tags lack `width`/`height` attributes, causing potential layout shift.

---

### 2. Render-Blocking Resources (Section 8)

#### Critical Finding: `@import` is render-blocking

Every page has this pattern:
```html
<style>@import url('https://fonts.googleapis.com/earlyaccess/droidarabickufi.css');</style>
<link rel="stylesheet" href="style.css">
```

**The `@import` inside `<style>` is severely render-blocking.** The browser discovers the `@import` only after parsing the `<style>` tag, then must fetch the external CSS before rendering can proceed. This creates a sequential blocking chain.

**Fix:** Replace the `@import` with a `<link>` tag using the `media` print trick for non-blocking load + `font-display: swap` (already handled by the Google Fonts API with `&display=swap` appended).

Also: **Duplicate `<link rel="preconnect">`** tags for `fonts.googleapis.com` and `fonts.gstatic.com` exist on all pages (lines 72-73 repeated at lines 83-84). Remove duplicates.

#### Files affected: All 7 HTML files
- [index.html](file:///d:/Qasab%20Web%20Site/index.html) (lines 83-86)
- [mobile-butcher.html](file:///d:/Qasab%20Web%20Site/mobile-butcher.html) (lines 83-86)
- [home-slaughter.html](file:///d:/Qasab%20Web%20Site/home-slaughter.html) (lines 83-86)
- [slaughtered-sheep.html](file:///d:/Qasab%20Web%20Site/slaughtered-sheep.html) (lines 83-86)
- [delivery.html](file:///d:/Qasab%20Web%20Site/delivery.html) (lines 83-86)
- [contact.html](file:///d:/Qasab%20Web%20Site/contact.html) (lines 83-86)
- [404.html](file:///d:/Qasab%20Web%20Site/404.html) (lines 21-24)

**Change for main pages (lines 83-86):**
```diff
-  <link rel="preconnect" href="https://fonts.googleapis.com">
-  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
-  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
-  <style>@import url('https://fonts.googleapis.com/earlyaccess/droidarabickufi.css');</style>
+  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
+  <link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/droidarabickufi.css" media="print" onload="this.media='all'">
```

- Removes duplicate preconnect (already declared 10 lines above)
- Converts render-blocking `@import` → non-blocking `<link>` with print/onload trick
- Droid Arabic Kufi font will load without blocking first paint, then swap in

---

### 3. Subpage Hero Preload Removal (Section 6)

All 5 subpages (mobile-butcher, home-slaughter, slaughtered-sheep, delivery, contact) preload `derrick-pare-TdhqDEjeNuM-unsplash.jpg` but **never render it** — they have no hero image, only text sections. This is a wasted high-priority request.

**Fix:** Remove the `<link rel="preload" as="image" ...>` from all 5 subpages. Keep it only on `index.html` where the hero image actually exists.

Also remove the `preconnect` to `commons.wikimedia.org` and `upload.wikimedia.org` + `dns-prefetch` since those are only used for OG meta images (never fetched by the browser during page load).

---

### 4. Meta Description Length (Section 10)

Current index.html description (132 chars):
> قصاب الكويت الأول - خدمة قصاب متنقل، ذبح منزلي، ذبائح وتوصيل لجميع مناطق الكويت 24 ساعة. تواصل مع أفضل جزار في الكويت الآن: 66714788

**Proposed improvement (~155 chars):**
> قصاب الكويت الأول - خدمة قصاب متنقل، ذبح منزلي شرعي، ذبائح طازجة وتوصيل لجميع مناطق الكويت على مدار 24 ساعة. اتصل الآن أو تواصل عبر واتساب: 66714788

Changes: Added "شرعي" and "طازجة" as value keywords, replaced "تواصل مع أفضل جزار في الكويت الآن" with "اتصل الآن أو تواصل عبر واتساب" for stronger CTA with channel mention.

---

### 5. CDN Usage (Section 7) — **PASS**

Vercel's Edge Network is the CDN layer. All static assets (HTML, CSS, JS, images) are served through it. The `vercel.json` already sets immutable `Cache-Control` headers for images and CSS/JS. No second CDN is needed.

---

### 6. SPF Record (Section 11) — **DNS Not Resolvable**

DNS lookups for both `qassabalkuwait.com` and `www.qassabalkuwait.com` return "Non-existent domain" from Google DNS (8.8.8.8). This likely means:
- The domain may have expired, or
- DNS propagation issue, or
- The domain is configured differently than expected

> [!WARNING]
> Cannot verify SPF/DMARC status without DNS access. This will be reported as "NEEDS VERIFICATION" with general guidance. We will **not** invent any DNS records.

---

### 7. ads.txt (Section 12) — **Not Applicable**

The site uses Google Ads conversion tracking (`AW-18398679267`) for measuring phone/WhatsApp contact conversions. This is **Google Ads (advertising spend)**, not **AdSense (ad revenue/display)**. The site does not display any third-party advertisements. No `ads.txt` is needed.

---

## Open Questions

1. **Unused images (11 files, ~25 MB):** Should we delete the unused image files from the repository to reduce deployment size? They are not referenced anywhere but still deployed. I will leave them in place unless you confirm deletion.

2. **Wikimedia preconnects:** Lines 74-76 on all pages connect to `commons.wikimedia.org` / `upload.wikimedia.org`. These are only used in OG/Twitter meta image URLs — browsers don't fetch these during page load (only social media crawlers use them). Removing these preconnects saves 2-3 unnecessary DNS+TLS handshakes. Safe to remove?

---

## Verification Plan

### Automated Tests
- Run image conversion script and verify output sizes/formats
- `npx serve .` locally and verify in browser that:
  - Hero image loads in WebP with JPEG fallback
  - Area card images load optimized WebP versions
  - No broken images on any page
  - Font loads correctly after `@import` → `<link>` change

### Manual Verification
- Inspect Network tab: confirm WebP served, no duplicate preconnects, no wasted preloads on subpages
- Verify meta description character count
- Check CLS (no layout shift from area card images)
- Confirm font rendering unchanged (Droid Arabic Kufi still loads and displays)
