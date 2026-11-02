/* Sherri Show TV — responsive website prototype. Opened by #live-sherri.
   Responsive page, so it simply fills the canvas (no `fixed` or `phone` needed).
   Not the same as the Sherri design system popup (#ds-sherri); the two never interact.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('sherri', {
  name: 'Sherri Show',
  url: 'https://vsenses55.github.io/sherri-show-tv/',
  openLabel: 'Open site',

  accent: '#fe6265',      /* the site's coral, used for the focus ring */
  stage: '#ffffff',       /* page background, shows behind the canvas while it loads */

  eyebrow: 'Responsive website',
  heading: 'A home for the Sherri show online',
  intro: [
    'A responsive website prototype for Sherri, the daytime talk show. It brings together local airtimes by ZIP code, the latest episodes, videos, giveaways and articles, with a ticker for upcoming guests and specials.',
    'It started as a Figma Make prototype and was developed into a working site with Claude. Scroll inside the preview to move through the page.'
  ],
  meta: [
    ['Client', 'Sherri'],
    ['Role', 'Design, front-end'],
    ['Type', 'Responsive website']
  ],
  tags: ['Figma Make', 'React', 'Claude', 'GitHub Pages']
});
