# API Documentation

## Document Role
- **Source of Truth:** External API contract for this project
- **Primary Owner:** `brainstorm-api`
- **Out of Scope:** Internal service architecture, DB migration details, and UI copy

## Scope Summary
| Area | Status | Notes |
|------|--------|-------|
| Auth | Covered | Login, auto logout midnight |
| Categories | Covered | CRUD, Admin only |
| Suppliers | Covered | CRUD, Admin only |
| Products | Covered | CRUD with soft delete |
| Transactions | Covered | Stock In, Stock Out, History |
| Dashboard | Covered | Stats & charts |
| Reports | Covered | Admin only |
| Users | Covered | CRUD by Admin |

## Canonical Terminology
| Term | Meaning |
|------|---------|
| Stock In | Transaksi menambah quantity stok (type: IN) |
| Stock Out | Transaksi mengurangi quantity stok (type: OUT) |
| Soft Delete | Kolom `deleted_at` diisi timestamp saat hapus |

## Environments
| Environment | Base URL |
|-------------|---------|
| Development | `http://localhost:3000/api/v1` |
| Production | `https://[domain]/api/v1` |

## Versioning
- **Strategy:** URI Path `/v1/`
- **Current Version:** v1

## Authentication
- **Method:** Bearer Token (JWT)
- **Header:** `Authorization: Bearer <token>`
- **Token Expiry:** Hingga jam 23:59 hari yang sama — user akan auto logout setiap jam 00.00 (midnight) dan harus login ulang
- **Login Endpoint:** `POST /auth/login`

## Security Controls
- **CSRF Protection:** Not applicable (token-based auth)
- **Ownership/Authorization Rule:** RBAC — middleware `authorize(['admin'])` untuk endpoint Admin-only
- **Sensitive Endpoints:** Login, Products (Admin), Users (Admin), Stock Out (validasi stok)
- **Rate Limiting:** Login endpoint dilindungi rate limiting

## Standard Response Format
```json
{
  "success": true,
  "data": {},
  "message": "string (optional)",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasNext": true
  }
}
```

## Error Catalog
| HTTP Code | Internal Code | Meaning |
|-----------|---------------|---------|
| 400 | `VALIDATION_ERROR` | Input invalid; details in `errors` field |
| 401 | `UNAUTHORIZED` | Token missing or expired (termasuk auto logout midnight) |
| 403 | `FORBIDDEN` | No permission for this resource |
| 404 | `NOT_FOUND` | Resource doesn't exist |
| 409 | `CONFLICT` | Duplicate data (email/kode sudah ada) |
| 422 | `UNPROCESSABLE` | Business logic validation failed (stok tidak cukup) |
| 429 | `RATE_LIMIT` | Too many requests (login) |
| 500 | `SERVER_ERROR` | Internal server error |

**Error Response Format:**
```json
{
  "success": false,
  "message": "User-friendly error message",
  "code": "INTERNAL_CODE",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

## Pagination
- **Type:** Offset-based (`?page=1&limit=20`)
- **Default:** `limit=20`, `page=1`
- **Max Limit:** `100`

## Filtering & Sorting
- **Filter:** Query params like `?category_id=uuid&status=low_stock`
- **Sort:** `?sort=name&order=asc` or `?sort=created_at&order=desc`
- **Search:** `?search=keyword` (search by name/code)

## Rate Limiting
- **Login Endpoint:** Max 5 attempts per 15 minutes per IP
- **General API:** 100 requests per minute per user

## Endpoint Inventory
| ID | Method | Path | Auth | Trace to |
|----|--------|------|------|----------|
| API-01 | POST | `/auth/login` | Public | FEAT-01 |
| API-02 | GET | `/categories` | Required | FEAT-02 |
| API-03 | POST | `/categories` | Admin | FEAT-02 |
| API-04 | GET | `/categories/:id` | Required | FEAT-02 |
| API-05 | PUT | `/categories/:id` | Admin | FEAT-02 |
| API-06 | DELETE | `/categories/:id` | Admin | FEAT-02 |
| API-07 | GET | `/suppliers` | Required | FEAT-03 |
| API-08 | POST | `/suppliers` | Admin | FEAT-03 |
| API-09 | GET | `/suppliers/:id` | Required | FEAT-03 |
| API-10 | PUT | `/suppliers/:id` | Admin | FEAT-03 |
| API-11 | DELETE | `/suppliers/:id` | Admin | FEAT-03 |
| API-12 | GET | `/products` | Required | FEAT-04 |
| API-13 | POST | `/products` | Admin | FEAT-04 |
| API-14 | GET | `/products/:id` | Required | FEAT-04 |
| API-15 | PUT | `/products/:id` | Admin | FEAT-04 |
| API-16 | DELETE | `/products/:id` | Admin | FEAT-04 |
| API-17 | POST | `/transactions/stock-in` | Required | FEAT-05 |
| API-18 | POST | `/transactions/stock-out` | Required | FEAT-06 |
| API-19 | GET | `/transactions` | Required | FEAT-07 |
| API-20 | GET | `/transactions/product/:productId` | Required | FEAT-07 |
| API-21 | GET | `/dashboard` | Required | FEAT-08 |
| API-22 | GET | `/reports` | Admin | FEAT-09 |
| API-23 | GET | `/users` | Admin | FEAT-10 |
| API-24 | POST | `/users` | Admin | FEAT-10 |
| API-25 | PUT | `/users/:id` | Admin | FEAT-10 |
| API-26 | DELETE | `/users/:id` | Admin | FEAT-10 |

---

## Resource: Auth
**Trace to:** FEAT-01

### API-01 — POST /auth/login
**Description:** Login user, mengembalikan JWT
**Auth:** Public

**Request Body:**
```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

