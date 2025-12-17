
import React, { MouseEvent, DragEvent, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { PageElement, SavedTemplate } from '../types';
import { Icons } from './Icons';
import { ElementRenderer, useElementAnimation } from './elements/ElementRenderer';

interface EditorCanvasProps {
  element: PageElement;
  selectedId: string | null;
  onSelect: (id: string, e: MouseEvent) => void;
  isPreview: boolean;
  onDropElement: (targetId: string, position: 'inside' | 'after' | 'before', data: any) => void;
  onDuplicate: (id: string) => void;
  onUpdateProps: (id: string, props: any) => void;
  parentId?: string;
  getTemplate?: (id: string) => SavedTemplate | undefined;
  isLocked?: boolean; 
  popupTargets?: Set<string>;
  megaMenuTargets?: Set<string>;
  isPopupContent?: boolean;
  showHiddenElements?: boolean;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({ 
  element, 
  selectedId, 
  onSelect, 
  isPreview,
  onDropElement,
  onDuplicate,
  onUpdateProps,
  parentId,
  getTemplate,
  isLocked,
  popupTargets,
  megaMenuTargets,
  isPopupContent,
  showHiddenElements = true
}) => {
  const [dropPosition, setDropPosition] = useState<'inside' | 'top' | 'bottom' | null>(null);
  const elementRef = useRef<HTMLElement>(null);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0, visible: false });
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  
  const [stickyState, setStickyState] = useState<'idle' | 'stuck' | 'unsticking'>('idle');
  const stickyStateRef = useRef(stickyState);
  useEffect(() => { stickyStateRef.current = stickyState; }, [stickyState]);
  
  let renderedElement = element;
  let isMissingTemplate = false;

  if (element.type === 'global' && getTemplate) {
      const template = getTemplate(element.props.templateId || '');
      if (template) {
          renderedElement = template.element;
      } else {
          isMissingTemplate = true;
      }
  }

  // Animation Hook integration
  useElementAnimation(elementRef, renderedElement, isPreview);

  const isSelected = selectedId === element.id && !isPreview;
  const isGlobal = element.type === 'global';
  const isPopupTarget = popupTargets?.has(element.id);
  const isMegaMenuTarget = megaMenuTargets?.has(element.id);
  
  const isTargetHidden = (isPopupTarget || isMegaMenuTarget) && !isPopupContent;
  const isHidden = element.props.isHidden;

  let shouldHideClass = '';
  
  if (isHidden) {
      if (isPreview) {
          shouldHideClass = 'hidden';
      } else {
          if (showHiddenElements) {
               shouldHideClass = 'opacity-40 grayscale filter border border-dashed border-gray-300';
          } else {
               shouldHideClass = 'hidden';
          }
      }
  } else if (isTargetHidden) {
      if (isPreview) {
          shouldHideClass = 'hidden';
      } else {
          if (!showHiddenElements) {
              shouldHideClass = 'hidden';
          }
      }
  }

  useEffect(() => {
     if (renderedElement.type !== 'navbar' || renderedElement.props.headerType !== 'sticky' || !elementRef.current) return;
     
     const scrollContainer = elementRef.current.ownerDocument.defaultView;
     if (!scrollContainer) return;

     const handleScroll = () => {
         const offset = renderedElement.props.stickyOffset || 100;
         const currentScroll = scrollContainer.scrollY;
         const currentState = stickyStateRef.current;

         if (currentScroll > offset) {
             if (currentState !== 'stuck') setStickyState('stuck');
         } else {
             if (currentState === 'stuck') {
                 setStickyState('unsticking');
                 setTimeout(() => {
                     setStickyState(prev => prev === 'unsticking' ? 'idle' : prev);
                 }, 300);
             }
         }
     };

     scrollContainer.addEventListener('scroll', handleScroll);
     return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [renderedElement.type, renderedElement.props.headerType, renderedElement.props.stickyOffset]);


  useLayoutEffect(() => {
    if (isSelected && elementRef.current) {
        setPortalContainer(elementRef.current.ownerDocument.body);
        const updatePosition = () => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                setToolbarPos({
                    top: rect.top,
                    left: rect.left,
                    visible: true
                });
            }
        };
        updatePosition();
        const iframeWin = elementRef.current.ownerDocument.defaultView;
        if (iframeWin) {
            iframeWin.addEventListener('scroll', updatePosition);
            iframeWin.addEventListener('resize', updatePosition);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            if (iframeWin) {
                iframeWin.removeEventListener('scroll', updatePosition);
                iframeWin.removeEventListener('resize', updatePosition);
            }
            window.removeEventListener('resize', updatePosition);
        };
    } else {
        setToolbarPos(prev => ({ ...prev, visible: false }));
    }
  }, [isSelected, renderedElement.props.style, renderedElement.children?.length, renderedElement.props.className]); 

  const handleClick = (e: MouseEvent) => {
    if (isPreview) {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (link) {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const id = href.substring(1);
                const doc = target.ownerDocument;
                if (!id) {
                     doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                     const el = doc.getElementById(id);
                     if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
        return;
    }
    e.stopPropagation();
    if (isLocked && parentId) {
        onSelect(parentId, e); 
    } else {
        onSelect(element.id, e);
    }
  };

  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    if (isLocked || isPreview) { e.preventDefault(); return; }
    
    if (!isSelected) {
        onSelect(element.id, e as any);
    }

    e.dataTransfer.setData('type', 'move');
    e.dataTransfer.setData('id', element.id);
    e.dataTransfer.effectAllowed = 'all';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    const isContainer = ['section', 'container', 'columns', 'navbar', 'slider', 'card', 'form'].includes(element.type);
    if (isContainer) {
        if (y < 15) setDropPosition('top');
        else if (y > height - 15) setDropPosition('bottom');
        else setDropPosition('inside');
    } else {
        if (y < height / 2) setDropPosition('top');
        else setDropPosition('bottom');
    }
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDropPosition(null);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLocked) return;
    let finalPosition: 'inside' | 'after' | 'before' = 'inside';
    if (dropPosition === 'top') finalPosition = 'before';
    if (dropPosition === 'bottom') finalPosition = 'after';
    const isContainer = ['section', 'container', 'columns', 'navbar', 'card', 'form'].includes(element.type);
    if (!isContainer && finalPosition === 'inside') finalPosition = 'after';
    setDropPosition(null);
    const type = e.dataTransfer.getData('type');
    let data: any = {};
    if (type === 'new') data = { elementType: e.dataTransfer.getData('elementType') };
    else if (type === 'move') data = { id: e.dataTransfer.getData('id') };
    if (type === 'move' && data.id === element.id) return;
    onDropElement(element.id, finalPosition, { type, ...data });
  };

  const commonStyle = { ...renderedElement.props.style };
  const classNameToApply = renderedElement.type === 'button' ? '' : (renderedElement.props.className || '');
  const hasUserPositioning = /\b(absolute|fixed|sticky)\b/.test(classNameToApply);
  const headerType = renderedElement.props.headerType || 'relative';
  
  let stickyClass = hasUserPositioning ? '' : 'relative'; 
  if (renderedElement.type === 'navbar') {
      if (headerType === 'fixed') stickyClass = 'fixed top-0 left-0 w-full z-50';
      else if (headerType === 'sticky') {
          if (stickyState === 'stuck') stickyClass = 'fixed top-0 left-0 w-full z-50 animate-slide-in-down shadow-md';
          else if (stickyState === 'unsticking') stickyClass = 'fixed top-0 left-0 w-full z-50 animate-slide-out-up shadow-md';
          else stickyClass = 'relative';
      }
  }

  const shouldClip = ['slider', 'card'].includes(renderedElement.type);
  const overflowClass = shouldClip ? 'overflow-hidden' : '';
  const containerClasses = `${stickyClass} ${overflowClass}`;
  const selectionClass = isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 z-[100] cursor-pointer' : isPreview || isLocked ? '' : 'hover:ring-1 hover:ring-indigo-300 cursor-pointer';
  const dropIndicatorClass = dropPosition === 'inside' ? 'ring-2 ring-dashed ring-blue-500 bg-blue-50/50' : '';
  const globalClass = isGlobal ? 'ring-1 ring-amber-300 hover:ring-amber-500' : '';
  
  const getCardHoverClass = () => {
    if (isSelected) return '';
    if (renderedElement.type !== 'card') return '';
    const { cardHoverEffect } = renderedElement.props;
    let classes = ' transition-all duration-300';
    if (cardHoverEffect === 'lift') classes += ' hover:-translate-y-1 hover:shadow-xl';
    if (cardHoverEffect === 'zoom') classes += ' hover:scale-[1.02] hover:shadow-xl';
    if (cardHoverEffect === 'glow') classes += ' hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]';
    if (cardHoverEffect === 'border') classes += ' hover:border-indigo-500 border border-transparent';
    return classes;
  };

  const baseClasses = `${classNameToApply} ${selectionClass} ${dropIndicatorClass} ${globalClass} ${containerClasses} ${shouldHideClass} transition-all duration-200`;

  if (isMissingTemplate) {
      if (!isPreview) {
          return (
             <div 
                id={element.id} 
                className={`p-4 border-2 border-dashed border-red-300 bg-red-50 text-red-500 rounded flex items-center justify-center cursor-pointer text-sm font-medium ${selectionClass}`}
                onClick={(e) => onSelect(element.id, e as any)}
             >
                 <Icons.X className="w-5 h-5 mr-2 text-red-500" />
                 <span>Global Template Not Found ({element.name})</span>
             </div>
          );
      } else return null;
  }

  const renderBackground = () => {
    if (!['section', 'container', 'columns', 'navbar', 'card'].includes(renderedElement.type)) return null;
    const { backgroundImage, backgroundVideo, parallax } = renderedElement.props || {};
    const { backgroundImage: styleBgImage, backgroundVideo: styleBgVideo } = renderedElement.props.style || {};
    const finalBgImage = styleBgImage || backgroundImage;
    const finalBgVideo = styleBgVideo || backgroundVideo;
    if (finalBgVideo) return <video src={finalBgVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none" />;
    if (finalBgImage) {
      const url = finalBgImage.startsWith('url') ? finalBgImage.slice(4, -1).replace(/["']/g, "") : finalBgImage;
      return <div className={`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none ${parallax ? 'bg-fixed' : ''}`} style={{ backgroundImage: `url(${url})` }} />;
    }
    return null;
  };

  const renderNavIcon = (direction: 'prev' | 'next') => {
      const type = renderedElement.props.sliderNavType || 'chevron';
      if (type === 'arrow') return direction === 'prev' ? <Icons.ArrowLeft /> : <Icons.ArrowRight />;
      if (type === 'caret') return direction === 'prev' ? <Icons.CaretLeft /> : <Icons.CaretRight />;
      return <Icons.ChevronDown className={direction === 'prev' ? 'rotate-90' : '-rotate-90'} />;
  };

  const Tag = (renderedElement.type === 'section' ? 'section' : renderedElement.type === 'form' ? 'form' : 'div') as any;

  const LinkWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
    if (renderedElement.type === 'card' && renderedElement.props.cardLink) {
        return <a href={renderedElement.props.cardLink} className="block h-full no-underline text-inherit" onClick={e => {
            if (!isPreview) { e.preventDefault(); return; }
            const href = renderedElement.props.cardLink;
            const isAnchor = href && href.startsWith('#');
            if (isAnchor) {
                e.preventDefault();
                const id = href.substring(1);
                const doc = (e.target as HTMLElement).ownerDocument;
                if (!id) doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
                else doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            if (!href || href === '#') e.preventDefault();
        }}>{children}</a>;
    }
    return <>{children}</>;
  };

  const renderChildren = () => {
      if (renderedElement.type === 'slider' && renderedElement.children) {
          const activeIndex = renderedElement.props.sliderActiveIndex || 0;
          const transition = renderedElement.props.sliderTransition || 'fade';
          return (
              <>
                  {renderedElement.children.map((child, index) => {
                      const isActive = index === activeIndex;
                      let effectClass = '';
                      const posClass = isActive ? 'relative z-10' : 'absolute top-0 left-0 z-0';
                      const commonClass = 'w-full h-full transition-all duration-700 ease-in-out';
                      switch(transition) {
                          case 'zoom': effectClass = isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-110'; break;
                          case 'slide-up': effectClass = isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'; break;
                          case 'fade': default: effectClass = isActive ? 'opacity-100' : 'opacity-0';
                      }
                      return (
                           <div key={child.id} className={`${commonClass} ${posClass} ${effectClass} ${isActive ? '' : 'pointer-events-none'}`}>
                               <EditorCanvas element={child} selectedId={selectedId} onSelect={onSelect} isPreview={isPreview} onDropElement={onDropElement} onDuplicate={onDuplicate} onUpdateProps={onUpdateProps} parentId={isGlobal ? element.id : renderedElement.id} getTemplate={getTemplate} isLocked={isGlobal || isLocked} popupTargets={popupTargets} megaMenuTargets={megaMenuTargets} showHiddenElements={showHiddenElements} />
                           </div>
                      )
                  })}
                  {renderedElement.children.length > 1 && (
                      <>
                          <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all" onClick={(e) => { e.stopPropagation(); const prev = (activeIndex - 1 + renderedElement.children!.length) % renderedElement.children!.length; onUpdateProps(element.id, { sliderActiveIndex: prev }); }}>{renderNavIcon('prev')}</button>
                          <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all" onClick={(e) => { e.stopPropagation(); const next = (activeIndex + 1) % renderedElement.children!.length; onUpdateProps(element.id, { sliderActiveIndex: next }); }}>{renderNavIcon('next')}</button>
                          {renderedElement.props.sliderShowPagination !== false && (
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                  {renderedElement.children.map((_, i) => (
                                      <button key={i} className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-white scale-125' : 'bg-white/50'}`} onClick={(e) => { e.stopPropagation(); onUpdateProps(element.id, { sliderActiveIndex: i }); }} />
                                  ))}
                              </div>
                          )}
                      </>
                  )}
              </>
          )
      }
      if (renderedElement.children && renderedElement.children.length > 0) {
          return renderedElement.children.map(child => (
            <EditorCanvas key={child.id} element={child} selectedId={selectedId} onSelect={onSelect} isPreview={isPreview} onDropElement={onDropElement} onDuplicate={onDuplicate} onUpdateProps={onUpdateProps} parentId={isGlobal ? element.id : renderedElement.id} getTemplate={getTemplate} isLocked={isGlobal || isLocked} popupTargets={popupTargets} megaMenuTargets={megaMenuTargets} showHiddenElements={showHiddenElements} />
          ));
      }
      return (
          <>
            <ElementRenderer element={renderedElement} isPreview={isPreview} />
            {!isPreview && ['container', 'section', 'columns', 'navbar', 'form'].includes(renderedElement.type) && (!renderedElement.children || renderedElement.children.length === 0) && (
                 <div className="p-4 text-center text-gray-300 italic border-2 border-dashed border-gray-200 rounded select-none pointer-events-none bg-white/50">Empty {renderedElement.name}</div>
            )}
          </>
      );
  }

  return (
    <Tag 
      ref={elementRef}
      id={element.id}
      className={baseClasses + getCardHoverClass()}
      style={commonStyle}
      onClick={!isPreview ? handleClick : undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={!isPreview && !isLocked}
      onDragStart={handleDragStart}
    >
      {dropPosition === 'top' && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-50 pointer-events-none" />}
      {dropPosition === 'bottom' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 z-50 pointer-events-none" />}
      {isLocked && !isPreview && <div className="absolute inset-0 z-10 bg-transparent cursor-pointer" onClick={handleClick}></div>}
      
      {!isPreview && isPopupTarget && !isMegaMenuTarget && <div className="absolute top-0 right-0 bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 z-20 rounded-bl pointer-events-none">POPUP CONTENT</div>}
      {!isPreview && isMegaMenuTarget && <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 z-20 rounded-bl pointer-events-none">MEGA MENU CONTENT</div>}
      {!isPreview && isHidden && showHiddenElements && <div className="absolute top-0 left-0 bg-gray-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 z-20 rounded-br pointer-events-none"><Icons.EyeOff width={10} height={10} className="inline mr-1"/>HIDDEN</div>}

      {renderBackground()}
      <LinkWrapper>{renderChildren()}</LinkWrapper>

      {isSelected && toolbarPos.visible && portalContainer && createPortal(
        <div className="fixed flex items-center gap-0 z-[1000] h-7 shadow-sm" style={{ top: `${toolbarPos.top - 28}px`, left: `${toolbarPos.left}px` }} draggable onDragStart={handleDragStart}>
             {parentId && <button className="bg-indigo-500 text-white px-2 hover:bg-indigo-600 transition-colors rounded-l flex items-center gap-1 text-xs font-bold border-r border-indigo-400 h-full" onClick={(e) => { e.stopPropagation(); onSelect(parentId, e); }} title="Select Parent"><div className="rotate-90"><Icons.ArrowLeft width={12} height={12} /></div> Parent</button>}
             <span className={`flex items-center gap-1 bg-indigo-500 text-white text-xs px-2 font-mono h-full cursor-default ${parentId ? '' : 'rounded-l'}`}>{isGlobal && <Icons.Globe width={12} height={12} />}{isPopupTarget && <span className="bg-pink-600 px-1 rounded-sm text-[8px] mr-1">POPUP</span>}{renderedElement.name}</span>
             <button className="bg-indigo-500 text-white px-2 hover:bg-indigo-600 transition-colors border-l border-indigo-400 h-full flex items-center justify-center" onClick={(e) => { e.stopPropagation(); onDuplicate(element.id); }} title="Duplicate"><Icons.Copy width={14} height={14} /></button>
             <div className="bg-indigo-500 text-white px-2 rounded-r cursor-grab active:cursor-grabbing border-l border-indigo-400 h-full flex items-center justify-center" title="Drag to move"><Icons.GripVertical width={14} height={14} /></div>
        </div>,
        portalContainer
      )}
    </Tag>
  );
};
