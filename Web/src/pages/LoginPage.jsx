"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../hooks/useToast.js";
import {
  validateLoginForm,
  validateRegisterForm,
  validateFieldRealTime,
  sanitizeInput,
} from "../utils/validation.js";
import { ButtonLoader } from "../components/ui/Loader.jsx";

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isLoading, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Verificar si el parámetro mode=register está en la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    }
  }, [location.search]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const sanitizedValue =
      type === "checkbox"
        ? checked
        : name === "name"
          ? value // permitir espacios para el nombre
          : sanitizeInput(value); // sanitizar el resto

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate field on blur
    if (touched[name] || value) {
      const error = validateFieldRealTime(name, value, formData);
      setErrors((prev) => ({
        ...prev,
        [name]: error || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = isLogin
      ? validateLoginForm(formData)
      : validateRegisterForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched(
        Object.keys(validation.errors).reduce(
          (acc, key) => ({
            ...acc,
            [key]: true,
          }),
          {},
        ),
      );
      return;
    }

    try {
      if (isLogin) {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          showSuccess("¡Bienvenido! Has iniciado sesión correctamente");
          navigate("/");
        } else {
          showError(result.error || "Error al iniciar sesión");
        }
      } else {
        // Check terms acceptance
        if (!formData.acceptTerms) {
          setErrors({
            acceptTerms: "Debes aceptar los términos y condiciones",
          });
          return;
        }

        const result = await register({
          username: formData.name.split(" ")[0], // Use first name as username
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          showSuccess(
            "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión",
          );
          setIsLogin(true);
          setFormData({
            email: formData.email,
            password: "",
            name: "",
            confirmPassword: "",
            acceptTerms: false,
          });
          setErrors({});
          setTouched({});
        } else {
          showError(result.error || "Error al crear la cuenta");
        }
      }
    } catch (error) {
      showError(error.message || "Error inesperado");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setTouched({});
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
      acceptTerms: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-emerald-700 text-white text-center">
            <h1 className="text-2xl font-bold">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </h1>
            <p className="text-emerald-100">
              {isLogin
                ? "Accede a tu cuenta para gestionar tus artículos"
                : "Únete a la comunidad de intercambio universitario"}
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre (solo en registro) */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-emerald-500"
                    }`}
                    placeholder="Ingresa tu nombre completo"
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo electrónico universitario
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-emerald-500"
                    }`}
                    placeholder="tu.nombre@universidad.edu"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-emerald-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password (solo en registro) */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        errors.confirmPassword
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-emerald-500"
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Terms (solo en registro) */}
              {!isLogin && (
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                    className="mt-1 mr-2"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-600"
                  >
                    Acepto los{" "}
                    <Link
                      to="/terminos"
                      className="text-emerald-600 hover:underline"
                    >
                      términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link
                      to="/privacidad"
                      className="text-emerald-600 hover:underline"
                    >
                      política de privacidad
                    </Link>
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>
              )}

              {/* Forgot Password (solo en login) */}
              {isLogin && (
                <div className="text-right">
                  <Link
                    to="/recuperar-contrasena"
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <ButtonLoader size="sm" color="white" />
                    <span className="ml-2">
                      {isLogin ? "Iniciando..." : "Creando cuenta..."}
                    </span>
                  </>
                ) : (
                  <span>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</span>
                )}
              </button>
            </form>

            {/* Toggle Login/Register */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={isLoading}
                  className="text-emerald-600 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLogin ? "Regístrate" : "Inicia sesión"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