**Response 401:**
```json
{
  "success": false,
  "message": "Email atau password salah",
  "code": "UNAUTHORIZED"
}
```

**Response 429:**
```json
{
  "success": false,
  "message": "Terlalu banyak percobaan login. Coba lagi nanti.",
  "code": "RATE_LIMIT"
}
```

**Notes:**
- Token expiry diatur hingga 23:59 hari yang sama
- Auto logout setiap jam 00.00 — user harus login ulang

---

## Resource: Categories
**Trace to:** FEAT-02

### API-02 — GET /categories
**Description:** Fetch list of categories
**Auth:** Required

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": "uuid", "name": "Elektronik", "description": "Barang elektronik" }
  ]
}
```

### API-03 — POST /categories
**Description:** Create new category
**Auth:** Admin only

**Request Body:**
```json
{
  "name": "Elektronik",
  "description": "Barang elektronik"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Elektronik", "description": "Barang elektronik" }
}
```

**Possible Errors:** `400` (validation), `409` (duplicate name), `401`, `403`

### API-04 — GET /categories/:id
**Description:** Get category by ID
**Auth:** Required

### API-05 — PUT /categories/:id
**Description:** Update category
**Auth:** Admin only

### API-06 — DELETE /categories/:id
**Description:** Delete category
**Auth:** Admin only
**Note:** Hanya jika tidak ada produk yang menggunakan kategori ini (RESTRICT)

---

## Resource: Suppliers
**Trace to:** FEAT-03
*(Pola sama dengan Categories - CRUD standar)*

### API-07 — GET /suppliers
**Auth:** Required

### API-08 — POST /suppliers
**Auth:** Admin only

### API-09 — GET /suppliers/:id
**Auth:** Required

### API-10 — PUT /suppliers/:id
**Auth:** Admin only

### API-11 — DELETE /suppliers/:id
**Auth:** Admin only

---

## Resource: Products
**Trace to:** FEAT-04

### API-12 — GET /products
**Description:** Fetch list of products (excludes soft-deleted)
**Auth:** Required

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| search | string | - | Search by name or code |
| category_id | string | - | Filter by category |
| supplier_id | string | - | Filter by supplier |
| status | string | - | `in_stock`, `low_stock`, `out_of_stock` |
| sort | string | `name` | `name`, `price`, `stock`, `created_at` |
| order | string | `asc` | `asc` or `desc` |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "code": "PRD001",
      "name": "Laptop",
      "category": { "id": "uuid", "name": "Elektronik" },
      "supplier": { "id": "uuid", "name": "PT Sukses" },
      "price": 8500000,
      "stock": 50,
      "minimum_stock": 10,
      "status": "in_stock"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 100, "hasNext": true }
}
```

### API-13 — POST /products
**Description:** Create new product
**Auth:** Admin only

**Request Body:**
```json
{
  "code": "PRD001",
  "name": "Laptop",
  "category_id": "uuid",
  "supplier_id": "uuid",
  "description": "Laptop gaming",
  "price": 8500000,
  "minimum_stock": 10
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "code": "PRD001", "name": "Laptop", "stock": 0 }
}
```

**Possible Errors:** `400` (validation), `409` (code already exists), `401`, `403`

