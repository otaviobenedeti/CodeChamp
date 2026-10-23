const AUTH_LOGIN_URL = new URL("../html/login.html", document.currentScript.src).href;

function clearAuthSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
}

function redirectToLogin() {
    clearAuthSession();
    window.location.replace(AUTH_LOGIN_URL);
}

function logout() {
    redirectToLogin();
}

if (document.body.hasAttribute("data-auth-required") && !localStorage.getItem("token")) {
    window.location.replace(AUTH_LOGIN_URL);
}

document.addEventListener("click", (event) => {
    const logoutLink = event.target.closest("[data-logout]");

    if (logoutLink) {
        event.preventDefault();
        logout();
    }
});
