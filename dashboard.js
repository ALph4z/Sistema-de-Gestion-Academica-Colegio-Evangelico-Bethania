document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Redirige directamente al Dashboard Principal recién creado
            window.location.href = 'dashboard.html'; 
        });
    }
});