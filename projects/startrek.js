/* Star Trek — Shuttlecraft Asteroid Sector. Opened by #live-startrek.
   The page is a fixed 1920x1080 stage that scales itself to the window and keeps a 16–48px
   black margin. `fixed` tells the popup that stage size and margin rule, so it can crop the
   margin and show the stage edge to edge at any size.
   If the page's margin rule in fit() ever changes, update `pad` to match.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('startrek', {
  name: 'Star Trek Game Interface',
  url: 'https://vsenses55.github.io/Star-Trek-Asteroids/',
  openLabel: 'Open game',

  stage: '#000000',
  fixed: {
    width: 1920,
    height: 1080,
    pad: function (w) { return Math.round(Math.min(48, Math.max(16, w * 0.025))); }
  },

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
