import User from "./User.js";
import Item from "./Item.js";
import Request from "./Request.js";

User.hasMany(Item, { foreignKey: "user_id", onDelete: "CASCADE" });
Item.belongsTo(User, { foreignKey: "user_id" });

Item.hasMany(Request, { foreignKey: "item_id", onDelete: "CASCADE" });
Request.belongsTo(Item, { foreignKey: "item_id" });

export {
  User,
  Item,
  Request,
};
