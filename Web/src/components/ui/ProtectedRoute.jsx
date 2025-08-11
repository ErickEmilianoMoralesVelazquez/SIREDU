import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Mostrar loader mientras se inicializa la autenticación
  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
