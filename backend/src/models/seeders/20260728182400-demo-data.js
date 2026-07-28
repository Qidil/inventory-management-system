'use strict'
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const uuidv4 = () => crypto.randomUUID()

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Admin',
        email: 'admin@mail.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Staff Gudang',
        email: 'staff@mail.com',
        password: hashedPassword,
        role: 'staff',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])

    const catId1 = uuidv4()
    const catId2 = uuidv4()

    await queryInterface.bulkInsert('categories', [
      { id: catId1, name: 'Elektronik', description: 'Barang elektronik', created_at: new Date(), updated_at: new Date() },
      { id: catId2, name: 'ATK', description: 'Alat Tulis Kantor', created_at: new Date(), updated_at: new Date() },
    ])

    const supId1 = uuidv4()
    const supId2 = uuidv4()

    await queryInterface.bulkInsert('suppliers', [
      { id: supId1, name: 'PT Elektronik Jaya', phone: '08123456789', email: 'info@elektronikjaya.com', address: 'Jakarta', created_at: new Date(), updated_at: new Date() },
      { id: supId2, name: 'CV Alat Tulis Murah', phone: '08198765432', email: 'sales@atkmurah.com', address: 'Bandung', created_at: new Date(), updated_at: new Date() },
    ])

    await queryInterface.bulkInsert('products', [
      {
        id: uuidv4(), category_id: catId1, supplier_id: supId1,
        code: 'PRD001', name: 'Laptop', description: 'Laptop gaming 16GB RAM',
        price: 8500000.00, stock: 10, minimum_stock: 3,
        created_at: new Date(), updated_at: new Date(),
      },
      {
        id: uuidv4(), category_id: catId1, supplier_id: supId1,
        code: 'PRD002', name: 'Mouse Wireless', description: 'Mouse wireless 2.4GHz',
        price: 150000.00, stock: 50, minimum_stock: 10,
        created_at: new Date(), updated_at: new Date(),
      },
      {
        id: uuidv4(), category_id: catId2, supplier_id: supId2,
        code: 'PRD003', name: 'Buku Tulis', description: 'Buku tulis 40 lembar',
        price: 5000.00, stock: 200, minimum_stock: 50,
        created_at: new Date(), updated_at: new Date(),
      },
      {
        id: uuidv4(), category_id: catId2, supplier_id: supId2,
        code: 'PRD004', name: 'Pulpen', description: 'Pulpen hitam standard',
        price: 3000.00, stock: 0, minimum_stock: 20,
        created_at: new Date(), updated_at: new Date(),
      },
    ])
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {})
    await queryInterface.bulkDelete('suppliers', null, {})
    await queryInterface.bulkDelete('categories', null, {})
    await queryInterface.bulkDelete('users', null, {})
  },
}