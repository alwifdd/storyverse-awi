/* src/styles/styles.css */

:root {
  --primary-color: #ffda63;
  --primary-hover-color: #fbc02d;
  --secondary-color: #4a5568;
  --background-color: #fffbeb;
  --surface-color: #ffffff;
  --text-color: #2d3748;
  --subtle-text-color: #718096;
  --error-color: #ef4444;
  --white-color: #ffffff;
  --border-color: #e5e7eb;

  /* Contoh Font Family Variables (setelah Anda import Google Fonts) */
  --font-family-sans-serif: "Roboto", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
    sans-serif;
  --font-family-headings: "Montserrat", sans-serif;
}

body {
  margin: 0;
  font-family: var(--font-family-sans-serif); /* Menggunakan variabel font */
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.skip-link {
  position: absolute;
  top: -100px; /* Bisa juga -9999px atau menggunakan clip-path untuk aksesibilitas yang lebih baik */
  left: 0;
  background-color: var(--primary-color);
  color: var(--text-color);
  padding: 10px 15px;
  z-index: 2000; /* Pastikan di atas elemen lain */
  transition: top 0.3s ease-in-out;
  text-decoration: none;
  border-radius: 0 0 4px 0;
}
.skip-link:focus {
  top: 0;
}

/* == Header & Navigation == */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem; /* Padding untuk desktop */
  background-color: var(--surface-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid var(--border-color);
  position: sticky; /* Membuat header tetap di atas saat scroll */
  top: 0;
  z-index: 1000; /* Perbaikan: Naikkan z-index untuk header */
}

.app-header__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-header__logo {
  font-size: 32px;
  color: var(--primary-color);
  line-height: 1;
}

.app-header__brand h1 {
  font-family: var(
    --font-family-headings
  ); /* Menggunakan variabel font untuk heading */
  color: var(--text-color);
  margin: 0; /* Hapus margin default h1 agar lebih mudah di-align */
  font-size: 1.6rem;
  font-weight: 700; /* Lebih tebal untuk brand */
}

.app-header__navigation {
  position: relative; /* Untuk positioning menu mobile jika diperlukan */
}

/* CSS-only menu toggle dengan :target selector */

/* Tombol Hamburger (Mobile-only) */
.hamburger-button {
  display: none; /* Sembunyikan di desktop secara default */
  background: none;
  border: none;
  font-size: 1.8rem; /* Ukuran ikon hamburger */
  color: var(--text-color);
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1100; /* Pastikan hamburger button di atas menu */
  position: relative;
  text-decoration: none; /* Karena akan jadi link */
}

/* Overlay untuk menu mobile dengan blur effect */
.menu-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1050;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

/* Ketika target mobile-menu aktif */
#mobile-menu:target ~ .menu-overlay,
#mobile-menu:target .menu-overlay {
  display: block;
  opacity: 1;
}

/* Styling dasar untuk .navbar-links (Desktop) */
.app-header__navigation .navbar-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 1rem; /* Sedikit kurangi gap agar muat tombol baru */
  align-items: center;
}

.app-header__navigation .navbar-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0.25rem;
  position: relative;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-bottom-color 0.2s ease;
}

.app-header__navigation .navbar-links a:hover,
.app-header__navigation .navbar-links a:focus {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  outline: none; /* Hapus outline default jika ada custom focus style */
}

/* Styling untuk tombol di navbar (termasuk logout, subscribe, clear cache) */
.app-header__navigation .navbar-links button,
.app-header__navigation .navbar-links .btn {
  /* Targetkan juga class .btn jika digunakan */
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-family: inherit; /* Menggunakan font dari body */
  font-size: 0.95rem; /* Sesuaikan ukuran font agar konsisten dengan link */
  font-weight: 500;
  padding: 0.5rem 0.75rem; /* Padding yang lebih baik untuk tombol */
  transition: color 0.2s ease, background-color 0.2s ease;
  border-radius: 4px; /* Tambahkan border-radius */
}

