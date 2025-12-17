
import React, { useRef, useState, useEffect } from 'react';
import { PageElement, SavedTemplate, ElementType, NavLinkItem, ListItem, AnimationSettings, TestimonialItem, GalleryImage } from '../../types';
import { Icons } from '../Icons';
import { ColorPicker } from '../ui/ColorPicker';
import { FONT_FAMILIES, MENU_PRESETS, ICON_OPTIONS } from '../../data/constants';
import { DesignSettings } from './DesignSettings';
import { ComponentRegistry } from '../registry';

interface PropertiesPanelProps {
    selectedElement: PageElement | null;
    onUpdateId: (currentId: string, newId: string) => void;
    onUpdateName: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdateProps: (id: string, props: any) => void;
    onUpdateStyle: (id: string, key: string, value: string) => void;
    onFileUpload: (file: File) => Promise<string>;
    onAddNavLink: (id: string) => void;
    onUpdateNavLink: (id: string, index: number, field: string, value: string) => void;
    onRemoveNavLink: (id: string, index: number) => void;
    onAddSlide: (id: string) => void;
    onUpdateSlide: (id: string, index: number, field: string, value: string) => void;
    onRemoveSlide: (id: string, index: number) => void;
    onSaveTemplate: (id: string) => void;
    onDetach: (id: string) => void;
    onEditTemplate: (id: string) => void;
    savedTemplates: SavedTemplate[];
}

const inputClass = "w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white";
const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";
const sectionTitleClass = "text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 mt-2";

