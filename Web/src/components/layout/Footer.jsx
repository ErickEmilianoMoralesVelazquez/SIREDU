import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre EcoUni</h3>
            <p className="text-gray-300 text-sm">
              Plataforma digital universitaria para fomentar el consumo
              responsable, reciclaje y reutilización entre estudiantes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  to="/"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/productos"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Explorar Productos
                </Link>
              </li>
              <li>
                <Link
                  to="/como-funciona"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link
                  to="/preguntas-frecuentes"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link
                  to="/terminos"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidad"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="hover:text-emerald-300 transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>ecouni@universidad.edu</span>
              </li>
              <li className="mt-4">
                <h4 className="text-sm font-medium mb-2">Síguenos</h4>
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="hover:text-emerald-300 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="hover:text-emerald-300 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="hover:text-emerald-300 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} EcoUni. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
