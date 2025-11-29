
import React, { useState, useEffect } from 'react';

interface PromptModalProps {
   isOpen: boolean;
   title: string;
   defaultValue: string;
   showGlobalOption?: boolean;
   onClose: () => void;
   onConfirm: (value: string, isGlobal: boolean) => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ 
    isOpen, title, defaultValue, showGlobalOption, onClose, onConfirm 
}) => {
    const [value, setValue] = useState(defaultValue);
    const [isGlobal, setIsGlobal] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setValue(defaultValue);
            setIsGlobal(false);
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                </div>
                <div className="p-5 space-y-4">
                    <input 
                        autoFocus
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onConfirm(value, isGlobal);
                                onClose();
                            }
                        }}
                    />
                    
                    {showGlobalOption && (
                        <label className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100 cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="mt-1 accent-amber-600"
                                checked={isGlobal}
                                onChange={(e) => setIsGlobal(e.target.checked)}
                            />
                            <div>
                                <span className="block text-sm font-bold text-amber-900">Global Component</span>
                                <span className="block text-xs text-amber-700 mt-0.5">Changes to this template will update all instances across your project.</span>
                            </div>
                        </label>
                    )}
                </div>
                <div className="p-4 bg-gray-50 flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm(value, isGlobal);
                            onClose();
                        }}
                        disabled={!value.trim()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