.app-header__navigation .navbar-links .logout-button:hover,
.app-header__navigation .navbar-links .logout-button:focus {
  color: var(--error-color);
  background-color: transparent; /* Pastikan tidak ada background saat hover jika tidak diinginkan */
}

.app-header__navigation .navbar-links .btn-primary {
  background-color: var(--primary-color);
  color: var(--text-color);
}
.app-header__navigation .navbar-links .btn-primary:hover,
.app-header__navigation .navbar-links .btn-primary:focus {
  background-color: var(--primary-hover-color);
  color: var(--text-color); /* Jaga warna teks */
}
.app-header__navigation .navbar-links .btn-primary[disabled] {
  background-color: #ffeecf;
  color: var(--subtle-text-color);
  cursor: not-allowed;
}

.app-header__navigation .navbar-links .btn-danger {
  background-color: var(--error-color);
  color: var(--white-color);
}
.app-header__navigation .navbar-links .btn-danger:hover,
.app-header__navigation .navbar-links .btn-danger:focus {
  background-color: #cc2f2f; /* Warna hover lebih gelap untuk danger */
  color: var(--white-color);
}

/* Ukuran tombol .btn-sm di navbar */
.app-header__navigation .navbar-links .btn-sm {
  padding: 0.35rem 0.6rem; /* Sedikit lebih besar dari sebelumnya */
  font-size: 0.8rem; /* Sedikit lebih kecil */
}

/* == Main Content & Footer == */
main {
  padding: 2rem;
  min-height: calc(
    100vh - 60px - 73px
  ); /* Sesuaikan dengan tinggi header dan footer Anda */
  /* Misal: header 60px, footer 73px */
}
.content-heading {
  font-family: var(
    --font-family-headings
  ); /* Menggunakan variabel font untuk heading */
  text-align: center;
  margin-top: 1rem; /* Beri jarak dari header */
  margin-bottom: 2.5rem;
  font-size: 2rem;
  color: var(--secondary-color);
  font-weight: 700;
}
.app-footer {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color);
  color: var(--subtle-text-color);
}

/* == Story Items == (Tidak ada perubahan signifikan, hanya memastikan font) */
.story-item__title {
  font-family: var(--font-family-headings);
  /* ... sisa styling ... */
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}
/* (Pastikan elemen lain seperti .story-item__description menggunakan --font-family-sans-serif dari body) */
.stories-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.story-item {
  background-color: var(--surface-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.story-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}
.story-item__thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}
.story-item__content {
  padding: 1rem 1.25rem;
}
.story-item__date {
  font-size: 0.8rem;
  color: var(--subtle-text-color);
  margin-bottom: 0.75rem;
}
.story-item__description {
  line-height: 1.5;
  font-size: 0.9rem;
}

/* == Forms == (Tidak ada perubahan signifikan, hanya memastikan font) */
.form-container {
  max-width: 650px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--surface-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
  font-family: inherit; /* Mengambil font dari parent (body) */
}
.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(255, 218, 99, 0.5);
}

/* == Map & Camera == */
.map-container,
.map-container-small {
  height: 400px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}

.map-container-small {
  height: 280px;
}

/* Style leaflet controls agar tidak mengganggu hamburger menu */
.map-container .leaflet-control-container,
.map-container-small .leaflet-control-container {
  z-index: 400; /* Di bawah menu mobile (1060) dan hamburger (1100) */
}

/* Style leaflet attribution agar compact dan rapi */
.map-container .leaflet-control-attribution,
.map-container-small .leaflet-control-attribution {
  background-color: rgba(255, 255, 255, 0.8) !important;
  font-size: 10px !important;
  padding: 2px 4px !important;
  border-radius: 3px !important;
  max-width: 200px !important;
  word-wrap: break-word !important;
  line-height: 1.2 !important;
  margin: 0 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
}

