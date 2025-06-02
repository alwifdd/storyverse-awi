// src/data/story-data-source.js
import CONFIG from "../config";
import UserSession from "../utils/user-session";
import StoryverseDb from "../utils/indexeddb-helper"; // <-- Import helper IndexedDB

class StoryDataSource {
  static async #fetchWithAuth(url, options = {}) {
    const token = UserSession.getToken();
    if (!token)
      return { error: true, message: "Not authorized. Please log in." };
    const defaultOptions = {
      headers: { Authorization: `Bearer ${token}` },
      ...options,
    };
    try {
      const response = await fetch(url, defaultOptions);
      if (!response.ok)
        return { error: true, message: `Server error: ${response.status}` };
      return response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static async register({ name, email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      return response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static async login({ email, password }) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static async fetchAllStories() {
    // Mengambil data dari API
    const responseJson = await this.#fetchWithAuth(
      `${CONFIG.BASE_URL}/stories?location=1`,
      { cache: "no-cache" }
    );

    // Jika pengambilan dari API berhasil dan ada data cerita
    if (
      !responseJson.error &&
      responseJson.listStory &&
      responseJson.listStory.length > 0
    ) {
      try {
        // Simpan ke IndexedDB
        await StoryverseDb.putAllStories(responseJson.listStory);
        console.log(
          "StoryDataSource: Cerita dari API berhasil disimpan ke IndexedDB."
        );
      } catch (dbError) {
        console.error(
          "StoryDataSource: Gagal menyimpan cerita ke IndexedDB:",
          dbError
        );
        // Anda bisa memutuskan apakah ingin mengembalikan error atau tetap melanjutkan
        // dengan data dari API meskipun penyimpanan ke DB gagal.
        // Untuk saat ini, kita tetap lanjutkan dan biarkan error dicatat.
      }
    } else if (responseJson.error) {
      console.warn(
        "StoryDataSource: Gagal mengambil cerita dari API, pesan:",
        responseJson.message
      );
    }

    // Kembalikan hasil dari API (termasuk kemungkinan error dari API)
    // dan data listStory (atau array kosong jika tidak ada)
    return { ...responseJson, data: responseJson.listStory || [] };
  }

  static async postNewStory(formData) {
    return this.#fetchWithAuth(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      body: formData,
    });
  }
}

export default StoryDataSource;
