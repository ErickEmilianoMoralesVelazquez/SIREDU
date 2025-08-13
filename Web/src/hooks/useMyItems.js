import { useState, useEffect } from 'react';
import { getMyItems, deleteItem, updateItemStatus } from '../services/items';

export const useMyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    interested: 0
  });

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getMyItems();
      const itemsList = result.list || [];
      
      setItems(itemsList);
      
      // Calcular estadísticas
      const total = itemsList.length;
      const active = itemsList.filter(item => item.status === 'available').length;
      const interested = itemsList.reduce((sum, item) => sum + (item.favoriteCount || 0), 0);
      
      setStats({ total, active, interested });
    } catch (err) {
      console.error('Error fetching my items:', err);
      setError(err.message || 'Error al cargar tus artículos');
      setItems([]);
      setStats({ total: 0, active: 0, interested: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteItem(itemId);
      // Recargar la lista después de eliminar
      await fetchMyItems();
      return { success: true };
    } catch (err) {
      console.error('Error deleting item:', err);
      return { success: false, error: err.message };
    }
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    try {
      await updateItemStatus(itemId, newStatus);
      // Actualizar el estado local
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, status: newStatus }
            : item
        )
      );
      
      // Recalcular estadísticas
      const updatedItems = items.map(item => 
        item.id === itemId ? { ...item, status: newStatus } : item
      );
      const active = updatedItems.filter(item => item.status === 'available').length;
      setStats(prev => ({ ...prev, active }));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating item status:', err);
      return { success: false, error: err.message };
    }
  };

  const refreshItems = () => {
    fetchMyItems();
  };

  return { 
    items, 
    loading, 
    error, 
    stats, 
    handleDeleteItem, 
    handleUpdateStatus, 
    refreshItems 
  };
};
