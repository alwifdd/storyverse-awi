// src/views/templates.js
const HTML_TEMPLATES = {
  /**
   * Membuat item cerita HTML.
   * @param {object} story - Objek cerita.
   * @param {object} options - Opsi untuk rendering.
   * @param {boolean} options.isBookmarkedPage - True jika ini untuk halaman cerita yang dibookmark (menampilkan tombol hapus).
   * @param {boolean} options.isCurrentlyBookmarked - True jika cerita ini sudah dibookmark (untuk status tombol simpan).
   */
  createStoryItem(
    story,
    options = { isBookmarkedPage: false, isCurrentlyBookmarked: false }
  ) {
    // Log paling awal untuk memastikan fungsi dipanggil dengan parameter yang benar
    console.log(
      "[TEMPLATES] createStoryItem called. Story ID:",
      story ? story.id : "No story ID",
      "Options:",
      options
    );

    const { isBookmarkedPage, isCurrentlyBookmarked } = options;

    // Fallback untuk properti cerita jika tidak ada
    const storyIdSafe =
      story && story.id
        ? story.id.toString().replace(/"/g, "&quot;")
        : `story-${Math.random().toString(36).substr(2, 9)}`;
    const storyNameSafe =
      story && story.name ? story.name : "Nama Tidak Tersedia";
    const storyDescriptionSafe =
      story && story.description
        ? story.description.substring(0, 150) // Anda menggunakan 150, kita ikuti
        : "Deskripsi tidak tersedia";
    const storyPhotoUrl =
      story && story.photoUrl ? story.photoUrl : "images/placeholder.png"; // Sediakan gambar placeholder jika belum ada
    const storyDate =
      story && story.createdAt
        ? new Date(story.createdAt).toLocaleDateString("id-ID", {
            // Mengembalikan ke id-ID sesuai diskusi awal, atau biarkan "en-GB" jika itu preferensi Anda
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Tanggal Tidak Tersedia";

    let actionButtonHtml = "";

    if (isBookmarkedPage) {
      // Tombol Hapus untuk halaman cerita yang dibookmark/disimpan
      actionButtonHtml = `
        <button class="btn-story-action btn-delete-bookmark" data-id="${storyIdSafe}" aria-label="Hapus dari Cerita Tersimpan">
          <i class="fas fa-trash fa-fw"></i> Hapus
        </button>
      `;
      // Log untuk cabang if
      console.log(
        "[TEMPLATES] Rendering DELETE button for story ID:",
        storyIdSafe,
        "HTML:",
        actionButtonHtml
      );
    } else {
      // Tombol Simpan/Tersimpan untuk daftar cerita global (HomePage)
      const iconClass = isCurrentlyBookmarked
        ? "fas fa-bookmark fa-fw"
        : "far fa-bookmark fa-fw"; // Ikon bookmark penuh atau outline
      const buttonText = isCurrentlyBookmarked ? "Tersimpan" : "Simpan Cerita";
      const ariaPressed = isCurrentlyBookmarked ? "true" : "false";
      actionButtonHtml = `
        <button class="btn-story-action btn-toggle-bookmark" data-id="${storyIdSafe}" aria-label="${buttonText}" aria-pressed="${ariaPressed}">
          <i class="${iconClass}"></i> ${buttonText}
        </button>
      `;
      // Log untuk cabang else
      console.log(
        "[TEMPLATES] Rendering SAVE/BOOKMARKED button for story ID:",
        storyIdSafe,
        "isCurrentlyBookmarked:",
        isCurrentlyBookmarked,
        "HTML:",
        actionButtonHtml
      );
    }

    const finalHtml = `
      <article class="story-item" data-story-id="${storyIdSafe}">
        <img class="story-item__thumbnail" src="${storyPhotoUrl}" alt="Foto cerita oleh ${storyNameSafe}">
        <div class="story-item__content">
          <h3 class="story-item__title">${storyNameSafe}</h3>
          <p class="story-item__date"><i class="fas fa-calendar-alt fa-fw"></i> ${storyDate}</p>
          <p class="story-item__description">${storyDescriptionSafe}...</p>
          <div class="story-item__actions">
            ${actionButtonHtml}
          </div>
        </div>
      </article>`;

    // Log HTML final sebelum return
    console.log(
      "[TEMPLATES] Final actionButtonHtml for story ID:",
      storyIdSafe,
      "is:",
      actionButtonHtml
    );
    return finalHtml;
  },

  createLoadingIndicator() {
    return '<div class="loading-indicator"></div>';
  },

  createEmptyState(customMessage = "Belum ada cerita di sini.") {
    // Menyesuaikan pesan default Anda
    return `<p class="empty-message">${customMessage}</p>`;
  },

  createErrorState(message) {
    return `<p class="error-message">Maaf, terjadi kesalahan: ${message}</p>`;
  },

  createNavBar(isLoggedIn) {
    let listItems = ""; // Variabel untuk <li> items
    let subscribeButtonHtml = "";
    let clearCacheButtonHtml = "";
    let logoutButtonHtml = "";

    if (isLoggedIn) {
      listItems = `
        <li><a href="#/"><i class="fas fa-home fa-fw"></i> Home</a></li>
        <li><a href="#/add-story"><i class="fas fa-plus-circle fa-fw"></i> Add Story +</a></li>
        <li><a href="#/saved-stories"><i class="fas fa-bookmark fa-fw"></i> Cerita Tersimpan</a></li>
      `;
      subscribeButtonHtml = `<li><button id="navbar-subscribe-push-button" class="btn btn-link-style btn-sm" title="Klik untuk berlangganan notifikasi."><i class="fas fa-bell fa-fw"></i> Subscribe Notif</button></li>`;
      clearCacheButtonHtml = `<li><button id="navbar-clear-indexeddb-button" class="btn btn-link-style btn-sm btn-danger" title="Hapus semua cerita dari cache lokal (IndexedDB)"><i class="fas fa-trash-alt fa-fw"></i> Clear Cache</button></li>`;
      logoutButtonHtml = `<li><button class="logout-button"><i class="fas fa-sign-out-alt fa-fw"></i> Logout</button></li>`;

      listItems +=
        subscribeButtonHtml + clearCacheButtonHtml + logoutButtonHtml;
    } else {
      listItems = `
        <li><a href="#/login"><i class="fas fa-sign-in-alt fa-fw"></i> Login</a></li>
        <li><a href="#/register"><i class="fas fa-user-plus fa-fw"></i> Register</a></li>
      `;
    }

    return `
      <button id="hamburger-button" class="hamburger-button" aria-label="Toggle menu" aria-expanded="false">
        <i class="fas fa-bars"></i>
      </button>
      <ul id="navbar-links" class="navbar-links">
        ${listItems}
      </ul>
    `;
  },
};

export default HTML_TEMPLATES;
