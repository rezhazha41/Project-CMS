# 🏫 School CMS (Sistem Manajemen Konten Sekolah)
> Platform web modern, cepat, dan dinamis untuk institusi pendidikan, dibangun dengan **AdonisJS 6**.
![Dashboard Preview](https://via.placeholder.com/1200x600/0f172a/ffffff?text=School+CMS+Dashboard+Preview)
## 📖 Tentang Project
Aplikasi ini adalah **Sistem Manajemen Konten (CMS)** yang dirancang khusus untuk kebutuhan website sekolah. Mengutamakan performa, keamanan, dan kemudahan penggunaan. Dilengkapi dengan fitur **Dynamic Menu Manager** ala WordPress, manajemen berita, agenda, dan data akademik.
Dibangun dengan teknologi web modern untuk memastikan website sekolah Anda cepat, responsif di semua perangkat, dan mudah dikelola oleh admin maupun guru.
## ✨ Fitur Unggulan
### 🎨 Tampilan & Kustomisasi
*   **Dynamic Menu Manager**: Kelola menu navigasi dengan drag-and-drop, nesting (submenu), dan integrasi langsung dengan Halaman (Pages). Pindah urutan menu semudah menggeser mouse.
*   **Page Builder**: Buat halaman statis (seperti Profil, Sejarah) dengan cepat melalui "Quick Create".
*   **Hero Settings**: Ubah gambar utama dan teks sambutan halaman depan langsung dari admin.
### 📚 Manajemen Konten Sekolah
*   **Berita & Artikel**: Blog manajemen lengkap dengan kategori dan status publikasi.
*   **Agenda Sekolah**: Jadwal kegiatan mendatang dengan countdown.
*   **Prestasi & Kegiatan**: Galeri aktivitas siswa.
*   **Jurusan / Kompetensi Keahlian**: Halaman khusus untuk setiap jurusan.
*   **Guru & Staf**: Direktori data pengajar.
*   **Media Library**: Upload dan kelola gambar/dokumen terpusat.
### ⚙️ Sistem & Keamanan
*   **Halaman Administrator**: Dashboard analitik yang informatif.
*   **Role-Based Access**:
    *   **Super Admin**: Akses penuh ke sistem dan pengaturan.
    *   **Editor**: Terbatas pada manajemen konten.
*   **Komentar**: Moderasi komentar dengan fitur Approve/Hapus.
## 🛠️ Tech Stack
Project ini dibangun menggunakan spesifikasi teknologi terkini:
*   **Framework**: [AdonisJS 6](https://adonisjs.com/) (TypeScript)
*   **Database**: PostgreSQL / MySQL (via Lucid ORM)
*   **Frontend**: [EdgeJS](https://edgejs.com/) Templates
*   **Styling**: [TailwindCSS](https://tailwindcss.com/)
*   **Interactivity**: [Alpine.js](https://alpinejs.dev/)
---
## 🚀 Cara Instalasi
Ikuti langkah berikut untuk menjalankan project di komputer lokal Anda.
### Prasyarat
*   [Node.js](https://nodejs.org/) (v16 atau lebih baru)
*   Database (PostgreSQL atau MySQL)
### 1. Clone Repository
```bash
git clone https://github.com/username/project-cms.git
cd project-cms/apps/cms
```
*(Catatan: Pastikan Anda masuk ke direktori `apps/cms`)*
### 2. Install Dependencies
```bash
npm install
```
### 3. Konfigurasi Environment
Salin file `.env.example` menjadi `.env` dan sesuaikan dengan konfigurasi database Anda.
```bash
cp .env.example .env
```
Buka file `.env` dan atur koneksi database:
```ini
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password_anda
DB_DATABASE=nama_database_sekolah
```
### 4. Setup Database & Seeder
Jalankan migrasi untuk membuat tabel dan seeder untuk mengisi data awal (Dummy Data).
```bash
# Membuat tabel database
node ace migration:run
# Mengisi data dummy (Menu, User Admin, Contoh Post)
node ace db:seed
```
### 5. Jalankan Aplikasi
```bash
npm run dev
```
Akses website di browser: `http://localhost:3333`
---
## 🔑 Akun Default
Gunakan akun ini untuk login ke halaman Admin (`/login`):
*   **Email**: `admin@example.com`
*   **Password**: `password`
---
## 📂 Struktur Project
```
apps/cms/
├── app/                  # Controller, Model, Middleware
├── database/            # Migrasi & Seeder
├── resources/           # Views (Edge) & CSS/JS
│   ├── views/
│   │   ├── layouts/     # Template Utama (Admin & Public)
│   │   ├── pages/       # Halaman Konten
│   │   └── components/  # Komponen UI (Sidebar, Navbar)
└── start/               # Definisi Routes (routes.ts)
```
---
Made with ❤️ using **AdonisJS**.
