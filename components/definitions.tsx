
import React, { useContext, useEffect, useRef } from 'react';
import { PageElement, ListItem } from '../types';
import { Icons } from './Icons';
import { ComponentRegistry } from './registry';
import { ChildWrapper } from './elements/ElementRenderer';
import { PopupContext } from './EditorConfigContext';
import * as LucideIcons from 'lucide-react';

// --- Basic Components ---

// Text
ComponentRegistry.register({
    type: 'text',
    name: 'Text',
    icon: Icons.Type,
    group: 'basic',
    render: ({ element }) => (
        <div style={element.props.elementStyle} className={element.props.elementClassName}>
            {element.props.content}
        </div>
    )
});

// Heading
ComponentRegistry.register({
    type: 'heading',
    name: 'Heading',
    icon: Icons.Heading,
    group: 'basic',
    render: ({ element }) => {
        const Tag = (`h${element.props.level || 2}`) as React.ElementType;
        return <Tag style={element.props.elementStyle} className={element.props.elementClassName}>{element.props.content || 'Heading'}</Tag>;
    }
});

// Button
ComponentRegistry.register({
    type: 'button',
    name: 'Button',
    icon: Icons.Button,
    group: 'basic',
    render: ({ element, isPreview }) => {
        const { openPopup } = useContext(PopupContext);
        const { buttonAction, href, target, content, style, elementStyle, className, elementClassName, buttonIconLeft, buttonIconRight, buttonIsIconOnly } = element.props;
        const finalStyle = { ...style, ...elementStyle };
        const finalClass = `px-4 py-2 rounded transition inline-block text-center ${className || ''} ${elementClassName || ''}`;
        
        const handleClick = (e: React.MouseEvent) => {
            if (!isPreview) {
                e.preventDefault();
                return;
            }
        };

        const renderContent = () => {
             const LeftIcon = buttonIconLeft ? (LucideIcons as any)[buttonIconLeft] : null;
             const RightIcon = buttonIconRight ? (LucideIcons as any)[buttonIconRight] : null;

             if (buttonIsIconOnly) {
                 // Use Left icon as the primary icon for icon-only mode if available, else fallback to Right, else Box
                 const Icon = LeftIcon || RightIcon || Icons.Box;
                 return <span className="flex items-center justify-center"><Icon size={16} /></span>;
             }
             
             return (
                <div className="flex items-center justify-center gap-2">
                    {LeftIcon && <LeftIcon size={16} />}
                    <span>{content || 'Button'}</span>
                    {RightIcon && <RightIcon size={16} />}
                </div>
             );
        };

        const innerContent = renderContent();

        if (buttonAction === 'link') {
             if (!href) return <div className={finalClass} style={finalStyle}>{innerContent}</div>;
             return (
                 <a href={href} target={target} className={finalClass} style={finalStyle} onClick={handleClick}>{innerContent}</a>
             );
        }
        if (buttonAction === 'popup') {
             return (
                <button 
                    type="button" 
                    className={`${finalClass} cursor-pointer`} 
                    style={finalStyle} 
                    onClick={e => {
                        e.preventDefault();
                        if (isPreview && element.props.popupTargetId) {
                             openPopup(element.props.popupTargetId);
                        }
                    }}
                >
                    {innerContent}
                </button>
             );
        }
        return <button type="submit" className={finalClass} style={finalStyle}>{innerContent}</button>;
    }
});

// Image
ComponentRegistry.register({
    type: 'image',
    name: 'Image',
    icon: Icons.Image,
    group: 'media',
    render: ({ element }) => (
        <img 
            src={element.props.src || 'https://via.placeholder.com/300'} 
            alt={element.props.alt || ''}
            className={`w-full ${element.props.elementClassName || ''}`}
            style={{ 
                objectFit: (element.props.imageObjectFit || 'cover') as any,
                height: element.props.imageHeight || 'auto',
                ...element.props.elementStyle 
            }}
        />
    )
});

// Video
ComponentRegistry.register({
    type: 'video',
    name: 'Video',
    icon: Icons.Video,
    group: 'media',
    render: ({ element }) => {
        const videoSrc = element.props.videoUrl || '';
        const isYoutube = videoSrc.includes('youtube') || videoSrc.includes('youtu.be');
        const embedUrl = isYoutube && !videoSrc.includes('embed') ? videoSrc.replace('watch?v=', 'embed/') : videoSrc;
        return (
            <div className={`aspect-video w-full bg-black rounded overflow-hidden relative ${element.props.elementClassName || ''}`} style={element.props.elementStyle}>
                <iframe src={embedUrl} className="w-full h-full pointer-events-none" frameBorder="0" />
            </div>
        );
    }
});

