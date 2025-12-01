












import React, { useRef, useState } from 'react';
import { PageElement, FormField, SavedTemplate } from '../../types';
import { Icons } from '../Icons';
import { ColorPicker } from '../ui/ColorPicker';
import { FONT_FAMILIES, MENU_PRESETS } from '../../data/constants';
import { TAILWIND_CLASSES } from '../../data/tailwindClasses';

interface PropertiesPanelProps {
    selectedElement: PageElement | null;
    onUpdateId: (currentId: string, newId: string) => void;
    onUpdateName: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdateProps: (id: string, props: any) => void;
    onUpdateStyle: (id: string, key: string, value: string) => void;
    onFileUpload: (file: File) => Promise<string>;
    // Nav helpers
    onAddNavLink: (id: string) => void;
    onUpdateNavLink: (id: string, index: number, field: string, value: string) => void;
    onRemoveNavLink: (id: string, index: number) => void;
    // Slider helpers
    onAddSlide: (id: string) => void;
    onUpdateSlide: (id: string, index: number, field: string, value: string) => void;
    onRemoveSlide: (id: string, index: number) => void;
    // Template helpers
    onSaveTemplate: (id: string) => void;
    onDetach: (id: string) => void;
    onEditTemplate: (id: string) => void;
    savedTemplates: SavedTemplate[];
}

