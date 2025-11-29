
import React, { useState, useEffect } from 'react';
import { Icons } from '../Icons';

interface SliderPreviewProps {
  items: { src: string; caption?: string; content?: string }[];
  autoplay?: boolean;
  interval?: number;
  navType?: 'chevron' | 'arrow' | 'caret';
}

export const SliderPreview: React.FC<SliderPreviewProps> = ({ 
  items, 
  autoplay, 
  interval,
  navType = 'chevron'
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (!autoplay || items.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % items.length);
        }, interval || 3000);
        return () => clearInterval(timer);
    }, [autoplay, interval, items.length]);

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide(prev => (prev + 1) % items.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide(prev => (prev - 1 + items.length) % items.length);
    };

    const renderNavIcon = (direction: 'prev' | 'next') => {
      const type = navType;
      
      if (type === 'arrow') {
        return direction === 'prev' ? <Icons.ArrowLeft /> : <Icons.ArrowRight />;
      }
      if (type === 'caret') {
        return direction === 'prev' ? <Icons.CaretLeft /> : <Icons.CaretRight />;
      }
      // Default Chevron
      if (direction === 'prev') {
         return <Icons.ChevronDown />; // Using existing rotated chevron logic from css class below
      }
      return <Icons.ChevronDown />;
    };

    if (!items || items.length === 0) {
        return <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">No slides</div>;
    }

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden group bg-gray-900">
            {items.map((item, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={item.src} className="w-full h-full object-cover" alt={`Slide ${index}`} />
                    
                    {/* Content Overlay */}
                    {(item.caption || item.content) && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white p-8 text-center">
                            {item.content && (
                                <div dangerouslySetInnerHTML={{ __html: item.content }} className="mb-2" />
                            )}
                            {item.caption && <p className="text-lg font-medium">{item.caption}</p>}
                        </div>
                    )}
                </div>
            ))}
            
            {items.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                         <div className={navType === 'chevron' ? 'rotate-90' : ''}>
                           {renderNavIcon('prev')}
                         </div>
                        <span className="sr-only">Prev</span>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                         <div className={navType === 'chevron' ? '-rotate-90' : ''}>
                           {renderNavIcon('next')}
                         </div>
                         <span className="sr-only">Next</span>
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {items.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
