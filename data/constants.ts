
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
    name: "SaaS Landing",
    elements: [
  {
    id: 'nav-wrapper',
    type: 'section',
    name: 'Navigation',
    props: { className: 'p-0 relative z-40 h-[73px]', elementClassName: '' },
    children: [
      {
        id: 'navbar',
        type: 'navbar',
        name: 'Navbar',
        props: {
          className: 'grid grid-cols-2 lg:flex items-center lg:justify-between px-6 py-4 bg-white/95 backdrop-blur shadow-sm border-b border-gray-100',
          elementClassName: '',
          headerType: 'fixed',
          stickyOffset: 100
        },
        children: [
          {
            id: 'nav-logo',
            type: 'logo',
            name: 'Logo',
            props: {
              logoText: 'BuildFlow',
              logoType: 'text',
              href: '#',
              className: 'text-xl font-bold text-indigo-600 tracking-tight'
            }
          },
          {
            id: 'nav-menu',
            type: 'menu',
            name: 'Main Menu',
            props: {
              className: 'md:static flex justify-end',
              mobileMenuBreakpoint: 'md',
              mobileMenuType: 'slide-right',
              mobileMenuIconType: 'menu',
              linkColor: '#4b5563',
              activeLinkColor: '#4f46e5',
              navLinks: [
                { id: 'm-1', label: 'Home', href: '#' },
                { 
                    id: 'm-2', 
                    label: 'Features', 
                    type: 'mega-menu',
                    targetId: 'mega-products',
                    megaMenuPlacement: 'center'
                },
                { 
                    id: 'm-3', 
                    label: 'Resources', 
                    type: 'dropdown',
                    children: [
                        { id: 'm-3-1', label: 'Documentation', href: '#' },
                        { id: 'm-3-2', label: 'API Reference', href: '#' },
                        { id: 'm-3-3', label: 'Community', href: '#' }
                    ]
                },
                { id: 'm-4', label: 'Pricing', href: '#pricing' },
                { id: 'm-5', label: 'Contact', type: 'popup', targetId: 'contact-popup' }
              ]
            }
          },
          {
              id: 'nav-cta',
              type: 'button',
              name: 'Get Started',
              props: {
                  content: 'Get Started',
                  className: '',
                  elementClassName: 'hidden lg:block bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg',
                  buttonAction: 'popup',
                  popupTargetId: 'contact-popup'
              }
          }
        ]
      }
    ]
  },
  {
    id: 'hero',
    type: 'section',
    name: 'Hero',
    props: {
      className: 'min-h-[600px] flex flex-col justify-center items-center bg-slate-900 text-white p-10 text-center relative overflow-hidden',
      elementClassName: ''
    },
    children: [
      {
        id: 'h1',
        type: 'heading',
        name: 'Headline',
        props: {
          level: 1,
          content: 'Ship Faster with AI',
          className: 'mb-6 max-w-4xl mx-auto',
          elementClassName: 'text-5xl md:text-7xl font-extrabold tracking-tight leading-tight'
        }
      },
      {
        id: 'sub',
        type: 'text',
        name: 'Subtext',
        props: {
          content: 'The ultimate builder for developers and designers. Drag, drop, and deploy in record time.',
          className: 'max-w-2xl mb-10 mx-auto',
          elementClassName: 'text-xl text-slate-300 leading-relaxed'
        }
      },
      {
        id: 'btn-group',
        type: 'container',
        name: 'Button Group',
        props: { className: 'flex gap-4 flex-col md:flex-row justify-center' },
        children: [
          {
            id: 'btn-1',
            type: 'button',
            name: 'Primary CTA',
            props: {
              content: 'Start Building',
              buttonAction: 'popup',
              popupTargetId: 'contact-popup',
              className: 'bg-indigo-600 hover:bg-indigo-50 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 shadow-xl shadow-indigo-900/50'
            }
          },
          {
            id: 'btn-2',
            type: 'button',
            name: 'Secondary CTA',
            props: {
              content: 'View Demo',
              className: 'bg-transparent border border-slate-600 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold transition-all'
            }
          }
        ]
      }
    ]
  },
  // --- MEGA MENU CONTENT (Hidden by default, triggered by Menu) ---
  {
      id: 'mega-products',
      type: 'container',
      name: 'Mega Menu Content',
      props: {
          className: 'max-w-6xl mx-auto lg:bg-white lg:shadow-2xl lg:p-8 rounded-b-xl',
          elementClassName: ''
      },
      children: [
          {
              id: 'mm-grid',
              type: 'columns',
              name: 'Grid',
              props: { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto' },
              children: [
                  {
                      id: 'mm-col-1', type: 'container', name: 'Col 1', props: { className: 'space-y-4' },
                      children: [
                          { id: 'mm-h1', type: 'heading', name: 'Heading', props: { level: 4, content: 'Platform', className: 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-2' } },
                          { id: 'mm-l1', type: 'button', name: 'Link', props: { content: 'Visual Builder', buttonAction: 'link', className: 'block text-gray-700 hover:text-indigo-600 font-medium' } },
                          { id: 'mm-l2', type: 'button', name: 'Link', props: { content: 'CMS Integration', buttonAction: 'link', className: 'block text-gray-700 hover:text-indigo-600 font-medium' } },
                          { id: 'mm-l3', type: 'button', name: 'Link', props: { content: 'Hosting', buttonAction: 'link', className: 'block text-gray-700 hover:text-indigo-600 font-medium' } }
                      ]
                  },
                  {
                      id: 'mm-col-2', type: 'container', name: 'Col 2', props: { className: 'space-y-4' },
                      children: [
                          { id: 'mm-h2', type: 'heading', name: 'Heading', props: { level: 4, content: 'Resources', className: 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-2' } },
                          { id: 'mm-l4', type: 'button', name: 'Link', props: { content: 'Documentation', buttonAction: 'link', className: 'block text-gray-700 hover:text-indigo-600 font-medium' } },
                          { id: 'mm-l5', type: 'button', name: 'Link', props: { content: 'Community', buttonAction: 'link', className: 'block text-gray-700 hover:text-indigo-600 font-medium' } },
                          { id: 'mm-l6', type: 'button', name: 'Link', props: { content: 'Help Center', buttonAction: 'link', className: 'block text-gray-700 hover:text-indigo-600 font-medium' } }
                      ]
                  },
                  {
                      id: 'mm-col-3', type: 'container', name: 'Col 3', props: { className: 'bg-gray-50 p-6 rounded-xl' },
                      children: [
                          { id: 'mm-h3', type: 'heading', name: 'Heading', props: { level: 4, content: 'New Feature', className: 'text-indigo-600 font-bold mb-2' } },
                          { id: 'mm-t1', type: 'text', name: 'Text', props: { content: 'Check out our new AI assistant that builds pages for you.', className: 'text-sm text-gray-600 mb-4' } },
                          { id: 'mm-b1', type: 'button', name: 'Btn', props: { content: 'Learn More →', className: 'text-sm font-bold text-gray-900 underline' } }
                      ]
                  }
              ]
          }
      ]
  },
  // --- POPUP CONTENT ---
  {
    id: 'contact-popup',
    type: 'container',
    name: 'Contact Popup',
    props: {
      className: 'bg-white p-8 rounded-2xl w-full max-w-md mx-auto relative flex flex-col gap-4 shadow-2xl',
      style: { backgroundColor: '#ffffff' }
    },
    children: [
      {
        id: 'pp-h',
        type: 'heading',
        name: 'Title',
        props: { level: 2, content: 'Get Early Access', className: 'text-2xl font-bold text-center text-gray-900 mb-2' }
      },
      {
        id: 'pp-t',
        type: 'text',
        name: 'Text',
        props: { content: 'Join the waitlist and get notified when we launch. No spam, we promise.', className: 'text-gray-500 text-center text-sm mb-6' }
      },
      {
        id: 'pp-form',
        type: 'form',
        name: 'Popup Form',
        props: { className: 'flex flex-col gap-4', formSuccessMessage: 'You are on the list!', formActionUrl: '#' },
        children: [
          {
            id: 'pp-email',
            type: 'input',
            name: 'Email',
            props: { inputType: 'email', fieldName: 'email', fieldLabel: 'Email Address', fieldPlaceholder: 'you@example.com', fieldRequired: true }
          },
          {
            id: 'pp-sub',
            type: 'button',
            name: 'Submit',
            props: { buttonAction: 'submit', content: 'Join Waitlist', className: '', elementClassName: 'w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition mt-2' }
          }
        ]
      }
    ]
  },
  {
    id: 'features',
    type: 'section',
    name: 'Features',
    props: { className: 'py-24 px-6 bg-white' },
    children: [
      {
        id: 'feat-head',
        type: 'heading',
        name: 'Section Title',
        props: { level: 2, content: 'Why Choose Us', className: 'text-3xl font-bold text-center mb-16' }
      },
      {
        id: 'grid',
        type: 'columns',
        name: 'Feature Grid',
        props: { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto' },
        children: [
          {
            id: 'c1',
            type: 'card',
            name: 'Feature 1',
            props: { className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col items-start p-6', cardHoverEffect: 'lift' },
            children: [
              { id: 'c1-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Visual Editing', className: 'text-xl font-bold text-gray-900 mb-2' } },
              { id: 'c1-t', type: 'text', name: 'Text', props: { content: 'Edit your site visually with our powerful drag and drop builder. No coding required.', className: 'text-gray-600 text-sm leading-relaxed mb-4' } },
              { id: 'c1-b', type: 'button', name: 'Link', props: { content: 'Learn more →', buttonAction: 'link', className: 'text-indigo-600 font-medium text-sm p-0 bg-transparent' } }
            ]
          },
          {
            id: 'c2',
            type: 'card',
            name: 'Feature 2',
            props: { className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col items-start p-6', cardHoverEffect: 'lift' },
            children: [
              { id: 'c2-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Fast Performance', className: 'text-xl font-bold text-gray-900 mb-2' } },
              { id: 'c2-t', type: 'text', name: 'Text', props: { content: 'Optimized for speed and SEO. Your sites will load instantly on any device.', className: 'text-gray-600 text-sm leading-relaxed mb-4' } },
              { id: 'c2-b', type: 'button', name: 'Link', props: { content: 'View Specs →', buttonAction: 'link', className: 'text-indigo-600 font-medium text-sm p-0 bg-transparent' } }
            ]
          },
          {
            id: 'c3',
            type: 'card',
            name: 'Feature 3',
            props: { className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col items-start p-6', cardHoverEffect: 'lift' },
            children: [
              { id: 'c3-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Fully Responsive', className: 'text-xl font-bold text-gray-900 mb-2' } },
              { id: 'c3-t', type: 'text', name: 'Text', props: { content: 'Looks perfect on desktops, tablets, and mobile devices automatically.', className: 'text-gray-600 text-sm leading-relaxed mb-4' } },
              { id: 'c3-b', type: 'button', name: 'Link', props: { content: 'See Demo →', buttonAction: 'link', className: 'text-indigo-600 font-medium text-sm p-0 bg-transparent' } }
            ]
          }
        ]
      }
    ]
  }
]
  },
  {
    name: "Creative Portfolio",
    elements: [
       {
         id: 'p-nav', type: 'section', name: 'Header', props: { className: 'p-0 bg-white relative z-40' },
         children: [
             { 
                 id: 'navbar-p', type: 'navbar', name: 'Navbar', 
                 props: { 
                     headerType: 'relative',
                     className: 'flex flex-row justify-between items-center p-6 max-w-7xl mx-auto'
                 },
                 children: [
                     { id: 'p-logo', type: 'logo', name: 'Logo', props: { logoText: 'ALEX.DESIGN', href: '#', className: 'font-bold tracking-widest text-2xl' } },
                     { 
                         id: 'p-menu', type: 'menu', name: 'Menu', 
                         props: { 
                             navLinks: [{ id: 'pnav-1', label: 'Work', href: '#' }, { id: 'pnav-2', label: 'About', href: '#' }, { id: 'pnav-3', label: 'Contact', href: '#' }], 
                             mobileMenuBreakpoint: 'md',
                             mobileMenuType: 'dropdown',
                             className: ''
                         } 
                     }
                 ]
             }
         ]
       },
       {
         id: 'p-intro', type: 'section', name: 'Intro', props: { className: 'py-32 px-10 max-w-5xl mx-auto text-center' },
         children: [
             { id: 'p-h1', type: 'heading', name: 'Headline', props: { level: 1, content: 'I craft digital experiences.', className: 'mb-8 text-7xl font-serif text-gray-900 leading-none' } },
             { id: 'p-sub', type: 'text', name: 'Bio', props: { content: 'Visual Designer & Art Director based in Tokyo.', className: 'text-2xl text-gray-500 font-light' } }
         ]
       },
       {
         id: 'p-gallery', type: 'section', name: 'Selected Work', props: { className: 'py-10 px-4 max-w-7xl mx-auto' },
         children: [
             {
                 id: 'gal', type: 'gallery', name: 'Portfolio Grid',
                 props: {
                     galleryLayout: 'masonry',
                     galleryColumnCount: 2,
                     galleryGap: '2rem',
                     galleryImages: [
                         { id: 'g1', src: 'https://picsum.photos/800/600?random=1', alt: 'Project 1' },
                         { id: 'g2', src: 'https://picsum.photos/600/800?random=2', alt: 'Project 2' },
                         { id: 'g3', src: 'https://picsum.photos/800/800?random=3', alt: 'Project 3' },
                         { id: 'g4', src: 'https://picsum.photos/800/500?random=4', alt: 'Project 4' }
                     ]
                 }
             }
         ]
       }
    ]
  },
  {
      name: "Modern Business",
      elements: [
          {
              id: 'bus-nav', type: 'section', name: 'Top Bar', props: { className: 'p-0 relative z-40' },
              children: [
                  { 
                      id: 'nav-b', type: 'navbar', name: 'Navbar', 
                      props: { headerType: 'sticky', stickyOffset: 50, className: 'flex justify-between items-center px-8 py-4 bg-white shadow-sm' },
                      children: [
                          { id: 'b-logo', type: 'logo', name: 'Logo', props: { logoText: 'VANTAGE', href: '#', className: 'font-bold text-xl tracking-tight' } },
                          { 
                              id: 'b-menu', type: 'menu', name: 'Menu', 
                              props: { 
                                  linkColor: '#333', 
                                  navLinks: [{ id: 'm1', label: 'Services', href: '#' }, { id: 'm2', label: 'About', href: '#' }, { id: 'm3', label: 'Contact', href: '#contact' }], 
                                  mobileMenuBreakpoint: 'md',
                                  mobileMenuType: 'slide-right'
                              } 
                          }
                      ]
                  }
              ]
          },
          {
              id: 'bus-slider', type: 'slider', name: 'Hero Slider',
              props: { 
                  sliderAutoplay: true, 
                  sliderInterval: 5000, 
                  className: 'h-[600px] w-full relative',
                  sliderNavType: 'arrow',
                  sliderTransition: 'zoom'
              },
              children: [
                  {
                      id: 'slide-1', type: 'container', name: 'Slide 1',
                      props: { className: 'w-full h-full flex flex-col justify-center items-start pl-20 bg-cover bg-center text-white overlay-dark', style: { backgroundImage: 'url(https://picsum.photos/1920/1080?random=10)' } },
                      children: [
                          { id: 's1-h', type: 'heading', name: 'Title', props: { level: 1, content: 'Innovate.', className: 'mb-4 text-7xl font-bold drop-shadow-lg' } },
                          { id: 's1-p', type: 'text', name: 'Text', props: { content: 'Leading the market with superior technology.', className: 'mb-8 text-2xl drop-shadow-md' } },
                          { id: 's1-b', type: 'button', name: 'CTA', props: { content: 'Discover More', className: 'bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-100 transition' } }
                      ]
                  },
                  {
                      id: 'slide-2', type: 'container', name: 'Slide 2',
                      props: { className: 'w-full h-full flex flex-col justify-center items-center bg-cover bg-center text-white', style: { backgroundImage: 'url(https://picsum.photos/1920/1080?random=11)' } },
                      children: [
                          { id: 's2-h', type: 'heading', name: 'Title', props: { level: 1, content: 'Grow.', className: 'mb-4 text-7xl font-bold drop-shadow-lg' } },
                          { id: 's2-p', type: 'text', name: 'Text', props: { content: 'Scale your business to new heights.', className: 'mb-8 text-2xl drop-shadow-md' } }
                      ]
                  }
              ]
          }
      ]
  }
];
