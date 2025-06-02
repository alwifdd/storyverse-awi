// src/scripts/pages/home-page.js
import StoryListPresenter from "../../presenters/story-list-presenter";
import HTML_TEMPLATES from "../../views/templates";
import MapInitiator from "../../utils/map-initiator";
// HAPUS import StoryverseDb jika tidak lagi digunakan di sini atau di presenter yang diinisialisasi dari sini
// HAPUS import UserSession dan CONFIG

class HomePage {
  // HAPUS properti #VAPID_PUBLIC_KEY

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

    // SEMUA Event listener untuk tombol yang dipindah SUDAH DIHAPUS dari sini
  }

  // --- SEMUA METODE UNTUK PUSH NOTIFICATION SUDAH DIHAPUS DARI SINI ---

  // --- Metode Lama (renderLoading, displayStories, dll.) TETAP ADA ---
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

  displayStories(stories) {
    const storiesContainer = document.querySelector("#stories-list");
    if (storiesContainer) {
      storiesContainer.innerHTML = stories
        .map(HTML_TEMPLATES.createStoryItem)
        .join("");
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

  cleanup() {
    // Implementasi cleanup jika diperlukan
  }
}

export default HomePage;
