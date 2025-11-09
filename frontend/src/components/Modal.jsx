import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded shadow-lg p-4 z-50 max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-end">
          <button onClick={onClose} className="px-2 py-1">
            ❌
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
