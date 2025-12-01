

import React, { useState, useCallback, useMemo } from 'react';
import { PageElement, ElementType, SavedTemplate, BuildFlowEditorProps } from '../types';
import { EditorCanvas } from './EditorCanvas';
import { Icons } from './Icons';
import { PreviewFrame } from './PreviewFrame';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PropertiesPanel } from './properties/PropertiesPanel';
import { TEMPLATES } from '../data/constants';
import { Toast } from './ui/Toast';
import { PromptModal } from './ui/PromptModal';
import { exportHtml } from '../utils/htmlExporter';
import { EditorConfigContext, PopupContext } from './EditorConfigContext';

export const BuildFlowEditor: React.FC<BuildFlowEditorProps> = ({ 
    initialData = TEMPLATES[0].elements, 
    savedTemplates: externalTemplates = [], 
    onSave, 
    onSaveTemplate: onExternalSaveTemplate,
    onDeleteTemplate: onExternalDeleteTemplate,
    onUploadImage,
    googleMapsApiKey,
    recaptchaSiteKey
}) => {
  const [elements, setElements] = useState<PageElement[]>(initialData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  
  // Template State
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(externalTemplates);
  
  // Edit Master Template Mode
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Popup State
  const [activePopupId, setActivePopupId] = useState<string | null>(null);

  // Modals
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [templatesTab, setTemplatesTab] = useState<'presets' | 'saved'>('presets');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Prompt Modal State
  const [promptConfig, setPromptConfig] = useState<{
      isOpen: boolean;
      title: string;
      defaultValue: string;
      showGlobalOption?: boolean;
      onConfirm: (value: string, isGlobal: boolean) => void;
  }>({
      isOpen: false,
      title: '',
      defaultValue: '',
      onConfirm: () => {}
  });

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Page Settings
  const [pageSettings, setPageSettings] = useState({ title: 'My Awesome Page', description: 'Built with BuildFlow' });

  const showToast = (msg: string) => {
      setToastMessage(msg);
  };

  // -- Recursive Helpers --
  const findElement = useCallback((id: string, list: PageElement[]): PageElement | null => {
    for (const el of list) {
      if (el.id === id) return el;
      if (el.children) {
        const found = findElement(id, el.children);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const updateElementRecursively = (list: PageElement[], id: string, updater: (el: PageElement) => PageElement): PageElement[] => {
    return list.map(el => {
      if (el.id === id) {
        return updater(el);
      }
      if (el.children) {
        return { ...el, children: updateElementRecursively(el.children, id, updater) };
      }
      return el;
    });
  };

  const removeElementRecursively = (list: PageElement[], id: string): { newList: PageElement[], removed: PageElement | null } => {
    let removedItem: PageElement | null = null;
    
    const filterFn = (items: PageElement[]): PageElement[] => {
        return items.filter(el => {
            if (el.id === id) {
                removedItem = el;
                return false;
            }
            return true;
        }).map(el => {
            if (el.children) {
                return { ...el, children: filterFn(el.children) };
            }
            return el;
        });
    };

    const newList = filterFn(list);
    return { newList, removed: removedItem };
  };

  const insertElementRecursively = (
      list: PageElement[], 
      targetId: string, 
      position: 'inside' | 'after' | 'before', 
      newElement: PageElement
  ): PageElement[] => {
      if (position === 'after' || position === 'before') {
          const rootIdx = list.findIndex(e => e.id === targetId);
          if (rootIdx !== -1) {
             const newArr = [...list];
             const insertIdx = position === 'after' ? rootIdx + 1 : rootIdx;
             newArr.splice(insertIdx, 0, newElement);
             return newArr;
          }

          return list.map(el => {
             if (el.children) {
                 const childIdx = el.children.findIndex(c => c.id === targetId);
                 if (childIdx !== -1) {
                     const newChildren = [...el.children];
                     const insertIdx = position === 'after' ? childIdx + 1 : childIdx;
                     newChildren.splice(insertIdx, 0, newElement);
                     return { ...el, children: newChildren };
                 }
                 return { ...el, children: insertElementRecursively(el.children, targetId, position, newElement) };
             }
             return el;
          });
      }

      return list.map(el => {
          if (el.id === targetId) {
              return { ...el, children: [...(el.children || []), newElement] };
          }
          if (el.children) {
              return { ...el, children: insertElementRecursively(el.children, targetId, position, newElement) };
          }
          return el;
      });
  };
  
  const cloneRecursively = (el: PageElement): PageElement => {
      const newId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return {
          ...el,
          id: newId,
          children: el.children ? el.children.map(cloneRecursively) : undefined
      };
  };

  // -- Actions --

  const getActiveElements = () => {
      if (editingTemplateId) {
          const template = savedTemplates.find(t => t.id === editingTemplateId);
          return template ? [template.element] : [];
      }
      return elements;
  };
  
  const setActiveElements = (updater: (prev: PageElement[]) => PageElement[]) => {
      if (editingTemplateId) {
          setSavedTemplates(prev => prev.map(t => {
              if (t.id === editingTemplateId) {
                   const newElements = updater([t.element]);
                   return { ...t, element: newElements[0] };
              }
              return t;
          }));
      } else {
          setElements(updater);
      }
  };

  const handleSelect = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setSelectedId(id);
  };

  const checkIdExists = useCallback((id: string, list: PageElement[]): boolean => {
      for (const el of list) {
          if (el.id === id) return true;
          if (el.children && checkIdExists(id, el.children)) return true;
      }
      return false;
  }, []);

  const handleUpdateId = (currentId: string, newId: string) => {
      if (currentId === newId) return;
      if (!newId.trim()) {
          showToast("ID cannot be empty");
          return;
      }
      
      const activeList = getActiveElements();
      
      if (checkIdExists(newId, activeList)) {
          showToast(`ID "${newId}" already exists. Please choose a unique ID.`);
          return;
      }

      setActiveElements(prev => updateElementRecursively(prev, currentId, (el) => ({ ...el, id: newId })));
      setSelectedId(newId);
  };
  
  const handleUpdateName = (id: string, name: string) => {
      if (!name.trim()) return;
      setActiveElements(prev => updateElementRecursively(prev, id, (el) => ({ ...el, name })));
  };

  const handleUpdateProps = (id: string, newProps: any) => {
    setActiveElements(prev => updateElementRecursively(prev, id, (el) => ({
      ...el,
      props: { ...el.props, ...newProps }
    })));
  };

  const handleUpdateStyle = (id: string, styleKey: string, value: string) => {
    setActiveElements(prev => updateElementRecursively(prev, id, (el) => ({
      ...el,
      props: { 
        ...el.props, 
        style: { ...el.props.style, [styleKey]: value } 
      }
    })));
  };

  const handleDelete = (id: string) => {
    setActiveElements(prev => removeElementRecursively(prev, id).newList);
    setSelectedId(null);
  };

  const handleDuplicate = (id: string) => {
    const activeList = getActiveElements();
    const elToClone = findElement(id, activeList);
    if (!elToClone) return;

    const cloned = cloneRecursively(elToClone);
    setActiveElements(prev => insertElementRecursively(prev, id, 'after', cloned));
    setTimeout(() => setSelectedId(cloned.id), 0);
  };

  // Template Actions
  
  const handleSaveTemplate = (elementId: string) => {
      const activeList = getActiveElements();
      const el = findElement(elementId, activeList);
      if (!el) return;
      
      setPromptConfig({
          isOpen: true,
          title: "Save as Template",
          defaultValue: el.name,
          showGlobalOption: true,
          onConfirm: (name, isGlobal) => {
              const newTemplateId = `tpl-${Date.now()}`;
              const newTemplate: SavedTemplate = {
                  id: newTemplateId,
                  name,
                  isGlobal,
                  element: cloneRecursively(el)
              };
              
              setSavedTemplates(prev => [...prev, newTemplate]);
              if (onExternalSaveTemplate) onExternalSaveTemplate(newTemplate);

              setIsTemplatesModalOpen(true);
              setTemplatesTab('saved');
              
              if (isGlobal) {
                  // Convert the current element to a global instance
                  setActiveElements(prev => updateElementRecursively(prev, elementId, (oldEl) => ({
                      id: oldEl.id,
                      type: 'global',
                      name: name,
                      props: {
                          templateId: newTemplateId
                      }
                  })));
                  showToast("Saved & converted to Global Component!");
              } else {
                  showToast("Template saved!");
              }
          }
      });
  };
  
  const handleEditTemplate = (templateId: string) => {
      setIsTemplatesModalOpen(false);
      setEditingTemplateId(templateId);
      const t = savedTemplates.find(x => x.id === templateId);
      if (t) setSelectedId(t.element.id);
      showToast("Editing Master Template");
  };
  
  const handleFinishEditingTemplate = () => {
      setEditingTemplateId(null);
      setSelectedId(null);
      showToast("Master Template saved");
  };
  
  const handleDeleteTemplate = (id: string) => {
      setSavedTemplates(prev => prev.filter(t => t.id !== id));
      if (onExternalDeleteTemplate) onExternalDeleteTemplate(id);
      showToast("Template deleted");
  };
  
  const handleDetachElement = (id: string) => {
      const el = findElement(id, getActiveElements());
      if (!el || el.type !== 'global' || !el.props.templateId) return;
      
      const template = savedTemplates.find(t => t.id === el.props.templateId);
      if (!template) {
          showToast("Original template not found.");
          return;
      }
      
      const deepCopy = cloneRecursively(template.element);
      setActiveElements(prev => {
           const replaceRecursively = (list: PageElement[]): PageElement[] => {
               return list.map(item => {
                   if (item.id === id) return deepCopy;
                   if (item.children) return { ...item, children: replaceRecursively(item.children) };
                   return item;
               });
           };
           return replaceRecursively(prev);
      });
      setSelectedId(deepCopy.id);
      showToast("Component detached");
  };

  const handleAddNavLink = (id: string) => {
      const el = findElement(id, getActiveElements());
      if (el) {
          const newLinks = [...(el.props.navLinks || []), { label: 'New Link', href: '#' }];
          handleUpdateProps(id, { navLinks: newLinks });
      }
  };

  const handleUpdateNavLink = (id: string, index: number, field: 'label' | 'href', value: string) => {
      const el = findElement(id, getActiveElements());
      if (el && el.props.navLinks) {
          const newLinks = [...el.props.navLinks];
          newLinks[index] = { ...newLinks[index], [field]: value };
          handleUpdateProps(id, { navLinks: newLinks });
      }
  };

  const handleRemoveNavLink = (id: string, index: number) => {
      const el = findElement(id, getActiveElements());
      if (el && el.props.navLinks) {
          const newLinks = el.props.navLinks.filter((_, i) => i !== index);
          handleUpdateProps(id, { navLinks: newLinks });
      }
  };
  
  const handleAddSlide = (id: string) => {
      const newSlide: PageElement = {
          id: `slide-${Date.now()}`,
          type: 'container',
          name: 'New Slide',
          props: {
              className: 'w-full flex flex-col items-center justify-center p-10',
              style: { backgroundColor: '#f3f4f6', height: '100%' }
          },
          children: [
               { id: `txt-${Date.now()}`, type: 'heading', name: 'Slide Title', props: { level: 2 as any, content: 'New Slide Title' } }
          ]
      };
      setActiveElements(prev => insertElementRecursively(prev, id, 'inside', newSlide));
  };
  
  const handleRemoveSlide = (id: string, index: number) => {
      setActiveElements(prev => updateElementRecursively(prev, id, (el) => {
          if (!el.children) return el;
          const newChildren = el.children.filter((_, i) => i !== index);
          let newIndex = el.props.sliderActiveIndex || 0;
          if (newIndex >= newChildren.length && newChildren.length > 0) {
              newIndex = newChildren.length - 1;
          } else if (newChildren.length === 0) {
              newIndex = 0;
          }
          return {
              ...el,
              children: newChildren,
              props: { ...el.props, sliderActiveIndex: newIndex }
          };
      }));
  };

  // -- DnD Logic --
  const handleSidebarDragStart = (e: React.DragEvent, type: ElementType) => {
      e.dataTransfer.setData('type', 'new');
      e.dataTransfer.setData('elementType', type);
      e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDropElement = (targetId: string, position: 'inside' | 'after' | 'before', data: any) => {
      let newElement: PageElement;

      if (data.type === 'new') {
          const type = data.elementType as ElementType;
          const newId = `el-${Date.now()}`;
          let children: PageElement[] | undefined = (type === 'section' || type === 'container' || type === 'columns') ? [] : undefined;
          
          if (type === 'slider') {
             children = [
                 {
                     id: `${newId}-s1`, type: 'container', name: 'Slide 1',
                     props: { className: 'w-full flex flex-col items-center justify-center p-10 bg-gray-100', style: { height: '100%' } },
                     children: [ { id: `${newId}-t1`, type: 'heading', name: 'Title', props: { level: 2, content: 'Slide 1' } } ]
                 },
                 {
                     id: `${newId}-s2`, type: 'container', name: 'Slide 2',
                     props: { className: 'w-full flex flex-col items-center justify-center p-10 bg-gray-200', style: { height: '100%' } },
                     children: [ { id: `${newId}-t2`, type: 'heading', name: 'Title', props: { level: 2, content: 'Slide 2' } } ]
                 }
             ];
          }

          if (type === 'card') {
            children = [
                { id: `${newId}-img`, type: 'image', name: 'Card Image', props: { src: 'https://via.placeholder.com/400x200', alt: 'Card Image', className: 'w-full h-48 object-cover' } },
                {
                    id: `${newId}-body`, type: 'container', name: 'Card Body', props: { className: 'p-5 flex flex-col flex-1' },
                    children: [
                        { id: `${newId}-heading`, type: 'heading', name: 'Card Title', props: { level: 3 as any, content: 'Card Title', className: 'text-xl font-bold mb-2' } },
                        { id: `${newId}-text`, type: 'text', name: 'Card Description', props: { content: 'This is a description for the card element. You can edit this text.', className: 'text-gray-600 mb-4 flex-1 text-sm' } },
                        { id: `${newId}-btn`, type: 'button', name: 'Action', props: { content: 'Read More', buttonAction: 'link', className: 'self-start text-indigo-600 font-medium text-sm', style: { backgroundColor: 'transparent', paddingLeft: '0', paddingRight: '0' } } }
                    ]
                }
            ];
          }

          if (type === 'form') {
              children = [
                  { id: `${newId}-in`, type: 'input', name: 'Email Input', props: { fieldLabel: 'Email Address', fieldName: 'email', inputType: 'email', fieldPlaceholder: 'you@example.com', fieldRequired: true } },
                  { id: `${newId}-btn`, type: 'button', name: 'Submit Button', props: { content: 'Submit', buttonAction: 'submit', className: 'bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition w-full' } }
              ];
          }

          newElement = {
            id: newId, type, name: type.charAt(0).toUpperCase() + type.slice(1),
            props: {
                content: type === 'text' ? 'New Text' : type === 'button' ? 'Click Me' : type === 'heading' ? 'Heading' : undefined,
                style: { padding: type === 'section' || type === 'container' ? '2rem' : '0.5rem', height: type === 'slider' ? '400px' : undefined, backgroundColor: type === 'card' ? '#ffffff' : undefined },
                className: type === 'columns' ? 'grid grid-cols-2 gap-4' : type === 'slider' ? 'relative w-full' : type === 'button' ? 'bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded transition' : type === 'card' ? 'flex flex-col rounded-lg shadow-md overflow-hidden h-full transition-all hover:shadow-lg' : type === 'form' ? 'flex flex-col gap-4 p-4 border border-dashed border-gray-200 rounded' : undefined,
                level: type === 'heading' ? 2 : undefined,
                listType: type === 'list' ? 'ul' : undefined,
                items: type === 'list' ? ['Item 1', 'Item 2', 'Item 3'] : undefined,
                address: type === 'map' ? 'New York, NY' : undefined,
                zoom: type === 'map' ? 13 : undefined,
                mapType: type === 'map' ? 'roadmap' : undefined,
                videoUrl: type === 'video' ? 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' : undefined,
                navLinks: type === 'navbar' ? [{ label: 'Home', href: '#' }, { label: 'About', href: '#' }] : undefined,
                logoText: type === 'navbar' ? 'Logo' : undefined,
                sliderAutoplay: type === 'slider' ? false : undefined,
                sliderInterval: type === 'slider' ? 3000 : undefined,
                sliderNavType: 'chevron',
                sliderShowPagination: true,
                sliderActiveIndex: 0,
                formSubmitButtonText: type === 'form' ? 'Submit' : undefined,
                formLabelLayout: type === 'form' ? 'top' : undefined,
                formSuccessMessage: type === 'form' ? 'Thank you for your submission!' : undefined,
                galleryLayout: type === 'gallery' ? 'grid' : undefined,
                galleryColumnCount: type === 'gallery' ? 3 : undefined,
                galleryGap: type === 'gallery' ? '1rem' : undefined,
                galleryAspectRatio: type === 'gallery' ? 'aspect-square' : undefined,
                galleryObjectFit: type === 'gallery' ? 'cover' : undefined,
                galleryImages: type === 'gallery' ? [ { id: 'g1', src: 'https://picsum.photos/400/300?random=1', alt: 'Image 1' }, { id: 'g2', src: 'https://picsum.photos/400/300?random=2', alt: 'Image 2' }, { id: 'g3', src: 'https://picsum.photos/400/300?random=3', alt: 'Image 3' } ] : undefined,
                testimonialLayout: type === 'testimonial' ? 'grid' : undefined,
                testimonialAvatarSize: type === 'testimonial' ? 'md' : undefined,
                testimonialAvatarShape: type === 'testimonial' ? 'circle' : undefined,
                testimonialBubbleColor: type === 'testimonial' ? '#f9fafb' : undefined,
                testimonialItems: type === 'testimonial' ? [ { id: 't1', content: "This product changed my business completely.", author: "Sarah Johnson", role: "CEO", rating: 5, avatarSrc: "https://i.pravatar.cc/150?u=1" } ] : undefined,
                cardHoverEffect: type === 'card' ? 'lift' : undefined,
                buttonAction: type === 'button' ? 'link' : undefined,
                target: type === 'button' ? '_self' : undefined
            },
            children
          };
      } else if (data.type === 'template') {
          const template = savedTemplates.find(t => t.id === data.templateId);
          if (!template) return;
          if (template.isGlobal) {
              newElement = { id: `global-${Date.now()}`, type: 'global', name: template.name, props: { templateId: template.id } };
          } else {
              newElement = cloneRecursively(template.element);
              newElement.name = template.name;
          }
      } else if (data.type === 'move') {
           const dragId = data.id;
           if (dragId === targetId) return;

           const activeList = getActiveElements();
           const dragEl = findElement(dragId, activeList);
           if (dragEl) {
                // Check if target is a descendant of the dragged element
                const isDescendant = (parent: PageElement, target: string): boolean => {
                    if (!parent.children) return false;
                    for (const child of parent.children) {
                        if (child.id === target) return true;
                        if (isDescendant(child, target)) return true;
                    }
                    return false;
                }
                if (isDescendant(dragEl, targetId)) {
                     showToast("Cannot move element into its own child");
                     return;
                }
           }

           setActiveElements(prev => {
              const { newList, removed } = removeElementRecursively(prev, dragId);
              if (!removed) return prev;
              if (targetId === 'root') return [...newList, removed];
              return insertElementRecursively(newList, targetId, position, removed);
          });
          setSelectedId(dragId);
          return;
      } else {
          return;
      }

      if (targetId === 'root') {
         setActiveElements(prev => [...prev, newElement]);
      } else {
         setActiveElements(prev => insertElementRecursively(prev, targetId, position, newElement));
      }
      setSelectedId(newElement.id);
  };

  const handleExport = () => {
    const html = exportHtml(
        elements, 
        savedTemplates, 
        pageSettings.title, 
        pageSettings.description,
        googleMapsApiKey,
        recaptchaSiteKey
    );
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Website exported to index.html");
  };
  
  // Calculate Popup Targets
  const popupTargets = useMemo(() => {
    const targets = new Set<string>();
    const scan = (els: PageElement[]) => {
        els.forEach(el => {
             if (el.type === 'button' && el.props.buttonAction === 'popup' && el.props.popupTargetId) {
                 targets.add(el.props.popupTargetId);
             }
             if (el.children) scan(el.children);
        });
    };
    scan(getActiveElements());
    return targets;
  }, [elements, editingTemplateId, savedTemplates]);

  const openPopup = (id: string) => {
      // Only open popups in preview mode or if we want to test
      if (isPreview) setActivePopupId(id);
  };

  const activeElements = getActiveElements();
  const selectedElement = selectedId ? findElement(selectedId, activeElements) : null;
  const viewportWidth = viewMode === 'mobile' ? '375px' : viewMode === 'tablet' ? '768px' : '100%';

  return (
    <EditorConfigContext.Provider value={{ googleMapsApiKey, recaptchaSiteKey }}>
        <PopupContext.Provider value={{ openPopup, popupTargets }}>
        <div className="flex flex-col h-full bg-white font-sans text-slate-900">
        
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
        
        <PromptModal 
            isOpen={promptConfig.isOpen}
            title={promptConfig.title}
            defaultValue={promptConfig.defaultValue}
            showGlobalOption={promptConfig.showGlobalOption}
            onClose={() => setPromptConfig(prev => ({ ...prev, isOpen: false }))}
            onConfirm={promptConfig.onConfirm}
        />

        <Topbar 
            viewMode={viewMode}
            setViewMode={setViewMode}
            isPreview={isPreview}
            setIsPreview={setIsPreview}
            onOpenTemplates={() => { setIsTemplatesModalOpen(true); setTemplatesTab('presets'); }}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onSave={() => onSave ? onSave(elements) : null}
            onExportHtml={handleExport}
        />
        
        {editingTemplateId && (
            <div className="bg-amber-100 px-4 py-2 text-center text-sm font-medium text-amber-800 flex justify-between items-center shadow-inner">
                <span>You are editing a Master Template. Changes will affect all Global instances.</span>
                <button onClick={handleFinishEditingTemplate} className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600 text-xs">Finish Editing</button>
            </div>
        )}

        <div className="flex flex-1 overflow-hidden">
            {!isPreview && (
            <Sidebar 
                onDragStart={handleSidebarDragStart} 
                elements={activeElements}
                selectedId={selectedId}
                onSelect={(id) => handleSelect(id)}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onUpdateProps={handleUpdateProps}
                onDropElement={handleDropElement}
            />
            )}

            <main 
                className="flex-1 overflow-y-auto bg-gray-200/50 relative p-8 scroll-smooth flex justify-center"
                onClick={() => setSelectedId(null)}
            >
            <PreviewFrame
                width={viewportWidth}
                className={`transition-all duration-500 ease-in-out h-fit min-h-[800px] bg-white shadow-2xl ${isPreview ? '' : 'ring-1 ring-gray-200'}`}
            >
                <div 
                    id="canvas-root" 
                    className="min-h-[800px] pb-20 relative"
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
                    onDrop={(e) => {
                        e.preventDefault();
                        const type = e.dataTransfer.getData('type');
                        if (type === 'new') {
                            const elementType = e.dataTransfer.getData('elementType');
                            if(elementType) handleDropElement('root', 'inside', { type: 'new', elementType });
                        } else if (type === 'move') {
                            const id = e.dataTransfer.getData('id');
                            if (id) handleDropElement('root', 'inside', { type: 'move', id });
                        }
                    }}
                >
                    {activeElements.map(el => (
                        <EditorCanvas 
                            key={el.id} 
                            element={el} 
                            selectedId={selectedId} 
                            onSelect={handleSelect}
                            isPreview={isPreview}
                            onDropElement={handleDropElement}
                            onDuplicate={handleDuplicate}
                            onUpdateProps={handleUpdateProps}
                            getTemplate={(tid) => savedTemplates.find(t => t.id === tid)}
                            popupTargets={popupTargets}
                        />
                    ))}
                    
                    {activeElements.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                            <Icons.Layout />
                            <p className="mt-4 font-medium">Drag and drop elements here to start</p>
                        </div>
                    )}
                    
                    {/* Render Popup Modal inside iframe (Preview Mode Only) */}
                    {isPreview && activePopupId && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
                            <div 
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setActivePopupId(null)}
                            />
                            <div className="relative shadow-2xl overflow-hidden w-auto max-w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
                                <button 
                                    className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full text-gray-800 transition-colors"
                                    onClick={() => setActivePopupId(null)}
                                >
                                    <Icons.X />
                                </button>
                                {(() => {
                                    const targetEl = findElement(activePopupId, activeElements);
                                    if (targetEl) {
                                        return (
                                            <EditorCanvas 
                                                element={targetEl}
                                                selectedId={null}
                                                onSelect={() => {}}
                                                isPreview={true} 
                                                onDropElement={() => {}} 
                                                onDuplicate={() => {}}
                                                onUpdateProps={() => {}}
                                                getTemplate={(tid) => savedTemplates.find(t => t.id === tid)}
                                                popupTargets={popupTargets}
                                                isPopupContent={true} // Force visibility
                                            />
                                        )
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </PreviewFrame>
            </main>

            {!isPreview && (
            <PropertiesPanel
                selectedElement={selectedElement}
                onUpdateId={handleUpdateId}
                onUpdateName={handleUpdateName}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onUpdateProps={handleUpdateProps}
                onUpdateStyle={handleUpdateStyle}
                onFileUpload={onUploadImage || (async () => "")}
                onAddNavLink={handleAddNavLink}
                onUpdateNavLink={handleUpdateNavLink}
                onRemoveNavLink={handleRemoveNavLink}
                onAddSlide={handleAddSlide}
                onRemoveSlide={handleRemoveSlide}
                onUpdateSlide={()=>{}}
                onSaveTemplate={handleSaveTemplate}
                onDetach={handleDetachElement}
                onEditTemplate={handleEditTemplate}
                savedTemplates={savedTemplates}
            />
            )}
        </div>
        {/* Modals for Templates/Settings omitted for brevity (same as previous) */}
        {isTemplatesModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden h-[500px] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Library</h3>
                    <button onClick={() => setIsTemplatesModalOpen(false)} className="text-gray-400 hover:text-gray-600">Close</button>
                </div>
                <div className="flex border-b border-gray-200 px-6">
                    <button className={`py-3 mr-4 text-sm font-medium border-b-2 transition-colors ${templatesTab === 'presets' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setTemplatesTab('presets')}>Presets</button>
                    <button className={`py-3 text-sm font-medium border-b-2 transition-colors ${templatesTab === 'saved' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setTemplatesTab('saved')}>My Templates</button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    {templatesTab === 'presets' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {TEMPLATES.map(t => (
                                <button key={t.name} onClick={() => { setElements(t.elements); setIsTemplatesModalOpen(false); }} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all text-left group">
                                    <div className="h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-300 group-hover:bg-indigo-50 group-hover:text-indigo-300 transition-colors"><Icons.Layout /></div>
                                    <h4 className="font-bold text-gray-800">{t.name}</h4>
                                    <p className="text-xs text-gray-500 mt-1">Professional layout.</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {savedTemplates.map(t => (
                                <div key={t.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all flex flex-col group relative">
                                    <button onClick={() => handleDeleteTemplate(t.id)} className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"><Icons.Trash width={14} height={14} /></button>
                                    <button className="flex-1 text-left" onClick={() => { handleDropElement('root', 'inside', { type: 'template', templateId: t.id }); setIsTemplatesModalOpen(false); showToast("Template added"); }}>
                                        <div className="h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-400 transition-colors">{t.isGlobal ? <Icons.Globe /> : <Icons.Component />}</div>
                                        <div className="flex items-center gap-2"><h4 className="font-bold text-gray-800">{t.name}</h4>{t.isGlobal && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded font-mono">GLOBAL</span>}</div>
                                    </button>
                                    {t.isGlobal && <button onClick={() => handleEditTemplate(t.id)} className="mt-3 w-full py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200">Edit Master</button>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            </div>
        )}
        {isSettingsModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Icons.Globe /> Page Settings</h3><button onClick={() => setIsSettingsModalOpen(false)} className="text-gray-400 hover:text-gray-600">Close</button></div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label><input className="w-full border border-gray-300 rounded-lg p-2 text-sm" value={pageSettings.title} onChange={(e) => setPageSettings(p => ({ ...p, title: e.target.value }))} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label><textarea className="w-full border border-gray-300 rounded-lg p-2 text-sm" rows={3} value={pageSettings.description} onChange={(e) => setPageSettings(p => ({ ...p, description: e.target.value }))} /></div>
                </div>
                <div className="p-4 bg-gray-50 text-right"><button onClick={() => { setIsSettingsModalOpen(false); showToast("Settings saved"); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Changes</button></div>
            </div>
            </div>
        )}
        </div>
        </PopupContext.Provider>
    </EditorConfigContext.Provider>
  );
};