### API-14 — GET /products/:id
**Description:** Get product detail with transaction history
**Auth:** Required

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "code": "PRD001",
    "name": "Laptop",
    "category": { "id": "uuid", "name": "Elektronik" },
    "supplier": { "id": "uuid", "name": "PT Sukses" },
    "price": 8500000,
    "stock": 50,
    "minimum_stock": 10,
    "description": "Laptop gaming",
    "transactions": [
      { "id": "uuid", "type": "IN", "quantity": 10, "user": "Admin", "created_at": "2026-07-27T09:00:00Z" }
    ]
  }
}
```

### API-15 — PUT /products/:id
**Description:** Update product (cannot update stock)
**Auth:** Admin only

### API-16 — DELETE /products/:id
**Description:** Soft delete product (sets `deleted_at`)
**Auth:** Admin only

**Response 200:**
```json
{
  "success": true,
  "message": "Barang berhasil dihapus"
}
```

---

## Resource: Transactions
**Trace to:** FEAT-05, FEAT-06, FEAT-07

### API-17 — POST /transactions/stock-in
**Description:** Record stock incoming
**Auth:** Required

**Request Body:**
```json
{
  "product_id": "uuid",
  "quantity": 10,
  "note": "Restok dari supplier"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "IN",
    "product_id": "uuid",
    "quantity": 10,
    "note": "Restok dari supplier",
    "created_at": "2026-07-27T09:00:00Z"
  }
}
```

**Possible Errors:** `400` (validation), `404` (product not found)

### API-18 — POST /transactions/stock-out
**Description:** Record stock outgoing
**Auth:** Required

**Request Body:**
```json
{
  "product_id": "uuid",
  "quantity": 5,
  "note": "Pengiriman ke toko cabang"
}
```

**Response 201:** (same format as stock-in)

**Possible Errors:** `400` (validation, stock insufficient), `404`, `422` (stock not enough)

### API-19 — GET /transactions
**Description:** Fetch transaction history
**Auth:** Required

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |
| type | string | - | Filter: `IN` or `OUT` |
| start_date | string | - | Filter date range start |
| end_date | string | - | Filter date range end |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "IN",
      "product": { "id": "uuid", "code": "PRD001", "name": "Laptop" },
      "user": { "id": "uuid", "name": "Admin" },
      "quantity": 10,
      "note": "Restok",
      "created_at": "2026-07-27T09:00:00Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 50, "hasNext": true }
}
```

### API-20 — GET /transactions/product/:productId
**Description:** Fetch transaction history for specific product
**Auth:** Required

---

## Resource: Dashboard
**Trace to:** FEAT-08

### API-21 — GET /dashboard
**Description:** Get dashboard statistics
**Auth:** Required

**Response 200:**
```json
{
  "success": true,
  "data": {
    "total_products": 100,
    "total_categories": 8,
    "stock_in_today": 25,
    "stock_out_today": 10,
    "low_stock_products": 3,
    "out_of_stock_products": 1,
    "chart_7_days": [
      { "date": "2026-07-21", "in": 15, "out": 5 },
      { "date": "2026-07-22", "in": 20, "out": 8 }
    ],
    "recent_activities": [
      {
        "type": "IN",
        "product": "Laptop",
        "quantity": 10,
        "user": "Admin",
        "created_at": "2026-07-27T09:00:00Z"
      }
    ]
  }
}
```

---

## Resource: Reports
**Trace to:** FEAT-09

### API-22 — GET /reports
**Description:** Generate reports (format: JSON)
**Auth:** Admin only

**Query Params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| start_date | string | - | Start date |
| end_date | string | - | End date |
| type | string | `all` | `stock_in`, `stock_out`, `all` |

---

## Resource: Users
**Trace to:** FEAT-10

### API-23 — GET /users
**Auth:** Admin only

### API-24 — POST /users
**Description:** Create new user (only Admin can register users)
**Auth:** Admin only

**Request Body:**
```json
{
  "name": "Staff Baru",
  "email": "staff@mail.com",
  "password": "password123",
  "role": "staff"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "uuid", "name": "Staff Baru", "email": "staff@mail.com", "role": "staff" }
}
```

### API-25 — PUT /users/:id
**Auth:** Admin only

### API-26 — DELETE /users/:id
**Auth:** Admin only
**Note:** Cannot delete self

---

## Assumptions & Open Questions
- Rate limiting untuk login: 5 attempts per 15 minutes (dapat disesuaikan)
- Semua list endpoint menggunakan pagination offset-based
- Filter tanggal menggunakan format ISO 8601 (`YYYY-MM-DD`)