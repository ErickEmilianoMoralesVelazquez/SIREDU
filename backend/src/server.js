import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    //se cambio para solucionar un error de sincronización de las tablas
    await sequelize.sync({ force: false });
    console.log("Tablas sincronizadas");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error iniciando servidor:", error);
  }
};

startServer();
