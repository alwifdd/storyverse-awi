// Lokasi file: src/scripts/pages/login-page.js
// saya menghapus import StoryDataSource from '../../data/story-data-source';
import LoginPresenter from "../../presenters/login-presenter"; // Import Presenter
import UserSession from "../../utils/user-session";
// HTML_TEMPLATES bisa diimpor jika ada template spesifik untuk loading/error di halaman ini

class LoginPage {
  #app;

  async render() {
    // Pastikan hanya ada satu H1 per "tampilan" logis, H2 jika H1 utama ada di header
    return `
      <section class="content">
        <h2 class="content-heading">Login to StoryVerse</h2> 
        <div id="loading-container-login"></div>
        <div class="form-container">
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required autocomplete="current-password">
            </div>
            <div id="button-container-login">
                <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </form>
          <p style="text-align: center; margin-top: 1rem;">
            No account? <a href="#/register">Register here</a>
          </p>
        </div>
      </section>
    `;
  }

  // Terima app dan storyDataSource (Model)
  async afterRender(app, storyDataSource) {
    this.#app = app;
    new LoginPresenter({
      view: this,
      model: storyDataSource, // Teruskan instance Model ke Presenter
    });
  }

  // View menyediakan cara bagi Presenter untuk mendapatkan data form
  onLoginSubmit(callback) {
    document
      .querySelector("#login-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        callback({ email, password });
      });
  }

  showLoading() {
    document.querySelector("#button-container-login").innerHTML =
      '<button class="btn btn-primary" disabled>Logging in...</button>';
    // Atau: document.querySelector('#loading-container-login').innerHTML = HTML_TEMPLATES.createLoadingIndicator();
  }

  hideLoading() {
    document.querySelector("#button-container-login").innerHTML =
      '<button type="submit" class="btn btn-primary">Login</button>';
    // Atau: document.querySelector('#loading-container-login').innerHTML = '';
  }

  showLoginError(message) {
    alert(message); // View yang menampilkan error
  }

  loginSuccess(token) {
    UserSession.saveToken(token);
    this.#app.updateNavBar(); // Panggil metode dari instance App
    window.location.hash = "#/";
  }

  cleanup() {}
}

export default LoginPage;
