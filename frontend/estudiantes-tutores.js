document.addEventListener("DOMContentLoaded", function () {

    const newStudentButton = document.getElementById("new-student-btn");

    const studentModal = document.getElementById("student-modal");
    const studentModalClose = document.getElementById("student-modal-close");
    const studentCancelButton = document.getElementById("student-cancel-btn");

    const studentForm = document.getElementById("student-form");
    const studentModalTitle = document.getElementById("student-modal-title");
    const studentSubmitText = document.getElementById("student-submit-text");

    const studentId = document.getElementById("student-id");

    const studentName = document.getElementById("student-name");
    const studentLastName = document.getElementById("student-last-name");
    const studentBirthDate = document.getElementById("student-birth-date");
    const studentSex = document.getElementById("student-sex");
    const studentPhone = document.getElementById("student-phone");
    const studentAddress = document.getElementById("student-address");
    const studentShift = document.getElementById("student-shift");

    const tutorName = document.getElementById("tutor-name");
    const tutorRelationship = document.getElementById("tutor-relationship");

    const formMessage = document.getElementById("form-message");

    const searchInput = document.getElementById("student-search");
    const tableBody = document.getElementById("students-table-body");
    const emptyState = document.getElementById("empty-state");

    const deleteModal = document.getElementById("delete-modal");
    const deleteStudentName = document.getElementById("delete-student-name");
    const deleteCancelButton = document.getElementById("delete-cancel-btn");
    const deleteConfirmButton = document.getElementById("delete-confirm-btn");


    let studentToDelete = null;


    /* =====================================================
       DATOS DEMOSTRATIVOS
    ====================================================== */

    const students = {

        1: {
            name: "Sofía",
            lastName: "Martínez",
            birthDate: "",
            sex: "Femenino",
            phone: "809-555-1010",
            address: "",
            shift: "Matutina",
            tutorName: "María Pérez",
            relationship: "Madre"
        },

        2: {
            name: "Luis Manuel",
            lastName: "Reyes",
            birthDate: "",
            sex: "Masculino",
            phone: "809-555-1075",
            address: "",
            shift: "Matutina",
            tutorName: "Manuel Reyes",
            relationship: "Padre"
        },

        3: {
            name: "Camila",
            lastName: "Núñez",
            birthDate: "",
            sex: "Femenino",
            phone: "809-555-1090",
            address: "",
            shift: "Matutina",
            tutorName: "Rosa Núñez",
            relationship: "Madre"
        },

        4: {
            name: "José Alejandro",
            lastName: "Díaz",
            birthDate: "",
            sex: "Masculino",
            phone: "809-555-1002",
            address: "",
            shift: "Matutina",
            tutorName: "Ana Díaz",
            relationship: "Madre"
        }

    };


    /* =====================================================
       ABRIR MODAL NUEVO
    ====================================================== */

    function openNewStudentModal() {

        studentForm.reset();

        studentId.value = "";

        studentModalTitle.textContent = "Nuevo estudiante";

        studentSubmitText.textContent = "Guardar estudiante";

        clearFormMessage();

        clearInvalidFields();

        studentModal.hidden = false;

        document.body.style.overflow = "hidden";

        setTimeout(function () {
            studentName.focus();
        }, 100);

    }


    /* =====================================================
       CERRAR MODAL
    ====================================================== */

    function closeStudentModal() {

        studentModal.hidden = true;

        document.body.style.overflow = "";

        clearFormMessage();

        clearInvalidFields();

    }


    /* =====================================================
       EDITAR ESTUDIANTE
    ====================================================== */

    function openEditStudentModal(id) {

        const student = students[id];

        if (!student) {
            return;
        }

        studentId.value = id;

        studentName.value = student.name;
        studentLastName.value = student.lastName;
        studentBirthDate.value = student.birthDate;
        studentSex.value = student.sex;
        studentPhone.value = student.phone;
        studentAddress.value = student.address;
        studentShift.value = student.shift;

        tutorName.value = student.tutorName;
        tutorRelationship.value = student.relationship;

        studentModalTitle.textContent = "Editar estudiante";

        studentSubmitText.textContent = "Guardar cambios";

        clearFormMessage();

        clearInvalidFields();

        studentModal.hidden = false;

        document.body.style.overflow = "hidden";

        setTimeout(function () {
            studentName.focus();
        }, 100);

    }


    /* =====================================================
       VALIDACIÓN
    ====================================================== */

    function validateForm() {

        clearInvalidFields();

        const requiredFields = [
            studentName,
            studentLastName,
            studentBirthDate,
            studentSex,
            studentPhone,
            studentAddress,
            studentShift,
            tutorName,
            tutorRelationship
        ];

        let valid = true;

        requiredFields.forEach(function (field) {

            if (!field.value.trim()) {

                field.closest(".form-group").classList.add("invalid");

                valid = false;

            }

        });


        if (!valid) {

            showFormMessage(
                "Falta algún dato obligatorio. Completa los campos marcados para continuar."
            );

        }


        return valid;

    }


    function clearInvalidFields() {

        document
            .querySelectorAll(".form-group.invalid")
            .forEach(function (group) {
                group.classList.remove("invalid");
            });

    }


    function showFormMessage(message) {

        formMessage.textContent = message;

        formMessage.hidden = false;

    }


    function clearFormMessage() {

        formMessage.textContent = "";

        formMessage.hidden = true;

    }


    /* =====================================================
       GUARDAR ESTUDIANTE
    ====================================================== */

    studentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }


        const id = studentId.value;


        if (id) {

            /*
             * Actualización del estudiante.
             */

            students[id] = {

                name: studentName.value.trim(),

                lastName: studentLastName.value.trim(),

                birthDate: studentBirthDate.value,

                sex: studentSex.value,

                phone: studentPhone.value.trim(),

                address: studentAddress.value.trim(),

                shift: studentShift.value,

                tutorName: tutorName.value.trim(),

                relationship: tutorRelationship.value

            };

            updateStudentRow(id);

        } else {

            /*
             * En una implementación con backend,
             * aquí se enviaría el registro a la base de datos.
             */

            const newId = String(
                Date.now()
            );

            students[newId] = {

                name: studentName.value.trim(),

                lastName: studentLastName.value.trim(),

                birthDate: studentBirthDate.value,

                sex: studentSex.value,

                phone: studentPhone.value.trim(),

                address: studentAddress.value.trim(),

                shift: studentShift.value,

                tutorName: tutorName.value.trim(),

                relationship: tutorRelationship.value

            };

            addStudentRow(
                newId,
                students[newId]
            );

        }


        closeStudentModal();

        refreshSearch();

    });


    /* =====================================================
       CREAR FILA
    ====================================================== */

    function addStudentRow(id, student) {

        const fullName =
            `${student.name} ${student.lastName}`.trim();

        const initials =
            getInitials(fullName);

        const row =
            document.createElement("tr");

        row.dataset.studentId = id;

        row.innerHTML = `

            <td>

                <div class="student-name-cell">

                    <div class="student-avatar">
                        ${initials}
                    </div>

                    <span>
                        ${escapeHtml(fullName)}
                    </span>

                </div>

            </td>

            <td>
                ${escapeHtml(student.tutorName)}
            </td>

            <td>
                Sin sección
            </td>

            <td>
                ${escapeHtml(student.phone)}
            </td>

            <td>

                <span class="document-badge document-warning">
                    Sin documentos
                </span>

            </td>

            <td>

                <div class="table-actions">

                    <button
                        class="btn-edit"
                        type="button"
                        data-action="edit"
                        data-id="${id}">

                        Editar

                    </button>

                    <button
                        class="btn-delete"
                        type="button"
                        data-action="delete"
                        data-id="${id}">

                        Eliminar

                    </button>

                </div>

            </td>

        `;

        tableBody.appendChild(row);

    }


    /* =====================================================
       ACTUALIZAR FILA
    ====================================================== */

    function updateStudentRow(id) {

        const row =
            document.querySelector(
                `tr[data-student-id="${id}"]`
            );

        const student = students[id];

        if (!row || !student) {
            return;
        }

        const fullName =
            `${student.name} ${student.lastName}`.trim();

        const initials =
            getInitials(fullName);

        row.querySelector(".student-avatar").textContent =
            initials;

        row.querySelector(
            ".student-name-cell span"
        ).textContent = fullName;

        const cells = row.querySelectorAll("td");

        cells[1].textContent =
            student.tutorName;

        cells[3].textContent =
            student.phone;

    }


    /* =====================================================
       EDITAR / ELIMINAR
    ====================================================== */

    tableBody.addEventListener("click", function (event) {

        const button =
            event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        const id =
            button.dataset.id;


        if (action === "edit") {

            openEditStudentModal(id);

        }


        if (action === "delete") {

            openDeleteModal(id);

        }

    });


    /* =====================================================
       CONFIRMACIÓN DE ELIMINACIÓN
    ====================================================== */

    function openDeleteModal(id) {

        const row =
            document.querySelector(
                `tr[data-student-id="${id}"]`
            );

        if (!row) {
            return;
        }

        const name =
            row.querySelector(
                ".student-name-cell span"
            ).textContent;

        studentToDelete = id;

        deleteStudentName.textContent = name;

        deleteModal.hidden = false;

        document.body.style.overflow = "hidden";

    }


    function closeDeleteModal() {

        deleteModal.hidden = true;

        document.body.style.overflow = "";

        studentToDelete = null;

    }


    deleteConfirmButton.addEventListener("click", function () {

        if (!studentToDelete) {
            return;
        }

        const row =
            document.querySelector(
                `tr[data-student-id="${studentToDelete}"]`
            );

        if (row) {
            row.remove();
        }

        delete students[studentToDelete];

        closeDeleteModal();

        refreshSearch();

    });


    /* =====================================================
       BÚSQUEDA
    ====================================================== */

    searchInput.addEventListener("input", function () {

        refreshSearch();

    });

    function normalizeText(text) {
        return String(text)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }


    function refreshSearch() {

    const search =
        normalizeText(searchInput.value);

    const rows =
        Array.from(
            tableBody.querySelectorAll("tr")
        );

    let visibleRows = 0;


    rows.forEach(function (row) {

        const content =
            normalizeText(row.textContent);

        const matches =
            content.includes(search);

        row.style.display =
            matches ? "" : "none";

        if (matches) {
            visibleRows++;
        }

    });


    emptyState.hidden =
        visibleRows !== 0;
}


    /* =====================================================
       UTILIDADES
    ====================================================== */

    function getInitials(fullName) {

        const parts =
            fullName
                .trim()
                .split(/\s+/)
                .filter(Boolean);

        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    }


    function escapeHtml(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       EVENTOS DE MODALES
    ====================================================== */

    newStudentButton.addEventListener(
        "click",
        openNewStudentModal
    );


    studentModalClose.addEventListener(
        "click",
        closeStudentModal
    );


    studentCancelButton.addEventListener(
        "click",
        closeStudentModal
    );


    deleteCancelButton.addEventListener(
        "click",
        closeDeleteModal
    );


    studentModal.addEventListener("click", function (event) {

        if (event.target === studentModal) {
            closeStudentModal();
        }

    });


    deleteModal.addEventListener("click", function (event) {

        if (event.target === deleteModal) {
            closeDeleteModal();
        }

    });


    /* =====================================================
       ESC PARA CERRAR
    ====================================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Escape") {
            return;
        }

        if (!studentModal.hidden) {
            closeStudentModal();
        }

        if (!deleteModal.hidden) {
            closeDeleteModal();
        }

    });

});