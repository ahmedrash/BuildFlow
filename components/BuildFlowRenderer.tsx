
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

  // Expose GSAP to window for custom scripts
  useEffect(() => {
    if (typeof window !== 'undefined') {
        if (!(window as any).gsap) (window as any).gsap = gsap;
        if (!(window as any).ScrollTrigger) (window as any).ScrollTrigger = ScrollTrigger;
    }
  }, []);

  // Use GSAP hook to refresh ScrollTrigger when layout changes
  useGSAP(() => {
      // Small delay to allow elements to render and images to start loading
      const timer = setTimeout(() => {
          ScrollTrigger.refresh();
      }, 500);

      return () => clearTimeout(timer);
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
