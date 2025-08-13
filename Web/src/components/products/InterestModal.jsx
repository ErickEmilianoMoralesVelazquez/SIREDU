"use client";

import { X, Phone } from "lucide-react";

export default function InterestModal({ isOpen, onClose, phoneNumber }) {
  if (!isOpen) return null;
  
  // Debug info
  console.log('InterestModal props:', { isOpen, phoneNumber, type: typeof phoneNumber });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Contacto del Vendedor</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            phoneNumber ? "bg-emerald-100" : "bg-gray-100"
          }`}>
            <Phone className={`h-8 w-8 ${
              phoneNumber ? "text-emerald-600" : "text-gray-400"
            }`} />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {phoneNumber ? "Número de Teléfono" : "Sin Información de Contacto"}
          </h3>
          {phoneNumber ? (
            <>
              <p className="text-gray-800 text-2xl font-bold tracking-wider mb-4">
                {phoneNumber}
              </p>
              <p className="text-gray-600">
                Contacta al vendedor directamente a este número.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg mb-4">
                Este artículo no tiene número de teléfono registrado.
              </p>
              <p className="text-gray-600">
                Contacta al vendedor a través de la plataforma.
              </p>
            </>
          )}
        </div>
        
        <div className="flex justify-end gap-3 p-4 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}