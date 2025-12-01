

import React, { useState } from 'react';
import { ElementType, PageElement } from '../types';
import { Icons } from './Icons';

interface SidebarProps {
    onDragStart: (e: React.DragEvent, type: ElementType) => void;
    elements: PageElement[];
    selectedId: string | null;
    onSelect: (id: string) => void;
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
        default: return Icons.Box;
    }
};

interface LayerNodeProps {
    element: PageElement;
    depth: number;
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const LayerNode: React.FC<LayerNodeProps> = ({ 
    element, 
    depth, 
    selectedId, 
    onSelect 
}) => {
    const Icon = getIconForType(element.type);
    const isSelected = selectedId === element.id;
    const hasChildren = element.children && element.children.length > 0;
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="select-none">
            <div 
                className={`flex items-center gap-2 py-1.5 px-2 text-xs cursor-pointer border-b border-gray-50 transition-colors ${isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect(element.id);
                }}
            >
                <div 
                    className={`w-4 h-4 flex items-center justify-center text-gray-400 transition-transform ${hasChildren ? 'hover:text-gray-600' : 'opacity-0'}`}
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
                
                <Icon width={14} height={14} className={isSelected ? 'text-indigo-600' : 'text-gray-400'} />
                <span className="truncate">{element.name}</span>
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export const Sidebar: React.FC<SidebarProps> = ({ onDragStart, elements, selectedId, onSelect }) => {
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
                        />
                    ))
                )}
            </div>
        )}
      </div>
    </aside>
  );
};
