

import React, { useRef, useState, useEffect } from 'react';
import { PageElement, FormField, SavedTemplate, TestimonialItem, ElementType, NavLinkItem } from '../../types';
import { Icons } from '../Icons';
import { ColorPicker } from '../ui/ColorPicker';
import { FONT_FAMILIES, MENU_PRESETS } from '../../data/constants';
import { TAILWIND_CLASSES } from '../../data/tailwindClasses';
import { DesignSettings } from './DesignSettings';

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
    onUpdateNavLink: (id: string, index: number, field: string, value: string) => void; // Legacy
    onRemoveNavLink: (id: string, index: number) => void; // Legacy
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

const LAYOUT_TYPES: ElementType[] = ['section', 'container', 'columns', 'slider', 'card', 'form', 'navbar'];

// --- Helper Component for Nav Tree ---
const NavTreeItem: React.FC<{ 
    link: NavLinkItem, 
    onUpdate: (updatedLink: NavLinkItem) => void,
    onRemove: () => void 
}> = ({ link, onUpdate, onRemove }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleAddChild = () => {
        const newChild: NavLinkItem = {
            id: `sub-${Date.now()}`,
            label: 'Sub Menu',
            href: '#',
            type: 'link'
        };
        const updated = { ...link, children: [...(link.children || []), newChild] };
        onUpdate(updated);
        setIsExpanded(true);
    };

    const handleUpdateChild = (index: number, updatedChild: NavLinkItem) => {
        const newChildren = [...(link.children || [])];
        newChildren[index] = updatedChild;
        onUpdate({ ...link, children: newChildren });
    };

    const handleRemoveChild = (index: number) => {
        const newChildren = (link.children || []).filter((_, i) => i !== index);
        onUpdate({ ...link, children: newChildren });
    };

    return (
        <div className="border border-gray-200 rounded-md bg-white mb-2 overflow-hidden">
            <div className="flex items-center p-2 bg-gray-50 gap-2">
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-indigo-600 p-0.5">
                    <div className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                         <Icons.ChevronRight width={12} height={12} />
                    </div>
                </button>
                <span className="text-xs font-medium flex-1 truncate">{link.label}</span>
                <span className="text-[9px] uppercase font-bold text-gray-400 border border-gray-200 px-1 rounded">{link.type || 'link'}</span>
                <button onClick={() => setIsEditing(!isEditing)} className="text-gray-400 hover:text-indigo-600 p-1"><Icons.Settings width={12} height={12} /></button>
                <button onClick={onRemove} className="text-gray-400 hover:text-red-600 p-1"><Icons.Trash width={12} height={12} /></button>
            </div>
            
            {isEditing && (
                <div className="p-3 border-t border-gray-100 bg-gray-50/50 space-y-3">
                    <div>
                        <label className={labelClass}>Label</label>
                        <input className={inputClass} value={link.label} onChange={e => onUpdate({ ...link, label: e.target.value })} />
                    </div>
                    <div>
                        <label className={labelClass}>Type</label>
                        <select className={inputClass} value={link.type || 'link'} onChange={e => onUpdate({ ...link, type: e.target.value as any })}>
                            <option value="link">Link</option>
                            <option value="popup">Popup Trigger</option>
                            <option value="mega-menu">Mega Menu</option>
                        </select>
                    </div>

                    {link.type === 'link' || !link.type ? (
                        <>
                            <div>
                                <label className={labelClass}>URL</label>
                                <input className={inputClass} value={link.href || '#'} onChange={e => onUpdate({ ...link, href: e.target.value })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={link.target === '_blank'} onChange={e => onUpdate({ ...link, target: e.target.checked ? '_blank' : '_self' })} />
                                <span className="text-xs text-gray-600">Open in new tab</span>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className={labelClass}>Target Element ID</label>
                            <input className={inputClass} value={link.targetId || ''} onChange={e => onUpdate({ ...link, targetId: e.target.value })} placeholder="e.g. section-123" />
                            {link.type === 'mega-menu' && (
                                <div className="mt-2">
                                    <label className={labelClass}>Placement</label>
                                    <select 
                                        className={inputClass} 
                                        value={link.megaMenuPlacement || 'center'} 
                                        onChange={e => onUpdate({ ...link, megaMenuPlacement: e.target.value as any })}
                                    >
                                        <option value="left">Left</option>
                                        <option value="center">Center</option>
                                        <option value="right">Right</option>
                                    </select>
                                    <p className="text-[10px] text-gray-400 mt-1">
                                        The mega menu will span the full width of the navbar. This setting aligns the content container.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Only allow children if not a mega menu (simplification) */}
                    {link.type !== 'mega-menu' && (
                        <button onClick={handleAddChild} className="w-full text-xs text-indigo-600 bg-indigo-50 py-1.5 rounded font-bold hover:bg-indigo-100 border border-indigo-200">+ Add Sub Link</button>
                    )}
                </div>
            )}

            {isExpanded && link.children && link.children.length > 0 && (
                <div className="pl-4 pr-2 pb-2 border-t border-gray-100">
                    <div className="border-l-2 border-gray-100 pl-2 pt-2 space-y-2">
                         {link.children.map((child, i) => (
                             <NavTreeItem 
                                key={child.id || i} 
                                link={child} 
                                onUpdate={(updated) => handleUpdateChild(i, updated)}
                                onRemove={() => handleRemoveChild(i)}
                             />
                         ))}
                    </div>
                </div>
            )}
        </div>
    );
};


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
    const galleryUrlInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'content' | 'element' | 'container'>('content');
    
    // Select Option Helpers
    const [newOptionLabel, setNewOptionLabel] = useState('');
    const [newOptionValue, setNewOptionValue] = useState('');

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

    const isLayoutElement = displayElement ? LAYOUT_TYPES.includes(displayElement.type) : false;

    useEffect(() => {
        if (isLayoutElement && activeTab === 'element') {
            setActiveTab('content');
        }
    }, [displayElement?.id, isLayoutElement, activeTab]);

    // New Option Helper (For Select)
    const handleAddOption = () => {
        if (!selectedElement || !newOptionLabel) return;
        const currentOptions = selectedElement.props.fieldOptions || [];
        onUpdateProps(selectedElement.id, { 
            fieldOptions: [...currentOptions, { label: newOptionLabel, value: newOptionValue || newOptionLabel }] 
        });
        setNewOptionLabel('');
        setNewOptionValue('');
    };

    const handleRemoveOption = (index: number) => {
        if (!selectedElement) return;
        const currentOptions = selectedElement.props.fieldOptions || [];
        onUpdateProps(selectedElement.id, { 
            fieldOptions: currentOptions.filter((_, i) => i !== index) 
        });
    };
    
    // Testimonial Helpers
    const handleUpdateTestimonial = (index: number, field: string, value: any) => {
        if (!selectedElement) return;
        const items = [...(selectedElement.props.testimonialItems || [])];
        if (!items[index]) return;
        items[index] = { ...items[index], [field]: value };
        onUpdateProps(selectedElement.id, { testimonialItems: items });
    };

    const handleAddTestimonial = () => {
        if (!selectedElement) return;
        const newItem: TestimonialItem = {
            id: `testi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            content: "This is a glowing review of your product. It really helped us achieve our goals.",
            author: "Jane Doe",
            role: "CTO, TechCorp",
            rating: 5,
            avatarSrc: "https://i.pravatar.cc/150?u=" + Math.floor(Math.random() * 1000)
        };
        const currentItems = selectedElement.props.testimonialItems || [];
        onUpdateProps(selectedElement.id, { testimonialItems: [...currentItems, newItem] });
    };

    const handleRemoveTestimonial = (index: number) => {
        if (!selectedElement) return;
        const currentItems = selectedElement.props.testimonialItems || [];
        const newItems = currentItems.filter((_, i) => i !== index);
        onUpdateProps(selectedElement.id, { testimonialItems: newItems });
    };

    // Gallery Helpers
    const handleUpdateGalleryImage = (index: number, newSrc: string) => {
        if (!selectedElement) return;
        const currentImages = [...(displayElement!.props.galleryImages || [])];
        if (currentImages[index]) {
            currentImages[index] = { ...currentImages[index], src: newSrc };
            onUpdateProps(selectedElement.id, { galleryImages: currentImages });
        }
    };

    // Style Helpers
    const handleElementStyleUpdate = (key: string, value: string) => {
        if (!selectedElement) return;
        const currentStyle = selectedElement.props.elementStyle || {};
        onUpdateProps(selectedElement.id, { elementStyle: { ...currentStyle, [key]: value } });
    };

    const handleElementClassUpdate = (value: string) => {
        if (!selectedElement) return;
        onUpdateProps(selectedElement.id, { elementClassName: value });
    };
    
    // Recursive Nav Link Update
    const handleUpdateNavLinkItem = (index: number, updatedItem: NavLinkItem) => {
        if (!selectedElement || !selectedElement.props.navLinks) return;
        const newLinks = [...selectedElement.props.navLinks];
        newLinks[index] = updatedItem;
        onUpdateProps(selectedElement.id, { navLinks: newLinks });
    }

    return (
        <aside className="w-80 bg-white border-l border-gray-200 shrink-0 overflow-y-auto shadow-lg z-20 h-full transition-all duration-300 flex flex-col">
            {!selectedElement || !displayElement ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center bg-gray-50/50">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Icons.Settings />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600">No Selection</h3>
                    <p className="mt-2 text-xs">Click on any element in the canvas to edit its style and content.</p>
                </div>
            ) : (
                <>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
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
                
                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-white shrink-0">
                    <button 
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Content
                    </button>
                    {!isLayoutElement && (
                    <button 
                        onClick={() => setActiveTab('element')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'element' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Element
                    </button>
                    )}
                    <button 
                        onClick={() => setActiveTab('container')}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'container' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        Container
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Global Warning */}
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

                    {isGlobalInstance && activeTab === 'content' ? (
                         <div className="p-5 text-center text-gray-400 text-xs italic">
                             To edit content properties, click "Edit Master" or "Detach".
                         </div>
                    ) : (
                        <div className="p-5">
                            {/* --- CONTENT TAB --- */}
                            {activeTab === 'content' && (
                                <div className="space-y-6">
                                    {/* Save as Template Button */}
                                    <button 
                                        onClick={() => onSaveTemplate(selectedElement.id)}
                                        className="w-full py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-indigo-100 flex items-center justify-center gap-2 mb-4"
                                    >
                                        <Icons.Download width={14} height={14} /> Save as Template
                                    </button>
                                    
                                    {/* NAVBAR CONFIGURATION - Container Settings Only */}
                                    {displayElement.type === 'navbar' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Navbar Container</h3>
                                            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700 mb-2"><p>This is a flex container. Add Logo and Menu elements inside.</p></div>
                                            
                                            <div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded">
                                                <label className="text-[10px] text-gray-600 font-bold">Sticky Header</label>
                                                <input 
                                                    type="checkbox"
                                                    className="accent-indigo-600 w-3 h-3"
                                                    checked={displayElement.props.isSticky || false}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { isSticky: e.target.checked })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* MENU ELEMENT CONFIGURATION */}
                                    {displayElement.type === 'menu' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Menu Settings</h3>

                                            {/* Menu Source */}
                                            <div>
                                                <label className={labelClass}>Load Preset</label>
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
                                                    <option value="" disabled>Select a preset...</option>
                                                    <option value="simple">Simple</option>
                                                    <option value="business">Business</option>
                                                    <option value="portfolio">Portfolio</option>
                                                    <option value="app">App</option>
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
                                                        <NavTreeItem 
                                                            key={link.id || i} 
                                                            link={link} 
                                                            onUpdate={(updated) => handleUpdateNavLinkItem(i, updated)}
                                                            onRemove={() => onRemoveNavLink(selectedElement.id, i)}
                                                        />
                                                    ))}
                                                    {(!displayElement.props.navLinks || displayElement.props.navLinks.length === 0) && (
                                                        <div className="text-center text-xs text-gray-400 py-4 italic border border-dashed border-gray-200 rounded">
                                                            No links. Add one!
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Style & Mobile */}
                                            <div className="space-y-3 border-t border-gray-100 pt-3">
                                                <h4 className="text-[10px] font-bold text-gray-400">Mobile & Style</h4>
                                                
                                                <div className="grid grid-cols-1 gap-3">
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
                                                    <div>
                                                        <label className={labelClass}>Mobile Menu Icon</label>
                                                        <select 
                                                            className={inputClass}
                                                            value={displayElement.props.mobileMenuIconType || 'menu'}
                                                            onChange={(e) => onUpdateProps(selectedElement.id, { mobileMenuIconType: e.target.value })}
                                                        >
                                                            <option value="menu">Hamburger (Default)</option>
                                                            <option value="grid">Grid</option>
                                                            <option value="dots">Dots</option>
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

                                    {/* LOGO CONFIGURATION */}
                                    {displayElement.type === 'logo' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Logo Settings</h3>
                                            
                                            <div>
                                                <label className={labelClass}>Logo Type</label>
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
                                                <label className={labelClass}>Link URL</label>
                                                <input 
                                                    className={inputClass}
                                                    value={displayElement.props.href || ''}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { href: e.target.value })}
                                                    placeholder="https://..."
                                                />
                                            </div>

                                            {displayElement.props.logoType === 'text' ? (
                                                 <div>
                                                    <label className={labelClass}>Logo Text</label>
                                                    <input 
                                                        className={inputClass}
                                                        value={displayElement.props.logoText || ''}
                                                        onChange={(e) => onUpdateProps(selectedElement.id, { logoText: e.target.value })}
                                                    />
                                                </div>
                                            ) : (
                                                <>
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
                                                    <div>
                                                        <label className={labelClass}>Width</label>
                                                        <input 
                                                            className={inputClass}
                                                            value={displayElement.props.logoWidth || 'auto'}
                                                            onChange={(e) => onUpdateProps(selectedElement.id, { logoWidth: e.target.value })}
                                                            placeholder="120px"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* === BUTTON CONFIGURATION === */}
                                    {displayElement.type === 'button' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Button Settings</h3>
                                            <div>
                                                <label className={labelClass}>Action</label>
                                                <select
                                                    className={inputClass}
                                                    value={displayElement.props.buttonAction || 'link'}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { buttonAction: e.target.value })}
                                                >
                                                    <option value="link">Open Link</option>
                                                    <option value="submit">Submit Form</option>
                                                    <option value="popup">Open Popup</option>
                                                </select>
                                            </div>

                                            {displayElement.props.buttonAction === 'link' && (
                                                <div>
                                                    <label className={labelClass}>URL / Anchor</label>
                                                    <input
                                                        className={inputClass}
                                                        value={displayElement.props.href || ''}
                                                        onChange={(e) => onUpdateProps(selectedElement.id, { href: e.target.value })}
                                                        placeholder="https://... or #section-id"
                                                    />
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <input 
                                                            type="checkbox" 
                                                            className="accent-indigo-600 w-3 h-3"
                                                            checked={displayElement.props.target === '_blank'}
                                                            onChange={(e) => onUpdateProps(selectedElement.id, { target: e.target.checked ? '_blank' : '_self' })}
                                                        />
                                                        <label className="text-xs text-gray-600">Open in new tab</label>
                                                    </div>
                                                </div>
                                            )}

                                            {displayElement.props.buttonAction === 'popup' && (
                                                <div>
                                                    <label className={labelClass}>Target Element ID</label>
                                                    <input
                                                        className={inputClass}
                                                        value={displayElement.props.popupTargetId || ''}
                                                        onChange={(e) => onUpdateProps(selectedElement.id, { popupTargetId: e.target.value })}
                                                        placeholder="e.g. section-123"
                                                    />
                                                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                                                        Enter the ID of the element you want to show in the popup.
                                                    </p>
                                                </div>
                                            )}
                                            <div>
                                                <label className={labelClass}>Button Text</label>
                                                <input 
                                                    className={inputClass}
                                                    value={displayElement.props.content || ''}
                                                    onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* === INDIVIDUAL FORM ELEMENTS === */}
                                    {(displayElement.type === 'input' || displayElement.type === 'textarea') && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Field Settings</h3>
                                            <div><label className={labelClass}>Field Name (name)</label><input className={inputClass} value={displayElement.props.fieldName || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldName: e.target.value })} placeholder="user_email"/></div>
                                            <div><label className={labelClass}>Label</label><input className={inputClass} value={displayElement.props.fieldLabel || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldLabel: e.target.value })}/></div>
                                            {displayElement.type === 'input' && (<div><label className={labelClass}>Input Type</label><select className={inputClass} value={displayElement.props.inputType || 'text'} onChange={(e) => onUpdateProps(selectedElement.id, { inputType: e.target.value })}><option value="text">Text</option><option value="email">Email</option><option value="password">Password</option><option value="number">Number</option><option value="tel">Telephone</option><option value="url">URL</option><option value="date">Date</option><option value="hidden">Hidden</option></select></div>)}
                                            <div><label className={labelClass}>Placeholder</label><input className={inputClass} value={displayElement.props.fieldPlaceholder || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldPlaceholder: e.target.value })}/></div>
                                            <div><label className={labelClass}>Default Value</label>{displayElement.type === 'textarea' ? (<textarea className={inputClass} rows={2} value={displayElement.props.fieldDefaultValue || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldDefaultValue: e.target.value })}/>) : (<input className={inputClass} value={displayElement.props.fieldDefaultValue || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldDefaultValue: e.target.value })}/>)}</div>
                                            <div className="grid grid-cols-2 gap-3 pt-2"><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Required</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.fieldRequired || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldRequired: e.target.checked })}/></div><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Hidden</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.fieldHidden || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldHidden: e.target.checked })}/></div></div>
                                        </div>
                                    )}
                                    {/* SELECT */}
                                    {displayElement.type === 'select' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Select Settings</h3>
                                            <div><label className={labelClass}>Field Name</label><input className={inputClass} value={displayElement.props.fieldName || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldName: e.target.value })}/></div>
                                            <div><label className={labelClass}>Label</label><input className={inputClass} value={displayElement.props.fieldLabel || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldLabel: e.target.value })}/></div>
                                            <div><label className={labelClass}>Default Value</label><input className={inputClass} value={displayElement.props.fieldDefaultValue || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldDefaultValue: e.target.value })} placeholder="Matches Option Value"/></div>
                                            <div className="pt-2 border-t border-gray-100"><label className={labelClass}>Options</label><div className="space-y-2 mb-3">{displayElement.props.fieldOptions?.map((opt, i) => (<div key={i} className="flex gap-1 items-center bg-gray-50 p-1.5 rounded border border-gray-200"><div className="flex-1 grid grid-cols-2 gap-1 text-xs"><span className="font-medium truncate" title={opt.label}>{opt.label}</span><span className="text-gray-500 truncate font-mono" title={opt.value}>{opt.value}</span></div><button onClick={() => handleRemoveOption(i)} className="p-1 text-gray-400 hover:text-red-500"><Icons.Trash width={12} height={12} /></button></div>))}</div><div className="grid grid-cols-2 gap-2 mb-2"><input className={inputClass} placeholder="Label" value={newOptionLabel} onChange={(e) => setNewOptionLabel(e.target.value)}/><input className={inputClass} placeholder="Value" value={newOptionValue} onChange={(e) => setNewOptionValue(e.target.value)}/></div><button onClick={handleAddOption} disabled={!newOptionLabel} className="w-full py-1.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-200 text-xs font-bold hover:bg-indigo-100 disabled:opacity-50">Add Option</button></div>
                                            <div className="grid grid-cols-2 gap-3 pt-2"><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Required</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.fieldRequired || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldRequired: e.target.checked })}/></div><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Multiple</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.fieldMultiple || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldMultiple: e.target.checked })}/></div></div>
                                        </div>
                                    )}
                                    {/* CHECKBOX & RADIO */}
                                    {(displayElement.type === 'checkbox' || displayElement.type === 'radio') && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>{displayElement.type === 'radio' ? 'Radio Button' : 'Checkbox'} Settings</h3>
                                            <div><label className={labelClass}>Field Name (Group)</label><input className={inputClass} value={displayElement.props.fieldName || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldName: e.target.value })} placeholder="option_group"/><p className="text-[10px] text-gray-400 mt-1">Elements with same name act as a group.</p></div>
                                            <div><label className={labelClass}>Label Text</label><input className={inputClass} value={displayElement.props.fieldLabel || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldLabel: e.target.value })}/></div>
                                            <div><label className={labelClass}>Value Attribute</label><input className={inputClass} value={displayElement.props.fieldValue || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldValue: e.target.value })} placeholder="yes"/></div>
                                            <div className="grid grid-cols-2 gap-3 pt-2"><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Required</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.fieldRequired || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldRequired: e.target.checked })}/></div><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">{displayElement.type === 'radio' ? 'Selected' : 'Checked'}</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.checked || false} onChange={(e) => onUpdateProps(selectedElement.id, { checked: e.target.checked })}/></div></div>
                                        </div>
                                    )}
                                    {/* FORM CONTAINER */}
                                    {displayElement.type === 'form' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Form Container</h3>
                                            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700 mb-2"><p>Add inputs, buttons, and other elements inside this form container.</p></div>
                                            <div><label className={labelClass}>Action URL</label><input className={inputClass} value={displayElement.props.formActionUrl || ''} onChange={(e) => onUpdateProps(selectedElement.id, { formActionUrl: e.target.value })} placeholder="https://formspree.io/f/..."/></div>
                                            <div><label className={labelClass}>Thank You URL (Optional)</label><input className={inputClass} value={displayElement.props.formThankYouUrl || ''} onChange={(e) => onUpdateProps(selectedElement.id, { formThankYouUrl: e.target.value })} placeholder="/thank-you"/></div>
                                            <div><label className={labelClass}>Success Message (Text)</label><input className={inputClass} value={displayElement.props.formSuccessMessage || ''} onChange={(e) => onUpdateProps(selectedElement.id, { formSuccessMessage: e.target.value })}/></div>
                                            <div className="space-y-3 pt-2 border-t border-gray-100"><h4 className="text-[10px] font-bold text-gray-400">Layout & Features</h4><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Enable reCAPTCHA</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.formEnableRecaptcha || false} onChange={(e) => onUpdateProps(selectedElement.id, { formEnableRecaptcha: e.target.checked })}/></div><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Horizontal Layout</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.formLabelLayout === 'horizontal'} onChange={(e) => { const isHorizontal = e.target.checked; let currentClass = displayElement!.props.className || ''; if (isHorizontal) { currentClass = currentClass.replace('flex-col', 'flex-row items-end flex-wrap'); if (!currentClass.includes('flex-row')) currentClass += ' flex-row items-end flex-wrap'; } else { currentClass = currentClass.replace('flex-row', 'flex-col'); currentClass = currentClass.replace('items-end', ''); currentClass = currentClass.replace('flex-wrap', ''); if (!currentClass.includes('flex-col')) currentClass += ' flex-col'; } currentClass = currentClass.replace(/\s+/g, ' ').trim(); onUpdateProps(selectedElement.id, { formLabelLayout: isHorizontal ? 'horizontal' : 'top', className: currentClass }); }}/></div></div>
                                        </div>
                                    )}
                                    {/* GALLERY CONFIGURATION */}
                                    {displayElement.type === 'gallery' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Gallery Settings</h3>
                                            <div className="space-y-3"><div><label className={labelClass}>Layout Style</label><select className={inputClass} value={displayElement.props.galleryLayout || 'grid'} onChange={(e) => onUpdateProps(selectedElement.id, { galleryLayout: e.target.value })}><option value="grid">Grid (Fixed Cols)</option><option value="masonry">Masonry</option><option value="flex">Justified (Flex)</option></select></div>{(displayElement.props.galleryLayout === 'grid' || displayElement.props.galleryLayout === 'masonry') && (<div><label className={labelClass}>Columns</label><input type="number" min="1" max="12" className={inputClass} value={displayElement.props.galleryColumnCount || 3} onChange={(e) => onUpdateProps(selectedElement.id, { galleryColumnCount: Number(e.target.value) })}/></div>)}<div><label className={labelClass}>Gutter Spacing</label><input className={inputClass} value={displayElement.props.galleryGap || '1rem'} onChange={(e) => onUpdateProps(selectedElement.id, { galleryGap: e.target.value })} placeholder="1rem, 16px..."/></div></div>
                                            <div className="pt-2 border-t border-gray-100"><div className="flex items-center justify-between mb-2"><label className="text-xs font-bold text-gray-900">Images</label><div className="relative overflow-hidden inline-block"><button className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold flex items-center gap-1"><Icons.Plus width={12} height={12} /> Add Images</button><input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={async (e) => { const files = Array.from(e.target.files || []); if (files.length > 0) { const newImages = await Promise.all(files.map(async (f) => { const src = await onFileUpload(f); return { id: `img-${Date.now()}-${Math.random().toString(36).substr(2,9)}`, src }; })); const currentImages = displayElement!.props.galleryImages || []; onUpdateProps(selectedElement.id, { galleryImages: [...currentImages, ...newImages] }); } e.target.value = ''; }}/></div></div><div className="flex gap-1 mb-3"><input ref={galleryUrlInputRef} className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none" placeholder="https://..."/><button onClick={() => { if (galleryUrlInputRef.current?.value) { const newImg = { id: `img-${Date.now()}`, src: galleryUrlInputRef.current.value }; const currentImages = displayElement!.props.galleryImages || []; onUpdateProps(selectedElement.id, { galleryImages: [...currentImages, newImg] }); galleryUrlInputRef.current.value = ''; } }} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 rounded text-xs font-medium">Add</button></div><div className="space-y-2 max-h-60 overflow-y-auto pr-1">{displayElement.props.galleryImages?.map((img, i) => (<div key={img.id} className="flex items-center gap-2 bg-gray-50 p-1.5 rounded border border-gray-200 group"><img src={img.src} alt="" className="w-8 h-8 object-cover rounded bg-white shrink-0 border border-gray-100" /><input className="text-xs bg-transparent border-none outline-none flex-1 text-gray-600 truncate hover:text-gray-900 focus:bg-white focus:ring-1 focus:ring-indigo-200 rounded px-1" value={img.src} onChange={(e) => handleUpdateGalleryImage(i, e.target.value)} title={img.src}/><button onClick={() => { const newImages = displayElement!.props.galleryImages?.filter((_, idx) => idx !== i); onUpdateProps(selectedElement.id, { galleryImages: newImages }); }} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1" title="Remove Image"><Icons.Trash width={12} height={12} /></button></div>))}</div></div>
                                        </div>
                                    )}
                                    {/* TESTIMONIAL CONFIGURATION */}
                                    {displayElement.type === 'testimonial' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Testimonial Settings</h3>
                                            <div className="space-y-3"><div><label className={labelClass}>Layout Style</label><select className={inputClass} value={displayElement.props.testimonialLayout || 'grid'} onChange={(e) => onUpdateProps(selectedElement.id, { testimonialLayout: e.target.value })}><option value="grid">Grid Cards</option><option value="slider">Slider / Carousel</option></select></div><div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Avatar Size</label><select className={inputClass} value={displayElement.props.testimonialAvatarSize || 'md'} onChange={(e) => onUpdateProps(selectedElement.id, { testimonialAvatarSize: e.target.value })}><option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option><option value="xl">Extra Large</option></select></div><div><label className={labelClass}>Avatar Shape</label><select className={inputClass} value={displayElement.props.testimonialAvatarShape || 'circle'} onChange={(e) => onUpdateProps(selectedElement.id, { testimonialAvatarShape: e.target.value })}><option value="circle">Circle</option><option value="rounded">Rounded</option><option value="square">Square</option></select></div></div><div><label className={labelClass}>Bubble Background</label><ColorPicker value={displayElement.props.testimonialBubbleColor} onChange={(val) => onUpdateProps(selectedElement.id, { testimonialBubbleColor: val })}/></div></div>
                                            <div className="pt-2 border-t border-gray-100 mt-2"><div className="flex items-center justify-between mb-2"><label className="text-xs font-bold text-gray-900">Reviews</label><button onClick={handleAddTestimonial} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold flex items-center gap-1"><Icons.Plus width={12} height={12} /> Add</button></div><div className="space-y-4">{displayElement.props.testimonialItems?.map((item, i) => (<div key={item.id} className="bg-gray-50 p-3 rounded border border-gray-200 relative group"><button onClick={() => handleRemoveTestimonial(i)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove"><Icons.Trash width={12} height={12} /></button><div className="space-y-2 pr-4"><div className="grid grid-cols-2 gap-2"><input className="text-xs font-bold bg-transparent border-b border-dashed border-gray-300 w-full focus:bg-white focus:border-indigo-500 outline-none pb-1" value={item.author} onChange={(e) => handleUpdateTestimonial(i, 'author', e.target.value)} placeholder="Author Name"/><input className="text-xs bg-transparent border-b border-dashed border-gray-300 w-full focus:bg-white focus:border-indigo-500 outline-none pb-1 text-gray-600" value={item.role} onChange={(e) => handleUpdateTestimonial(i, 'role', e.target.value)} placeholder="Role / Title"/></div><div className="flex items-center gap-2"><label className="text-[10px] text-gray-400">Rating:</label><select className="text-xs border border-gray-200 rounded p-1 bg-white" value={item.rating} onChange={(e) => handleUpdateTestimonial(i, 'rating', Number(e.target.value))}>{[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Stars</option>)}</select></div><textarea className="w-full text-xs border border-gray-200 rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none" rows={3} value={item.content} onChange={(e) => handleUpdateTestimonial(i, 'content', e.target.value)} placeholder="Testimonial content..."/><div className="flex items-center gap-2 mt-1"><img src={item.avatarSrc} className="w-6 h-6 rounded-full object-cover bg-gray-200 border border-gray-300" alt="" /><input className="flex-1 text-xs border border-gray-200 rounded px-1 py-1" value={item.avatarSrc} onChange={(e) => handleUpdateTestimonial(i, 'avatarSrc', e.target.value)} placeholder="Avatar URL"/><div className="relative overflow-hidden w-6 h-6 shrink-0 bg-indigo-50 hover:bg-indigo-100 rounded flex items-center justify-center cursor-pointer text-indigo-600 border border-indigo-200" title="Upload Avatar"><Icons.Image width={12} height={12} /><input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const src = await onFileUpload(file); handleUpdateTestimonial(i, 'avatarSrc', src); } }}/></div></div></div></div>))}</div></div>
                                        </div>
                                    )}
                                    {/* MAP CONFIGURATION */}
                                    {displayElement.type === 'map' && (
                                        <div className="space-y-3">
                                            <h3 className={sectionTitleClass}>Map Settings</h3>
                                            <div><label className={labelClass}>Address / Location</label><input className={inputClass} value={displayElement.props.address || ''} onChange={(e) => onUpdateProps(selectedElement.id, { address: e.target.value })} placeholder="City, Place, or Address"/></div>
                                            <div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Zoom Level</label><input type="number" min="1" max="21" className={inputClass} value={displayElement.props.zoom || 13} onChange={(e) => onUpdateProps(selectedElement.id, { zoom: Number(e.target.value) })}/></div><div><label className={labelClass}>Map Type</label><select className={inputClass} value={displayElement.props.mapType || 'roadmap'} onChange={(e) => onUpdateProps(selectedElement.id, { mapType: e.target.value })}><option value="roadmap">Roadmap</option><option value="satellite">Satellite</option></select></div></div>
                                        </div>
                                    )}
                                    {/* SLIDER CONFIGURATION */}
                                    {displayElement.type === 'slider' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Slider Settings</h3>
                                            <div className="space-y-3"><div><label className={labelClass}>Navigation Style</label><select className={inputClass} value={displayElement.props.sliderNavType || 'chevron'} onChange={(e) => onUpdateProps(selectedElement.id, { sliderNavType: e.target.value })}><option value="chevron">Chevron</option><option value="arrow">Arrow</option><option value="caret">Caret</option></select></div><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Show Pagination</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.sliderShowPagination !== false} onChange={(e) => onUpdateProps(selectedElement.id, { sliderShowPagination: e.target.checked })}/></div><div className="flex items-center justify-between border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Autoplay</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.sliderAutoplay || false} onChange={(e) => onUpdateProps(selectedElement.id, { sliderAutoplay: e.target.checked })}/></div><div><label className={labelClass}>Interval (ms)</label><input type="number" className={inputClass} value={displayElement.props.sliderInterval || 3000} onChange={(e) => onUpdateProps(selectedElement.id, { sliderInterval: Number(e.target.value) })}/></div></div>
                                            <div className="pt-2 border-t border-gray-100"><div className="flex items-center justify-between mb-2"><label className="text-xs font-bold text-gray-900">Slides</label><button onClick={() => onAddSlide(selectedElement.id)} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 font-bold">+ Add</button></div><div className="space-y-2">{displayElement.children?.map((slide, i) => (<div key={slide.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200"><input className="text-xs bg-transparent border-none outline-none flex-1 font-medium text-gray-700" value={slide.name} onChange={(e) => onUpdateName(slide.id, e.target.value)}/><button onClick={() => onRemoveSlide(selectedElement.id, i)} className="text-gray-400 hover:text-red-500 ml-2"><Icons.Trash width={12} height={12} /></button></div>))}</div></div>
                                        </div>
                                    )}
                                    {/* Card Configuration */}
                                    {displayElement.type === 'card' && (
                                        <div className="space-y-4">
                                            <h3 className={sectionTitleClass}>Card Configuration</h3>
                                            <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700 mb-2"><p>Select the individual elements (Image, Title, Text, Button) inside the card to edit their content.</p></div>
                                            <div className="space-y-3"><div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Badge</label><input className={inputClass} value={displayElement.props.cardBadge || ''} placeholder="e.g. New" onChange={(e) => onUpdateProps(selectedElement.id, { cardBadge: e.target.value })}/></div></div><div><label className={labelClass}>Link URL (Wrapper)</label><input className={inputClass} value={displayElement.props.cardLink || ''} placeholder="https://..." onChange={(e) => onUpdateProps(selectedElement.id, { cardLink: e.target.value })}/></div></div>
                                            <div className="space-y-3 pt-2 border-t border-gray-100 mt-2"><h4 className="text-[10px] font-bold text-gray-400">Style & Effects</h4><div className="grid grid-cols-2 gap-3"><div><label className={labelClass}>Hover Effect</label><select className={inputClass} value={displayElement.props.cardHoverEffect || 'lift'} onChange={(e) => onUpdateProps(selectedElement.id, { cardHoverEffect: e.target.value })}><option value="none">None</option><option value="lift">Lift Up</option><option value="zoom">Zoom</option><option value="glow">Glow</option><option value="border">Border Color</option></select></div></div></div>
                                        </div>
                                    )}
                                    {/* Heading Props */}
                                    {displayElement.type === 'heading' && (
                                        <div className="space-y-3"><h3 className={sectionTitleClass}>Heading</h3><div><label className={labelClass}>Level</label><select className={inputClass} value={displayElement.props.level || 2} onChange={(e) => onUpdateProps(selectedElement.id, { level: Number(e.target.value) })}><option value={1}>H1</option><option value={2}>H2</option><option value={3}>H3</option><option value={4}>H4</option><option value={5}>H5</option><option value={6}>H6</option></select></div><div><label className={labelClass}>Text</label><textarea className={inputClass} value={displayElement.props.content || ''} onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })}/></div></div>
                                    )}
                                    {/* Text Props */}
                                    {(displayElement.type === 'text') && (
                                        <div className="space-y-3"><h3 className={sectionTitleClass}>Content</h3><div><label className={labelClass}>Text Content</label><textarea className={inputClass} rows={3} value={displayElement.props.content || ''} onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })}/></div></div>
                                    )}
                                    {/* Image Props */}
                                    {displayElement.type === 'image' && (
                                        <div className="space-y-3"><h3 className={sectionTitleClass}>Media Settings</h3><div><label className={labelClass}>Image URL</label><input type="text" className={inputClass} value={displayElement.props.src || ''} onChange={(e) => onUpdateProps(selectedElement.id, { src: e.target.value })}/><input type="file" accept="image/*" className={fileInputClass} onChange={async (e) => { const file = e.target.files?.[0]; if (file) { const base64 = await onFileUpload(file); onUpdateProps(selectedElement.id, { src: base64 }); } }}/></div><div className="grid grid-cols-2 gap-3 mt-3"><div><label className={labelClass}>Object Fit</label><select className={inputClass} value={displayElement.props.imageObjectFit || 'cover'} onChange={(e) => onUpdateProps(selectedElement.id, { imageObjectFit: e.target.value })}><option value="cover">Cover</option><option value="contain">Contain</option><option value="fill">Fill</option><option value="none">None</option><option value="scale-down">Scale Down</option></select></div><div><label className={labelClass}>Height</label><input className={inputClass} value={displayElement.props.imageHeight || ''} onChange={(e) => onUpdateProps(selectedElement.id, { imageHeight: e.target.value })} placeholder="auto, 200px..."/></div></div></div>
                                    )}
                                     {/* Background Settings (If parallax exists) */}
                                     {['section', 'container', 'columns', 'navbar'].includes(displayElement.type) && (
                                          <div className="flex items-center justify-between mt-4 border border-gray-100 bg-gray-50 p-2 rounded"><label className="text-[10px] text-gray-600 font-bold">Parallax Effect</label><input type="checkbox" className="accent-indigo-600 w-3 h-3" checked={displayElement.props.parallax || false} onChange={(e) => onUpdateProps(selectedElement.id, { parallax: e.target.checked })}/></div>
                                     )}
                                </div>
                            )}

                            {/* --- ELEMENT TAB --- */}
                            {activeTab === 'element' && (
                                <DesignSettings 
                                    style={displayElement.props.elementStyle || {}}
                                    className={displayElement.props.elementClassName || ''}
                                    onUpdateStyle={handleElementStyleUpdate}
                                    onUpdateClassName={handleElementClassUpdate}
                                    onFileUpload={onFileUpload}
                                    isTextElement={['text', 'heading', 'button', 'list', 'logo'].includes(displayElement.type)}
                                />
                            )}

                            {/* --- CONTAINER TAB --- */}
                            {activeTab === 'container' && (
                                <DesignSettings 
                                    style={displayElement.props.style || {}}
                                    className={displayElement.props.className || ''}
                                    onUpdateStyle={(key, value) => onUpdateStyle(selectedElement.id, key, value)}
                                    onUpdateClassName={(value) => onUpdateProps(selectedElement.id, { className: value })}
                                    onFileUpload={onFileUpload}
                                    isTextElement={false} // Container usually doesn't need typography unless cascading
                                />
                            )}
                        </div>
                    )}
                </div>
                </>
            )}
        </aside>
    );
};