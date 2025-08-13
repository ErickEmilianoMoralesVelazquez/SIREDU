"use client";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService.js";
import { useToast } from "../context/ToastContext.jsx";

export default function ResetPasswordPage() {
  const { showSuccess, showError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [tokenEmail, setTokenEmail] = useState({ token: "", email: "" });
  const [valid, setValid] = useState(null); // null: cargando, true/false
  const [newPassword, setNewPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const token = qs.get("token") || "";
    const email = qs.get("email") || "";
    setTokenEmail({ token, email });

    (async () => {
      if (!token || !email) {
        setValid(false);
        return;
      }
      try {
        const r = await authService.validateResetToken({ token, email });
        setValid(!!r.valid);
      } catch {
        setValid(false);
      }
    })();
  }, [location.search]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      showError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setSubmitting(true);
    try {
      await authService.resetPassword({ email: tokenEmail.email, token: tokenEmail.token, newPassword });
      showSuccess("Contraseña actualizada. Inicia sesión con tu nueva contraseña.");
      navigate("/login"); // ajusta si tu ruta de login es otra
    } catch (err) {
      showError(err.message || "No se pudo actualizar la contraseña");
    } finally {
      setSubmitting(false);
    }
  };

  if (valid === null) return <p className="p-6">Validando enlace…</p>;
  if (!valid) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-2">Enlace inválido o vencido</h1>
        <p className="mb-4">Solicita uno nuevo desde la pantalla de inicio de sesión.</p>
        <Link to="/login" className="text-emerald-600 underline">Volver a iniciar sesión</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-6 w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold">Nueva contraseña</h1>
        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
        >
          {submitting ? "Actualizando..." : "Actualizar contraseña"}
        </button>
      </form>
    </div>
  );
}
