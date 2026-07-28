'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stock_transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'RESTRICT',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'RESTRICT',
      },
      type: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    })

    await queryInterface.addIndex('stock_transactions', ['product_id'])
    await queryInterface.addIndex('stock_transactions', ['user_id'])
    await queryInterface.addIndex('stock_transactions', ['type'])
    await queryInterface.addIndex('stock_transactions', ['created_at'])
    await queryInterface.addIndex('stock_transactions', ['product_id', 'created_at'])
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stock_transactions')
  },
}