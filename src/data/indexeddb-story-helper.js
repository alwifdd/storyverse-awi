// Lokasi file: src/data/indexeddb-story-helper.js
import { openDB } from "idb";

const DATABASE_NAME = "storyverse-saved-stories-db"; // Nama database baru untuk menghindari konflik
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "bookmarked_stories"; // Hanya untuk cerita yang dibookmark

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
      console.log(`[IDB Helper] Object store "${OBJECT_STORE_NAME}" created.`);
    }
  },
});

const IndexedDBStoryHelper = {
  /**
   * Menyimpan cerita yang dibookmark ke IndexedDB.
   * @param {object} story - Objek cerita yang akan disimpan.
   * @returns {Promise<string|null>} ID cerita jika berhasil, null jika gagal.
   */
  async saveBookmarkedStory(story) {
    if (!story || !story.id) {
      console.error(
        "[IDB Helper] Invalid story object provided to saveBookmarkedStory:",
        story
      );
      return null;
    }
    try {
      const db = await dbPromise;
      const resultKey = await db
        .transaction(OBJECT_STORE_NAME, "readwrite")
        .objectStore(OBJECT_STORE_NAME)
        .put(story);
      console.log("[IDB Helper] Story bookmarked and saved, key:", resultKey);
      return resultKey;
    } catch (error) {
      console.error("[IDB Helper] Failed to save bookmarked story:", error);
      return null;
    }
  },

  /**
   * Mengambil semua cerita yang sudah dibookmark dari IndexedDB.
   * @returns {Promise<Array<object>>} Array berisi objek cerita.
   */
  async getAllBookmarkedStories() {
    try {
      const db = await dbPromise;
      const stories = await db
        .transaction(OBJECT_STORE_NAME, "readonly")
        .objectStore(OBJECT_STORE_NAME)
        .getAll();
      console.log(
        "[IDB Helper] Fetched all bookmarked stories:",
        stories.length
      );
      return stories;
    } catch (error) {
      console.error("[IDB Helper] Failed to get bookmarked stories:", error);
      return [];
    }
  },

  /**
   * Menghapus cerita yang dibookmark dari IndexedDB berdasarkan ID.
   * @param {string} id - ID cerita yang akan dihapus.
   */
  async deleteBookmarkedStory(id) {
    if (!id) return;
    try {
      const db = await dbPromise;
      await db
        .transaction(OBJECT_STORE_NAME, "readwrite")
        .objectStore(OBJECT_STORE_NAME)
        .delete(id);
      console.log(`[IDB Helper] Bookmarked story (id: ${id}) deleted.`);
    } catch (error) {
      console.error(
        `[IDB Helper] Failed to delete bookmarked story (id: ${id}):`,
        error
      );
    }
  },

  /**
   * Mengecek apakah sebuah cerita sudah dibookmark berdasarkan ID.
   * @param {string} id - ID cerita.
   * @returns {Promise<boolean>} True jika sudah dibookmark, false jika belum.
   */
  async isStoryBookmarked(id) {
    if (!id) return false;
    try {
      const db = await dbPromise;
      const story = await db
        .transaction(OBJECT_STORE_NAME, "readonly")
        .objectStore(OBJECT_STORE_NAME)
        .get(id);
      return !!story; // Mengembalikan true jika story ada, false jika tidak
    } catch (error) {
      console.error(
        `[IDB Helper] Failed to check if story (id: ${id}) is bookmarked:`,
        error
      );
      return false;
    }
  },
};

export default IndexedDBStoryHelper;
