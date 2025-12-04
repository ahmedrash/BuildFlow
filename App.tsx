
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

  // Handle saving the page layout
  const handleSave = (elements: PageElement[]) => {
    localStorage.setItem('buildflow_demo_page', JSON.stringify(elements));
    console.log('Saved to local storage:', elements);
  };

  // Handle saving templates
  const handleSaveTemplate = (template: SavedTemplate) => {
    const newTemplates = [...savedTemplates, template];
    setSavedTemplates(newTemplates);
    localStorage.setItem('buildflow_templates', JSON.stringify(newTemplates));
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
  // In a real app, these would come from environment variables or a configuration endpoint.
  const GOOGLE_MAPS_API_KEY = ""; 
  const RECAPTCHA_SITE_KEY = "";

  if (isLiveMode) {
      // For live mode, we prefer the latest saved data from localStorage, 
      // but fallback to state if needed (though state already loads from LS).
      // We re-read here to ensure a new tab gets the absolute latest if state was stale.
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
