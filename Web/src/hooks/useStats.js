import { useState, useEffect } from 'react';
import { getFilterStats } from '../services/items';

export const useStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const statsData = await getFilterStats();
        
        // Transformar los datos del backend a un formato más amigable
        const formattedStats = [
          { 
            label: "Artículos Disponibles", 
            value: `${statsData.total || 0}+` 
          },
          { 
            label: "Categorías Activas", 
            value: `${statsData.categories?.length || 0}+` 
          },
          { 
            label: "Kg de Residuos Evitados", 
            value: `${Math.floor((statsData.total || 0) * 0.5)}+` 
          },
        ];
        
        setStats(formattedStats);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError(err.message || 'Error al cargar las estadísticas');
        // Usar valores por defecto en caso de error
        setStats([
          { label: "Artículos Disponibles", value: "0+" },
          { label: "Categorías Activas", value: "0+" },
          { label: "Kg de Residuos Evitados", value: "0+" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};
