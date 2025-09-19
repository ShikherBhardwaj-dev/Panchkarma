import React from 'react';
import { X } from 'lucide-react';
import { useToast } from '../contexts/ToastContext.jsx';

export const ToastContainer = () => {
  const { toasts, remove } = useToast();

  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-60 flex flex-col gap-2 w-96">
      {toasts.map(t => (
        <div key={t.id} className="bg-white shadow-lg rounded p-3 border flex items-start justify-between">
          <div className="flex-1">
            <div className="font-semibold text-sm">{t.title}</div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{t.message}</div>
          </div>
          <button onClick={() => remove(t.id)} className="ml-3 text-gray-400 hover:text-gray-700">
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
