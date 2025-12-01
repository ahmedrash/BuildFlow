
import React from 'react';
import { PageElement, SavedTemplate } from '../types';
import { PageRenderer } from './PageRenderer';
import { EditorConfigContext } from './EditorConfigContext';

export interface BuildFlowRendererProps {
  initialData: PageElement[];
  savedTemplates?: SavedTemplate[];
  googleMapsApiKey?: string;
  recaptchaSiteKey?: string;
  className?: string;
}

export const BuildFlowRenderer: React.FC<BuildFlowRendererProps> = ({
  initialData,
  savedTemplates = [],
  googleMapsApiKey,
  recaptchaSiteKey,
  className = ''
}) => {
  return (
    <EditorConfigContext.Provider value={{ googleMapsApiKey, recaptchaSiteKey }}>
      <div className={`buildflow-renderer ${className}`}>
        <PageRenderer 
          elements={initialData} 
          savedTemplates={savedTemplates} 
          isPreview={true} 
        />
      </div>
    </EditorConfigContext.Provider>
  );
};
