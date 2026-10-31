/* Fountain Court — interactive splash pad. Opened by #live-fountaincourt.
   Full-window Three.js scene that resizes with its window, so it simply fills the canvas.
   Colors come from the page's own CSS (--accent, page background). Fonts follow the site.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('fountaincourt', {
  name: 'Fountain Court',
  url: 'https://vsenses55.github.io/fountain-court/',
  openLabel: 'Open experience',

  accent: '#b98cff',      /* the page's accent purple, used for the focus ring */
  stage: '#1a1820',       /* page background, shows behind the canvas while it loads */

  eyebrow: 'Interactive 3D',
  heading: 'An interactive splash pad in the browser',
  intro: [
    'Fountain Court is a plaza fountain built in Three.js, with reflective wet pavement, water jets, mist, lighting and sound. Shows, loops and camera views can be switched from its controls.',
    'Drag to look around 360°, and tap the plaza to trigger the jets. Turn the sound on in its controls, and use the full-screen button for the best view.'
  ],
  meta: [
    ['Project', 'Personal exploration'],
    ['Role', 'Concept, 3D, front-end'],
    ['Type', 'Interactive 3D scene']
  ],
  tags: ['Three.js', 'WebGL', 'Web Audio', 'GitHub Pages']
});
