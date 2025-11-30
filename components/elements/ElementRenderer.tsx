

import React, { useState, useEffect } from 'react';
import { PageElement, TestimonialItem } from '../../types';
import { Icons } from '../Icons';

interface ElementRendererProps {
  element: PageElement;
  isPreview?: boolean;
}

const TestimonialSlider: React.FC<{ items: TestimonialItem[]; avatarSize: string; avatarShape: string; bubbleColor: string }> = ({ 
    items, avatarSize, avatarShape, bubbleColor 
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [items.length]);

    const currentItem = items[currentIndex];

    return (
        <div className="relative w-full max-w-2xl mx-auto p-4">
             <div className="flex flex-col items-center text-center animate-fade-in transition-opacity duration-300">
                 <div className={`p-8 rounded-2xl relative mb-6 shadow-sm`} style={{ backgroundColor: bubbleColor }}>
                     <div className="text-4xl text-indigo-200 absolute top-4 left-4 font-serif leading-none">“</div>
                     <p className="text-lg text-gray-700 relative z-10">{currentItem.content}</p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                     {currentItem.avatarSrc && (
                         <img 
                             src={currentItem.avatarSrc} 
                             alt={currentItem.author} 
                             className={`${avatarSize} ${avatarShape} object-cover border-2 border-white shadow-sm`}
                         />
                     )}
                     <div className="text-left">
                         <h4 className="font-bold text-gray-900">{currentItem.author}</h4>
                         <p className="text-sm text-gray-500">{currentItem.role}</p>
                         <div className="flex text-yellow-400 text-xs mt-0.5">
                             {[...Array(5)].map((_, i) => (
                                 <span key={i} className={i < currentItem.rating ? 'opacity-100' : 'opacity-30'}>★</span>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
             
             {items.length > 1 && (
                 <div className="flex justify-center gap-2 mt-6">
                     {items.map((_, idx) => (
                         <button 
                             key={idx}
                             className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'}`}
                             onClick={() => setCurrentIndex(idx)}
                         />
                     ))}
                 </div>
             )}
        </div>
    );
};

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isPreview }) => {
  // Helper to disable pointer events only in editor mode
  const pointerClass = !isPreview ? 'pointer-events-none' : '';

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
          className={`w-full h-auto object-cover ${pointerClass}`}
          style={{ borderRadius: element.props.style?.borderRadius }}
        />
      );

    case 'button':
      const action = element.props.buttonAction || 'link';
      const isLink = action === 'link';
      const customClass = element.props.className || '';
      
      if (isLink) {
          return (
               <a 
                  href={element.props.href || '#'}
                  target={element.props.target}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block ${pointerClass} ${customClass}`}
                  style={element.props.style}
                  onClick={(e) => {
                      // Prevent navigation in editor, but allow in preview
                      if (!isPreview) e.preventDefault();
                  }}
               >
                  {element.props.content || 'Button'}
               </a>
          )
      }
      
      return (
        <button 
          type={action === 'submit' ? 'submit' : 'button'}
          className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition ${pointerClass} ${customClass}`}
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
              className={`w-full h-full ${pointerClass}`}
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
                  className={pointerClass}
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

    case 'form': {
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
        <form className={`space-y-4 p-4 border border-dashed border-gray-200 rounded bg-white/50 w-full relative ${pointerClass}`}>
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
                          disabled={!isPreview}
                      />
                  ) : field.type === 'checkbox' ? (
                      <div className="flex items-center gap-2">
                           <input 
                              type="checkbox" 
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                              disabled={!isPreview}
                           />
                           <label className="text-sm text-gray-700">{field.label}</label>
                      </div>
                  ) : (
                      <input 
                          type={field.type} 
                          className="w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500" 
                          placeholder={field.placeholder}
                          style={inputStyle}
                          disabled={!isPreview}
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
          
          {!isPreview && (
              <div className="absolute top-2 right-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                 Form Preview
              </div>
          )}
        </form>
      );
    }
    
    case 'gallery':
      const {
          galleryImages = [],
          galleryLayout = 'grid',
          galleryColumnCount = 3,
          galleryGap = '1rem',
          galleryAspectRatio = 'aspect-square',
          galleryObjectFit = 'cover'
      } = element.props;

      // Map column count to tailwind class
      const gridCols: Record<number, string> = {
          1: 'grid-cols-1',
          2: 'grid-cols-2',
          3: 'grid-cols-3',
          4: 'grid-cols-4',
          5: 'grid-cols-5',
          6: 'grid-cols-6'
      };

      const masonryCols: Record<number, string> = {
        1: 'columns-1',
        2: 'columns-2',
        3: 'columns-3',
        4: 'columns-4',
        5: 'columns-5',
        6: 'columns-6'
    };

      const gapStyle = { gap: galleryGap };
      const commonImgClass = `w-full h-full rounded ${pointerClass} object-${galleryObjectFit} block`;
      
      // Handle different layouts
      if (galleryLayout === 'masonry') {
         return (
             <div className={`${masonryCols[galleryColumnCount] || 'columns-3'} space-y-4`} style={{ columnGap: galleryGap }}>
                 {galleryImages.map(img => (
                     <div key={img.id} className="break-inside-avoid mb-4">
                         <img 
                            src={img.src} 
                            alt={img.alt || ''} 
                            className={`w-full rounded ${pointerClass} block`}
                            style={{ display: 'block' }} // Ensure block to avoid line-height gaps
                        />
                     </div>
                 ))}
             </div>
         );
      }
      
      if (galleryLayout === 'flex') {
          return (
              <div className="flex flex-wrap" style={gapStyle}>
                   {galleryImages.map(img => (
                     <div key={img.id} className={`flex-grow basis-64 min-w-[200px] ${galleryAspectRatio === 'auto' ? '' : galleryAspectRatio} relative`}>
                         <img 
                            src={img.src} 
                            alt={img.alt || ''} 
                            className={`${commonImgClass} absolute inset-0`}
                        />
                     </div>
                 ))}
              </div>
          )
      }

      // Default to Grid
      return (
        <div className={`grid ${gridCols[galleryColumnCount] || 'grid-cols-3'}`} style={gapStyle}>
          {galleryImages.map(img => (
             <div key={img.id} className={`relative overflow-hidden rounded ${galleryAspectRatio}`}>
                  <img 
                    src={img.src} 
                    alt={img.alt || ''} 
                    className={commonImgClass} 
                 />
             </div>
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
               <div className={`font-bold text-lg ${pointerClass}`}>
                   {logoType === 'image' && logoSrc ? (
                       <img src={logoSrc} alt="Logo" className="h-8 object-contain" />
                   ) : (
                       <span>{logoText}</span>
                   )}
               </div>
               
               <ul className={`flex gap-6 ${pointerClass} ${navOrientation === 'vertical' ? 'flex-col w-full' : 'items-center'}`}>
                   {navLinks.map((link, i) => (
                       <li key={i}>
                           <a 
                               href={link.href} 
                               className="transition-colors hover:opacity-80"
                               style={{ color: linkColor || 'inherit' }}
                               onClick={(e) => !isPreview && e.preventDefault()}
                           >
                               {link.label}
                           </a>
                       </li>
                   ))}
               </ul>
           </nav>
       );

    case 'testimonial':
        const {
            testimonialItems = [],
            testimonialLayout = 'grid',
            testimonialAvatarSize = 'md',
            testimonialAvatarShape = 'circle',
            testimonialBubbleColor = '#f9fafb'
        } = element.props;

        const sizeClass = {
            'sm': 'w-8 h-8',
            'md': 'w-12 h-12',
            'lg': 'w-16 h-16',
            'xl': 'w-24 h-24'
        }[testimonialAvatarSize] || 'w-12 h-12';

        const shapeClass = {
            'circle': 'rounded-full',
            'rounded': 'rounded-lg',
            'square': 'rounded-none'
        }[testimonialAvatarShape] || 'rounded-full';

        if (testimonialLayout === 'slider') {
            return (
                <TestimonialSlider 
                    items={testimonialItems} 
                    avatarSize={sizeClass} 
                    avatarShape={shapeClass} 
                    bubbleColor={testimonialBubbleColor}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {testimonialItems.map(item => (
                    <div key={item.id} className={`flex flex-col h-full ${pointerClass}`}>
                         <div className="p-6 rounded-2xl relative mb-4 flex-1 shadow-sm" style={{ backgroundColor: testimonialBubbleColor }}>
                             {/* Triangle for speech bubble effect */}
                             <div className="absolute top-full left-8 -mt-2 border-8 border-transparent" style={{ borderTopColor: testimonialBubbleColor }}></div>
                             <p className="text-gray-700 italic relative z-10">"{item.content}"</p>
                         </div>
                         <div className="flex items-center gap-3 px-2">
                            {item.avatarSrc && (
                                <img 
                                    src={item.avatarSrc} 
                                    alt={item.author} 
                                    className={`${sizeClass} ${shapeClass} object-cover bg-gray-200 border border-white shadow-sm`}
                                />
                            )}
                            <div>
                                <h4 className="font-bold text-sm text-gray-900">{item.author}</h4>
                                <p className="text-xs text-gray-500">{item.role}</p>
                                <div className="flex text-yellow-400 text-[10px]">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < item.rating ? 'opacity-100' : 'opacity-30'}>★</span>
                                    ))}
                                </div>
                            </div>
                         </div>
                    </div>
                ))}
            </div>
        );
  
    case 'card': {
        const {
            cardImageType = 'image',
            cardIcon,
            cardIconColor = '#4f46e5',
            cardIconSize = 'w-12 h-12',
            cardLayout = 'vertical',
            cardHoverEffect = 'lift',
            cardBadge,
            cardTitle = 'Card Title',
            cardText = 'Card description text goes here.',
            cardButtonText = 'Read More',
            src = 'https://via.placeholder.com/400x200',
            href
        } = element.props;

        const isHorizontal = cardLayout === 'horizontal';
        
        // Hover effects
        let hoverClasses = 'transition-all duration-300';
        if (cardHoverEffect === 'lift') hoverClasses += ' hover:-translate-y-1 hover:shadow-lg';
        if (cardHoverEffect === 'zoom') hoverClasses += ' hover:scale-[1.02] hover:shadow-lg';
        if (cardHoverEffect === 'glow') hoverClasses += ' hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]';
        if (cardHoverEffect === 'border') hoverClasses += ' hover:border-indigo-500';

        const IconComp = cardIcon ? (Icons[cardIcon as keyof typeof Icons] || Icons.Box) : Icons.Box;

        const content = (
            <div className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex relative border border-transparent ${isHorizontal ? 'flex-row' : 'flex-col'} ${hoverClasses} ${pointerClass}`} style={{ backgroundColor: element.props.style?.backgroundColor }}>
                {cardBadge && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                        {cardBadge}
                    </div>
                )}
                
                {/* Media Section */}
                <div className={`${isHorizontal ? 'w-1/3 min-w-[120px]' : 'w-full h-48'} bg-gray-100 flex items-center justify-center overflow-hidden shrink-0`}>
                    {cardImageType === 'image' ? (
                        <img src={src} className="w-full h-full object-cover" alt={cardTitle} />
                    ) : (
                        <div className="p-6 flex items-center justify-center w-full h-full">
                            <div style={{ color: cardIconColor }}>
                                <IconComp className={cardIconSize} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-gray-900 leading-tight">{cardTitle}</h3>
                    <p className="text-gray-600 mb-4 flex-1 text-sm leading-relaxed">{cardText}</p>
                    <span className="self-start text-indigo-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        {cardButtonText} <Icons.ArrowRight width={14} height={14} />
                    </span>
                </div>
            </div>
        );

        if (element.props.cardLink) {
             return (
                 <a 
                    href={element.props.cardLink} 
                    className="block h-full" 
                    onClick={e => !isPreview && e.preventDefault()}
                 >
                     {content}
                 </a>
             )
        }
        return content;
    }

    default:
      return null;
  }
};
