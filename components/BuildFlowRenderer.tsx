
import React, { useEffect, useRef } from 'react';
import { PageElement, SavedTemplate } from '../types';
import { PageRenderer } from './PageRenderer';
import { EditorConfigContext } from './EditorConfigContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (!(window as any).gsap) (window as any).gsap = gsap;
        if (!(window as any).ScrollTrigger) (window as any).ScrollTrigger = ScrollTrigger;
    }
  }, []);

  useGSAP(() => {
      const refreshAnimations = () => {
          const animateElements = document.querySelectorAll('.animate');
          animateElements.forEach(el => {
              if (ScrollTrigger.getById(el.id)) return;
              ScrollTrigger.create({
                  id: el.id,
                  trigger: el,
                  start: "top 90%",
                  onEnter: () => el.classList.remove('animate'),
                  once: true
              });
          });
          ScrollTrigger.refresh();
      };
      refreshAnimations();
      const mutationObserver = new MutationObserver(() => refreshAnimations());
      if (containerRef.current) {
          mutationObserver.observe(containerRef.current, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      }
      return () => mutationObserver.disconnect();
  }, { dependencies: [initialData], scope: containerRef });

  return (
    <EditorConfigContext.Provider value={{ googleMapsApiKey, recaptchaSiteKey }}>
      <div ref={containerRef} className={`buildflow-renderer ${className}`}>
        <PageRenderer elements={initialData} savedTemplates={savedTemplates} isPreview={true} />
      </div>
    </EditorConfigContext.Provider>
  );
};
