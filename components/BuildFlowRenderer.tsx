
import React, { useEffect, useRef } from 'react';
import { PageElement, SavedTemplate } from '../types';
import { PageRenderer } from './PageRenderer';
import { EditorConfigContext } from './EditorConfigContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface BuildFlowRendererProps {
  initialData: PageElement[];
  savedTemplates?: SavedTemplate[];
  googleMapsApiKey?: string;
  recaptchaSiteKey?: string;
  className?: string;
}

export const BuildFlowRenderer: React.FC<BuildFlowRendererProps> = ({
  initialData,
  savedTemplates = [],
  googleMapsApiKey,
  recaptchaSiteKey,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose GSAP to window for custom scripts that expect it globally (e.g., customScript definition)
  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (!(window as any).gsap) {
            (window as any).gsap = gsap;
        }
        if (!(window as any).ScrollTrigger) {
            (window as any).ScrollTrigger = ScrollTrigger;
        }
    }
  }, []);

  // Setup GSAP Animations
  useGSAP(() => {
      // Function to refresh triggers for elements
      const refreshAnimations = () => {
          const animateElements = document.querySelectorAll('.animate');
          
          animateElements.forEach(el => {
              // Ensure we don't duplicate triggers
              if (ScrollTrigger.getById(el.id)) return;

              ScrollTrigger.create({
                  id: el.id,
                  trigger: el,
                  start: "top 90%", // Trigger when top of element hits 90% of viewport
                  onEnter: () => {
                      el.classList.remove('animate');
                  },
                  once: true // Only animate once
              });
          });
          
          ScrollTrigger.refresh();
      };

      refreshAnimations();

      // MutationObserver to handle dynamically added elements
      const mutationObserver = new MutationObserver((mutations) => {
          let shouldUpdate = false;
          mutations.forEach(mutation => {
              if (mutation.addedNodes.length > 0) shouldUpdate = true;
              if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                   const target = mutation.target as HTMLElement;
                   if (target.classList.contains('animate')) {
                       shouldUpdate = true;
                   }
              }
          });
          
          if (shouldUpdate) {
              refreshAnimations();
          }
      });
      
      if (containerRef.current) {
          mutationObserver.observe(containerRef.current, { 
              childList: true, 
              subtree: true, 
              attributes: true, 
              attributeFilter: ['class'] 
          });
      }
      
      return () => mutationObserver.disconnect();

  }, { dependencies: [initialData], scope: containerRef });

  return (
    <EditorConfigContext.Provider value={{ googleMapsApiKey, recaptchaSiteKey }}>
      <div ref={containerRef} className={`buildflow-renderer ${className}`}>
        <PageRenderer 
          elements={initialData} 
          savedTemplates={savedTemplates} 
          isPreview={true} 
        />
      </div>
    </EditorConfigContext.Provider>
  );
};
