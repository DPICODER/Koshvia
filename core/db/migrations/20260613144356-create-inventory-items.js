"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory_items", {
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
                  createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex(
      "inventory_items",
      ["tenant_id", "item_name"],
      {
        name: "inventory_items_tenant_name_idx",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inventory_items");
  },
};