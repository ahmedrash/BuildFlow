



import React, { useEffect, useState } from 'react';
import { PageElement, SavedTemplate } from '../types';
import { ElementRenderer } from './elements/ElementRenderer';
import { Icons } from './Icons';

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

    const containerClasses = ['section', 'container', 'columns', 'navbar', 'slider', 'card'].includes(type) 
        ? 'relative overflow-hidden' 
        : 'relative';

    const classNameToApply = type === 'button' ? '' : (props.className || '');
    
    // Hover effects for Card wrapper
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

    // For exported/preview mode, we just render the structure
    const Tag = type === 'section' ? 'section' : 'div';
    
    // Link Wrapper for Card
    const LinkWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
        if (type === 'card' && props.cardLink) {
             return <a href={props.cardLink} className="block h-full no-underline text-inherit">{children}</a>;
        }
        return <>{children}</>;
    };

    // Slider specific children rendering
    if (type === 'slider' && children) {
        return (
            <Tag key={id} className={`${classNameToApply} ${containerClasses}`} style={props.style}>
                {renderBackground()}
                <SliderRenderer 
                   element={renderedElement} 
                   renderChild={renderElement} 
                />
            </Tag>
        );
    }

    return (
        <Tag key={id} className={`${classNameToApply} ${containerClasses} ${getCardHoverClass()}`} style={props.style}>
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

  return <>{elements.map(el => renderElement(el))}</>;
};

// Internal Slider Component for the Renderer to handle interaction
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