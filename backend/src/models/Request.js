import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Item from "./Item.js";

const Request = sequelize.define(
  "Request",
  {
    id_request: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Item,
        key: "id_item",
      },
    },
  },
  {
    tableName: "requests",
    timestamps: false,
  }
);

export default Request;
