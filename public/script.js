const googleLoginBtn = document.getElementById('googleLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const getProtectedDataBtn = document.getElementById('getProtectedDataBtn');
const userPanel = document.getElementById('userPanel');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const protectedData = document.getElementById('protectedData');

googleLoginBtn.addEventListener('click', () => {
    // Redirige al backend para la autenticación con Google
    window.location.href = '/auth/google';
});

// Manejar el cierre de sesión
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authToken');
    userPanel.classList.add('hidden');
    googleLoginBtn.classList.remove('hidden');
});

// Obtener y mostrar datos protegidos
getProtectedDataBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Por favor, inicie sesión primero');
        return;
    }

    try {
        const response = await fetch('/auth/protected', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();
        protectedData.textContent = data.message;
    } catch (error) {
        console.error('Error fetching protected data:', error);
    }
});

// Verificar si el usuario está autenticado
window.onload = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Si hay token, mostrar el panel de usuario
        googleLoginBtn.classList.add('hidden');
        userPanel.classList.remove('hidden');

        // Obtener datos del usuario desde el backend
        fetchUserData();
    }
};

// Función para obtener datos del usuario desde el backend
async function fetchUserData() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch('/auth/protected', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const userData = await response.json();
        userName.textContent = userData.user.name;
        userEmail.textContent = userData.user.email;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
