

import React, { useRef, useState } from 'react';
import { PageElement, FormField, SavedTemplate } from '../../types';
import { Icons } from '../Icons';
import { ColorPicker } from '../ui/ColorPicker';
import { FONT_FAMILIES } from '../../data/constants';
import { TAILWIND_CLASSES } from '../../data/tailwindClasses';

interface PropertiesPanelProps {
    selectedElement: PageElement | null;
    onUpdateId: (currentId: string, newId: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdateProps: (id: string, props: any) => void;
    onUpdateStyle: (id: string, key: string, value: string) => void;
    // Helper callbacks
    onAiText: () => void;
    onAiImage: () => void;
    onAiBg: (prop: 'backgroundImage' | 'backgroundVideo') => void;
    isAiLoading: boolean;
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
    onDelete,
    onDuplicate,
    onUpdateProps,
    onUpdateStyle,
    onAiText,
    onAiImage,
    onAiBg,
    isAiLoading,
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
                        <div>
                            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                {displayElement.name}
                            </h2>
                            {/* ID Editing */}
                            <div className="flex items-center mt-1 bg-gray-100 rounded px-2 py-0.5">
                                <span className="text-[10px] text-gray-400 font-mono mr-2">ID:</span>
                                <input 
                                    className="text-[10px] text-gray-600 font-mono bg-transparent border-none outline-none w-full"
                                    value={selectedElement.id}
                                    onChange={(e) => onUpdateId(selectedElement.id, e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
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

                        {(displayElement.type === 'text' || displayElement.type === 'button' || displayElement.type === 'heading') && (
                            <div className="bg-violet-50 p-3 rounded-lg border border-violet-100">
                                <h4 className="text-[10px] font-bold text-violet-700 uppercase tracking-wider mb-2 flex items-center gap-1"><Icons.Magic /> AI Assistant</h4>
                                <button 
                                    onClick={onAiText}
                                    disabled={isAiLoading}
                                    className="w-full py-1.5 bg-white text-violet-600 text-xs font-medium rounded border border-violet-200 hover:bg-violet-600 hover:text-white transition-colors"
                                >
                                    {isAiLoading ? 'Thinking...' : 'Rewrite & Improve Text'}
                                </button>
                            </div>
                        )}
                        
                        {/* Card Configuration */}
                        {displayElement.type === 'card' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Card Configuration</h3>
                                
                                {/* Layout & Media Type */}
                                <div className="grid grid-cols-2 gap-3">
                                     <div>
                                        <label className={labelClass}>Layout</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.cardLayout || 'vertical'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { cardLayout: e.target.value })}
                                        >
                                            <option value="vertical">Vertical</option>
                                            <option value="horizontal">Horizontal</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Media</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.cardImageType || 'image'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { cardImageType: e.target.value })}
                                        >
                                            <option value="image">Image</option>
                                            <option value="icon">Icon</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Icon Picker */}
                                {displayElement.props.cardImageType === 'icon' && (
                                    <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-100">
                                        <div>
                                            <label className={labelClass}>Icon</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.cardIcon || 'Box'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { cardIcon: e.target.value })}
                                            >
                                                {Object.keys(Icons).map(iconName => (
                                                    <option key={iconName} value={iconName}>{iconName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelClass}>Color</label>
                                                <ColorPicker 
                                                    value={displayElement.props.cardIconColor || '#4f46e5'}
                                                    onChange={(val) => onUpdateProps(selectedElement.id, { cardIconColor: val })}
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Size Class</label>
                                                <input 
                                                    className={inputClass}
                                                    value={displayElement.props.cardIconSize || 'w-12 h-12'}
                                                    placeholder="w-12 h-12"
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { cardIconSize: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Image Picker */}
                                {(displayElement.props.cardImageType === 'image' || !displayElement.props.cardImageType) && (
                                    <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-100">
                                        <label className={labelClass}>Card Image</label>
                                        <input 
                                            type="text"
                                            className={inputClass}
                                            value={displayElement.props.src || ''}
                                            placeholder="Image URL"
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
                                        <button 
                                            onClick={onAiImage}
                                            disabled={isAiLoading}
                                            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-white border border-violet-200 text-violet-600 text-xs font-medium rounded hover:bg-violet-50 transition-colors"
                                        >
                                            <Icons.Magic width={12} height={12} /> Generate Image
                                        </button>
                                    </div>
                                )}
                                
                                {/* Content */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-bold text-gray-400">Content</h4>
                                    <div>
                                        <label className={labelClass}>Title</label>
                                        <input 
                                            className={inputClass}
                                            value={displayElement.props.cardTitle || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { cardTitle: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Description</label>
                                        <textarea 
                                            className={inputClass}
                                            rows={3}
                                            value={displayElement.props.cardText || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { cardText: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Button Text</label>
                                            <input 
                                                className={inputClass}
                                                value={displayElement.props.cardButtonText || ''}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { cardButtonText: e.target.value })}
                                            />
                                        </div>
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
                                        <label className={labelClass}>Link URL</label>
                                        <input 
                                            className={inputClass}
                                            value={displayElement.props.cardLink || ''}
                                            placeholder="https://..."
                                            onChange={(e) => onUpdateProps(selectedElement.id, { cardLink: e.target.value })}
                                        />
                                    </div>
                                </div>
                                
                                {/* Styles & Effects */}
                                <div className="space-y-3 pt-2 border-t border-gray-100">
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
                        
                        {/* Testimonial Props */}
                        {displayElement.type === 'testimonial' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Testimonial Settings</h3>
                                
                                {activeTestimonialIndex !== null ? (
                                    // Item Editor Mode
                                    <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                             <button 
                                                onClick={() => setActiveTestimonialIndex(null)}
                                                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                                             >
                                                <div className="rotate-90"><Icons.ChevronDown width={10} height={10} /></div> Back to List
                                             </button>
                                             <span className="text-[10px] font-bold text-gray-400">ITEM {activeTestimonialIndex + 1}</span>
                                        </div>
                                        
                                        <div>
                                            <label className={labelClass}>Quote</label>
                                            <textarea 
                                                className={inputClass}
                                                rows={3}
                                                value={displayElement.props.testimonialItems?.[activeTestimonialIndex]?.content || ''}
                                                onChange={(e) => handleUpdateTestimonial(activeTestimonialIndex, 'content', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Author Name</label>
                                            <input 
                                                className={inputClass}
                                                value={displayElement.props.testimonialItems?.[activeTestimonialIndex]?.author || ''}
                                                onChange={(e) => handleUpdateTestimonial(activeTestimonialIndex, 'author', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Role / Title</label>
                                            <input 
                                                className={inputClass}
                                                value={displayElement.props.testimonialItems?.[activeTestimonialIndex]?.role || ''}
                                                onChange={(e) => handleUpdateTestimonial(activeTestimonialIndex, 'role', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Rating (0-5)</label>
                                            <input 
                                                type="number"
                                                min="0" max="5"
                                                className={inputClass}
                                                value={displayElement.props.testimonialItems?.[activeTestimonialIndex]?.rating || 5}
                                                onChange={(e) => handleUpdateTestimonial(activeTestimonialIndex, 'rating', Number(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Avatar Image</label>
                                            <div className="flex gap-2">
                                                {displayElement.props.testimonialItems?.[activeTestimonialIndex]?.avatarSrc && (
                                                    <img 
                                                        src={displayElement.props.testimonialItems?.[activeTestimonialIndex]?.avatarSrc} 
                                                        className="w-8 h-8 rounded object-cover border border-gray-200"
                                                    />
                                                )}
                                                <input 
                                                    type="file"
                                                    accept="image/*"
                                                    className={fileInputClass}
                                                    onChange={async (e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const base64 = await onFileUpload(file);
                                                            handleUpdateTestimonial(activeTestimonialIndex, 'avatarSrc', base64);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <input 
                                                className={`${inputClass} mt-2 text-xs`}
                                                placeholder="Or image URL..."
                                                value={displayElement.props.testimonialItems?.[activeTestimonialIndex]?.avatarSrc || ''}
                                                onChange={(e) => handleUpdateTestimonial(activeTestimonialIndex, 'avatarSrc', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    // List Mode & Config
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className={labelClass}>Layout</label>
                                                <select 
                                                    className={inputClass}
                                                    value={displayElement.props.testimonialLayout || 'grid'}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { testimonialLayout: e.target.value })}
                                                >
                                                    <option value="grid">Grid</option>
                                                    <option value="slider">Single Slider</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className={labelClass}>Avatar Shape</label>
                                                <select 
                                                    className={inputClass}
                                                    value={displayElement.props.testimonialAvatarShape || 'circle'}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { testimonialAvatarShape: e.target.value })}
                                                >
                                                    <option value="circle">Circle</option>
                                                    <option value="rounded">Rounded</option>
                                                    <option value="square">Square</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                             <div>
                                                <label className={labelClass}>Avatar Size</label>
                                                <select 
                                                    className={inputClass}
                                                    value={displayElement.props.testimonialAvatarSize || 'md'}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { testimonialAvatarSize: e.target.value })}
                                                >
                                                    <option value="sm">Small</option>
                                                    <option value="md">Medium</option>
                                                    <option value="lg">Large</option>
                                                    <option value="xl">Extra Large</option>
                                                </select>
                                            </div>
                                             <div>
                                                <label className={labelClass}>Bubble Color</label>
                                                <ColorPicker 
                                                    value={displayElement.props.testimonialBubbleColor}
                                                    onChange={(val) => onUpdateProps(selectedElement.id, { testimonialBubbleColor: val })}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between items-center">
                                                <label className={labelClass}>Items List</label>
                                            </div>
                                            <div className="space-y-2">
                                                {(displayElement.props.testimonialItems || []).map((item, i) => (
                                                    <div 
                                                        key={item.id} 
                                                        className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:border-indigo-300 cursor-pointer group"
                                                        onClick={() => setActiveTestimonialIndex(i)}
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            {item.avatarSrc ? (
                                                                <img src={item.avatarSrc} className="w-6 h-6 rounded-full object-cover bg-gray-100" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
                                                                    {item.author.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div className="flex flex-col truncate">
                                                                <span className="text-xs font-medium text-gray-700 truncate">{item.author}</span>
                                                                <span className="text-[9px] text-gray-400 truncate">{item.role}</span>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const newItems = (displayElement.props.testimonialItems || []).filter((_, idx) => idx !== i);
                                                                onUpdateProps(selectedElement.id, { testimonialItems: newItems });
                                                            }}
                                                            className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Icons.Trash width={12} height={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button 
                                                    onClick={() => {
                                                        const newItems = [...(displayElement.props.testimonialItems || [])];
                                                        newItems.push({
                                                            id: `t-${Date.now()}`,
                                                            content: "New testimonial quote here.",
                                                            author: "New Author",
                                                            role: "Role",
                                                            rating: 5,
                                                            avatarSrc: ""
                                                        });
                                                        onUpdateProps(selectedElement.id, { testimonialItems: newItems });
                                                        setActiveTestimonialIndex(newItems.length - 1);
                                                    }}
                                                    className="w-full py-2 text-xs bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded flex items-center justify-center gap-1 transition-colors mt-2"
                                                >
                                                    <Icons.Plus /> Add Testimonial
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
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
                        
                        {/* Gallery Props */}
                        {displayElement.type === 'gallery' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Gallery Configuration</h3>
                                
                                {/* Layout Settings */}
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Layout</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.galleryLayout || 'grid'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { galleryLayout: e.target.value })}
                                            >
                                                <option value="grid">Grid</option>
                                                <option value="masonry">Masonry</option>
                                                <option value="flex">Justified (Flex)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Columns</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.galleryColumnCount || 3}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { galleryColumnCount: Number(e.target.value) })}
                                                disabled={displayElement.props.galleryLayout === 'flex'}
                                            >
                                                {[1,2,3,4,5,6].map(n => (
                                                    <option key={n} value={n}>{n} Col</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className={labelClass}>Gap</label>
                                            <input 
                                                type="text"
                                                className={inputClass}
                                                value={displayElement.props.galleryGap || '1rem'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { galleryGap: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Aspect Ratio</label>
                                            <select 
                                                className={inputClass}
                                                value={displayElement.props.galleryAspectRatio || 'aspect-square'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { galleryAspectRatio: e.target.value })}
                                                disabled={displayElement.props.galleryLayout === 'masonry'}
                                            >
                                                <option value="aspect-square">Square (1:1)</option>
                                                <option value="aspect-video">Video (16:9)</option>
                                                <option value="aspect-[4/3]">4:3</option>
                                                <option value="aspect-[3/4]">3:4</option>
                                                <option value="auto">Auto</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                         <label className={labelClass}>Object Fit</label>
                                         <select 
                                            className={inputClass}
                                            value={displayElement.props.galleryObjectFit || 'cover'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { galleryObjectFit: e.target.value })}
                                        >
                                            <option value="cover">Cover (Crop)</option>
                                            <option value="contain">Contain</option>
                                            <option value="fill">Fill</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Image Manager */}
                                <div className="space-y-3 pt-2">
                                    <div className="flex justify-between items-center">
                                        <label className={labelClass}>Images</label>
                                        <span className="text-[10px] text-gray-400">{(displayElement.props.galleryImages || []).length} items</span>
                                    </div>
                                    
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {(displayElement.props.galleryImages || []).map((img, i, arr) => (
                                            <div key={img.id} className="flex gap-2 items-center bg-gray-50 border border-gray-200 p-1.5 rounded group">
                                                <img src={img.src} alt="" className="w-8 h-8 object-cover rounded bg-gray-200" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] truncate text-gray-500">{img.alt || 'No caption'}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    <button 
                                                        onClick={() => {
                                                            if (i === 0) return;
                                                            const newImages = [...arr];
                                                            [newImages[i-1], newImages[i]] = [newImages[i], newImages[i-1]];
                                                            onUpdateProps(selectedElement.id, { galleryImages: newImages });
                                                        }}
                                                        disabled={i === 0}
                                                        className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                                                    >
                                                        <div className="rotate-180"><Icons.ChevronDown width={10} height={10} /></div>
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            if (i === arr.length - 1) return;
                                                            const newImages = [...arr];
                                                            [newImages[i+1], newImages[i]] = [newImages[i], newImages[i+1]];
                                                            onUpdateProps(selectedElement.id, { galleryImages: newImages });
                                                        }}
                                                        disabled={i === arr.length - 1}
                                                        className="p-1 text-gray-400 hover:text-indigo-600 disabled:opacity-30"
                                                    >
                                                        <Icons.ChevronDown width={10} height={10} />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            const newImages = arr.filter((_, idx) => idx !== i);
                                                            onUpdateProps(selectedElement.id, { galleryImages: newImages });
                                                        }}
                                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                    >
                                                        <Icons.Trash width={10} height={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="border border-dashed border-gray-300 rounded p-4 text-center hover:bg-gray-50 transition-colors relative">
                                        <input 
                                            type="file" 
                                            multiple
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={async (e) => {
                                                if (e.target.files) {
                                                    const newImages = [];
                                                    // Process files sequentially or parallel
                                                    for (let i = 0; i < e.target.files.length; i++) {
                                                        const file = e.target.files[i];
                                                        const src = await onFileUpload(file);
                                                        newImages.push({
                                                            id: `img-${Date.now()}-${i}`,
                                                            src,
                                                            alt: file.name
                                                        });
                                                    }
                                                    const currentImages = displayElement.props.galleryImages || [];
                                                    onUpdateProps(selectedElement.id, { galleryImages: [...currentImages, ...newImages] });
                                                }
                                            }}
                                        />
                                        <div className="text-xs text-gray-500">
                                            <Icons.Image className="mx-auto mb-1 opacity-50" />
                                            <span>Click to Upload Images</span>
                                            <p className="text-[10px] text-gray-400 mt-1">Supports multi-select</p>
                                        </div>
                                    </div>
                                    
                                    {/* URL Add */}
                                    <div className="flex gap-2">
                                        <input 
                                            placeholder="Add image via URL..."
                                            className={inputClass}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    const val = e.currentTarget.value;
                                                    if(val) {
                                                        const newImg = { id: `img-${Date.now()}`, src: val, alt: 'Image' };
                                                        const current = displayElement.props.galleryImages || [];
                                                        onUpdateProps(selectedElement.id, { galleryImages: [...current, newImg] });
                                                        e.currentTarget.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                        )}

                        {/* Button specific: Actions */}
                        {displayElement.type === 'button' && (
                            <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Button Actions</h3>
                                <div>
                                    <label className={labelClass}>Action</label>
                                    <select
                                        className={inputClass}
                                        value={displayElement.props.buttonAction || 'link'}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { buttonAction: e.target.value })}
                                    >
                                        <option value="link">Link / Anchor</option>
                                        <option value="submit">Submit Form</option>
                                        <option value="popup">Open Popup</option>
                                    </select>
                                </div>

                                {(displayElement.props.buttonAction === 'link' || !displayElement.props.buttonAction) && (
                                    <>
                                        <div>
                                            <label className={labelClass}>URL / Anchor</label>
                                            <input 
                                                type="text"
                                                className={inputClass}
                                                value={displayElement.props.href || ''}
                                                placeholder="https://... or #section"
                                                onChange={(e) => onUpdateProps(selectedElement.id, { href: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Target</label>
                                            <select
                                                className={inputClass}
                                                value={displayElement.props.target || '_self'}
                                                onChange={(e) => onUpdateProps(selectedElement.id, { target: e.target.value })}
                                            >
                                                <option value="_self">Same Tab</option>
                                                <option value="_blank">New Tab</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {/* Slider Props */}
                        {displayElement.type === 'slider' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Slider Config</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border border-gray-200 rounded-md p-2 bg-white">
                                        <label className="text-xs font-semibold text-gray-500 uppercase m-0">Autoplay</label>
                                        <input 
                                            type="checkbox" 
                                            className="accent-indigo-600 w-4 h-4"
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
                                </div>
                                
                                <div className="space-y-3 pt-2">
                                    <label className={labelClass}>Slides</label>
                                    <div className="space-y-2">
                                        {displayElement.children?.map((child, i) => (
                                            <div 
                                                key={child.id} 
                                                className={`border rounded p-2 flex items-center justify-between group cursor-pointer ${i === (displayElement.props.sliderActiveIndex || 0) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}`}
                                                onClick={() => onUpdateProps(selectedElement.id, { sliderActiveIndex: i })}
                                            >
                                                <span className="text-xs font-medium text-gray-700">Slide {i + 1}</span>
                                                <div className="flex items-center gap-1">
                                                     <button 
                                                        onClick={(e) => { e.stopPropagation(); onRemoveSlide(selectedElement.id, i); }}
                                                        className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                                                        title="Delete Slide"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => onAddSlide(selectedElement.id)}
                                            className="w-full py-2 text-xs bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Icons.Plus /> Add New Slide
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 italic">
                                        Click on a slide above or use the arrows on the canvas to switch slides. Then select the slide container directly to edit its background or drag elements into it.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form Props */}
                        {displayElement.type === 'form' && (
                            <>
                                {/* Fields Manager */}
                                <div className="space-y-3">
                                    <h3 className={sectionTitleClass}>Form Fields</h3>
                                    <div className="space-y-3">
                                        {(displayElement.props.formFields || []).map((field, i) => (
                                            <div key={i} className="bg-gray-50 border border-gray-200 rounded p-2 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-600">Field {i + 1}</span>
                                                    <button 
                                                        onClick={() => handleRemoveFormField(i)}
                                                        className="text-red-400 hover:text-red-600"
                                                    >
                                                        <Icons.Trash width={12} height={12} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input 
                                                        className={inputClass} 
                                                        placeholder="Label"
                                                        value={field.label} 
                                                        onChange={(e) => handleUpdateFormField(i, 'label', e.target.value)}
                                                    />
                                                    <select 
                                                        className={inputClass}
                                                        value={field.type}
                                                        onChange={(e) => handleUpdateFormField(i, 'type', e.target.value)}
                                                    >
                                                        <option value="text">Text</option>
                                                        <option value="email">Email</option>
                                                        <option value="textarea">Text Area</option>
                                                        <option value="checkbox">Checkbox</option>
                                                        <option value="number">Number</option>
                                                        <option value="tel">Phone</option>
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <input 
                                                        className={inputClass} 
                                                        placeholder="Placeholder..."
                                                        value={field.placeholder || ''} 
                                                        onChange={(e) => handleUpdateFormField(i, 'placeholder', e.target.value)}
                                                    />
                                                    <div className="flex items-center gap-2 pl-2">
                                                        <input 
                                                            type="checkbox"
                                                            checked={field.required}
                                                            onChange={(e) => handleUpdateFormField(i, 'required', e.target.checked)}
                                                            className="accent-indigo-600"
                                                        />
                                                        <span className="text-xs text-gray-500">Required</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={handleAddFormField}
                                            className="w-full py-2 text-xs bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Icons.Plus /> Add Field
                                        </button>
                                    </div>
                                </div>

                                {/* Submission Settings */}
                                <div className="space-y-3">
                                    <h3 className={sectionTitleClass}>Submission</h3>
                                    <div>
                                        <label className={labelClass}>Submit URL (Action)</label>
                                        <input 
                                            className={inputClass}
                                            placeholder="https://api.example.com/submit"
                                            value={displayElement.props.formSubmitUrl || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formSubmitUrl: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Email To</label>
                                        <input 
                                            className={inputClass}
                                            placeholder="you@company.com"
                                            value={displayElement.props.formEmailTo || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formEmailTo: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Success Message</label>
                                        <input 
                                            className={inputClass}
                                            placeholder="Thank you for subscribing!"
                                            value={displayElement.props.formSuccessMessage || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formSuccessMessage: e.target.value })}
                                        />
                                    </div>
                                     <div className="flex items-center justify-between border border-gray-200 rounded-md p-2 bg-white mt-2">
                                        <label className="text-xs font-semibold text-gray-500 uppercase m-0">Spam Protection (reCAPTCHA)</label>
                                        <input 
                                            type="checkbox" 
                                            className="accent-indigo-600 w-4 h-4"
                                            checked={displayElement.props.formEnableRecaptcha || false}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formEnableRecaptcha: e.target.checked })}
                                        />
                                    </div>
                                </div>

                                {/* Form Styling */}
                                <div className="space-y-3">
                                    <h3 className={sectionTitleClass}>Form Style</h3>
                                    <div>
                                        <label className={labelClass}>Label Layout</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.formLabelLayout || 'top'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formLabelLayout: e.target.value })}
                                        >
                                            <option value="top">Top Aligned</option>
                                            <option value="horizontal">Horizontal (Left)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Input Border Radius</label>
                                        <input 
                                            className={inputClass}
                                            placeholder="0.375rem"
                                            value={displayElement.props.formInputBorderRadius || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formInputBorderRadius: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Input Background</label>
                                        <ColorPicker 
                                            value={displayElement.props.formInputBackgroundColor}
                                            onChange={(val) => onUpdateProps(selectedElement.id, { formInputBackgroundColor: val })}
                                        />
                                    </div>
                                    
                                    <div className="pt-2 border-t border-gray-100 mt-2">
                                        <label className={labelClass}>Submit Button Text</label>
                                        <input 
                                            className={inputClass}
                                            value={displayElement.props.formSubmitButtonText || 'Submit'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { formSubmitButtonText: e.target.value })}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className={labelClass}>Button Color</label>
                                        <ColorPicker 
                                            value={displayElement.props.formButtonBackgroundColor}
                                            onChange={(val) => onUpdateProps(selectedElement.id, { formButtonBackgroundColor: val })}
                                        />
                                    </div>
                                    <div className="mt-2">
                                        <label className={labelClass}>Button Text Color</label>
                                        <ColorPicker 
                                            value={displayElement.props.formButtonTextColor}
                                            onChange={(val) => onUpdateProps(selectedElement.id, { formButtonTextColor: val })}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Navbar Props */}
                        {displayElement.type === 'navbar' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>Navigation</h3>
                                {/* Layout */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border border-gray-200 rounded-md p-2 bg-white">
                                        <label className="text-xs font-semibold text-gray-500 uppercase m-0">Sticky Header</label>
                                        <input 
                                            type="checkbox" 
                                            className="accent-indigo-600 w-4 h-4"
                                            checked={displayElement.props.isSticky || false}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { isSticky: e.target.checked })}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Orientation</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.navOrientation || 'horizontal'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { navOrientation: e.target.value })}
                                        >
                                            <option value="horizontal">Horizontal</option>
                                            <option value="vertical">Vertical</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {/* Logo */}
                                <div className="space-y-3">
                                    <label className={labelClass}>Logo Type</label>
                                    <select 
                                        className={inputClass}
                                        value={displayElement.props.logoType || 'text'}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { logoType: e.target.value })}
                                    >
                                        <option value="text">Text</option>
                                        <option value="image">Image</option>
                                    </select>
                                    {displayElement.props.logoType === 'image' ? (
                                        <div className="space-y-2">
                                            <input 
                                                type="text"
                                                className={inputClass}
                                                value={displayElement.props.logoSrc || ''}
                                                placeholder="Image URL"
                                                onChange={(e) => onUpdateProps(selectedElement.id, { logoSrc: e.target.value })}
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
                                    ) : (
                                        <input 
                                            type="text"
                                            className={inputClass}
                                            value={displayElement.props.logoText || ''}
                                            placeholder="Logo Text"
                                            onChange={(e) => onUpdateProps(selectedElement.id, { logoText: e.target.value })}
                                        />
                                    )}
                                </div>
                                
                                {/* Links */}
                                <div className="space-y-3">
                                    <label className={labelClass}>Menu Items</label>
                                    <div className="space-y-2">
                                        {(displayElement.props.navLinks || []).map((link, i) => (
                                            <div key={i} className="flex gap-1 items-center">
                                                <input 
                                                    className="w-1/3 text-xs border border-gray-300 rounded p-1"
                                                    value={link.label}
                                                    onChange={(e) => onUpdateNavLink(selectedElement.id, i, 'label', e.target.value)}
                                                />
                                                <input 
                                                    className="flex-1 text-xs border border-gray-300 rounded p-1"
                                                    value={link.href}
                                                    onChange={(e) => onUpdateNavLink(selectedElement.id, i, 'href', e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => onRemoveNavLink(selectedElement.id, i)}
                                                    className="text-red-400 hover:text-red-600 p-1"
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            </div>
                                        ))}
                                        <button 
                                            onClick={() => onAddNavLink(selectedElement.id)}
                                            className="w-full py-1.5 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded flex items-center justify-center gap-1 transition-colors"
                                        >
                                            <Icons.Plus /> Add Link
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Styling */}
                                <div>
                                    <label className={labelClass}>Link Color</label>
                                    <ColorPicker 
                                        value={displayElement.props.linkColor}
                                        onChange={(val) => onUpdateProps(selectedElement.id, { linkColor: val })}
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

                                <button 
                                    onClick={onAiImage}
                                    disabled={isAiLoading}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-violet-100 text-violet-700 text-xs font-medium rounded hover:bg-violet-200 transition-colors mt-2"
                                >
                                    {isAiLoading ? 'Generating...' : <><Icons.Magic /> Generate New Image</>}
                                </button>
                            </div>
                        )}

                        {/* Video Props */}
                        {displayElement.type === 'video' && (
                            <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Video Settings</h3>
                                <div>
                                    <label className={labelClass}>Video URL (YouTube/Vimeo)</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        value={displayElement.props.videoUrl || ''}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { videoUrl: e.target.value })}
                                    />
                                    <input 
                                        type="file" 
                                        accept="video/*"
                                        className={fileInputClass}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const base64 = await onFileUpload(file);
                                                onUpdateProps(selectedElement.id, { videoUrl: base64 });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Map Props */}
                        {displayElement.type === 'map' && (
                            <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Map Config</h3>
                                <div>
                                    <label className={labelClass}>Address / Location</label>
                                    <input 
                                        type="text" 
                                        className={inputClass}
                                        value={displayElement.props.address || ''}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Zoom Level</label>
                                    <input 
                                        type="number"
                                        min="1" max="20"
                                        className={inputClass}
                                        value={displayElement.props.zoom || 13}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { zoom: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* List Props */}
                        {displayElement.type === 'list' && (
                            <div className="space-y-4">
                                <h3 className={sectionTitleClass}>List Configuration</h3>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Type</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.listType || 'ul'}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { 
                                                listType: e.target.value,
                                                listStyleType: e.target.value === 'ul' ? 'disc' : 'decimal' // Reset style on type change
                                            })}
                                        >
                                            <option value="ul">Unordered</option>
                                            <option value="ol">Ordered</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Bullet Style</label>
                                        <select 
                                            className={inputClass}
                                            value={displayElement.props.listStyleType || (displayElement.props.listType === 'ol' ? 'decimal' : 'disc')}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { listStyleType: e.target.value })}
                                        >
                                            {displayElement.props.listType === 'ol' ? (
                                                <>
                                                    <option value="decimal">1, 2, 3</option>
                                                    <option value="decimal-leading-zero">01, 02, 03</option>
                                                    <option value="lower-alpha">a, b, c</option>
                                                    <option value="upper-alpha">A, B, C</option>
                                                    <option value="lower-roman">i, ii, iii</option>
                                                    <option value="upper-roman">I, II, III</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="disc">Disc (●)</option>
                                                    <option value="circle">Circle (○)</option>
                                                    <option value="square">Square (■)</option>
                                                    <option value="none">None</option>
                                                </>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={labelClass}>Item Spacing</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="text"
                                            className={inputClass}
                                            value={displayElement.props.itemSpacing || ''}
                                            onChange={(e) => onUpdateProps(selectedElement.id, { itemSpacing: e.target.value })}
                                            placeholder="e.g. 0.5rem"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between items-center">
                                        <label className={labelClass}>List Items</label>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {(displayElement.props.items || ['Item 1', 'Item 2', 'Item 3']).map((item, i, arr) => (
                                            <div key={i} className="flex gap-1 items-center group">
                                                 <div className="flex flex-col gap-0.5">
                                                     <button 
                                                        onClick={() => {
                                                            if (i === 0) return;
                                                            const newItems = [...arr];
                                                            [newItems[i-1], newItems[i]] = [newItems[i], newItems[i-1]];
                                                            onUpdateProps(selectedElement.id, { items: newItems });
                                                        }}
                                                        disabled={i === 0}
                                                        className="text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400 h-3 flex items-center"
                                                     >
                                                         <div className="rotate-180"><Icons.ChevronDown /></div>
                                                     </button>
                                                     <button 
                                                        onClick={() => {
                                                            if (i === arr.length - 1) return;
                                                            const newItems = [...arr];
                                                            [newItems[i+1], newItems[i]] = [newItems[i], newItems[i+1]];
                                                            onUpdateProps(selectedElement.id, { items: newItems });
                                                        }}
                                                        disabled={i === arr.length - 1}
                                                        className="text-gray-400 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-400 h-3 flex items-center"
                                                     >
                                                         <Icons.ChevronDown />
                                                     </button>
                                                 </div>
                                                <input 
                                                    className={`flex-1 ${inputClass} py-1`}
                                                    value={item}
                                                    onChange={(e) => {
                                                        const newItems = [...arr];
                                                        newItems[i] = e.target.value;
                                                        onUpdateProps(selectedElement.id, { items: newItems });
                                                    }}
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const newItems = arr.filter((_, idx) => idx !== i);
                                                        onUpdateProps(selectedElement.id, { items: newItems });
                                                    }}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            const newItems = [...(displayElement.props.items || ['Item 1', 'Item 2', 'Item 3']), 'New Item'];
                                            onUpdateProps(selectedElement.id, { items: newItems });
                                        }}
                                        className="w-full py-2 text-xs bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 rounded flex items-center justify-center gap-1 transition-colors mt-2"
                                    >
                                        <Icons.Plus /> Add Item
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Code Props */}
                        {displayElement.type === 'customCode' && (
                            <div className="space-y-3">
                                <h3 className={sectionTitleClass}>Embed Code</h3>
                                <div>
                                    <label className={labelClass}>HTML / CSS / JS</label>
                                    <textarea 
                                        className={`${inputClass} font-mono text-xs`}
                                        rows={8}
                                        value={displayElement.props.code || ''}
                                        onChange={(e) => onUpdateProps(selectedElement.id, { code: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                        

                        {/* Styles */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className={sectionTitleClass}>Design</h3>
                            
                            {/* Background Settings */}
                            <div className="space-y-3">
                                <span className={labelClass}>Background</span>
                                
                                {['section', 'container', 'columns', 'navbar'].includes(displayElement.type) ? (
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
                                                <button 
                                                    onClick={() => onAiBg('backgroundImage')}
                                                    disabled={isAiLoading}
                                                    className="p-2 bg-violet-100 text-violet-600 rounded hover:bg-violet-200 shrink-0"
                                                    title="AI Generate Image"
                                                >
                                                    <Icons.Magic />
                                                </button>
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

                                        <div>
                                            <label className="text-[10px] text-gray-400 block mb-1">Video URL (MP4)</label>
                                            <input 
                                                type="text" 
                                                value={displayElement.props.style?.backgroundVideo || ''}
                                                onChange={(e) => onUpdateStyle(selectedElement.id, 'backgroundVideo', e.target.value)}
                                                className={inputClass}
                                                placeholder="https://...mp4"
                                            />
                                            <input 
                                                type="file" 
                                                accept="video/*"
                                                className={fileInputClass}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const base64 = await onFileUpload(file);
                                                        onUpdateStyle(selectedElement.id, 'backgroundVideo', base64);
                                                    }
                                                }}
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