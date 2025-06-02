// Lokasi file: src/scripts/pages/register-page.js
// HAPUS: import StoryDataSource from '../../data/story-data-source';
import RegisterPresenter from "../../presenters/register-presenter"; // Import Presenter
// HTML_TEMPLATES jika perlu

class RegisterPage {
  async render() {
    // H2 untuk konsistensi heading level
    return `
      <section class="content">
        <h2 class="content-heading">Create an Account</h2>
        <div id="loading-container-register"></div>
        <div class="form-container">
          <form id="register-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password (min. 8 characters)</label>
              <input type="password" id="password" required minlength="8">
            </div>
             <div id="button-container-register">
                <button type="submit" class="btn btn-primary">Register</button>
            </div>
          </form>
          <p style="text-align: center; margin-top: 1rem;">
            Already have an account? <a href="#/login">Login here</a>
          </p>
        </div>
      </section>
    `;
  }

  // Terima app dan storyDataSource (Model)
  async afterRender(app, storyDataSource) {
    new RegisterPresenter({
      view: this,
      model: storyDataSource, // Teruskan instance Model ke Presenter
    });
  }

  onRegisterSubmit(callback) {
    document
      .querySelector("#register-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const name = document.querySelector("#name").value;
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        callback({ name, email, password });
      });
  }

  showLoading() {
    document.querySelector("#button-container-register").innerHTML =
      '<button class="btn btn-primary" disabled>Registering...</button>';
  }

  hideLoading() {
    document.querySelector("#button-container-register").innerHTML =
      '<button type="submit" class="btn btn-primary">Register</button>';
  }

  showRegisterError(message) {
    alert(message);
  }

  registerSuccess() {
    alert("Registration successful! Please login.");
    window.location.hash = "#/login";
  }

  cleanup() {}
}

export default RegisterPage;
