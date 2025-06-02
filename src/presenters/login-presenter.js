// Lokasi file: src/presenters/login-presenter.js
// TIDAK ADA IMPORT DI SINI

class LoginPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;

    this.#view.onLoginSubmit(async ({ email, password }) => {
      await this.#handleLogin({ email, password });
    });
  }

  async #handleLogin({ email, password }) {
    this.#view.showLoading();
    const result = await this.#model.login({ email, password }); // Menggunakan model yang di-inject
    this.#view.hideLoading();

    if (result.error) {
      this.#view.showLoginError(result.message);
    } else {
      this.#view.loginSuccess(result.loginResult.token);
    }
  }
}

export default LoginPresenter;
