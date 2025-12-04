
import { PageElement, SavedTemplate } from "../types";

export const exportHtml = (
    elements: PageElement[], 
    templates: SavedTemplate[], 
    title: string, 
    description: string,
    googleMapsApiKey?: string,
    recaptchaSiteKey?: string
): string => {
  const elementsJson = JSON.stringify(elements).replace(/<\/script>/g, '<\\/script>');
  const templatesJson = JSON.stringify(templates).replace(/<\/script>/g, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en" class="overflow-x-hidden">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <script>
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com should not be used in production')) return;
        originalWarn.apply(console, args);
      };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
      html { scroll-behavior: smooth; }
      body { font-family: 'Inter', sans-serif; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      .animate-fade-out { animation: fadeOut 0.3s ease-out forwards; }
      @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .animate-slide-in-left { animation: slideInLeft 0.3s ease-out forwards; }
      @keyframes slideOutLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
      .animate-slide-out-left { animation: slideOutLeft 0.3s ease-out forwards; }
      @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      .animate-slide-in-right { animation: slideInRight 0.3s ease-out forwards; }
      @keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
      .animate-slide-out-right { animation: slideOutRight 0.3s ease-out forwards; }
      @keyframes slideInDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
      .animate-slide-in-down { animation: slideInDown 0.3s ease-out forwards; }
      @keyframes slideOutUp { from { transform: translateY(0); } to { transform: translateY(-100%); } }
      .animate-slide-out-up { animation: slideOutUp 0.3s ease-out forwards; }
    </style>
    ${recaptchaSiteKey ? `<script src="https://www.google.com/recaptcha/api.js" async defer></script>` : ''}
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-white text-slate-900 overflow-x-hidden">
    <div id="root"></div>

    <script type="text/babel">
        // Data
        const elements = ${elementsJson};
        const savedTemplates = ${templatesJson};
        const googleMapsApiKey = "${googleMapsApiKey || ''}";
        const recaptchaSiteKey = "${recaptchaSiteKey || ''}";

        // Context
        const PopupContext = React.createContext({ openPopup: () => {}, popupTargets: new Set() });
        const PageContext = React.createContext({ findElement: (id) => null });
        const EditorConfigContext = React.createContext({ googleMapsApiKey: '', recaptchaSiteKey: '' });

        // Icons
        const Icons = {
             ArrowLeft: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
             ArrowRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
             ChevronDown: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>,
             ChevronRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>,
             CaretRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/></svg>,
             CaretLeft: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/></svg>,
             Box: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
             Layout: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
             Menu: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
             X: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
             Map: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
             Plus: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
             Grid: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
             Dots: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
        };

        const TestimonialSlider = ({ items, avatarSize, avatarShape, bubbleColor }) => {
            const [currentIndex, setCurrentIndex] = React.useState(0);
            React.useEffect(() => {
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
                         <div className={\`p-8 rounded-2xl relative mb-6 shadow-sm\`} style={{ backgroundColor: bubbleColor }}>
                             <div className="text-4xl text-indigo-200 absolute top-4 left-4 font-serif leading-none">“</div>
                             <p className="text-lg text-gray-700 relative z-10">{currentItem.content}</p>
                         </div>
                         
                         <div className="flex items-center gap-4">
                             {currentItem.avatarSrc && (
                                 <img 
                                     src={currentItem.avatarSrc} 
                                     alt={currentItem.author} 
                                     className={\`\${avatarSize} \${avatarShape} object-cover border-2 border-white shadow-sm\`}
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
                                     className={\`w-2 h-2 rounded-full transition-colors \${idx === currentIndex ? 'bg-indigo-600' : 'bg-gray-300'}\`}
                                     onClick={() => setCurrentIndex(idx)}
                                 />
                             ))}
                         </div>
                     )}
                </div>
            );
        };

        const ChildWrapper = ({ element }) => {
            const { type, props } = element;
            const isSelfContained = ['section', 'container', 'columns', 'navbar', 'slider', 'card', 'form'].includes(type);
            if (isSelfContained) {
                 return <ElementRenderer element={element} />;
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
                    return <div className={\`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none \${parallax ? 'bg-fixed' : ''}\`} style={{ backgroundImage: \`url(\${url})\` }} />;
                }
                return null;
            };

            return (
                <div id={element.id} className={\`\${props.className || ''} relative\`} style={props.style}>
                    {renderBackground()}
                    <ElementRenderer element={element} />
                </div>
            );
        };

        const ElementRenderer = ({ element }) => {
            const { googleMapsApiKey, recaptchaSiteKey } = React.useContext(EditorConfigContext);
            const { openPopup } = React.useContext(PopupContext);
            const { findElement } = React.useContext(PageContext);
            const [isMenuOpen, setIsMenuOpen] = React.useState(false);
            const [isClosing, setIsClosing] = React.useState(false);

            const openMenu = () => { setIsMenuOpen(true); setIsClosing(false); };
            const closeMenu = () => { setIsClosing(true); setTimeout(() => { setIsMenuOpen(false); setIsClosing(false); }, 300); };
            const toggleMenu = () => { if (isMenuOpen && !isClosing) closeMenu(); else if (!isMenuOpen) openMenu(); };

            const pointerClass = ''; 
            const formFieldClass = "w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white";
            const innerStyle = element.props.elementStyle || {};
            const innerClass = element.props.elementClassName || '';

            const NavItemRenderer = ({ link, linkStyle, activeLinkColor }) => {
                 const hasChildren = link.children && link.children.length > 0;
                 const isMegaMenu = link.type === 'mega-menu' && link.targetId;
                 const isPopup = link.type === 'popup';
                 
                 const handleLinkClick = (e) => {
                     if (isPopup && link.targetId) {
                         e.preventDefault();
                         openPopup(link.targetId);
                         return;
                     }
                     if (link.href && link.href.startsWith('#')) {
                         e.preventDefault();
                         const id = link.href.substring(1);
                         const el = document.getElementById(id);
                         if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
                         else if (el) el.scrollIntoView({ behavior: 'smooth' });
                     }
                 };

                 const baseClasses = \`transition-colors hover:opacity-80 font-medium flex items-center gap-1 \${activeLinkColor ? 'hover:text-[var(--active-color)]' : ''} cursor-pointer\`;
                 
                 let megaMenuContent = null;
                 if (isMegaMenu && link.targetId) {
                     const targetElement = findElement(link.targetId);
                     if (targetElement) {
                         const placement = link.megaMenuPlacement || 'center';
                         const containerAlignment = placement === 'left' ? 'mr-auto' : placement === 'right' ? 'ml-auto' : 'mx-auto';
                         megaMenuContent = (
                             <div className="absolute top-full left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:visible transition-all duration-200 z-50">
                                 <div className="max-h-[80vh] overflow-y-auto">
                                    <div className={\`container \${containerAlignment}\`}>
                                        <ChildWrapper element={targetElement} />
                                    </div>
                                 </div>
                             </div>
                         );
                     }
                 }

                 return (
                     <li className={\`group \${isMegaMenu ? 'static' : 'relative'}\`}>
                         <a 
                             href={link.href || '#'} 
                             className={baseClasses}
                             style={linkStyle}
                             onClick={handleLinkClick}
                             target={link.target}
                         >
                             {link.label}
                             {(hasChildren || isMegaMenu) && <Icons.ChevronDown width={12} height={12} />}
                         </a>
                         {hasChildren && !isMegaMenu && (
                             <div className="absolute top-full left-0 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                 <div className="bg-white rounded shadow-lg border border-gray-100 py-2 flex flex-col">
                                     {link.children.map((child, i) => (
                                         <a key={i} href={child.href || '#'} className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 block transition-colors" onClick={(e) => {
                                            if(child.type === 'popup' && child.targetId) { e.preventDefault(); openPopup(child.targetId); }
                                         }}>
                                             {child.label}
                                         </a>
                                     ))}
                                 </div>
                             </div>
                         )}
                         {megaMenuContent}
                     </li>
                 );
            };

            const MobileNavItemRenderer = ({ link, linkStyle, activeLinkColor }) => {
                const [isExpanded, setIsExpanded] = React.useState(false);
                const hasChildren = (link.children && link.children.length > 0) || (link.type === 'mega-menu' && link.targetId);
                
                const handleLinkClick = (e) => {
                    if (link.type === 'popup' && link.targetId) {
                         e.preventDefault();
                         openPopup(link.targetId);
                         closeMenu();
                         return;
                    }
                    if (link.href && link.href.startsWith('#')) {
                         e.preventDefault();
                         const id = link.href.substring(1);
                         const el = document.getElementById(id);
                         if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
                         else if (el) el.scrollIntoView({ behavior: 'smooth' });
                         closeMenu();
                    } else if (hasChildren && !link.href) {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }
                };
          
                return (
                    <div className="border-b border-gray-100 last:border-0">
                         <div className="flex items-center justify-between py-3 px-2">
                             <a href={link.href || '#'} style={linkStyle} onClick={handleLinkClick} className="font-medium text-lg block flex-1">
                                 {link.label}
                             </a>
                             {hasChildren && (
                                 <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-gray-400">
                                     <div className={\`transition-transform duration-200 \${isExpanded ? 'rotate-180' : ''}\`}>
                                         <Icons.ChevronDown />
                                     </div>
                                 </button>
                             )}
                         </div>
                         {isExpanded && hasChildren && (
                             <div className="bg-gray-50 p-4 space-y-3">
                                 {link.children?.map((child, i) => (
                                     <a key={i} href={child.href || '#'} className="block text-gray-600 hover:text-indigo-600 pl-2" onClick={(e) => {
                                         if(child.type === 'popup' && child.targetId) { e.preventDefault(); openPopup(child.targetId); closeMenu(); }
                                     }}>
                                         {child.label}
                                     </a>
                                 ))}
                                 {link.type === 'mega-menu' && link.targetId && (() => {
                                     const targetElement = findElement(link.targetId);
                                     if (!targetElement) return null;
                                     return (
                                         <div className="border-t border-gray-200 pt-2">
                                             <ChildWrapper element={targetElement} />
                                         </div>
                                     )
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
                     return <div className={\`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none \${parallax ? 'bg-fixed' : ''}\`} style={{ backgroundImage: \`url(\${url})\` }} />;
                }
                return null;
            };

            switch (element.type) {
                case 'section':
                case 'container':
                case 'columns':
                case 'navbar':
                    return (
                        <div id={element.id} className={element.props.className || ''} style={element.props.style}>
                            {renderBackground()}
                            {element.children?.map(child => <ChildWrapper key={child.id} element={child} />)}
                        </div>
                    );

                case 'menu':
                    const { navLinks = [], linkColor, activeLinkColor, mobileMenuBreakpoint = 'md', mobileMenuType = 'dropdown', hamburgerColor, menuBackgroundColor, mobileMenuIconType = 'menu' } = element.props;
                    const breakpointClass = mobileMenuBreakpoint === 'none' ? 'flex' : \`hidden \${mobileMenuBreakpoint}:flex\`;
                    const mobileToggleClass = mobileMenuBreakpoint === 'none' ? 'hidden' : \`flex \${mobileMenuBreakpoint}:hidden\`;
                    const linkStyle = { color: linkColor || 'inherit' };
                    const activeStyle = activeLinkColor ? { '--active-color': activeLinkColor } : {};
                    
                    return (
                         <div className={\`flex items-center \${innerClass}\`} style={{...activeStyle, ...innerStyle}}>
                             <ul className={\`\${breakpointClass} gap-6 items-center\`}>
                                 {navLinks.map((link, i) => <NavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}
                             </ul>
                             <button 
                                 className={\`\${mobileToggleClass} p-2 rounded hover:bg-gray-100\`}
                                 onClick={toggleMenu}
                                 style={{ color: hamburgerColor || 'inherit' }}
                             >
                                {mobileMenuIconType === 'grid' ? <Icons.Grid /> : mobileMenuIconType === 'dots' ? <Icons.Dots /> : <Icons.Menu />}
                             </button>
                             {isMenuOpen && (
                                <>
                                {mobileMenuType === 'dropdown' && (
                                    <div className={\`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col z-40 max-h-[80vh] overflow-y-auto \${isClosing ? 'animate-fade-out' : 'animate-fade-in'} \${mobileMenuBreakpoint === 'none' ? 'hidden' : \`\${mobileMenuBreakpoint}:hidden\`}\`} style={{ backgroundColor: menuBackgroundColor || 'white' }}>
                                        {navLinks.map((link, i) => <MobileNavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}
                                    </div>
                                )}
                                {(mobileMenuType === 'slide-left' || mobileMenuType === 'slide-right') && (
                                    <div className={\`fixed inset-0 z-50 h-[100vh] \${mobileMenuBreakpoint === 'none' ? 'hidden' : \`\${mobileMenuBreakpoint}:hidden\`}\`}>
                                        <div className={\`absolute inset-0 bg-black/50 \${isClosing ? 'animate-fade-out' : 'animate-fade-in'}\`} onClick={closeMenu}></div>
                                        <div className={\`absolute top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col overflow-y-auto \${mobileMenuType === 'slide-left' ? (isClosing ? 'left-0 animate-slide-out-left' : 'left-0 animate-slide-in-left') : (isClosing ? 'right-0 animate-slide-out-right' : 'right-0 animate-slide-in-right')}\`} style={{ backgroundColor: menuBackgroundColor || 'white' }}>
                                            <div className="flex justify-end p-4"><button onClick={closeMenu} className="p-2 text-gray-500 hover:text-gray-700"><Icons.X /></button></div>
                                            <div className="px-4 pb-8">{navLinks.map((link, i) => <MobileNavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}</div>
                                        </div>
                                    </div>
                                )}
                                </>
                            )}
                         </div>
                    );

                case 'text':
                    return <div style={innerStyle} className={innerClass}>{element.props.content}</div>;
                case 'heading':
                    const HeadTag = \`h\${element.props.level || 2}\`;
                    return <HeadTag style={innerStyle} className={innerClass}>{element.props.content}</HeadTag>;
                case 'image':
                    return <img src={element.props.src} alt={element.props.alt} className={\`w-full \${innerClass}\`} style={{ borderRadius: element.props.style?.borderRadius, objectFit: element.props.imageObjectFit || 'cover', height: element.props.imageHeight || 'auto', ...innerStyle }} />;
                case 'button':
                    const action = element.props.buttonAction || 'link';
                    const customClass = element.props.className || '';
                    if (action === 'link') {
                        return <a href={element.props.href} target={element.props.target} className={\`px-4 py-2 rounded transition inline-block text-center \${customClass} \${innerClass}\`} style={{...element.props.style, ...innerStyle}} onClick={(e) => {
                            if (element.props.href && element.props.href.startsWith('#')) {
                                e.preventDefault();
                                const id = element.props.href.substring(1);
                                const el = document.getElementById(id);
                                if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
                                else if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}>{element.props.content}</a>;
                    }
                    if (action === 'popup') {
                         return <button type="button" className={\`px-4 py-2 rounded transition cursor-pointer \${customClass} \${innerClass}\`} style={{...element.props.style, ...innerStyle}} onClick={(e) => { e.preventDefault(); if(element.props.popupTargetId) openPopup(element.props.popupTargetId); }}>{element.props.content}</button>;
                    }
                    return <button type="submit" className={\`px-4 py-2 rounded transition \${customClass} \${innerClass}\`} style={{...element.props.style, ...innerStyle}}>{element.props.content}</button>;
                case 'logo':
                    const logoType = element.props.logoType || 'text';
                    const logoContent = logoType === 'image' ? <img src={element.props.logoSrc} alt={element.props.alt} style={{ width: element.props.logoWidth || 'auto', maxHeight: '100%', ...innerStyle }} className={innerClass} /> : <span style={innerStyle} className={innerClass}>{element.props.logoText || 'Logo'}</span>;
                    if (!element.props.href) return <div className={\`block \${innerClass}\`}>{logoContent}</div>;
                    return <a href={element.props.href} className="block" onClick={(e) => {
                         if (element.props.href && element.props.href.startsWith('#')) {
                             e.preventDefault();
                             const id = element.props.href.substring(1);
                             const el = document.getElementById(id);
                             if (!id) window.scrollTo({ top: 0, behavior: 'smooth' });
                             else if (el) el.scrollIntoView({ behavior: 'smooth' });
                         }
                    }}>{logoContent}</a>;
                case 'input': 
                    return <div className={\`w-full \${element.props.fieldHidden ? 'hidden' : ''}\`}>{element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}<input type={element.props.inputType || 'text'} name={element.props.fieldName} placeholder={element.props.fieldPlaceholder} required={element.props.fieldRequired} defaultValue={element.props.fieldDefaultValue} className={\`\${formFieldClass} \${innerClass}\`} style={innerStyle} /></div>;
                case 'textarea': 
                    return <div className={\`w-full \${element.props.fieldHidden ? 'hidden' : ''}\`}>{element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}<textarea name={element.props.fieldName} placeholder={element.props.fieldPlaceholder} required={element.props.fieldRequired} defaultValue={element.props.fieldDefaultValue} rows={element.props.fieldRows || 4} className={\`\${formFieldClass} \${innerClass}\`} style={innerStyle} /></div>;
                case 'select': 
                    return <div className="w-full">{element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}<select name={element.props.fieldName} required={element.props.fieldRequired} defaultValue={element.props.fieldDefaultValue || ""} multiple={element.props.fieldMultiple} className={\`\${formFieldClass} \${innerClass}\`} style={innerStyle} >{!element.props.fieldMultiple && <option value="" disabled>Select an option...</option>}{element.props.fieldOptions?.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}</select></div>;
                case 'radio': 
                    return <div className="flex items-center gap-2"><input type="radio" id={element.id} name={element.props.fieldName} value={element.props.fieldValue} defaultChecked={element.props.checked} required={element.props.fieldRequired} className={\`text-indigo-600 focus:ring-indigo-500 h-4 w-4 \${innerClass}\`} style={innerStyle} />{element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}</div>;
                case 'checkbox': 
                    return <div className="flex items-center gap-2"><input type="checkbox" id={element.id} name={element.props.fieldName} value={element.props.fieldValue} required={element.props.fieldRequired} defaultChecked={element.props.checked} className={\`text-indigo-600 focus:ring-indigo-500 h-4 w-4 rounded border-gray-300 \${innerClass}\`} style={innerStyle} />{element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}</div>;
                case 'form': 
                    if (element.children && element.children.length > 0) return <form className={\`\${element.props.className || ''} relative\`} style={element.props.style} action={element.props.formActionUrl} method="POST"><input type="hidden" name="_next" value={element.props.formThankYouUrl} />{element.children.map(child => <ChildWrapper key={child.id} element={child} />)}</form>;
                    // Legacy form renderer omitted for brevity, new form builder preferred
                    return null;
                case 'video':
                    const videoSrc = element.props.videoUrl || '';
                    const isYoutube = videoSrc.includes('youtube') || videoSrc.includes('youtu.be');
                    const embedUrl = isYoutube && !videoSrc.includes('embed') ? videoSrc.replace('watch?v=', 'embed/') : videoSrc;
                    return (<div className={\`aspect-video w-full bg-black rounded overflow-hidden relative \${innerClass}\`} style={innerStyle}><iframe src={embedUrl} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" /></div>);
                case 'list':
                    const ListTag = element.props.listType || 'ul';
                    return (<ListTag className={\`pl-5 \${innerClass}\`} style={{ listStyleType: element.props.listStyleType || 'disc', ...innerStyle }}>{(element.props.items || []).map((item, i) => <li key={i} style={{ marginBottom: element.props.itemSpacing }}>{item}</li>)}</ListTag>);
                case 'map':
                    if (!googleMapsApiKey) return <div className="p-4 bg-gray-100 text-gray-500 text-center">Map (No API Key)</div>;
                    return (<div className={\`w-full h-64 bg-gray-100 rounded overflow-hidden relative \${innerClass}\`} style={innerStyle}><iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={\`https://www.google.com/maps/embed/v1/place?key=\${googleMapsApiKey}&q=\${encodeURIComponent(element.props.address)}&zoom=\${element.props.zoom}&maptype=\${element.props.mapType}\`}></iframe></div>);
                case 'customCode':
                    return <div className={innerClass} style={innerStyle} dangerouslySetInnerHTML={{ __html: element.props.code || '' }} />;
                case 'gallery':
                     const { galleryImages = [], galleryLayout = 'grid', galleryColumnCount = 3, galleryGap = '1rem', galleryAspectRatio = 'aspect-square', galleryObjectFit = 'cover' } = element.props;
                     const gridCols = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5', 6: 'grid-cols-6' };
                     const masonryCols = { 1: 'columns-1', 2: 'columns-2', 3: 'columns-3', 4: 'columns-4', 5: 'columns-5', 6: 'columns-6' };
                     const gapStyle = { gap: galleryGap, ...innerStyle };
                     const commonImgClass = \`w-full h-full rounded object-\${galleryObjectFit} block\`;
                     if (galleryLayout === 'masonry') return (<div className={\`\${masonryCols[galleryColumnCount]} space-y-4 \${innerClass}\`} style={{ ...gapStyle, columnGap: galleryGap }}>{galleryImages.map(img => (<div key={img.id} className="break-inside-avoid mb-4"><img src={img.src} alt={img.alt || ''} className="w-full rounded block" /></div>))}</div>);
                     if (galleryLayout === 'flex') return (<div className={\`flex flex-wrap \${innerClass}\`} style={gapStyle}>{galleryImages.map(img => (<div key={img.id} className={\`flex-grow basis-64 min-w-[200px] \${galleryAspectRatio === 'auto' ? '' : galleryAspectRatio} relative\`}><img src={img.src} alt={img.alt || ''} className={\`\${commonImgClass} absolute inset-0\`} /></div>))}</div>);
                     return (<div className={\`grid \${gridCols[galleryColumnCount]} \${innerClass}\`} style={gapStyle}>{galleryImages.map(img => (<div key={img.id} className={\`relative overflow-hidden rounded \${galleryAspectRatio}\`}><img src={img.src} alt={img.alt || ''} className={commonImgClass} /></div>))}</div>);
                case 'testimonial':
                     const { testimonialItems = [], testimonialLayout = 'grid', testimonialAvatarSize = 'md', testimonialAvatarShape = 'circle', testimonialBubbleColor = '#f9fafb' } = element.props;
                     const sizeClass = { 'sm': 'w-8 h-8', 'md': 'w-12 h-12', 'lg': 'w-16 h-16', 'xl': 'w-24 h-24' }[testimonialAvatarSize] || 'w-12 h-12';
                     const shapeClass = { 'circle': 'rounded-full', 'square': 'rounded-none', 'rounded': 'rounded-lg' }[testimonialAvatarShape] || 'rounded-full';
                     if (testimonialLayout === 'slider') return <TestimonialSlider items={testimonialItems} avatarSize={sizeClass} avatarShape={shapeClass} bubbleColor={testimonialBubbleColor} />;
                     return (<div className={\`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 \${innerClass}\`} style={innerStyle}>{testimonialItems.map(item => (<div key={item.id} className="flex flex-col h-full"><div className="p-6 rounded-2xl relative mb-4 flex-1 shadow-sm" style={{ backgroundColor: testimonialBubbleColor }}><div className="absolute top-full left-8 -mt-2 border-8 border-transparent" style={{ borderTopColor: testimonialBubbleColor }}></div><p className="text-gray-700 italic relative z-10">"{item.content}"</p></div><div className="flex items-center gap-3 px-2">{item.avatarSrc && (<img src={item.avatarSrc} alt={item.author} className={\`\${sizeClass} \${shapeClass} object-cover bg-gray-200 border border-white shadow-sm\`} />)}<div><h4 className="font-bold text-sm text-gray-900">{item.author}</h4><p className="text-xs text-gray-500">{item.role}</p><div className="flex text-yellow-400 text-xs mt-0.5">{[...Array(5)].map((_, i) => (<span key={i} className={i < item.rating ? 'opacity-100' : 'opacity-30'}>★</span>))}</div></div></div></div>))}</div>);
                case 'card':
                     return <div id={element.id} className={\`\${element.props.className || ''} relative\`} style={element.props.style}>{element.props.cardBadge && <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">{element.props.cardBadge}</div>}{element.children?.map(child => <ChildWrapper key={child.id} element={child} />)}</div>;
                case 'slider':
                     return <div id={element.id} className={\`\${element.props.className || ''} relative\`} style={element.props.style}>{renderBackground()}<SliderRenderer element={element} /></div>;
                default:
                    return null;
            }
        };
        
        const SliderRenderer = ({ element }) => {
            const [activeIndex, setActiveIndex] = React.useState(0);
            const transition = element.props.sliderTransition || 'fade';
            
            React.useEffect(() => {
                if (element.props.sliderAutoplay && element.children && element.children.length > 1) {
                    const interval = setInterval(() => { setActiveIndex(prev => (prev + 1) % element.children.length); }, element.props.sliderInterval || 3000);
                    return () => clearInterval(interval);
                }
            }, [element.props.sliderAutoplay, element.children?.length]);
            
            const renderNavIcon = (direction) => {
                 const type = element.props.sliderNavType || 'chevron';
                 if (type === 'arrow') return direction === 'prev' ? <Icons.ArrowLeft /> : <Icons.ArrowRight />;
                 if (type === 'caret') return direction === 'prev' ? <Icons.CaretLeft /> : <Icons.CaretRight />;
                 return <Icons.ChevronDown className={direction === 'prev' ? 'rotate-90' : '-rotate-90'} />;
            };
            
            return (
                <React.Fragment>
                    {element.children.map((child, index) => {
                         const isActive = index === activeIndex;
                         let effectClass = '';
                         const posClass = isActive ? 'relative z-10' : 'absolute top-0 left-0 z-0';
                         const commonClass = 'w-full h-full transition-all duration-700 ease-in-out';
                         switch(transition) {
                             case 'zoom': effectClass = isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-110'; break;
                             case 'slide-up': effectClass = isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'; break;
                             case 'fade': default: effectClass = isActive ? 'opacity-100' : 'opacity-0';
                         }
                         const pointerEvents = isActive ? '' : 'pointer-events-none';
                         return (
                            <div key={child.id} className={\`\${commonClass} \${posClass} \${effectClass} \${pointerEvents}\`}>
                                <ChildWrapper element={child} />
                            </div>
                         )
                    })}
                    {element.children.length > 1 && (
                        <React.Fragment>
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all" onClick={() => setActiveIndex((prev) => (prev - 1 + element.children.length) % element.children.length)}>{renderNavIcon('prev')}</button>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all" onClick={() => setActiveIndex((prev) => (prev + 1) % element.children.length)}>{renderNavIcon('next')}</button>
                            {element.props.sliderShowPagination !== false && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">{element.children.map((_, i) => <button key={i} className={\`w-2 h-2 rounded-full transition-all \${i === activeIndex ? 'bg-white scale-125' : 'bg-white/50'}\`} onClick={() => setActiveIndex(i)} />)}</div>}
                        </React.Fragment>
                    )}
                </React.Fragment>
            );
        };

        const PageRenderer = ({ elements, savedTemplates }) => {
            const [activePopupId, setActivePopupId] = React.useState(null);
            
            // Scan for Targets
            const { popupTargets, megaMenuTargets } = React.useMemo(() => {
                const popups = new Set();
                const megas = new Set();
                const scan = (els) => {
                    els.forEach(el => {
                        if (el.type === 'button' && el.props.buttonAction === 'popup' && el.props.popupTargetId) popups.add(el.props.popupTargetId);
                        if ((el.type === 'navbar' || el.type === 'menu') && el.props.navLinks) {
                             const scanLinks = (links) => { links.forEach(l => { if (l.type === 'popup' && l.targetId) popups.add(l.targetId); if (l.type === 'mega-menu' && l.targetId) megas.add(l.targetId); if (l.children) scanLinks(l.children); }); };
                             scanLinks(el.props.navLinks);
                        }
                        if (el.children) scan(el.children);
                    });
                };
                scan(elements);
                return { popupTargets: popups, megaMenuTargets: megas };
            }, [elements]);

            const findElement = (id, list) => {
                for (const el of list) {
                    if (el.id === id) return el;
                    if (el.children) { const found = findElement(id, el.children); if (found) return found; }
                }
                return null;
            };

            const openPopup = (id) => setActivePopupId(id);
            const activePopupElement = activePopupId ? findElement(activePopupId, elements) : null;

            const renderElement = (element) => {
                let renderedElement = element;
                if (element.type === 'global') {
                    const t = savedTemplates.find(x => x.id === element.props.templateId);
                    if (t) renderedElement = t.element;
                }
                const { type, children, id, props } = renderedElement;
                const isHiddenTarget = popupTargets.has(id) || megaMenuTargets.has(id);
                if (isHiddenTarget) return null; // Initially hidden in production

                const renderBackground = () => {
                    if (!['section', 'container', 'columns', 'navbar', 'card'].includes(type)) return null;
                    const { backgroundImage, backgroundVideo, parallax } = props || {};
                    const { backgroundImage: styleBgImage, backgroundVideo: styleBgVideo } = props.style || {};
                    const finalBgImage = styleBgImage || backgroundImage;
                    const finalBgVideo = styleBgVideo || backgroundVideo;
                    if (finalBgVideo) return <video src={finalBgVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none" />;
                    if (finalBgImage) {
                         const url = finalBgImage.startsWith('url') ? finalBgImage.slice(4, -1).replace(/["']/g, "") : finalBgImage;
                         return <div className={\`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none \${parallax ? 'bg-fixed' : ''}\`} style={{ backgroundImage: \`url(\${url})\` }} />;
                    }
                    return null;
                };

                const isNavbar = type === 'navbar';
                const headerType = props.headerType || 'relative';

                const NavbarWrapper = ({ children }) => {
                     const [stickyState, setStickyState] = React.useState('idle');
                     const stateRef = React.useRef(stickyState);
                     React.useEffect(() => { stateRef.current = stickyState; }, [stickyState]);

                     React.useEffect(() => {
                         if (headerType !== 'sticky') return;
                         const handleScroll = () => {
                             const offset = props.stickyOffset || 100;
                             const currentState = stateRef.current;
                             if (window.scrollY > offset) {
                                 if (currentState !== 'stuck') setStickyState('stuck');
                             } else {
                                 if (currentState === 'stuck') {
                                     setStickyState('unsticking');
                                     setTimeout(() => setStickyState(prev => prev === 'unsticking' ? 'idle' : prev), 300);
                                 }
                             }
                         };
                         window.addEventListener('scroll', handleScroll);
                         return () => window.removeEventListener('scroll', handleScroll);
                     }, [headerType]);
                     let stickyClass = 'relative';
                     if (headerType === 'fixed') stickyClass = 'fixed top-0 left-0 w-full z-50';
                     else if (headerType === 'sticky') {
                         if (stickyState === 'stuck') stickyClass = 'fixed top-0 left-0 w-full z-50 animate-slide-in-down shadow-md';
                         else if (stickyState === 'unsticking') stickyClass = 'fixed top-0 left-0 w-full z-50 animate-slide-out-up shadow-md';
                     }
                     return <div id={id} className={\`\${props.className || ''} \${stickyClass}\`} style={props.style}>{children}</div>;
                };

                const overflowClass = ['slider', 'card'].includes(type) ? 'overflow-hidden' : '';
                const containerClasses = \`\${overflowClass}\`;
                const classNameToApply = type === 'button' ? '' : (props.className || '');
                
                const getCardHoverClass = () => {
                     if (type !== 'card') return '';
                     const { cardHoverEffect } = props;
                     let classes = ' transition-all duration-300';
                     if (cardHoverEffect === 'lift') classes += ' hover:-translate-y-1 hover:shadow-xl';
                     if (cardHoverEffect === 'zoom') classes += ' hover:scale-[1.02] hover:shadow-xl';
                     if (cardHoverEffect === 'glow') classes += ' hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]';
                     if (cardHoverEffect === 'border') classes += ' hover:border-indigo-500 border border-transparent';
                     return classes;
                };

                const Tag = type === 'section' ? 'section' : type === 'form' ? 'form' : 'div';
                
                if (type === 'slider' && children) {
                    return (
                        <Tag key={id} className={\`\${classNameToApply} \${containerClasses}\`} style={props.style}>
                            {renderBackground()}
                            <SliderRenderer element={renderedElement} />
                        </Tag>
                    );
                }

                if (isNavbar) {
                     return (
                         <NavbarWrapper key={id}>
                             {renderBackground()}
                             {children && children.length > 0 ? children.map(child => renderElement(child)) : <ElementRenderer element={renderedElement} />}
                         </NavbarWrapper>
                     )
                }
                
                const LinkWrapper = ({children}) => {
                     if (type === 'card' && props.cardLink) return <a href={props.cardLink} className="block h-full no-underline text-inherit">{children}</a>;
                     return <React.Fragment>{children}</React.Fragment>;
                }

                const formProps = type === 'form' ? { action: props.formActionUrl, method: 'POST' } : {};

                return (
                    <Tag key={id} id={id} className={\`\${classNameToApply} \${containerClasses} \${getCardHoverClass()}\`} style={props.style} {...formProps}>
                         {type === 'form' && props.formThankYouUrl && <input type="hidden" name="_next" value={props.formThankYouUrl} />}
                         {renderBackground()}
                         <LinkWrapper>
                             {children && children.length > 0 ? children.map(child => renderElement(child)) : <ElementRenderer element={renderedElement} />}
                         </LinkWrapper>
                    </Tag>
                );
            };

            return (
                <PopupContext.Provider value={{ openPopup, popupTargets }}>
                    <PageContext.Provider value={{ findElement: (id) => findElement(id, elements) }}>
                         {elements.map(el => renderElement(el))}
                         {activePopupId && activePopupElement && ReactDOM.createPortal(
                             <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
                                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActivePopupId(null)} />
                                 <div className="relative shadow-2xl overflow-hidden w-auto max-w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                                      <button className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full text-gray-800 transition-colors" onClick={() => setActivePopupId(null)}><Icons.X /></button>
                                      <div className="!block [&_.hidden]:!block">
                                         <div style={{ display: 'block !important' }}>
                                              <ChildWrapper element={activePopupElement} />
                                         </div>
                                      </div>
                                 </div>
                             </div>,
                             document.body
                         )}
                    </PageContext.Provider>
                </PopupContext.Provider>
            );
        };

        const App = () => {
            return (
                <EditorConfigContext.Provider value={{ googleMapsApiKey, recaptchaSiteKey }}>
                    <PageRenderer elements={elements} savedTemplates={savedTemplates} />
                </EditorConfigContext.Provider>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;
}