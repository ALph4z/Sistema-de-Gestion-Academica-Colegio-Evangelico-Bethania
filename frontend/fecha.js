// =========================================================
// FECHA Y HORA DEL SISTEMA - EDUBETHANIA
// =========================================================

document.addEventListener("DOMContentLoaded", function () {


    // =====================================================
    // FUNCIÓN PRINCIPAL
    // =====================================================

    function actualizarSistema() {

        const ahora = new Date();


        // =================================================
        // FECHA ACTUAL
        // =================================================

        const elementoFecha = document.getElementById("current-date");

        if (elementoFecha) {

            const fecha = ahora.toLocaleDateString("es-DO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            // Primera letra en mayúscula
            elementoFecha.textContent =
                fecha.charAt(0).toUpperCase() + fecha.slice(1);
        }


        // =================================================
        // HORA ACTUAL
        // =================================================

        const elementoHora = document.getElementById("current-time");

        if (elementoHora) {

            const hora = ahora.toLocaleTimeString("es-DO", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

            elementoHora.textContent = hora;
        }


        // =================================================
        // AÑO ESCOLAR
        // =================================================
        //
        // Regla utilizada por EduBethania:
        //
        // El año escolar comienza el último lunes
        // del mes de agosto.
        //
        // Ejemplo:
        //
        // 2026 → lunes 24 de agosto
        // Año escolar → 2026–2027
        //
        // =================================================

        const elementoAño = document.getElementById("school-year");

        if (elementoAño) {

            const añoActual = ahora.getFullYear();


            // ---------------------------------------------
            // Obtener último lunes de agosto
            // ---------------------------------------------

            function obtenerUltimoLunesAgosto(año) {

                // Último día de agosto
                const fecha = new Date(año, 7, 31);

                /*
                    getDay():

                    0 = domingo
                    1 = lunes
                    2 = martes
                    3 = miércoles
                    4 = jueves
                    5 = viernes
                    6 = sábado
                */

                const diaSemana = fecha.getDay();


                // Cantidad de días que debemos retroceder
                // para llegar al lunes.

                const diasRetroceder =
                    diaSemana === 0
                        ? 6
                        : diaSemana - 1;


                fecha.setDate(
                    fecha.getDate() - diasRetroceder
                );


                return fecha;
            }


            // ---------------------------------------------
            // Inicio del año escolar actual
            // ---------------------------------------------

            const inicioAñoEscolar =
                obtenerUltimoLunesAgosto(añoActual);


            let añoInicio;


            // ---------------------------------------------
            // Determinar año escolar
            // ---------------------------------------------

            if (ahora >= inicioAñoEscolar) {

                // Ya comenzó el año escolar actual
                añoInicio = añoActual;

            } else {

                // Todavía estamos en el año escolar anterior
                añoInicio = añoActual - 1;
            }


            const añoFin = añoInicio + 1;


            // ---------------------------------------------
            // Mostrar año escolar
            // ---------------------------------------------

            elementoAño.textContent =
                `AÑO ESCOLAR ${añoInicio}–${añoFin}`;
        }

    }


    // =====================================================
    // EJECUTAR AL CARGAR LA PÁGINA
    // =====================================================

    actualizarSistema();


    // =====================================================
    // ACTUALIZAR CADA SEGUNDO
    // =====================================================

    setInterval(actualizarSistema, 1000);

});