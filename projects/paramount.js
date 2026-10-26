/* Paramount VX — virtual event platform landing page. Opened by #live-paramount.
   Responsive page, so it simply fills the canvas (no `fixed` needed).
   Not the same as the Paramount design system popup (#ds-paramount); the two never interact.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('paramount', {
  name: 'Paramount VX',
  url: 'https://vsenses55.github.io/paramount-vx/',
  openLabel: 'Open site',

  stage: '#01010e',       /* page background, shows behind the canvas while it loads */

  eyebrow: 'Landing page',
  heading: 'A cinematic front door for a virtual event platform',
  intro: [
    'VX is Paramount’s metaverse platform for live, fully customizable 3D events. The landing page introduces it in a dark, cinematic style, from the opening scene through storytelling, live moments, social features and a request for a demo.',
    'I designed it in Figma and built it by hand in HTML, CSS and JavaScript with Claude Code, adding an aurora background, a lens-warp effect and a cursor trail. Scroll inside the preview to move through the page.'
  ],
  meta: [
    ['Client', 'Paramount'],
    ['Role', 'Design, front-end'],
    ['Type', 'Responsive landing page']
  ],
  tags: ['Figma', 'Claude Code', 'HTML/CSS/JS', 'GitHub Pages']
});
