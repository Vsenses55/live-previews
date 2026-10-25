/* PXL Agency — 3D logo exploration. Opened by #live-pxl.
   Colors come from the viewer's own CSS (--coral, --paper). Fonts follow the site (Merriweather / Montserrat).
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('pxl', {
  name: 'PXL Agency Design Exploration',
  url: 'https://vsenses55.github.io/pxl-3d-viewer/',
  openLabel: 'Open viewer',

  accent: '#fa4f68',      /* PXL coral, used for the focus ring */
  stage: '#17111a',       /* PXL paper, shows behind the canvas while it loads */

  eyebrow: '3D exploration',
  heading: 'Bringing the PXL mark into 3D',
  intro: [
    'The PXL logo started as a Blender asset. I cleaned up the model and rebuilt it as an interactive web viewer, so the mark can be turned, zoomed and lit in the browser instead of shown as a still render.',
    'Drag to orbit the logo and scroll to zoom. Use the full-screen button, or open the viewer in its own tab.'
  ],
  meta: [
    ['Client', 'PXL Agency'],
    ['Role', 'Visual design, 3D, front-end'],
    ['Type', 'Interactive 3D viewer']
  ],
  tags: ['Blender', 'Three.js', 'glTF', 'GitHub Pages']
});
