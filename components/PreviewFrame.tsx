import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PreviewFrameProps {
  children: React.ReactNode;
  width: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ children, width, height = '100%', className, style }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupIframe = () => {
        const doc = iframe.contentWindow?.document;
        if (doc) {
            // Ensure the document has a basic structure
            if (!doc.body) {
                 doc.write('<!DOCTYPE html><html><head></head><body style="margin:0; opacity: 0; transition: opacity 0.3s;"></body></html>');
                 doc.close();
            }

            // Inject Meta Viewport
            if (!doc.querySelector('meta[name="viewport"]')) {
                const meta = doc.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, initial-scale=1, maximum-scale=1';
                doc.head.appendChild(meta);
            }

            // Inject Warning Suppression
            if (!doc.getElementById('tw-suppress')) {
                const script = doc.createElement('script');
                script.id = 'tw-suppress';
                script.innerHTML = `
                  const originalWarn = console.warn;
                  console.warn = (...args) => {
                    if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com should not be used in production')) return;
                    originalWarn.apply(console, args);
                  };
                `;
                doc.head.appendChild(script);
            }
            
            // Inject Tailwind with Load Handler
            if (!doc.getElementById('tailwind-script')) {
                const script = doc.createElement('script');
                script.id = 'tailwind-script';
                script.src = 'https://cdn.tailwindcss.com';
                
                script.onload = () => {
                   // Delay to allow JIT to parse the DOM
                   setTimeout(() => {
                       if (doc.body) doc.body.style.opacity = '1';
                       setIsReady(true);
                   }, 400);
                };
                script.onerror = () => setIsReady(true); // Fallback to show anyway
                
                doc.head.appendChild(script);
            } else {
                // If script exists, just give a small delay for re-rendering
                 setTimeout(() => {
                     if (doc.body) doc.body.style.opacity = '1';
                     setIsReady(true);
                 }, 300);
            }

            // Inject Fonts
            if (!doc.getElementById('font-inter')) {
                const link = doc.createElement('link');
                link.id = 'font-inter';
                link.rel = 'stylesheet';
                // Added multiple font families
                link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
                doc.head.appendChild(link);
            }
            
            // Inject Base Styles
            if (!doc.getElementById('base-styles')) {
                const styleEl = doc.createElement('style');
                styleEl.id = 'base-styles';
                styleEl.innerHTML = `
                    html { scroll-behavior: smooth; }
                    body { font-family: 'Inter', sans-serif; background-color: white; overflow-x: hidden; }
                    /* Custom scrollbar for webkit */
                    ::-webkit-scrollbar { width: 6px; height: 6px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
                    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                `;
                doc.head.appendChild(styleEl);
            }
            
            setMountNode(doc.body);
        }
    };

    setupIframe();
    
    // Safety timeout in case onload doesn't fire as expected (e.g. cached/race)
    const safetyTimer = setTimeout(() => setIsReady(true), 2000);

    // Re-setup on load if needed (though usually synchronous write works)
    iframe.addEventListener('load', setupIframe);
    return () => {
        iframe.removeEventListener('load', setupIframe);
        clearTimeout(safetyTimer);
    };

  }, []);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      style={{ 
          ...style, 
          width, 
          height, 
          border: 'none', 
          transition: 'width 0.3s ease-in-out, opacity 0.5s ease-in-out',
          opacity: isReady ? 1 : 0 
      }}
      title="Editor Preview"
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};