/* Style zoom controls agar lebih rapi */
.map-container .leaflet-control-zoom,
.map-container-small .leaflet-control-zoom {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
}

.map-container .leaflet-control-zoom a,
.map-container-small .leaflet-control-zoom a {
  width: 26px !important;
  height: 26px !important;
  line-height: 24px !important;
  font-size: 16px !important;
}

/* Pada mobile, tetap tampilkan semua controls tapi pastikan z-index aman */
@media (max-width: 768px) {
  /* Zoom controls tetap ada, cuma diperkecil sedikit */
  .map-container .leaflet-control-zoom,
  .map-container-small .leaflet-control-zoom {
    transform: scale(0.9);
    transform-origin: top left;
  }
  
  /* Attribution tetap ada, cuma diperkecil */
  .map-container .leaflet-control-attribution,
  .map-container-small .leaflet-control-attribution {
    font-size: 9px !important;
    padding: 2px 3px !important;
    max-width: 180px !important;
  }
  
  /* Pastikan semua leaflet controls z-index di bawah hamburger menu */
  .map-container .leaflet-control-container,
  .map-container-small .leaflet-control-container {
    z-index: 400 !important;
  }
}

.camera-container {
  position: relative;
  background-color: #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}
#camera-video {
  width: 100%;
  display: block;
  border-radius: 6px;
  transform: scaleX(-1);
}
.d-none {
  display: none;
}

/* == Buttons == (Styling .btn umum, btn-primary, btn-danger) */
.btn {
  padding: 0.75rem 1.5rem; /* Ukuran default tombol */
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  display: inline-block;
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;
  line-height: 1.5; /* Konsistensi tinggi baris */
  text-align: center;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.btn[disabled] {
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.65;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--text-color);
}
.btn-primary:hover,
.btn-primary:focus {
  background-color: var(--primary-hover-color);
}
.btn-primary[disabled] {
  background-color: #ffeecf;
  color: var(--subtle-text-color);
}

.btn-danger {
  /* Untuk tombol Clear Cache */
  background-color: var(--error-color);
  color: var(--white-color);
}
.btn-danger:hover,
.btn-danger:focus {
  background-color: #c82333; /* Warna merah lebih gelap untuk hover */
}
.btn-danger[disabled] {
  background-color: #f8d7da;
  color: var(--subtle-text-color);
}

/* Tombol spesifik (jika perlu override) */
#camera-button {
  width: 100%;
  margin-top: 0.75rem !important; /* !important jika ada konflik */
}

