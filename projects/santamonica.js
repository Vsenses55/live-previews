/* City of Santa Monica — Big Blue Bus mobile prototype. Opened by #live-santamonica.
   Mobile-first, so `phone` shows it at phone width in a centered phone frame on wide screens
   (matching the prototype's own desktop view) and lets it fill the canvas on a phone.
   Not the same as the Big Blue Bus design system popup (#ds-bbb); the two never interact.
   Copy below is a DRAFT: edit intro/meta to match the case study. */
LivePopup.register('santamonica', {
  name: 'City of Santa Monica: Big Blue Bus',
  url: 'https://vsenses55.github.io/city-santa-monica-prototype/',
  openLabel: 'Open prototype',

  accent: '#005EB8',      /* Big Blue Bus interactive primary, used for the focus ring */
  stage: '#0B0F12',       /* the prototype's own desktop backdrop; fills the screen in full-screen view */
  phone: { width: 390, height: 844, screen: '#FFFFFF' },

  eyebrow: 'Mobile prototype',
  heading: 'Finding a Big Blue Bus route on the go',
  intro: [
    'A mobile-first prototype for the City of Santa Monica’s Big Blue Bus. Riders pick a route from a full list or their recently visited routes, check service alerts, view schedules and stops on a map, and plan a trip.',
    'Schedules come from Big Blue Bus’s published GTFS data, and service alerts come from its live feed when it can be reached. Tap through it the way you would on a phone.'
  ],
  meta: [
    ['Client', 'City of Santa Monica'],
    ['Role', 'UX/UI design, front-end'],
    ['Type', 'Mobile web prototype']
  ],
  tags: ['Figma', 'HTML/CSS/JS', 'GTFS data', 'Leaflet', 'GitHub Pages']
});
