import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Item = sequelize.define(
  "Item",
  {
    id_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tittle: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    picture1: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    picture2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    picture3: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("available", "sold", "reserved", "pending", "approved", "rejected", "flagged"),
      allowNull: false,
      defaultValue: "pending",
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    exchange_type: {
      type: DataTypes.ENUM("venta", "renta", "prestamo"),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      },
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id_user",
      },
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "items",
    timestamps: false,
  }
);

export default Item;
