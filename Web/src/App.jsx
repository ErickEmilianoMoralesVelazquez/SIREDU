import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider, useToast } from "./context/ToastContext.jsx";
import { ToastContainer } from "./components/ui/Toast.jsx";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PublishProductPage from "./pages/PublishProductPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";

function AppContent() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="productos" element={<ProductsPage />} />
            <Route path="producto/:id" element={<ProductDetailPage />} />
            <Route path="productos/:category" element={<ProductsPage />} />
          </Route>
          {/* Rutas protegidas para usuarios autenticados */}
          <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}> 
            <Route path="/publicar" element={<PublishProductPage />} />
          </Route>
          {/* Ruta protegida solo para admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}> 
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
