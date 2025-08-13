import { useState, useEffect } from 'react';
import { listItems } from '../services/items';

export const useFeaturedItems = (limit = 4) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener artículos destacados (los más recientes)
        const result = await listItems({ 
          limit, 
          sortBy: 'recent'
        });
        
        setItems(result.list || []);
      } catch (err) {
        console.error('Error fetching featured items:', err);
        setError(err.message || 'Error al cargar los artículos destacados');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, [limit]);

  return { items, loading, error };
};