// List
ComponentRegistry.register({
    type: 'list',
    name: 'List',
    icon: Icons.List,
    group: 'basic',
    render: ({ element, isPreview }) => {
        const ListTag = (element.props.listType || 'ul') as React.ElementType;
        const listItems: ListItem[] = element.props.listItems && element.props.listItems.length > 0 
            ? element.props.listItems 
            : (element.props.items || []).map((t, i) => ({ id: `li-${i}`, text: t }));
        
        // Disable list style if any item has an icon to align properly
        const hasIcons = listItems.some(i => i.iconLeft);
        const listStyleType = hasIcons ? 'none' : (element.props.listStyleType || (element.props.listType === 'ol' ? 'decimal' : 'disc'));

        return (
            <ListTag className={`pl-5 ${element.props.elementClassName || ''}`} style={{ listStyleType, paddingLeft: hasIcons ? 0 : undefined, ...element.props.elementStyle }}>
                {listItems.map((item, i) => {
                    const LeftIcon = item.iconLeft ? (LucideIcons as any)[item.iconLeft] : null;
                    const RightIcon = item.iconRight ? (LucideIcons as any)[item.iconRight] : null;
                    
                    const content = (
                        <span className="flex items-center gap-2">
                             {LeftIcon && <LeftIcon size={16} className="shrink-0" />}
                             <span>{item.text}</span>
                             {RightIcon && <RightIcon size={16} className="shrink-0" />}
                        </span>
                    );

                    return (
                        <li key={item.id || i} style={{ marginBottom: element.props.itemSpacing }}>
                            {item.href ? (
                                <a 
                                    href={item.href} 
                                    target={item.target} 
                                    className="hover:underline hover:text-indigo-600 transition-colors"
                                    onClick={e => !isPreview && e.preventDefault()}
                                >
                                    {content}
                                </a>
                            ) : (
                                content
                            )}
                        </li>
                    );
                })}
            </ListTag>
        );
    }
});

// --- Containers ---