// Styled Constants
const inputClass = "w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white";
const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";
const fileInputClass = "block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 mt-2 cursor-pointer";
const sectionTitleClass = "text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 mt-2";

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    selectedElement,
    onUpdateId,
    onUpdateName,
    onDelete,
    onDuplicate,
    onUpdateProps,
    onUpdateStyle,
    onFileUpload,
    onAddNavLink,
    onUpdateNavLink,
    onRemoveNavLink,
    onAddSlide,
    onUpdateSlide,
    onRemoveSlide,
    onSaveTemplate,
    onDetach,
    onEditTemplate,
    savedTemplates
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [suggestionList, setSuggestionList] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeTestimonialIndex, setActiveTestimonialIndex] = useState<number | null>(null);

    // Resolve element for display if global
    let displayElement = selectedElement;
    let isGlobalInstance = false;
    let templateName = '';
    
    if (selectedElement?.type === 'global') {
        const t = savedTemplates.find(x => x.id === selectedElement.props.templateId);
        if (t) {
            displayElement = t.element;
            isGlobalInstance = true;
            templateName = t.name;
        }
    }

    // Form Field Helpers
    const handleAddFormField = () => {
        if (!selectedElement) return;
        const currentFields = selectedElement.props.formFields || [];
        const newField: FormField = {
            id: `field-${Date.now()}`,
            type: 'text',
            label: 'New Field',
            name: 'field_name',
            placeholder: '',
            required: false
        };
        onUpdateProps(selectedElement.id, { formFields: [...currentFields, newField] });
    };

    const handleUpdateFormField = (index: number, key: keyof FormField, value: any) => {
        if (!selectedElement) return;
        const currentFields = [...(selectedElement.props.formFields || [])];
        currentFields[index] = { ...currentFields[index], [key]: value };
        onUpdateProps(selectedElement.id, { formFields: currentFields });
    };

    const handleRemoveFormField = (index: number) => {
        if (!selectedElement) return;
        const currentFields = (selectedElement.props.formFields || []).filter((_, i) => i !== index);
        onUpdateProps(selectedElement.id, { formFields: currentFields });
    };

    const handleClassNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!selectedElement) return;
        const value = e.target.value;
        onUpdateProps(selectedElement.id, { className: value });
        
        // Autocomplete logic
        const cursorPosition = e.target.selectionStart;
        const textUpToCursor = value.substring(0, cursorPosition);
        const words = textUpToCursor.split(/\s+/);
        const currentWord = words[words.length - 1];
    
        if (currentWord && currentWord.length > 1) {
           const matches = TAILWIND_CLASSES.filter(cls => cls.startsWith(currentWord)).slice(0, 5);
           if (matches.length > 0) {
               setSuggestionList(matches);
               setShowSuggestions(true);
           } else {
               setShowSuggestions(false);
           }
        } else {
            setShowSuggestions(false);
        }
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow click event on suggestion to fire first
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const applySuggestion = (suggestion: string) => {
        if (!selectedElement) return;
        const currentClass = selectedElement.props.className || '';
        const cursorPosition = textareaRef.current?.selectionStart || currentClass.length;
        const textUpToCursor = currentClass.substring(0, cursorPosition);
        const textAfterCursor = currentClass.substring(cursorPosition);
        
        const words = textUpToCursor.split(/\s+/);
        const currentWord = words[words.length - 1];
        
        const newTextUpToCursor = textUpToCursor.substring(0, textUpToCursor.length - currentWord.length) + suggestion + ' ';
        
        const newValue = newTextUpToCursor + textAfterCursor;
        onUpdateProps(selectedElement.id, { className: newValue });
        setShowSuggestions(false);
        textareaRef.current?.focus();
    };
    
    // Testimonial Helpers
    const handleUpdateTestimonial = (index: number, field: string, value: any) => {
        if (!selectedElement) return;
        const items = [...(selectedElement.props.testimonialItems || [])];
        if (!items[index]) return;
        items[index] = { ...items[index], [field]: value };
        onUpdateProps(selectedElement.id, { testimonialItems: items });
    };

    return (
        <aside className="w-80 bg-white border-l border-gray-200 shrink-0 overflow-y-auto shadow-lg z-20 h-full transition-all duration-300">
            {!selectedElement || !displayElement ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center bg-gray-50/50">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Icons.Settings />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600">No Selection</h3>
                    <p className="mt-2 text-xs">Click on any element in the canvas to edit its style and content.</p>
                </div>
            ) : (
                <div className="p-0">
                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                        <div className="flex-1 mr-4">
                            {/* Name Editing */}
                            <input 
                                className="text-sm font-bold text-gray-800 bg-transparent border-b border-dashed border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none w-full mb-1 transition-all"
                                value={displayElement.name}
                                onChange={(e) => onUpdateName(selectedElement.id, e.target.value)}
                                placeholder="Element Name"
                            />
                            {/* ID Editing */}
                            <div className="flex items-center bg-gray-100 rounded px-2 py-0.5">
                                <span className="text-[10px] text-gray-400 font-mono mr-2">ID:</span>
                                <input 
                                    className="text-[10px] text-gray-600 font-mono bg-transparent border-none outline-none w-full"
                                    value={selectedElement.id}
                                    onChange={(e) => onUpdateId(selectedElement.id, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            <button 
                                onClick={() => onDuplicate(selectedElement.id)}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                title="Duplicate Element"
                            >
                                <Icons.Copy />
                            </button>
                            <button 
                                onClick={() => onDelete(selectedElement.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="Delete Element"
                            >
                                <Icons.Trash />
                            </button>
                        </div>
                    </div>
                    
                    {isGlobalInstance && (
                        <div className="bg-amber-50 border-b border-amber-100 p-4">
                            <div className="flex items-center gap-2 text-amber-800 mb-2">
                                <Icons.Globe />
                                <h3 className="text-xs font-bold uppercase">Global Component</h3>
                            </div>
                            <p className="text-[11px] text-amber-700 mb-3">
                                This is an instance of <strong>{templateName}</strong>. Content is locked.
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => onEditTemplate(selectedElement.props.templateId!)}
                                    className="flex-1 py-1.5 px-2 bg-white border border-amber-300 text-amber-800 text-xs rounded hover:bg-amber-100 transition"
                                >
                                    Edit Master
                                </button>
                                <button 
                                    onClick={() => onDetach(selectedElement.id)}
                                    className="flex-1 py-1.5 px-2 bg-transparent border border-amber-300 text-amber-800 text-xs rounded hover:bg-amber-100 transition"
                                >
                                    Detach
                                </button>
                            </div>
                        </div>
                    )}

                    {isGlobalInstance ? (
                         <div className="p-5 text-center text-gray-400 text-xs italic">
                             To edit properties, click "Edit Master" or "Detach".
                         </div>
                    ) : (
                    <div className="p-5 space-y-6">
                        
                        {/* Save as Template Button */}
                        <button 
                            onClick={() => onSaveTemplate(selectedElement.id)}
                            className="w-full py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-indigo-100 flex items-center justify-center gap-2 mb-4"
                        >
                            <Icons.Download width={14} height={14} /> Save as Template
                        </button>
                        
                        {/* NAVBAR CONFIGURATION */}
                        {displayElement.type === 'navbar' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Navigation Bar</h3>
                                
                                {/* Menu Source */}
                                <div>
                                    <label className={labelClass}>Menu Source (Preset)</label>
                                    <select 
                                        className={inputClass}
                                        onChange={(e) => {
                                            const preset = MENU_PRESETS[e.target.value as keyof typeof MENU_PRESETS];
                                            if (preset) {
                                                onUpdateProps(selectedElement.id, { navLinks: preset });
                                            }
                                        }}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select a predefined menu...</option>
                                        <option value="simple">Simple (Home, About, Contact)</option>
                                        <option value="business">Business (Solutions, Pricing...)</option>
                                        <option value="portfolio">Portfolio (Work, Services...)</option>
                                        <option value="app">App (Features, Docs...)</option>
                                    </select>
                                </div>

                                {/* Link Configuration */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Menu Items</label>
                                        <button onClick={() => onAddNavLink(selectedElement.id)} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold">+ Add</button>
                                    </div>
                                    <div className="space-y-2">
                                        {displayElement.props.navLinks?.map((link, i) => (
                                            <div key={i} className="flex gap-1 items-start bg-gray-50 p-2 rounded border border-gray-100 group relative">
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <input 
                                                        className="text-xs bg-white border border-gray-200 rounded px-1 py-1"
                                                        value={link.label}
                                                        placeholder="Label"
                                                        onChange={(e) => onUpdateNavLink(selectedElement.id, i, 'label', e.target.value)}
                                                    />
                                                    <input 
                                                        className="text-xs bg-white border border-gray-200 rounded px-1 py-1 text-gray-500"
                                                        value={link.href}
                                                        placeholder="#"
                                                        onChange={(e) => onUpdateNavLink(selectedElement.id, i, 'href', e.target.value)}
                                                    />
                                                </div>
                                                <button onClick={() => onRemoveNavLink(selectedElement.id, i)} className="p-1 text-gray-400 hover:text-red-500"><Icons.Trash width={12} height={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Logo Configuration */}
                                <div className="space-y-3 border-t border-gray-100 pt-3">
                                    <h4 className="text-[10px] font-bold text-gray-400">Logo Integration</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Type</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.logoType || 'text'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { logoType: e.target.value })}
                                            >
                                                <option value="text">Text</option>
                                                <option value="image">Image</option>
                                            </select>
                                        </div>
                                        <div>
                                            {displayElement.props.logoType === 'image' ? (
                                                <>
                                                 <label className={labelClass}>Width</label>
                                                 <input 
                                                    className={inputClass}
                                                    value={displayElement.props.logoWidth || 'auto'}
                                                    placeholder="e.g. 120px"
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { logoWidth: e.target.value })}
                                                 />
                                                </>
                                            ) : (
                                                <>
                                                <label className={labelClass}>Text</label>
                                                <input 
                                                    className={inputClass}
                                                    value={displayElement.props.logoText || ''}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { logoText: e.target.value })}
                                                />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {displayElement.props.logoType === 'image' && (
                                        <div>
                                            <label className={labelClass}>Image Source</label>
                                            <input 
                                                className={inputClass} 
                                                value={displayElement.props.logoSrc || ''} 
                                                onChange={(e) => onUpdateProps(selectedElement.id, { logoSrc: e.target.value })}
                                                placeholder="https://..."
                                            />
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className={fileInputClass}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const base64 = await onFileUpload(file);
                                                        onUpdateProps(selectedElement.id, { logoSrc: base64 });
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Layout & Style */}
                                <div className="space-y-3 border-t border-gray-100 pt-3">
                                    <h4 className="text-[10px] font-bold text-gray-400">Layout & Style</h4>
                                    
                                    <div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded">
                                        <label className="text-[10px] text-gray-600 font-bold">Sticky Header</label>
                                        <input 
                                            type="checkbox"
                                            className="accent-indigo-600 w-3 h-3"
                                            checked={displayElement.props.isSticky || false}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { isSticky: e.target.checked })}
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Hamburger Breakpoint</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.mobileMenuBreakpoint || 'md'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { mobileMenuBreakpoint: e.target.value })}
                                            >
                                                <option value="none">None (Always Visible)</option>
                                                <option value="sm">Mobile (sm)</option>
                                                <option value="md">Tablet (md)</option>
                                                <option value="lg">Laptop (lg)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Mobile Menu Style</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.mobileMenuType || 'dropdown'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { mobileMenuType: e.target.value })}
                                            >
                                                <option value="dropdown">Dropdown</option>
                                                <option value="slide-left">Side (Left)</option>
                                                <option value="slide-right">Side (Right)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Link Color</label>
                                            <ColorPicker 
                                                value={displayElement.props.linkColor}
                                                onChange={(val) => onUpdateProps(selectedElement.id, { linkColor: val })}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Active Color</label>
                                            <ColorPicker 
                                                value={displayElement.props.activeLinkColor}
                                                onChange={(val) => onUpdateProps(selectedElement.id, { activeLinkColor: val })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Hamburger Color</label>
                                            <ColorPicker 
                                                value={displayElement.props.hamburgerColor}
                                                onChange={(val) => onUpdateProps(selectedElement.id, { hamburgerColor: val })}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Menu Background</label>
                                            <ColorPicker 
                                                value={displayElement.props.menuBackgroundColor}
                                                onChange={(val) => onUpdateProps(selectedElement.id, { menuBackgroundColor: val })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MAP CONFIGURATION */}
                        {displayElement.type === 'map' && (
                             <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Map Settings</h3>
                                <div>
                                    <label className={labelClass}>Address / Location</label>
                                    <input 
                                        className={inputClass}
                                        value={displayElement.props.address || ''}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { address: e.target.value })}
                                        placeholder="City, Place, or Address"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Zoom Level</label>
                                        <input 
                                            type="number"
                                            min="1" max="21"
                                            className={inputClass}
                                            value={displayElement.props.zoom || 13}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { zoom: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Map Type</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.mapType || 'roadmap'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { mapType: e.target.value })}
                                        >
                                            <option value="roadmap">Roadmap</option>
                                            <option value="satellite">Satellite</option>
                                        </select>
                                    </div>
                                </div>
                             </div>
                        )}

                        {/* SLIDER CONFIGURATION */}
                        {displayElement.type === 'slider' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Slider Settings</h3>
                                
                                <div className="space-y-3">
                                    <div>
                                        <label className={labelClass}>Navigation Style</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.sliderNavType || 'chevron'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { sliderNavType: e.target.value })}
                                        >
                                            <option value="chevron">Chevron</option>
                                            <option value="arrow">Arrow</option>
                                            <option value="caret">Caret</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded">
                                        <label className="text-[10px] text-gray-600 font-bold">Show Pagination</label>
                                        <input 
                                            type="checkbox"
                                            className="accent-indigo-600 w-3 h-3"
                                            checked={displayElement.props.sliderShowPagination !== false}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { sliderShowPagination: e.target.checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded">
                                        <label className="text-[10px] text-gray-600 font-bold">Autoplay</label>
                                        <input 
                                            type="checkbox"
                                            className="accent-indigo-600 w-3 h-3"
                                            checked={displayElement.props.sliderAutoplay || false}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { sliderAutoplay: e.target.checked })}
                                        />
                                    </div>
                                     <div>
                                        <label className={labelClass}>Interval (ms)</label>
                                        <input 
                                            type="number"
                                            className={inputClass}
                                            value={displayElement.props.sliderInterval || 3000}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { sliderInterval: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                
                                <div className="pt-2 border-t border-gray-100">
                                     <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-bold text-gray-900">Slides</label>
                                        <button onClick={() => onAddSlide(selectedElement.id)} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold">+ Add</button>
                                     </div>
                                     <div className="space-y-2">
                                         {displayElement.children?.map((slide, i) => (
                                             <div key={slide.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200">
                                                 <input 
                                                     className="text-xs bg-transparent border-none outline-none flex-1 font-medium text-gray-700"
                                                     value={slide.name}
                                                     onChange={(e) => onUpdateName(slide.id, e.target.value)}
                                                 />
                                                 <button onClick={() => onRemoveSlide(selectedElement.id, i)} className="text-gray-400 hover:text-red-500 ml-2"><Icons.Trash width={12} height={12} /></button>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            </div>
                        )}

                        {/* FORM CONFIGURATION */}
                        {displayElement.type === 'form' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Form Builder</h3>
                                
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Fields</label>
                                    <button onClick={handleAddFormField} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold">+ Add</button>
                                </div>
                                
                                <div className="space-y-3">
                                    {displayElement.props.formFields?.map((field, i) => (
                                        <div key={i} className="bg-gray-50 p-2 rounded border border-gray-200 relative group">
                                            <button onClick={() => handleRemoveFormField(i)} className="absolute top-1 right-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Trash width={12} height={12} /></button>
                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <input 
                                                    className={inputClass} 
                                                    value={field.label}
                                                    onChange={(e) => handleUpdateFormField(i, 'label', e.target.value)}
                                                    placeholder="Label"
                                                />
                                                <select 
                                                    className={inputClass}
                                                    value={field.type}
                                                    onChange={(e) => handleUpdateFormField(i, 'type', e.target.value)}
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="email">Email</option>
                                                    <option value="textarea">Textarea</option>
                                                    <option value="number">Number</option>
                                                    <option value="checkbox">Checkbox</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    className={`${inputClass} flex-1`}
                                                    value={field.placeholder || ''}
                                                    onChange={(e) => handleUpdateFormField(i, 'placeholder', e.target.value)}
                                                    placeholder="Placeholder"
                                                />
                                                <label className="flex items-center gap-1 text-[10px] text-gray-500 cursor-pointer">
                                                    <input 
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => handleUpdateFormField(i, 'required', e.target.checked)}
                                                    /> Req
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="space-y-3 pt-2 border-t border-gray-100">
                                     <h4 className="text-[10px] font-bold text-gray-400">Submission Settings</h4>
                                     <div>
                                        <label className={labelClass}>Button Text</label>
                                        <input 
                                            className={inputClass}
                                            value={displayElement.props.formSubmitButtonText || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formSubmitButtonText: e.target.value })}
                                        />
                                     </div>
                                     <div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded">
                                        <label className="text-[10px] text-gray-600 font-bold">Enable reCAPTCHA</label>
                                        <input 
                                            type="checkbox"
                                            className="accent-indigo-600 w-3 h-3"
                                            checked={displayElement.props.formEnableRecaptcha || false}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formEnableRecaptcha: e.target.checked })}
                                        />
                                     </div>
                                     <div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded">
                                        <label className="text-[10px] text-gray-600 font-bold">Horizontal Layout</label>
                                        <input 
                                            type="checkbox"
                                            className="accent-indigo-600 w-3 h-3"
                                            checked={displayElement.props.formLabelLayout === 'horizontal'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formLabelLayout: e.target.checked ? 'horizontal' : 'top' })}
                                        />
                                     </div>
                                     <div>
                                        <label className={labelClass}>Success Message</label>
                                        <input 
                                            className={inputClass}
                                            value={displayElement.props.formSuccessMessage || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formSuccessMessage: e.target.value })}
                                        />
                                     </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Card Configuration */}
                        {displayElement.type === 'card' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Card Configuration</h3>
                                
                                <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700 mb-2">
                                    <p>Select the individual elements (Image, Title, Text, Button) inside the card to edit their content.</p>
                                </div>
                                
                                {/* Content */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Badge</label>
                                            <input 
                                                className={inputClass}
                                                value={displayElement.props.cardBadge || ''}
                                                placeholder="e.g. New"
                                                onChange={(e) => onUpdateProps(selectedElement.id, { cardBadge: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Link URL (Wrapper)</label>
                                        <input 
                                            className={inputClass}
                                            value={displayElement.props.cardLink || ''}
                                            placeholder="https://..."
                                            onChange={(e) => onUpdateProps(selectedElement.id, { cardLink: e.target.value })}
                                        />
                                    </div>
                                </div>
                                
                                {/* Styles & Effects */}
                                <div className="space-y-3 pt-2 border-t border-gray-100 mt-2">
                                     <h4 className="text-[10px] font-bold text-gray-400">Style & Effects</h4>
                                     <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Hover Effect</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.cardHoverEffect || 'lift'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { cardHoverEffect: e.target.value })}
                                            >
                                                <option value="none">None</option>
                                                <option value="lift">Lift Up</option>
                                                <option value="zoom">Zoom</option>
                                                <option value="glow">Glow</option>
                                                <option value="border">Border Color</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Background</label>
                                            <ColorPicker 
                                                value={displayElement.props.style?.backgroundColor}
                                                onChange={(val) => onUpdateStyle(selectedElement.id, 'backgroundColor', val)}
                                            />
                                        </div>
                                     </div>
                                </div>
                            </div>
                        )}

                        {/* Heading Props */}
                        {displayElement.type === 'heading' && (
                            <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Heading</h3>
                                <div>
                                    <label className={labelClass}>Level</label>
                                    <select 
                                        className={inputClass}
                                        value={displayElement.props.level || 2}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { level: Number(e.target.value) })}
                                    >
                                        <option value={1}>H1</option>
                                        <option value={2}>H2</option>
                                        <option value={3}>H3</option>
                                        <option value={4}>H4</option>
                                        <option value={5}>H5</option>
                                        <option value={6}>H6</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Text</label>
                                    <textarea 
                                        className={inputClass}
                                        value={displayElement.props.content || ''}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        
                        {/* Text/Button Props */}
                        {(displayElement.type === 'text' || displayElement.type === 'button') && (
                            <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Content</h3>
                                <div>
                                    <label className={labelClass}>Text Content</label>
                                    <textarea 
                                        className={inputClass}
                                        rows={3}
                                        value={displayElement.props.content || ''}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Image Props */}
                        {displayElement.type === 'image' && (
                            <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Media Settings</h3>
                                <div>
                                    <label className={labelClass}>Image URL</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        value={displayElement.props.src || ''}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { src: e.target.value })}
                                    />
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className={fileInputClass}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const base64 = await onFileUpload(file);
                                                onUpdateProps(selectedElement.id, { src: base64 });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Background Settings */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className={sectionTitleClass}>Design</h3>
                            
                            <div className="space-y-3">
                                <span className={labelClass}>Background</span>
                                
                                {['section', 'container', 'columns', 'navbar', 'card'].includes(displayElement.type) ? (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-[10px] text-gray-400 block mb-1">Color</label>
                                            <ColorPicker 
                                                value={displayElement.props.style?.backgroundColor}
                                                onChange={(val) => onUpdateStyle(selectedElement.id, 'backgroundColor', val)}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] text-gray-400 block mb-1">Image URL</label>
                                            <div className="flex items-center gap-2 mb-1">
                                                <input 
                                                    type="text" 
                                                    value={displayElement.props.style?.backgroundImage || ''}
                                                    onChange={(e) => onUpdateStyle(selectedElement.id, 'backgroundImage', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="https://... (or url('...'))"
                                                />
                                            </div>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                className={fileInputClass}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const base64 = await onFileUpload(file);
                                                        onUpdateStyle(selectedElement.id, 'backgroundImage', `url('${base64}')`);
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between mt-2 border border-gray-100 bg-gray-50 p-2 rounded">
                                            <label className="text-[10px] text-gray-400">Parallax Effect</label>
                                            <input 
                                                type="checkbox"
                                                className="accent-indigo-600 w-3 h-3"
                                                checked={displayElement.props.parallax || false}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { parallax: e.target.checked })}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-[10px] text-gray-400 block mb-1">Color</label>
                                        <ColorPicker 
                                            value={displayElement.props.style?.backgroundColor}
                                            onChange={(val) => onUpdateStyle(selectedElement.id, 'backgroundColor', val)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Text Color */}
                            <div>
                                <span className={labelClass}>Text Color</span>
                                <ColorPicker 
                                    value={displayElement.props.style?.color}
                                    onChange={(val) => onUpdateStyle(selectedElement.id, 'color', val)}
                                />
                            </div>

                            {/* Spacing */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className={labelClass}>Padding</span>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        value={displayElement.props.style?.padding || ''}
                                        onChange={(e) => onUpdateStyle(selectedElement.id, 'padding', e.target.value)}
                                        placeholder="1rem"
                                    />
                                </div>
                                <div>
                                    <span className={labelClass}>Margin</span>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        value={displayElement.props.style?.margin || ''}
                                        onChange={(e) => onUpdateStyle(selectedElement.id, 'margin', e.target.value)}
                                        placeholder="1rem"
                                    />
                                </div>
                            </div>

                            {/* Typography */}
                            {(displayElement.type === 'text' || displayElement.type === 'button' || displayElement.type === 'heading' || displayElement.type === 'list') && (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <span className={labelClass}>Size</span>
                                            <input 
                                                type="text" 
                                                className={inputClass}
                                                value={displayElement.props.style?.fontSize || ''}
                                                onChange={(e) => onUpdateStyle(selectedElement.id, 'fontSize', e.target.value)}
                                                placeholder="16px"
                                            />
                                        </div>
                                        <div>
                                            <span className={labelClass}>Align</span>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.style?.textAlign || 'left'}
                                                onChange={(e) => onUpdateStyle(selectedElement.id, 'textAlign', e.target.value)}
                                            >
                                                <option value="left">Left</option>
                                                <option value="center">Center</option>
                                                <option value="right">Right</option>
                                                <option value="justify">Justify</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <span className={labelClass}>Font Family</span>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.style?.fontFamily || 'Inherit'}
                                            onChange={(e) => onUpdateStyle(selectedElement.id, 'fontFamily', e.target.value)}
                                        >
                                            {FONT_FAMILIES.map(font => (
                                                <option key={font} value={font}>{font}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                            
                            {/* Advanced */}
                            <div className="pt-2 border-t border-gray-100 mt-2 relative">
                                <span className={labelClass}>Custom CSS Classes (Tailwind)</span>
                                <textarea 
                                    ref={textareaRef}
                                    className={inputClass}
                                    rows={3}
                                    value={displayElement.props.className || ''}
                                    onChange={handleClassNameChange}
                                    onBlur={handleBlur}
                                    placeholder="e.g. shadow-lg hover:scale-105"
                                />
                                {showSuggestions && suggestionList.length > 0 && (
                                    <div className="absolute left-0 bottom-full mb-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-40 overflow-y-auto">
                                        {suggestionList.map(suggestion => (
                                            <div 
                                                key={suggestion}
                                                className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                                                onClick={() => applySuggestion(suggestion)}
                                            >
                                                {suggestion}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            )}
        </aside>
    );
};