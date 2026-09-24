document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       CONFIGURACIÓN
    ========================================================= */

    const mandatoryDocuments = [
        "Acta de nacimiento",
        "Cédula del tutor",
        "Foto 2x2"
    ];

    const allDocuments = [
        "Acta de nacimiento",
        "Cédula del tutor",
        "Foto 2x2",
        "Carta de buena conducta",
        "Certificado médico"
    ];


    /* =========================================================
       ESTUDIANTES REGISTRADOS
    ========================================================= */

    const students = [
        {
            id: "student-1",
            name: "Sofía Martínez"
        },
        {
            id: "student-2",
            name: "Luis Manuel Reyes"
        },
        {
            id: "student-3",
            name: "Camila Núñez"
        },
        {
            id: "student-4",
            name: "José Alejandro Díaz"
        }
    ];


    /* =========================================================
       MATRÍCULAS DE DEMOSTRACIÓN
    ========================================================= */

    let enrollments = [

        {
            id: "MAT-001",

            studentId: "student-4",

            studentName: "José Alejandro Díaz",

            section: "5to B",

            type: "Nueva",

            status: "Pendiente",

            createdAt: "2026-09-20",

            confirmedAt: null,

            documents: createDocuments({})
        },


        {
            id: "MAT-002",

            studentId: "student-3",

            studentName: "Camila Núñez",

            section: "5to B",

            type: "Reinscripción",

            status: "Confirmada",

            createdAt: "2026-09-18",

            confirmedAt: "2026-09-19",

            documents: createDocuments({

                "Acta de nacimiento": {
                    delivered: true,
                    deliveredAt: "2026-09-18"
                },

                "Cédula del tutor": {
                    delivered: true,
                    deliveredAt: "2026-09-18"
                },

                "Foto 2x2": {
                    delivered: true,
                    deliveredAt: "2026-09-18"
                },

                "Carta de buena conducta": {
                    delivered: true,
                    deliveredAt: "2026-09-19"
                },

                "Certificado médico": {
                    delivered: true,
                    deliveredAt: "2026-09-19"
                }
            })
        },


        {
            id: "MAT-003",

            studentId: "student-2",

            studentName: "Luis Manuel Reyes",

            section: "4to A",

            type: "Nueva",

            status: "Pendiente",

            createdAt: "2026-09-21",

            confirmedAt: null,

            documents: createDocuments({})
        },


        {
            id: "MAT-004",

            studentId: "student-1",

            studentName: "Sofía Martínez",

            section: "4to A",

            type: "Reinscripción",

            status: "Confirmada",

            createdAt: "2026-09-17",

            confirmedAt: "2026-09-18",

            documents: createDocuments({

                "Acta de nacimiento": {
                    delivered: true,
                    deliveredAt: "2026-09-17"
                },

                "Cédula del tutor": {
                    delivered: true,
                    deliveredAt: "2026-09-17"
                },

                "Foto 2x2": {
                    delivered: true,
                    deliveredAt: "2026-09-18"
                },

                "Carta de buena conducta": {
                    delivered: true,
                    deliveredAt: "2026-09-18"
                },

                "Certificado médico": {
                    delivered: false,
                    deliveredAt: null
                }
            })
        }

    ];


    /* =========================================================
       ELEMENTOS
    ========================================================= */

    const newEnrollmentButton =
        document.getElementById("new-enrollment-btn");

    const enrollmentModal =
        document.getElementById("enrollment-modal");

    const closeEnrollmentModal =
        document.getElementById("close-enrollment-modal");

    const cancelEnrollment =
        document.getElementById("cancel-enrollment");

    const enrollmentForm =
        document.getElementById("enrollment-form");

    const studentSelect =
        document.getElementById("student-select");

    const sectionSelect =
        document.getElementById("section-select");

    const formMessage =
        document.getElementById("form-message");

    const enrollmentTableBody =
        document.getElementById("enrollment-table-body");

    const emptyEnrollments =
        document.getElementById("empty-enrollments");

    const checklistCard =
        document.getElementById("checklist-card") ||
        document.querySelector(".checklist-card");

    const selectedStudentName =
        document.getElementById("selected-student-name");

    const documentsCounter =
        document.getElementById("documents-counter");

    const saveDocumentsButton =
        document.getElementById("save-documents-btn");

    const confirmationDate =
        document.getElementById("confirmation-date");

    const toast =
        document.getElementById("toast");


    /* =========================================================
       ESTADO
    ========================================================= */

    let selectedEnrollmentId = null;

    let toastTimeout = null;


    /* =========================================================
       CHECKBOXES
    ========================================================= */

    const documentCheckboxes =
        document.querySelectorAll(
            '.document-item input[type="checkbox"]'
        );


    /* =========================================================
       INICIALIZACIÓN
    ========================================================= */

    enrollments.forEach(function (enrollment) {

        enrollment.documents =
            createDocuments(enrollment.documents);

        /*
         * Una matrícula confirmada siempre debe tener
         * los 3 documentos obligatorios entregados.
         */
        if (enrollment.status === "Confirmada") {

            const confirmationDay =
                enrollment.confirmedAt ||
                enrollment.createdAt ||
                getTodayISO();

            mandatoryDocuments.forEach(function (documentName) {

                if (
                    !enrollment.documents[documentName] ||
                    !enrollment.documents[documentName].delivered
                ) {

                    enrollment.documents[documentName] = {
                        delivered: true,
                        deliveredAt: confirmationDay
                    };
                }
            });
        }
    });


    /*
     * El checklist permanece oculto hasta presionar "Ver".
     */
    hideChecklist();


    populateStudents();

    renderEnrollments();

    bindEvents();


    /* =========================================================
       CREAR ESTRUCTURA DE DOCUMENTOS
    ========================================================= */

    function createDocuments(existingDocuments) {

        const documents = {};

        allDocuments.forEach(function (documentName) {

            let existing = null;

            if (
                existingDocuments &&
                !Array.isArray(existingDocuments)
            ) {
                existing =
                    existingDocuments[documentName];
            }


            /*
             * Estructura nueva.
             */
            if (
                existing &&
                typeof existing === "object"
            ) {

                documents[documentName] = {

                    delivered:
                        Boolean(existing.delivered),

                    deliveredAt:
                        existing.deliveredAt || null
                };

                return;
            }


            /*
             * Compatibilidad con array.
             */
            if (Array.isArray(existingDocuments)) {

                const delivered =
                    existingDocuments.includes(
                        documentName
                    );

                documents[documentName] = {

                    delivered: delivered,

                    deliveredAt:
                        delivered
                            ? getTodayISO()
                            : null
                };

                return;
            }


            /*
             * Documento nuevo.
             */
            documents[documentName] = {

                delivered: false,

                deliveredAt: null
            };
        });


        return documents;
    }


    /* =========================================================
       ESTUDIANTES
    ========================================================= */

    function populateStudents() {

        if (!studentSelect) {
            return;
        }

        studentSelect.innerHTML =
            '<option value="">Seleccionar estudiante</option>';


        students.forEach(function (student) {

            const option =
                document.createElement("option");

            option.value =
                student.id;

            option.textContent =
                student.name;

            studentSelect.appendChild(
                option
            );
        });
    }


    /* =========================================================
       SECCIONES
    ========================================================= */

    function populateSections() {

        if (!sectionSelect) {
            return;
        }

        sectionSelect.innerHTML = `
            <option value="">Seleccionar sección</option>
            <option value="4to A">4to A</option>
            <option value="5to B">5to B</option>
            <option value="1ro A">1ro A</option>
        `;
    }


    /* =========================================================
       RENDER MATRÍCULAS
    ========================================================= */

    function renderEnrollments() {

        if (!enrollmentTableBody) {
            return;
        }

        enrollmentTableBody.innerHTML = "";


        if (enrollments.length === 0) {

            if (emptyEnrollments) {
                emptyEnrollments.hidden = false;
            }

            return;
        }


        if (emptyEnrollments) {
            emptyEnrollments.hidden = true;
        }


        enrollments.forEach(function (enrollment) {

            const row =
                document.createElement("tr");


            if (
                enrollment.id ===
                selectedEnrollmentId
            ) {
                row.classList.add(
                    "selected-student"
                );
            }


            /* ESTUDIANTE */
            const studentCell =
                document.createElement("td");

            studentCell.textContent =
                enrollment.studentName;


            /* SECCIÓN */
            const sectionCell =
                document.createElement("td");

            sectionCell.textContent =
                enrollment.section;


            /* TIPO */
            const typeCell =
                document.createElement("td");

            typeCell.textContent =
                enrollment.type;


            /* ESTADO */
            const statusCell =
                document.createElement("td");

            const statusBadge =
                document.createElement("span");

            statusBadge.className =
                enrollment.status === "Confirmada"
                    ? "status-badge success"
                    : "status-badge warning";

            statusBadge.textContent =
                enrollment.status;

            statusCell.appendChild(
                statusBadge
            );


            /* ACCIÓN */
            const actionCell =
                document.createElement("td");

            const viewButton =
                document.createElement("button");

            viewButton.type =
                "button";

            viewButton.className =
                "btn-table";

            viewButton.textContent =
                "Ver";


            viewButton.addEventListener(
                "click",
                function () {

                    selectEnrollment(
                        enrollment.id
                    );
                }
            );


            actionCell.appendChild(
                viewButton
            );


            row.appendChild(
                studentCell
            );

            row.appendChild(
                sectionCell
            );

            row.appendChild(
                typeCell
            );

            row.appendChild(
                statusCell
            );

            row.appendChild(
                actionCell
            );


            enrollmentTableBody.appendChild(
                row
            );
        });
    }


    /* =========================================================
       VER MATRÍCULA
    ========================================================= */

    function selectEnrollment(
        enrollmentId
    ) {

        const enrollment =
            enrollments.find(
                function (item) {
                    return item.id === enrollmentId;
                }
            );


        if (!enrollment) {
            return;
        }


        selectedEnrollmentId =
            enrollment.id;


        enrollment.documents =
            createDocuments(
                enrollment.documents
            );


        /*
         * Mostrar checklist.
         */
        showChecklist();


        /*
         * Nombre.
         */
        if (selectedStudentName) {

            selectedStudentName.textContent =
                enrollment.studentName +
                " · " +
                enrollment.section +
                " · " +
                enrollment.type;
        }


        /*
         * Fecha de confirmación.
         */
        if (confirmationDate) {

            if (enrollment.status === "Confirmada") {

                confirmationDate.textContent =
                    "Matrícula confirmada el " +
                    formatDate(
                        enrollment.confirmedAt
                    );

            } else {

                confirmationDate.textContent =
                    "Matrícula pendiente de confirmación";
            }
        }


        /*
         * Cargar documentos en los checks.
         *
         * IMPORTANTE:
         * esto NO guarda nada.
         *
         * Solamente muestra lo que ya está guardado.
         */
        documentCheckboxes.forEach(
            function (checkbox) {

                const documentName =
                    checkbox.dataset.document;

                const documentData =
                    enrollment.documents[
                        documentName
                    ];


                checkbox.checked =
                    Boolean(
                        documentData &&
                        documentData.delivered
                    );


                /*
                 * Si la matrícula está confirmada,
                 * los 3 obligatorios no se pueden quitar.
                 *
                 * Los otros 2 siguen editables.
                 */
                const isMandatory =
                    mandatoryDocuments.includes(
                        documentName
                    );


                checkbox.disabled =
                    enrollment.status === "Confirmada" &&
                    isMandatory;
            }
        );


        updateDocumentDates(
            enrollment
        );


        updateChecklist();


        renderEnrollments();


        /*
         * Llevar visualmente al checklist.
         */
        if (checklistCard) {

            setTimeout(
                function () {

                    checklistCard.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                50
            );
        }
    }


    /* =========================================================
       ACTUALIZAR FECHAS DE DOCUMENTOS
    ========================================================= */

    function updateDocumentDates(
        enrollment
    ) {

        const dateElements =
            document.querySelectorAll(
                "[data-date-for]"
            );


        dateElements.forEach(
            function (element) {

                const documentName =
                    element.dataset.dateFor;

                const documentData =
                    enrollment.documents[
                        documentName
                    ];


                if (
                    documentData &&
                    documentData.delivered &&
                    documentData.deliveredAt
                ) {

                    element.textContent =
                        "Entregado el " +
                        formatDate(
                            documentData.deliveredAt
                        );

                } else {

                    element.textContent =
                        "";
                }
            }
        );
    }


    /* =========================================================
       ACTUALIZAR CONTADOR
    ========================================================= */

    function updateChecklist() {

        const enrollment =
            getSelectedEnrollment();


        if (!enrollment) {
            return;
        }


        let deliveredCount = 0;


        allDocuments.forEach(
            function (documentName) {

                if (
                    enrollment.documents[
                        documentName
                    ] &&
                    enrollment.documents[
                        documentName
                    ].delivered === true
                ) {

                    deliveredCount++;
                }
            }
        );


        if (documentsCounter) {

            documentsCounter.textContent =
                deliveredCount +
                " de " +
                allDocuments.length +
                " documentos recibidos";
        }


        /*
         * El botón SIEMPRE se llama
         * "Guardar documentos".
         *
         * El check por sí solo nunca guarda.
         */
        if (saveDocumentsButton) {

            saveDocumentsButton.disabled =
                enrollment.status === "Confirmada" &&
                !hasUnsavedChanges();
        }
    }


    /* =========================================================
       CAMBIOS PENDIENTES
    ========================================================= */

    let pendingDocumentChanges = {};


    function handleDocumentChange(
        checkbox
    ) {

        const enrollment =
            getSelectedEnrollment();


        if (!enrollment) {

            checkbox.checked =
                !checkbox.checked;

            showToast(
                "Selecciona una matrícula primero."
            );

            return;
        }


        const documentName =
            checkbox.dataset.document;


        /*
         * Si es un documento obligatorio de una matrícula
         * confirmada, no permitimos quitarlo.
         */
        if (
            enrollment.status === "Confirmada" &&
            mandatoryDocuments.includes(
                documentName
            ) &&
            !checkbox.checked
        ) {

            checkbox.checked = true;

            showToast(
                "Los documentos obligatorios de una matrícula confirmada no pueden retirarse."
            );

            return;
        }


        /*
         * IMPORTANTE:
         *
         * No modificamos enrollment.documents aquí.
         *
         * Solamente guardamos el cambio temporalmente.
         */
        pendingDocumentChanges[
            documentName
        ] = checkbox.checked;


        updateSaveButton();

    }


    function hasUnsavedChanges() {

        return Object.keys(
            pendingDocumentChanges
        ).length > 0;
    }


    function updateSaveButton() {

        if (!saveDocumentsButton) {
            return;
        }


        if (hasUnsavedChanges()) {

            saveDocumentsButton.disabled =
                false;

            saveDocumentsButton.innerHTML = `
                <i data-lucide="save"></i>
                <span>Guardar documentos</span>
            `;

            if (
                window.lucide &&
                typeof lucide.createIcons === "function"
            ) {
                lucide.createIcons();
            }

            return;
        }


        /*
         * Si no hay cambios, solamente deshabilitamos
         * cuando la matrícula está confirmada.
         */
        const enrollment =
            getSelectedEnrollment();


        if (
            enrollment &&
            enrollment.status === "Confirmada"
        ) {

            saveDocumentsButton.disabled =
                true;
        } else {

            saveDocumentsButton.disabled =
                false;
        }
    }


    /* =========================================================
       GUARDAR DOCUMENTOS
    ========================================================= */

    function saveDocuments() {

        const enrollment =
            getSelectedEnrollment();


        if (!enrollment) {

            showToast(
                "Selecciona una matrícula primero."
            );

            return;
        }


        if (!hasUnsavedChanges()) {

            showToast(
                "No hay cambios de documentos para guardar."
            );

            return;
        }


        /*
         * Fecha en que se realiza el registro.
         */
        const today =
            getTodayISO();


        /*
         * Aplicamos cada cambio de forma independiente.
         */
        Object.keys(
            pendingDocumentChanges
        ).forEach(
            function (documentName) {

                const delivered =
                    pendingDocumentChanges[
                        documentName
                    ];


                if (
                    !enrollment.documents[
                        documentName
                    ]
                ) {

                    enrollment.documents[
                        documentName
                    ] = {

                        delivered: false,

                        deliveredAt: null
                    };
                }


                /*
                 * Guardar estado.
                 */
                enrollment.documents[
                    documentName
                ].delivered =
                    delivered;


                /*
                 * Guardar fecha independiente.
                 */
                if (delivered) {

                    enrollment.documents[
                        documentName
                    ].deliveredAt =
                        today;

                } else {

                    enrollment.documents[
                        documentName
                    ].deliveredAt =
                        null;
                }
            }
        );


        /*
         * Limpiamos cambios pendientes.
         */
        pendingDocumentChanges = {};


        /*
         * Revisamos los 3 documentos obligatorios.
         */
        const mandatoryComplete =
            areMandatoryDocumentsComplete(
                enrollment
            );


        /*
         * Si estaban pendientes y ya están
         * los 3 obligatorios:
         *
         * Pendiente -> Confirmada
         */
        if (
            enrollment.status === "Pendiente" &&
            mandatoryComplete
        ) {

            enrollment.status =
                "Confirmada";

            enrollment.confirmedAt =
                today;


            /*
             * Aseguramos fecha para los obligatorios.
             */
            mandatoryDocuments.forEach(
                function (documentName) {

                    const documentData =
                        enrollment.documents[
                            documentName
                        ];


                    if (
                        documentData.delivered &&
                        !documentData.deliveredAt
                    ) {

                        documentData.deliveredAt =
                            today;
                    }
                }
            );
        }


        /*
         * IMPORTANTE:
         *
         * Si ya estaba Confirmada,
         * guardar un documento adicional NO cambia
         * el estado.
         */


        /*
         * Actualizar interfaz.
         */
        renderEnrollments();


        selectEnrollment(
            enrollment.id
        );


        showToast(
            enrollment.status === "Confirmada"
                ? "Documentos guardados. Matrícula confirmada."
                : "Documentos guardados correctamente."
        );
    }


    /* =========================================================
       VALIDAR DOCUMENTOS OBLIGATORIOS
    ========================================================= */

    function areMandatoryDocumentsComplete(
        enrollment
    ) {

        return mandatoryDocuments.every(
            function (documentName) {

                return (
                    enrollment.documents[
                        documentName
                    ] &&
                    enrollment.documents[
                        documentName
                    ].delivered === true
                );
            }
        );
    }


    /* =========================================================
       NUEVA MATRÍCULA
    ========================================================= */

    function openEnrollmentModal() {

        if (!enrollmentModal) {
            return;
        }


        clearFormMessage();


        if (enrollmentForm) {
            enrollmentForm.reset();
        }


        populateStudents();


        if (sectionSelect) {

            sectionSelect.innerHTML =
                '<option value="">Seleccionar sección</option>';
        }


        enrollmentModal.classList.add(
            "show"
        );


        enrollmentModal.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    function closeModal() {

        if (!enrollmentModal) {
            return;
        }


        enrollmentModal.classList.remove(
            "show"
        );


        enrollmentModal.setAttribute(
            "aria-hidden",
            "true"
        );


        clearFormMessage();
    }


    function saveNewEnrollment() {

        clearFormMessage();


        const studentId =
            studentSelect
                ? studentSelect.value
                : "";


        const section =
            sectionSelect
                ? sectionSelect.value
                : "";


        const typeInput =
            document.querySelector(
                'input[name="enrollment-type"]:checked'
            );


        const type =
            typeInput
                ? typeInput.value
                : "";


        if (!studentId) {

            showEnrollmentError(
                "Debes seleccionar un estudiante."
            );

            return;
        }


        if (!section) {

            showEnrollmentError(
                "Debes seleccionar una sección."
            );

            return;
        }


        if (!type) {

            showEnrollmentError(
                "Debes seleccionar el tipo de matrícula."
            );

            return;
        }


        const student =
            students.find(
                function (item) {
                    return item.id === studentId;
                }
            );


        if (!student) {

            showEnrollmentError(
                "El estudiante seleccionado no está registrado."
            );

            return;
        }


        /*
         * Evitar matrícula activa duplicada.
         */
        const duplicate =
            enrollments.some(
                function (enrollment) {

                    const sameStudent =
                        enrollment.studentId ===
                        studentId;


                    const sameSection =
                        normalizeText(
                            enrollment.section
                        ) ===
                        normalizeText(
                            section
                        );


                    const active =
                        enrollment.status ===
                            "Pendiente" ||
                        enrollment.status ===
                            "Confirmada";


                    return (
                        sameStudent &&
                        sameSection &&
                        active
                    );
                }
            );


        if (duplicate) {

            showEnrollmentError(
                "Este estudiante ya tiene una matrícula activa en esa sección."
            );

            return;
        }


        /*
         * Crear matrícula.
         *
         * SIEMPRE inicia Pendiente.
         */
        const newEnrollment = {

            id:
                generateEnrollmentId(),

            studentId:
                student.id,

            studentName:
                student.name,

            section:
                section,

            type:
                type,

            status:
                "Pendiente",

            createdAt:
                getTodayISO(),

            confirmedAt:
                null,

            documents:
                createDocuments({})
        };


        enrollments.push(
            newEnrollment
        );


        renderEnrollments();


        closeModal();


        /*
         * Mostrar inmediatamente el expediente
         * de la matrícula creada.
         */
        selectEnrollment(
            newEnrollment.id
        );


        showToast(
            "Matrícula creada. Está pendiente de documentos obligatorios."
        );
    }


    /* =========================================================
       EVENTOS
    ========================================================= */

    function bindEvents() {

        /*
         * Nueva matrícula.
         */
        if (newEnrollmentButton) {

            newEnrollmentButton.addEventListener(
                "click",
                openEnrollmentModal
            );
        }


        /*
         * Cerrar modal.
         */
        if (closeEnrollmentModal) {

            closeEnrollmentModal.addEventListener(
                "click",
                closeModal
            );
        }


        /*
         * Cancelar.
         */
        if (cancelEnrollment) {

            cancelEnrollment.addEventListener(
                "click",
                closeModal
            );
        }


        /*
         * Cerrar al hacer clic fuera.
         */
        if (enrollmentModal) {

            enrollmentModal.addEventListener(
                "click",
                function (event) {

                    if (
                        event.target ===
                        enrollmentModal
                    ) {

                        closeModal();
                    }
                }
            );
        }


        /*
         * ESC.
         */
        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    enrollmentModal &&
                    enrollmentModal.classList.contains("show")
                ) {

                    closeModal();
                }
            }
        );


        /*
         * Cuando seleccionamos estudiante,
         * cargamos las secciones.
         */
        if (studentSelect) {

            studentSelect.addEventListener(
                "change",
                function () {

                    populateSections();
                }
            );
        }


        /*
         * Formulario de nueva matrícula.
         */
        if (enrollmentForm) {

            enrollmentForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    saveNewEnrollment();
                }
            );
        }


        /*
         * Checkboxes.
         *
         * IMPORTANTE:
         * solamente preparan cambios.
         *
         * NO guardan.
         */
        documentCheckboxes.forEach(
            function (checkbox) {

                checkbox.addEventListener(
                    "change",
                    function () {

                        handleDocumentChange(
                            checkbox
                        );
                    }
                );
            }
        );


        /*
         * BOTÓN REAL DE GUARDAR.
         */
        if (saveDocumentsButton) {

            saveDocumentsButton.addEventListener(
                "click",
                saveDocuments
            );
        }
    }


    /* =========================================================
       VISIBILIDAD CHECKLIST
    ========================================================= */

    function hideChecklist() {

        if (!checklistCard) {
            return;
        }

        checklistCard.hidden =
            true;
    }


    function showChecklist() {

        if (!checklistCard) {
            return;
        }

        checklistCard.hidden =
            false;
    }


    /* =========================================================
       MATRÍCULA SELECCIONADA
    ========================================================= */

    function getSelectedEnrollment() {

        if (!selectedEnrollmentId) {
            return null;
        }


        return enrollments.find(
            function (enrollment) {

                return (
                    enrollment.id ===
                    selectedEnrollmentId
                );
            }
        ) || null;
    }


    /* =========================================================
       MENSAJES DEL FORMULARIO
    ========================================================= */

    function showEnrollmentError(
        message
    ) {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            message;


        formMessage.classList.add(
            "show"
        );
    }


    function clearFormMessage() {

        if (!formMessage) {
            return;
        }


        formMessage.textContent =
            "";


        formMessage.classList.remove(
            "show"
        );
    }


    /* =========================================================
       TOAST
    ========================================================= */

    function showToast(
        message
    ) {

        if (!toast) {
            return;
        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        if (toastTimeout) {

            clearTimeout(
                toastTimeout
            );
        }


        toastTimeout =
            setTimeout(
                function () {

                    toast.classList.remove(
                        "show"
                    );

                },
                3500
            );
    }


    /* =========================================================
       UTILIDADES
    ========================================================= */

    function getTodayISO() {

        const now =
            new Date();


        const year =
            now.getFullYear();


        const month =
            String(
                now.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                now.getDate()
            ).padStart(
                2,
                "0"
            );


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );
    }


    function formatDate(
        dateString
    ) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(
                dateString +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return dateString;
        }


        return date.toLocaleDateString(
            "es-DO",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
    }


    function generateEnrollmentId() {

        const number =
            enrollments.length + 1;


        return (
            "MAT-" +
            String(
                number
            ).padStart(
                3,
                "0"
            ) +
            "-" +
            Date.now()
                .toString()
                .slice(-4)
        );
    }


    function normalizeText(
        text
    ) {

        return String(text)
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            )
            .toLowerCase()
            .trim();
    }

});