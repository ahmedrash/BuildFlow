import React from 'react';
import { Icons } from './Icons';

interface TopbarProps {
    viewMode: 'desktop' | 'tablet' | 'mobile';
    setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
    isPreview: boolean;
    setIsPreview: (val: boolean) => void;
    onOpenTemplates: () => void;
    onOpenSettings: () => void;
    onSave: () => void;
    onExportHtml: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ 
    viewMode, setViewMode, isPreview, setIsPreview, 
    onOpenTemplates, onOpenSettings, onSave, onExportHtml
}) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0 z-30 relative shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-indigo-200 shadow-lg">
              BF
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800 hidden sm:block">BuildFlow</span>
          </div>
          
          <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>

          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
             <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`} title="Desktop">
                <Icons.Monitor />
             </button>
             <button onClick={() => setViewMode('tablet')} className={`p-1.5 rounded ${viewMode === 'tablet' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`} title="Tablet">
                <Icons.Tablet />
             </button>
             <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`} title="Mobile">
                <Icons.Smartphone />
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
            onClick={onOpenTemplates}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
          >
            <Icons.File /> <span className="hidden sm:inline">Templates</span>
          </button>

           <button 
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
          >
            <Icons.Globe /> <span className="hidden sm:inline">Settings</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isPreview ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {isPreview ? <><Icons.EyeOff /> Edit</> : <><Icons.Eye /> Preview</>}
          </button>
          <button 
            onClick={onExportHtml}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium border border-gray-200"
            title="Download as HTML"
          >
            <Icons.Download /> <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
            onClick={onSave}
          >
            <Icons.Save /> Save
          </button>
        </div>
      </header>
  );
};