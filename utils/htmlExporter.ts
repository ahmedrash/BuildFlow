
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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
      html { scroll-behavior: smooth; }
      body { font-family: 'Inter', sans-serif; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      
      /* GSAP Initial state. We use a class that GSAP will override with inline styles */
      .gsap-reveal { opacity: 0; visibility: hidden; }
    </style>
    ${recaptchaSiteKey ? `<script src="https://www.google.com/recaptcha/api.js" async defer></script>` : ''}
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
</head>
<body class="bg-white text-slate-900 overflow-x-hidden">
    <div id="root"></div>

    <script type="text/babel">
        // Register Plugins
        gsap.registerPlugin(ScrollTrigger);

        const elements = ${elementsJson};
        const savedTemplates = ${templatesJson};
        const googleMapsApiKey = "${googleMapsApiKey || ''}";
        const recaptchaSiteKey = "${recaptchaSiteKey || ''}";

        const PopupContext = React.createContext({ openPopup: () => {}, popupTargets: new Set() });
        const PageContext = React.createContext({ findElement: (id) => null });
        const EditorConfigContext = React.createContext({ googleMapsApiKey: '', recaptchaSiteKey: '' });

        const Icons = {
             ArrowLeft: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
             ArrowRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
             ChevronDown: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>,
             X: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
             Menu: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
             Grid: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
             Dots: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
             Box: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
        };

        const useElementAnimation = (ref, element) => {
            React.useEffect(() => {
                if (!element.props.animation || element.props.animation.type === 'none') return;
                if (!ref.current) return;

                const { animation } = element.props;
                const { type: animType, duration = 1, delay = 0, ease = 'power2.out', stagger = 0, target = 'self', viewport = 85, trigger = 'scroll' } = animation;

                let actualTarget = ref.current;
                // Handle components that use display: contents
                if (actualTarget.style.display === 'contents' && actualTarget.firstElementChild) {
                    actualTarget = actualTarget.firstElementChild;
                }
                if (!actualTarget) return;

                let elementsToAnimate = target === 'children' ? Array.from(actualTarget.children) : [actualTarget];
                if (elementsToAnimate.length === 0) return;

                // Ensure visibility is reset so GSAP can handle it
                gsap.set(elementsToAnimate, { visibility: 'visible' });

                const fromProps = { opacity: 0 };
                const toProps = {
                    opacity: 1,
                    x: 0, y: 0, scale: 1, rotation: 0,
                    duration,
                    delay,
                    ease,
                    stagger: target === 'children' ? stagger : 0,
                    overwrite: 'auto',
                    onStart: () => {
                        elementsToAnimate.forEach(el => el.classList.remove('gsap-reveal'));
                    }
                };

                switch(animType) {
                     case 'fade-in': break;
                     case 'fade-in-up': fromProps.y = 50; break;
                     case 'fade-in-down': fromProps.y = -50; break;
                     case 'slide-in-left': fromProps.x = -100; break;
                     case 'slide-in-right': fromProps.x = 100; break;
                     case 'zoom-in': fromProps.scale = 0.8; break;
                     case 'rotate-in': fromProps.rotation = -15; fromProps.scale = 0.8; break;
                }

                let tween;
                if (trigger === 'scroll') {
                    toProps.scrollTrigger = {
                        trigger: actualTarget,
                        start: \`top \${viewport}%\`,
                        toggleActions: "play none none reverse",
                    };
                    tween = gsap.fromTo(elementsToAnimate, fromProps, toProps);
                } else {
                    tween = gsap.fromTo(elementsToAnimate, fromProps, toProps);
                }
                
                return () => {
                    if (tween.scrollTrigger) tween.scrollTrigger.kill();
                    tween.kill();
                };
            }, [element.props.animation, element.id]);
        };

        const ElementRenderer = ({ element }) => {
            const { googleMapsApiKey } = React.useContext(EditorConfigContext);
            const { openPopup } = React.useContext(PopupContext);
            const { findElement } = React.useContext(PageContext);
            const [isMenuOpen, setIsMenuOpen] = React.useState(false);
            const [isClosing, setIsClosing] = React.useState(false);

            const openMenu = () => { setIsMenuOpen(true); setIsClosing(false); };
            const closeMenu = () => { setIsClosing(true); setTimeout(() => { setIsMenuOpen(false); setIsClosing(false); }, 300); };
            const toggleMenu = () => { if (isMenuOpen && !isClosing) closeMenu(); else if (!isMenuOpen) openMenu(); };

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

                 const baseClasses = \`transition-colors hover:opacity-80 font-medium flex items-center gap-1 cursor-pointer\`;
                 let megaMenuContent = null;
                 if (isMegaMenu && link.targetId) {
                     const targetElement = findElement(link.targetId);
                     if (targetElement) {
                         const placement = link.megaMenuPlacement || 'center';
                         const containerAlignment = placement === 'left' ? 'mr-auto' : placement === 'right' ? 'ml-auto' : 'mx-auto';
                         megaMenuContent = (
                             <div className="absolute top-full left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible hover:visible transition-all duration-200 z-50 pt-2">
                                 <div className="max-h-[80vh] overflow-y-auto bg-white shadow-2xl rounded-b-xl border-t border-gray-100">
                                    <div className={\`container \${containerAlignment}\`}>
                                        <PageElementRenderer element={targetElement} isInsideHidden={true} />
                                    </div>
                                 </div>
                             </div>
                         );
                     }
                 }

                 return (
                     <li className={\`group \${isMegaMenu ? 'static' : 'relative'}\`}>
                         <a href={link.href || '#'} className={baseClasses} style={linkStyle} onClick={handleLinkClick} target={link.target}>
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
                                     return <div className="border-t border-gray-200 pt-2"><PageElementRenderer element={targetElement} isInsideHidden={true} /></div>
                                 })()}
                             </div>
                         )}
                    </div>
                )
            };

            switch (element.type) {
                case 'menu':
                    const { navLinks = [], linkColor, activeLinkColor, mobileMenuBreakpoint = 'md', mobileMenuType = 'dropdown', hamburgerColor, menuBackgroundColor, mobileMenuIconType = 'menu' } = element.props;
                    const bpClass = \`hidden \${mobileMenuBreakpoint}:flex\`;
                    const mobileClass = \`flex \${mobileMenuBreakpoint}:hidden\`;
                    const linkStyle = { color: linkColor || 'inherit' };
                    return (
                         <div className={\`flex items-center \${innerClass}\`} style={{...innerStyle}}>
                             <ul className={\`\${bpClass} gap-6 items-center\`}>
                                 {navLinks.map((link, i) => <NavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}
                             </ul>
                             <button className={\`\${mobileClass} p-2 rounded hover:bg-gray-100\`} onClick={toggleMenu} style={{ color: hamburgerColor || 'inherit' }}>
                                {mobileMenuIconType === 'grid' ? <Icons.Grid /> : mobileMenuIconType === 'dots' ? <Icons.Dots /> : <Icons.Menu />}
                             </button>
                             {isMenuOpen && (
                                <>
                                {mobileMenuType === 'dropdown' && (
                                    <div className={\`absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col z-40 max-h-[80vh] overflow-y-auto \${isClosing ? 'animate-fade-out' : 'animate-fade-in'} \${mobileMenuBreakpoint}:hidden\`} style={{ backgroundColor: menuBackgroundColor || 'white' }}>
                                        {navLinks.map((link, i) => <MobileNavItemRenderer key={i} link={link} linkStyle={linkStyle} activeLinkColor={activeLinkColor} />)}
                                    </div>
                                )}
                                {(mobileMenuType === 'slide-left' || mobileMenuType === 'slide-right') && (
                                    <div className={\`fixed inset-0 z-50 h-[100vh] \${mobileMenuBreakpoint}:hidden\`}>
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
                    const renderButtonContent = () => <div className="flex items-center justify-center gap-2"><span>{element.props.content || 'Button'}</span></div>;
                    if (action === 'link') {
                        return <a href={element.props.href} target={element.props.target} className={\`px-4 py-2 rounded transition inline-block text-center \${innerClass}\`} style={{...element.props.style, ...innerStyle}}>{renderButtonContent()}</a>;
                    }
                    if (action === 'popup') {
                         return <button type="button" className={\`px-4 py-2 rounded transition cursor-pointer \${innerClass}\`} style={{...element.props.style, ...innerStyle}} onClick={(e) => { e.preventDefault(); if(element.props.popupTargetId) openPopup(element.props.popupTargetId); }}>{renderButtonContent()}</button>;
                    }
                    return <button type="submit" className={\`px-4 py-2 rounded transition \${innerClass}\`} style={{...element.props.style, ...innerStyle}}>{renderButtonContent()}</button>;
                case 'input': 
                    return <div className={\`w-full \${element.props.fieldHidden ? 'hidden' : ''}\`}>{element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel}</label>}<input type={element.props.inputType || 'text'} name={element.props.fieldName} placeholder={element.props.fieldPlaceholder} required={element.props.fieldRequired} className={\`\${formFieldClass} \${innerClass}\`} style={innerStyle} /></div>;
                case 'logo':
                    const logoContent = element.props.logoType === 'image' ? <img src={element.props.logoSrc} style={{ width: element.props.logoWidth || 'auto', ...innerStyle }} className={innerClass} /> : <span style={innerStyle} className={innerClass}>{element.props.logoText || 'Logo'}</span>;
                    return element.props.href ? <a href={element.props.href} className="block">{logoContent}</a> : <div className="block">{logoContent}</div>;
                default:
                    return null;
            }
        };

        const PageElementRenderer = ({ element, isInsideHidden = false }) => {
            let renderedElement = element;
            if (element.type === 'global') {
                const t = savedTemplates.find(x => x.id === element.props.templateId);
                if (t) renderedElement = t.element;
            }

            const ref = React.useRef(null);
            useElementAnimation(ref, renderedElement);

            const { type, children, id, props } = renderedElement;
            const { popupTargets } = React.useContext(PopupContext);
            
            // If this element is a popup/mega menu target AND we're in the main flow, hide it
            if (!isInsideHidden && popupTargets.has(id)) return null;

            const hasAnim = props.animation && props.animation.type !== 'none';
            const animTarget = props.animation?.target || 'self';
            const revealClass = (hasAnim && animTarget === 'self') ? 'gsap-reveal' : '';

            const renderBackground = () => {
                if (!['section', 'container', 'columns', 'navbar', 'card'].includes(type)) return null;
                const { backgroundImage, backgroundVideo, parallax } = props || {};
                const finalBgImage = (props.style && props.style.backgroundImage) || backgroundImage;
                if (backgroundVideo) return <video src={backgroundVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none" />;
                if (finalBgImage) {
                    const url = finalBgImage.startsWith('url') ? finalBgImage.slice(4, -1).replace(/["']/g, "") : finalBgImage;
                    return <div className={\`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none \${parallax ? 'bg-fixed' : ''}\`} style={{ backgroundImage: \`url(\${url})\` }} />;
                }
                return null;
            };

            const headerType = props.headerType || 'relative';
            const [stickyState, setStickyState] = React.useState('idle');
            React.useEffect(() => {
                if (type !== 'navbar' || headerType !== 'sticky') return;
                const handleScroll = () => {
                    const offset = props.stickyOffset || 100;
                    if (window.scrollY > offset) setStickyState('stuck');
                    else setStickyState('idle');
                };
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
            }, [headerType, type]);

            const Tag = type === 'section' ? 'section' : type === 'form' ? 'form' : 'div';
            let stickyClass = '';
            if (type === 'navbar') {
                if (headerType === 'fixed') stickyClass = 'fixed top-0 left-0 w-full z-50';
                else if (headerType === 'sticky') stickyClass = stickyState === 'stuck' ? 'fixed top-0 left-0 w-full z-50 shadow-md animate-slide-in-down bg-white' : 'relative';
            }

            return (
                <Tag ref={ref} id={id} className={\`\${props.className || ''} \${revealClass} \${stickyClass} relative\`} style={props.style}>
                     {renderBackground()}
                     {children && children.length > 0 ? (
                         children.map(child => {
                             const childReveal = (hasAnim && animTarget === 'children') ? 'gsap-reveal' : '';
                             return (
                                 <div key={child.id} className={childReveal} style={{ display: 'contents' }}>
                                     <PageElementRenderer element={child} isInsideHidden={isInsideHidden} />
                                 </div>
                             )
                         })
                     ) : (
                         <ElementRenderer element={renderedElement} />
                     )}
                </Tag>
            );
        };

        const App = () => {
            const [activePopupId, setActivePopupId] = React.useState(null);
            
            React.useEffect(() => {
                const refresh = () => ScrollTrigger.refresh();
                window.addEventListener('load', refresh);
                const timer = setTimeout(refresh, 800);
                const timer2 = setTimeout(refresh, 2000);
                return () => {
                    window.removeEventListener('load', refresh);
                    clearTimeout(timer);
                    clearTimeout(timer2);
                };
            }, []);

            const hiddenTargetsSet = React.useMemo(() => {
                const set = new Set();
                const scanEls = (list) => list.forEach(el => {
                    // Button popup targets
                    if (el.type === 'button' && el.props.buttonAction === 'popup' && el.props.popupTargetId) {
                        set.add(el.props.popupTargetId);
                    }
                    // Nav targets (megamenu and popup)
                    if ((el.type === 'navbar' || el.type === 'menu') && el.props.navLinks) {
                        const scanLinks = (links) => links.forEach(l => {
                            if (l.targetId) set.add(l.targetId);
                            if (l.children) scanLinks(l.children);
                        });
                        scanLinks(el.props.navLinks);
                    }
                    if (el.children) scanEls(el.children);
                });
                scanEls(elements);
                return set;
            }, []);

            const findElement = (id, list) => {
                for (const el of list) {
                    if (el.id === id) return el;
                    if (el.children) { const found = findElement(id, el.children); if (found) return found; }
                }
                return null;
            };

            const activePopupElement = activePopupId ? findElement(activePopupId, elements) : null;

            return (
                <EditorConfigContext.Provider value={{ googleMapsApiKey, recaptchaSiteKey }}>
                    <PopupContext.Provider value={{ openPopup: setActivePopupId, popupTargets: hiddenTargetsSet }}>
                        <PageContext.Provider value={{ findElement: (id) => findElement(id, elements) }}>
                             {elements.map(el => <PageElementRenderer key={el.id} element={el} />)}
                             {activePopupId && activePopupElement && ReactDOM.createPortal(
                                 <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActivePopupId(null)} />
                                     <div className="relative shadow-2xl overflow-hidden w-auto max-w-full max-h-[90vh] overflow-y-auto">
                                          <button className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full text-gray-800" onClick={() => setActivePopupId(null)}><Icons.X /></button>
                                          <PopupContext.Provider value={{ openPopup: setActivePopupId, popupTargets: new Set() }}>
                                            <PageElementRenderer element={activePopupElement} isInsideHidden={true} />
                                          </PopupContext.Provider>
                                     </div>
                                 </div>,
                                 document.body
                             )}
                        </PageContext.Provider>
                    </PopupContext.Provider>
                </EditorConfigContext.Provider>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>`;
}
