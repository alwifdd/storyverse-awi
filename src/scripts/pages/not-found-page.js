// src/scripts/pages/not-found-page.js

class NotFoundPage {
  async render() {
    return `
      <section class="content not-found-page">
        <div class="not-found-container">
          <h2 class="not-found-title">404</h2>
          <p class="not-found-message">Oops! Halaman yang Anda cari tidak ditemukan.</p>
          <p class="not-found-suggestion">
            Mungkin Anda salah ketik alamat atau halaman tersebut sudah dipindahkan.
          </p>
          <a href="/#/" class="btn btn-primary go-home-btn">Kembali ke Halaman Utama</a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Tidak ada logika JavaScript khusus yang diperlukan setelah render untuk halaman ini,
    // tapi kita tetap sediakan methodnya untuk konsistensi.
    console.log("NotFoundPage.afterRender() dipanggil");
  }

  cleanup() {
    // Tidak ada cleanup khusus yang diperlukan.
  }
}

export default NotFoundPage;
