document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const roleSelect = document.getElementById("roleSelect");

    // Verificar que existan los elementos
    if (!loginForm || !roleSelect) {
        console.error("No se encontró el formulario o el selector de perfil.");
        return;
    }


    // ==========================================
    // PERFIL INICIAL
    // ==========================================

    // Siempre iniciar con Administración
    roleSelect.value = "Administración";



    // ==========================================
    // INGRESAR AL SISTEMA
    // ==========================================

    loginForm.addEventListener("submit", function (event) {

        // Evitar que el formulario recargue la página
        event.preventDefault();

        const perfil = roleSelect.value;


        // ==========================================
        // GUARDAR PERFIL
        // ==========================================

        localStorage.setItem(
            "perfilSeleccionado",
            perfil
        );


        // ==========================================
        // ADMINISTRACIÓN
        // ==========================================

        if (perfil === "Administración") {

            window.location.href = "dashboard.html";

            return;
        }


        // ==========================================
        // DOCENTE
        // ==========================================

        if (perfil === "Docente") {

            window.location.href = "dashboard.html";

            return;
        }


        // ==========================================
        // TUTOR
        // ==========================================

        if (perfil === "Tutor") {

            window.location.href = "portal-tutor.html";

            return;
        }

    });

});