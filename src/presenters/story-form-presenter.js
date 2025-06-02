class StoryFormPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model; // Model di-inject

    this.#view.onFormSubmit(async (formDataFromView) => {
      await this.#handleFormSubmit(formDataFromView);
    });
  }

  async #handleFormSubmit(formData) {
    this.#view.showLoadingOnButton();
    const result = await this.#model.postNewStory(formData);
    this.#view.hideLoadingOnButton();

    if (result.error) {
      this.#view.showErrorMessage(result.message);
    } else {
      this.#view.showSuccessAndRedirect();
    }
  }
}

export default StoryFormPresenter;
