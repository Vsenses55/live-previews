/*!
 * Live Preview popup — Orlando Antonio / visualsenses.design
 * Opens a live site (prototype, 3D viewer, microsite) in a full-screen sheet,
 * with optional project notes below the canvas.
 *
 * Fully separate from the design-system popup (ds-engine.js):
 *   own global (window.LivePopup), own element (#lv-popup), own CSS prefix (lv-),
 *   own links (#live-<id>, data-live-open). It never reacts to #ds- links.
 *
 * Open from any link:        href="#live-<id>"          e.g. #live-pxl
 * Open from any element:     data-live-open="<id>"
 * Deep link from another page: /projects/pxl#live-pxl
 * No project file needed:    data-live-src="https://…" data-live-title="Name"
 *
 * Layout modes (set in a project file):
 *   default   the page fills the canvas (responsive sites, full-window 3D)
 *   phone     a mobile-first page shown at phone width in a centered phone frame on wide
 *             screens; on phones it simply fills the canvas
 *   fixed     a fixed-size stage (e.g. 1920x1080) scaled to fit, its own margin cropped off
 */
(function () {
  'use strict';
  if (window.LivePopup) return;

  var script = document.currentScript || document.querySelector('script[src*="live-engine"]');
  var BASE = script ? script.src.replace(/[^/]*$/, '') : '';
  var VERSION = script && (script.src.split('?')[1] || '');

  var ICON = {
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
    reload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v5h-5"/></svg>',
    full: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'

  };

  /* Same sheet, bar and close button as the design-system popup; everything prefixed lv-. */
  var CSS = [
    '#lv-popup,#lv-popup *{box-sizing:border-box}',
    '#lv-popup h2,#lv-popup h3,#lv-popup p,#lv-popup dl,#lv-popup dd,#lv-popup dt{margin:0;letter-spacing:normal;text-transform:none}',
    '#lv-popup button{text-transform:none;letter-spacing:normal;line-height:normal;margin:0;font:inherit;color:inherit}',
    '#lv-popup a{text-decoration:none}',
    '#lv-popup :focus-visible{outline:2px solid var(--lv-accent);outline-offset:2px}',
    '#lv-popup{--scrim:rgb(0 0 0 / .55);--sheet:#f6f6f4;--ink:#1d1d1b;--muted:#66665f;--line:#e3e3df;--dock:#1d1d1b;--chip:#ebebe7;--ease:cubic-bezier(.2,.8,.2,1);',
    '--lv-font:Merriweather,Georgia,"Times New Roman",serif;--lv-ui:Montserrat,system-ui,-apple-system,"Segoe UI",sans-serif;--lv-accent:#1d1d1b;--lv-on-accent:#fff;--lv-stage:#111;--lv-screen:#fff;--lv-stage-ink:rgb(255 255 255 / .75);--lv-bar-h:65px;',
    'position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;justify-content:flex-end;visibility:hidden}',
    '#lv-popup.is-open,#lv-popup.is-closing{visibility:visible}',
    '#lv-popup .lv-scrim{position:absolute;inset:0;background:var(--scrim);opacity:0;transition:opacity .45s var(--ease)}',
    '#lv-popup .lv-sheet{position:relative;height:calc(100% - 24px - env(safe-area-inset-top,0px));background:var(--sheet);border-radius:16px 16px 0 0;transform:translateY(102%);transition:transform .6s var(--ease);display:flex;flex-direction:column;overflow:hidden;font-family:var(--lv-font);color:var(--ink)}',
    '#lv-popup.is-open .lv-scrim{opacity:1}#lv-popup.is-open .lv-sheet{transform:none}',
    '@media (prefers-reduced-motion:reduce){#lv-popup .lv-scrim,#lv-popup .lv-sheet{transition:none}}',
    '#lv-popup .lv-bar{flex:none;display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:var(--lv-bar-h);padding-block:10px;padding-left:max(24px,env(safe-area-inset-left,0px));padding-right:max(14px,env(safe-area-inset-right,0px));border-bottom:1px solid var(--line)}',
    '#lv-popup .lv-bar h2{font:700 17px/24px var(--lv-font);color:var(--ink);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '#lv-popup .lv-x{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;border:0;background:var(--dock);color:#fff;cursor:pointer;flex:none}',
    '#lv-popup .lv-x:hover{background:#3a3a37}#lv-popup .lv-x svg{width:20px;height:20px}',
    '#lv-popup .lv-scroll{position:relative;flex:1;overflow-y:auto;overscroll-behavior:contain}',
    /* stage: fills the visible sheet; the toolbar sits above the canvas so the canvas never hides controls */
    '#lv-popup .lv-stage{height:calc(100dvh - 24px - env(safe-area-inset-top,0px) - var(--lv-bar-h));min-height:420px;display:flex;flex-direction:column;gap:12px;padding:16px max(16px,env(safe-area-inset-right,0px)) 16px max(16px,env(safe-area-inset-left,0px))}',
    '#lv-popup .lv-scroll.has-notes .lv-stage{height:calc(100dvh - 24px - env(safe-area-inset-top,0px) - var(--lv-bar-h) - 64px)}',
    '#lv-popup .lv-tools{flex:none;display:flex;align-items:center;justify-content:flex-end;gap:12px;min-width:0}',
    '#lv-popup .lv-tgroup{display:flex;align-items:center;gap:8px;min-width:0}',
    '#lv-popup .lv-ib{width:44px;height:44px;display:grid;place-items:center;border-radius:12px;border:1px solid var(--line);background:transparent;color:var(--ink);cursor:pointer;flex:none}',
    '#lv-popup .lv-ib:hover{background:var(--chip)}#lv-popup .lv-ib svg{width:18px;height:18px}',
    '#lv-popup .lv-ib[hidden]{display:none}',
    '#lv-popup .lv-open{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px;border-radius:12px;border:1px solid var(--ink);background:transparent;color:var(--ink);font:600 14px/1 var(--lv-ui);white-space:nowrap;transition:background .15s}',
    '#lv-popup .lv-open:hover{background:var(--chip)}',
    '#lv-popup .lv-open svg{width:16px;height:16px}',
    '#lv-popup .lv-canvas{position:relative;flex:1;min-height:0;border-radius:14px;border:1px solid var(--line);background:var(--lv-stage);overflow:hidden;display:flex;justify-content:center}',
    '#lv-popup .lv-frame{position:relative;width:100%;height:100%}',
    '#lv-popup .lv-frame iframe{display:block;width:100%;height:100%;border:0;background:var(--lv-stage)}',
    '#lv-popup .lv-load{position:absolute;inset:0;display:grid;place-items:center;background:var(--lv-stage);color:var(--lv-stage-ink);font:600 14px/20px var(--lv-ui);transition:opacity .35s var(--ease);pointer-events:none}',
    '#lv-popup .lv-load span{display:inline-flex;align-items:center;gap:10px}',
    '#lv-popup .lv-load span::before{content:"";width:16px;height:16px;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:lv-spin .8s linear infinite}',
    '#lv-popup .lv-canvas.is-loaded .lv-load{opacity:0}',
    /* fixed-stage mode: a fixed-size page scaled to fit, edge to edge, no letterbox fill */
    '#lv-popup .lv-canvas.is-fixed{background:transparent;border:0;border-radius:0;align-items:center}',
    '#lv-popup .lv-canvas.is-fixed .lv-frame{flex:none;overflow:hidden;border-radius:14px;background:var(--lv-stage)}',
    '#lv-popup .lv-canvas.is-fixed .lv-frame iframe{position:absolute;width:auto;height:auto}',
    '#lv-popup .lv-canvas.is-fixed .lv-load{inset:auto;border-radius:14px}',
    '#lv-popup .lv-stage:fullscreen .lv-canvas.is-fixed .lv-frame{border-radius:0}',
    '#lv-popup .lv-scroll.is-short .lv-stage:not(:fullscreen){height:auto;min-height:0}',
    '#lv-popup .lv-scroll.is-short .lv-stage:not(:fullscreen) .lv-canvas{flex:none}',
    /* phone mode: a mobile-first page at phone width, centered in a phone frame, no fill around it */
    '#lv-popup .lv-canvas.is-phone{background:transparent;border:0;border-radius:0;align-items:center;overflow:visible}',
    '#lv-popup .lv-canvas.is-phone .lv-frame{flex:none;width:var(--lv-pw);height:100%;max-height:var(--lv-ph);padding:12px;border-radius:54px;background:#fff;border:1px solid #dcdcd7;box-shadow:0 1px 2px rgb(0 0 0 / .04),0 16px 40px rgb(0 0 0 / .08)}',
    '#lv-popup .lv-canvas.is-phone .lv-frame iframe{border-radius:42px;background:var(--lv-screen);outline:1px solid #e6e6e1;outline-offset:0}',
    /* appFrame: the page has its own phone layout on wide windows (a centered device with a hidden
       scrollbar). The iframe gets a window that size and the screen crops to exactly that device. */
    '#lv-popup .lv-clip{position:relative;width:100%;height:100%;overflow:hidden}',
    '#lv-popup .lv-canvas.is-phone .lv-clip{border-radius:42px;outline:1px solid #e6e6e1;background:var(--lv-screen)}',
    '#lv-popup .lv-canvas.is-phone .lv-clip iframe{border-radius:0;outline:0}',
    '#lv-popup .lv-canvas.is-appframe .lv-clip iframe{position:absolute;width:var(--lv-aw);height:calc(100% + 2 * var(--lv-apy));left:calc(50% - var(--lv-aw) / 2);top:calc(-1 * var(--lv-apy));max-width:none}',
    '#lv-popup .lv-canvas.is-phone .lv-load{background:transparent;color:var(--muted)}',
    '#lv-popup .lv-stage:fullscreen .lv-canvas.is-phone .lv-load{color:rgb(255 255 255 / .7)}',
    '@keyframes lv-spin{to{transform:rotate(1turn)}}',
    '@media (prefers-reduced-motion:reduce){#lv-popup .lv-load span::before{animation:none}}',
    '#lv-popup .lv-stage:fullscreen{background:var(--lv-stage);padding:12px}',
    '#lv-popup .lv-stage:fullscreen .lv-canvas{border-color:transparent}',
    '#lv-popup .lv-stage:fullscreen .lv-ib,#lv-popup .lv-stage:fullscreen .lv-open{background:#fff}',
    /* notes below the canvas */
    '#lv-popup .lv-notes{border-top:1px solid var(--line);scroll-margin-top:0}',
    '#lv-popup .lv-notes[hidden]{display:none}',
    '#lv-popup .lv-inner{max-width:1180px;margin:0 auto;padding:56px max(24px,env(safe-area-inset-right,0px)) 96px max(24px,env(safe-area-inset-left,0px));display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:64px;align-items:start}',
    '#lv-popup .lv-eyebrow{font:600 12px/20px var(--lv-ui);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:10px}',
    '#lv-popup .lv-copy h3{font:400 36px/1.4 var(--lv-font);color:#000;margin-bottom:16px;text-wrap:balance}',
    '#lv-popup .lv-copy p{font:400 16px/1.7 var(--lv-font);color:#000;max-width:64ch}',
    '#lv-popup .lv-copy p + p{margin-top:16px}',
    '#lv-popup .lv-copy h4{font:700 19px/1.4 var(--lv-font);color:var(--ink);margin:36px 0 10px}',
    '#lv-popup .lv-copy ul{margin:0;padding-left:20px;font:400 16px/1.7 var(--lv-font);color:#000}',
    '#lv-popup .lv-meta{border:1px solid var(--line);border-radius:14px;padding:8px 24px}',
    '#lv-popup .lv-meta div{padding:16px 0}#lv-popup .lv-meta div + div{border-top:1px solid var(--line)}',
    '#lv-popup .lv-meta dt{font:600 11px/18px var(--lv-ui);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:4px}',
    '#lv-popup .lv-meta dd{font:400 15px/1.5 var(--lv-font);color:#000}',
    '#lv-popup .lv-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}',
    '#lv-popup .lv-tags span{padding:4px 10px;border-radius:999px;background:var(--chip);font:500 12px/18px var(--lv-ui);color:var(--ink)}',
    '#lv-popup .lv-error{padding:48px 24px;font:500 16px/26px var(--lv-font);color:var(--muted)}',
    '@media (max-width:900px){#lv-popup .lv-inner{grid-template-columns:minmax(0,1fr);gap:32px;padding-top:40px}}',
        '@media (max-width:560px){#lv-popup .lv-bar{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(10px,env(safe-area-inset-right,0px))}',
    '#lv-popup .lv-stage{padding:12px max(12px,env(safe-area-inset-right,0px)) 12px max(12px,env(safe-area-inset-left,0px));min-height:360px}',
    '#lv-popup .lv-open span{display:none}#lv-popup .lv-open{width:44px;padding:0;justify-content:center}',
    '#lv-popup .lv-inner{padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}',
    '#lv-popup .lv-copy h3{font-size:28px}}'
  ].join('');

  var registry = {}, pending = {}, root = null, current = null, fixed = null, phone = null, lastFocus = null, closeT = 0;

  function isLight(hex) {
    var m = String(hex).replace('#', ''); if (m.length === 3) m = m.replace(/./g, '$&$&');
    if (!/^[0-9a-f]{6}/i.test(m)) return false;
    var r = parseInt(m.slice(0, 2), 16), g = parseInt(m.slice(2, 4), 16), b = parseInt(m.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function q(s) { return root.querySelector(s); }

  /* ---------- shell ---------- */
  function ensureRoot() {
    if (root) return root;
    if (!document.querySelector('link[href*="Merriweather"]')) {
      var fl = document.createElement('link'); fl.rel = 'stylesheet';
      fl.href = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Montserrat:wght@500;600&display=swap';
      document.head.appendChild(fl);
    }
    var st = document.createElement('style'); st.id = 'lv-popup-css'; st.textContent = CSS; document.head.appendChild(st);
    root = document.createElement('div');
    root.id = 'lv-popup'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-hidden', 'true'); root.setAttribute('aria-labelledby', 'lv-popup-title');
    root.innerHTML =
      '<div class="lv-scrim" data-lv-close></div>' +
      '<div class="lv-sheet">' +
        '<header class="lv-bar"><h2 id="lv-popup-title"></h2><button class="lv-x" type="button" data-lv-close aria-label="Close preview">' + ICON.x + '</button></header>' +
        '<div class="lv-scroll">' +
          '<section class="lv-stage" aria-label="Live preview">' +
            '<div class="lv-tools">' +
              '<div class="lv-tgroup">' +
                '<button class="lv-ib" type="button" data-lv-reload aria-label="Reload preview" title="Reload">' + ICON.reload + '</button>' +
                '<button class="lv-ib" type="button" data-lv-full aria-label="View full screen" title="Full screen">' + ICON.full + '</button>' +
                '<a class="lv-open" target="_blank" rel="noopener"><span>Open site</span>' + ICON.out + '</a>' +
              '</div>' +
            '</div>' +
            '<div class="lv-canvas"><div class="lv-frame"></div><div class="lv-load" aria-hidden="true"><span>Loading live preview</span></div></div>' +
          '</section>' +
          '<section class="lv-notes" hidden></section>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    root.querySelectorAll('[data-lv-close]').forEach(function (b) { b.addEventListener('click', close); });
    q('[data-lv-reload]').addEventListener('click', function () { var f = q('.lv-frame iframe'); if (f) mountFrame(f.getAttribute('src')); });
    q('[data-lv-full]').addEventListener('click', toggleFull);
    if (window.ResizeObserver) new ResizeObserver(layout).observe(q('.lv-canvas'));
    else window.addEventListener('resize', layout);
    guardScroll(q('.lv-scroll'));
    document.addEventListener('fullscreenchange', function () {
      var on = document.fullscreenElement === q('.lv-stage');
      q('[data-lv-full]').setAttribute('aria-label', on ? 'Exit full screen' : 'View full screen');
    });
    return root;
  }

  /* Fixed-stage pages (e.g. a 1920x1080 stage that scales itself to the window and keeps its own
     margin): size the iframe so that page's stage lands exactly on the visible box, then crop the
     margin off. The page renders at its real on-screen size, so it stays sharp and clicks line up. */
  function layout() {
    var canvas = q('.lv-canvas'), frame = q('.lv-frame'), load = q('.lv-load'), f = frame.querySelector('iframe');
    /* Phone mode: on wide canvases show the page at phone width in a centered frame (12px bezel
       + 1px border each side); on narrow ones (a real phone) let it fill the canvas. */
    if (phone) {
      var pw = phone.width + 26, ph = phone.height + 26;
      canvas.style.setProperty('--lv-pw', pw + 'px'); canvas.style.setProperty('--lv-ph', ph + 'px');
      canvas.classList.toggle('is-phone', canvas.clientWidth >= pw + 64);
      /* appFrame: only when the window we hand the page is tall enough for its own phone layout */
      var af = phone.appFrame, clipEl = frame.querySelector('.lv-clip');
      var useAf = !!(af && clipEl && canvas.classList.contains('is-phone') && clipEl.clientHeight + 2 * af.padY >= af.minHeight);
      canvas.classList.toggle('is-appframe', useAf);
      if (af) { canvas.style.setProperty('--lv-aw', af.width + 'px'); canvas.style.setProperty('--lv-apy', af.padY + 'px'); }
    } else { canvas.classList.remove('is-phone', 'is-appframe'); canvas.style.removeProperty('--lv-pw'); canvas.style.removeProperty('--lv-ph'); }
    var sc = q('.lv-scroll'), stage = q('.lv-stage');
    if (!fixed) { frame.removeAttribute('style'); load.removeAttribute('style'); canvas.style.height = ''; sc.classList.remove('is-short'); return; }
    /* Narrow, tall screens: let the canvas shrink to the stage's height so the notes follow it. */
    var full = document.fullscreenElement === stage;
    var room = sc.clientHeight - (sc.classList.contains('has-notes') ? 64 : 0) - q('.lv-tools').offsetHeight - 12 - 32;
    var short = !full && canvas.clientWidth * fixed.height / fixed.width < room - 48;
    sc.classList.toggle('is-short', short);
    canvas.style.height = short ? Math.ceil(canvas.clientWidth * fixed.height / fixed.width) + 'px' : '';
    var W = fixed.width, H = fixed.height, padFn = fixed.pad || function () { return 0; };
    var cw = canvas.clientWidth, ch = canvas.clientHeight;
    if (!cw || !ch) return;
    var dw = Math.max(1, Math.floor(Math.min(cw, ch * W / H)));   /* visible width, whole pixels */
    var s = dw / W, dh = H * s;
    var p = padFn(dw), iw = dw + 2 * p;
    for (var i = 0; i < 6; i++) { var np = padFn(iw); if (np === p) break; p = np; iw = dw + 2 * p; }
    var ih = Math.ceil(dh) + 2 * p + 2;                            /* a little extra height so width sets the scale */
    frame.style.width = dw + 'px'; frame.style.height = dh + 'px';
    load.style.width = dw + 'px'; load.style.height = dh + 'px';
    load.style.left = (cw - dw) / 2 + 'px'; load.style.top = (ch - dh) / 2 + 'px';
    if (f) { f.style.width = iw + 'px'; f.style.height = ih + 'px'; f.style.left = -p + 'px'; f.style.top = -(ih - dh) / 2 + 'px'; }
  }

  /* Some browsers (Safari) let scrollIntoView() inside the preview scroll the popup itself, which
     pulls the canvas out of view (e.g. a map that expands and scrolls a list item into view).
     While focus is inside the preview, undo any popup scroll that didn't come from the viewer's
     own wheel, touch, keys or scrollbar on the popup. */
  var intentAt = 0;
  function guardScroll(sc) {
    var last = 0, mark = function () { intentAt = Date.now(); };
    ['wheel', 'touchstart', 'touchmove', 'pointerdown'].forEach(function (t) { sc.addEventListener(t, mark, { passive: true }); });
    document.addEventListener('keydown', function () { if (root && root.classList.contains('is-open')) mark(); });
    sc.addEventListener('scroll', function () {
      var f = q('.lv-frame iframe');
      var inPreview = f && document.activeElement === f;
      if (inPreview && Date.now() - intentAt > 800 && Math.abs(sc.scrollTop - last) > 1) { sc.scrollTop = last; return; }
      last = sc.scrollTop;
    }, { passive: true });
  }

  function mountFrame(src, title) {
    var canvas = q('.lv-canvas'), frame = q('.lv-frame');
    canvas.classList.remove('is-loaded');
    frame.innerHTML = '';
    var f = document.createElement('iframe');
    f.title = title || q('#lv-popup-title').textContent || 'Live preview';
    f.setAttribute('allow', 'fullscreen; autoplay; xr-spatial-tracking; accelerometer; gyroscope; clipboard-write; gamepad');
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    /* Lift the loading cover on load, or after 4s for pages that keep pulling in heavy media
       after they are already visible. */
    clearTimeout(mountFrame.t);
    mountFrame.t = setTimeout(function () { canvas.classList.add('is-loaded'); }, 4000);
    f.addEventListener('load', function () { clearTimeout(mountFrame.t); canvas.classList.add('is-loaded'); });
    f.src = src;
    if (phone && phone.appFrame) {
      var clip = document.createElement('div'); clip.className = 'lv-clip';
      clip.appendChild(f); frame.appendChild(clip);
    } else frame.appendChild(f);
    layout();
  }

  function toggleFull() {
    var stage = q('.lv-stage');
    if (document.fullscreenElement) { document.exitFullscreen(); return; }
    if (stage.requestFullscreen) stage.requestFullscreen().catch(function () {});
    else { var f = q('.lv-frame iframe'); if (f) window.open(f.src, '_blank', 'noopener'); }
  }

  function notesHtml(C) {
    var meta = (C.meta || []).filter(function (m) { return m && m[1]; });
    if (!C.intro && !C.body && !meta.length && !(C.tags || []).length) return '';
    var h = '<div class="lv-inner"><div class="lv-copy">';
    if (C.eyebrow) h += '<div class="lv-eyebrow">' + esc(C.eyebrow) + '</div>';
    h += '<h3>' + esc(C.heading || C.name) + '</h3>';
    if (C.intro) h += (Array.isArray(C.intro) ? C.intro : [C.intro]).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
    if (C.body) h += C.body; /* trusted HTML from the project file */
    h += '</div>';
    if (meta.length || (C.tags || []).length) {
      h += '<dl class="lv-meta">' + meta.map(function (m) { return '<div><dt>' + esc(m[0]) + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join('');
      if ((C.tags || []).length) h += '<div><dt>' + esc(C.tagsLabel || 'Built with') + '</dt><dd class="lv-tags">' + C.tags.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</dd></div>';
      h += '</dl>';
    }
    return h + '</div>';
  }

  function load(id) {
    if (registry[id]) return Promise.resolve(registry[id]);
    if (pending[id]) return pending[id];
    pending[id] = new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = BASE + 'projects/' + id + '.js' + (VERSION ? '?' + VERSION : '');
      s.onload = function () { registry[id] ? res(registry[id]) : rej(new Error('projects/' + id + '.js did not register "' + id + '"')); };
      s.onerror = function () { rej(new Error('Could not load projects/' + id + '.js')); };
      document.head.appendChild(s);
    });
    pending[id].catch(function () { delete pending[id]; });
    return pending[id];
  }

  /* ---------- open / close ---------- */
  function show(C, key) {
    root.setAttribute('style', [
      C.font ? '--lv-font:' + C.font : '',
      C.accent ? '--lv-accent:' + C.accent : '',
      C.onAccent ? '--lv-on-accent:' + C.onAccent : '',
      C.stage ? '--lv-stage:' + C.stage : '',
      C.stage && isLight(C.stage) ? '--lv-stage-ink:rgb(0 0 0 / .6)' : '',
      C.phone && C.phone.screen ? '--lv-screen:' + C.phone.screen : ''
    ].filter(Boolean).join(';'));
    if (C.fontUrl && !document.querySelector('link[data-lv-font="' + key + '"]')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = C.fontUrl; l.setAttribute('data-lv-font', key); document.head.appendChild(l); }
    q('#lv-popup-title').textContent = C.name || 'Live preview';
    q('.lv-x').setAttribute('aria-label', 'Close ' + (C.name || 'preview'));
    var a = q('.lv-open'); a.href = C.url; a.querySelector('span').textContent = C.openLabel || 'Open site';
    a.setAttribute('aria-label', (C.openLabel || 'Open site') + ' in a new tab'); a.title = C.openLabel || 'Open site';
    var notes = q('.lv-notes'), html = notesHtml(C);
    notes.innerHTML = html; notes.hidden = !html; q('.lv-scroll').classList.toggle('has-notes', !!html);
    fixed = C.fixed || null;
    phone = fixed ? null : (C.phone ? { width: C.phone.width || 390, height: C.phone.height || 844, screen: C.phone.screen, appFrame: C.phone.appFrame ? { width: C.phone.appFrame.width || 600, padY: C.phone.appFrame.padY || 0, minHeight: C.phone.appFrame.minHeight || 0 } : null } : null);
    q('.lv-canvas').classList.toggle('is-fixed', !!fixed);
    current = key;
    intentAt = Date.now(); q('.lv-scroll').scrollTop = 0;
    mountFrame(C.url, C.name);
  }

  function open(id, inline) {
    ensureRoot();
    clearTimeout(closeT);
    if (!root.classList.contains('is-open')) lastFocus = document.activeElement;
    root.classList.remove('is-closing'); root.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { root.classList.add('is-open'); q('.lv-x').focus({ preventScroll: true }); });
    if (inline) { show(inline, 'inline:' + inline.url); return; }
    q('#lv-popup-title').textContent = 'Loading…';
    load(id).then(function (C) { show(C, id); }).catch(function (err) {
      q('#lv-popup-title').textContent = 'Preview unavailable';
      q('.lv-frame').innerHTML = '<p class="lv-error">This preview could not be loaded. Check your connection and try again.</p>';
      fixed = null; phone = null; q('.lv-canvas').classList.remove('is-fixed'); layout();
      q('.lv-canvas').classList.add('is-loaded');
      current = null;
      if (window.console) console.warn('[LivePopup]', err.message);
    });
  }

  function close(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!root || !root.classList.contains('is-open')) return;
    if (document.fullscreenElement) document.exitFullscreen().catch(function () {});
    root.classList.remove('is-open'); root.classList.add('is-closing'); root.setAttribute('aria-hidden', 'true');
    closeT = setTimeout(function () {
      root.classList.remove('is-closing'); document.documentElement.style.overflow = '';
      q('.lv-frame').innerHTML = ''; current = null; fixed = null; phone = null; q('.lv-scroll').classList.remove('is-short'); q('.lv-canvas').classList.remove('is-fixed'); layout(); /* unload the site so 3D, audio and video stop */
    }, 600);
    if (history.replaceState && /#live-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function idFromHref(href) { var m = href && href.match(/#live-([a-z0-9_-]+)$/i); return m ? m[1].toLowerCase() : null; }

  /* Capture phase, so Webflow interactions (Page Out, liquid transition) on the trigger do not fire. */
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var t = e.target.closest('[data-live-open], [data-live-src], a[href*="#live-"]');
    if (!t || (root && root.contains(t))) return;
    if (t.hasAttribute('data-live-src')) {
      e.preventDefault(); e.stopPropagation();
      open(null, { url: t.getAttribute('data-live-src'), name: t.getAttribute('data-live-title') || 'Live preview' });
      return;
    }
    var id = t.getAttribute('data-live-open') || idFromHref(t.getAttribute('href'));
    if (!id) return;
    var href = t.getAttribute('href') || '';
    var samePage = !/^https?:|^\//.test(href) || href.split('#')[0] === '' || href.split('#')[0].replace(/\/$/, '') === location.pathname.replace(/\/$/, '');
    if (t.hasAttribute('data-live-open') || samePage) { e.preventDefault(); e.stopPropagation(); open(id); }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (!root || !root.classList.contains('is-open')) return;
    if (e.key === 'Escape' && !document.fullscreenElement) { close(e); return; }
    if (e.key === 'Tab') {
      var f = Array.prototype.filter.call(root.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex="0"]'), function (x) { return x.offsetParent !== null && x.tabIndex > -1; });
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    }
  });

  function fromHash() { var id = idFromHref(location.hash); if (id) open(id); }
  window.addEventListener('hashchange', fromHash);

  window.LivePopup = {
    register: function (id, config) { registry[id] = config; },
    open: function (idOrConfig) { typeof idOrConfig === 'object' ? open(null, idOrConfig) : open(idOrConfig); },
    close: close
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fromHash); else fromHash();
})();
