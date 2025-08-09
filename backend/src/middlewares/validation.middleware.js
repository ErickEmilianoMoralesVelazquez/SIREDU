export const validateCreateItem = (req, res, next) => {
  const hasBody = !!req.body && Object.keys(req.body).length > 0;
  const hasFiles = !!req.files && Object.keys(req.files).length > 0;

  if (!hasBody && !hasFiles) {
    return res.status(400).json({
      success: false,
      message:
        "No se recibieron datos. Envía el body con los campos requeridos. Si vas a subir imágenes, usa 'multipart/form-data'.",
      details: {
        requiredFields: ["tittle", "category", "exchange_type"],
        optionalFields: [
          "description",
          "price",
          "status",
          "picture1",
          "picture2",
          "picture3",
        ],
      },
    });
  }

  const { tittle, category, exchange_type } = req.body || {};

  const errors = [];

  if (!tittle || (typeof tittle === "string" && tittle.trim().length === 0)) {
    errors.push("El título es obligatorio");
  }

  if (!category || (typeof category === "string" && category.trim().length === 0)) {
    errors.push("La categoría es obligatoria");
  }

  const validExchangeTypes = ["venta", "renta", "prestamo"];
  if (!exchange_type || !validExchangeTypes.includes(exchange_type)) {
    errors.push("El tipo de intercambio debe ser: venta, renta o prestamo");
  }

  if (req.body && req.body.price && isNaN(parseFloat(req.body.price))) {
    errors.push("El precio debe ser un número válido");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors,
    });
  }

  next();
};