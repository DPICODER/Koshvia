'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "inventory_movements",
      "old_quantity",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    );

    await queryInterface.addColumn(
      "inventory_movements",
      "updated_quantity",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    );

    await queryInterface.addColumn(
      "inventory_movements",
      "difference_quantity",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      "inventory_movements",
      "old_quantity"
    )

    await queryInterface.removeColumn(
      "inventory_movements",
      "updated_quantity",
    );

    await queryInterface.removeColumn(
      "inventory_movements",
      "difference_quantity",
    )
  }
};
