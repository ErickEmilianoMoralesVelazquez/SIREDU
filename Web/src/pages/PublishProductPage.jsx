"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Camera } from "lucide-react";

export default function PublishProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    price: "",
    condition: "",
    images: [],
  });

  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  // Manejador para cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Resetear precio si el tipo no es venta
        ...(name === "type" && value !== "venta" ? { price: "" } : {}),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Manejadores para drag and drop de imágenes
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    if (formData.images.length + files.length > 3) {
      setErrors((prev) => ({
        ...prev,
        images: "Solo puedes subir un máximo de 3 imágenes",
      }));
      return;
    }

    const newImages = Array.from(files).map((file) => {
      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Limpiar error de imágenes
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "El título es obligatorio";
    if (!formData.description.trim())
      newErrors.description = "La descripción es obligatoria";
    if (!formData.category) newErrors.category = "Selecciona una categoría";
    if (!formData.type) newErrors.type = "Selecciona un tipo de disponibilidad";
    if (formData.type === "venta" && !formData.price)
      newErrors.price = "Ingresa un precio";
    if (!formData.condition) newErrors.condition = "Selecciona una condición";
    if (formData.images.length === 0)
      newErrors.images = "Sube al menos una imagen";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Aquí iría la lógica para enviar el formulario
      console.log("Formulario enviado:", formData);
      alert("¡Artículo publicado con éxito!");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-emerald-700 text-white p-6">
          <h1 className="text-2xl font-bold">Publicar un Artículo</h1>
          <p className="text-emerald-100">
            Comparte artículos que ya no uses con la comunidad universitaria
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna izquierda */}
            <div className="space-y-6">
              {/* Título */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Título del artículo *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Ej: Libro de Cálculo Diferencial"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Descripción *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Describe el estado del artículo, detalles importantes, etc."
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["Libros", "Electrónicos", "Ropa", "Útiles", "Otros"].map(
                    (category) => (
                      <div key={category}>
                        <input
                          type="radio"
                          id={`category-${category}`}
                          name="category"
                          value={category.toLowerCase()}
                          checked={formData.category === category.toLowerCase()}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className={`block border rounded-lg px-4 py-3 text-center cursor-pointer transition-colors ${
                            formData.category === category.toLowerCase()
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {category}
                        </label>
                      </div>
                    ),
                  )}
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              {/* Tipo de disponibilidad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de disponibilidad *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "venta", label: "Venta" },
                    { value: "regalo", label: "Regalo" },
                    { value: "prestamo", label: "Préstamo" },
                  ].map((type) => (
                    <div key={type.value}>
                      <input
                        type="radio"
                        id={`type-${type.value}`}
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`type-${type.value}`}
                        className={`block border rounded-lg px-4 py-3 text-center cursor-pointer transition-colors ${
                          formData.type === type.value
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                )}
              </div>

              {/* Precio (solo si es venta) */}
              {formData.type === "venta" && (
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Precio (MXN) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-2 border ${errors.price ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
              )}

              {/* Condición */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condición *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Nuevo", "Como nuevo", "Buen estado", "Usado"].map(
                    (condition) => (
                      <div key={condition}>
                        <input
                          type="radio"
                          id={`condition-${condition}`}
                          name="condition"
                          value={condition.toLowerCase()}
                          checked={
                            formData.condition === condition.toLowerCase()
                          }
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className={`block border rounded-lg px-4 py-3 text-center cursor-pointer transition-colors ${
                            formData.condition === condition.toLowerCase()
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {condition}
                        </label>
                      </div>
                    ),
                  )}
                </div>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.condition}
                  </p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-6">
              {/* Imágenes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imágenes * (máximo 3)
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300"
                  } ${errors.images ? "border-red-500" : ""}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Arrastra y suelta imágenes aquí, o{" "}
                      <label
                        htmlFor="file-upload"
                        className="text-emerald-600 hover:text-emerald-500 cursor-pointer"
                      >
                        selecciona archivos
                      </label>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF hasta 5MB
                    </p>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileInput}
                      className="sr-only"
                    />
                  </div>
                </div>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-500">{errors.images}</p>
                )}

                {/* Vista previa de imágenes */}
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={`Vista previa ${index + 1}`}
                          className="h-24 w-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Información importante
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • Los intercambios deben realizarse dentro del campus
                    universitario.
                  </li>
                  <li>
                    • Asegúrate de que las imágenes muestren claramente el
                    estado del artículo.
                  </li>
                  <li>
                    • No se permiten artículos prohibidos por el reglamento
                    universitario.
                  </li>
                  <li>
                    • Tu información de contacto solo será compartida con
                    usuarios interesados.
                  </li>
                </ul>
              </div>

              {/* Código QR */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Código QR</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Se generará automáticamente un código QR para tu artículo una
                  vez publicado. Podrás imprimirlo y colocarlo en lugares
                  visibles del campus.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-lg text-center font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Publicar Artículo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
