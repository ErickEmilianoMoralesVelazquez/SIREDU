import app from "./app.js";
import sequelize from "./config/database.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    await sequelize.sync({ alter: true });
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
