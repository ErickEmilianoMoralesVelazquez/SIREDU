import React, { useState } from "react";

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
        <h2 className="text-lg font-semibold mb-2 text-black">{title}</h2>
        <p className="mb-4 text-sm text-gray-700">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
            onClick={onConfirm}
          >
            Sí, cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
