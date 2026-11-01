/* Momochan — cat particle study (希望 · 愛). Opened by #live-momochanparticles.
   Full-window canvas that resizes with its window, so it simply fills the canvas.
   Colors come from the page's own CSS (--bg, --accent). Fonts follow the site.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('momochanparticles', {
  name: 'Momochan Particle Study',
  url: 'https://vsenses55.github.io/momochan-particles/',
  openLabel: 'Open experience',

  accent: '#b4471f',      /* the page's accent, used for the focus ring */
  stage: '#f3efe7',       /* page background, shows behind the canvas while it loads */

  eyebrow: 'Interactive particles',
  heading: 'Ink drawings of a cat, made of particles',
  intro: [
    'An interactive particle study: ink drawings of a cat, each paired with a kanji for what she’s feeling, 希望 (hope) and 愛 (love). Thousands of particles gather into each drawing and react to the cursor.',
    'Rest your cursor on her, or hold a finger on her on a phone. Switch forces with the panel or keys 1 to 4, press Space to scatter, and use the arrows to move between drawings.'
  ],
  meta: [
    ['Project', 'Personal exploration'],
    ['Role', 'Illustration, concept, front-end'],
    ['Type', 'Interactive particle study']
  ],
  tags: ['Canvas', 'JavaScript', 'GitHub Pages']
});
