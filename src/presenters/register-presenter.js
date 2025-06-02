// Lokasi file: src/presenters/register-presenter.js
// TIDAK ADA IMPORT DI SINI

class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;

    this.#view.onRegisterSubmit(async ({ name, email, password }) => {
      await this.#handleRegister({ name, email, password });
    });
  }

  async #handleRegister({ name, email, password }) {
    this.#view.showLoading();
    const result = await this.#model.register({ name, email, password }); // Menggunakan model
    this.#view.hideLoading();

    if (result.error) {
      this.#view.showRegisterError(result.message);
    } else {
      this.#view.registerSuccess();
    }
  }
}

export default RegisterPresenter;
