
import { PageElement, SavedTemplate } from "../types";

export const exportHtml = (
    elements: PageElement[], 
    templates: SavedTemplate[], 
    title: string, 
    description: string,
    googleMapsApiKey?: string,
    recaptchaSiteKey?: string
): string => {
  // Safe JSON serialization to prevent script injection issues
  const elementsJson = JSON.stringify(elements).replace(/<\/script>/g, '<\\/script>');
  const templatesJson = JSON.stringify(templates).replace(/<\/script>/g, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <script>
      // Suppress Tailwind CDN warning
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com should not be used in production')) return;
        originalWarn.apply(console, args);
      };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
      /* Custom scrollbar */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      @keyframes slideInLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      .animate-slide-in-left { animation: slideInLeft 0.3s ease-out forwards; }
      @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
      .animate-slide-in-right { animation: slideInRight 0.3s ease-out forwards; }
    </style>
    
    ${recaptchaSiteKey ? `<script src="https://www.google.com/recaptcha/api.js" async defer></script>` : ''}
    
    <!-- React & ReactDOM (UMD) -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Babel for JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-white text-slate-900">
    <div id="root"></div>

    <script type="text/babel">
        // Data injected from builder
        const elements = ${elementsJson};
        const savedTemplates = ${templatesJson};
        const googleMapsApiKey = "${googleMapsApiKey || ''}";
        const recaptchaSiteKey = "${recaptchaSiteKey || ''}";

        // --- Icons Component (Embedded) ---
        const Icons = {
             ArrowLeft: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
             ArrowRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
             ChevronDown: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>,
             CaretRight: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 4 15 12 5 20 5 4" fill="currentColor"/></svg>,
             CaretLeft: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="19 20 9 12 19 4 19 20" fill="currentColor"/></svg>,
             Box: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
             Layout: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
             Smartphone: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>,
             Magic: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>,
             Square: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>,
             Map: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
             Menu: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
             X: (props) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
        };

        // --- Renderers ---
        const TestimonialSlider = ({ items, avatarSize, avatarShape, bubbleColor }) => {
            const [currentIndex, setCurrentIndex] = React.useState(0);
            React.useEffect(() => {
                if (items.length <= 1) return;
                const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % items.length), 5000);
                return () => clearInterval(interval);
            }, [items.length]);
            const currentItem = items[currentIndex];
            return (
                <div className="relative w-full max-w-2xl mx-auto p-4">
                     <div className="flex flex-col items-center text-center animate-fade-in transition-opacity duration-300">
                         <div className="p-8 rounded-2xl relative mb-6 shadow-sm" style={{ backgroundColor: bubbleColor }}>
                             <div className="text-4xl text-indigo-200 absolute top-4 left-4 font-serif leading-none">“</div>
                             <p className="text-lg text-gray-700 relative z-10">{currentItem.content}</p>
                         </div>
                         <div className="flex items-center gap-4">
                             {currentItem.avatarSrc && <img src={currentItem.avatarSrc} alt={currentItem.author} className={avatarSize + ' ' + avatarShape + ' object-cover border-2 border-white shadow-sm'} />}
                             <div className="text-left">
                                 <h4 className="font-bold text-gray-900">{currentItem.author}</h4>
                                 <p className="text-sm text-gray-500">{currentItem.role}</p>
                             </div>
                         </div>
                     </div>
                </div>
            );
        };

        const ElementRenderer = ({ element }) => {
            // State for interactive components
            const [isMenuOpen, setIsMenuOpen] = React.useState(false);

            switch (element.type) {
                case 'text': return <>{element.props.content}</>;
                case 'heading': { const Tag = 'h' + (element.props.level || 2); return <Tag>{element.props.content}</Tag>; }
                case 'image': return <img src={element.props.src} alt={element.props.alt} className="w-full h-auto object-cover" style={{ borderRadius: element.props.style?.borderRadius }} />;
                case 'button': {
                    const action = element.props.buttonAction || 'link';
                    if (action === 'link') return <a href={element.props.href} target={element.props.target} className={"px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition inline-block " + (element.props.className || '')} style={element.props.style}>{element.props.content}</a>;
                    return <button className={"px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition " + (element.props.className || '')} style={element.props.style}>{element.props.content}</button>;
                }
                case 'list': {
                    const ListTag = element.props.listType || 'ul';
                    return <ListTag className="pl-5" style={{ listStyleType: element.props.listStyleType || 'disc' }}>{element.props.items?.map((item, i) => <li key={i} style={{ marginBottom: i === element.props.items.length-1 ? 0 : element.props.itemSpacing }}>{item}</li>)}</ListTag>;
                }
                case 'input': return (
                    <div className={"w-full " + (element.props.fieldHidden ? 'hidden' : '')}>
                        {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                        <input type={element.props.inputType || 'text'} name={element.props.fieldName} placeholder={element.props.fieldPlaceholder} required={element.props.fieldRequired} defaultValue={element.props.fieldDefaultValue} className="w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white" />
                    </div>
                );
                case 'textarea': return (
                    <div className={"w-full " + (element.props.fieldHidden ? 'hidden' : '')}>
                         {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                         <textarea name={element.props.fieldName} placeholder={element.props.fieldPlaceholder} required={element.props.fieldRequired} defaultValue={element.props.fieldDefaultValue} rows={element.props.fieldRows || 4} className="w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white" />
                    </div>
                );
                case 'select': return (
                    <div className="w-full">
                        {element.props.fieldLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                        <select name={element.props.fieldName} required={element.props.fieldRequired} defaultValue={element.props.fieldDefaultValue || ""} multiple={element.props.fieldMultiple} className="w-full border-gray-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500 rounded-md bg-white">
                            {!element.props.fieldMultiple && <option value="" disabled>Select an option...</option>}
                            {element.props.fieldOptions?.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                );
                case 'radio': return (
                    <div className="flex items-center gap-2">
                        <input type="radio" id={element.id} name={element.props.fieldName} value={element.props.fieldValue} defaultChecked={element.props.checked} required={element.props.fieldRequired} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                        {element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                    </div>
                );
                case 'checkbox': return (
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id={element.id} name={element.props.fieldName} value={element.props.fieldValue} defaultChecked={element.props.checked} required={element.props.fieldRequired} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 rounded border-gray-300" />
                        {element.props.fieldLabel && <label htmlFor={element.id} className="text-sm text-gray-700">{element.props.fieldLabel} {element.props.fieldRequired && <span className="text-red-500">*</span>}</label>}
                    </div>
                );
                case 'form': return (
                     <form className="space-y-4 p-4 border border-gray-200 rounded bg-white w-full">
                        {element.props.formFields?.map((field, i) => (
                             <div key={i} className="flex flex-col gap-1">
                                 <label className="text-sm font-medium text-gray-700">{field.label}</label>
                                 <input type={field.type} className="w-full border-gray-300 shadow-sm p-2 border rounded" placeholder={field.placeholder} />
                             </div>
                        ))}
                        {element.props.formEnableRecaptcha && (
                            <div className="flex justify-end">
                                {recaptchaSiteKey ? (
                                    <div className="g-recaptcha" data-sitekey={recaptchaSiteKey}></div>
                                ) : (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-700">reCAPTCHA (Dev Mode)</div>
                                )}
                            </div>
                        )}
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 w-full sm:w-auto">{element.props.formSubmitButtonText}</button>
                     </form>
                );
                case 'navbar': {
                    const navOrientation = element.props.navOrientation || 'horizontal';
                    const isSticky = element.props.isSticky;
                    const isVertical = navOrientation === 'vertical';
                    const breakpoint = element.props.mobileMenuBreakpoint || 'md';
                    const mobileMenuType = element.props.mobileMenuType || 'dropdown';
                    const breakpointClass = breakpoint === 'none' ? 'flex' : 'hidden ' + breakpoint + ':flex';
                    const mobileToggleClass = breakpoint === 'none' ? 'hidden' : 'flex ' + breakpoint + ':hidden';
                    const activeColor = element.props.activeLinkColor;
                    
                    const navClasses = "flex w-full p-4 bg-white transition-all duration-300 relative " + (isVertical ? 'flex-col space-y-4 items-start h-full' : 'flex-row justify-between items-center') + " " + (isSticky ? 'sticky top-0 z-50 shadow-sm' : '');
                    const linkStyle = { color: element.props.linkColor || 'inherit' };
                    const activeStyle = activeColor ? { '--active-color': activeColor } : {};
                    const hoverClass = activeColor ? 'hover:text-[var(--active-color)]' : 'hover:opacity-80';

                    return (
                        <nav className={navClasses} style={activeStyle}>
                            <div className={"font-bold text-lg flex items-center justify-between w-full " + (isVertical ? '' : 'md:w-auto')}>
                                {element.props.logoType === 'image' && element.props.logoSrc ? (
                                    <img src={element.props.logoSrc} alt="Logo" className="object-contain" style={{ width: element.props.logoWidth || 'auto', maxHeight: '40px' }} />
                                ) : (
                                    <span>{element.props.logoText || 'Logo'}</span>
                                )}
                                {!isVertical && (
                                    <button 
                                        className={mobileToggleClass + " p-2 rounded hover:bg-gray-100"} 
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        style={{ color: element.props.hamburgerColor || 'inherit' }}
                                    >
                                        <Icons.Menu />
                                    </button>
                                )}
                            </div>
                            <ul className={breakpointClass + " gap-6 " + (isVertical ? 'flex-col w-full' : 'items-center')}>
                                {element.props.navLinks?.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.href} className={"transition-colors font-medium " + hoverClass} style={linkStyle}>{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                            {isMenuOpen && !isVertical && (
                                <>
                                    {mobileMenuType === 'dropdown' && (
                                        <div className={"absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 flex flex-col p-4 gap-4 animate-fade-in z-40 " + (breakpoint === 'none' ? 'hidden' : breakpoint + ':hidden')} style={{ backgroundColor: element.props.menuBackgroundColor || 'white' }}>
                                            {element.props.navLinks?.map((link, i) => (
                                                <a key={i} href={link.href} className={"text-lg font-medium transition-colors block p-2 rounded hover:bg-gray-50 " + hoverClass} style={linkStyle} onClick={() => setIsMenuOpen(false)}>
                                                    {link.label}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                    {(mobileMenuType === 'slide-left' || mobileMenuType === 'slide-right') && (
                                        <div className={"fixed inset-0 z-50 " + (breakpoint === 'none' ? 'hidden' : breakpoint + ':hidden')}>
                                            <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setIsMenuOpen(false)}></div>
                                            <div 
                                                className={"absolute top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col p-6 gap-4 " + (mobileMenuType === 'slide-left' ? 'left-0 animate-slide-in-left' : 'right-0 animate-slide-in-right')}
                                                style={{ backgroundColor: element.props.menuBackgroundColor || 'white' }}
                                            >
                                                <div className="flex justify-end">
                                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-700">
                                                        <Icons.X />
                                                    </button>
                                                </div>
                                                {element.props.navLinks?.map((link, i) => (
                                                    <a key={i} href={link.href} className={"text-lg font-medium transition-colors block p-2 rounded hover:bg-gray-50 " + hoverClass} style={linkStyle} onClick={() => setIsMenuOpen(false)}>
                                                        {link.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </nav>
                    );
                }
                case 'video': {
                    const videoSrc = element.props.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
                    const isYoutube = videoSrc.includes('youtube') || videoSrc.includes('youtu.be');
                    const embedUrl = isYoutube && !videoSrc.includes('embed') ? videoSrc.replace('watch?v=', 'embed/') : videoSrc;
                    return (
                        <div className="aspect-video w-full bg-black rounded overflow-hidden relative">
                            <iframe src={embedUrl} className="w-full h-full" title="Video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                        </div>
                    );
                }
                case 'map': {
                    const address = element.props.address || 'San Francisco';
                    const zoom = element.props.zoom || 13;
                    const mapType = element.props.mapType || 'roadmap';
                    
                    if (!googleMapsApiKey) {
                        return (
                            <div className="w-full h-64 bg-gray-100 rounded overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-300 text-gray-500 gap-2">
                                <Icons.Map width={32} height={32} className="opacity-50" />
                                <div className="font-bold text-sm">Development Mode: Map</div>
                                <div className="text-xs text-center px-4">Address: {address}<br/>Zoom: {zoom} | Type: {mapType}</div>
                            </div>
                        );
                    }
                    return (
                         <div className="w-full h-64 bg-gray-100 rounded overflow-hidden">
                            <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
                                src={"https://www.google.com/maps/embed/v1/place?key=" + googleMapsApiKey + "&q=" + encodeURIComponent(address) + "&zoom=" + zoom + "&maptype=" + mapType}
                            ></iframe>
                        </div>
                    );
                }
                case 'gallery': {
                    const layout = element.props.galleryLayout || 'grid';
                    const cols = element.props.galleryColumnCount || 3;
                    const gap = element.props.galleryGap || '1rem';
                    const images = element.props.galleryImages || [];
                    
                    if (layout === 'masonry') {
                         return (
                             <div className={'space-y-4 columns-' + cols} style={{ columnGap: gap }}>
                                 {images.map(img => <div key={img.id} className="break-inside-avoid mb-4"><img src={img.src} alt={img.alt} className="w-full rounded block" /></div>)}
                             </div>
                         );
                    }
                    if (layout === 'flex') {
                        return <div className="flex flex-wrap" style={{ gap }}>{images.map(img => <div key={img.id} className="flex-grow basis-64 min-w-[200px] relative"><img src={img.src} alt={img.alt} className="w-full h-full rounded object-cover" /></div>)}</div>;
                    }
                    return (
                        <div className={'grid grid-cols-' + cols} style={{ gap }}>
                            {images.map(img => <div key={img.id} className={'relative overflow-hidden rounded ' + (element.props.galleryAspectRatio || 'aspect-square')}><img src={img.src} alt={img.alt} className={"w-full h-full block object-" + (element.props.galleryObjectFit || 'cover')} /></div>)}
                        </div>
                    );
                }
                case 'testimonial': {
                     const { testimonialItems = [], testimonialLayout = 'grid', testimonialAvatarSize = 'md', testimonialAvatarShape = 'circle', testimonialBubbleColor = '#f9fafb' } = element.props;
                     const sizeClass = { 'sm': 'w-8 h-8', 'md': 'w-12 h-12', 'lg': 'w-16 h-16', 'xl': 'w-24 h-24' }[testimonialAvatarSize] || 'w-12 h-12';
                     const shapeClass = { 'circle': 'rounded-full', 'rounded': 'rounded-lg', 'square': 'rounded-none' }[testimonialAvatarShape] || 'rounded-full';
                     
                     if (testimonialLayout === 'slider') return <TestimonialSlider items={testimonialItems} avatarSize={sizeClass} avatarShape={shapeClass} bubbleColor={testimonialBubbleColor} />;
                     
                     return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                            {testimonialItems.map(item => (
                                <div key={item.id} className="flex flex-col h-full">
                                     <div className="p-6 rounded-2xl relative mb-4 flex-1 shadow-sm" style={{ backgroundColor: testimonialBubbleColor }}>
                                         <div className="absolute top-full left-8 -mt-2 border-8 border-transparent" style={{ borderTopColor: testimonialBubbleColor }}></div>
                                         <p className="text-gray-700 italic relative z-10">"{item.content}"</p>
                                     </div>
                                     <div className="flex items-center gap-3 px-2">
                                        {item.avatarSrc && <img src={item.avatarSrc} className={sizeClass + ' ' + shapeClass + ' object-cover bg-gray-200 border border-white shadow-sm'} />}
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{item.author}</h4>
                                            <p className="text-xs text-gray-500">{item.role}</p>
                                        </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                     );
                }
                case 'card': {
                     // Check if it's a legacy monolithic card or a new container card
                     if (!element.children || element.children.length === 0) {
                         const {
                             cardImageType = 'image',
                             cardIcon,
                             cardIconColor = '#4f46e5',
                             cardIconSize = 'w-12 h-12',
                             cardLayout = 'vertical',
                             cardTitle = 'Card Title',
                             cardText = 'Card description text goes here.',
                             cardButtonText = 'Read More',
                             src = 'https://via.placeholder.com/400x200',
                         } = element.props;
                         
                         const isHorizontal = cardLayout === 'horizontal';
                         const IconComp = cardIcon ? (Icons[cardIcon] || Icons.Box) : Icons.Box;

                         return (
                             <div className={'bg-white rounded-lg shadow-md overflow-hidden h-full flex transition-all hover:shadow-lg ' + (isHorizontal ? 'flex-row' : 'flex-col')}>
                                 <div className={(isHorizontal ? 'w-1/3 min-w-[120px]' : 'w-full h-48') + ' bg-gray-100 flex items-center justify-center overflow-hidden shrink-0'}>
                                     {cardImageType === 'image' ? <img src={src} className="w-full h-full object-cover" /> : <div className="text-indigo-600 text-4xl">★</div>}
                                 </div>
                                 <div className="p-5 flex-1 flex flex-col">
                                     <h3 className="text-xl font-bold mb-2">{cardTitle}</h3>
                                     <p className="text-gray-600 mb-4 flex-1">{cardText}</p>
                                     <span className="text-indigo-600 font-medium text-sm flex items-center gap-1">{cardButtonText} →</span>
                                 </div>
                             </div>
                         );
                     }
                     // If it has children, the parent container rendered it.
                     // But we might want to render the badge here if we are supporting badges on composed cards
                     if (element.props.cardBadge) {
                         return (
                            <div className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm pointer-events-none">
                                {element.props.cardBadge}
                            </div>
                         );
                     }
                     return null;
                }
                default: return null;
            }
        };

        const PageRenderer = ({ elements, savedTemplates }) => {
            const renderElement = (element) => {
                let renderedElement = element;
                if (element.type === 'global') {
                    const template = savedTemplates.find(t => t.id === element.props.templateId);
                    if (template) renderedElement = template.element;
                }
                const { type, children, id, props } = renderedElement;
                const Tag = type === 'section' ? 'section' : type === 'form' ? 'form' : 'div';
                const containerClasses = ['section', 'container', 'columns', 'navbar', 'slider', 'card', 'form'].includes(type) ? 'relative overflow-hidden' : 'relative';
                
                // Background
                const bgStyle = {};
                if(props.style?.backgroundColor) bgStyle.backgroundColor = props.style.backgroundColor;
                
                // Slider
                if(type === 'slider' && children) return <SliderRenderer key={id} element={renderedElement} renderChild={renderElement} className={containerClasses + ' ' + (props.className || '')} style={props.style} />;

                const classNameToApply = type === 'button' ? '' : (props.className || '');
                
                // Link Wrapper for Card
                const LinkWrapper = ({children}) => {
                     if (type === 'card' && props.cardLink) {
                         return <a href={props.cardLink} className="block h-full no-underline text-inherit">{children}</a>;
                     }
                     return <>{children}</>;
                };
                
                // Card Hover Effects in Export
                let extraClasses = '';
                if (type === 'card') {
                    const { cardHoverEffect } = props;
                    if (cardHoverEffect === 'lift') extraClasses = ' transition-all duration-300 hover:-translate-y-1 hover:shadow-xl';
                    else if (cardHoverEffect === 'zoom') extraClasses = ' transition-all duration-300 hover:scale-[1.02] hover:shadow-xl';
                    else if (cardHoverEffect === 'glow') extraClasses = ' transition-all duration-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]';
                    else if (cardHoverEffect === 'border') extraClasses = ' transition-all duration-300 hover:border-indigo-500 border border-transparent';
                }

                // Form Specifics
                const formProps = type === 'form' ? {
                    action: props.formActionUrl || undefined,
                    method: 'POST',
                } : {};

                return (
                    <Tag key={id} className={containerClasses + ' ' + classNameToApply + extraClasses} style={{...props.style, ...bgStyle}} {...formProps}>
                         {/* Background Image logic simplified for export */}
                         {(props.backgroundImage || props.style?.backgroundImage) && <div className="absolute inset-0 w-full h-full bg-cover bg-center -z-10 pointer-events-none" style={{ backgroundImage: props.style?.backgroundImage || props.backgroundImage }} />}
                         
                         <LinkWrapper>
                            {/* ReCAPTCHA for Forms */}
                            {type === 'form' && props.formEnableRecaptcha && recaptchaSiteKey && (
                                <div className="mb-4">
                                     <div className="g-recaptcha" data-sitekey={recaptchaSiteKey}></div>
                                </div>
                            )}

                            {children && children.length > 0 ? children.map(child => renderElement(child)) : <ElementRenderer element={renderedElement} />}
                         </LinkWrapper>
                    </Tag>
                );
            };
            return <>{elements.map(el => renderElement(el))}</>;
        };

        const SliderRenderer = ({ element, renderChild, className, style }) => {
            const [activeIndex, setActiveIndex] = React.useState(0);
            React.useEffect(() => {
                if (element.props.sliderAutoplay && element.children && element.children.length > 1) {
                    const interval = setInterval(() => setActiveIndex(prev => (prev + 1) % element.children.length), element.props.sliderInterval || 3000);
                    return () => clearInterval(interval);
                }
            }, []);

            const renderNavIcon = (direction) => {
                const type = element.props.sliderNavType || 'chevron';
                if (type === 'arrow') return direction === 'prev' ? <Icons.ArrowLeft /> : <Icons.ArrowRight />;
                if (type === 'caret') return direction === 'prev' ? <Icons.CaretLeft /> : <Icons.CaretRight />;
                return <Icons.ChevronDown className={direction === 'prev' ? 'rotate-90' : '-rotate-90'} />;
            };

            return (
                <div className={className} style={style}>
                    {element.children.map((child, index) => (
                        <div key={child.id} className={'w-full h-full top-0 left-0 transition-opacity duration-500 ease-in-out ' + (index === activeIndex ? 'relative opacity-100 z-10' : 'absolute opacity-0 -z-10 pointer-events-none')}>
                            {renderChild(child)}
                        </div>
                    ))}
                    {element.children.length > 1 && (
                        <>
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all" onClick={() => setActiveIndex(prev => (prev - 1 + element.children.length) % element.children.length)}>
                                {renderNavIcon('prev')}
                            </button>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-all" onClick={() => setActiveIndex(prev => (prev + 1) % element.children.length)}>
                                {renderNavIcon('next')}
                            </button>
                            {element.props.sliderShowPagination !== false && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {element.children.map((_, i) => (
                                        <button key={i} className={'w-2 h-2 rounded-full transition-all ' + (i === activeIndex ? 'bg-white scale-125' : 'bg-white/50')} onClick={() => setActiveIndex(i)} />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<PageRenderer elements={elements} savedTemplates={savedTemplates} />);
    </script>
</body>
</html>`;
}
