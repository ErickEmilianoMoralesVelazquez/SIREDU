import User from "./User.js";
import Item from "./Item.js";
import Request from "./Request.js";
import Favorite from "./Favorite.js";

User.hasMany(Item, { foreignKey: "user_id", onDelete: "CASCADE" });
Item.belongsTo(User, { foreignKey: "user_id" });

Item.hasMany(Request, { foreignKey: "item_id", onDelete: "CASCADE" });
Request.belongsTo(Item, { foreignKey: "item_id" });

// Relaciones para favoritos
User.hasMany(Favorite, { foreignKey: "user_id", onDelete: "CASCADE" });
Favorite.belongsTo(User, { foreignKey: "user_id" });

Item.hasMany(Favorite, { foreignKey: "item_id", onDelete: "CASCADE" });
Favorite.belongsTo(Item, { foreignKey: "item_id" });

export {
  User,
  Item,
  Request,
  Favorite,
};
