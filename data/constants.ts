import { PageElement } from '../types';

export const FONT_FAMILIES = [
  'Inherit', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Playfair Display', 'Oswald', 'Raleway', 'Poppins', 'Merriweather', 
  'sans-serif', 'serif', 'monospace'
];

export const ICON_OPTIONS = [
    'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
    'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown',
    'Plus', 'Minus', 'Check', 'X', 'Search', 'Menu', 'User', 'Mail', 'Phone',
    'ExternalLink', 'Download', 'Upload', 'Trash', 'Edit', 'Save', 'Settings',
    'ShoppingCart', 'CreditCard', 'Calendar', 'Clock', 'MapPin', 'Globe',
    'Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Youtube', 'Github',
    'Play', 'Pause', 'Info', 'AlertTriangle', 'AlertCircle', 'HelpCircle'
];

export const MENU_PRESETS = {
    'simple': [{ id: 'm-1', label: 'Home', href: '#' }, { id: 'm-2', label: 'About', href: '#about' }, { id: 'm-3', label: 'Contact', href: '#contact' }],
    'business': [{ id: 'm-4', label: 'Solutions', href: '#solutions' }, { id: 'm-5', label: 'Pricing', href: '#pricing' }, { id: 'm-6', label: 'Resources', href: '#resources' }, { id: 'm-7', label: 'Login', href: '#login' }],
    'portfolio': [{ id: 'm-8', label: 'Work', href: '#work' }, { id: 'm-9', label: 'Services', href: '#services' }, { id: 'm-10', label: 'About', href: '#about' }],
    'app': [{ id: 'm-11', label: 'Features', href: '#features' }, { id: 'm-12', label: 'Docs', href: '#docs' }, { id: 'm-13', label: 'Blog', href: '#blog' }, { id: 'm-14', label: 'Sign Up', href: '#signup' }]
};

