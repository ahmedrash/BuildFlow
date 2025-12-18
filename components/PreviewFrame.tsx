
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
            // Ensure the document has a basic structure with hidden body
            if (!doc.body) {
                 doc.write('<!DOCTYPE html><html><head></head><body style="margin:0; opacity: 0; transition: opacity 0.4s ease-in;"></body></html>');
                 doc.close();
            } else {
                 // Reset opacity if reusing body
                 doc.body.style.opacity = '0';
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
            
            // Inject Fonts
            if (!doc.getElementById('font-inter')) {
                const link = doc.createElement('link');
                link.id = 'font-inter';
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap';
                doc.head.appendChild(link);
            }

            // Inject GSAP Core
            if (!doc.getElementById('gsap-core')) {
                const script = doc.createElement('script');
                script.id = 'gsap-core';
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
                doc.head.appendChild(script);
            }

            // Inject GSAP ScrollTrigger
            if (!doc.getElementById('gsap-scrolltrigger')) {
                const script = doc.createElement('script');
                script.id = 'gsap-scrolltrigger';
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
                doc.head.appendChild(script);
            }
            
            // Inject Animation Observer Script
            if (!doc.getElementById('animate-observer')) {
                const script = doc.createElement('script');
                script.id = 'animate-observer';
                script.innerHTML = `
                    document.addEventListener('DOMContentLoaded', () => {
                        const initAnimations = () => {
                            // Prefer GSAP ScrollTrigger if available
                            if (window.gsap && window.ScrollTrigger) {
                                gsap.registerPlugin(ScrollTrigger);
                                const animateElements = document.querySelectorAll('.animate');
                                animateElements.forEach(el => {
                                    // Kill existing trigger if any to prevent duplicates during re-renders
                                    const existing = ScrollTrigger.getById(el.id); 
                                    if(existing) existing.kill();

                                    ScrollTrigger.create({
                                        id: el.id,
                                        trigger: el,
                                        start: "top 90%",
                                        onEnter: () => {
                                            el.classList.remove('animate');
                                        },
                                        scroller: document.body // Target iframe body scroller
                                    });
                                });
                            } else {
                                // Fallback to IntersectionObserver
                                const observer = new IntersectionObserver((entries) => {
                                    entries.forEach(entry => {
                                        if (entry.isIntersecting && entry.intersectionRatio > 0) {
                                            entry.target.classList.remove('animate');
                                            observer.unobserve(entry.target);
                                        }
                                    });
                                }, { threshold: 0.1 });
        
                                document.querySelectorAll('.animate').forEach(el => observer.observe(el));
                            }
                        };

                        // Check for GSAP load
                        let attempts = 0;
                        const checkGSAP = setInterval(() => {
                            attempts++;
                            if ((window.gsap && window.ScrollTrigger) || attempts > 20) {
                                clearInterval(checkGSAP);
                                initAnimations();
                            }
                        }, 100);

                        // Watch for DOM changes (drag/drop) to re-init
                        const mutationObserver = new MutationObserver((mutations) => {
                            let shouldUpdate = false;
                            mutations.forEach(mutation => {
                                if (mutation.addedNodes.length > 0) shouldUpdate = true;
                                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                                     // Reactivate animation if class reset to .animate
                                     const target = mutation.target;
                                     if (target.classList.contains('animate')) shouldUpdate = true;
                                }
                            });
                            if (shouldUpdate) initAnimations();
                        });

                        mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
                    });
                `;
                doc.head.appendChild(script);
            }
            
            // Inject Base Styles
            if (!doc.getElementById('base-styles')) {
                const styleEl = doc.createElement('style');
                styleEl.id = 'base-styles';
                styleEl.innerHTML = `
                    html { scroll-behavior: smooth; height: 100%; }
                    body { font-family: 'Inter', sans-serif; background-color: white; overflow-x: hidden; min-height: 100vh; height: 100%; }
                    .animate { opacity: 0; }
                    ::-webkit-scrollbar { width: 6px; height: 6px; }
                    ::-webkit-scrollbar-track { background: transparent; }
                    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
                    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                `;
                doc.head.appendChild(styleEl);
            }

            // Helper to start the content polling
            const startPollingForContent = () => {
                setMountNode(doc.body);

                // We poll for the existence of the React root div inside the iframe
                let attempts = 0;
                const checkInterval = setInterval(() => {
                    attempts++;
                    const hasContent = doc.body && (doc.body.children.length > 0 || doc.getElementById('canvas-root'));
                    
                    // Stop polling if content found OR timeout (approx 2s)
                    if (hasContent || attempts > 40) {
                        clearInterval(checkInterval);
                        
                        // Content detected. Now give Tailwind JIT a moment to observe and generate styles.
                        setTimeout(() => {
                            if (doc.body) {
                                // Force a layout reflow to ensure new styles are applied before we show it
                                const _ = doc.body.offsetHeight;
                                doc.body.style.opacity = '1';
                                // Trigger animation observer manually in case DOMContentLoaded fired early
                                const win = iframe.contentWindow as any;
                                if (win && win.document) {
                                    const event = new Event('DOMContentLoaded');
                                    win.document.dispatchEvent(event);
                                }
                            }
                            setIsReady(true);
                        }, 500); // 500ms safety buffer for Tailwind compilation
                    }
                }, 50); // Check every 50ms
            };

            // Inject Tailwind
            if (!doc.getElementById('tailwind-script')) {
                const script = doc.createElement('script');
                script.id = 'tailwind-script';
                script.src = 'https://cdn.tailwindcss.com';
                
                script.onload = () => {
                   // Tailwind loaded. Start React mount and polling.
                   startPollingForContent();
                };
                
                script.onerror = () => {
                    // Fallback in case of error
                    setMountNode(doc.body);
                    setIsReady(true);
                    if (doc.body) doc.body.style.opacity = '1';
                };
                
                doc.head.appendChild(script);
            } else {
                // If script is already there (hot reload or re-mount)
                startPollingForContent();
            }
        }
    };

    setupIframe();
    
    // Safety timer to force show content if polling fails completely
    const safetyTimer = setTimeout(() => {
        if (!isReady && iframe.contentWindow?.document.body) {
             setMountNode(iframe.contentWindow.document.body);
             iframe.contentWindow.document.body.style.opacity = '1';
             setIsReady(true);
        }
    }, 4000);

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
          transition: 'width 0.3s ease-in-out, opacity 0.4s ease-in-out',
          opacity: isReady ? 1 : 0 
      }}
      title="Editor Preview"
    >
      {mountNode && createPortal(children, mountNode)}
    </iframe>
  );
};
