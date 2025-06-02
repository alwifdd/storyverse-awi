// Lokasi file: src/scripts/pages/add-story-page.js

import StoryFormPresenter from "../../presenters/story-form-presenter";
import CameraHelper from "../../utils/camera-helper";
import MapInitiator from "../../utils/map-initiator";

class AddStoryPage {
  #camera;
  #photoBlob = null;
  #mapMarker = null; // Pastikan properti ini ada di kelas Anda, diinisialisasi null

  async render() {
    return `
      <section class="content">
        <h2 class="content-heading">Share Your New Story</h2>
        <div class="form-container">
          <form id="story-form" novalidate>
            <div class="form-group">
              <label>1. Take a Photo</label>
              <div class="camera-container">
                <video id="camera-video" autoplay playsinline style="background-color:#eee;"></video>
                <canvas id="camera-canvas" class="d-none"></canvas>
              </div>
              <button type="button" id="camera-button" class="btn" style="margin-top:0.5rem;"><i class="fa fa-camera"></i> Start Camera</button>
            </div>
            <div class="form-group">
              <label for="description">2. Write a Description</label>
              <textarea id="description" name="description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label>3. Pin the Location</label>
              <div id="map-picker" class="map-container-small"></div>
              <input type="hidden" id="lat" name="lat">
              <input type="hidden" id="lon" name="lon">
            </div>
            <div id="submit-container">
              <button type="submit" class="btn btn-primary">Post Story</button>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender(app, storyDataSource) {
    // Terima storyDataSource dari app.js
    new StoryFormPresenter({
      view: this,
      model: storyDataSource, // Teruskan Model ke Presenter
    });
    this.#setupCamera();
    this.#setupLocationPicker();
  }

  #setupCamera() {
    const video = document.querySelector("#camera-video");
    const canvas = document.querySelector("#camera-canvas");
    const button = document.querySelector("#camera-button");
    this.#camera = new CameraHelper(video, canvas);

    button.addEventListener("click", async () => {
      if (!video.srcObject) {
        const started = await this.#camera.start();
        if (started) {
          button.innerHTML = '<i class="fa fa-circle-dot"></i> Snap!';
          video.style.backgroundColor = "transparent";
        } else {
          alert("Camera could not be started. Please check permissions.");
        }
      } else {
        this.#photoBlob = await this.#camera.takePictureAsBlob();
        if (this.#photoBlob) {
          video.style.backgroundImage = `url(${URL.createObjectURL(
            this.#photoBlob
          )})`;
          video.style.backgroundPosition = "center";
          video.style.backgroundSize = "cover";
          this.#camera.stop();
          video.srcObject = null;
          button.innerHTML = '<i class="fa fa-retweet"></i> Retake Photo';
        }
      }
    });
  }

  #setupLocationPicker() {
    const map = MapInitiator.initLocationPicker("map-picker");
    const latInput = document.querySelector("#lat");
    const lonInput = document.querySelector("#lon");

    const updateMarkerAndInputs = (
      lat,
      lon,
      popupMessage = "Selected location"
    ) => {
      latInput.value = lat;
      lonInput.value = lon;

      if (!this.#mapMarker) {
        this.#mapMarker = L.marker([lat, lon]).addTo(map);
      } else {
        this.#mapMarker.setLatLng([lat, lon]);
      }
      this.#mapMarker.unbindPopup().bindPopup(popupMessage).openPopup();
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // MapInitiator sudah setView, kita hanya urus marker
          updateMarkerAndInputs(latitude, longitude, "Your detected location");
        },
        () => {
          console.warn("Geolocation failed or was denied by user.");
        }
      );
    }

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      updateMarkerAndInputs(lat, lng);
    });
  }

  onFormSubmit(callback) {
    document
      .querySelector("#story-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();

        const description = document.querySelector("#description").value;
        if (!this.#photoBlob || !description) {
          alert("Please provide a photo and a description.");
          return;
        }

        if (this.#photoBlob.size > 1000000) {
          alert(
            "Error: Photo size is too large (max 1MB). Please retake the photo."
          );
          return;
        }

        const formData = new FormData();
        formData.append("photo", this.#photoBlob, "story.jpg");
        formData.append("description", description);

        const latValue = document.querySelector("#lat").value;
        const lonValue = document.querySelector("#lon").value;
        const latNum = parseFloat(latValue);
        const lonNum = parseFloat(lonValue);

        if (
          latValue &&
          lonValue &&
          Number.isFinite(latNum) &&
          Number.isFinite(lonNum)
        ) {
          formData.append("lat", latNum);
          formData.append("lon", lonNum);
        }

        callback(formData);
      });
  }

  showLoadingOnButton() {
    document.querySelector("#submit-container").innerHTML =
      '<button class="btn btn-primary" disabled>Posting...</button>';
  }

  hideLoadingOnButton() {
    document.querySelector("#submit-container").innerHTML =
      '<button type="submit" class="btn btn-primary">Post Story</button>';
  }

  showErrorMessage(message) {
    alert(`Error: ${message}`);
  }

  showSuccessAndRedirect() {
    this.cleanup();
    alert("Story posted successfully!");
    window.location.hash = "#/";
  }

  cleanup() {
    if (this.#camera) {
      this.#camera.stop();
    }
    this.#mapMarker = null;
    // Anda mungkin juga ingin menghapus marker dari peta jika peta masih ada:
    // if (this._mapInstance && this.#mapMarker) { // Anda perlu menyimpan referensi ke 'map' jika mau
    //   this._mapInstance.removeLayer(this.#mapMarker);
    // }
  }
}

export default AddStoryPage;
