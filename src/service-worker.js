// src/service-worker.js

// Nama cache untuk Application Shell dan aset statis
const CACHE_NAME = "storyverse-appshell-v1";

// Daftar URL aset statis yang akan di-cache (Application Shell)
const URLS_TO_CACHE = [
  "./", // Alias untuk index.html
  "./index.html",
  "./manifest.json",
  "./app.bundle.js",
  "./app.css", // Sudah diperbaiki
  "./images/icons/icon-192x192.png",
  "./images/icons/icon-512x512.png",
  "./favicon.png",
  "./images/logo.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

// Event 'install': Dipicu saat Service Worker pertama kali diinstal
self.addEventListener("install", (event) => {
  console.log("Service Worker: Menginstal...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching Application Shell");
        const cachePromises = URLS_TO_CACHE.map((urlToCache) => {
          const request = new Request(urlToCache, { mode: "cors" });
          return fetch(request)
            .then((response) => {
              if (!response.ok) {
                console.warn(
                  `Service Worker: Gagal cache ${urlToCache} selama instalasi. Status: ${response.status}. Mungkin karena CORS atau resource tidak tersedia.`
                );
                return Promise.resolve();
              }
              return cache.put(request, response);
            })
            .catch((err) => {
              console.warn(
                `Service Worker: Gagal fetch ${urlToCache} selama instalasi. Error: ${err.message}`
              );
              return Promise.resolve();
            });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log(
          "Service Worker: Proses caching Application Shell selesai (beberapa aset mungkin gagal)."
        );
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error(
          "Service Worker: Error besar selama fase instalasi caching Application Shell:",
          error
        );
      })
  );
});

// Event 'activate': Dipicu saat Service Worker diaktifkan
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Mengaktifkan...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("Service Worker: Menghapus cache lama:", cacheName);
              return caches.delete(cacheName);
            }
            // Return null atau Promise.resolve() jika tidak ada yang dihapus untuk konsistensi
            return null;
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Cache lama dibersihkan.");
        return self.clients.claim();
      })
  );
});

// Event 'fetch': Dipicu setiap kali aplikasi meminta resource (HANYA SATU EVENT LISTENER INI)
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return; // Abaikan request non-GET
  }

  // Strategi Cache First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // console.log('Service Worker: Menyajikan dari cache:', request.url); // Uncomment untuk debug
        return cachedResponse;
      }

      // console.log('Service Worker: Mengambil dari network:', request.url); // Uncomment untuk debug
      return fetch(request)
        .then((networkResponse) => {
          // Di sini Anda bisa menambahkan logika untuk meng-cache aset dinamis jika perlu,
          // misalnya, aset yang diambil dari network yang ingin Anda cache setelahnya.
          // Contoh:
          // if (networkResponse.ok && request.url.startsWith('http')) { // Hanya cache request http/https yang berhasil
          //   const responseToCache = networkResponse.clone();
          //   caches.open(CACHE_NAME_DINAMIS_ANDA).then(cache => { // Gunakan nama cache berbeda untuk aset dinamis
          //     cache.put(request, responseToCache);
          //   });
          // }
          return networkResponse;
        })
        .catch((error) => {
          console.error(
            "Service Worker: Gagal mengambil dari network dan tidak ada di cache:",
            request.url,
            error
          );
          // (Opsional) Kembalikan halaman fallback offline jika ada dan sesuai
          // if (request.mode === 'navigate' && request.destination === 'document') {
          //   return caches.match('./offline.html'); // Anda perlu membuat file offline.html ini
          // }
        });
    })
  );
});

// --- Event Listener untuk Push Notification ---

// Event 'push': Dipicu ketika Service Worker menerima pesan push dari server
self.addEventListener("push", (event) => {
  console.log("Service Worker: Pesan Push diterima.");

  let notificationData = {
    title: "StoryVerse Notification", // Judul default
    options: {
      body: "Ada sesuatu yang baru di StoryVerse!", // Body default
      icon: "./images/icons/icon-192x192.png",
      badge: "./images/icons/icon-96x96.png", // (Opsional) Ikon kecil untuk status bar
      data: { url: "/" }, // Data default, URL untuk dibuka saat notifikasi diklik
      // Anda bisa menambahkan properti lain seperti vibrate, image, tag, dll.
    },
  };

  if (event.data) {
    try {
      const payloadText = event.data.text();
      const payloadJson = JSON.parse(payloadText);
      console.log("Service Worker: Payload Push Notification:", payloadJson);

      // Menggunakan data dari payload sesuai skema API Dicoding
      if (payloadJson.title) {
        notificationData.title = payloadJson.title;
      }
      if (payloadJson.options) {
        if (payloadJson.options.body) {
          notificationData.options.body = payloadJson.options.body;
        }
        if (payloadJson.options.icon) {
          // Jika server mengirim path ikon
          notificationData.options.icon = payloadJson.options.icon;
        }
        if (payloadJson.options.badge) {
          notificationData.options.badge = payloadJson.options.badge;
        }
        if (payloadJson.options.data) {
          // Misal, URL untuk dibuka saat diklik
          notificationData.options.data = payloadJson.options.data;
        }
        // Anda bisa menambahkan properti lain dari payloadJson.options
        // seperti image, tag, renotify, vibrate, dll. jika server mengirimkannya.
        // notificationData.options = { ...notificationData.options, ...payloadJson.options }; // Cara lebih umum
      }
    } catch (e) {
      console.error(
        "Service Worker: Gagal mem-parse payload push atau payload tidak ada:",
        e
      );
    }
  }

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title,
      notificationData.options
    )
  );
});

// Event 'notificationclick': Dipicu ketika pengguna mengklik notifikasi
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notifikasi diklik.");

  event.notification.close(); // Selalu tutup notifikasi setelah diklik

  const urlToOpen =
    event.notification.data && event.notification.data.url
      ? event.notification.data.url
      : "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          // Coba cocokkan dengan path URL. Untuk kecocokan yang lebih baik, Anda mungkin perlu membandingkan full URL.
          const clientUrl = new URL(client.url);
          if (clientUrl.pathname === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
