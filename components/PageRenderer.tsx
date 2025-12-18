
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PageElement, SavedTemplate } from '../types';
import { ElementRenderer, useElementAnimation } from './elements/ElementRenderer';
import { Icons } from './Icons';
import { EditorConfigContext, PopupContext, PageContext } from './EditorConfigContext';

interface PageRendererProps {
  elements: PageElement[];
  savedTemplates?: SavedTemplate[];
  isPreview?: boolean;
}

// Separate component for each element to allow hooks (like animations)
const RenderedPageElement: React.FC<{
  element: PageElement;
  savedTemplates: SavedTemplate[];
  isPreview: boolean;
  popupTargets: Set<string>;
  megaMenuTargets: Set<string>;
}> = ({ element, savedTemplates, isPreview, popupTargets, megaMenuTargets }) => {
    // Global Template Resolution
    let renderedElement = element;
    if (element.type === 'global') {
        const template = savedTemplates.find(t => t.id === element.props.templateId);
        if (template) {
            renderedElement = template.element;
        }
    }

    const { type, children, id, props } = renderedElement;
    const elementRef = useRef<HTMLElement>(null);
    
    // Animation Hook
    useElementAnimation(elementRef, renderedElement, isPreview);
    
    // Hiding Logic
    const isHiddenTarget = (popupTargets.has(id) || megaMenuTargets.has(id)) && isPreview;
    
    // Background Rendering
    const renderBackground = () => {
        if (!['section', 'container', 'columns', 'navbar', 'card'].includes(type)) return null;
        const { backgroundImage, backgroundVideo, parallax } = props || {};
        const { backgroundImage: styleBgImage, backgroundVideo: styleBgVideo } = props.style || {};
        
        const finalBgImage = styleBgImage || backgroundImage;
        const finalBgVideo = styleBgVideo || backgroundVideo;
    
        if (finalBgVideo) {
          return (
            <video 
              src={finalBgVideo} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none"
            />
          );
        }
    
        if (finalBgImage) {
          const url = finalBgImage.startsWith('url') 
            ? finalBgImage.slice(4, -1).replace(/["']/g, "") 
            : finalBgImage;
          return (
            <div 
              className={`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none ${parallax ? 'bg-fixed' : ''}`}
              style={{ backgroundImage: `url(${url})` }}
            />
          );
        }
        return null;
    };

    // Navbar Sticky Logic
    const isNavbar = type === 'navbar';
    const headerType = props.headerType || 'relative';
    
    // Inner Component for Navbar to manage sticky state
    const NavbarWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
        const [stickyState, setStickyState] = useState<'idle' | 'stuck' | 'unsticking'>('idle');
        // We use the parent's ref for animation, so we need another ref or just reuse if possible.
        // Actually, NavbarWrapper renders a DIV, so it needs a ref.
        // But the parent RenderedPageElement is what wraps THIS.
        // Wait, if isNavbar is true, RenderedPageElement returns NavbarWrapper. 
        // So NavbarWrapper receives the ref from RenderedPageElement via prop or we just attach ref here.
        
        const stateRef = useRef(stickyState);
        useEffect(() => { stateRef.current = stickyState; }, [stickyState]);
        
        useEffect(() => {
            if (headerType !== 'sticky' || !isPreview) return;
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
        }, [headerType, props.stickyOffset, isPreview]);
        
        let stickyClass = 'relative';
        if (headerType === 'fixed') stickyClass = 'fixed top-0 left-0 w-full z-50';
        else if (headerType === 'sticky') {
            if (stickyState === 'stuck') stickyClass = 'fixed top-0 left-0 w-full z-50 animate-slide-in-down shadow-md';
            else if (stickyState === 'unsticking') stickyClass = 'fixed top-0 left-0 w-full z-50 animate-slide-out-up shadow-md';
        }
        
        // Combine refs? No, useElementAnimation expects ref to the element being animated.
        // Here we attach elementRef to the outer div of Navbar.
        return (
            <div 
                ref={elementRef as React.RefObject<HTMLDivElement>}
                id={id} 
                className={`${props.className || ''} ${stickyClass}`} 
                style={props.style}
            >
                {children}
            </div>
        )
    };

    const overflowClass = ['slider', 'card'].includes(type) ? 'overflow-hidden' : '';
    const containerClasses = `${overflowClass}`;
    const classNameToApply = type === 'button' ? '' : (props.className || '');
    const hiddenClass = isHiddenTarget ? ' hidden' : '';
    
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

    const Tag = (type === 'section' ? 'section' : type === 'form' ? 'form' : 'div') as React.ElementType;
    
    const LinkWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
        if (type === 'card' && props.cardLink) {
             return <a href={props.cardLink} className="block h-full no-underline text-inherit">{children}</a>;
        }
        return <>{children}</>;
    };

    if (type === 'slider' && children) {
        return (
            <Tag ref={elementRef} key={id} className={`${classNameToApply} ${containerClasses}${hiddenClass}`} style={props.style}>
                {renderBackground()}
                <SliderRenderer 
                   element={renderedElement} 
                   savedTemplates={savedTemplates}
                   isPreview={isPreview}
                   popupTargets={popupTargets}
                   megaMenuTargets={megaMenuTargets}
                />
            </Tag>
        );
    }

    if (isNavbar) {
        return (
            <NavbarWrapper key={id}>
                {renderBackground()}
                <LinkWrapper>
                    {children && children.length > 0 ? (
                        children.map(child => (
                             <RenderedPageElement 
                                key={child.id} 
                                element={child} 
                                savedTemplates={savedTemplates} 
                                isPreview={isPreview}
                                popupTargets={popupTargets}
                                megaMenuTargets={megaMenuTargets}
                             />
                        ))
                    ) : (
                        <ElementRenderer element={renderedElement} isPreview={isPreview} />
                    )}
                </LinkWrapper>
            </NavbarWrapper>
        )
    }

    const formProps = type === 'form' ? {
        action: props.formActionUrl,
        method: "POST"
    } : {};

    return (
        <Tag ref={elementRef} key={id} id={id} className={`${classNameToApply} ${containerClasses} ${getCardHoverClass()}${hiddenClass}`} style={props.style} {...formProps}>
            {type === 'form' && props.formThankYouUrl && <input type="hidden" name="_next" value={props.formThankYouUrl} />}
            {renderBackground()}
            
            <LinkWrapper>
                {children && children.length > 0 ? (
                    children.map(child => (
                        <RenderedPageElement 
                            key={child.id} 
                            element={child} 
                            savedTemplates={savedTemplates} 
                            isPreview={isPreview}
                            popupTargets={popupTargets}
                            megaMenuTargets={megaMenuTargets}
                        />
                    ))
                ) : (
                    <ElementRenderer element={renderedElement} isPreview={isPreview} />
                )}
            </LinkWrapper>
        </Tag>
    );
};

