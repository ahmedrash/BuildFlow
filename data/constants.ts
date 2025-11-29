
import { PageElement } from '../types';

export const FONT_FAMILIES = [
  'Inherit', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Playfair Display', 'Oswald', 'Raleway', 'Poppins', 'Merriweather', 
  'sans-serif', 'serif', 'monospace'
];

export const TEMPLATES: { name: string; elements: PageElement[] }[] = [
  {
    name: "Landing Page",
    elements: [
      {
        id: 'hero-sec',
        type: 'section',
        name: 'Hero Section',
        props: {
          className: 'min-h-[500px] flex flex-col justify-center items-center bg-slate-900 text-white p-10',
          style: { textAlign: 'center', fontFamily: 'Inter' }
        },
        children: [
            { id: 'h1', type: 'heading', name: 'Headline', props: { level: 1, content: 'Build Faster', style: { fontSize: '3.5rem', fontWeight: '800' } } },
            { id: 'sub', type: 'text', name: 'Subtext', props: { content: 'Drag, drop, and launch your site in minutes.', style: { fontSize: '1.25rem', color: '#94a3b8', margin: '1.5rem 0' } } },
            { id: 'btn', type: 'button', name: 'CTA', props: { content: 'Start Building', style: { backgroundColor: '#4f46e5', color: '#fff', padding: '1rem 2.5rem', borderRadius: '50px' } } }
        ]
      },
      {
        id: 'features-sec',
        type: 'section',
        name: 'Features',
        props: { className: 'py-20 px-8 bg-white', style: { fontFamily: 'Inter' } },
        children: [
           { 
             id: 'grid', type: 'columns', name: 'Grid', 
             props: { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto' },
             children: [
                { id: 'c1', type: 'card', name: 'Feature 1', props: { cardTitle: 'Drag & Drop', cardText: 'Intuitive interface.' } },
                { id: 'c2', type: 'card', name: 'Feature 2', props: { cardTitle: 'AI Powered', cardText: 'Generate content instantly.' } },
                { id: 'c3', type: 'card', name: 'Feature 3', props: { cardTitle: 'Responsive', cardText: 'Looks good on all devices.' } }
             ]
           }
        ]
      }
    ]
  },
  {
    name: "Portfolio",
    elements: [
       {
         id: 'nav', type: 'section', name: 'Navbar Section', props: { className: 'p-0', style: { fontFamily: 'Inter' } },
         children: [
             { 
                 id: 'nav-el', type: 'navbar', name: 'Navbar', 
                 props: { 
                     logoText: 'PORTFOLIO', 
                     navLinks: [{ label: 'Work', href: '#' }, { label: 'Contact', href: '#' }],
                     isSticky: true
                 } 
             }
         ]
       },
       {
         id: 'about', type: 'section', name: 'About', props: { className: 'grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-20', style: { fontFamily: 'Inter' } },
         children: [
             { id: 'img-c', type: 'container', name: 'Image Wrap', props: {}, children: [
                 { id: 'me', type: 'image', name: 'Photo', props: { src: 'https://picsum.photos/600/600', style: { borderRadius: '1rem' } } }
             ]},
             { id: 'txt-c', type: 'container', name: 'Text Wrap', props: {}, children: [
                 { id: 'name', type: 'heading', name: 'Name', props: { level: 1, content: 'Hello, I am Jane.', style: { fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.1' } } },
                 { id: 'bio', type: 'text', name: 'Bio', props: { content: 'A creative designer based in New York.', style: { fontSize: '1.2rem', marginTop: '1rem', color: '#666' } } }
             ]}
         ]
       }
    ]
  }
];
