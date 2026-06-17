"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("inventory_items", ["tenant_id", "sku"], {
      unique: true,
      name: "tenant_sku_unique_idx", // Custom name for the index
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("inventory_items", "tenant_sku_unique_idx");
  },
};
