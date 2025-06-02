import "../styles/styles.css";
import App from "./pages/app";

// Pendaftaran Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js") // Path ke file service worker Anda
      .then((registration) => {
        console.log(
          "Service Worker: Pendaftaran berhasil, cakupan:",
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker: Pendaftaran gagal:", error);
      });
  });
} else {
  console.log("Service Worker tidak didukung oleh browser ini.");
}

// Kode aplikasi Anda yang sudah ada sebelumnya
document.addEventListener("DOMContentLoaded", () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    nav: document.querySelector("#app-navigation"),
  });

  window.addEventListener("hashchange", () => {
    app.renderPage();
  });

  // Event listener 'load' ini untuk app.renderPage() bisa tetap ada atau
  // Anda bisa mempertimbangkan apakah renderPage awal sudah cukup ditangani oleh
  // DOMContentLoaded dan hashchange. Namun, tidak masalah jika tetap ada.
  window.addEventListener("load", () => {
    app.renderPage();
  });
});
