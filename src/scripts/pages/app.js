// src/scripts/pages/app.js
import routes from "../../routes/routes";
import { getActiveRoute } from "../../routes/url-parser";
import UserSession from "../../utils/user-session";
import HTML_TEMPLATES from "../../views/templates";
import StoryDataSource from "../../data/story-data-source.js";
import NotFoundPage from "./not-found-page";
import CONFIG from "../../config";
import StoryverseDb from "../../utils/indexeddb-helper";

class App {
  #content;
  #nav;
  #currentPage = null;
  #VAPID_PUBLIC_KEY =
    "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
  #menuOverlayElement = null; // Untuk menyimpan referensi ke overlay

  constructor({ content, nav }) {
    this.#content = content;
    this.#nav = nav;
    // Buat overlay sekali saja saat aplikasi diinisialisasi
    this.#menuOverlayElement = document.createElement("div");
    this.#menuOverlayElement.classList.add("menu-overlay");
    document.body.appendChild(this.#menuOverlayElement);

    this.updateNavBar();
  }

  updateNavBar() {
    const isLoggedIn = UserSession.isLoggedIn();
    this.#nav.innerHTML = HTML_TEMPLATES.createNavBar(isLoggedIn); // Ini akan membuat ulang semua tombol di navbar

    // --- Setup untuk Hamburger Menu ---
    const hamburgerButton = this.#nav.querySelector("#hamburger-button");
    const navLinks = this.#nav.querySelector("#navbar-links");

    if (hamburgerButton && navLinks && this.#menuOverlayElement) {
      // Selalu pastikan listener lama dihapus jika elemen dibuat ulang, cara sederhana:
      const newHamburgerButton = hamburgerButton.cloneNode(true);
      if (hamburgerButton.parentNode) {
        // Pastikan parentNode ada sebelum replace
        hamburgerButton.parentNode.replaceChild(
          newHamburgerButton,
          hamburgerButton
        );
      }

      newHamburgerButton.addEventListener("click", () => {
        const isActive = navLinks.classList.contains("active");
        navLinks.classList.toggle("active");
        this.#menuOverlayElement.classList.toggle("active");
        newHamburgerButton.setAttribute("aria-expanded", String(!isActive));
      });

      // Menutup menu jika area overlay diklik (listener ini pada #menuOverlayElement yang persisten)
      // Hapus listener lama dari overlay jika ada, sebelum menambahkan yang baru
      const newOverlay = this.#menuOverlayElement.cloneNode(true);
      this.#menuOverlayElement.parentNode.replaceChild(
        newOverlay,
        this.#menuOverlayElement
      );
      this.#menuOverlayElement = newOverlay; // Update referensi

      this.#menuOverlayElement.addEventListener("click", () => {
        navLinks.classList.remove("active");
        this.#menuOverlayElement.classList.remove("active");
        if (newHamburgerButton)
          newHamburgerButton.setAttribute("aria-expanded", "false");
      });
    }
    // --- Akhir Setup Hamburger Menu ---

    if (isLoggedIn) {
      // Logout Button
      const logoutButton = this.#nav.querySelector(".logout-button");
      if (logoutButton) {
        const newLogoutButton = logoutButton.cloneNode(true);
        if (logoutButton.parentNode)
          logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
        newLogoutButton.addEventListener("click", () => {
          UserSession.removeToken();
          this.updateNavBar();
          window.location.hash = "#/login";
        });
      }

      // Push Notification Button Setup
      this.setupPushSubscriptionButton();

      // Clear IndexedDB Button Setup
      const clearIndexedDbButton = this.#nav.querySelector(
        "#navbar-clear-indexeddb-button"
      );
      if (clearIndexedDbButton) {
        const newClearButton = clearIndexedDbButton.cloneNode(true);
        if (clearIndexedDbButton.parentNode)
          clearIndexedDbButton.parentNode.replaceChild(
            newClearButton,
            clearIndexedDbButton
          );
        newClearButton.addEventListener("click", async () => {
          if (
            confirm(
              "Are you sure you want to delete all cached stories from IndexedDB? This will not delete stories from the server."
            )
          ) {
            try {
              await StoryverseDb.clearAllStories();
              alert(
                "All cached stories have been deleted from IndexedDB. Please refresh to see the effect if offline."
              );
            } catch (error) {
              alert(
                "Failed to clear cached stories from IndexedDB. See console for details."
              );
              console.error("Error clearing IndexedDB from navbar:", error);
            }
          }
        });
      }
    } else {
      // Jika tidak login, pastikan menu mobile (jika terbuka) dan overlay disembunyikan
      if (navLinks) navLinks.classList.remove("active");
      if (this.#menuOverlayElement)
        this.#menuOverlayElement.classList.remove("active");
      if (hamburgerButton)
        hamburgerButton.setAttribute("aria-expanded", "false");
    }
  }

  // --- Metode untuk Push Notification (tetap sama seperti versi lengkap sebelumnya) ---
  async setupPushSubscriptionButton() {
    const subscribeButton = this.#nav.querySelector(
      "#navbar-subscribe-push-button"
    );
    if (subscribeButton) {
      this.updateSubscriptionButtonState(subscribeButton);
    }
  }

  async askForNotificationPermission() {
    try {
      const permissionResult = await Notification.requestPermission();
      if (permissionResult === "granted") {
        console.log("Izin notifikasi diberikan.");
        await this.subscribeToPushManager();
      } else {
        console.warn("Izin notifikasi ditolak atau diabaikan.");
      }
    } catch (error) {
      console.error("Gagal meminta izin notifikasi:", error);
      alert("Gagal meminta izin notifikasi.");
    }
    this.updateSubscriptionButtonState();
  }

  async subscribeToPushManager() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push messaging tidak didukung oleh browser ini.");
      this.updateSubscriptionButtonState(null, false);
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        this.updateSubscriptionButtonState(null, true);
        return;
      }
      if (
        this.#VAPID_PUBLIC_KEY === "MASUKKAN_VAPID_PUBLIC_KEY_ANDA_DI_SINI" ||
        !this.#VAPID_PUBLIC_KEY ||
        this.#VAPID_PUBLIC_KEY.length < 50
      ) {
        alert(
          "Error: VAPID Public Key belum dikonfigurasi dengan benar di App.js!"
        );
        console.error(
          "Error: VAPID Public Key belum dikonfigurasi atau tidak valid di App.js"
        );
        this.updateSubscriptionButtonState(null, false);
        return;
      }
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          this.#VAPID_PUBLIC_KEY
        ),
      });
      console.log("Berhasil subscribe ke Push Manager:", subscription);
      const token = UserSession.getToken();
      if (token) {
        try {
          const response = await fetch(
            `${CONFIG.BASE_URL}/notifications/subscribe`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                endpoint: subscription.endpoint,
                keys: {
                  p256dh: subscription.toJSON().keys.p256dh,
                  auth: subscription.toJSON().keys.auth,
                },
              }),
            }
          );
          const responseJson = await response.json();
          if (!response.ok || responseJson.error) {
            console.error(
              "Gagal mengirim subscription ke server API:",
              responseJson.message || response.statusText
            );
            alert(
              `Berhasil berlangganan notifikasi di browser, tetapi gagal mengirim data ke server. ${
                responseJson.message || ""
              }`
            );
          } else {
            console.log(
              "Berhasil mengirim subscription ke server API:",
              responseJson
            );
            alert("Berhasil berlangganan notifikasi (browser dan server)!");
          }
        } catch (serverError) {
          console.error(
            "Error saat mengirim subscription ke server API:",
            serverError
          );
          alert(
            `Berhasil berlangganan notifikasi di browser, tetapi ada masalah saat menghubungi server. ${serverError.message}`
          );
        }
      } else {
        alert(
          "Berhasil berlangganan notifikasi (hanya di browser, karena Anda tidak login untuk sinkronisasi server)."
        );
      }
      this.updateSubscriptionButtonState(null, true);
    } catch (error) {
      console.error("Gagal melakukan subscribe ke Push Manager:", error);
      if (Notification.permission !== "denied" && error.name !== "AbortError") {
        alert(`Gagal berlangganan notifikasi: ${error.message}`);
      }
      this.updateSubscriptionButtonState(null, false);
    }
  }

  async unsubscribeFromPushManager() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const successfulUnsubscribe = await subscription.unsubscribe();
        if (successfulUnsubscribe) {
          console.log(
            "Berhasil unsubscribe dari Push Manager di sisi browser."
          );
          const token = UserSession.getToken();
          if (token) {
            try {
              const response = await fetch(
                `${CONFIG.BASE_URL}/notifications/subscribe`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ endpoint: subscription.endpoint }),
                }
              );
              const responseJson = await response.json();
              if (!response.ok || responseJson.error) {
                console.error(
                  "Gagal mengirim permintaan unsubscribe ke server API:",
                  responseJson.message || response.statusText
                );
                alert(
                  `Berhasil berhenti langganan di browser, tetapi gagal memberi tahu server. ${
                    responseJson.message || ""
                  }`
                );
              } else {
                console.log(
                  "Berhasil mengirim permintaan unsubscribe ke server API:",
                  responseJson
                );
                alert(
                  "Berhasil berhenti berlangganan notifikasi (browser dan server)."
                );
              }
            } catch (serverError) {
              console.error(
                "Error saat mengirim permintaan unsubscribe ke server API:",
                serverError
              );
              alert(
                `Berhasil berhenti langganan di browser, tetapi ada masalah saat menghubungi server. ${serverError.message}`
              );
            }
          } else {
            alert(
              "Berhasil berhenti berlangganan notifikasi (hanya di browser, karena Anda tidak login)."
            );
          }
        } else {
          console.error("Gagal melakukan unsubscribe di sisi browser.");
          alert("Gagal berhenti berlangganan di browser.");
        }
      }
    } catch (error) {
      console.error("Gagal melakukan unsubscribe:", error);
      alert(`Gagal berhenti berlangganan: ${error.message}`);
    }
    this.updateSubscriptionButtonState(null, false);
  }

  async updateSubscriptionButtonState(button, forceIsSubscribed) {
    const subscribeButton =
      button || this.#nav.querySelector("#navbar-subscribe-push-button");
    if (!subscribeButton) return;

    if (
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      subscribeButton.textContent = "Push Not Supported";
      subscribeButton.disabled = true;
      return;
    }

    subscribeButton.disabled = true;
    // Tidak perlu menyimpan currentOnClick karena kita akan selalu set ulang
    // subscribeButton.textContent = 'Loading Status...'; // Teks ini sudah diatur di HTML_TEMPLATES

    let isSubscribed = forceIsSubscribed;
    if (typeof forceIsSubscribed === "undefined") {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        isSubscribed = !!subscription;
      } catch (error) {
        console.error("Gagal mendapatkan status langganan awal:", error);
        isSubscribed = false;
      }
    }

    const permission = Notification.permission;
    let newText = "Subscribe Notif";
    let newTitle = "Klik untuk berlangganan notifikasi.";
    let newOnClick = () => this.askForNotificationPermission(); // Simpan fungsi listener
    let newDisabled = false;

    if (permission === "denied") {
      newText = "Notif Blocked";
      newTitle = "Izin notifikasi diblokir.";
      newDisabled = true;
      newOnClick = null;
    } else if (isSubscribed) {
      newText = "Unsubscribe Notif";
      newTitle = "Klik untuk berhenti berlangganan notifikasi.";
      newOnClick = () => this.unsubscribeFromPushManager(); // Simpan fungsi listener
    }

    subscribeButton.textContent = newText;
    subscribeButton.title = newTitle;
    subscribeButton.disabled = newDisabled;

    // Hapus listener lama sebelum menambahkan yang baru (jika ada)
    // Cara sederhana: clone dan replace (meskipun kurang ideal jika sering terjadi)
    // Atau, jika kita selalu set ulang onclick:
    subscribeButton.onclick = newOnClick;
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async renderPage() {
    if (this.#currentPage && typeof this.#currentPage.cleanup === "function") {
      this.#currentPage.cleanup();
    }

    const url = getActiveRoute();
    const isLoggedIn = UserSession.isLoggedIn();
    const protectedRoutes = ["/", "/add-story"];
    const publicOnlyRoutes = ["/login", "/register"];

    if (!isLoggedIn && protectedRoutes.includes(url)) {
      window.location.hash = "#/login";
      return;
    }
    if (isLoggedIn && publicOnlyRoutes.includes(url)) {
      window.location.hash = "#/";
      return;
    }

    const PageComponent = routes[url];

    if (!PageComponent) {
      this.#currentPage = new NotFoundPage();
      this.#content.innerHTML = await this.#currentPage.render();
      if (typeof this.#currentPage.afterRender === "function") {
        await this.#currentPage.afterRender(this);
      }
      return;
    }

    this.#currentPage = PageComponent;

    const render = async () => {
      if (typeof this.#currentPage.render !== "function") {
        console.error(
          "Current page does not have a render method:",
          this.#currentPage
        );
        this.#content.innerHTML = "<h1>Error: Page cannot be rendered.</h1>";
        return;
      }
      this.#content.innerHTML = await this.#currentPage.render();

      if (typeof this.#currentPage.afterRender === "function") {
        await this.#currentPage.afterRender(this, StoryDataSource);
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(render);
    } else {
      await render();
    }

    const skipLink = document.querySelector(".skip-link");
    const mainContent = document.querySelector("#main-content");
    if (skipLink && mainContent) {
      const newSkipLink = skipLink.cloneNode(true);
      if (skipLink.parentNode) {
        skipLink.parentNode.replaceChild(newSkipLink, skipLink);
      }
      newSkipLink.addEventListener("click", (event) => {
        event.preventDefault();
        mainContent.focus();
      });
    }
  }
}

export default App;
