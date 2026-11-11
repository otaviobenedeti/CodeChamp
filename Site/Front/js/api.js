const API_URL = "http://localhost:3000";

async function apiFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = localStorage.getItem("token");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const resposta = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });

    if (resposta.status === 401) {
        redirectToLogin();
    }

    return resposta;
}
