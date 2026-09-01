document.addEventListener('DOMContentLoaded', function () {

    const filasEstudiantes = document.querySelectorAll(
        '.enrollment-table tbody tr'
    );

    filasEstudiantes.forEach(fila => {

        fila.addEventListener('click', function () {

            // Si ya está seleccionada, se deselecciona
            if (this.classList.contains('selected-student')) {
                this.classList.remove('selected-student');
                return;
            }

            // Quitar selección de las demás filas
            filasEstudiantes.forEach(otraFila => {
                otraFila.classList.remove('selected-student');
            });

            // Seleccionar la fila actual
            this.classList.add('selected-student');
        });

    });

});