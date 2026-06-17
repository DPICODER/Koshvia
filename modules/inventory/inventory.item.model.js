const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../../core/db/database");
const InventoryItem = sequelize.define(
  "InventoryItem",
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

    item_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    sku: {
      type: Sequelize.STRING,
    },

    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    cost_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },

    selling_price: {
      type: Sequelize.DECIMAL(10, 2),
    },

    minimum_stock: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },

    image_url: {
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
    tableName: "inventory_items",
    hooks: {
      beforeValidate: (item) => {
        if (!item.sku && item.item_name) {
          const cleanName = item.item_name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .substring(0, 4);

          const randomSuffix = Math.floor(1000 + Math.random() * 9000);

          item.sku = `${cleanName}-${randomSuffix}`;
        }
      },
    }
  }
);

module.exports = InventoryItem;