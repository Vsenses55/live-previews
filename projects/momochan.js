/* Momochan — Sliced Cat. Opened by #live-momochan.
   Responsive page, so it simply fills the canvas (no `fixed` needed).
   Colors come from the page's own CSS (--plum, --bg). Fonts follow the site.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('momochan', {
  name: 'Momochan Sliced Cat',
  url: 'https://vsenses55.github.io/momochan-cat/',
  openLabel: 'Open experience',

  accent: '#532376',      /* Momochan plum, used for the focus ring */
  stage: '#faf5eb',       /* page background, shows behind the canvas while it loads */

  eyebrow: '3D sound experience',
  heading: 'A sitting cat cut into steel plates',
  intro: [
    'Inspired by a sliced stainless-steel figure sculpture, Momochan is a cat rebuilt in Three.js from 44 parallel plates. Each plate is an instrument: run the cursor across them to strike notes and wake translucent color.',
    'Drag to orbit. Turn the cat nose-on and it dissolves into lines. Turn the sound on in the panel, and try the material, color and motion settings or explode the plates apart.'
  ],
  meta: [
    ['Project', 'Personal exploration'],
    ['Role', 'Concept, 3D, sound, front-end'],
    ['Type', 'Interactive 3D sound piece']
  ],
  tags: ['Three.js', 'Web Audio', 'WebGL', 'GitHub Pages']
});
