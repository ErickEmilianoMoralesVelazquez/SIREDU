// Form validation utilities with enhanced security

// Security patterns for XSS and SQL injection prevention
const securityPatterns = {
  // Block dangerous HTML/JavaScript characters and patterns
  xss: {
    value: /[<>"'&]|javascript:|vbscript:|on\w+\s*=|<script|<iframe|<object|<embed|<form/gi,
    message: 'Caracteres peligrosos no están permitidos'
  },
  // Block SQL injection patterns
  sqlInjection: {
    value: /('|"|;|--|\/\*|\*\/|union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)/gi,
    message: 'Patrones de inyección SQL no están permitidos'
  },
  // Block command injection patterns
  commandInjection: {
    value: /(\$\(|`|&&|\|\||;|>|<|\||&)/g,
    message: 'Caracteres de inyección de comandos no están permitidos'
  }
};

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
      value: 8,
      message: 'La contraseña debe tener al menos 8 caracteres'
    },
    maxLength: {
      value: 128,
      message: 'La contraseña no puede exceder 128 caracteres'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (@, $, !, %, *, ?, &)'
    },
    // Block common weak passwords
    weakPassword: {
      value: /(password|123456|qwerty|admin|letmein|welcome|monkey|dragon|master|football)/gi,
      message: 'Esta contraseña es demasiado común, elige una más segura'
    }
  },
  name: {
    required: 'El nombre completo es requerido',
    minLength: {
      value: 2,
      message: 'El nombre debe tener al menos 2 caracteres'
    },
    maxLength: {
      value: 100,
      message: 'El nombre no puede exceder 100 caracteres'
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

// Enhanced security validation function
const validateSecurity = (value, fieldType = 'general') => {
  if (!value || typeof value !== 'string') return null;
  
  // Special handling for password fields - allow safe special characters
  if (fieldType === 'password') {
    // For passwords, only block the most dangerous patterns
    const dangerousPasswordPatterns = /[<>"'`]|javascript:|vbscript:|on\w+\s*=|script|iframe|object|embed|form/gi;
    if (dangerousPasswordPatterns.test(value)) {
      return 'La contraseña contiene caracteres no permitidos. Solo se permiten caracteres especiales seguros como @, $, !, %, *, ?, &';
    }
    return null;
  }
  
  // For other fields, apply full security validation
  // Check for XSS attacks
  if (securityPatterns.xss.value.test(value)) {
    return 'Caracteres peligrosos no están permitidos: <, >, ", \', &, javascript:, vbscript:, etc.';
  }
  
  // Check for SQL injection
  if (securityPatterns.sqlInjection.value.test(value)) {
    return 'Patrones de inyección SQL no están permitidos: comillas, punto y coma, comentarios SQL, etc.';
  }
  
  // Check for command injection
  if (securityPatterns.commandInjection.value.test(value)) {
    return 'Caracteres de inyección de comandos no están permitidos: $(), `, &&, ||, etc.';
  }
  
  return null;
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

  // Security validation (applies to all fields)
  const fieldType = field === 'password' || field === 'confirmPassword' ? 'password' : 'general';
  const securityError = validateSecurity(value, fieldType);
  if (securityError) {
    return securityError;
  }

  // Min length validation
  if (rules.minLength && value.length < rules.minLength.value) {
    return rules.minLength.message;
  }

  // Max length validation
  if (rules.maxLength && value.length > rules.maxLength.value) {
    return rules.maxLength.message;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.value.test(value)) {
    return rules.pattern.message;
  }

  // University email validation (specific for email field)
  if (field === 'email' && rules.university && !rules.university.value.test(value)) {
    return rules.university.message;
  }

  // Weak password validation
  if (field === 'password' && rules.weakPassword && rules.weakPassword.value.test(value)) {
    return rules.weakPassword.message;
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

// Enhanced sanitization function
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;

  return value
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>"'&]/g, '') // Remove dangerous HTML characters
    .replace(/javascript:|vbscript:|on\w+\s*=/gi, '') // Remove JavaScript patterns
    .replace(/('|"|;|--|\/\*|\*\/)/g, '') // Remove SQL injection characters
    .replace(/(\$\(|`|&&|\|\||>|<|\||&)/g, ''); // Remove command injection characters
};

// Format validation error for display
export const formatValidationError = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Campo inválido';
};

// Additional security utilities
export const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  
  return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match]);
};

export const escapeSql = (str) => {
  if (typeof str !== 'string') return str;
  
  // Basic SQL escaping (for display purposes only)
  // In production, use parameterized queries instead
  return str.replace(/'/g, "''").replace(/"/g, '""');
};

// Rate limiting helper for form submissions
export const createRateLimiter = (maxAttempts = 5, timeWindow = 60000) => {
  const attempts = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < timeWindow);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    recentAttempts.push(now);
    attempts.set(identifier, recentAttempts);
    return true; // Allowed
  };
};
