// Mengimpor library idb
import { openDB } from "idb";

// Nama database dan versi
const DATABASE_NAME = "storyverse-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "stories";

// Fungsi untuk membuka (atau membuat) database dan object store
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Fungsi ini hanya dijalankan jika versi database berubah atau database belum ada
    console.log(
      `IndexedDB: Melakukan upgrade database ke versi ${DATABASE_VERSION}`
    );
    // Membuat object store 'stories' jika belum ada
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
      console.log(
        `IndexedDB: Object store "${OBJECT_STORE_NAME}" berhasil dibuat.`
      );
    }
  },
});

const StoryverseDb = {
  /**
   * Mendapatkan semua cerita dari IndexedDB.
   * @returns {Promise<Array>} Array berisi semua cerita.
   */
  async getAllStories() {
    try {
      const db = await dbPromise;
      const tx = db.transaction(OBJECT_STORE_NAME, "readonly");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      const stories = await store.getAll();
      console.log("IndexedDB: Berhasil mengambil semua cerita:", stories);
      return stories;
    } catch (error) {
      console.error("IndexedDB: Gagal mengambil semua cerita:", error);
      return [];
    }
  },

  /**
   * Menyimpan satu cerita ke IndexedDB. Jika cerita sudah ada (berdasarkan id), akan diupdate.
   * @param {object} story Objek cerita yang akan disimpan.
   */
  async putStory(story) {
    if (!story || !story.id) {
      console.error(
        "IndexedDB: Gagal menyimpan cerita, data cerita atau id tidak valid.",
        story
      );
      return;
    }
    try {
      const db = await dbPromise;
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      await store.put(story);
      console.log("IndexedDB: Cerita berhasil disimpan/diupdate:", story);
    } catch (error) {
      console.error("IndexedDB: Gagal menyimpan cerita:", error, story);
    }
  },

  /**
   * Menyimpan array cerita ke IndexedDB.
   * @param {Array<object>} stories Array objek cerita yang akan disimpan.
   */
  async putAllStories(stories) {
    if (!Array.isArray(stories) || stories.length === 0) {
      console.log(
        "IndexedDB: Tidak ada cerita untuk disimpan atau format tidak valid."
      );
      return;
    }
    try {
      const db = await dbPromise;
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      for (const story of stories) {
        if (story && story.id) {
          await store.put(story);
        } else {
          console.warn(
            "IndexedDB: Melewati penyimpanan cerita karena data tidak valid:",
            story
          );
        }
      }
      await tx.done;
      console.log("IndexedDB: Semua cerita berhasil disimpan/diupdate.");
    } catch (error) {
      console.error("IndexedDB: Gagal menyimpan semua cerita:", error);
    }
  },

  /**
   * Menghapus satu cerita dari IndexedDB berdasarkan id.
   * @param {string} id ID cerita yang akan dihapus.
   */
  async deleteStory(id) {
    if (!id) {
      console.error("IndexedDB: Gagal menghapus cerita, ID tidak disediakan.");
      return;
    }
    try {
      const db = await dbPromise;
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      await store.delete(id);
      console.log(`IndexedDB: Cerita dengan ID "${id}" berhasil dihapus.`);
    } catch (error) {
      console.error(
        `IndexedDB: Gagal menghapus cerita dengan ID "${id}":`,
        error
      );
    }
  },

  /**
   * Menghapus semua cerita dari object store 'stories'.
   */
  async clearAllStories() {
    try {
      const db = await dbPromise;
      const tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
      const store = tx.objectStore(OBJECT_STORE_NAME);
      await store.clear();
      console.log(
        `IndexedDB: Semua cerita dari object store "${OBJECT_STORE_NAME}" berhasil dihapus.`
      );
    } catch (error) {
      console.error(
        `IndexedDB: Gagal menghapus semua cerita dari object store "${OBJECT_STORE_NAME}":`,
        error
      );
    }
  },
};

export default StoryverseDb;
