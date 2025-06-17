import React from 'react';

const Overlay = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-100 backdrop-blur-sm"
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl max-w-lg w-11/12 max-h-[80vh] overflow-y-auto p-8 transform transition-all duration-300 ease-out animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-all duration-200"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Overlay;