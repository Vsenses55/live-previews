# Live previews

A full-screen popup on visualsenses.design that shows a live site (a 3D viewer, a prototype, a microsite) in a large canvas, with optional project notes below it.

It is separate from the design-system popup (`design-systems/ds-engine.js`). It has its own script, its own links (`#live-<id>`), and its own styles (`#lv-popup`, `.lv-*`). Neither popup reacts to the other's links.

```
live-engine.js     the popup: sheet, canvas, reload / full screen / open buttons, notes
projects/pxl.js        PXL Agency 3D logo viewer
projects/startrek.js   Star Trek asteroid game (fixed 1920×1080 stage)
projects/momochan.js   Momochan sliced cat (3D sound piece)
projects/paramount.js  Paramount VX landing page
projects/santamonica.js  City of Santa Monica Big Blue Bus mobile prototype (phone frame)
projects/nysf.js       New York State Fair app (phone frame)
projects/fairmatch.js  NYS Fair Match game (fixed 1366×1024 stage, never above 100%)
index.html         test page listing every project
```

## Install on Webflow (once)

Site Settings → Custom Code → Footer code, on its own line under the design-system script:

```html
<script src="https://vsenses55.github.io/live-previews/live-engine.js" defer></script>
```

## Open a preview

| From | Do this |
| --- | --- |
| Any link or button | Set its URL to `#live-<id>`, e.g. `#live-pxl`. Same tab. |
| A circle button component | Set its **Link** prop to `#live-<id>`. |
| An image, card or div | Add the attribute `data-live-open` = `<id>`. |
| Another page | Link to `/projects/pxl-agency#live-pxl`; the popup opens on arrival. |
| No project file | Add `data-live-src` = the site URL and `data-live-title` = its name. No notes are shown. |

The engine catches these clicks before Webflow interactions run, so a Page Out animation on the button does not fire.

## Add a project

1. Copy `projects/pxl.js` to `projects/<id>.js` (lowercase, no spaces).
2. Change `LivePopup.register('pxl', …)` to the new id.
3. Set `name`, `url` and `openLabel`. Optional: `font`, `fontUrl`, `accent` (focus ring), `stage` (color behind the canvas while it loads).
4. Notes below the canvas: `eyebrow`, `heading`, `intro` (one string or a list of paragraphs), `meta` (label/value pairs) and `tags`. Leave them all out and the popup is canvas only.
5. Add a link to `index.html`, then commit and push with GitHub Desktop.

## What can be shown

Only sites that allow being framed. GitHub Pages sites do. Webflow pages (including visual-senses-design.webflow.io) do not: they send `X-Frame-Options: SAMEORIGIN`.

## Updating

Edit the file and push. GitHub Pages can cache files for up to 10 minutes; to force an update, change the script tag to `live-engine.js?v=2` (the version is passed on to every project file).

## Mobile-first pages

For a site designed for phones, add `phone` to the project file. On wide screens the popup shows it at phone width in a centered phone frame, with no background fill around it. On a phone it simply fills the canvas.

```js
phone: { width: 390, height: 844, screen: '#FFFFFF' }
```

`width` and `height` are the phone's screen size; `screen` is the color behind the page while it loads. If the page has its own phone layout on wide windows (a centered device, like NYSF at 600px+), add `appFrame: { width: 600, padY: 24, minHeight: 500 }`: the popup hands the page a window that size and crops to its device, so the page's own hidden scrollbar and centering are used. See `projects/nysf.js`. See `projects/santamonica.js`.

## Fixed-size pages

Some pages are built at one size (for example a 1920×1080 stage) and scale themselves to the window, leaving a margin around the edge. Add `fixed` to the project file and the popup scales the page in proportion, edge to edge, with no margin or background fill:

```js
fixed: { width: 1920, height: 1080, pad: function (w) { return 0; } }
```

`pad` is the margin the page leaves at a given window width. If the top/bottom margin differs from the sides, add `padY` (a number or a function of width). If the page never grows past its native size, add `maxScale: 1` and the popup caps the stage there. See `projects/fairmatch.js`. Copy the page's own rule so the popup can crop it exactly. See `projects/startrek.js`.
