const MapInitiator = {
  init(containerId, { zoom, center = [0, 20] }) {
    const map = L.map(containerId).setView(center, zoom);

    const openStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap",
      }
    );
    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri",
      }
    );

    openStreetMap.addTo(map);

    const baseLayers = {
      "Street View": openStreetMap,
      "Satellite View": satellite,
    };
    L.control.layers(baseLayers).addTo(map);

    return map;
  },

  addMarker(mapInstance, coordinates, popupContent) {
    L.marker(coordinates).addTo(mapInstance).bindPopup(popupContent);
  },

  // --- PERHATIKAN PERUBAHAN DI FUNGSI INI ---
  initLocationPicker(containerId) {
    const map = L.map(containerId);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      // Tambahkan attribution di sini juga
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    map.setView([0, 0], 2); // Tampilan default global

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          // TIDAK ADA PEMBUATAN MARKER DI SINI LAGI
          // Baris L.marker(...).addTo(map)... TELAH DIHAPUS dari fungsi ini.
        },
        () => {
          // Alert bisa lebih informatif atau ditangani di View
          alert(
            "Gagal mendeteksi lokasi. Silakan pilih lokasi secara manual pada peta atau periksa izin lokasi di browser/OS Anda."
          );
        }
      );
    }
    return map;
  },
};

export default MapInitiator;
