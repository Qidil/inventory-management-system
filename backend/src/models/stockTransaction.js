const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class StockTransaction extends Model {
    static associate(models) {
      StockTransaction.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' })
      StockTransaction.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }
  }

  StockTransaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
          isIn: {
            args: [['IN', 'OUT']],
            msg: 'Tipe transaksi harus IN atau OUT',
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: { args: [1], msg: 'Kuantitas harus lebih dari 0' },
        },
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'StockTransaction',
      tableName: 'stock_transactions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    },
  )

  return StockTransaction
}