// Section, Container, Columns (Generic)
['section', 'container', 'columns'].forEach(type => {
    ComponentRegistry.register({
        type,
        name: type.charAt(0).toUpperCase() + type.slice(1),
        icon: type === 'container' ? Icons.Box : Icons.Layout,
        group: 'layout',
        render: ({ element, isPreview }) => {
            // Render background helper inside
            const { backgroundImage, backgroundVideo, parallax } = element.props || {};
            const { backgroundImage: styleBgImage, backgroundVideo: styleBgVideo } = element.props.style || {};
            const finalBgImage = styleBgImage || backgroundImage;
            const finalBgVideo = styleBgVideo || backgroundVideo;

            let bgNode = null;
            if (finalBgVideo) {
                bgNode = <video src={finalBgVideo} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10 pointer-events-none" />;
            } else if (finalBgImage) {
                const url = finalBgImage.startsWith('url') ? finalBgImage.slice(4, -1).replace(/["']/g, "") : finalBgImage;
                bgNode = <div className={`absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none ${parallax ? 'bg-fixed' : ''}`} style={{ backgroundImage: `url(${url})` }} />;
            }

            const Tag = (type === 'section' ? 'section' : 'div') as React.ElementType;

            return (
                <Tag id={element.id} className={`${element.props.className || ''} relative`} style={element.props.style}>
                    {bgNode}
                    {element.children?.map(child => <ChildWrapper key={child.id} element={child} isPreview={isPreview} />)}
                </Tag>
            );
        }
    });
});

// Navbar
ComponentRegistry.register({
    type: 'navbar',
    name: 'Navbar',
    icon: Icons.Menu,
    group: 'advanced',
    render: ({ element, isPreview }) => (
        <div id={element.id} className={element.props.className} style={element.props.style}>
             {element.children?.map(child => <ChildWrapper key={child.id} element={child} isPreview={isPreview} />)}
        </div>
    )
});

// Card
ComponentRegistry.register({
    type: 'card',
    name: 'Card',
    icon: Icons.Square,
    group: 'basic',
    render: ({ element, isPreview }) => (
        <div id={element.id} className={`${element.props.className || ''} relative`} style={element.props.style}>
            {element.props.cardBadge && (
                <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm pointer-events-none">
                    {element.props.cardBadge}
                </div>
            )}
            {element.children?.map(child => <ChildWrapper key={child.id} element={child} isPreview={isPreview} />)}
        </div>
    )
});

// Form (Container)
ComponentRegistry.register({
    type: 'form',
    name: 'Smart Form',
    icon: Icons.Form,
    group: 'advanced',
    render: ({ element, isPreview }) => (
        <form 
            className={`${element.props.className || ''} relative`} 
            style={element.props.style} 
            action={element.props.formActionUrl}
            method="POST"
            onSubmit={(e) => !isPreview && e.preventDefault()}
        >
             {element.props.formThankYouUrl && <input type="hidden" name="_next" value={element.props.formThankYouUrl} />}
            {element.children?.map(child => <ChildWrapper key={child.id} element={child} isPreview={isPreview} />)}
        </form>
    )
});

// --- Form Fields ---
const InputRenderer: React.FC<{ element: PageElement; isPreview: boolean }> = ({ element, isPreview }) => (
    <div className={`w-full ${element.props.fieldHidden ? 'hidden' : ''}`}>
        {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
        <input 
            type={element.props.inputType || 'text'} 
            name={element.props.fieldName}
            placeholder={element.props.fieldPlaceholder} 
            required={element.props.fieldRequired}
            defaultValue={element.props.fieldDefaultValue}
            className={`w-full border-gray-300 shadow-sm p-2 border rounded-md bg-white ${element.props.elementClassName || ''} ${!isPreview ? 'pointer-events-none' : ''}`} 
            style={element.props.elementStyle} 
            disabled={!isPreview} 
        />
    </div>
);
ComponentRegistry.register({ type: 'input', name: 'Input', icon: Icons.Input, group: 'form', render: InputRenderer });

ComponentRegistry.register({
    type: 'textarea',
    name: 'Textarea',
    icon: Icons.Textarea,
    group: 'form',
    render: ({ element, isPreview }) => (
        <div className={`w-full ${element.props.fieldHidden ? 'hidden' : ''}`}>
            {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
            <textarea 
                name={element.props.fieldName}
                placeholder={element.props.fieldPlaceholder} 
                required={element.props.fieldRequired}
                defaultValue={element.props.fieldDefaultValue}
                rows={element.props.fieldRows || 4} 
                className={`w-full border-gray-300 shadow-sm p-2 border rounded-md bg-white ${element.props.elementClassName || ''} ${!isPreview ? 'pointer-events-none' : ''}`} 
                style={element.props.elementStyle} 
                disabled={!isPreview} 
            />
        </div>
    )
});

// Logo
ComponentRegistry.register({
    type: 'logo',
    name: 'Logo',
    icon: Icons.Star,
    group: 'media',
    render: ({ element, isPreview }) => {
        const { logoType, logoSrc, logoText, logoWidth, elementStyle, elementClassName, href } = element.props;
        const content = logoType === 'image' ? (
            <img src={logoSrc} alt={element.props.alt} style={{ width: logoWidth || 'auto', ...elementStyle }} className={elementClassName} />
        ) : (
            <span style={elementStyle} className={elementClassName}>{logoText || 'Logo'}</span>
        );
        
        if (href) {
             return <a href={href} className="block" onClick={e => !isPreview && e.preventDefault()}>{content}</a>;
        }
        return <div className="block">{content}</div>;
    }
});

// Custom Script
ComponentRegistry.register({
    type: 'customScript',
    name: 'GSAP Script',
    icon: Icons.Magic,
    group: 'advanced',
    render: ({ element, isPreview }) => {
        // Use a ref to get access to the document context where this element is rendered (e.g. inside iframe)
        const ref = React.useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (isPreview && element.props.scriptContent && ref.current) {
                 const ownerDoc = ref.current.ownerDocument;
                 const targetWindow = ownerDoc.defaultView as any;

                 // Poll for GSAP availability in the target window (iframe or main window)
                 let attempts = 0;
                 const maxAttempts = 20; // 2 seconds approx
                 const interval = setInterval(() => {
                     if (targetWindow && targetWindow.gsap) {
                         clearInterval(interval);
                         try {
                            // Create a function that takes GSAP globals from the target window context
                            const func = new Function('gsap', 'ScrollTrigger', 'document', 'window', element.props.scriptContent);
                            
                            // Execute the user's script passing the iframe's GSAP instance
                            func(targetWindow.gsap, targetWindow.ScrollTrigger, ownerDoc, targetWindow);
                            
                            // Refresh ScrollTrigger to ensure it catches layout changes
                            if (targetWindow.ScrollTrigger) targetWindow.ScrollTrigger.refresh();

                         } catch (e) {
                             console.error(`GSAP Execution Error in "${element.name}":`, e);
                         }
                     } else {
                         attempts++;
                         if (attempts >= maxAttempts) {
                             clearInterval(interval);
                             console.warn("GSAP not found in preview context after retries. Ensure scripts are loaded.");
                         }
                     }
                 }, 100);

                 return () => clearInterval(interval);
            }
        }, [isPreview, element.props.scriptContent]);
    
        if (!isPreview) {
            return (
                <div className="w-full p-4 bg-slate-800 text-green-400 font-mono text-xs rounded border border-slate-600 flex items-center gap-2" style={element.props.style}>
                    <Icons.Magic width={16} height={16} />
                    <span>GSAP Animation Script ({element.name})</span>
                    <span className="opacity-50 ml-auto text-[10px]">Visible in Editor Only</span>
                </div>
            )
        }
        
        // Render a hidden div to serve as an anchor for the ref
        return <div ref={ref} style={{ display: 'none' }} />;
    }
});