export const TEMPLATES: { name: string; elements: PageElement[] }[] = [
  {
    name: "Nebula SaaS",
    elements: [
      {
        id: 'n-nav',
        type: 'section',
        name: 'Navigation',
        props: { className: 'p-0 sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100' },
        children: [
          {
            id: 'n-navbar',
            type: 'navbar',
            name: 'Navbar',
            props: { className: 'max-w-7xl mx-auto flex items-center justify-between px-6 py-4' },
            children: [
              { id: 'n-logo', type: 'logo', name: 'Logo', props: { logoText: 'NEBULA', className: 'text-2xl font-black text-indigo-600 tracking-tighter' } },
              { id: 'n-menu', type: 'menu', name: 'Menu', props: { navLinks: [{ id: 'nl1', label: 'Product', href: '#' }, { id: 'nl2', label: 'Features', href: '#' }, { id: 'nl3', label: 'Pricing', href: '#' }] } },
              { id: 'n-btn', type: 'button', name: 'CTA', props: { content: 'Get Started', buttonIconRight: 'ArrowRight', className: 'bg-indigo-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition' } }
            ]
          }
        ]
      },
      {
        id: 'n-hero',
        type: 'section',
        name: 'Hero Section',
        props: { className: 'py-24 md:py-32 px-6 bg-gradient-to-b from-indigo-50/50 to-white overflow-hidden' },
        children: [
          {
            id: 'n-hero-con',
            type: 'container',
            name: 'Content Container',
            props: { className: 'max-w-4xl mx-auto text-center', animation: { type: 'fade-in-up', duration: 1.2, trigger: 'load', ease: 'power4.out' } },
            children: [
              { id: 'n-badge', type: 'text', name: 'Badge', props: { content: '✨ Now with AI-Powered Workflows', className: 'inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-wider' } },
              { id: 'n-h1', type: 'heading', name: 'Headline', props: { level: 1, content: 'Unified Intelligence for Modern Teams', className: 'text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight' } },
              { id: 'n-p', type: 'text', name: 'Subtext', props: { content: 'The only platform that syncs your entire workflow in real-time, powered by enterprise-grade AI components.', className: 'text-xl text-slate-500 max-w-2xl mx-auto mb-10' } },
              { 
                id: 'n-btns', type: 'container', name: 'Buttons', props: { className: 'flex flex-col sm:flex-row gap-4 justify-center' },
                children: [
                   { id: 'n-b1', type: 'button', name: 'Primary', props: { content: 'Start Free Trial', buttonIconRight: 'ArrowRight', className: 'bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-200' } },
                   { id: 'n-b2', type: 'button', name: 'Secondary', props: { content: 'Book a Demo', buttonIconLeft: 'Play', className: 'bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition' } }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'n-features',
        type: 'section',
        name: 'Features Grid',
        props: { className: 'py-24 px-6 bg-white' },
        children: [
          {
            id: 'n-f-con',
            type: 'container',
            name: 'Grid Container',
            props: { className: 'max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8', animation: { type: 'fade-in-up', duration: 1, trigger: 'scroll', target: 'children', stagger: 0.15 } },
            children: [
              {
                id: 'f1', type: 'card', name: 'Feature 1', props: { className: 'p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all' },
                children: [
                  { id: 'f1-i', type: 'button', name: 'Icon', props: { buttonIsIconOnly: true, buttonIconLeft: 'Globe', className: 'bg-indigo-600 text-white p-3 rounded-2xl mb-6 shadow-indigo-200 shadow-lg' } },
                  { id: 'f1-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Global Infrastructure', className: 'text-2xl font-bold mb-4' } },
                  { id: 'f1-p', type: 'text', name: 'Text', props: { content: 'Collaborate with your team instantly from anywhere in the world with zero latency.', className: 'text-slate-500 leading-relaxed mb-6' } }
                ]
              },
              {
                id: 'f2', type: 'card', name: 'Feature 2', props: { className: 'p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all' },
                children: [
                  { id: 'f2-i', type: 'button', name: 'Icon', props: { buttonIsIconOnly: true, buttonIconLeft: 'CreditCard', className: 'bg-emerald-500 text-white p-3 rounded-2xl mb-6 shadow-emerald-200 shadow-lg' } },
                  { id: 'f2-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Unified Payments', className: 'text-2xl font-bold mb-4' } },
                  { id: 'f2-p', type: 'text', name: 'Text', props: { content: 'Manage all your subscriptions and billing in one centralized enterprise dashboard.', className: 'text-slate-500 leading-relaxed mb-6' } }
                ]
              },
              {
                id: 'f3', type: 'card', name: 'Feature 3', props: { className: 'p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all' },
                children: [
                  { id: 'f3-i', type: 'button', name: 'Icon', props: { buttonIsIconOnly: true, buttonIconLeft: 'Shield', className: 'bg-amber-500 text-white p-3 rounded-2xl mb-6 shadow-amber-200 shadow-lg' } },
                  { id: 'f3-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Advanced Security', className: 'text-2xl font-bold mb-4' } },
                  { id: 'f3-p', type: 'text', name: 'Text', props: { content: 'Bank-grade encryption and SSO integration for your entire organization.', className: 'text-slate-500 leading-relaxed mb-6' } }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Aura Design Agency",
    elements: [
      {
        id: 'a-hero',
        type: 'section',
        name: 'Hero',
        props: { className: 'min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-950 text-white relative overflow-hidden' },
        children: [
          {
            id: 'a-h1', type: 'heading', name: 'Headline',
            props: { 
                level: 1, content: 'We build digital products that people love.', 
                className: 'text-6xl md:text-9xl font-serif italic font-light mb-12 max-w-6xl tracking-tighter leading-none relative z-10',
                animation: { type: 'fade-in-up', duration: 1.8, trigger: 'load', ease: 'power4.out' }
            }
          },
          {
            id: 'a-btn-con', type: 'container', name: 'CTA', props: { className: 'flex gap-4 items-center' },
            children: [
                 { id: 'a-btn', type: 'button', name: 'Work', props: { content: 'View Portfolio', buttonIconRight: 'ArrowRight', className: 'bg-white text-slate-950 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all' } }
            ]
          }
        ]
      },
      {
        id: 'a-work',
        type: 'section',
        name: 'Selected Work',
        props: { className: 'py-32 px-6 bg-white' },
        children: [
          {
            id: 'a-work-h', type: 'container', name: 'Header', props: { className: 'max-w-7xl mx-auto mb-20 flex justify-between items-end' },
            children: [
              { id: 'a-work-h1', type: 'heading', name: 'Title', props: { level: 2, content: 'Selected Projects', className: 'text-4xl md:text-6xl font-serif italic' } },
              { id: 'a-work-h2', type: 'text', name: 'Year', props: { content: '2024 — 2025', className: 'text-slate-400 font-mono text-sm uppercase tracking-widest' } }
            ]
          },
          {
            id: 'a-gallery',
            type: 'gallery',
            name: 'Portfolio Grid',
            props: { 
              galleryLayout: 'masonry', galleryColumnCount: 2, galleryGap: '3rem',
              animation: { type: 'zoom-in', duration: 1, trigger: 'scroll', target: 'children', stagger: 0.3 },
              galleryImages: [
                { id: 'g1', src: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80', alt: 'Design 1' },
                { id: 'g2', src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80', alt: 'Design 2' },
                { id: 'g3', src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', alt: 'Design 3' },
                { id: 'g4', src: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&q=80', alt: 'Design 4' }
              ]
            }
          }
        ]
      }
    ]
  },
  {
    name: "Minimalist Portfolio",
    elements: [
       {
         id: 'p-nav', type: 'section', name: 'Header', props: { className: 'p-0 bg-white relative z-40' },
         children: [
             { 
                 id: 'navbar-p', type: 'navbar', name: 'Navbar', 
                 props: { 
                     headerType: 'relative',
                     className: 'flex flex-row justify-between items-center p-8 max-w-7xl mx-auto'
                 },
                 children: [
                     { id: 'p-logo', type: 'logo', name: 'Logo', props: { logoText: 'ALEX.DESIGN', href: '#', className: 'font-bold tracking-widest text-2xl' } },
                     { 
                         id: 'p-menu', type: 'menu', name: 'Menu', 
                         props: { 
                             navLinks: [{ id: 'pnav-1', label: 'Work', href: '#' }, { id: 'pnav-2', label: 'About', href: '#' }, { id: 'pnav-3', label: 'Contact', href: '#' }], 
                             mobileMenuBreakpoint: 'md',
                             mobileMenuType: 'dropdown'
                         } 
                     }
                 ]
             }
         ]
       },
       {
         id: 'p-intro', type: 'section', name: 'Intro', props: { className: 'py-32 px-10 max-w-5xl mx-auto text-center' },
         children: [
             { 
                 id: 'p-h1', type: 'heading', name: 'Headline', 
                 props: { 
                     level: 1, content: 'I craft digital experiences.', className: 'mb-8 text-7xl font-serif text-gray-900 leading-none',
                     animation: { type: 'fade-in-up', duration: 1.2, ease: 'power2.out', trigger: 'load', target: 'self' }
                 } 
             },
             { 
                 id: 'p-sub', type: 'text', name: 'Bio', 
                 props: { 
                     content: 'Visual Designer & Art Director based in Tokyo.', className: 'text-2xl text-gray-400 font-light',
                     animation: { type: 'fade-in', duration: 1.5, delay: 0.6, trigger: 'load', target: 'self' }
                 } 
             },
             {
               id: 'p-btn', type: 'button', name: 'CTA', props: { content: 'Say Hello', buttonIconRight: 'Mail', className: 'mt-12 bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition' }
             }
         ]
       }
    ]
  }
];