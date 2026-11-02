/* Lead From Behind (Colorectal Cancer Alliance) — responsive website. Opened by #live-lfb.
   Responsive page, so it simply fills the canvas (no `fixed` or `phone` needed).
   Not the same as the LFB design system popup (#ds-lfb); the two never interact.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('lfb', {
  name: 'Lead From Behind',
  url: 'https://vsenses55.github.io/lead-from-behind/',
  openLabel: 'Open site',

  accent: '#0072ca',      /* LFB blue (Donate button), used for the focus ring */
  stage: '#ffffff',       /* page background, shows behind the canvas while it loads */

  eyebrow: 'Responsive website',
  heading: 'Making colon cancer famous',
  intro: [
    'Lead From Behind is the Colorectal Cancer Alliance’s campaign to make colon cancer famous, so more people get screened. The site shares the facts about the preventable cancer, shows how to prevent it, and invites visitors to join, act and donate.',
    'It started as a Figma Make design system export and was developed into a working site with Claude. Scroll inside the preview to move through the page.'
  ],
  meta: [
    ['Client', 'Colorectal Cancer Alliance'],
    ['Role', 'Design, front-end'],
    ['Type', 'Responsive website']
  ],
  tags: ['Figma Make', 'React', 'Claude', 'GitHub Pages']
});
