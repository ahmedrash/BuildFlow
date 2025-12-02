

import React, { useState } from 'react';
import { ElementType, PageElement } from '../types';
import { Icons } from './Icons';

interface SidebarProps {
    onDragStart: (e: React.DragEvent, type: ElementType) => void;
    elements: PageElement[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    // Layer actions
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdateProps: (id: string, props: any) => void;
    onDropElement: (targetId: string, position: 'inside' | 'after' | 'before', data: any) => void;
}

const SidebarItem = ({ type, icon: Icon, label, onDragStart }: { type: ElementType, icon: any, label: string, onDragStart: (e: React.DragEvent, type: ElementType) => void }) => (
    <div
       draggable
       onDragStart={(e) => onDragStart(e, type)}
       className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all cursor-grab active:cursor-grabbing group h-20"
     >
       <div className="text-gray-500 group-hover:text-indigo-500 mb-2">
         <Icon />
       </div>
       <span className="text-[10px] font-medium text-gray-600 group-hover:text-gray-900 text-center leading-tight">{label}</span>
     </div>
 );

const getIconForType = (type: ElementType) => {
    switch (type) {
        case 'section': return Icons.Layout;
        case 'container': return Icons.Box;
        case 'columns': return Icons.Layout;
        case 'text': return Icons.Type;
        case 'heading': return Icons.Heading;
        case 'image': return Icons.Image;
        case 'button': return Icons.Button;
        case 'video': return Icons.Video;
        case 'list': return Icons.List;
        case 'map': return Icons.Map;
        case 'form': return Icons.Form;
        case 'input': return Icons.Input;
        case 'select': return Icons.Select;
        case 'textarea': return Icons.Textarea;
        case 'radio': return Icons.Radio;
        case 'checkbox': return Icons.Checkbox;
        case 'gallery': return Icons.Grid;
        case 'navbar': return Icons.Menu;
        case 'testimonial': return Icons.MessageSquare;
        case 'card': return Icons.Square;
        case 'slider': return Icons.Slider;
        case 'customCode': return Icons.Code;
        case 'logo': return Icons.Star;
        default: return Icons.Box;
    }
};

interface LayerNodeProps {
    element: PageElement;
    depth: number;
    selectedId: string | null;
    onSelect: (id: string) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdateProps: (id: string, props: any) => void;
    onDropElement: (targetId: string, position: 'inside' | 'after' | 'before', data: any) => void;
}

const LayerNode: React.FC<LayerNodeProps> = ({ 
    element, 
    depth, 
    selectedId, 
    onSelect,
    onDelete,
    onDuplicate,
    onUpdateProps,
    onDropElement
}) => {
    const Icon = getIconForType(element.type);
    const isSelected = selectedId === element.id;
    const hasChildren = element.children && element.children.length > 0;
    const [isExpanded, setIsExpanded] = useState(true);
    const [dropPosition, setDropPosition] = useState<'inside' | 'top' | 'bottom' | null>(null);

    const isHidden = element.props.isHidden;

    const handleDragStart = (e: React.DragEvent) => {
        e.stopPropagation();
        e.dataTransfer.setData('type', 'move');
        e.dataTransfer.setData('id', element.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = e.currentTarget.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const height = rect.height;
        
        // Logic similar to EditorCanvas but adapted for Tree items
        // Top 25% = before, Bottom 25% = after, Middle = inside (if container)
        const isContainer = ['section', 'container', 'columns', 'navbar', 'slider', 'card', 'form'].includes(element.type);
        
        if (y < height * 0.25) {
            setDropPosition('top');
        } else if (y > height * 0.75) {
            setDropPosition('bottom');
        } else {
            setDropPosition(isContainer ? 'inside' : 'bottom'); // If not container, middle defaults to bottom (after)
        }
        
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDropPosition(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDropPosition(null);

        const type = e.dataTransfer.getData('type');
        const draggedId = e.dataTransfer.getData('id');
        
        if (type === 'move' && draggedId === element.id) return;

        let position: 'inside' | 'before' | 'after' = 'inside';
        if (dropPosition === 'top') position = 'before';
        if (dropPosition === 'bottom') position = 'after';

        // Prepare data
        let data: any = {};
        if (type === 'new') data = { elementType: e.dataTransfer.getData('elementType') };
        else if (type === 'move') data = { id: draggedId };

        onDropElement(element.id, position, { type, ...data });
    };

    return (
        <div className="select-none">
            <div 
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative group flex items-center justify-between py-1.5 px-2 text-xs cursor-pointer border-b border-gray-50 transition-colors ${isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-600'} ${isHidden ? 'opacity-50' : ''}`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(element.id);
                }}
            >
                {/* Drop Indicators */}
                {dropPosition === 'top' && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />}
                {dropPosition === 'bottom' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 z-10" />}
                {dropPosition === 'inside' && <div className="absolute inset-0 border-2 border-blue-500 bg-blue-50/20 z-10 rounded-sm pointer-events-none" />}

                <div className="flex items-center gap-2 overflow-hidden">
                    <div 
                        className={`w-4 h-4 flex items-center justify-center text-gray-400 transition-transform ${hasChildren ? 'hover:text-gray-600' : 'opacity-0 pointer-events-none'}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                    >
                        {hasChildren && (
                            <div className={isExpanded ? '' : '-rotate-90'}>
                                <Icons.ChevronDown width={12} height={12} />
                            </div>
                        )}
                    </div>
                    
                    <Icon width={14} height={14} className={isSelected ? 'text-indigo-600 shrink-0' : 'text-gray-400 shrink-0'} />
                    <span className="truncate">{element.name}</span>
                </div>

                {/* Layer Actions */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-white border border-gray-100 shadow-sm rounded px-1 z-20">
                    <button 
                        className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded"
                        title={isHidden ? "Show" : "Hide"}
                        onClick={(e) => {
                            e.stopPropagation();
                            onUpdateProps(element.id, { isHidden: !isHidden });
                        }}
                    >
                        {isHidden ? <Icons.EyeOff width={12} height={12} /> : <Icons.Eye width={12} height={12} />}
                    </button>
                    <button 
                        className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-200 rounded"
                        title="Duplicate"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate(element.id);
                        }}
                    >
                        <Icons.Copy width={12} height={12} />
                    </button>
                    <button 
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded"
                        title="Delete"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(element.id);
                        }}
                    >
                        <Icons.Trash width={12} height={12} />
                    </button>
                </div>
            </div>
            
            {hasChildren && isExpanded && (
                <div>
                    {element.children!.map(child => (
                        <LayerNode 
                            key={child.id} 
                            element={child} 
                            depth={depth + 1} 
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            onDuplicate={onDuplicate}
                            onUpdateProps={onUpdateProps}
                            onDropElement={onDropElement}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
    onDragStart, 
    elements, 
    selectedId, 
    onSelect,
    onDelete,
    onDuplicate,
    onUpdateProps,
    onDropElement
}) => {
  const [activeTab, setActiveTab] = useState<'elements' | 'layers'>('elements');

  return (
    <aside className="w-72 bg-slate-50 border-r border-gray-200 flex flex-col shrink-0 h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
          <button 
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'elements' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('elements')}
          >
              Elements
          </button>
          <button 
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'layers' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('layers')}
          >
              Layers
          </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'elements' ? (
            <div className="p-4 space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Structure</h3>
                    <div className="grid grid-cols-3 gap-2">
                    <SidebarItem type="section" icon={Icons.Layout} label="Section" onDragStart={onDragStart} />
                    <SidebarItem type="container" icon={Icons.Box} label="Container" onDragStart={onDragStart} />
                    <SidebarItem type="columns" icon={Icons.Layout} label="Columns" onDragStart={onDragStart} />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Basic</h3>
                    <div className="grid grid-cols-3 gap-2">
                    <SidebarItem type="heading" icon={Icons.Heading} label="Heading" onDragStart={onDragStart} />
                    <SidebarItem type="text" icon={Icons.Type} label="Text" onDragStart={onDragStart} />
                    <SidebarItem type="button" icon={Icons.Button} label="Button" onDragStart={onDragStart} />
                    <SidebarItem type="list" icon={Icons.List} label="List" onDragStart={onDragStart} />
                    <SidebarItem type="card" icon={Icons.Square} label="Card" onDragStart={onDragStart} />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Forms</h3>
                    <div className="grid grid-cols-3 gap-2">
                    <SidebarItem type="input" icon={Icons.Input} label="Input" onDragStart={onDragStart} />
                    <SidebarItem type="textarea" icon={Icons.Textarea} label="Textarea" onDragStart={onDragStart} />
                    <SidebarItem type="select" icon={Icons.Select} label="Select" onDragStart={onDragStart} />
                    <SidebarItem type="checkbox" icon={Icons.Checkbox} label="Checkbox" onDragStart={onDragStart} />
                    <SidebarItem type="radio" icon={Icons.Radio} label="Radio" onDragStart={onDragStart} />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Media</h3>
                    <div className="grid grid-cols-3 gap-2">
                    <SidebarItem type="image" icon={Icons.Image} label="Image" onDragStart={onDragStart} />
                    <SidebarItem type="video" icon={Icons.Video} label="Video" onDragStart={onDragStart} />
                    <SidebarItem type="slider" icon={Icons.Slider} label="Slider" onDragStart={onDragStart} />
                    <SidebarItem type="map" icon={Icons.Map} label="Map" onDragStart={onDragStart} />
                    <SidebarItem type="gallery" icon={Icons.Grid} label="Gallery" onDragStart={onDragStart} />
                    <SidebarItem type="logo" icon={Icons.Star} label="Logo" onDragStart={onDragStart} />
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Advanced</h3>
                    <div className="grid grid-cols-3 gap-2">
                    <SidebarItem type="form" icon={Icons.Form} label="Smart Form" onDragStart={onDragStart} />
                    <SidebarItem type="navbar" icon={Icons.Menu} label="Navbar" onDragStart={onDragStart} />
                    <SidebarItem type="testimonial" icon={Icons.MessageSquare} label="Testimonial" onDragStart={onDragStart} />
                    <SidebarItem type="customCode" icon={Icons.Code} label="Code" onDragStart={onDragStart} />
                    </div>
                </div>
            </div>
        ) : (
            <div className="py-2">
                {elements.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs">
                        No elements on page
                    </div>
                ) : (
                    elements.map(el => (
                        <LayerNode 
                            key={el.id} 
                            element={el} 
                            depth={0} 
                            selectedId={selectedId}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            onDuplicate={onDuplicate}
                            onUpdateProps={onUpdateProps}
                            onDropElement={onDropElement}
                        />
                    ))
                )}
            </div>
        )}
      </div>
    </aside>
  );
};