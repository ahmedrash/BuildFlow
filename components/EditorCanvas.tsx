

import React, { MouseEvent, DragEvent, useState, useEffect } from 'react';
import { PageElement, SavedTemplate } from '../types';
import { Icons } from './Icons';
import { ElementRenderer } from './elements/ElementRenderer';

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
  isLocked?: boolean; // If true, prevent selection of children and force parent selection
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
  isLocked
}) => {
  const [dropPosition, setDropPosition] = useState<'inside' | 'top' | 'bottom' | null>(null);
  const isSelected = selectedId === element.id && !isPreview;
  const isGlobal = element.type === 'global';

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (isLocked && parentId) {
        onSelect(parentId, e); // Bubble up to the locked container
    } else {
        onSelect(element.id, e);
    }
  };

  const handleDragStart = (e: DragEvent) => {
    e.stopPropagation();
    if (isLocked) {
        // Prevent dragging internals of a locked/global component
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData('type', 'move');
    e.dataTransfer.setData('id', element.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLocked) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    const isContainer = ['section', 'container', 'columns', 'navbar', 'slider'].includes(element.type);
    
    if (isContainer) {
        if (y < 15) {
            setDropPosition('top');
        } else if (y > height - 15) {
            setDropPosition('bottom');
        } else {
            setDropPosition('inside');
        }
    } else {
        if (y < height / 2) {
            setDropPosition('top');
        } else {
            setDropPosition('bottom');
        }
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
    
    const isContainer = ['section', 'container', 'columns', 'navbar'].includes(element.type);
    if (!isContainer && finalPosition === 'inside') {
        finalPosition = 'after';
    }

    setDropPosition(null);

    const type = e.dataTransfer.getData('type');
    let data: any = {};

    if (type === 'new') {
       data = { elementType: e.dataTransfer.getData('elementType') };
    } else if (type === 'move') {
       data = { id: e.dataTransfer.getData('id') };
    }

    if (type === 'move' && data.id === element.id) return;

    onDropElement(element.id, finalPosition, { type, ...data });
  };

  // Slider Autoplay Logic
  useEffect(() => {
    if (element.type === 'slider' && element.props.sliderAutoplay && isPreview && element.children && element.children.length > 1) {
       const interval = element.props.sliderInterval || 3000;
       const timer = setInterval(() => {
           const currentIndex = element.props.sliderActiveIndex || 0;
           const nextIndex = (currentIndex + 1) % element.children!.length;
           onUpdateProps(element.id, { sliderActiveIndex: nextIndex });
       }, interval);
       return () => clearInterval(timer);
    }
  }, [element.type, element.props.sliderAutoplay, element.props.sliderInterval, element.children?.length, isPreview]);

  // Global Template Resolution
  let renderedElement = element;
  if (isGlobal && getTemplate) {
      const template = getTemplate(element.props.templateId || '');
      if (template) {
          renderedElement = template.element;
      }
  }

  const commonStyle = {
    ...renderedElement.props.style,
  };

  const containerClasses = ['section', 'container', 'columns', 'navbar', 'slider'].includes(renderedElement.type) 
    ? 'relative overflow-hidden' 
    : 'relative';

  const selectionClass = isSelected 
    ? 'ring-2 ring-indigo-500 ring-offset-2 z-10 cursor-pointer' 
    : isPreview || isLocked ? '' : 'hover:ring-1 hover:ring-indigo-300 cursor-pointer';
  
  const dropIndicatorClass = dropPosition === 'inside' ? 'ring-2 ring-dashed ring-blue-500 bg-blue-50/50' : '';
  const globalClass = isGlobal ? 'ring-1 ring-amber-300 hover:ring-amber-500' : '';

  const baseClasses = `${renderedElement.props.className || ''} ${selectionClass} ${dropIndicatorClass} ${globalClass} ${containerClasses} transition-all duration-200`;

  const renderBackground = () => {
    if (!['section', 'container', 'columns', 'navbar'].includes(renderedElement.type)) return null;
    const { backgroundImage, backgroundVideo, parallax } = renderedElement.props || {};
    const { backgroundImage: styleBgImage, backgroundVideo: styleBgVideo } = renderedElement.props.style || {};
    
    // Prefer props.style but fallback to props if structured that way in newer logic, 
    // though here we mostly use style prop. 
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

  const renderNavIcon = (direction: 'prev' | 'next') => {
      const type = renderedElement.props.sliderNavType || 'chevron';
      if (type === 'arrow') {
        return direction === 'prev' ? <Icons.ArrowLeft /> : <Icons.ArrowRight />;
      }
      if (type === 'caret') {
        return direction === 'prev' ? <Icons.CaretLeft /> : <Icons.CaretRight />;
      }
      return <Icons.ChevronDown className={direction === 'prev' ? 'rotate-90' : '-rotate-90'} />;
  };

  const Tag = renderedElement.type === 'section' ? 'section' : 'div';

  const renderChildren = () => {
      if (renderedElement.type === 'slider' && renderedElement.children) {
          const activeIndex = renderedElement.props.sliderActiveIndex || 0;
          return (
              <>
                  {renderedElement.children.map((child, index) => (
                      <div 
                          key={child.id} 
                          className={`w-full h-full top-0 left-0 transition-opacity duration-500 ease-in-out ${index === activeIndex ? 'relative opacity-100 z-10' : 'absolute opacity-0 -z-10 pointer-events-none'}`}
                      >
                         <EditorCanvas 
                             element={child}
                             selectedId={selectedId}
                             onSelect={onSelect}
                             isPreview={isPreview}
                             onDropElement={onDropElement}
                             onDuplicate={onDuplicate}
                             onUpdateProps={onUpdateProps}
                             parentId={isGlobal ? element.id : renderedElement.id} // If Global, parent is the global instance wrapper
                             getTemplate={getTemplate}
                             isLocked={isGlobal || isLocked}
                         />
                      </div>
                  ))}
                  
                  {renderedElement.children.length > 1 && (
                      <>
                          <button 
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                const prev = (activeIndex - 1 + renderedElement.children!.length) % renderedElement.children!.length;
                                onUpdateProps(element.id, { sliderActiveIndex: prev }); // Note: Updating props on the INSTANCE
                            }}
                          >
                             {renderNavIcon('prev')}
                          </button>
                          <button 
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all"
                             onClick={(e) => {
                                e.stopPropagation();
                                const next = (activeIndex + 1) % renderedElement.children!.length;
                                onUpdateProps(element.id, { sliderActiveIndex: next });
                            }}
                          >
                             {renderNavIcon('next')}
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                              {renderedElement.children.map((_, i) => (
                                  <button
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUpdateProps(element.id, { sliderActiveIndex: i });
                                    }}
                                  />
                              ))}
                          </div>
                      </>
                  )}
              </>
          )
      }

      if (renderedElement.children && renderedElement.children.length > 0) {
          return renderedElement.children.map(child => (
            <EditorCanvas 
              key={child.id} 
              element={child} 
              selectedId={selectedId} 
              onSelect={onSelect}
              isPreview={isPreview}
              onDropElement={onDropElement}
              onDuplicate={onDuplicate}
              onUpdateProps={onUpdateProps}
              parentId={isGlobal ? element.id : renderedElement.id} // Maintain hierarchy
              getTemplate={getTemplate}
              isLocked={isGlobal || isLocked}
            />
          ));
      }
      
      return (
          <>
            <ElementRenderer element={renderedElement} />
            {!isPreview && ['container', 'section', 'columns'].includes(renderedElement.type) && (!renderedElement.children || renderedElement.children.length === 0) && (
                 <div className="p-4 text-center text-gray-300 italic border-2 border-dashed border-gray-200 rounded select-none pointer-events-none bg-white/50">Empty {renderedElement.name}</div>
            )}
          </>
      );
  }

  return (
    <Tag 
      id={element.id}
      className={baseClasses}
      style={commonStyle}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable={isSelected && !isLocked}
      onDragStart={handleDragStart}
    >
      {isSelected && (
        <div className="absolute -top-7 left-0 flex items-center gap-1 z-20">
             {parentId && (
                 <button 
                    className="bg-indigo-500 text-white p-0.5 px-1.5 hover:bg-indigo-600 transition-colors rounded-l flex items-center gap-1 text-[10px] font-bold border-r border-indigo-400"
                    onClick={(e) => { e.stopPropagation(); onSelect(parentId, e); }}
                    title="Select Parent"
                 >
                    <div className="rotate-90"><Icons.ArrowLeft /></div> Parent
                 </button>
             )}
             <span className={`flex items-center gap-1 bg-indigo-500 text-white text-xs px-2 py-0.5 font-mono ${parentId ? '' : 'rounded-l'}`}>
                {isGlobal && <Icons.Globe width={12} height={12} />}
                {renderedElement.name}
             </span>
             <button 
                className="bg-indigo-500 text-white p-0.5 hover:bg-indigo-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); onDuplicate(element.id); }}
                title="Duplicate"
             >
                <Icons.Copy />
             </button>
             <div className="bg-indigo-500 text-white p-0.5 rounded-r cursor-grab active:cursor-grabbing" title="Drag to move">
                <Icons.GripVertical />
             </div>
        </div>
      )}
      
      {dropPosition === 'top' && (
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 z-50 pointer-events-none" />
      )}
      {dropPosition === 'bottom' && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 z-50 pointer-events-none" />
      )}
      
      {/* Locked Overlay to Capture Clicks for Global Elements */}
      {isLocked && <div className="absolute inset-0 z-10 bg-transparent cursor-pointer" onClick={handleClick}></div>}
      
      {renderBackground()}
      
      {renderChildren()}

    </Tag>
  );
};