/* New York State Fair app (The Fair + Fairgrounds). Opened by #live-nysf.
   Mobile-first, so `phone` shows it at phone width in a centered phone frame on wide screens
   and lets it fill the canvas on a phone. `appFrame` uses the app's own 600px+ phone layout
   inside the frame, cropped to its device, so the scrollbar stays hidden and content centered.
   Not the same as the NYSF design system popup (#ds-nysf); the two never interact.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('nysf', {
  name: 'New York State Fair App',
  url: 'https://vsenses55.github.io/nysf-mobile-app/',
  openLabel: 'Open prototype',

  accent: '#098944',      /* NYSF primary green, used for the focus ring */
  stage: '#0A0F12',       /* the app's darkest neutral; fills the screen in full-screen view */
  phone: {
    width: 430, height: 932, screen: '#19262D',
    /* At 600px+ wide and 500px+ tall the app draws its own 430px device (hidden scrollbar),
       centered with 24px above and below. The popup hands it that window and crops to the device. */
    appFrame: { width: 600, padY: 24, minHeight: 500 }
  },

  eyebrow: 'Mobile app prototype',
  heading: 'One app for the Fair and the Fairgrounds',
  intro: [
    'A mobile app prototype for the New York State Fair and the Fairgrounds that host events all year. Visitors can buy tickets, plan their visit, find parking, and browse concerts, shows, food and the midway.',
    'Tap through it the way you would on a phone.'
  ],
  meta: [
    ['Client', 'New York State Fair'],
    ['Role', 'UX/UI design, front-end'],
    ['Type', 'Mobile app prototype']
  ],
  tags: ['Figma', 'React', 'Vite', 'GitHub Pages']
});
