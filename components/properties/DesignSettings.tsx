import React, { useRef, useState } from 'react';
import { ElementStyle } from '../../types';
import { ColorPicker } from '../ui/ColorPicker';
import { FONT_FAMILIES } from '../../data/constants';
import { TAILWIND_CLASSES } from '../../data/tailwindClasses';

interface DesignSettingsProps {
    style: ElementStyle;
    className: string;
    onUpdateStyle: (key: string, value: string) => void;
    onUpdateClassName: (value: string) => void;
    onFileUpload: (file: File) => Promise<string>;
    isTextElement?: boolean;
}

const inputClass = "w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white";
const labelClass = "block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5";
const fileInputClass = "block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 mt-2 cursor-pointer";

export const DesignSettings: React.FC<DesignSettingsProps> = ({
    style,
    className,
    onUpdateStyle,
    onUpdateClassName,
    onFileUpload,
    isTextElement
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [suggestionList, setSuggestionList] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleClassNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        onUpdateClassName(value);
        
        // Autocomplete logic
        const cursorPosition = e.target.selectionStart;
        const textUpToCursor = value.substring(0, cursorPosition);
        const words = textUpToCursor.split(/\s+/);
        const currentWord = words[words.length - 1];
    
        if (currentWord && currentWord.length > 1) {
           const matches = TAILWIND_CLASSES.filter(cls => cls.startsWith(currentWord)).slice(0, 5);
           if (matches.length > 0) {
               setSuggestionList(matches);
               setShowSuggestions(true);
           } else {
               setShowSuggestions(false);
           }
        } else {
            setShowSuggestions(false);
        }
    };

    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    const applySuggestion = (suggestion: string) => {
        const currentClass = className || '';
        const cursorPosition = textareaRef.current?.selectionStart || currentClass.length;
        const textUpToCursor = currentClass.substring(0, cursorPosition);
        const textAfterCursor = currentClass.substring(cursorPosition);
        
        const words = textUpToCursor.split(/\s+/);
        const currentWord = words[words.length - 1];
        
        const newTextUpToCursor = textUpToCursor.substring(0, textUpToCursor.length - currentWord.length) + suggestion + ' ';
        
        const newValue = newTextUpToCursor + textAfterCursor;
        onUpdateClassName(newValue);
        setShowSuggestions(false);
        textareaRef.current?.focus();
    };

    return (
        <div className="space-y-6">
            {/* Background Settings */}
            <div className="space-y-3">
                <span className={labelClass}>Background</span>
                <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Color</label>
                    <ColorPicker 
                        value={style?.backgroundColor}
                        onChange={(val) => onUpdateStyle('backgroundColor', val)}
                    />
                </div>
                
                <div>
                    <label className="text-[10px] text-gray-400 block mb-1">Image</label>
                    <div className="flex items-center gap-2 mb-1">
                        <input 
                            type="text" 
                            value={style?.backgroundImage || ''}
                            onChange={(e) => onUpdateStyle('backgroundImage', e.target.value)}
                            className={inputClass}
                            placeholder="url('https://...')"
                        />
                    </div>
                    <input 
                        type="file" 
                        accept="image/*"
                        className={fileInputClass}
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const base64 = await onFileUpload(file);
                                onUpdateStyle('backgroundImage', `url('${base64}')`);
                            }
                        }}
                    />
                </div>
            </div>

            {/* Typography */}
            {isTextElement && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                     <span className={labelClass}>Typography</span>
                     <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Color</span>
                        <ColorPicker 
                            value={style?.color}
                            onChange={(val) => onUpdateStyle('color', val)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Size</span>
                            <input 
                                type="text" 
                                className={inputClass}
                                value={style?.fontSize || ''}
                                onChange={(e) => onUpdateStyle('fontSize', e.target.value)}
                                placeholder="16px"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Align</span>
                            <select 
                                className={inputClass}
                                value={style?.textAlign || 'left'}
                                onChange={(e) => onUpdateStyle('textAlign', e.target.value)}
                            >
                                <option value="left">Left</option>
                                <option value="center">Center</option>
                                <option value="right">Right</option>
                                <option value="justify">Justify</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Font Family</span>
                        <select 
                            className={inputClass}
                            value={style?.fontFamily || 'Inherit'}
                            onChange={(e) => onUpdateStyle('fontFamily', e.target.value)}
                        >
                            {FONT_FAMILIES.map(font => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>
                     <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Line Height</span>
                            <input 
                                type="text" 
                                className={inputClass}
                                value={style?.lineHeight || ''}
                                onChange={(e) => onUpdateStyle('lineHeight', e.target.value)}
                                placeholder="1.5"
                            />
                        </div>
                        <div>
                            <span className="text-[10px] text-gray-400 block mb-1">Weight</span>
                            <input 
                                type="text" 
                                className={inputClass}
                                value={style?.fontWeight || ''}
                                onChange={(e) => onUpdateStyle('fontWeight', e.target.value)}
                                placeholder="400, bold"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Layout & Spacing */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className={labelClass}>Layout & Spacing</span>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Padding</span>
                        <input 
                            type="text" 
                            className={inputClass}
                            value={style?.padding || ''}
                            onChange={(e) => onUpdateStyle('padding', e.target.value)}
                            placeholder="1rem"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Margin</span>
                        <input 
                            type="text" 
                            className={inputClass}
                            value={style?.margin || ''}
                            onChange={(e) => onUpdateStyle('margin', e.target.value)}
                            placeholder="1rem"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Width</span>
                        <input 
                            type="text" 
                            className={inputClass}
                            value={style?.width || ''}
                            onChange={(e) => onUpdateStyle('width', e.target.value)}
                            placeholder="100%, 200px"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Height</span>
                        <input 
                            type="text" 
                            className={inputClass}
                            value={style?.height || ''}
                            onChange={(e) => onUpdateStyle('height', e.target.value)}
                            placeholder="auto, 100vh"
                        />
                    </div>
                </div>
            </div>

            {/* Borders & Effects */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className={labelClass}>Borders & Effects</span>
                 <div className="grid grid-cols-2 gap-3">
                    <div>
                        <span className="text-[10px] text-gray-400 block mb-1">Radius</span>
                        <input 
                            type="text" 
                            className={inputClass}
                            value={style?.borderRadius || ''}
                            onChange={(e) => onUpdateStyle('borderRadius', e.target.value)}
                            placeholder="4px, 50%"
                        />
                    </div>
                    <div>
                         <span className="text-[10px] text-gray-400 block mb-1">Border</span>
                        <input 
                            type="text" 
                            className={inputClass}
                            value={style?.border || ''}
                            onChange={(e) => onUpdateStyle('border', e.target.value)}
                            placeholder="1px solid #ccc"
                        />
                    </div>
                </div>
                <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Shadow</span>
                    <input 
                        type="text" 
                        className={inputClass}
                        value={style?.boxShadow || ''}
                        onChange={(e) => onUpdateStyle('boxShadow', e.target.value)}
                        placeholder="0 4px 6px rgba(0,0,0,0.1)"
                    />
                </div>
                <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Opacity</span>
                    <input 
                        type="text" 
                        className={inputClass}
                        value={style?.opacity || ''}
                        onChange={(e) => onUpdateStyle('opacity', e.target.value)}
                        placeholder="0.5, 1"
                    />
                </div>
            </div>

            {/* Custom CSS */}
            <div className="pt-4 border-t border-gray-100 relative">
                <span className={labelClass}>Custom CSS Classes (Tailwind)</span>
                <textarea 
                    ref={textareaRef}
                    className={inputClass}
                    rows={3}
                    value={className || ''}
                    onChange={handleClassNameChange}
                    onBlur={handleBlur}
                    placeholder="e.g. shadow-lg hover:scale-105"
                />
                {showSuggestions && suggestionList.length > 0 && (
                    <div className="absolute left-0 bottom-full mb-1 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-40 overflow-y-auto">
                        {suggestionList.map(suggestion => (
                            <div 
                                key={suggestion}
                                className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                                onClick={() => applySuggestion(suggestion)}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}