const LAYOUT_TYPES: ElementType[] = ['section', 'container', 'columns', 'slider', 'card', 'form', 'navbar'];
const ANIMATION_TYPES = [
    { label: 'None', value: 'none' },
    { label: 'Fade In', value: 'fade-in' },
    { label: 'Fade In Up', value: 'fade-in-up' },
    { label: 'Fade In Down', value: 'fade-in-down' },
    { label: 'Slide In Left', value: 'slide-in-left' },
    { label: 'Slide In Right', value: 'slide-in-right' },
    { label: 'Zoom In', value: 'zoom-in' },
    { label: 'Rotate In', value: 'rotate-in' },
];
const EASING_TYPES = [
    { label: 'Power2 Out', value: 'power2.out' },
    { label: 'Power3 Out', value: 'power3.out' },
    { label: 'Power4 Out', value: 'power4.out' },
    { label: 'Back Out', value: 'back.out(1.7)' },
    { label: 'Elastic Out', value: 'elastic.out(1, 0.3)' },
    { label: 'Bounce Out', value: 'bounce.out' },
    { label: 'Linear', value: 'none' },
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
    selectedElement, onUpdateId, onUpdateName, onDelete, onDuplicate, onUpdateProps, onUpdateStyle, onFileUpload, 
    onAddNavLink, onUpdateNavLink, onRemoveNavLink, onAddSlide, onUpdateSlide, onRemoveSlide, onSaveTemplate, onDetach, onEditTemplate, savedTemplates 
}) => {
    const [activeTab, setActiveTab] = useState<'content' | 'element' | 'container'>('content');

    let displayElement = selectedElement;
    let isGlobalInstance = false;
    
    if (selectedElement?.type === 'global') {
        const t = savedTemplates.find(x => x.id === selectedElement.props.templateId);
        if (t) { displayElement = t.element; isGlobalInstance = true; }
    }

    const isLayoutElement = displayElement ? LAYOUT_TYPES.includes(displayElement.type) : false;

    const handleAnimationUpdate = (key: keyof AnimationSettings, value: any) => {
        if (!selectedElement) return;
        const currentAnim = selectedElement.props.animation || { type: 'none' };
        onUpdateProps(selectedElement.id, { animation: { ...currentAnim, [key]: value } });
    };

    const handleElementStyleUpdate = (key: string, value: string) => { 
        if (!selectedElement) return;
        const currentStyle = selectedElement.props.elementStyle || {};
        onUpdateProps(selectedElement.id, { elementStyle: { ...currentStyle, [key]: value } });
    };
    const handleElementClassUpdate = (value: string) => {
        if (!selectedElement) return;
        onUpdateProps(selectedElement.id, { elementClassName: value });
    };

    return (
        <aside className="w-80 bg-white border-l border-gray-200 shrink-0 overflow-y-auto shadow-lg z-20 h-full flex flex-col">
            {!selectedElement || !displayElement ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8 text-center bg-gray-50/50">
                    <Icons.Settings className="w-12 h-12 mb-4" />
                    <h3 className="text-sm font-semibold text-gray-600">No Selection</h3>
                </div>
            ) : (
                <>
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                    <div className="flex-1 mr-4">
                        <input className="text-sm font-bold text-gray-800 bg-transparent border-b border-dashed border-transparent hover:border-gray-300 focus:border-indigo-500 outline-none w-full" value={displayElement.name} onChange={(e) => onUpdateName(selectedElement.id, e.target.value)} />
                        <div className="flex items-center bg-gray-100 rounded px-2 py-0.5 mt-1"><span className="text-[10px] text-gray-400 font-mono mr-2">ID:</span><input className="text-[10px] text-gray-600 font-mono bg-transparent outline-none w-full" value={selectedElement.id} onChange={(e) => onUpdateId(selectedElement.id, e.target.value)} /></div>
                    </div>
                    <div className="flex items-center gap-1"><button onClick={() => onDuplicate(selectedElement.id)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"><Icons.Copy /></button><button onClick={() => onDelete(selectedElement.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"><Icons.Trash /></button></div>
                </div>
                
                <div className="flex border-b border-gray-200 bg-white shrink-0">
                    <button onClick={() => setActiveTab('content')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'content' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500'}`}>Content</button>
                    {!isLayoutElement && <button onClick={() => setActiveTab('element')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'element' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500'}`}>Element</button>}
                    <button onClick={() => setActiveTab('container')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider ${activeTab === 'container' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500'}`}>Container</button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isGlobalInstance && activeTab === 'content' ? (
                         <div className="p-8 flex flex-col items-center justify-center text-center gap-4">
                             <Icons.Globe className="w-10 h-10 text-amber-500" />
                             <p className="text-gray-500 text-xs italic">This is a Global instance. Changes made to the master will reflect here.</p>
                             <div className="flex flex-col w-full gap-2">
                                <button onClick={() => onEditTemplate(selectedElement.props.templateId!)} className="w-full py-2 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700">Edit Master Component</button>
                                <button onClick={() => onDetach(selectedElement.id)} className="w-full py-2 border border-gray-300 text-gray-600 text-xs font-bold rounded hover:bg-gray-50">Detach Instance</button>
                             </div>
                         </div>
                    ) : (
                        <div className="p-5">
                            {activeTab === 'content' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className={sectionTitleClass}>Element Data</h3>
                                        {displayElement.type === 'text' && (
                                            <div><label className={labelClass}>Text Content</label><textarea className={inputClass} rows={4} value={displayElement.props.content || ''} onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })} /></div>
                                        )}
                                        {displayElement.type === 'heading' && (
                                            <div className="space-y-3">
                                                <div><label className={labelClass}>Level</label><select className={inputClass} value={displayElement.props.level || 2} onChange={(e) => onUpdateProps(selectedElement.id, { level: parseInt(e.target.value) })}><option value={1}>H1</option><option value={2}>H2</option><option value={3}>H3</option><option value={4}>H4</option><option value={5}>H5</option><option value={6}>H6</option></select></div>
                                                <div><label className={labelClass}>Heading Text</label><input className={inputClass} value={displayElement.props.content || ''} onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })} /></div>
                                            </div>
                                        )}
                                        {displayElement.type === 'button' && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className={labelClass}>Label</label>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-gray-400">Icon Only</span>
                                                        <input type="checkbox" checked={displayElement.props.buttonIsIconOnly || false} onChange={(e) => onUpdateProps(selectedElement.id, { buttonIsIconOnly: e.target.checked })} />
                                                    </div>
                                                </div>
                                                {!displayElement.props.buttonIsIconOnly && (
                                                    <input className={inputClass} value={displayElement.props.content || ''} onChange={(e) => onUpdateProps(selectedElement.id, { content: e.target.value })} />
                                                )}
                                                <div><label className={labelClass}>Action</label><select className={inputClass} value={displayElement.props.buttonAction || 'link'} onChange={(e) => onUpdateProps(selectedElement.id, { buttonAction: e.target.value })}><option value="link">External Link</option><option value="popup">Open Popup</option><option value="submit">Submit Form</option></select></div>
                                                {displayElement.props.buttonAction === 'link' && <div><label className={labelClass}>URL</label><input className={inputClass} value={displayElement.props.href || ''} onChange={(e) => onUpdateProps(selectedElement.id, { href: e.target.value })} /></div>}
                                                {displayElement.props.buttonAction === 'popup' && <div><label className={labelClass}>Popup Target ID</label><input className={inputClass} value={displayElement.props.popupTargetId || ''} onChange={(e) => onUpdateProps(selectedElement.id, { popupTargetId: e.target.value })} placeholder="e.g. contact-form" /></div>}
                                                <div className="grid grid-cols-2 gap-3 pt-2">
                                                    <div><label className={labelClass}>Left Icon</label><select className={inputClass} value={displayElement.props.buttonIconLeft || ''} onChange={(e) => onUpdateProps(selectedElement.id, { buttonIconLeft: e.target.value })}><option value="">None</option>{ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}</select></div>
                                                    <div><label className={labelClass}>Right Icon</label><select className={inputClass} value={displayElement.props.buttonIconRight || ''} onChange={(e) => onUpdateProps(selectedElement.id, { buttonIconRight: e.target.value })}><option value="">None</option>{ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}</select></div>
                                                </div>
                                            </div>
                                        )}
                                        {/* Logo and Menu Properties */}
                                        {displayElement.type === 'logo' && (
                                            <div className="space-y-3">
                                                <div><label className={labelClass}>Logo Type</label><select className={inputClass} value={displayElement.props.logoType || 'text'} onChange={(e) => onUpdateProps(selectedElement.id, { logoType: e.target.value })}><option value="text">Text</option><option value="image">Image</option></select></div>
                                                {displayElement.props.logoType === 'image' ? (
                                                    <div><label className={labelClass}>Src</label><input className={inputClass} value={displayElement.props.logoSrc || ''} onChange={(e) => onUpdateProps(selectedElement.id, { logoSrc: e.target.value })} /></div>
                                                ) : (
                                                    <div><label className={labelClass}>Text</label><input className={inputClass} value={displayElement.props.logoText || ''} onChange={(e) => onUpdateProps(selectedElement.id, { logoText: e.target.value })} /></div>
                                                )}
                                                <div><label className={labelClass}>Width</label><input className={inputClass} value={displayElement.props.logoWidth || ''} onChange={(e) => onUpdateProps(selectedElement.id, { logoWidth: e.target.value })} placeholder="120px" /></div>
                                                <div><label className={labelClass}>Link Href</label><input className={inputClass} value={displayElement.props.href || ''} onChange={(e) => onUpdateProps(selectedElement.id, { href: e.target.value })} /></div>
                                            </div>
                                        )}
                                        {displayElement.type === 'menu' && (
                                            <div className="space-y-4">
                                                <div><label className={labelClass}>Mobile Breakpoint</label><select className={inputClass} value={displayElement.props.mobileMenuBreakpoint || 'md'} onChange={(e) => onUpdateProps(selectedElement.id, { mobileMenuBreakpoint: e.target.value })}><option value="sm">sm</option><option value="md">md</option><option value="lg">lg</option><option value="none">None</option></select></div>
                                                <div className="pt-2 border-t border-gray-100">
                                                    <label className={labelClass}>Nav Links</label>
                                                    <div className="space-y-2">
                                                        {(displayElement.props.navLinks || []).map((link: NavLinkItem, i: number) => (
                                                            <div key={link.id} className="bg-gray-50 border p-2 rounded flex flex-col gap-2">
                                                                <input className={inputClass} value={link.label} onChange={(e) => onUpdateNavLink(selectedElement.id, i, 'label', e.target.value)} />
                                                                <input className={inputClass} placeholder="Href" value={link.href || ''} onChange={(e) => onUpdateNavLink(selectedElement.id, i, 'href', e.target.value)} />
                                                                <button onClick={() => onRemoveNavLink(selectedElement.id, i)} className="text-[10px] text-red-500 font-bold uppercase hover:bg-red-50 p-1 rounded">Remove</button>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => onAddNavLink(selectedElement.id)} className="w-full py-2 border border-dashed border-gray-300 text-gray-400 text-xs font-bold rounded">+ Add Link</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {/* Form Field Properties */}
                                        {(displayElement.type === 'input' || displayElement.type === 'textarea' || displayElement.type === 'select' || displayElement.type === 'radio' || displayElement.type === 'checkbox') && (
                                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                                <h3 className={sectionTitleClass}>Field Settings</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div><label className={labelClass}>Label</label><input className={inputClass} value={displayElement.props.fieldLabel || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldLabel: e.target.value })} /></div>
                                                    <div><label className={labelClass}>Name</label><input className={inputClass} value={displayElement.props.fieldName || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldName: e.target.value })} placeholder="field_id" /></div>
                                                </div>
                                                {displayElement.type === 'input' && (
                                                    <div className="space-y-3">
                                                        <div><label className={labelClass}>Type</label><select className={inputClass} value={displayElement.props.inputType || 'text'} onChange={(e) => onUpdateProps(selectedElement.id, { inputType: e.target.value })}><option value="text">Text</option><option value="email">Email</option><option value="password">Password</option><option value="number">Number</option><option value="tel">Phone</option><option value="url">URL</option><option value="date">Date</option><option value="hidden">Hidden</option></select></div>
                                                        <div><label className={labelClass}>Placeholder</label><input className={inputClass} value={displayElement.props.fieldPlaceholder || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldPlaceholder: e.target.value })} /></div>
                                                        <div><label className={labelClass}>Default Value</label><input className={inputClass} value={displayElement.props.fieldDefaultValue || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldDefaultValue: e.target.value })} /></div>
                                                    </div>
                                                )}
                                                {displayElement.type === 'textarea' && (
                                                    <div className="space-y-3">
                                                        <div><label className={labelClass}>Rows</label><input type="number" className={inputClass} value={displayElement.props.fieldRows || 4} onChange={(e) => onUpdateProps(selectedElement.id, { fieldRows: parseInt(e.target.value) })} /></div>
                                                        <div><label className={labelClass}>Placeholder</label><input className={inputClass} value={displayElement.props.fieldPlaceholder || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldPlaceholder: e.target.value })} /></div>
                                                    </div>
                                                )}
                                                {displayElement.type === 'select' && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <input type="checkbox" id="multi" checked={displayElement.props.fieldMultiple || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldMultiple: e.target.checked })} />
                                                            <label htmlFor="multi" className={labelClass}>Multiple Selection</label>
                                                        </div>
                                                        <div className="pt-2 border-t">
                                                            <label className={labelClass}>Options</label>
                                                            {(displayElement.props.fieldOptions || []).map((opt: any, i: number) => (
                                                                <div key={i} className="flex gap-1 mb-1">
                                                                    <input className={inputClass} placeholder="Label" value={opt.label} onChange={(e) => {
                                                                        const opts = [...(displayElement!.props.fieldOptions || [])];
                                                                        opts[i] = { ...opts[i], label: e.target.value };
                                                                        onUpdateProps(selectedElement.id, { fieldOptions: opts });
                                                                    }} />
                                                                    <input className={inputClass} placeholder="Value" value={opt.value} onChange={(e) => {
                                                                        const opts = [...(displayElement!.props.fieldOptions || [])];
                                                                        opts[i] = { ...opts[i], value: e.target.value };
                                                                        onUpdateProps(selectedElement.id, { fieldOptions: opts });
                                                                    }} />
                                                                </div>
                                                            ))}
                                                            <button onClick={() => {
                                                                const opts = [...(displayElement!.props.fieldOptions || [])];
                                                                opts.push({ label: 'New', value: 'new' });
                                                                onUpdateProps(selectedElement.id, { fieldOptions: opts });
                                                            }} className="w-full text-[10px] font-bold py-1 border border-dashed rounded mt-1">+ Add Option</button>
                                                        </div>
                                                    </div>
                                                )}
                                                {(displayElement.type === 'radio' || displayElement.type === 'checkbox') && (
                                                    <div className="space-y-3">
                                                        <div><label className={labelClass}>Submission Value</label><input className={inputClass} value={displayElement.props.fieldValue || ''} onChange={(e) => onUpdateProps(selectedElement.id, { fieldValue: e.target.value })} /></div>
                                                        <div className="flex items-center gap-2">
                                                            <input type="checkbox" id="chkd" checked={displayElement.props.checked || false} onChange={(e) => onUpdateProps(selectedElement.id, { checked: e.target.checked })} />
                                                            <label htmlFor="chkd" className={labelClass}>Checked by Default</label>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 py-2 bg-gray-50 px-3 rounded border border-gray-100">
                                                    <div className="flex items-center gap-2">
                                                        <input type="checkbox" id="req" checked={displayElement.props.fieldRequired || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldRequired: e.target.checked })} />
                                                        <label htmlFor="req" className="text-[10px] font-bold text-gray-600">REQUIRED</label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input type="checkbox" id="hid" checked={displayElement.props.fieldHidden || false} onChange={(e) => onUpdateProps(selectedElement.id, { fieldHidden: e.target.checked })} />
                                                        <label htmlFor="hid" className="text-[10px] font-bold text-gray-600">HIDDEN</label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Animation Section */}
                                    <div className="pt-4 border-t border-gray-100 space-y-4">
                                         <h3 className={sectionTitleClass}>Motion & Animation</h3>
                                         <div className="space-y-3">
                                            <div><label className={labelClass}>Effect Type</label><select className={inputClass} value={displayElement.props.animation?.type || 'none'} onChange={(e) => handleAnimationUpdate('type', e.target.value)}>{ANIMATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                                            {displayElement.props.animation?.type !== 'none' && (
                                                <>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div><label className={labelClass}>Duration (s)</label><input type="number" step="0.1" className={inputClass} value={displayElement.props.animation?.duration ?? 1} onChange={(e) => handleAnimationUpdate('duration', parseFloat(e.target.value))} /></div>
                                                        <div><label className={labelClass}>Delay (s)</label><input type="number" step="0.1" className={inputClass} value={displayElement.props.animation?.delay ?? 0} onChange={(e) => handleAnimationUpdate('delay', parseFloat(e.target.value))} /></div>
                                                    </div>
                                                    <div><label className={labelClass}>Easing</label><select className={inputClass} value={displayElement.props.animation?.ease || 'power2.out'} onChange={(e) => handleAnimationUpdate('ease', e.target.value)}>{EASING_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                                                </>
                                            )}
                                         </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'element' && !isLayoutElement && <DesignSettings style={displayElement.props.elementStyle || {}} className={displayElement.props.elementClassName || ''} onUpdateStyle={handleElementStyleUpdate} onUpdateClassName={handleElementClassUpdate} onFileUpload={onFileUpload} isTextElement={displayElement.type === 'text' || displayElement.type === 'heading'} />}
                            {activeTab === 'container' && <DesignSettings style={displayElement.props.style || {}} className={displayElement.props.className || ''} onUpdateStyle={(k, v) => onUpdateStyle(selectedElement.id, k, v)} onUpdateClassName={(v) => onUpdateProps(selectedElement.id, { className: v })} onFileUpload={onFileUpload} isTextElement={false} />}
                        </div>
                    )}
                </div>
                </>
            )}
        </aside>
    );
};
