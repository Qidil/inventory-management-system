# PRD: Inventory Management System

> **Version:** 1.0 | **Date:** 2026-07-27 | **Status:** Draft

## Document Role
- **Source of Truth:** Product scope, user intent, business rules, and success criteria
- **Primary Owner:** `brainstorm-prd`
- **Out of Scope:** API payload details, schema column definitions, code patterns, and implementation sequencing

## Canonical Terminology
| Term | Meaning |
|------|---------|
| Stock In | Transaksi menambah stok barang |
| Stock Out | Transaksi mengurangi stok barang |
| Soft Delete | Penghapusan logis (set `deleted_at`) tanpa menghapus data fisik |
| RBAC | Role-Based Access Control — Admin & Staff |

---

## 1. Project Goal
Membangun sistem manajemen inventaris full-stack untuk mencatat, memantau, dan mengelola stok barang. Sistem memungkinkan Admin dan Staff melakukan pencatatan barang masuk/keluar, melihat riwayat transaksi, serta mendapatkan laporan dan dashboard untuk monitoring stok secara real-time.

## 2. Target User
| Persona | Description | Role |
|---------|-------------|------|
| Admin | Pengelola gudang/owner — akses penuh ke semua fitur | Admin |
| Staff | Karyawan gudang — hanya bisa lihat barang, Stock In/Out, dan History | Staff |

## 3. Problem Statement
Pencatatan stok secara manual (buku/Excel) rentan terhadap kesalahan, tidak real-time, dan sulit dilacak riwayatnya. Tidak ada kontrol siapa yang melakukan perubahan stok.

## 4. Main Features
### MVP (Release 1)
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| FEAT-01 | Authentication & RBAC | Login JWT, middleware role-based (Admin/Staff) | High |
| FEAT-02 | CRUD Categories | Kelola kategori barang | High |
| FEAT-03 | CRUD Suppliers | Kelola supplier barang | High |
| FEAT-04 | CRUD Products | Kelola barang dengan soft delete | High |
| FEAT-05 | Stock In | Menambah stok barang dengan validasi | High |
| FEAT-06 | Stock Out | Mengurangi stok barang dengan validasi kecukupan | High |
| FEAT-07 | History | Riwayat seluruh transaksi Stock In/Out | High |
| FEAT-08 | Dashboard | Kartu statistik + grafik 7 hari + recent activity | High |
| FEAT-09 | Reports | Laporan (khusus Admin) | Medium |
| FEAT-10 | User Management | CRUD user oleh Admin | Medium |

### Future Enhancements
- **FEAT-F01:** Export laporan ke PDF/Excel
- **FEAT-F02:** Notifikasi stok menipis
- **FEAT-F03:** Foto barang
- **FEAT-F04:** Barcode scanner

## 5. Business Rules
- **BR-01:** Stok awal produk = 0
- **BR-02:** Perubahan stok hanya melalui Stock In/Stock Out (tidak bisa langsung edit stok)
- **BR-03:** Stock Out tidak boleh melebihi stok tersedia
- **BR-04:** Soft Delete untuk produk — riwayat tetap utuh
- **BR-05:** Email pengguna harus unik
- **BR-06:** Kode barang harus unik
- **BR-07:** Semua transaksi mencatat user yang melakukan aksi
- **BR-08:** Semua endpoint selain login harus menggunakan JWT
- **BR-09:** Harga > 0
- **BR-10:** Quantity > 0
- **BR-11:** Semua user (Admin & Staff) akan auto logout setiap jam 00.00 (midnight) — JWT expiry diatur agar hangus setiap tengah malam

## 6. User Flow
### Login
1. User membuka aplikasi → halaman login
2. Input email & password
3. Validasi → bcrypt verify → generate JWT
4. Redirect ke Dashboard sesuai role

### Admin: Tambah Barang
1. Buka menu Barang → klik Tambah
2. Isi form (kode, nama, kategori, supplier, harga, min stock, deskripsi)
3. Submit → validasi → simpan (stock = 0)
4. Lanjut ke Stock In untuk mengisi stok

### Staff: Stock In
1. Buka menu Stock In
2. Pilih produk, isi quantity & note
3. Submit → validasi → insert transaction → update stock
4. History tercatat

