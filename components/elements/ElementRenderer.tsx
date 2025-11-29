
import React from 'react';
import { PageElement } from '../../types';

interface ElementRendererProps {
  element: PageElement;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element }) => {
  switch (element.type) {
    case 'text':
      return <>{element.props.content}</>;

    case 'heading':
      const Tag = (`h${element.props.level || 2}`) as React.ElementType;
      return <Tag>{element.props.content || 'Heading'}</Tag>;

    case 'image':
      return (
        <img 
          src={element.props.src || 'https://via.placeholder.com/300'} 
          alt={element.props.alt || 'Placeholder'} 
          className="w-full h-auto object-cover pointer-events-none" 
          style={{ borderRadius: element.props.style?.borderRadius }}
        />
      );

    case 'button':
      const action = element.props.buttonAction || 'link';
      const isLink = action === 'link';
      
      if (isLink) {
          return (
               <a 
                  href={element.props.href || '#'}
                  target={element.props.target}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block pointer-events-none"
                  style={element.props.style}
               >
                  {element.props.content || 'Button'}
               </a>
          )
      }
      
      return (
        <button 
          type={action === 'submit' ? 'submit' : 'button'}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition pointer-events-none"
          style={element.props.style}
        >
          {element.props.content || 'Button'}
        </button>
      );

    case 'video':
      const videoSrc = element.props.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      const isYoutube = videoSrc.includes('youtube') || videoSrc.includes('youtu.be');
      const embedUrl = isYoutube && !videoSrc.includes('embed') 
          ? videoSrc.replace('watch?v=', 'embed/') 
          : videoSrc;

      return (
        <div className="aspect-video w-full bg-black rounded overflow-hidden relative">
          <iframe 
              src={embedUrl} 
              className="w-full h-full pointer-events-none" 
              title="Video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          />
        </div>
      );

    case 'slider':
        // Slider content is now handled by the children rendering in EditorCanvas
        return null;

    case 'list':
      const ListTag = element.props.listType || 'ul';
      const listStyle = element.props.listStyleType || (ListTag === 'ul' ? 'disc' : 'decimal');
      const itemSpacing = element.props.itemSpacing || '0';
      
      return (
        <ListTag className="pl-5" style={{ listStyleType: listStyle }}>
          {(element.props.items || ['Item 1', 'Item 2', 'Item 3']).map((item, i, arr) => (
            <li key={i} style={{ marginBottom: i === arr.length - 1 ? 0 : itemSpacing }}>
                {item}
            </li>
          ))}
        </ListTag>
      );

    case 'map':
      return (
          <div className="w-full h-64 bg-gray-100 rounded overflow-hidden">
              <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(element.props.address || 'San Francisco')}&t=&z=${element.props.zoom || 13}&ie=UTF8&iwloc=&output=embed`}
                  className="pointer-events-none"
              ></iframe>
          </div>
      );

    case 'customCode':
      return (
        <div 
           className="min-h-[50px]"
           dangerouslySetInnerHTML={{ __html: element.props.code || '<div class="text-gray-400 p-2 border border-dashed">Custom Code Block</div>' }} 
        />
      );

    case 'form':
      const fields = element.props.formFields || [];
      const labelLayout = element.props.formLabelLayout || 'top';
      const isHorizontal = labelLayout === 'horizontal';
      
      const inputStyle = {
          borderRadius: element.props.formInputBorderRadius || '0.375rem',
          backgroundColor: element.props.formInputBackgroundColor || '#ffffff',
      };
      
      const buttonStyle = {
          backgroundColor: element.props.formButtonBackgroundColor || '#4f46e5',
          color: element.props.formButtonTextColor || '#ffffff',
          borderRadius: element.props.formInputBorderRadius || '0.375rem',
      };

      return (
        <form className="space-y-4 p-4 border border-dashed border-gray-200 rounded pointer-events-none bg-white/50 w-full relative">
          {fields.length === 0 && <div className="text-gray-400 italic text-center">No fields added</div>}
          
          {fields.map((field, i) => (
            <div key={i} className={`flex ${isHorizontal ? 'items-center gap-4' : 'flex-col gap-1'}`}>
               {field.type !== 'checkbox' && (
                  <label 
                      className={`text-sm font-medium text-gray-700 ${isHorizontal ? 'w-32 text-right shrink-0' : ''}`}
                  >
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
               )}
               
               <div className="flex-1 w-full">
                  {field.type === 'textarea' ? (
                      <textarea 
                          className="w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" 
                          placeholder={field.placeholder}
                          style={inputStyle}
                          rows={3}
                          disabled
                      />
                  ) : field.type === 'checkbox' ? (
                      <div className="flex items-center gap-2">
                           <input 
                              type="checkbox" 
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                              disabled 
                           />
                           <label className="text-sm text-gray-700">{field.label}</label>
                      </div>
                  ) : (
                      <input 
                          type={field.type} 
                          className="w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" 
                          placeholder={field.placeholder}
                          style={inputStyle}
                          disabled
                      />
                  )}
               </div>
            </div>
          ))}

          {element.props.formEnableRecaptcha && (
              <div className={`flex ${isHorizontal ? 'justify-end' : ''}`}>
                  <div className={`bg-gray-100 border border-gray-300 rounded p-2 flex items-center gap-2 w-fit ${isHorizontal ? 'ml-auto' : ''}`}>
                      <div className="w-6 h-6 bg-white border rounded"></div>
                      <span className="text-xs text-gray-500">I'm not a robot (reCAPTCHA)</span>
                  </div>
              </div>
          )}

          <div className={isHorizontal ? 'pl-36' : ''}>
            <button 
                type="submit" 
                className="px-4 py-2 hover:opacity-90 transition font-medium w-full sm:w-auto"
                style={buttonStyle}
            >
                {element.props.formSubmitButtonText || 'Submit'}
            </button>
          </div>
          
          <div className="absolute top-2 right-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
             Form Preview
          </div>
        </form>
      );
    
    case 'gallery':
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pointer-events-none">
          {(element.props.items || ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150']).map((src, i) => (
            <img key={i} src={src} alt={`Gallery ${i}`} className="w-full h-32 object-cover rounded" />
          ))}
        </div>
      );

    case 'navbar':
       const { 
          isSticky, 
          navOrientation = 'horizontal', 
          logoType = 'text', 
          logoText = 'Logo', 
          logoSrc, 
          navLinks = [],
          linkColor
       } = element.props;

       const navClasses = `flex w-full p-4 bg-white ${navOrientation === 'vertical' ? 'flex-col space-y-4 items-start' : 'flex-row justify-between items-center'} ${isSticky ? 'sticky top-0 z-50 shadow-sm' : ''}`;
       
       return (
           <nav className={navClasses}>
               <div className="font-bold text-lg pointer-events-none">
                   {logoType === 'image' && logoSrc ? (
                       <img src={logoSrc} alt="Logo" className="h-8 object-contain" />
                   ) : (
                       <span>{logoText}</span>
                   )}
               </div>
               
               <ul className={`flex gap-6 pointer-events-none ${navOrientation === 'vertical' ? 'flex-col w-full' : 'items-center'}`}>
                   {navLinks.map((link, i) => (
                       <li key={i}>
                           <a 
                               href={link.href} 
                               className="transition-colors hover:opacity-80"
                               style={{ color: linkColor || 'inherit' }}
                           >
                               {link.label}
                           </a>
                       </li>
                   ))}
               </ul>
           </nav>
       );

    case 'testimonial':
        return (
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl pointer-events-none">
                <div className="w-16 h-16 bg-gray-300 rounded-full mb-4 overflow-hidden">
                    <img src="https://i.pravatar.cc/150" alt="Avatar" />
                </div>
                <p className="text-lg italic text-gray-700 mb-4">"{element.props.content || 'This product changed my life!'}"</p>
                <h4 className="font-bold">{element.props.author || 'Jane Doe'}</h4>
                <span className="text-sm text-gray-500">{element.props.role || 'CEO, Company'}</span>
                <div className="flex text-yellow-400 mt-2">
                    {[...Array(element.props.rating || 5)].map((_, i) => <span key={i}>★</span>)}
                </div>
            </div>
        );
  
    case 'card':
        return (
            <div className="bg-white rounded-lg shadow-md overflow-hidden pointer-events-none h-full flex flex-col">
                <div className="h-40 bg-gray-200 w-full">
                     <img src={element.props.src || 'https://via.placeholder.com/400x200'} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{element.props.cardTitle || 'Card Title'}</h3>
                    <p className="text-gray-600 mb-4 flex-1">{element.props.cardText || 'Some example text to build on the card title and make up the bulk of the card\'s content.'}</p>
                    <button className="self-start text-indigo-600 font-medium hover:underline">Read More &rarr;</button>
                </div>
            </div>
        )

    default:
      return null;
  }
};
