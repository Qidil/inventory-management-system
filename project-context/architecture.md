# Architecture

> **Version:** 1.0 | **Date:** 2026-07-27

## Document Role
- **Source of Truth:** System design, technical boundaries, and architectural decisions
- **Primary Owner:** `brainstorm-architecture`
- **Out of Scope:** Detailed API payload schemas, table-by-table database columns, UI design tokens, and task sequencing

## System Boundaries
| Topic | Canonical Document |
|-------|---------------------|
| Product scope and business intent | `project-context/PRD.md` |
| Data model and column-level contract | `project-context/schema.md` |
| Endpoint contract and error payloads | `project-context/api.md` |
| UI language and component styling | `project-context/StyleGuide.md` |
| Coding standards and AI behavior | `project-context/rules.md` |
| Execution order and implementation plan | `project-context/Task.md` |

---

## 1. System Context

**Users:** Admin (full access), Staff (limited access)

**External Services:** None (standalone system)

**System Architecture Diagram:**
```
[Browser: React SPA]
       ↕ HTTP (JSON)
[Express.js REST API]
       ↕ Sequelize ORM
[PostgreSQL Database]
```

## 2. Tech Stack
| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | React (Vite) | Latest | SPA dengan Vite bundler |
| Runtime | Node.js | 20 LTS | Dev (`npm run dev`) & Build (`npm run build`) |
| Styling | Tailwind CSS | v3 | Utility-first |
| HTTP Client | Axios | Latest | Interceptor untuk JWT |
| Backend | Express.js | Latest | REST API |
| ORM | Sequelize | Latest | PostgreSQL dialect |
| Database | PostgreSQL | 15+ | Relational |
| Language (FE) | JavaScript | ES2022+ | |
| Language (BE) | JavaScript | ES2022+ | |
| Auth | JWT + bcrypt | — | jsonwebtoken + bcrypt |

## 3. State Management
- **Client State:** React Context API (auth state, user session)
- **Server State:** Axios langsung + SWR lokal (data fetching)
- **Forms:** Controlled components (React state)
- **Persistence:** localStorage untuk theme preference

## 4. API Design
- **Type:** RESTful
- **Base Path:** `/api/v1`
- **Real-time:** Tidak ada (no WebSocket)
- **Response Format:** `{ success, data, message, meta }`

## 5. Folder Structure
```
inventory-management-system/
├── frontend/                    # React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/          # Shared components
│   │   │   ├── layout/          # Sidebar, Header, MainLayout
│   │   │   └── ui/              # Button, Card, Input, Modal, Table
│   │   ├── pages/               # Page components
│   │   │   ├── auth/            # Login
│   │   │   ├── dashboard/       # Dashboard
│   │   │   ├── products/        # CRUD Products
│   │   │   ├── categories/      # CRUD Categories
│   │   │   ├── suppliers/       # CRUD Suppliers
│   │   │   ├── transactions/    # Stock In/Out & History
│   │   │   ├── reports/         # Reports (Admin)
│   │   │   └── users/           # User Management (Admin)
│   │   ├── context/             # React Context (AuthContext)
│   │   ├── services/            # Axios API calls
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Helpers, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
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
└── database/                    # Migrations, seeders
```

## 6. Design Patterns
- **Main Pattern:** MVC (Model-View-Controller)
- **Layers Backend:** routes → middleware → controller → service → repository → model
- **Notes:** Frontend menggunakan pattern pages → components → services (API calls)

## 7. Authentication & Authorization
- **Method:** JWT (JSON Web Token)
- **Provider:** Custom (email + password)
- **Token Storage:** Authorization Bearer header
- **Token Expiry:** JWT expiry diatur hingga jam 23:59 hari yang sama — semua user auto logout setiap jam 00.00 (midnight) dan harus login ulang
- **RBAC:** Yes — 2 roles: `admin` dan `staff`
- **Middleware Chain:** `authenticate` → `authorize(['admin'])`

## 8. Security & Abuse Cases
- **Sensitive Data:** Password (bcrypt hash), email user
- **Critical Actions:** Login, CRUD produk (Admin), User Management (Admin), Stock Out
- **Abuse Cases:**
  - Brute force login
  - IDOR (mengakses data milik role lain)
  - Privilege escalation (Staff akses endpoint Admin)
  - Stock manipulation via API langsung
- **Required Controls:**
  - Rate limiting pada endpoint login
  - RBAC middleware pada setiap endpoint sensitif
  - Validasi server-side untuk semua input
  - Parameterized queries via Sequelize (cegah SQL injection)
  - Soft delete untuk data kritis
- **Audit Logging:** Semua transaksi mencatat `user_id`

## 9. Deployment & Infrastructure
- **Platform:** Lokal / VPS (manual)
- **Environments:** development, production
- **CI/CD:** Manual (belum diatur)
- **Database:** PostgreSQL (local atau server)
- **Domain:** Belum ditentukan

## 10. Canonical Terminology
| Term | Definition |
|------|-----------|
| Stock In | Transaksi menambah quantity stok |
| Stock Out | Transaksi mengurangi quantity stok |
| Soft Delete | Kolom `deleted_at` diisi timestamp saat hapus |
| RBAC | Pembatasan akses berdasarkan role user |

## 11. Architecture Decision Records (ADR)

### ADR Index
| ADR ID | Title | Status | Summary |
|--------|-------|--------|---------|
| ADR-001 | Monolith Full-Stack | Accepted | Frontend + Backend dalam satu repo, terpisah folder |
| ADR-002 | Sequelize ORM | Accepted | ORM untuk PostgreSQL memudahkan migrasi dan validasi |
| ADR-003 | JWT over Session | Accepted | Stateless auth, cocok untuk SPA |
| ADR-004 | Soft Delete | Accepted | Menjaga integritas riwayat transaksi |

### ADR-001: Monolith Full-Stack
- **Context:** Aplikasi skala kecil dengan satu tim developer
- **Decision:** Frontend (React) dan Backend (Express) dalam satu repository, folder terpisah
- **Rationale:** Memudahkan development awal, deployment sederhana, tidak perlu microservices
- **Trade-offs:** Tidak bisa scale per-layer secara independen

### ADR-002: Sequelize ORM
- **Context:** Membutuhkan interaksi database dengan migration, seeding, dan validasi
- **Decision:** Menggunakan Sequelize ORM untuk PostgreSQL
- **Rationale:** Migration bawaan, relationship mapping, query building aman (parameterized)
- **Trade-offs:** Performance overhead dibanding raw query

### ADR-003: JWT over Session
- **Context:** SPA React perlu token untuk autentikasi ke API
- **Decision:** Menggunakan JWT stateless, dikirim via Authorization Bearer header
- **Rationale:** Tidak perlu session storage di server, stateless, mudah di-scale
- **Trade-offs:** Token revocation lebih sulit dibanding session

### ADR-004: Soft Delete
- **Context:** Riwayat transaksi harus tetap utuh walau barang dihapus
- **Decision:** Soft delete dengan kolom `deleted_at`, bukan hard delete
- **Rationale:** Laporan lama tidak rusak, data bisa dipulihkan
- **Trade-offs:** Query perlu filter `WHERE deleted_at IS NULL`

---

## 12. Assumptions & Open Questions

### Assumptions
- PostgreSQL 15+ tersedia di environment target
- Browser modern mendukung ES2022+ dan CSS Grid/Flexbox

### Open Questions
- Hosting production: VPS atau lokal server?