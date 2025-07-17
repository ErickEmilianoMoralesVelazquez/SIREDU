// Form validation utilities

export const validationRules = {
  email: {
    required: 'El correo electrónico es requerido',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Ingresa un correo electrónico válido'
    },
    university: {
      value: /\.(edu|ac\.|edu\.)/i,
      message: 'Debe ser un correo universitario (.edu, .ac., .edu.)'
    }
  },
  password: {
    required: 'La contraseña es requerida',
    minLength: {
      value: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    }
  },
  name: {
    required: 'El nombre completo es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres'
    },
    pattern: {
      value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      message: 'El nombre solo puede contener letras y espacios'
    }
  },
  confirmPassword: {
    required: 'Confirma tu contraseña'
  }
};

export const validateField = (field, value, additionalData = {}) => {
  const rules = validationRules[field];
  if (!rules) return null;

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    return rules.required;
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === '') {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.value.test(value)) {
    return rules.pattern.message;
  }

  // University email validation (specific for email field)
  if (field === 'email' && rules.university && !rules.university.value.test(value)) {
    return rules.university.message;
  }

  // Confirm password validation
  if (field === 'confirmPassword' && additionalData.password && value !== additionalData.password) {
    return 'Las contraseñas no coinciden';
  }

  return null;
};

export const validateForm = (formData, fieldsToValidate) => {
  const errors = {};
  let isValid = true;

  fieldsToValidate.forEach(field => {
    const error = validateField(field, formData[field], formData);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export const validateLoginForm = (formData) => {
  return validateForm(formData, ['email', 'password']);
};

export const validateRegisterForm = (formData) => {
  return validateForm(formData, ['name', 'email', 'password', 'confirmPassword']);
};

// Real-time validation for individual fields
export const validateFieldRealTime = (field, value, formData = {}) => {
  // Don't validate on first character for better UX
  if (value.length <= 1 && field !== 'confirmPassword') {
    return null;
  }

  return validateField(field, value, formData);
};

// Sanitize input values
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;

  return value
    .trim()
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
};

// Format validation error for display
export const formatValidationError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Campo inválido';
};
