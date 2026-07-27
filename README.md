# Inventory Management System

> ⚠️ **Disclaimer:** Project ini masih dalam tahap pengembangan. Fitur dan dokumentasi dapat berubah sewaktu-waktu.

Sistem manajemen inventaris full-stack untuk mencatat, memantau, dan mengelola stok barang. Dibangun dengan **React (Vite) + Tailwind CSS + Express.js + Sequelize ORM + PostgreSQL**.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)

---

## Key Features

- **Authentication & RBAC** — Login JWT, middleware role-based (Admin/Staff)
- **CRUD Categories** — Kelola kategori barang
- **CRUD Suppliers** — Kelola supplier barang
- **CRUD Products** — Kelola barang dengan soft delete
- **Stock In** — Menambah stok barang dengan validasi
- **Stock Out** — Mengurangi stok barang dengan validasi kecukupan
- **History** — Riwayat seluruh transaksi Stock In/Out
- **Dashboard** — Kartu statistik + grafik 7 hari + recent activity
- **Reports** — Laporan (khusus Admin)
- **User Management** — CRUD user oleh Admin

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Styling | Tailwind CSS v3 + shadcn/ui |
| HTTP Client | Axios |
| Backend | Express.js |
| ORM | Sequelize |
| Database | PostgreSQL 15+ |
| Auth | JWT + bcrypt |
| Runtime | Node.js 20 LTS |

---

## Cara Clone & Install

### 1. Clone Repository

```bash
git clone https://github.com/Qidil/inventory-management-system.git
cd inventory-management-system
```

### 2. Install Dependencies

```bash
# Install semua dependencies (frontend + backend)
npm install
```

### 3. Setup Database

Buat database PostgreSQL, lalu copy file `.env.example`:

```bash
# Backend
cp backend/.env.example backend/.env
```

Edit `backend/.env` dan isi kredensial database:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
```

### 4. Jalankan Development Server

```bash
# Jalankan backend & frontend secara bersamaan
npm run dev

# Atau jalankan secara terpisah
npm run dev:backend    # http://localhost:3000
npm run dev:frontend   # http://localhost:5173
```

---

## Folder Structure

```
inventory-management-system/
├── frontend/                    # React (Vite)
│   ├── src/
│   │   ├── components/          # Shared components
│   │   │   ├── layout/          # Sidebar, Header, MainLayout
│   │   │   └── ui/              # Button, Card, Input, Modal, Table
│   │   ├── pages/               # Page components
│   │   ├── context/             # React Context (AuthContext)
│   │   ├── services/            # Axios API calls
│   │   ├── hooks/               # Custom hooks
│   │   └── utils/               # Helpers, constants
│   └── package.json
│
├── backend/                     # Express.js
│   ├── src/
│   │   ├── config/              # DB config, env
│   │   ├── models/              # Sequelize models
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic
│   │   ├── repositories/        # DB queries
│   │   ├── routes/              # Route definitions
│   │   ├── middleware/          # Auth, RBAC, validation
│   │   ├── utils/               # Helpers
│   │   └── app.js               # Express app entry
│   └── package.json
│
├── project-context/             # Spec documents
├── assets/design/               # Design assets (logo, banner, brand)
└── package.json                 # Root workspace config
```

---

## API Documentation

Base URL: `http://localhost:3000/api/v1`

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | Public | Login user |
| `/categories` | GET/POST | Required/Admin | CRUD kategori |
| `/suppliers` | GET/POST | Required/Admin | CRUD supplier |
| `/products` | GET/POST | Required/Admin | CRUD produk |
| `/transactions/stock-in` | POST | Required | Stock In |
| `/transactions/stock-out` | POST | Required | Stock Out |
| `/transactions` | GET | Required | Riwayat transaksi |
| `/dashboard` | GET | Required | Statistik dashboard |
| `/reports` | GET | Admin | Laporan |
| `/users` | GET/POST | Admin | Manajemen user |

---

## Business Rules

- Stok awal produk = 0
- Perubahan stok hanya melalui Stock In/Stock Out
- Stock Out tidak boleh melebihi stok tersedia
- Soft delete untuk produk — riwayat tetap utuh
- Email & kode barang harus unik
- Semua transaksi mencatat user yang melakukan aksi
- Auto logout setiap jam 00:00 (midnight)

---

## License

MIT