
import React, { useState, useEffect } from 'react';
import { BuildFlowEditor } from './components/BuildFlowEditor';
import { BuildFlowRenderer } from './components/BuildFlowRenderer';
import { TEMPLATES } from './data/constants';
import { PageElement, SavedTemplate } from './types';

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const isLiveMode = searchParams.get('mode') === 'live';

  // Demo Implementation: Load initial data from localStorage or fallback to default template
  const [initialData] = useState<PageElement[]>(() => {
    const saved = localStorage.getItem('buildflow_demo_page');
    return saved ? JSON.parse(saved) : TEMPLATES[0].elements;
  });

  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    const saved = localStorage.getItem('buildflow_templates');
    return saved ? JSON.parse(saved) : [];
  });

  // Handle saving the page layout and optionally templates
  const handleSave = (elements: PageElement[], templates?: SavedTemplate[]) => {
    localStorage.setItem('buildflow_demo_page', JSON.stringify(elements));
    
    if (templates) {
        setSavedTemplates(templates);
        localStorage.setItem('buildflow_templates', JSON.stringify(templates));
    }
    
    console.log('Saved to local storage');
  };

  // Handle saving templates with update logic (fixes duplication bug)
  const handleSaveTemplate = (template: SavedTemplate) => {
    setSavedTemplates(prev => {
        const index = prev.findIndex(t => t.id === template.id);
        let newTemplates;
        if (index !== -1) {
            newTemplates = [...prev];
            newTemplates[index] = template;
        } else {
            newTemplates = [...prev, template];
        }
        localStorage.setItem('buildflow_templates', JSON.stringify(newTemplates));
        return newTemplates;
    });
  };

  // Handle deleting templates
  const handleDeleteTemplate = (id: string) => {
    const newTemplates = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(newTemplates);
    localStorage.setItem('buildflow_templates', JSON.stringify(newTemplates));
  };

  // Handle image upload (Simple Base64 implementation for demo)
  const handleUploadImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  // --- API Configuration ---
  const GOOGLE_MAPS_API_KEY = ""; 
  const RECAPTCHA_SITE_KEY = "";

  if (isLiveMode) {
      const savedData = localStorage.getItem('buildflow_demo_page');
      const liveData = savedData ? JSON.parse(savedData) : initialData;
      
      const savedTemplatesStr = localStorage.getItem('buildflow_templates');
      const liveTemplates = savedTemplatesStr ? JSON.parse(savedTemplatesStr) : savedTemplates;

      return (
          <div className="min-h-screen bg-white">
             <BuildFlowRenderer 
               initialData={liveData}
               savedTemplates={liveTemplates}
               googleMapsApiKey={GOOGLE_MAPS_API_KEY}
               recaptchaSiteKey={RECAPTCHA_SITE_KEY}
             />
          </div>
      );
  }

  return (
    <BuildFlowEditor 
      initialData={initialData}
      savedTemplates={savedTemplates}
      onSave={handleSave}
      onSaveTemplate={handleSaveTemplate}
      onDeleteTemplate={handleDeleteTemplate}
      onUploadImage={handleUploadImage}
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      recaptchaSiteKey={RECAPTCHA_SITE_KEY}
    />
  );
}
