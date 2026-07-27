# Database Schema

## Document Role
- **Source of Truth:** Data model and persistence contract
- **Primary Owner:** `brainstorm-schema`
- **Out of Scope:** Endpoint behavior, UI rules, and code-level implementation details

## Global Conventions
- **Database:** PostgreSQL 15+
- **ID Strategy:** UUID (auto-generated via `gen_random_uuid()`)
- **Table Naming:** snake_case, plural
- **Audit Fields:** `created_at`, `updated_at` on all tables, set by Sequelize
- **Soft Delete:** Yes — `deleted_at` column on `products`
- **Timezone:** UTC
- **Retention/Deletion:** Data tidak dihapus permanen (soft delete; history tetap ada)

## Entity Map
| Data ID | Table | Purpose | Trace to |
|--------|-------|---------|----------|
| DATA-01 | `users` | Menyimpan data pengguna sistem | FEAT-01 |
| DATA-02 | `categories` | Kategori barang | FEAT-02 |
| DATA-03 | `suppliers` | Pemasok/supplier barang | FEAT-03 |
| DATA-04 | `products` | Data barang inventaris | FEAT-04 |
| DATA-05 | `stock_transactions` | Riwayat semua transaksi stok | FEAT-05, FEAT-06, FEAT-07 |

---

## Table DATA-01: `users`
> Menyimpan data pengguna yang bisa mengakses sistem (Admin & Staff)
> **Trace to:** FEAT-01, FEAT-10
> **PII:** Yes — contains email
> **Data Protection:** Password di-hash dengan bcrypt; email disimpan plain text

| Column | Type | Nullable | Default | Constraint | Notes |
|--------|------|----------|---------|------------|-------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | |
| name | VARCHAR(100) | No | — | NOT NULL | Nama lengkap |
| email | VARCHAR(150) | No | — | UNIQUE, NOT NULL | Email login (unique) |
| password | TEXT | No | — | NOT NULL | Hash bcrypt |
| role | VARCHAR(20) | No | 'staff' | NOT NULL | `admin` atau `staff` |
| created_at | TIMESTAMP | No | NOW() | | Auto-set |
| updated_at | TIMESTAMP | No | NOW() | | Auto-update |

**Relationships:**
- One-to-Many to `stock_transactions` via `user_id` — on delete: RESTRICT

**Indexes:**
- `email` — UNIQUE (login lookup)
- `role` — filtering by role

---

## Table DATA-02: `categories`
> Kategori pengelompokan barang
> **Trace to:** FEAT-02
> **PII:** No

| Column | Type | Nullable | Default | Constraint | Notes |
|--------|------|----------|---------|------------|-------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | |
| name | VARCHAR(100) | No | — | NOT NULL, UNIQUE | Nama kategori |
| description | TEXT | Yes | — | | Deskripsi opsional |
| created_at | TIMESTAMP | No | NOW() | | Auto-set |
| updated_at | TIMESTAMP | No | NOW() | | Auto-update |

**Relationships:**
- One-to-Many to `products` via `category_id` — on delete: RESTRICT

**Indexes:**
- `name` — UNIQUE

---

## Table DATA-03: `suppliers`
> Pemasok barang
> **Trace to:** FEAT-03
> **PII:** No

| Column | Type | Nullable | Default | Constraint | Notes |
|--------|------|----------|---------|------------|-------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | |
| name | VARCHAR(150) | No | — | NOT NULL | Nama supplier |
| phone | VARCHAR(20) | Yes | — | | Nomor telepon |
| email | VARCHAR(150) | Yes | — | | Email supplier |
| address | TEXT | Yes | — | | Alamat supplier |
| created_at | TIMESTAMP | No | NOW() | | Auto-set |
| updated_at | TIMESTAMP | No | NOW() | | Auto-update |

**Relationships:**
- One-to-Many to `products` via `supplier_id` — on delete: RESTRICT

---

## Table DATA-04: `products`
> Data barang inventaris — inti dari sistem
> **Trace to:** FEAT-04, FEAT-05, FEAT-06, FEAT-08
> **PII:** No

