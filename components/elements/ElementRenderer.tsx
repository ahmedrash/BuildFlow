import React, { useState, useEffect, useContext } from 'react';
import { PageElement, TestimonialItem, NavLinkItem } from '../../types';
import { Icons } from '../Icons';
import { EditorConfigContext, PopupContext, PageContext } from '../EditorConfigContext';
import { ComponentRegistry } from '../registry';
import '../definitions'; // Register definitions

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

export const ChildWrapper: React.FC<{ element: PageElement; isPreview?: boolean }> = ({ element, isPreview }) => {
    const { props, type } = element;
    
    // Check if the component handles its own container rendering
    // Standard containers in registry (section, container, columns, navbar, card, form) now handle their own ID/Class
    const isSelfContained = ['section', 'container', 'columns', 'navbar', 'slider', 'card', 'form'].includes(type);
    
    if (isSelfContained) {
         return <ElementRenderer element={element} isPreview={isPreview} />;
    }

    const renderBackground = () => {
        if (!['section', 'container', 'columns', 'navbar', 'card'].includes(type)) return null;
        const { backgroundImage, backgroundVideo, parallax } = props || {};
        const { backgroundImage: styleBgImage, backgroundVideo: styleBgVideo } = props.style || {};
        const finalBgImage = styleBgImage || backgroundImage;
        const finalBgVideo = styleBgVideo || backgroundVideo;
        
        if (finalBgVideo) return <video src={finalBgVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none" />;
        if (finalBgImage) {
            const url = finalBgImage.startsWith('url') ? finalBgImage.slice(4, -1).replace(/["']/g, "") : finalBgImage;
            return <div className={`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none ${parallax ? 'bg-fixed' : ''}`} style={{ backgroundImage: `url(${url})` }} />;
        }
        return null;
    };

    return (
        <div id={element.id} className={`${props.className || ''} relative`} style={props.style}>
            {renderBackground()}
            <ElementRenderer element={element} isPreview={isPreview} />
        </div>
    );
};

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isPreview }) => {
  const { googleMapsApiKey } = useContext(EditorConfigContext);
  const { openPopup } = useContext(PopupContext);
  const { findElement } = useContext(PageContext);
  
  // Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Use Registry
  const definition = ComponentRegistry.get(element.type);
  if (definition) {
      const Component = definition.render;
      return <Component element={element} isPreview={!!isPreview} />;
  }

  // Fallback for complex components not yet in definitions.tsx (e.g. Menu, Slider logic, etc)
  
  const openMenu = () => { setIsMenuOpen(true); setIsClosing(false); };
  const closeMenu = () => { setIsClosing(true); setTimeout(() => { setIsMenuOpen(false); setIsClosing(false); }, 300); };
  const toggleMenu = () => { if (isMenuOpen && !isClosing) closeMenu(); else if (!isMenuOpen) openMenu(); };
  
  const pointerClass = !isPreview ? 'pointer-events-none' : '';
  const formFieldClass = "w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white";
  const innerStyle = element.props.elementStyle || {};
  const innerClass = element.props.elementClassName || '';

  const NavItemRenderer: React.FC<{ link: NavLinkItem, linkStyle: React.CSSProperties, activeLinkColor?: string }> = ({ link, linkStyle, activeLinkColor }) => {
     const hasChildren = link.children && link.children.length > 0;
     const isMegaMenu = link.type === 'mega-menu' && link.targetId;
     const isPopup = link.type === 'popup';
     
     const handleLinkClick = (e: React.MouseEvent) => {
         if (!isPreview) { e.preventDefault(); return; }
         if (isPopup && link.targetId) {
             e.preventDefault();
             openPopup(link.targetId);
             return;
         }
         if (link.href && link.href.startsWith('#')) {
             e.preventDefault();
             const id = link.href.substring(1);
             const doc = (e.target as HTMLElement).ownerDocument;
             if (!id) doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
             else doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
         }
     };

     const baseClasses = `transition-colors hover:opacity-80 font-medium flex items-center gap-1 ${activeLinkColor ? 'hover:text-[var(--active-color)]' : ''} cursor-pointer`;
     
     let megaMenuContent: React.ReactNode = null;
     if (isMegaMenu && link.targetId) {
         const targetElement = findElement(link.targetId);
         if (targetElement) {
             const placement = link.megaMenuPlacement || 'center';
             const containerAlignment = placement === 'left' ? 'mr-auto' : placement === 'right' ? 'ml-auto' : 'mx-auto';
             // Mega Menu Fix: Use ChildWrapper to render the referenced element.
             // If targetElement is a container (it usually is), ChildWrapper will call ElementRenderer which renders the container div.
             megaMenuContent = (
                 <div className="absolute top-full left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:visible transition-all duration-200 z-50">
                     <div className="max-h-[80vh] overflow-y-auto">
                        <div className={`container ${containerAlignment}`}>
                             <ChildWrapper element={targetElement} isPreview={isPreview} />
                        </div>
                     </div>
                 </div>
             );
         }
     }

     return (
         <li className={`group ${isMegaMenu ? 'static' : 'relative'}`}> 
             {link.href || isPopup ? (
                 <a href={link.href || '#'} className={baseClasses} style={linkStyle} onClick={handleLinkClick} target={link.target}>
                     {link.label}
                     {(hasChildren || isMegaMenu) && <Icons.ChevronDown width={12} height={12} />}
                 </a>
             ) : (
                 <div className={baseClasses} style={linkStyle}>
                     {link.label}
                     {(hasChildren || isMegaMenu) && <Icons.ChevronDown width={12} height={12} />}
                 </div>
             )}
             {hasChildren && !isMegaMenu && (
                 <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                     <div className="bg-white rounded shadow-lg border border-gray-100 py-2 flex flex-col">
                         {link.children!.map((child, i) => (
                             <a key={i} href={child.href || '#'} className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 block transition-colors" onClick={(e) => {
                                    if(child.type === 'popup' && child.targetId && isPreview) { e.preventDefault(); openPopup(child.targetId); }
                                }}>{child.label}</a>
                         ))}
                     </div>
                 </div>
             )}
             {megaMenuContent}
         </li>
     );
  };
  
  const MobileNavItemRenderer: React.FC<{ link: NavLinkItem, linkStyle: React.CSSProperties, activeLinkColor?: string }> = ({ link, linkStyle, activeLinkColor }) => {
      const [isExpanded, setIsExpanded] = useState(false);
      const hasChildren = (link.children && link.children.length > 0) || (link.type === 'mega-menu' && link.targetId);
      
      const handleLinkClick = (e: React.MouseEvent) => {
        if (!isPreview) { e.preventDefault(); return; }
        if (hasChildren && !link.href && link.type !== 'popup') { setIsExpanded(!isExpanded); return; }
        if (link.type === 'popup' && link.targetId) { e.preventDefault(); openPopup(link.targetId); closeMenu(); return; }
        if (link.href && link.href.startsWith('#')) {
            e.preventDefault();
            const id = link.href.substring(1);
            const doc = (e.target as HTMLElement).ownerDocument;
            if (!id) doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
            else doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            closeMenu();
        }
      };

      return (
          <div className="border-b border-gray-100 last:border-0">
               <div className="flex items-center justify-between py-3 px-2">
                   {link.href || link.type === 'popup' ? (
                       <a href={link.href || '#'} style={linkStyle} onClick={handleLinkClick} className="font-medium text-lg block flex-1">{link.label}</a>
                   ) : (
                       <span style={linkStyle} className="font-medium text-lg block flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>{link.label}</span>
                   )}
                   {hasChildren && <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-400"><div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}><Icons.ChevronDown /></div></button>}
               </div>
               {isExpanded && hasChildren && (
                   <div className="bg-gray-50 p-4 space-y-3">
                       {link.children?.map((child, i) => (
                           <a key={i} href={child.href || '#'} className="block text-gray-600 hover:text-indigo-600 pl-2" onClick={(e) => {
                               if(child.type === 'popup' && child.targetId && isPreview) { e.preventDefault(); openPopup(child.targetId); closeMenu(); }
                           }}>{child.label}</a>
                       ))}
                       {link.type === 'mega-menu' && link.targetId && (() => {
                           const targetElement = findElement(link.targetId);
                           if (!targetElement) return null;
                           return <div className="border-t border-gray-200 pt-2"><ChildWrapper element={targetElement} isPreview={isPreview} /></div>
                       })()}
                   </div>
               )}
          </div>
      )
  };

  const renderBackground = () => {
    if (!['section', 'container', 'columns', 'navbar', 'card'].includes(element.type)) return null;
    const { backgroundImage, backgroundVideo, parallax } = element.props || {};
    const { backgroundImage: styleBgImage, backgroundVideo: styleBgVideo } = element.props.style || {};
    const finalBgImage = styleBgImage || backgroundImage;
    const finalBgVideo = styleBgVideo || backgroundVideo;
    if (finalBgVideo) return <video src={finalBgVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none" />;
    if (finalBgImage) {
      const url = finalBgImage.startsWith('url') ? finalBgImage.slice(4, -1).replace(/["']/g, "") : finalBgImage;
      return <div className={`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none ${parallax ? 'bg-fixed' : ''}`} style={{ backgroundImage: `url(${url})` }} />;
    }
    return null;
  };

  switch (element.type) {
    case 'menu':
       const { navLinks = [], linkColor, activeLinkColor, mobileMenuBreakpoint = 'md', mobileMenuType = 'dropdown', hamburgerColor, menuBackgroundColor, mobileMenuIconType = 'menu' } = element.props;
       
       // Lookup table for static class generation to ensure Tailwind scans them correctly during build
       const menuBreakpoints = {
           'sm': { desktop: 'hidden sm:flex', mobile: 'flex sm:hidden', drawer: 'sm:hidden' },
           'md': { desktop: 'hidden md:flex', mobile: 'flex md:hidden', drawer: 'md:hidden' },
           'lg': { desktop: 'hidden lg:flex', mobile: 'flex lg:hidden', drawer: 'lg:hidden' },
           'none': { desktop: 'flex', mobile: 'hidden', drawer: 'hidden' }
       };

       const bpConfig = menuBreakpoints[mobileMenuBreakpoint as keyof typeof menuBreakpoints] || menuBreakpoints['md'];
       const breakpointClass = bpConfig.desktop;
       const mobileToggleClass = bpConfig.mobile;
       const drawerHiddenClass = bpConfig.drawer;

       const linkStyle = { color: linkColor || 'inherit' };
       const activeStyle = activeLinkColor ? { '--active-color': activeLinkColor } as React.CSSProperties : {};
       return (
            <div className={`flex items-center ${innerClass}`} style={{...activeStyle, ...innerStyle}}>
                <ul className={`${breakpointClass} gap-6 items-center ${pointerClass}`}>
                    {navLinks.map((link, i) => <NavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}
                </ul>
                <button className={`${mobileToggleClass} p-2 rounded hover:bg-gray-100 ${pointerClass}`} onClick={toggleMenu} style={{ color: hamburgerColor || 'inherit' }}>
                    {mobileMenuIconType === 'grid' ? <Icons.Grid /> : mobileMenuIconType === 'dots' ? <Icons.Dots /> : <Icons.Menu />}
                </button>
                {isMenuOpen && (
                   <>
                   {mobileMenuType === 'dropdown' && (
                       <div className={`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col z-40 max-h-[80vh] overflow-y-auto ${isClosing ? 'animate-fade-out' : 'animate-fade-in'} ${drawerHiddenClass}`} style={{ backgroundColor: menuBackgroundColor || 'white' }}>
                           {navLinks.map((link, i) => <MobileNavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}
                       </div>
                   )}
                   {(mobileMenuType === 'slide-left' || mobileMenuType === 'slide-right') && (
                       <div className={`fixed inset-0 z-50 h-[100vh] ${drawerHiddenClass}`}>
                           <div className={`absolute inset-0 bg-black/50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={closeMenu}></div>
                           <div className={`absolute top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col overflow-y-auto ${mobileMenuType === 'slide-left' ? (isClosing ? 'left-0 animate-slide-out-left' : 'left-0 animate-slide-in-left') : (isClosing ? 'right-0 animate-slide-out-right' : 'right-0 animate-slide-in-right')}`} style={{ backgroundColor: menuBackgroundColor || 'white' }}>
                               <div className="flex justify-end p-4"><button onClick={closeMenu} className="p-2 text-gray-500 hover:text-gray-700"><Icons.X /></button></div>
                               <div className="px-4 pb-8">{navLinks.map((link, i) => <MobileNavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}</div>
                           </div>
                       </div>
                   )}
                   </>
               )}
            </div>
       );
    case 'select': 
        return <div className="w-full">{element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}<select name={element.props.fieldName} required={element.props.fieldRequired} defaultValue={element.props.fieldDefaultValue || ""} multiple={element.props.fieldMultiple} className={`${formFieldClass} ${pointerClass} ${innerClass}`} style={innerStyle} disabled={!isPreview}>{!element.props.fieldMultiple && <option value="" disabled>Select an option...</option>}{element.props.fieldOptions?.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}</select></div>;
    case 'radio': 
        return <div className="flex items-center gap-2"><input type="radio" id={element.id} name={element.props.fieldName} value={element.props.fieldValue} defaultChecked={element.props.checked} required={element.props.fieldRequired} className={`text-indigo-600 focus:ring-indigo-500 h-4 w-4 ${pointerClass} ${innerClass}`} style={innerStyle} disabled={!isPreview}/>{element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}</div>;
    case 'checkbox': 
        return <div className="flex items-center gap-2"><input type="checkbox" id={element.id} name={element.props.fieldName} value={element.props.fieldValue} required={element.props.fieldRequired} defaultChecked={element.props.checked} className={`text-indigo-600 focus:ring-indigo-500 h-4 w-4 rounded border-gray-300 ${pointerClass} ${innerClass}`} style={innerStyle} disabled={!isPreview}/>{element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}</div>;
    case 'list': 
        const ListTag = element.props.listType || 'ul';
        const listStyle = element.props.listStyleType || (ListTag === 'ul' ? 'disc' : 'decimal');
        return (<ListTag className={`pl-5 ${innerClass}`} style={{ listStyleType: listStyle, ...innerStyle }}>{(element.props.items || ['Item 1', 'Item 2', 'Item 3']).map((item, i, arr) => (<li key={i} style={{ marginBottom: i === arr.length - 1 ? 0 : element.props.itemSpacing }}>{item}</li>))}</ListTag>);
    case 'map': 
        const address = element.props.address || 'San Francisco';
        if (!googleMapsApiKey) return (<div className="w-full h-64 bg-gray-100 rounded overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 gap-2 relative"><Icons.Map width={32} height={32} className="opacity-50" /><div className="font-bold text-sm">Development Mode: Map</div><div className="text-xs text-center px-4">Address: {address}</div></div>);
        return (<div className={`w-full h-64 bg-gray-100 rounded overflow-hidden relative ${innerClass}`} style={innerStyle}><iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={`https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodeURIComponent(address)}&zoom=${element.props.zoom || 13}&maptype=${element.props.mapType || 'roadmap'}`} className={pointerClass}></iframe></div>);
    case 'customCode': 
        return (<div className={`min-h-[50px] ${innerClass}`} style={innerStyle} dangerouslySetInnerHTML={{ __html: element.props.code || '<div class="text-gray-400 p-2 border border-dashed">Custom Code Block</div>' }} />);
    case 'gallery': 
        const { galleryImages = [], galleryLayout = 'grid', galleryColumnCount = 3, galleryGap = '1rem', galleryAspectRatio = 'aspect-square', galleryObjectFit = 'cover' } = element.props;
        const gridCols: Record<number, string> = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
        const masonryCols: Record<number, string> = { 1: 'columns-1', 2: 'columns-2', 3: 'columns-3', 4: 'columns-4', 5: 'columns-5', 6: 'columns-6' };
        const gapStyle = { gap: galleryGap, ...innerStyle };
        const commonImgClass = `w-full h-full rounded ${pointerClass} object-${galleryObjectFit} block`;
        if (galleryLayout === 'masonry') return (<div className={`${masonryCols[galleryColumnCount] || 'columns-3'} space-y-4 ${innerClass}`} style={{ ...gapStyle, columnGap: galleryGap }}>{galleryImages.map(img => (<div key={img.id} className="break-inside-avoid mb-4"><img src={img.src} alt={img.alt || ''} className={`w-full rounded ${pointerClass} block`} style={{ display: 'block' }} /></div>))}</div>);
        if (galleryLayout === 'flex') return (<div className={`flex flex-wrap ${innerClass}`} style={gapStyle}>{galleryImages.map(img => (<div key={img.id} className={`flex-grow basis-64 min-w-[200px] ${galleryAspectRatio === 'auto' ? '' : galleryAspectRatio} relative`}><img src={img.src} alt={img.alt || ''} className={`${commonImgClass} absolute inset-0`}/></div>))}</div>);
        return (<div className={`grid ${gridCols[galleryColumnCount] || 'grid-cols-3'} ${innerClass}`} style={gapStyle}>{galleryImages.map(img => (<div key={img.id} className={`relative overflow-hidden rounded ${galleryAspectRatio}`}><img src={img.src} alt={img.alt || ''} className={commonImgClass} /></div>))}</div>);
    case 'testimonial': 
        const { testimonialItems = [], testimonialLayout = 'grid', testimonialAvatarSize = 'md', testimonialAvatarShape = 'circle', testimonialBubbleColor = '#f9fafb' } = element.props;
        const sizeClass = { 'sm': 'w-8 h-8', 'md': 'w-12 h-12', 'lg': 'w-16 h-16', 'xl': 'w-24 h-24' }[testimonialAvatarSize as string] || 'w-12 h-12';
        const shapeClass = { 'circle': 'rounded-full', 'square': 'rounded-none', 'rounded': 'rounded-lg' }[testimonialAvatarShape as string] || 'rounded-full';
        if (testimonialLayout === 'slider') return <TestimonialSlider items={testimonialItems} avatarSize={sizeClass} avatarShape={shapeClass} bubbleColor={testimonialBubbleColor} />;
        return (<div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ${innerClass}`} style={innerStyle}>{testimonialItems.map(item => (<div key={item.id} className="flex flex-col h-full"><div className="p-6 rounded-2xl relative mb-4 flex-1 shadow-sm" style={{ backgroundColor: testimonialBubbleColor }}><div className="absolute top-full left-8 -mt-2 border-8 border-transparent" style={{ borderTopColor: testimonialBubbleColor }}></div><p className="text-gray-700 italic relative z-10">"{item.content}"</p></div><div className="flex items-center gap-3 px-2">{item.avatarSrc && (<img src={item.avatarSrc} alt={item.author} className={`${sizeClass} ${shapeClass} object-cover bg-gray-200 border border-white shadow-sm`}/>)}<div><h4 className="font-bold text-sm text-gray-900">{item.author}</h4><p className="text-xs text-gray-500">{item.role}</p><div className="flex text-yellow-400 text-xs mt-0.5">{[...Array(5)].map((_, i) => (<span key={i} className={i < item.rating ? 'opacity-100' : 'opacity-30'}>★</span>))}</div></div></div></div>))}</div>);
    case 'slider':
        return (
             <div id={element.id} className={`${element.props.className || ''} relative`} style={element.props.style}>
                 {renderBackground()}
                {element.children?.map((child, i) => (
                    <div key={child.id} className={i === 0 ? 'relative' : 'hidden'}>
                         <ChildWrapper element={child} isPreview={isPreview} />
                    </div>
                ))}
             </div>
        );
    default:
      return null;
  }
};