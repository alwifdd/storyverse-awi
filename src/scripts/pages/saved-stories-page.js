// Lokasi file: src/scripts/pages/saved-stories-page.js
import HTML_TEMPLATES from "../../views/templates";
import IndexedDBStoryHelper from "../../data/indexeddb-story-helper";

class SavedStoriesPage {
  #storiesContainer;
  #loadingDock;

  constructor() {
    this.#storiesContainer = null;
    this.#loadingDock = null;
  }

  async render() {
    return `
      <section class="content saved-stories-page-layout">
        <h2 class="content-heading">Cerita Tersimpan Anda</h2>
        <div id="saved-stories-loading-dock"></div>
        <div id="bookmarked-stories-list-container" class="story-grid-layout stories-list">
          {/* Daftar cerita yang dibookmark akan muncul di sini */}
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#storiesContainer = document.querySelector(
      "#bookmarked-stories-list-container"
    );
    this.#loadingDock = document.querySelector("#saved-stories-loading-dock");

    if (!this.#storiesContainer || !this.#loadingDock) {
      console.error(
        "Container untuk cerita tersimpan atau loading dock tidak ditemukan."
      );
      return;
    }

    this.#renderLoading();
    await this.#loadAndDisplayBookmarkedStories();
    this.#attachEventListeners(); // Untuk tombol hapus
  }

  #renderLoading() {
    if (this.#loadingDock)
      this.#loadingDock.innerHTML = HTML_TEMPLATES.createLoadingIndicator();
  }

  #hideLoading() {
    if (this.#loadingDock) this.#loadingDock.innerHTML = "";
  }

  async #loadAndDisplayBookmarkedStories() {
    try {
      const bookmarkedStories =
        await IndexedDBStoryHelper.getAllBookmarkedStories();
      this.#hideLoading();

      if (!this.#storiesContainer) return; // Pastikan container masih ada

      if (bookmarkedStories && bookmarkedStories.length > 0) {
        this.#storiesContainer.innerHTML = bookmarkedStories
          .map((story) =>
            HTML_TEMPLATES.createStoryItem(story, {
              isBookmarkedPage: true,
              isCurrentlyBookmarked: true,
            })
          )
          .join("");
      } else {
        this.#storiesContainer.innerHTML = HTML_TEMPLATES.createEmptyState(
          "Anda belum menyimpan cerita apapun."
        );
      }
    } catch (error) {
      this.#hideLoading();
      console.error("Error loading bookmarked stories for page:", error);
      if (this.#storiesContainer) {
        this.#storiesContainer.innerHTML = HTML_TEMPLATES.createErrorState(
          "Gagal memuat cerita tersimpan."
        );
      }
    }
  }

  #attachEventListeners() {
    if (this.#storiesContainer) {
      this.#storiesContainer.addEventListener("click", async (event) => {
        const deleteButton = event.target.closest(".btn-delete-bookmark");
        if (deleteButton) {
          const storyId = deleteButton.dataset.id;
          if (confirm("Anda yakin ingin menghapus cerita ini dari simpanan?")) {
            await IndexedDBStoryHelper.deleteBookmarkedStory(storyId);
            alert("Cerita dihapus dari simpanan!");
            // Muat ulang daftar cerita setelah penghapusan
            this.#renderLoading(); // Tampilkan loading lagi
            await this.#loadAndDisplayBookmarkedStories();
          }
        }
      });
    }
  }

  cleanup() {
    // Jika ada listener global yang perlu dihapus saat halaman diganti
    if (this.#storiesContainer) {
      // Cara sederhana untuk menghapus listener yang di-attach langsung ke elemen ini
      // adalah dengan meng-clone dan menggantinya, tapi karena kita ganti innerHTML
      // saat render ulang, listener lama seharusnya otomatis hilang.
    }
  }
}

export default SavedStoriesPage;
