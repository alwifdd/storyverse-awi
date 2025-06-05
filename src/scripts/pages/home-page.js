// src/scripts/pages/home-page.js
import StoryListPresenter from "../../presenters/story-list-presenter";
import HTML_TEMPLATES from "../../views/templates";
import MapInitiator from "../../utils/map-initiator";
import IndexedDBStoryHelper from "../../data/indexeddb-story-helper"; // <-- 1. IMPORT BARU

class HomePage {
  _stories = []; // <-- 4. Untuk menyimpan daftar cerita saat ini

  async render() {
    return `
      <section class="content">
        <h2 class="content-heading">Journeys Told From Every Land</h2>
        <div id="map-container" class="map-container"></div>
        <div id="loading-container"></div>
        <div id="stories-list" class="stories-list"></div>
      </section>
    `;
  }

  async afterRender(app, storyDataSource) {
    // Inisialisasi StoryListPresenter
    new StoryListPresenter({
      view: this,
      model: storyDataSource,
    });

    // 5. Tambahkan event listener untuk tombol bookmark
    this.#attachBookmarkButtonListeners();
  }

  renderLoading() {
    const loadingContainer = document.querySelector("#loading-container");
    if (loadingContainer) {
      loadingContainer.innerHTML = HTML_TEMPLATES.createLoadingIndicator();
    }
  }

  hideLoading() {
    const loadingContainer = document.querySelector("#loading-container");
    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }
  }

  renderError(message) {
    const storiesListContainer = document.querySelector("#stories-list");
    if (storiesListContainer) {
      storiesListContainer.innerHTML = HTML_TEMPLATES.createErrorState(message);
    }
  }

  renderEmpty() {
    const storiesListContainer = document.querySelector("#stories-list");
    if (storiesListContainer) {
      storiesListContainer.innerHTML = HTML_TEMPLATES.createEmptyState();
    }
  }

  // 2. Ubah displayStories menjadi async
  async displayStories(stories) {
    this._stories = stories; // 4. Simpan cerita
    const storiesContainer = document.querySelector("#stories-list");

    if (storiesContainer) {
      // 3. Kirim status bookmark ke template untuk setiap cerita
      const storyItemsHtml = await Promise.all(
        stories.map(async (story) => {
          const isBookmarked = await IndexedDBStoryHelper.isStoryBookmarked(
            story.id
          );
          return HTML_TEMPLATES.createStoryItem(story, {
            isBookmarkedPage: false, // false karena ini bukan halaman saved-stories
            isCurrentlyBookmarked: isBookmarked,
          });
        })
      );
      storiesContainer.innerHTML = storyItemsHtml.join("");
    }
    this.#initializeMap(stories);
  }

  #initializeMap(stories) {
    const mapElement = document.querySelector("#map-container");
    if (mapElement && !mapElement._leaflet_id) {
      const map = MapInitiator.init("map-container", { zoom: 2 });
      if (stories && stories.length > 0) {
        stories.forEach((story) => {
          if (story.lat && story.lon) {
            const popupContent = `<b>${story.name}</b>'s story`;
            MapInitiator.addMarker(map, [story.lat, story.lon], popupContent);
          }
        });
      }
    } else if (mapElement && mapElement._leaflet_id) {
      // console.log("Map already initialized.");
    }
  }

  // 6. Logika untuk menangani klik tombol bookmark
  #attachBookmarkButtonListeners() {
    const storiesContainer = document.querySelector("#stories-list");
    if (storiesContainer) {
      storiesContainer.addEventListener("click", async (event) => {
        const toggleButton = event.target.closest(".btn-toggle-bookmark");
        if (!toggleButton) return;

        const storyId = toggleButton.dataset.id;
        if (!storyId) return;

        // Temukan objek cerita dari this._stories yang disimpan
        const story = this._stories.find((s) => s.id === storyId);
        if (!story) {
          console.error("Story data not found for ID (in _stories):", storyId);
          alert("Gagal memproses bookmark: data cerita tidak ditemukan.");
          return;
        }

        // Cek status bookmark saat ini dari atribut aria-pressed
        const isCurrentlyBookmarked =
          toggleButton.getAttribute("aria-pressed") === "true";

        try {
          if (isCurrentlyBookmarked) {
            await IndexedDBStoryHelper.deleteBookmarkedStory(storyId);
            // alert('Cerita dihapus dari bookmark!'); // Notifikasi bisa lebih subtle
            // Update tampilan tombol
            toggleButton.setAttribute("aria-pressed", "false");
            toggleButton.innerHTML =
              '<i class="far fa-bookmark fa-fw"></i> Simpan Cerita';
            toggleButton.setAttribute("aria-label", "Simpan Cerita");
            console.log(`Story ${storyId} unbookmarked.`);
          } else {
            // Pastikan 'story' adalah objek yang benar untuk disimpan
            await IndexedDBStoryHelper.saveBookmarkedStory(story);
            // alert('Cerita disimpan ke bookmark!'); // Notifikasi bisa lebih subtle
            // Update tampilan tombol
            toggleButton.setAttribute("aria-pressed", "true");
            toggleButton.innerHTML =
              '<i class="fas fa-bookmark fa-fw"></i> Tersimpan';
            toggleButton.setAttribute("aria-label", "Tersimpan");
            console.log(`Story ${storyId} bookmarked.`);
          }
        } catch (dbError) {
          console.error("Gagal memperbarui status bookmark:", dbError);
          alert("Gagal memperbarui bookmark. Silakan coba lagi.");
        }
      });
    }
  }

  cleanup() {
    // Implementasi cleanup jika diperlukan
    // Misalnya, menghapus event listener jika tidak menggunakan event delegation
    // Namun, karena kita menggunakan event delegation pada #stories-list,
    // dan #stories-list akan ada selama HomePage aktif, kita mungkin tidak perlu
    // menghapusnya di sini kecuali HomePage sendiri dihancurkan dan dibuat ulang sering.
    // Jika #stories-list di-innerHTML secara keseluruhan oleh renderPage(),
    // listener yang di-attach di afterRender() ini perlu di-attach ulang.
    // App.js Anda sudah menangani cleanup halaman sebelumnya, jadi ini mungkin tidak perlu
    // kecuali ada listener spesifik HomePage yang dibuat di luar #content.
    this._stories = []; // Kosongkan array cerita saat halaman dibersihkan
  }
}

export default HomePage;
