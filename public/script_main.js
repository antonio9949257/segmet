// Extraer el token de la URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

// Comprobar si el usuario ya está autenticado
if (token) {
    localStorage.setItem('jwt', token);  // Guardar en localStorage
    window.history.replaceState({}, document.title, "/main.html");  // Limpiar la URL
}

// Obtener el token almacenado
const storedToken = localStorage.getItem('jwt');

if (storedToken) {
    document.getElementById("welcome-message").innerText = "Has iniciado sesión correctamente.";
} else {
    document.getElementById("welcome-message").innerText = "No has iniciado sesión.";
}

// Cerrar sesión manualmente
document.getElementById("logout").addEventListener("click", () => {
    // Eliminar localStorage y sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Eliminar todas las cookies
    document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
            .replace(/^ +/, "") // Eliminar espacios al inicio
            .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"); // Expirar la cookie
    });

    // Redirigir al inicio de sesión
    window.location.href = "/";
});
