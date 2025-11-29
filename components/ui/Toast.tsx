
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl z-[100] animate-fade-in-up flex items-center gap-3 border border-slate-700">
       <div className="w-2 h-2 rounded-full bg-green-400"></div>
       <span className="font-medium text-sm">{message}</span>
    </div>
  );
};
