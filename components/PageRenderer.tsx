
import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { PageElement, SavedTemplate } from '../types';
import { ElementRenderer } from './elements/ElementRenderer';
import { Icons } from './Icons';
import { EditorConfigContext, PopupContext, PageContext } from './EditorConfigContext';

interface PageRendererProps {
  elements: PageElement[];
  savedTemplates?: SavedTemplate[];
  isPreview?: boolean;
}

export const PageRenderer: React.FC<PageRendererProps> = ({ 
    elements, 
    savedTemplates = [], 
    isPreview = true 
}) => {
  const [activePopupId, setActivePopupId] = useState<string | null>(null);

  // Scan for Popup Targets to hide initially
  const popupTargets = useMemo(() => {
    const targets = new Set<string>();
    const scan = (els: PageElement[]) => {
        els.forEach(el => {
            // Button triggers
            if (el.type === 'button' && el.props.buttonAction === 'popup' && el.props.popupTargetId) {
                targets.add(el.props.popupTargetId);
            }
            // Nav Link Triggers
            if (el.type === 'navbar' && el.props.navLinks) {
                const scanLinks = (links: any[]) => {
                    links.forEach(l => {
                        if ((l.type === 'popup' || l.type === 'mega-menu') && l.targetId) {
                            targets.add(l.targetId);
                        }
                        if (l.children) scanLinks(l.children);
                    });
                }
                scanLinks(el.props.navLinks);
            }
            if (el.children) scan(el.children);
        });
    };
    scan(elements);
    return targets;
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

  const renderElement = (element: PageElement): React.ReactNode => {
    // Global Template Resolution
    let renderedElement = element;
    if (element.type === 'global') {
        const template = savedTemplates.find(t => t.id === element.props.templateId);
        if (template) {
            renderedElement = template.element;
        }
    }

    const { type, children, id, props } = renderedElement;
    
    // Popup Hiding Logic
    const isTarget = popupTargets.has(id);
    const isHiddenTarget = isTarget && isPreview; // Only hide in preview/render mode
    
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

    // Navbar positioning logic
    const isNavbar = type === 'navbar';
    const isSticky = isNavbar && props.isSticky;
    const stickyClass = isSticky ? 'fixed top-0 left-0 w-full z-50' : 'relative';
    const overflowClass = ['slider', 'card'].includes(type) ? 'overflow-hidden' : '';

    const containerClasses = `${stickyClass} ${overflowClass}`;

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

    const Tag = type === 'section' ? 'section' : 'div';
    
    const LinkWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
        if (type === 'card' && props.cardLink) {
             return <a href={props.cardLink} className="block h-full no-underline text-inherit">{children}</a>;
        }
        return <>{children}</>;
    };

    if (type === 'slider' && children) {
        return (
            <Tag key={id} className={`${classNameToApply} ${containerClasses}${hiddenClass}`} style={props.style}>
                {renderBackground()}
                <SliderRenderer 
                   element={renderedElement} 
                   renderChild={renderElement} 
                />
            </Tag>
        );
    }

    return (
        <Tag key={id} id={id} className={`${classNameToApply} ${containerClasses} ${getCardHoverClass()}${hiddenClass}`} style={props.style}>
            {renderBackground()}
            
            <LinkWrapper>
                {children && children.length > 0 ? (
                    children.map(child => renderElement(child))
                ) : (
                    <ElementRenderer element={renderedElement} isPreview={isPreview} />
                )}
            </LinkWrapper>
        </Tag>
    );
  };

  return (
    <PopupContext.Provider value={{ openPopup, popupTargets }}>
        <PageContext.Provider value={{ findElement: (id) => findElementById(id, elements) }}>
            {elements.map(el => renderElement(el))}
            
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
                                                renderChild={renderElement} 
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

const PopupRootRenderer: React.FC<{ element: PageElement, renderChild: (el: PageElement) => React.ReactNode }> = ({ element, renderChild }) => {
    const { type, children, props } = element;
    const Tag = type === 'section' ? 'section' : 'div';
    
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

    return (
        <Tag className={`${classNameToApply} ${containerClasses}`} style={{ ...props.style, display: 'block' }}>
            {renderBackground()}
            {children && children.length > 0 ? children.map(child => renderChild(child)) : <ElementRenderer element={element} isPreview={true} />}
        </Tag>
    );
}

const SliderRenderer: React.FC<{ element: PageElement; renderChild: (el: PageElement) => React.ReactNode }> = ({ element, renderChild }) => {
    const [activeIndex, setActiveIndex] = useState(0);

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
            {element.children.map((child, index) => (
                <div 
                    key={child.id} 
                    className={`w-full h-full top-0 left-0 transition-opacity duration-500 ease-in-out ${index === activeIndex ? 'relative opacity-100 z-10' : 'absolute opacity-0 -z-10 pointer-events-none'}`}
                >
                    {renderChild(child)}
                </div>
            ))}
            
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