export const PageRenderer: React.FC<PageRendererProps> = ({ 
    elements, 
    savedTemplates = [], 
    isPreview = true 
}) => {
  const [activePopupId, setActivePopupId] = useState<string | null>(null);

  // Scan for Popup Targets & Mega Menu Targets to hide initially
  const { popupTargets, megaMenuTargets } = useMemo(() => {
    const popups = new Set<string>();
    const megas = new Set<string>();
    
    const scan = (els: PageElement[]) => {
        els.forEach(el => {
            // Button triggers
            if (el.type === 'button' && el.props.buttonAction === 'popup' && el.props.popupTargetId) {
                popups.add(el.props.popupTargetId);
            }
            // Nav Link Triggers
            if ((el.type === 'navbar' || el.type === 'menu') && el.props.navLinks) {
                const scanLinks = (links: any[]) => {
                    links.forEach(l => {
                        if (l.type === 'popup' && l.targetId) popups.add(l.targetId);
                        if (l.type === 'mega-menu' && l.targetId) megas.add(l.targetId);
                        if (l.children) scanLinks(l.children);
                    });
                }
                scanLinks(el.props.navLinks);
            }
            if (el.children) scan(el.children);
        });
    };
    scan(elements);
    return { popupTargets: popups, megaMenuTargets: megas };
  }, [elements]);

  const openPopup = (id: string) => setActivePopupId(id);
  
  const findElementById = (id: string, list: PageElement[]): PageElement | null => {
      for (const el of list) {
          if (el.id === id) return el;
          if (el.children) {
              const found = findElementById(id, el.children);
              if (found) return found;
          }
      }
      return null;
  };

  const activePopupElement = activePopupId ? findElementById(activePopupId, elements) : null;

  return (
    <PopupContext.Provider value={{ openPopup, popupTargets }}>
        <PageContext.Provider value={{ findElement: (id) => findElementById(id, elements) }}>
            {elements.map(el => (
                <RenderedPageElement 
                    key={el.id} 
                    element={el} 
                    savedTemplates={savedTemplates} 
                    isPreview={isPreview}
                    popupTargets={popupTargets}
                    megaMenuTargets={megaMenuTargets}
                />
            ))}
            
            {activePopupId && activePopupElement && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setActivePopupId(null)}
                    />
                    <div className="relative shadow-2xl overflow-hidden w-auto max-w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        <button 
                            className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full text-gray-800 transition-colors"
                            onClick={() => setActivePopupId(null)}
                        >
                            <Icons.X />
                        </button>
                        <div className="popup-content-wrapper">
                            {(() => {
                                const modalEl = { ...activePopupElement };
                                return (
                                    <div className="!block [&_.hidden]:!block"> 
                                        <div style={{ display: 'block !important' }}>
                                            <PopupRootRenderer 
                                                element={modalEl} 
                                                savedTemplates={savedTemplates}
                                                isPreview={isPreview}
                                                popupTargets={popupTargets}
                                                megaMenuTargets={megaMenuTargets}
                                            />
                                        </div>
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </PageContext.Provider>
    </PopupContext.Provider>
  );
};

const PopupRootRenderer: React.FC<{ 
    element: PageElement, 
    savedTemplates: SavedTemplate[],
    isPreview: boolean,
    popupTargets: Set<string>,
    megaMenuTargets: Set<string>
}> = ({ element, savedTemplates, isPreview, popupTargets, megaMenuTargets }) => {
    const { type, children, props } = element;
    const Tag = (type === 'section' ? 'section' : type === 'form' ? 'form' : 'div') as React.ElementType;
    
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

    const containerClasses = ['slider', 'card'].includes(type) ? 'relative overflow-hidden' : 'relative';
    const classNameToApply = type === 'button' ? '' : (props.className || '');
    const formProps = type === 'form' ? { action: props.formActionUrl, method: 'POST' } : {};

    return (
        <Tag className={`${classNameToApply} ${containerClasses}`} style={{ ...props.style, display: 'block' }} {...formProps}>
             {type === 'form' && props.formThankYouUrl && <input type="hidden" name="_next" value={props.formThankYouUrl} />}
            {renderBackground()}
            {children && children.length > 0 ? children.map(child => (
                <RenderedPageElement 
                    key={child.id} 
                    element={child} 
                    savedTemplates={savedTemplates} 
                    isPreview={isPreview}
                    popupTargets={popupTargets}
                    megaMenuTargets={megaMenuTargets}
                />
            )) : <ElementRenderer element={element} isPreview={true} />}
        </Tag>
    );
}

const SliderRenderer: React.FC<{ 
    element: PageElement; 
    savedTemplates: SavedTemplate[];
    isPreview: boolean;
    popupTargets: Set<string>;
    megaMenuTargets: Set<string>;
}> = ({ element, savedTemplates, isPreview, popupTargets, megaMenuTargets }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const transition = element.props.sliderTransition || 'fade';

    useEffect(() => {
        if (element.props.sliderAutoplay && element.children && element.children.length > 1) {
            const interval = setInterval(() => {
                setActiveIndex(prev => (prev + 1) % element.children!.length);
            }, element.props.sliderInterval || 3000);
            return () => clearInterval(interval);
        }
    }, [element.props.sliderAutoplay, element.props.sliderInterval, element.children?.length]);

    const renderNavIcon = (direction: 'prev' | 'next') => {
        const type = element.props.sliderNavType || 'chevron';
        if (type === 'arrow') return direction === 'prev' ? <Icons.ArrowLeft /> : <Icons.ArrowRight />;
        if (type === 'caret') return direction === 'prev' ? <Icons.CaretLeft /> : <Icons.CaretRight />;
        return <Icons.ChevronDown className={direction === 'prev' ? 'rotate-90' : '-rotate-90'} />;
    };

    if (!element.children) return null;

    return (
        <>
            {element.children.map((child, index) => {
                const isActive = index === activeIndex;
                let effectClass = '';
                const posClass = isActive ? 'relative z-10' : 'absolute top-0 left-0 z-0';
                const commonClass = 'w-full h-full transition-all duration-700 ease-in-out';
                
                switch(transition) {
                    case 'zoom':
                        effectClass = isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-110';
                        break;
                    case 'slide-up':
                        effectClass = isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
                        break;
                    case 'fade':
                    default:
                        effectClass = isActive ? 'opacity-100' : 'opacity-0';
                }
                
                const pointerEvents = isActive ? '' : 'pointer-events-none';

                return (
                    <div 
                        key={child.id} 
                        className={`${commonClass} ${posClass} ${effectClass} ${pointerEvents}`}
                    >
                        <RenderedPageElement 
                            key={child.id} 
                            element={child} 
                            savedTemplates={savedTemplates} 
                            isPreview={isPreview}
                            popupTargets={popupTargets}
                            megaMenuTargets={megaMenuTargets}
                        />
                    </div>
                )
            })}
            
            {element.children.length > 1 && (
                <>
                    <button 
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all"
                    onClick={() => setActiveIndex((prev) => (prev - 1 + element.children!.length) % element.children!.length)}
                    >
                        {renderNavIcon('prev')}
                    </button>
                    <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all"
                    onClick={() => setActiveIndex((prev) => (prev + 1) % element.children!.length)}
                    >
                        {renderNavIcon('next')}
                    </button>
                    {element.props.sliderShowPagination !== false && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                            {element.children.map((_, i) => (
                                <button
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                onClick={() => setActiveIndex(i)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </>
    );
};
