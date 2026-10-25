/* Star Trek — Shuttlecraft Asteroid Sector. Opened by #live-startrek.
   The page fills the whole window with the 3D scene and scales its 1920x1080 HUD to fit,
   so it simply fills the canvas (no `fixed` needed).
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('startrek', {
  name: 'Star Trek Game Interface',
  url: 'https://vsenses55.github.io/Star-Trek-Asteroids/',
  openLabel: 'Open game',

  stage: '#000000',

  eyebrow: 'Game interface',
  heading: 'Flying the shuttlecraft through an asteroid sector',
  intro: [
    'A playable cockpit HUD built in Three.js: velocity, heading, phasers, shields and a countdown clock sit over a live 3D asteroid field. Each round sends more debris and gets harder to clear.',
    'Click the game to engage. WASD dodges, E and Q thrust and brake, Space fires, and Esc pauses. Press T for a time trial, and use the full-screen button for the best view.'
  ],
  meta: [
    ['Client', 'Star Trek'],
    ['Role', 'Interface design, 3D, front-end'],
    ['Type', 'Playable game interface']
  ],
  tags: ['Three.js', 'WebGL', 'HTML/CSS', 'GitHub Pages']
});
