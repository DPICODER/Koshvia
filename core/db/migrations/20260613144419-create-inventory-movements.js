"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("inventory_movements", {
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
                  createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    await queryInterface.addIndex(
      "inventory_movements",
      ["tenant_id", "item_id"],
      {
        name: "inventory_movements_tenant_item_idx",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("inventory_movements");
  },
};