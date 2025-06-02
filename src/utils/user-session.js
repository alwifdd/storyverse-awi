const UserSession = {
  saveToken(token) {
    sessionStorage.setItem("authToken", token.trim());
  },
  getToken() {
    return sessionStorage.getItem("authToken");
  },
  removeToken() {
    sessionStorage.removeItem("authToken");
  },
  isLoggedIn() {
    return !!this.getToken();
  },
};
export default UserSession;
