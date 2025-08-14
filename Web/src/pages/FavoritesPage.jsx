import { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard";
import { favoritesService } from "../services/favoritesService";

export default function FavoritesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await favoritesService.list();
      const normalized = (data?.favorites || []).map(f => ({
        id: f.item?.id_item,
        title: f.item?.tittle,
        price: f.item?.price,
        category: f.item?.category,
        type: f.item?.exchange_type || f.item?.type,
        image: f.item?.picture1,
        isFavorite: true,
        favoriteCount: f.item?.favoriteCount || 0,
        owner: f.item?.user?.username || "",
        createdAt: f.item?.created_at,
      }));
      setItems(normalized);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggleFavorite = async (product) => {
    const id = product.id;
    await favoritesService.remove(id);
    setItems(prev => prev.filter(p => p.id !== id));
  };

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-4">Mis favoritos</h1>
      {items.length === 0 ? (
        <div className="text-gray-500">Aún no tienes artículos en favoritos.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(product => (
            <ProductCard key={product.id} product={product} onToggleFavorite={handleToggleFavorite}/>
          ))}
        </div>
      )}
    </div>
  );
}
