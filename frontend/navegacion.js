document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    if (!menuToggle || !sidebar || !overlay) {
        return;
    }

    // Abrir menú
    menuToggle.addEventListener("click", function () {

        sidebar.classList.add("open");
        overlay.classList.add("active");

    });

    // Cerrar tocando fuera
    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");
        overlay.classList.remove("active");

    });

    // Cerrar al seleccionar una opción
    sidebar.querySelectorAll(".nav-item").forEach(function (item) {

        item.addEventListener("click", function () {

            sidebar.classList.remove("open");
            overlay.classList.remove("active");

        });

    });

    // Si pasamos nuevamente a escritorio
    window.addEventListener("resize", function () {

        if (window.innerWidth > 700) {

            sidebar.classList.remove("open");
            overlay.classList.remove("active");

        }

    });

// ==========================================
// CONTROL DE PERFILES
// ==========================================

const roleSelect = document.getElementById("roleSelect");
const viewTag = document.getElementById("view-tag");


// Elementos del menú
const navDashboard = document.getElementById("nav-dashboard");
const navEstudiantes = document.getElementById("nav-estudiantes");
const navMatricula = document.getElementById("nav-matricula");
const navCaja = document.getElementById("nav-caja");
const navConfiguracion = document.getElementById("nav-configuracion");
const navCarga = document.getElementById("nav-carga");
const navCalificaciones = document.getElementById("nav-calificaciones");
const navPortalTutor = document.getElementById("nav-portal-tutor");


// ==========================================
// ACTUALIZAR MENÚ
// ==========================================

function actualizarMenu() {

    if (!roleSelect) return;

    const rol = roleSelect.value;

    // Guardar el perfil seleccionado
    localStorage.setItem("perfilSeleccionado", rol);

    // Cambiar texto de la vista
    if (viewTag) {
        viewTag.textContent = "Vista de " + rol;
    }


    // Ocultar todos los elementos
    if (navDashboard) navDashboard.style.display = "none";
    if (navEstudiantes) navEstudiantes.style.display = "none";
    if (navMatricula) navMatricula.style.display = "none";
    if (navCaja) navCaja.style.display = "none";
    if (navConfiguracion) navConfiguracion.style.display = "none";
    if (navCarga) navCarga.style.display = "none";
    if (navCalificaciones) navCalificaciones.style.display = "none";
    if (navPortalTutor) navPortalTutor.style.display = "none";


    // ==========================================
    // ADMINISTRACIÓN
    // ==========================================

    if (rol === "Administración") {

        if (navDashboard) navDashboard.style.display = "flex";
        if (navEstudiantes) navEstudiantes.style.display = "flex";
        if (navMatricula) navMatricula.style.display = "flex";
        if (navCaja) navCaja.style.display = "flex";
        if (navConfiguracion) navConfiguracion.style.display = "flex";
        if (navCarga) navCarga.style.display = "flex";
        if (navCalificaciones) navCalificaciones.style.display = "flex";
    }


    // ==========================================
    // DOCENTE
    // ==========================================

    else if (rol === "Docente") {

        if (navDashboard) navDashboard.style.display = "flex";
        if (navEstudiantes) navEstudiantes.style.display = "flex";
        if (navMatricula) navMatricula.style.display = "flex";
        if (navCaja) navCaja.style.display = "flex";
        if (navCalificaciones) navCalificaciones.style.display = "flex";
    }


    // ==========================================
    // TUTOR
    // ==========================================

    else if (rol === "Tutor") {

        if (navPortalTutor) navPortalTutor.style.display = "flex";
    }
}


// ==========================================
// CAMBIO DE PERFIL
// ==========================================

if (roleSelect) {

    roleSelect.addEventListener("change", function () {

        const nuevoPerfil = this.value;

        // Guardar perfil
        localStorage.setItem("perfilSeleccionado", nuevoPerfil);

        // Si selecciona Tutor, ir al portal del tutor
        if (nuevoPerfil === "Tutor") {

            window.location.href = "portal-tutor.html";
            return;
        }
        else if (nuevoPerfil === "Administración" || nuevoPerfil === "Docente") {

            window.location.href = "dashboard.html";
            return;
        }
        // actualizar normalmente el menú
        actualizarMenu();

    });
}


// ==========================================
// RECUPERAR PERFIL GUARDADO
// ==========================================

if (roleSelect) {

    const perfilGuardado = localStorage.getItem("perfilSeleccionado");

    if (perfilGuardado) {
        roleSelect.value = perfilGuardado;
    }

    actualizarMenu();
}

});

