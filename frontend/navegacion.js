document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // MENÚ MÓVIL
    // =====================================================

    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (menuToggle && sidebar && overlay) {

        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        overlay.addEventListener("click", function () {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });

        const enlacesMenu = sidebar.querySelectorAll("a");

        enlacesMenu.forEach(function (enlace) {
            enlace.addEventListener("click", function () {
                sidebar.classList.remove("active");
                overlay.classList.remove("active");
            });
        });
    }


    // =====================================================
    // ELEMENTOS DEL PERFIL
    // =====================================================

    const roleSelect = document.getElementById("roleSelect");
    const viewTag = document.querySelector(".view-tag");

    const navDashboard = document.getElementById("nav-dashboard");
    const navEstudiantes = document.getElementById("nav-estudiantes");
    const navMatricula = document.getElementById("nav-matricula");
    const navCaja = document.getElementById("nav-caja");
    const navConfiguracion = document.getElementById("nav-configuracion");
    const navCarga = document.getElementById("nav-carga");
    const navCalificaciones = document.getElementById("nav-calificaciones");
    const navPortalTutor = document.getElementById("nav-portal-tutor");


    // =====================================================
    // FUNCIÓN PARA MOSTRAR / OCULTAR MENÚ
    // =====================================================

    function actualizarMenu() {

        const perfil = roleSelect ? roleSelect.value : "Administración";

        // Ocultar todos los elementos primero
        if (navDashboard) navDashboard.style.display = "none";
        if (navEstudiantes) navEstudiantes.style.display = "none";
        if (navMatricula) navMatricula.style.display = "none";
        if (navCaja) navCaja.style.display = "none";
        if (navConfiguracion) navConfiguracion.style.display = "none";
        if (navCarga) navCarga.style.display = "none";
        if (navCalificaciones) navCalificaciones.style.display = "none";
        if (navPortalTutor) navPortalTutor.style.display = "none";


        // =================================================
        // ADMINISTRACIÓN
        // =================================================

        if (perfil === "Administración") {

            if (navDashboard) navDashboard.style.display = "";
            if (navEstudiantes) navEstudiantes.style.display = "";
            if (navMatricula) navMatricula.style.display = "";
            if (navCaja) navCaja.style.display = "";
            if (navConfiguracion) navConfiguracion.style.display = "";
            if (navCarga) navCarga.style.display = "";
            if (navCalificaciones) navCalificaciones.style.display = "";

            if (viewTag) {
                viewTag.textContent = "Vista de Administración";
            }
        }


        // =================================================
        // DOCENTE
        // =================================================

        else if (perfil === "Docente") {

            if (navDashboard) navDashboard.style.display = "";
            if (navEstudiantes) navEstudiantes.style.display = "";
            if (navMatricula) navMatricula.style.display = "";
            if (navCaja) navCaja.style.display = "";
            if (navCalificaciones) navCalificaciones.style.display = "";

            if (viewTag) {
                viewTag.textContent = "Vista de Docente";
            }
        }


        // =================================================
        // TUTOR
        // =================================================

        else if (perfil === "Tutor") {

            if (navPortalTutor) {
                navPortalTutor.style.display = "";
            }

            if (viewTag) {
                viewTag.textContent = "Vista de Tutor";
            }
        }
    }


    // =====================================================
    // CAMBIO DE PERFIL DESDE EL SELECTOR
    // =====================================================

    if (roleSelect) {

        roleSelect.addEventListener("change", function () {

            const nuevoPerfil = this.value;

            // Guardar perfil seleccionado
            localStorage.setItem("perfilSeleccionado", nuevoPerfil);


            // Tutor
            if (nuevoPerfil === "Tutor") {
                window.location.href = "/portal-tutor.html";
                return;
            }


            // Administración o Docente
            if (
                nuevoPerfil === "Administración" ||
                nuevoPerfil === "Docente"
            ) {
                window.location.href = "/dashboard.html?rol=" +
                    encodeURIComponent(nuevoPerfil);
                return;
            }

            actualizarMenu();
        });
    }


    // =====================================================
    // RECUPERAR PERFIL
    // =====================================================

    const parametros = new URLSearchParams(window.location.search);
    const rolURL = parametros.get("rol");


    // =====================================================
    // LA URL TIENE PRIORIDAD
    // =====================================================

    if (
        rolURL === "Administración" ||
        rolURL === "Docente" ||
        rolURL === "Tutor"
    ) {
        localStorage.setItem("perfilSeleccionado", rolURL);
    }


    // =====================================================
    // OBTENER PERFIL GUARDADO
    // =====================================================

    let perfilGuardado = localStorage.getItem("perfilSeleccionado");


    // Si no existe ningún perfil, usar Administración
    if (
        perfilGuardado !== "Administración" &&
        perfilGuardado !== "Docente" &&
        perfilGuardado !== "Tutor"
    ) {
        perfilGuardado = "Administración";
        localStorage.setItem("perfilSeleccionado", "Administración");
    }


    // =====================================================
    // EVITAR QUE TUTOR SE QUEDE EN DASHBOARD
    // =====================================================

    const paginaActual = window.location.pathname;

    if (
        perfilGuardado === "Tutor" &&
        paginaActual.endsWith("/dashboard.html")
    ) {
        window.location.href = "/portal-tutor.html";
        return;
    }


    // =====================================================
    // MOSTRAR PERFIL EN EL SELECTOR
    // =====================================================

    if (roleSelect) {
        roleSelect.value = perfilGuardado;
    }


    // =====================================================
    // ACTUALIZAR TEXTO DE LA VISTA
    // =====================================================

    if (viewTag) {

        if (perfilGuardado === "Administración") {
            viewTag.textContent = "Vista de Administración";
        }

        else if (perfilGuardado === "Docente") {
            viewTag.textContent = "Vista de Docente";
        }

        else if (perfilGuardado === "Tutor") {
            viewTag.textContent = "Vista de Tutor";
        }
    }


    // =====================================================
    // ACTUALIZAR MENÚ
    // =====================================================

    actualizarMenu();

});