### Staff: Stock Out
1. Buka menu Stock Out
2. Pilih produk, isi quantity & note
3. Validasi stok cukup → insert transaction → update stock
4. History tercatat

## 7. Design & Tech Requirements
- **Platform:** Web (Responsive: Desktop, Tablet, Mobile)
- **UI Reference:** Mie Gacoan style — magenta (#EC008C), cyan (#00B2D8), sidebar hitam, font Nunito (heading) + Inter (body)
- **Tech Stack:** React (Vite) + Tailwind CSS + shadcn/ui + Express.js + Sequelize ORM + PostgreSQL
- **Integrations:** Tidak ada third-party

## 8. Non-Functional Requirements
| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-01 | Performance | Page load time | < 3 detik |
| NFR-02 | Security | Password di-hash bcrypt | Salt rounds ≥ 10 |
| NFR-03 | Security | Token JWT | Authorization Bearer header |
| NFR-04 | Security | Semua input divalidasi | Server-side validation |
| NFR-05 | Responsive | Mendukung 3 device | Mobile, Tablet, Desktop |
| NFR-06 | Data Integrity | Stok tidak boleh negatif | Validasi database level |

## 9. Success Criteria (Bare Minimum)
- [ ] Login/logout berfungsi dengan RBAC
- [ ] CRUD Kategori, Supplier, Produk berfungsi
- [ ] Stock In/Out dengan validasi stok
- [ ] History transaksi tercatat
- [ ] Dashboard menampilkan data akurat
- [ ] Reports tersedia untuk Admin

## 10. Acceptance Criteria
### FEAT-01: Authentication & RBAC
- **AC-01:** **Given** email & password valid, **When** user klik Login, **Then** mendapatkan JWT dan redirect ke Dashboard
- **AC-02:** **Given** email atau password salah, **When** user klik Login, **Then** muncul error 401
- **AC-03:** **Given** Staff mengakses endpoint Admin (CRUD Barang, User Management), **Then** mendapat error 403

### FEAT-05: Stock In
- **AC-04:** **Given** produk tersedia, **When** Stock In dengan quantity > 0, **Then** stok bertambah dan history tercatat

### FEAT-06: Stock Out
- **AC-05:** **Given** stok mencukupi, **When** Stock Out, **Then** stok berkurang
- **AC-06:** **Given** stok tidak mencukupi, **When** Stock Out > stok, **Then** ditolak (error 400)

## 11. Non-Goals / Out of Scope
- Tidak ada fitur register publik
- Tidak ada integrasi payment gateway
- Tidak ada notifikasi real-time (WebSocket)
- Tidak ada multi-warehouse/gudang
- Tidak ada foto barang
- Tidak ada dark mode

## 12. Assumptions
- Pengguna memiliki koneksi internet stabil
- Browser modern (Chrome, Firefox, Edge terbaru)
- Server menggunakan environment production-grade

## 13. User Stories
- **US-01:** Sebagai Admin, saya ingin mengelola barang/kategori/supplier agar data inventaris selalu up-to-date
- **US-02:** Sebagai Staff, saya ingin mencatat Stock In/Out agar stok tercatat akurat
- **US-03:** Sebagai Admin & Staff, saya ingin melihat history agar bisa melacak perubahan stok
- **US-04:** Sebagai Admin, saya ingin melihat dashboard & reports agar bisa monitoring bisnis
- **US-05:** Sebagai Admin, saya ingin mengelola user agar staff bisa mengakses sistem

## 14. Stakeholders
| Name/Role | Responsibility |
|-----------|----------------|
| Admin/Owner | Pemilik bisnis — menentukan kebijakan stok |
| Staff Gudang | Operator harian — menjalankan Stock In/Out |

## 15. Open Questions
| Question | Status | Owner |
|----------|--------|-------|
| Apakah perlu export laporan PDF/Excel? | Deferred ke future | PM |
| Apakah perlu foto barang di MVP? | Tidak (opsional) | PM |
| Apakah perlu barcode scanner? | Deferred ke future | PM |

## Reading Guardrails for AI
- If this PRD conflicts with implementation detail docs, PRD wins on business intent and scope.
- If a term is ambiguous, prefer the definition in `Canonical Terminology`.
- Use `Non-Goals / Out of Scope`, `Assumptions`, and `Open Questions` to avoid overbuilding.