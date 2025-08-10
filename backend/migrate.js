import sequelize from "./src/config/database.js";
import { User, Item, Favorite, Request } from "./src/models/index.js";

const runMigration = async () => {
  try {
    console.log("🔄 Iniciando migración manual...");
    
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log("✅ Conexión establecida");

    // Verificar tablas existentes
    const [results] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'siredu_db'
    `);
    
    console.log("📋 Tablas existentes:");
    results.forEach(row => console.log(`  - ${row.TABLE_NAME}`));

    // Verificar si necesitamos crear nuevas tablas
    const existingTables = results.map(row => row.TABLE_NAME);
    const requiredTables = ['users', 'items', 'favorites', 'requests'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.log(`\n⚠️  Tablas faltantes: ${missingTables.join(', ')}`);
      console.log("🔄 Creando tablas faltantes...");
      
      await sequelize.sync({ force: false });
      console.log("✅ Tablas creadas exitosamente");
    } else {
      console.log("\n✅ Todas las tablas existen");
      
      // Verificar estructura de tablas existentes
      console.log("\n🔍 Verificando estructura de tablas...");
      
      for (const tableName of requiredTables) {
        const [columns] = await sequelize.query(`
          SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = 'siredu_db' 
          AND TABLE_NAME = '${tableName}'
          ORDER BY ORDINAL_POSITION
        `);
        
        console.log(`\n📊 ${tableName.toUpperCase()}:`);
        columns.forEach(col => {
          console.log(`  - ${col.COLUMN_NAME}: ${col.DATA_TYPE} ${col.IS_NULLABLE === 'NO' ? '(NOT NULL)' : ''} ${col.COLUMN_KEY ? `(${col.COLUMN_KEY})` : ''}`);
        });
      }
    }

    console.log("\n🎉 Migración completada exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    process.exit(1);
  }
};

runMigration(); 