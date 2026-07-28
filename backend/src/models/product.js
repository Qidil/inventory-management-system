const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' })
      Product.belongsTo(models.Supplier, { foreignKey: 'supplier_id', as: 'supplier' })
      Product.hasMany(models.StockTransaction, { foreignKey: 'product_id', as: 'transactions' })
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      supplier_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: { msg: 'Kode barang sudah ada' },
        validate: {
          notEmpty: { msg: 'Kode barang tidak boleh kosong' },
        },
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Nama barang tidak boleh kosong' },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
          isPositive(value) {
            if (parseFloat(value) <= 0) throw new Error('Harga harus lebih dari 0')
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: 'Stok tidak boleh negatif' },
        },
      },
      minimum_stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: 'Minimum stok tidak boleh negatif' },
        },
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: false,
      defaultScope: {
        where: { deleted_at: null },
      },
      scopes: {
        withDeleted: { where: {} },
      },
    },
  )

  return Product
}