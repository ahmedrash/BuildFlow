
import React from 'react';

const inputClass = "w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white";

interface ColorPickerProps {
    value?: string;
    onChange: (val: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => (
    <div className="flex items-center gap-2">
        <label className="w-8 h-8 rounded border border-gray-300 shadow-sm shrink-0 overflow-hidden relative cursor-pointer bg-gray-50">
             {/* Checkerboard pattern for transparency */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQUlEQVQYV2NkYGAwYcLEQwYGBoYQGPs/EzJG5uMwDq4Qgwgnw22EVEeg4mQJ4XQkPg+Q5Q5qOA53O77wkRROw/gAAN1zE9573T8iAAAAAElFTkSuQmCC')" }}></div>
            <div className="absolute inset-0" style={{ backgroundColor: value || 'transparent' }} />
            <input 
                type="color"
                className="opacity-0 w-full h-full absolute top-0 left-0 cursor-pointer"
                value={value?.startsWith('#') && value.length === 7 ? value : '#000000'}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
        <input 
            type="text" 
            className={inputClass}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="hex/name"
        />
    </div>
);
