// src/presenters/story-list-presenter.js
import StoryverseDb from "../utils/indexeddb-helper"; // <-- Import helper IndexedDB

class StoryListPresenter {
  #view;
  #model; // Ini adalah StoryDataSource

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
    this.#loadStories();
  }

  async #loadStories() {
    this.#view.renderLoading();
    let result;
    try {
      // 1. Coba ambil dari API (model)
      result = await this.#model.fetchAllStories();
      if (result.error) {
        // Jika API error (mungkin karena offline atau masalah server)
        console.warn(
          "StoryListPresenter: Gagal mengambil dari API, mencoba dari IndexedDB. Pesan API:",
          result.message
        );
        throw new Error(result.message); // Lemparkan error untuk ditangkap dan coba IndexedDB
      }
    } catch (error) {
      // 2. Jika API gagal, coba ambil dari IndexedDB
      console.log("StoryListPresenter: Mengambil cerita dari IndexedDB...");
      const storiesFromDb = await StoryverseDb.getAllStories();
      if (storiesFromDb && storiesFromDb.length > 0) {
        result = { error: false, data: storiesFromDb };
      } else {
        // Jika IndexedDB juga kosong atau gagal, tampilkan error asli dari API jika ada
        result = {
          error: true,
          message: `Offline dan tidak ada data di cache. (Error asli: ${error.message})`,
          data: [],
        };
      }
    } finally {
      this.#view.hideLoading();
    }

    if (result.error) {
      this.#view.renderError(result.message);
      return;
    }

    if (result.data.length === 0) {
      this.#view.renderEmpty();
    } else {
      this.#view.displayStories(result.data);
    }
  }
}

export default StoryListPresenter;
