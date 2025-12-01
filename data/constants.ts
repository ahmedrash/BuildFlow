
import { PageElement } from '../types';

export const FONT_FAMILIES = [
  'Inherit', 'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Playfair Display', 'Oswald', 'Raleway', 'Poppins', 'Merriweather', 
  'sans-serif', 'serif', 'monospace'
];

export const MENU_PRESETS = {
    'simple': [{ label: 'Home', href: '#' }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }],
    'business': [{ label: 'Solutions', href: '#solutions' }, { label: 'Pricing', href: '#pricing' }, { label: 'Resources', href: '#resources' }, { label: 'Login', href: '#login' }],
    'portfolio': [{ label: 'Work', href: '#work' }, { label: 'Services', href: '#services' }, { label: 'About', href: '#about' }],
    'app': [{ label: 'Features', href: '#features' }, { label: 'Docs', href: '#docs' }, { label: 'Blog', href: '#blog' }, { label: 'Sign Up', href: '#signup' }]
};

export const TEMPLATES: { name: string; elements: PageElement[] }[] = [
  {
    name: "SaaS Landing",
    elements: [
      {
        id: 'nav-sec',
        type: 'section',
        name: 'Navigation',
        props: { className: 'p-0' },
        children: [
           { 
               id: 'navbar', type: 'navbar', name: 'Navbar', 
               props: { 
                   logoText: 'BuildFlow', 
                   isSticky: true,
                   navLinks: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Login', href: '#' }]
               } 
           }
        ]
      },
      {
        id: 'hero',
        type: 'section',
        name: 'Hero',
        props: {
          className: 'min-h-[600px] flex flex-col justify-center items-center bg-slate-900 text-white p-10 text-center relative overflow-hidden',
          style: { fontFamily: 'Inter' }
        },
        children: [
            { id: 'h1', type: 'heading', name: 'Headline', props: { level: 1, content: 'Ship Faster with AI', className: 'text-5xl md:text-7xl font-extrabold mb-6 tracking-tight' } },
            { id: 'sub', type: 'text', name: 'Subtext', props: { content: 'The ultimate builder for developers and designers. Drag, drop, and deploy in record time.', className: 'text-xl text-slate-300 max-w-2xl mb-10' } },
            { 
                id: 'btn-group', type: 'container', name: 'Button Group', 
                props: { className: 'flex gap-4' },
                children: [
                    { id: 'btn-1', type: 'button', name: 'Primary CTA', props: { content: 'Join Waitlist', buttonAction: 'popup', popupTargetId: 'waitlist-popup', className: 'bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105' } },
                    { id: 'btn-2', type: 'button', name: 'Secondary CTA', props: { content: 'View Demo', className: 'bg-transparent border border-slate-600 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold transition-all' } }
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
           { id: 'feat-head', type: 'heading', name: 'Section Title', props: { level: 2, content: 'Why Choose Us', className: 'text-3xl font-bold text-center mb-16' } },
           { 
             id: 'grid', type: 'columns', name: 'Feature Grid', 
             props: { className: 'grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto' },
             children: [
                { 
                    id: 'c1', type: 'card', name: 'Feature 1', 
                    props: { 
                        className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col items-start',
                        cardHoverEffect: 'lift'
                    },
                    children: [
                        {
                            id: 'c1-img', type: 'image', name: 'Icon',
                            props: {
                                src: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                                alt: 'Visual Editing',
                                className: 'w-16 h-16 object-contain m-6 mb-0 opacity-80',
                                style: { borderRadius: '0' }
                            }
                        },
                        {
                            id: 'c1-body', type: 'container', name: 'Body',
                            props: { className: 'p-6' },
                            children: [
                                { id: 'c1-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Visual Editing', className: 'text-xl font-bold mb-2 text-gray-900' } },
                                { id: 'c1-t', type: 'text', name: 'Text', props: { content: 'Edit your site visually with our powerful drag and drop builder. No coding required.', className: 'text-gray-600 mb-4 text-sm leading-relaxed' } },
                                { id: 'c1-b', type: 'button', name: 'Link', props: { content: 'Learn more →', buttonAction: 'link', className: 'text-indigo-600 font-medium text-sm p-0 bg-transparent hover:bg-transparent' } }
                            ]
                        }
                    ]
                },
                { 
                    id: 'c2', type: 'card', name: 'Feature 2', 
                    props: { 
                        className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col items-start',
                        cardHoverEffect: 'lift'
                    },
                    children: [
                        {
                            id: 'c2-img', type: 'image', name: 'Icon',
                            props: {
                                src: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png',
                                alt: 'Fast Performance',
                                className: 'w-16 h-16 object-contain m-6 mb-0 opacity-80',
                                style: { borderRadius: '0' }
                            }
                        },
                        {
                            id: 'c2-body', type: 'container', name: 'Body',
                            props: { className: 'p-6' },
                            children: [
                                { id: 'c2-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Fast Performance', className: 'text-xl font-bold mb-2 text-gray-900' } },
                                { id: 'c2-t', type: 'text', name: 'Text', props: { content: 'Optimized for speed and SEO. Your sites will load instantly on any device.', className: 'text-gray-600 mb-4 text-sm leading-relaxed' } },
                                { id: 'c2-b', type: 'button', name: 'Link', props: { content: 'View Specs →', buttonAction: 'link', className: 'text-indigo-600 font-medium text-sm p-0 bg-transparent hover:bg-transparent' } }
                            ]
                        }
                    ]
                },
                { 
                    id: 'c3', type: 'card', name: 'Feature 3', 
                    props: { 
                        className: 'bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden flex flex-col items-start',
                        cardHoverEffect: 'lift'
                    },
                    children: [
                        {
                            id: 'c3-img', type: 'image', name: 'Icon',
                            props: {
                                src: 'https://cdn-icons-png.flaticon.com/512/1055/1055666.png',
                                alt: 'Responsive',
                                className: 'w-16 h-16 object-contain m-6 mb-0 opacity-80',
                                style: { borderRadius: '0' }
                            }
                        },
                        {
                            id: 'c3-body', type: 'container', name: 'Body',
                            props: { className: 'p-6' },
                            children: [
                                { id: 'c3-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Fully Responsive', className: 'text-xl font-bold mb-2 text-gray-900' } },
                                { id: 'c3-t', type: 'text', name: 'Text', props: { content: 'Looks perfect on desktops, tablets, and mobile devices automatically.', className: 'text-gray-600 mb-4 text-sm leading-relaxed' } },
                                { id: 'c3-b', type: 'button', name: 'Link', props: { content: 'See Demo →', buttonAction: 'link', className: 'text-indigo-600 font-medium text-sm p-0 bg-transparent hover:bg-transparent' } }
                            ]
                        }
                    ]
                }
             ]
           }
        ]
      },
      {
        id: 'contact',
        type: 'section',
        name: 'Contact',
        props: { className: 'py-20 bg-gray-50' },
        children: [
            { 
                id: 'contact-cols', type: 'columns', name: 'Contact Layout',
                props: { className: 'grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center' },
                children: [
                    {
                        id: 'info', type: 'container', name: 'Info',
                        props: {},
                        children: [
                            { id: 'ch1', type: 'heading', name: 'Title', props: { level: 2, content: 'Stay in the loop', className: 'text-3xl font-bold mb-4' } },
                            { id: 'ct1', type: 'text', name: 'Text', props: { content: 'Join our newsletter to get the latest updates and news directly in your inbox.', className: 'text-gray-600 mb-6' } },
                            { id: 'clist', type: 'list', name: 'Benefits', props: { items: ['Weekly updates', 'No spam', 'Unsubscribe anytime'], listType: 'ul', className: 'text-gray-700' } }
                        ]
                    },
                    {
                        id: 'form-wrap', type: 'container', name: 'Form Wrapper',
                        props: {},
                        children: [
                            { 
                                id: 'sub-form', type: 'form', name: 'Newsletter Form',
                                props: {
                                    className: 'flex flex-col gap-4',
                                    formSuccessMessage: "Thanks for subscribing!"
                                },
                                children: [
                                    {
                                        id: 'f-input-email', type: 'input', name: 'Email Field',
                                        props: {
                                            inputType: 'email',
                                            fieldLabel: 'Email Address',
                                            fieldName: 'email',
                                            fieldPlaceholder: 'you@example.com',
                                            fieldRequired: true
                                        }
                                    },
                                    {
                                        id: 'f-btn-sub', type: 'button', name: 'Submit Button',
                                        props: {
                                            buttonAction: 'submit',
                                            content: 'Subscribe Now',
                                            className: 'w-full bg-black text-white px-6 py-2 rounded hover:opacity-90 transition font-medium',
                                            style: { backgroundColor: '#000000', color: '#ffffff' }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
      },
      // Popup Content (Hidden in preview/export until triggered)
      {
          id: 'waitlist-popup',
          type: 'container',
          name: 'Waitlist Popup',
          props: {
              className: 'bg-white p-8 rounded-xl max-w-md w-full mx-auto relative flex flex-col gap-4',
              style: { backgroundColor: '#ffffff' } 
          },
          children: [
            { id: 'pp-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Join the Waitlist', className: 'text-2xl font-bold mb-2 text-center text-gray-900' } },
            { id: 'pp-t', type: 'text', name: 'Text', props: { content: 'Get early access to BuildFlow. We will notify you when we launch!', className: 'text-gray-500 mb-6 text-center text-sm' } },
            {
               id: 'pp-form', type: 'form', name: 'Popup Form', props: { formSubmitButtonText: 'Join Now', className: 'flex flex-col gap-4' },
               children: [
                  { id: 'pp-email', type: 'input', name: 'Email', props: { inputType: 'email', fieldName: 'email', fieldLabel: 'Email Address', fieldPlaceholder: 'Enter your email', fieldRequired: true } },
                  { id: 'pp-sub', type: 'button', name: 'Submit', props: { buttonAction: 'submit', content: 'Join Now', className: 'w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition' } }
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
         id: 'p-nav', type: 'section', name: 'Header', props: { className: 'p-0 bg-white' },
         children: [
             { 
                 id: 'navbar-p', type: 'navbar', name: 'Navbar', 
                 props: { 
                     logoText: 'ALEX.DESIGN', 
                     navLinks: [{ label: 'Work', href: '#' }, { label: 'About', href: '#' }, { label: 'Contact', href: '#' }],
                     isSticky: false,
                     navOrientation: 'horizontal'
                 } 
             }
         ]
       },
       {
         id: 'p-intro', type: 'section', name: 'Intro', props: { className: 'py-20 px-10 max-w-4xl mx-auto text-center' },
         children: [
             { id: 'p-h1', type: 'heading', name: 'Headline', props: { level: 1, content: 'I craft digital experiences.', className: 'text-6xl font-serif mb-6 text-gray-900' } },
             { id: 'p-sub', type: 'text', name: 'Bio', props: { content: 'Visual Designer & Art Director based in Tokyo.', className: 'text-xl text-gray-500 font-light' } }
         ]
       },
       {
         id: 'p-gallery', type: 'section', name: 'Selected Work', props: { className: 'py-10 px-4' },
         children: [
             {
                 id: 'gal', type: 'gallery', name: 'Portfolio Grid',
                 props: {
                     galleryLayout: 'masonry',
                     galleryColumnCount: 3,
                     galleryGap: '1.5rem',
                     galleryImages: [
                         { id: 'g1', src: 'https://picsum.photos/600/800?random=1', alt: 'Project 1' },
                         { id: 'g2', src: 'https://picsum.photos/600/400?random=2', alt: 'Project 2' },
                         { id: 'g3', src: 'https://picsum.photos/600/600?random=3', alt: 'Project 3' },
                         { id: 'g4', src: 'https://picsum.photos/600/500?random=4', alt: 'Project 4' },
                         { id: 'g5', src: 'https://picsum.photos/600/700?random=5', alt: 'Project 5' },
                         { id: 'g6', src: 'https://picsum.photos/600/450?random=6', alt: 'Project 6' }
                     ]
                 }
             }
         ]
       },
       {
           id: 'p-reviews', type: 'section', name: 'Testimonials', props: { className: 'py-20 bg-gray-50' },
           children: [
               { id: 'rev-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Client Love', className: 'text-center mb-10 uppercase tracking-widest text-sm text-gray-400' } },
               {
                   id: 'testi', type: 'testimonial', name: 'Reviews',
                   props: {
                       testimonialLayout: 'slider',
                       testimonialAvatarSize: 'lg',
                       testimonialBubbleColor: '#ffffff',
                       testimonialItems: [
                           { id: 't1', content: "Alex has a unique eye for detail. The rebranding was a huge success.", author: "Sarah Jenkins", role: "CMO, FinTech", rating: 5, avatarSrc: "https://i.pravatar.cc/150?u=20" },
                           { id: 't2', content: "Professional, fast, and incredibly talented. Highly recommended.", author: "David Lee", role: "Founder, Studio", rating: 5, avatarSrc: "https://i.pravatar.cc/150?u=32" }
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
              id: 'bus-nav', type: 'section', name: 'Top Bar', props: { className: 'p-0' },
              children: [
                  { 
                      id: 'nav-b', type: 'navbar', name: 'Navbar', 
                      props: { logoText: 'VANTAGE', isSticky: true, linkColor: '#333' }
                  }
              ]
          },
          {
              id: 'bus-slider', type: 'slider', name: 'Hero Slider',
              props: { 
                  sliderAutoplay: true, 
                  sliderInterval: 5000, 
                  className: 'h-[500px] w-full relative',
                  sliderNavType: 'arrow'
              },
              children: [
                  {
                      id: 'slide-1', type: 'container', name: 'Slide 1',
                      props: { className: 'w-full h-full flex flex-col justify-center items-start pl-20 bg-cover bg-center text-white', style: { backgroundImage: 'url(https://picsum.photos/1920/1080?random=10)' } },
                      children: [
                          { id: 's1-h', type: 'heading', name: 'Title', props: { level: 1, content: 'Innovate.', className: 'text-6xl font-bold mb-4 drop-shadow-md' } },
                          { id: 's1-p', type: 'text', name: 'Text', props: { content: 'Leading the market with superior technology.', className: 'text-xl mb-8 drop-shadow-md' } },
                          { id: 's1-b', type: 'button', name: 'CTA', props: { content: 'Discover More', className: 'bg-white text-black px-6 py-3 rounded font-bold hover:bg-gray-100 transition' } }
                      ]
                  },
                  {
                      id: 'slide-2', type: 'container', name: 'Slide 2',
                      props: { className: 'w-full h-full flex flex-col justify-center items-center bg-cover bg-center text-white', style: { backgroundImage: 'url(https://picsum.photos/1920/1080?random=11)' } },
                      children: [
                          { id: 's2-h', type: 'heading', name: 'Title', props: { level: 1, content: 'Grow.', className: 'text-6xl font-bold mb-4 drop-shadow-md' } },
                          { id: 's2-p', type: 'text', name: 'Text', props: { content: 'Scale your business to new heights.', className: 'text-xl mb-8 drop-shadow-md' } }
                      ]
                  }
              ]
          },
          {
              id: 'bus-serv', type: 'section', name: 'Services', props: { className: 'py-20 px-8 bg-gray-100' },
              children: [
                  { 
                      id: 's-grid', type: 'columns', name: 'Service Cards',
                      props: { className: 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto' },
                      children: [
                          {
                              id: 'srv-1', type: 'card', name: 'Service 1',
                              props: {
                                  className: 'flex flex-col sm:flex-row bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100',
                                  cardHoverEffect: 'zoom'
                              },
                              children: [
                                  {
                                      id: 'srv-1-img', type: 'image', name: 'Image',
                                      props: {
                                          src: 'https://picsum.photos/400/300?random=20',
                                          className: 'w-full sm:w-1/3 object-cover min-h-[200px] sm:min-h-full',
                                          alt: 'Consulting'
                                      }
                                  },
                                  {
                                      id: 'srv-1-body', type: 'container', name: 'Body',
                                      props: { className: 'p-6 flex-1 flex flex-col justify-center' },
                                      children: [
                                          { id: 'srv-1-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Consulting', className: 'text-2xl font-bold mb-2 text-gray-900' } },
                                          { id: 'srv-1-t', type: 'text', name: 'Text', props: { content: 'Expert advice to optimize your workflow and increase revenue.', className: 'text-gray-600 mb-4' } },
                                          { id: 'srv-1-b', type: 'button', name: 'Button', props: { content: 'Details →', buttonAction: 'link', className: 'text-indigo-600 font-bold bg-transparent p-0 hover:bg-transparent' } }
                                      ]
                                  }
                              ]
                          },
                          {
                              id: 'srv-2', type: 'card', name: 'Service 2',
                              props: {
                                  className: 'flex flex-col sm:flex-row bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100',
                                  cardHoverEffect: 'zoom'
                              },
                              children: [
                                  {
                                      id: 'srv-2-img', type: 'image', name: 'Image',
                                      props: {
                                          src: 'https://picsum.photos/400/300?random=21',
                                          className: 'w-full sm:w-1/3 object-cover min-h-[200px] sm:min-h-full',
                                          alt: 'Development'
                                      }
                                  },
                                  {
                                      id: 'srv-2-body', type: 'container', name: 'Body',
                                      props: { className: 'p-6 flex-1 flex flex-col justify-center' },
                                      children: [
                                          { id: 'srv-2-h', type: 'heading', name: 'Title', props: { level: 3, content: 'Development', className: 'text-2xl font-bold mb-2 text-gray-900' } },
                                          { id: 'srv-2-t', type: 'text', name: 'Text', props: { content: 'Full-stack solutions tailored for your unique product needs.', className: 'text-gray-600 mb-4' } },
                                          { id: 'srv-2-b', type: 'button', name: 'Button', props: { content: 'Details →', buttonAction: 'link', className: 'text-indigo-600 font-bold bg-transparent p-0 hover:bg-transparent' } }
                                      ]
                                  }
                              ]
                          }
                      ]
                  }
              ]
          },
          {
              id: 'bus-contact', type: 'section', name: 'Contact', props: { className: 'py-20 px-8 bg-white text-center' },
              children: [
                   { id: 'c-h', type: 'heading', name: 'Title', props: { level: 2, content: 'Get in Touch', className: 'text-3xl font-bold mb-8' } },
                   {
                       id: 'c-form', type: 'form', name: 'Contact Form',
                       props: {
                           className: 'max-w-lg mx-auto text-left flex flex-col gap-4 p-6 border border-gray-100 rounded-lg shadow-sm',
                           formSubmitButtonText: 'Send Message'
                       },
                       children: [
                            {
                                id: 'f-name', type: 'input', name: 'Name',
                                props: {
                                    inputType: 'text',
                                    fieldLabel: 'Name',
                                    fieldName: 'name',
                                    fieldRequired: true,
                                    fieldPlaceholder: 'Your Name'
                                }
                            },
                            {
                                id: 'f-msg', type: 'textarea', name: 'Message',
                                props: {
                                    fieldLabel: 'Message',
                                    fieldName: 'message',
                                    fieldRequired: true,
                                    fieldRows: 4,
                                    fieldPlaceholder: 'How can we help?'
                                }
                            },
                            {
                                id: 'f-submit', type: 'button', name: 'Submit Button',
                                props: {
                                    buttonAction: 'submit',
                                    content: 'Send Message',
                                    className: 'bg-indigo-600 text-white px-6 py-3 rounded font-bold hover:bg-indigo-700 transition w-full'
                                }
                            }
                       ]
                   }
              ]
          }
      ]
  }
];
