import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    // Verificar si las tablas principales existen
    const [results] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'siredu_db' 
      AND TABLE_NAME IN ('users', 'items', 'favorites', 'requests')
    `);

    const existingTables = results.map(row => row.TABLE_NAME);
    const requiredTables = ['users', 'items', 'favorites', 'requests'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log(`⚠️  Tablas faltantes detectadas: ${missingTables.join(', ')}`);
      console.log("🔄 Sincronizando base de datos...");
      
      try {
        await sequelize.sync({ force: false });
        console.log("✅ Tablas sincronizadas exitosamente");
      } catch (syncError) {
        console.error("❌ Error en sincronización:", syncError.message);
        console.log("⚠️  Continuando sin sincronización...");
      }
    } else {
      console.log("✅ Todas las tablas existen - omitiendo sincronización");
    }

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando servidor:", error);
  }
};

startServer();
