

import React, { useState, useEffect, useContext } from 'react';
import { PageElement, TestimonialItem } from '../../types';
import { Icons } from '../Icons';
import { EditorConfigContext, PopupContext } from '../EditorConfigContext';

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
  const { googleMapsApiKey, recaptchaSiteKey } = useContext(EditorConfigContext);
  const { openPopup } = useContext(PopupContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Helper to disable pointer events only in editor mode
  const pointerClass = !isPreview ? 'pointer-events-none' : '';
  const formFieldClass = "w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white";

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
          className={`w-full ${pointerClass}`}
          style={{ 
              borderRadius: element.props.style?.borderRadius,
              objectFit: (element.props.imageObjectFit || 'cover') as any,
              height: element.props.imageHeight || 'auto'
          }}
        />
      );

    case 'button':
      const action = element.props.buttonAction || 'link';
      const isLink = action === 'link';
      const customClass = element.props.className || '';
      
      if (isLink) {
          const { href, target } = element.props;
          return (
               <a 
                  href={href || '#'}
                  target={target}
                  className={`px-4 py-2 rounded transition inline-block ${pointerClass} ${customClass}`}
                  style={element.props.style}
                  onClick={(e) => {
                      // Prevent navigation in editor
                      if (!isPreview) {
                          e.preventDefault();
                          return;
                      }

                      const isEmpty = !href || href === '#';
                      const isAnchor = href && href.startsWith('#');
                      const isNewTab = target === '_blank';

                      // In preview: disable if empty OR (opens in same tab AND not anchor)
                      // We allow anchors (like #features) to work in preview as they don't reload page
                      if (isEmpty || (!isNewTab && !isAnchor)) {
                          e.preventDefault();
                      }
                  }}
               >
                  {element.props.content || 'Button'}
               </a>
          )
      }
      
      // Handle Popup Action
      if (action === 'popup') {
          return (
            <button 
                type="button"
                className={`px-4 py-2 rounded transition ${pointerClass} ${customClass}`}
                style={element.props.style}
                onClick={(e) => {
                    if (!isPreview) e.preventDefault();
                    if (element.props.popupTargetId) {
                        openPopup(element.props.popupTargetId);
                    }
                }}
            >
                {element.props.content || 'Button'}
            </button>
          )
      }
      
      return (
        <button 
          type={action === 'submit' ? 'submit' : 'button'}
          className={`px-4 py-2 rounded transition ${pointerClass} ${customClass}`}
          style={element.props.style}
        >
          {element.props.content || 'Button'}
        </button>
      );

    // --- New Form Elements ---

    case 'input':
        return (
            <div className={`w-full ${element.props.fieldHidden ? 'hidden' : ''}`}>
                {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                <input 
                    type={element.props.inputType || 'text'}
                    name={element.props.fieldName}
                    placeholder={element.props.fieldPlaceholder}
                    required={element.props.fieldRequired}
                    defaultValue={element.props.fieldDefaultValue}
                    className={`${formFieldClass} ${pointerClass}`}
                    disabled={!isPreview}
                />
            </div>
        );

    case 'textarea':
        return (
            <div className={`w-full ${element.props.fieldHidden ? 'hidden' : ''}`}>
                {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                <textarea 
                    name={element.props.fieldName}
                    placeholder={element.props.fieldPlaceholder}
                    required={element.props.fieldRequired}
                    defaultValue={element.props.fieldDefaultValue}
                    rows={element.props.fieldRows || 4}
                    className={`${formFieldClass} ${pointerClass}`}
                    disabled={!isPreview}
                />
            </div>
        );

    case 'select':
        return (
            <div className="w-full">
                {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                <select 
                    name={element.props.fieldName}
                    required={element.props.fieldRequired}
                    defaultValue={element.props.fieldDefaultValue || ""}
                    multiple={element.props.fieldMultiple}
                    className={`${formFieldClass} ${pointerClass}`}
                    disabled={!isPreview}
                >
                    {!element.props.fieldMultiple && <option value="" disabled>Select an option...</option>}
                    {element.props.fieldOptions?.map((opt, i) => (
                        <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
        );

    case 'radio':
        return (
             <div className="flex items-center gap-2">
                 <input 
                    type="radio"
                    id={element.id}
                    name={element.props.fieldName}
                    value={element.props.fieldValue}
                    defaultChecked={element.props.checked}
                    required={element.props.fieldRequired}
                    className={`text-indigo-600 focus:ring-indigo-500 h-4 w-4 ${pointerClass}`}
                    disabled={!isPreview}
                />
                {element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
            </div>
        );

    case 'checkbox':
        return (
            <div className="flex items-center gap-2">
                 <input 
                    type="checkbox"
                    id={element.id}
                    name={element.props.fieldName}
                    value={element.props.fieldValue}
                    required={element.props.fieldRequired}
                    defaultChecked={element.props.checked}
                    className={`text-indigo-600 focus:ring-indigo-500 h-4 w-4 rounded border-gray-300 ${pointerClass}`}
                    disabled={!isPreview}
                />
                {element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
            </div>
        );

    // -------------------------

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
      const address = element.props.address || 'San Francisco';
      const zoom = element.props.zoom || 13;
      const mapType = element.props.mapType || 'roadmap';

      if (!googleMapsApiKey) {
        return (
          <div className="w-full h-64 bg-gray-100 rounded overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 gap-2 relative">
             <Icons.Map width={32} height={32} className="opacity-50" />
             <div className="font-bold text-sm">Development Mode: Map</div>
             <div className="text-xs text-center px-4">
                 Address: {address}<br/>
                 Zoom: {zoom} | Type: {mapType}
             </div>
             <div className="absolute top-2 right-2 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
                 No API Key
             </div>
          </div>
        );
      }

      return (
          <div className="w-full h-64 bg-gray-100 rounded overflow-hidden relative">
              <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight={0} 
                  marginWidth={0} 
                  src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(address)}&zoom=${zoom}&maptype=${mapType}`}
                  className={pointerClass}
                  title="Google Map"
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
        if (!fields.length) return null;
        
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
            <div className={`space-y-4 w-full ${pointerClass}`}>
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
                    {recaptchaSiteKey ? (
                        <div className={`bg-gray-100 border border-gray-300 rounded p-4 flex items-center justify-center w-fit ${isHorizontal ? 'ml-auto' : ''}`}>
                        <div className="text-xs text-gray-500">reCAPTCHA Widget Placeholder</div>
                        </div>
                    ) : (
                        <div className={`bg-yellow-50 border border-yellow-200 rounded p-2 flex items-center gap-2 w-fit ${isHorizontal ? 'ml-auto' : ''}`}>
                        <div className="w-6 h-6 bg-white border border-yellow-300 rounded flex items-center justify-center text-yellow-600 text-[10px]">?</div>
                        <span className="text-xs text-yellow-700 font-medium">reCAPTCHA (Dev Mode)</span>
                    </div>
                    )}
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
            </div>
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
      
      if (galleryLayout === 'masonry') {
         return (
             <div className={`${masonryCols[galleryColumnCount] || 'columns-3'} space-y-4`} style={{ columnGap: galleryGap }}>
                 {galleryImages.map(img => (
                     <div key={img.id} className="break-inside-avoid mb-4">
                         <img 
                            src={img.src} 
                            alt={img.alt || ''} 
                            className={`w-full rounded ${pointerClass} block`}
                            style={{ display: 'block' }} 
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
          logoWidth,
          navLinks = [],
          linkColor,
          activeLinkColor,
          mobileMenuBreakpoint = 'md',
          mobileMenuType = 'dropdown',
          hamburgerColor,
          menuBackgroundColor
       } = element.props;

       const isVertical = navOrientation === 'vertical';
       const breakpointClass = mobileMenuBreakpoint === 'none' ? 'flex' : `hidden ${mobileMenuBreakpoint}:flex`;
       const mobileToggleClass = mobileMenuBreakpoint === 'none' ? 'hidden' : `flex ${mobileMenuBreakpoint}:hidden`;
       
       const navClasses = `flex w-full p-4 bg-white transition-all duration-300 relative ${isVertical ? 'flex-col space-y-4 items-start h-full' : 'flex-row justify-between items-center'} ${isSticky ? 'sticky top-0 z-50 shadow-sm' : ''}`;
       
       const linkStyle = { color: linkColor || 'inherit' };
       const activeStyle = activeLinkColor ? { '--active-color': activeLinkColor } as React.CSSProperties : {};

       return (
           <nav className={navClasses} style={activeStyle}>
               <div className={`font-bold text-lg ${pointerClass} flex items-center justify-between w-full ${isVertical ? '' : 'md:w-auto'}`}>
                   {logoType === 'image' && logoSrc ? (
                       <img 
                           src={logoSrc} 
                           alt="Logo" 
                           className="object-contain" 
                           style={{ width: logoWidth || 'auto', maxHeight: '40px' }}
                       />
                   ) : (
                       <span>{logoText}</span>
                   )}
                   
                   {/* Mobile Toggle */}
                   {!isVertical && (
                       <button 
                            className={`${mobileToggleClass} p-2 rounded hover:bg-gray-100 ${pointerClass}`}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{ color: hamburgerColor || 'inherit' }}
                        >
                           <Icons.Menu />
                       </button>
                   )}
               </div>
               
               {/* Desktop Menu */}
               <ul className={`${breakpointClass} gap-6 ${pointerClass} ${isVertical ? 'flex-col w-full' : 'items-center'}`}>
                   {navLinks.map((link, i) => (
                       <li key={i}>
                           <a 
                               href={link.href} 
                               className={`transition-colors hover:opacity-80 font-medium ${activeLinkColor ? 'hover:text-[var(--active-color)]' : ''}`}
                               style={linkStyle}
                               onClick={(e) => {
                                   if (!isPreview) {
                                       e.preventDefault();
                                       return;
                                   }
                                   // Prevent navigation in editor
                                   const isEmpty = !link.href || link.href === '#';
                                   const isAnchor = link.href && link.href.startsWith('#');
                                   if (isEmpty || !isAnchor) {
                                       e.preventDefault();
                                   }
                               }}
                           >
                               {link.label}
                           </a>
                       </li>
                   ))}
               </ul>
               
               {/* Mobile Menu */}
               {isMenuOpen && !isVertical && (
                   <>
                   {mobileMenuType === 'dropdown' && (
                       <div 
                           className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-4 gap-4 animate-fade-in z-40 ${mobileMenuBreakpoint === 'none' ? 'hidden' : `${mobileMenuBreakpoint}:hidden`}`}
                           style={{ backgroundColor: menuBackgroundColor || 'white' }}
                       >
                           {navLinks.map((link, i) => (
                               <a 
                                   key={i}
                                   href={link.href} 
                                   className={`text-lg font-medium transition-colors hover:opacity-80 block p-2 rounded hover:bg-gray-50 ${activeLinkColor ? 'hover:text-[var(--active-color)]' : ''}`}
                                   style={linkStyle}
                                   onClick={(e) => {
                                       const isEmpty = !link.href || link.href === '#';
                                       const isAnchor = link.href && link.href.startsWith('#');
                                       
                                       if (!isPreview) {
                                           e.preventDefault();
                                           setIsMenuOpen(false);
                                           return;
                                       }
                                       if (isEmpty || !isAnchor) e.preventDefault();
                                       setIsMenuOpen(false);
                                   }}
                               >
                                   {link.label}
                               </a>
                           ))}
                       </div>
                   )}

                   {(mobileMenuType === 'slide-left' || mobileMenuType === 'slide-right') && (
                       <div className={`fixed inset-0 z-50 ${mobileMenuBreakpoint === 'none' ? 'hidden' : `${mobileMenuBreakpoint}:hidden`}`}>
                           <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setIsMenuOpen(false)}></div>
                           <div 
                               className={`absolute top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col p-6 gap-4 ${mobileMenuType === 'slide-left' ? 'left-0 animate-slide-in-left' : 'right-0 animate-slide-in-right'}`}
                               style={{ backgroundColor: menuBackgroundColor || 'white' }}
                           >
                               <div className="flex justify-end">
                                   <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                                       <Icons.X />
                                   </button>
                               </div>
                               {navLinks.map((link, i) => (
                                   <a 
                                       key={i}
                                       href={link.href} 
                                       className={`text-lg font-medium transition-colors hover:opacity-80 block p-2 rounded hover:bg-gray-50 ${activeLinkColor ? 'hover:text-[var(--active-color)]' : ''}`}
                                       style={linkStyle}
                                       onClick={(e) => {
                                           const isEmpty = !link.href || link.href === '#';
                                           const isAnchor = link.href && link.href.startsWith('#');

                                           if (!isPreview) {
                                               e.preventDefault();
                                               setIsMenuOpen(false);
                                               return;
                                           }
                                           if (isEmpty || !isAnchor) e.preventDefault();
                                           setIsMenuOpen(false);
                                       }}
                                   >
                                       {link.label}
                                   </a>
                               ))}
                           </div>
                       </div>
                   )}
                   </>
               )}
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
       }[testimonialAvatarSize as string] || 'w-12 h-12';

       const shapeClass = {
           'circle': 'rounded-full',
           'square': 'rounded-none',
           'rounded': 'rounded-lg'
       }[testimonialAvatarShape as string] || 'rounded-full';
       
       if (testimonialLayout === 'slider') {
           return <TestimonialSlider items={testimonialItems} avatarSize={sizeClass} avatarShape={shapeClass} bubbleColor={testimonialBubbleColor} />;
       }

       // Grid layout
       return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {testimonialItems.map(item => (
                    <div key={item.id} className="flex flex-col h-full">
                         <div className="p-6 rounded-2xl relative mb-4 flex-1 shadow-sm" style={{ backgroundColor: testimonialBubbleColor }}>
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
                                <div className="flex text-yellow-400 text-xs mt-0.5">
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

    case 'card':
        if (element.props.cardBadge) {
             return (
                <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm pointer-events-none">
                    {element.props.cardBadge}
                </div>
             );
        }
        return null;

    default:
      return null;
  }
};