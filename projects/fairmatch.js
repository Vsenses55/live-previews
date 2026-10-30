/* NYS Fair Match — match-3 game. Opened by #live-fairmatch.
   The game is a fixed 1366x1024 stage, centered, never scaled above 100%, with a 48px
   margin above and below (app.js fitScreen). `fixed` tells the popup that rule, so it crops
   the margin and shows the stage edge to edge, scaled down proportionally on smaller screens.
   If fitScreen() changes (size, MARGIN_Y or the 100% cap), update `fixed` to match.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('fairmatch', {
  name: 'NYS Fair Match',
  url: 'https://vsenses55.github.io/nysf-fair-match/',
  openLabel: 'Open game',

  accent: '#3fae5e',      /* the game's fair green, used for the focus ring */
  stage: '#1b1230',       /* the game's page background, shows while it loads */
  fixed: {
    width: 1366,
    height: 1024,
    maxScale: 1,
    pad: function () { return 0; },
    padY: 48
  },

  eyebrow: 'Match-3 game',
  heading: 'A match-3 game for the Great New York State Fair',
  intro: [
    'NYS Fair Match is a browser game built from my Figma designs. Players pick a theme, then match three or more fair treats to reach the score goal before the moves and the 90-second clock run out. Bigger combos earn bigger bonuses, and the bonus item scores double.',
    'Pick a theme and press Start Playing. Drag a treat onto a neighbor to swap them.'
  ],
  meta: [
    ['Client', 'New York State Fair'],
    ['Role', 'Game design, UI, front-end'],
    ['Type', 'Browser game']
  ],
  tags: ['Figma', 'HTML/CSS/JS', 'Web Audio', 'GitHub Pages']
});
