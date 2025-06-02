// src/views/templates.js
const HTML_TEMPLATES = {
  createStoryItem(story) {
    const storyDate = new Date(story.createdAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `
      <article class="story-item">
        <img class="story-item__thumbnail" src="${
          story.photoUrl
        }" alt="Story photo by ${story.name}">
        <div class="story-item__content">
          <h3 class="story-item__title">${story.name}</h3>
          <p class="story-item__date">${storyDate}</p>
          <p class="story-item__description">${story.description.substring(
            0,
            150
          )}...</p>
        </div>
      </article>`;
  },

  createLoadingIndicator() {
    return '<div class="loading-indicator"></div>';
  },

  createEmptyState() {
    return '<p class="empty-message">No stories have been shared yet. Why not add one?</p>';
  },

  createErrorState(message) {
    return `<p class="error-message">Sorry, an error occurred: ${message}</p>`;
  },

  // GANTI FUNGSI createNavBar YANG LAMA DENGAN YANG BARU INI:
  createNavBar(isLoggedIn) {
    let navContent = "";
    if (isLoggedIn) {
      navContent = `
        <button id="hamburger-button" class="hamburger-button" aria-label="Toggle menu" aria-expanded="false">
          <i class="fas fa-bars"></i>
        </button>
        <ul id="navbar-links" class="navbar-links">
          <li><a href="#/">Home</a></li>
          <li><a href="#/add-story">Add Story +</a></li>
          <li><button id="navbar-subscribe-push-button" class="btn btn-primary btn-sm" style="margin-left: 10px;" disabled>Loading Notif...</button></li>
          <li><button id="navbar-clear-indexeddb-button" class="btn btn-danger btn-sm" style="margin-left: 5px;">Clear Cache</button></li>
          <li><button class="logout-button" style="margin-left: 5px;">Logout</button></li>
        </ul>
      `;
    } else {
      navContent = `
        <button id="hamburger-button" class="hamburger-button" aria-label="Toggle menu" aria-expanded="false">
          <i class="fas fa-bars"></i>
        </button>
        <ul id="navbar-links" class="navbar-links">
          <li><a href="#/login">Login</a></li>
          <li><a href="#/register">Register</a></li>
        </ul>
      `;
    }
    return navContent; // HTML ini akan langsung dimasukkan ke <nav id="app-navigation">
  },
};

export default HTML_TEMPLATES;
