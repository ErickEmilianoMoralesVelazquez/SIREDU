import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Shirt, Laptop, Gift } from "lucide-react";
import ProductCard from "../components/products/ProductCard";

export default function HomePage() {
  // Datos de ejemplo para productos destacados
  const featuredProducts = [
    {
      id: 1,
      title: "Libro de Cálculo Avanzado",
      category: "Libros",
      type: "Venta",
      price: 250,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Carlos Méndez",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      title: "Laptop Dell Inspiron",
      category: "Electrónicos",
      type: "Venta",
      price: 4500,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Ana Gutiérrez",
      createdAt: "2023-05-14",
    },
    {
      id: 3,
      title: "Sudadera Universitaria",
      category: "Ropa",
      type: "Regalo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Miguel Torres",
      createdAt: "2023-05-13",
    },
    {
      id: 4,
      title: "Calculadora Científica",
      category: "Útiles",
      type: "Préstamo",
      price: 0,
      image: "/placeholder.svg?height=300&width=300",
      owner: "Laura Sánchez",
      createdAt: "2023-05-12",
    },
  ];

  // Datos de ejemplo para estadísticas
  const stats = [
    { label: "Artículos Intercambiados", value: "1,234+" },
    { label: "Usuarios Activos", value: "500+" },
    { label: "Kg de Residuos Evitados", value: "750+" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Consume de forma responsable en tu comunidad universitaria
              </h1>
              <p className="text-xl mb-8 text-emerald-100">
                Dona, presta o vende artículos que ya no usas. Encuentra lo que
                necesitas a precios accesibles.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/productos"
                  className="bg-white text-emerald-700 px-6 py-3 rounded-full font-medium text-center hover:bg-emerald-100 transition-colors"
                >
                  Explorar Artículos
                </Link>
                <Link
                  to="/registro"
                  className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-medium text-center hover:bg-white hover:text-emerald-700 transition-colors"
                >
                  Crear Cuenta
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Estudiantes intercambiando artículos"
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explora por Categorías
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link
              to="/categoria/libros"
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-medium text-lg">Libros</h3>
              <p className="text-gray-500 text-sm mt-2">
                Textos académicos y literatura
              </p>
            </Link>

            <Link
              to="/categoria/ropa"
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Shirt className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-medium text-lg">Ropa</h3>
              <p className="text-gray-500 text-sm mt-2">Prendas y accesorios</p>
            </Link>

            <Link
              to="/categoria/electronicos"
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Laptop className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-medium text-lg">Electrónicos</h3>
              <p className="text-gray-500 text-sm mt-2">
                Dispositivos y accesorios
              </p>
            </Link>

            <Link
              to="/categoria/utiles"
              className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-medium text-lg">Útiles</h3>
              <p className="text-gray-500 text-sm mt-2">
                Material escolar y más
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Artículos Destacados</h2>
            <Link
              to="/productos"
              className="text-emerald-600 hover:text-emerald-800 flex items-center transition-colors"
            >
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-emerald-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Cómo Funciona?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Regístrate</h3>
              <p className="text-gray-600">
                Crea una cuenta con tu correo universitario para acceder a todas
                las funcionalidades.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Publica o Explora</h3>
              <p className="text-gray-600">
                Publica artículos que ya no uses o explora lo que otros ofrecen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-emerald-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Contacta y Recicla</h3>
              <p className="text-gray-600">
                Contacta con otros usuarios y concreta el intercambio dentro del
                campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-emerald-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestro Impacto
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold mb-2">{stat.value}</p>
                <p className="text-xl text-emerald-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para unirte a la comunidad?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Forma parte del cambio hacia un consumo más responsable y sostenible
            en nuestra universidad.
          </p>
          <Link
            to="/registro"
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-emerald-700 transition-colors inline-block"
          >
            Crear Cuenta Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
