import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Item from "./Item.js";

const Favorite = sequelize.define(
  "Favorite",
  {
    id_favorite: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_user",
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Item,
        key: "id_item",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "favorites",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "item_id"],
        name: "unique_user_item_favorite"
      }
    ]
  }
);

export default Favorite; 