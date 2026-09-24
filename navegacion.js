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

});