/* == Loading, Empty, Error States == */
.loading-indicator {
  width: 40px;
  height: 40px;
  border: 4px solid var(--background-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 2rem auto;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-message,
.error-message {
  text-align: center;
  font-size: 1.1rem;
  color: var(--subtle-text-color);
  padding: 2rem;
}
.error-message {
  color: var(--error-color);
  font-weight: 500;
}

/* == Not Found Page Styling == */
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: calc(70vh - 100px); /* Sesuaikan agar pas */
  padding: 2rem;
}
.not-found-container {
  background-color: var(--surface-color);
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.not-found-title {
  font-family: var(--font-family-headings);
  font-size: 5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}
.not-found-message {
  font-family: var(--font-family-headings);
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 1rem;
}
.not-found-suggestion {
  font-size: 1rem;
  color: var(--subtle-text-color);
  margin-bottom: 2rem;
}
.go-home-btn {
  /* Menggunakan class .btn .btn-primary dari general button styling */
  font-size: 1rem;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.75rem 1rem; /* Kurangi padding header di mobile */
  }
  .app-header__brand h1 {
    font-size: 1.3rem;
  }

  .hamburger-button {
    display: block; /* Tampilkan tombol hamburger di mobile */
  }

  /* Menu mobile dengan :target selector */
  .app-header__navigation .navbar-links {
    display: none; /* Sembunyikan secara default di mobile */
    position: fixed;
    top: 0;
    right: -280px; /* Mulai dari luar layar kanan */
    width: 250px; /* Lebar menu mobile */
    height: 100vh; /* Tinggi penuh */
    background-color: var(--surface-color);
    padding: 4rem 1.5rem 1.5rem 1.5rem; /* Padding atas lebih besar untuk ruang dari atas */
    box-shadow: -3px 0 10px rgba(0, 0, 0, 0.15);
    flex-direction: column;
    align-items: flex-start; /* Ratakan item ke kiri */
    gap: 0; /* Hapus gap flex, atur jarak dengan margin pada li */
    transition: right 0.3s ease-in-out;
    z-index: 1060; /* Z-index lebih tinggi dari overlay */
    overflow-y: auto; /* Jika item menu banyak */
  }
  
  /* Ketika target mobile-menu aktif, tampilkan dan geser menu */
  #mobile-menu:target .navbar-links {
    display: flex;
    right: 0; /* Geser menu ke dalam layar */
  }
  
  /* Tambahkan tombol close di dalam menu */
  .menu-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-color);
    cursor: pointer;
    padding: 0.5rem;
    text-decoration: none;
  }

  .app-header__navigation .navbar-links li {
    width: 100%;
    margin-bottom: 0.75rem; /* Jarak antar item menu */
  }
  .app-header__navigation .navbar-links li:last-child {
    margin-bottom: 0;
  }

  /* Styling untuk link dan tombol di dalam menu mobile */
  .app-header__navigation .navbar-links a,
  .app-header__navigation .navbar-links button {
    display: block; /* Agar mengisi lebar li */
    width: 100%;
    padding: 0.75rem 1rem; /* Padding yang cukup untuk sentuhan */
    text-align: left;
    font-size: 1rem; /* Ukuran font yang nyaman dibaca */
    border-bottom: 1px solid var(--border-color); /* Garis pemisah antar item */
    border-radius: 0; /* Hapus border-radius jika ada dari styling .btn umum */
    margin-left: 0 !important; /* Override style inline jika ada */
  }
  .app-header__navigation .navbar-links li:last-child a,
  .app-header__navigation .navbar-links li:last-child button {
    border-bottom: none; /* Hapus border bawah untuk item terakhir */
  }

  .app-header__navigation .navbar-links a:hover,
  .app-header__navigation .navbar-links button:not([disabled]):hover {
    background-color: var(--background-color); /* Warna hover item menu */
    color: var(--primary-color); /* Sesuaikan warna teks hover */
  }
  .app-header__navigation .navbar-links .btn-primary,
  .app-header__navigation .navbar-links .btn-danger {
    color: var(
      --white-color
    ); /* Pastikan teks tombol berwarna kontras dengan background tombolnya */
  }
  .app-header__navigation .navbar-links .btn-primary:hover,
  .app-header__navigation .navbar-links .btn-primary:focus {
    color: var(--text-color); /* Jaga warna teks */
  }

  .app-header__navigation .navbar-links .logout-button {
    color: var(--error-color); /* Warna khusus untuk logout */
  }
  .app-header__navigation .navbar-links .logout-button:hover {
    background-color: var(--background-color);
    color: #a02323; /* Warna hover logout lebih gelap */
  }

  main {
    padding: 1rem;
  }
  .content-heading {
    font-size: 1.5rem;
  }
  .stories-list {
    grid-template-columns: 1fr; /* Satu kolom di mobile */
  }
  .not-found-title {
    font-size: 4rem;
  }
  .not-found-message {
    font-size: 1.2rem;
  }
}

/* == View Transitions == (Tidak ada perubahan) */
::view-transition-old(root),
::view-transition-new(root) {
  animation: 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) both;
}
::view-transition-old(root) {
  animation-name: fade-out-slide-left;
}
::view-transition-new(root) {
  animation-name: fade-in-slide-right;
}

@keyframes fade-in-slide-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes fade-out-slide-left {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-20px);
  }
}