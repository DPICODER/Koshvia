const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../core/db/database");
const InventoryMovement = sequelize.define(
  "InventoryMovement",
  {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.literal("gen_random_uuid()"),
    },

    tenant_id: {
      type: Sequelize.UUID,
      allowNull: false,
    },

    item_id: {
      type: Sequelize.UUID,
      allowNull: false,

      references: {
        model: "inventory_items",
        key: "id",
      },

      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    movement_type: {
      type: Sequelize.ENUM(
        "PURCHASE",
        "SALE",
        "RETURN",
        "ADJUSTMENT",
        "DAMAGE"
      ),
      allowNull: false,
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    remarks: {
      type: Sequelize.TEXT,
    },
        createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    timestamps:true,
    tableName: "inventory_movements",
  }
);

module.exports = InventoryMovement;