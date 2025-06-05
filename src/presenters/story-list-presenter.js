// src/presenters/story-list-presenter.js
import StoryverseDb from "../utils/indexeddb-helper"; // Tetap impor ini untuk fallback

class StoryListPresenter {
  #view;
  #model; // Ini adalah StoryDataSource

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
    this.#loadStories(); // Pemanggilan tidak di-await di constructor, error akan jadi unhandled promise
    // kecuali #loadStories menangani semua error internalnya.
  }

  async #loadStories() {
    this.#view.renderLoading();
    let result; // Deklarasikan di luar try agar bisa diakses di seluruh fungsi

    try {
      // 1. Coba ambil dari API (model)
      console.log("StoryListPresenter: Mencoba mengambil cerita dari API...");
      result = await this.#model.fetchAllStories();

      if (result.error) {
        console.warn(
          "StoryListPresenter: Gagal mengambil dari API, pesan:",
          result.message,
          "Mencoba dari IndexedDB (StoryverseDb)..."
        );
        // Lemparkan error agar ditangkap oleh blok catch di bawah untuk mencoba fallback
        throw new Error(`API Error: ${result.message}`);
      }
      console.log("StoryListPresenter: Berhasil mengambil cerita dari API.");
    } catch (error) {
      // Blok catch ini akan menangani error dari API atau jika throw new Error di atas dijalankan
      console.warn(
        `StoryListPresenter: Terjadi error saat mengambil dari API (${error.message}). Mencoba dari IndexedDB (StoryverseDb)...`
      );
      try {
        const storiesFromDb = await StoryverseDb.getAllStories(); // Menggunakan StoryverseDb untuk cache semua cerita
        if (storiesFromDb && storiesFromDb.length > 0) {
          console.log(
            "StoryListPresenter: Berhasil mengambil cerita dari IndexedDB (StoryverseDb)."
          );
          result = { error: false, data: storiesFromDb };
        } else {
          console.log(
            "StoryListPresenter: Tidak ada cerita di IndexedDB (StoryverseDb) atau gagal mengambil."
          );
          result = {
            error: true,
            message: `Gagal mengambil data dari API dan tidak ada data cerita di cache lokal. (Detail: ${error.message})`,
            data: [],
          };
        }
      } catch (dbError) {
        console.error(
          "StoryListPresenter: Error saat mencoba mengambil dari IndexedDB (StoryverseDb):",
          dbError
        );
        result = {
          error: true,
          message: `Gagal mengambil data dari API dan juga gagal mengakses cache lokal. (Detail API: ${error.message}, Detail DB: ${dbError.message})`,
          data: [],
        };
      }
    } finally {
      // Pastikan hideLoading dipanggil setelah semua proses pengambilan data (API atau DB) selesai
      this.#view.hideLoading();
    }

    // Pastikan 'result' memiliki nilai sebelum diakses propertinya
    if (!result) {
      console.error(
        "StoryListPresenter: Variabel 'result' tidak terdefinisi setelah proses pengambilan data."
      );
      this.#view.renderError("Terjadi kesalahan internal saat memuat cerita.");
      return;
    }

    if (result.error) {
      this.#view.renderError(result.message);
      return;
    }

    if (!result.data || result.data.length === 0) {
      this.#view.renderEmpty();
    } else {
      try {
        // Tambahkan await dan try...catch untuk pemanggilan displayStories
        console.log("StoryListPresenter: Menampilkan cerita...");
        await this.#view.displayStories(result.data);
        console.log("StoryListPresenter: Cerita berhasil ditampilkan.");
      } catch (displayError) {
        console.error(
          "StoryListPresenter: Error saat view menampilkan cerita (displayStories):",
          displayError
        );
        // Tampilkan pesan error yang lebih user-friendly jika memungkinkan
        this.#view.renderError(
          `Oops! Terjadi kesalahan saat mencoba menampilkan cerita. (${displayError.message})`
        );
      }
    }
  }
}

export default StoryListPresenter;