| Column | Type | Nullable | Default | Constraint | Notes |
|--------|------|----------|---------|------------|-------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | |
| category_id | UUID | No | — | FK → categories.id | |
| supplier_id | UUID | No | — | FK → suppliers.id | |
| code | VARCHAR(30) | No | — | UNIQUE, NOT NULL | Kode barang |
| name | VARCHAR(150) | No | — | NOT NULL | Nama barang |
| description | TEXT | Yes | — | | Deskripsi barang |
| price | NUMERIC(12,2) | No | — | NOT NULL, CHECK > 0 | Harga barang |
| stock | INTEGER | No | 0 | NOT NULL, CHECK >= 0 | Stok saat ini |
| minimum_stock | INTEGER | No | 0 | NOT NULL, CHECK >= 0 | Batas minimal stok |
| deleted_at | TIMESTAMP | Yes | null | | Soft delete timestamp |
| created_at | TIMESTAMP | No | NOW() | | Auto-set |
| updated_at | TIMESTAMP | No | NOW() | | Auto-update |

**Relationships:**
- Many-to-One to `categories` via `category_id` — on delete: RESTRICT
- Many-to-One to `suppliers` via `supplier_id` — on delete: RESTRICT
- One-to-Many to `stock_transactions` via `product_id` — on delete: RESTRICT

**Indexes:**
- `code` — UNIQUE
- `category_id` — FK index
- `supplier_id` — FK index
- `deleted_at` — filter soft-deleted products
- Composite index on `(category_id, deleted_at)` — query produk by kategori (tidak termasuk soft delete)

---

## Table DATA-05: `stock_transactions`
> Mencatat setiap perubahan stok barang (IN/OUT)
> **Trace to:** FEAT-05, FEAT-06, FEAT-07
> **PII:** No

| Column | Type | Nullable | Default | Constraint | Notes |
|--------|------|----------|---------|------------|-------|
| id | UUID | No | gen_random_uuid() | PRIMARY KEY | |
| product_id | UUID | No | — | FK → products.id | Barang yang bertransaksi |
| user_id | UUID | No | — | FK → users.id | User yang melakukan aksi |
| type | VARCHAR(5) | No | — | NOT NULL, CHECK IN ('IN','OUT') | Jenis transaksi |
| quantity | INTEGER | No | — | NOT NULL, CHECK > 0 | Jumlah barang |
| note | TEXT | Yes | — | | Catatan transaksi |
| created_at | TIMESTAMP | No | NOW() | | Auto-set (tidak di-update) |

**Relationships:**
- Many-to-One to `products` via `product_id` — on delete: RESTRICT
- Many-to-One to `users` via `user_id` — on delete: RESTRICT

**Indexes:**
- `product_id` — FK index (riwayat per produk)
- `user_id` — FK index (riwayat per user)
- `type` — filter IN/OUT
- `created_at` — sorting history by date
- Composite index on `(product_id, created_at)` — riwayat produk diurutkan waktu

---

## Entity Relationship Diagram (Text)
```
users (1) ──< stock_transactions (N)
categories (1) ──< products (N)
suppliers (1) ──< products (N)
products (1) ──< stock_transactions (N)
```

## Intentional Denormalization
| Table | Denormalized Column | Reason |
|-------|-------------------|--------|
| — | — | Tidak ada denormalisasi untuk MVP |

## Data Protection & Retention
| Table/Column | Category | Protection | Retention | Notes |
|-------------|----------|-----------|-----------|-------|
| users.password | Credential | bcrypt hash | Selama akun aktif | Tidak bisa reverse |
| users.email | PII | Plain text | Selama akun aktif | Data internal |

## Not Yet Modeled / Deferred
- Foto barang (opsional, future enhancement)

## Assumptions & Open Questions
- Stock `CHECK >= 0` di level database sebagai safety net selain validasi aplikasi
- `stock_transactions` tidak memiliki `updated_at` karena riwayat tidak boleh diubah
- **⚠️ Nama database, user, dan password PostgreSQL akan diberikan user saat phase pembuatan database**

## Pending Decisions (Reminder)
| Item | Akan Diberikan Saat | Status |
|------|-------------------|--------|
| DB name | Phase pembuatan database | Menunggu |
| DB user | Phase pembuatan database | Menunggu |
| DB password | Phase pembuatan database | Menunggu |
| DB host/port | Phase pembuatan database | Default: localhost:5432 |