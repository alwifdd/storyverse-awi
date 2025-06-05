// Lokasi file: src/routes/routes.js
import HomePage from "../scripts/pages/home-page";
import AddStoryPage from "../scripts/pages/add-story-page";
import LoginPage from "../scripts/pages/login-page";
import RegisterPage from "../scripts/pages/register-page";
import SavedStoriesPage from "../scripts/pages/saved-stories-page"; // <-- IMPORT BARU
import NotFoundPage from "../scripts/pages/not-found-page";

const routes = {
  "/": new HomePage(),
  "/add-story": new AddStoryPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/saved-stories": new SavedStoriesPage(), // <-- RUTE BARU DITAMBAHKAN
  "/not-found": new NotFoundPage(), // Biasanya sebagai fallback
};

export default routes;
