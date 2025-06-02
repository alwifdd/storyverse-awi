import HomePage from "../scripts/pages/home-page";
import AddStoryPage from "../scripts/pages/add-story-page";
import LoginPage from "../scripts/pages/login-page";
import RegisterPage from "../scripts/pages/register-page";

const routes = {
  "/": new HomePage(),
  "/add-story": new AddStoryPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
};
export default routes;
