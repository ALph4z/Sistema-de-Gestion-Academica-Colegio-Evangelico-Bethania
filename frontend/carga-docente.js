/* =========================================================
   EDU BETHANIA - CARGA DOCENTE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CLAVES DE LOCAL STORAGE
       ===================================================== */

    const ASSIGNMENTS_KEY = "edubethania_teacher_assignments";

    const TEACHERS_KEY = "edubethania_teachers";

    const SUBJECTS_KEY = "edubethania_subjects";

    const LEVELS_KEY = "edubethania_academic_levels";

    const SCHOOL_PERIOD_KEY = "edubethania_active_school_period";


    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const assignmentsBody =
        document.getElementById("assignments-body");

    const emptyState =
        document.getElementById("empty-state");

    const openAssignmentModal =
        document.getElementById("open-assignment-modal");

    const assignmentModal =
        document.getElementById("assignment-modal");

    const closeAssignmentModal =
        document.getElementById("close-assignment-modal");

    const cancelAssignment =
        document.getElementById("cancel-assignment");

    const assignmentForm =
        document.getElementById("assignment-form");

    const assignmentFormMessage =
        document.getElementById("assignment-form-message");

    const teacherSelect =
        document.getElementById("teacher-select");

    const subjectSelect =
        document.getElementById("subject-select");

    const levelSelect =
        document.getElementById("level-select");

    const shiftSelect =
        document.getElementById("shift-select");

    const modalTitle =
        document.getElementById("modal-title");

    const activePeriodLabel =
        document.getElementById("active-period-label");

    const statusModal =
        document.getElementById("status-modal");

    const closeStatusModal =
        document.getElementById("close-status-modal");

    const cancelStatus =
        document.getElementById("cancel-status");

    const confirmStatus =
        document.getElementById("confirm-status");

    const statusModalTitle =
        document.getElementById("status-modal-title");

    const statusModalDescription =
        document.getElementById("status-modal-description");

    const statusConfirmationText =
        document.getElementById("status-confirmation-text");

    const pageMessage =
        document.getElementById("page-message");

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toast-title");

    const toastMessage =
        document.getElementById("toast-message");

    const schoolYear =
        document.getElementById("school-year");

    const currentDate =
        document.getElementById("current-date");

    const menuToggle =
        document.getElementById("menu-toggle");

    const sidebar =
        document.querySelector(".sidebar");

    const sidebarOverlay =
        document.getElementById("sidebar-overlay");


    /* =====================================================
       ESTADO
       ===================================================== */

    let editingAssignmentId = null;

    let pendingStatusAssignmentId = null;

    let pendingStatusValue = null;

    let toastTimer = null;


    /* =====================================================
       PERÍODO ESCOLAR
       ===================================================== */

    const DEFAULT_PERIOD = {
        id: "PERIOD-2026-2027",
        name: "2026–2027",
        startYear: 2026,
        endYear: 2027,
        active: true
    };


    function getActivePeriod() {

        try {

            const stored =
                JSON.parse(
                    localStorage.getItem(SCHOOL_PERIOD_KEY)
                );

            if (
                stored &&
                stored.active === true
            ) {
                return stored;
            }

        } catch (error) {

            console.error(
                "No se pudo leer el período escolar.",
                error
            );

        }

        /*
         * Si todavía no existe un período guardado,
         * se carga el período inicial del sistema.
         */
        localStorage.setItem(
            SCHOOL_PERIOD_KEY,
            JSON.stringify(DEFAULT_PERIOD)
        );

        return DEFAULT_PERIOD;
    }


    function updatePeriodUI() {

        const period = getActivePeriod();

        const periodText =
            `Año escolar ${period.name}`;

        schoolYear.textContent = periodText;

        activePeriodLabel.textContent =
            period.name;
    }


    /* =====================================================
       DOCENTES
       ===================================================== */

    function getTeachers() {

        try {

            const stored =
                JSON.parse(
                    localStorage.getItem(TEACHERS_KEY)
                );

            if (
                Array.isArray(stored) &&
                stored.length > 0
            ) {
                return stored;
            }

        } catch (error) {

            console.error(
                "No se pudieron leer los docentes.",
                error
            );

        }


        /*
         * Datos iniciales para que el módulo
         * pueda funcionar desde el primer uso.
         *
         * En producción estos datos pueden venir
         * del módulo de docentes.
         */
        const defaults = [
            {
                id: "TEACHER-001",
                name: "Laura Blanco",
                initials: "LB",
                active: true
            },
            {
                id: "TEACHER-002",
                name: "Carlos Valdez",
                initials: "CV",
                active: true
            },
            {
                id: "TEACHER-003",
                name: "Natalia Cruz",
                initials: "NC",
                active: true
            }
        ];

        localStorage.setItem(
            TEACHERS_KEY,
            JSON.stringify(defaults)
        );

        return defaults;
    }


    /* =====================================================
       MATERIAS
       ===================================================== */

    function getSubjects() {

        try {

            const stored =
                JSON.parse(
                    localStorage.getItem(SUBJECTS_KEY)
                );

            if (
                Array.isArray(stored) &&
                stored.length > 0
            ) {
                return stored;
            }

        } catch (error) {

            console.error(
                "No se pudieron leer las materias.",
                error
            );

        }


        /*
         * Catálogo inicial.
         *
         * La asignación siempre se hace
         * seleccionando una materia existente.
         */
        const defaults = [
            {
                id: "SUBJECT-001",
                name: "Lengua Española",
                active: true
            },
            {
                id: "SUBJECT-002",
                name: "Matemática",
                active: true
            },
            {
                id: "SUBJECT-003",
                name: "Ciencias Naturales",
                active: true
            },
            {
                id: "SUBJECT-004",
                name: "Ciencias Sociales",
                active: true
            },
            {
                id: "SUBJECT-005",
                name: "Inglés",
                active: true
            },
            {
                id: "SUBJECT-006",
                name: "Educación Física",
                active: true
            }
        ];

        localStorage.setItem(
            SUBJECTS_KEY,
            JSON.stringify(defaults)
        );

        return defaults;
    }


    /* =====================================================
       NIVELES / SECCIONES
       ===================================================== */

    function getLevels() {

        try {

            const stored =
                JSON.parse(
                    localStorage.getItem(LEVELS_KEY)
                );

            if (
                Array.isArray(stored) &&
                stored.length > 0
            ) {
                return stored;
            }

        } catch (error) {

            console.error(
                "No se pudieron leer los niveles.",
                error
            );

        }


        /*
         * Si el módulo Configuración académica
         * todavía no ha creado niveles, se utilizan
         * estos registros iniciales.
         */
        const period =
            getActivePeriod();


        const defaults = [
            {
                id: "LEVEL-001",
                courseName: "Inicial",
                academicLevel: "Inicial",
                section: "Pre-K",
                shift: "Matutina",
                periodId: period.id
            },
            {
                id: "LEVEL-002",
                courseName: "Inicial",
                academicLevel: "Inicial",
                section: "Kinder",
                shift: "Matutina",
                periodId: period.id
            },
            {
                id: "LEVEL-003",
                courseName: "4to de Primaria",
                academicLevel: "Primaria",
                section: "A",
                shift: "Matutina",
                periodId: period.id
            },
            {
                id: "LEVEL-004",
                courseName: "5to de Primaria",
                academicLevel: "Primaria",
                section: "B",
                shift: "Matutina",
                periodId: period.id
            },
            {
                id: "LEVEL-005",
                courseName: "1ro de Secundaria",
                academicLevel: "Secundaria",
                section: "A",
                shift: "Vespertina",
                periodId: period.id
            }
        ];

        localStorage.setItem(
            LEVELS_KEY,
            JSON.stringify(defaults)
        );

        return defaults;
    }


    function getLevelDisplayName(level) {

        if (!level) {
            return "";
        }


        if (
            level.academicLevel === "Inicial"
        ) {

            return `${level.courseName} - ${level.section}`;

        }


        return `${level.courseName} - ${level.section}`;
    }


    /* =====================================================
       ASIGNACIONES
       ===================================================== */

    function getAssignments() {

        try {

            const stored =
                JSON.parse(
                    localStorage.getItem(ASSIGNMENTS_KEY)
                );

            if (Array.isArray(stored)) {
                return stored;
            }

        } catch (error) {

            console.error(
                "No se pudieron leer las asignaciones.",
                error
            );

        }

        return [];
    }


    function saveAssignments(assignments) {

        localStorage.setItem(
            ASSIGNMENTS_KEY,
            JSON.stringify(assignments)
        );
    }


    /* =====================================================
       POBLAR SELECTS
       ===================================================== */

    function populateTeachers() {

        const teachers =
            getTeachers()
                .filter(teacher => {
                    return teacher.active !== false;
                });


        teacherSelect.innerHTML =
            `<option value="">
                Selecciona un docente
            </option>`;


        teachers.forEach(teacher => {

            const option =
                document.createElement("option");

            option.value = teacher.id;

            option.textContent = teacher.name;

            teacherSelect.appendChild(option);

        });

    }


    function populateSubjects() {

        const subjects =
            getSubjects()
                .filter(subject => {
                    return subject.active !== false;
                });


        subjectSelect.innerHTML =
            `<option value="">
                Selecciona una materia
            </option>`;


        subjects.forEach(subject => {

            const option =
                document.createElement("option");

            option.value = subject.id;

            option.textContent = subject.name;

            subjectSelect.appendChild(option);

        });

    }


    function populateLevels() {

        const period =
            getActivePeriod();


        const levels =
            getLevels()
                .filter(level => {

                    return (
                        level.periodId === period.id ||
                        !level.periodId
                    );

                });


        levelSelect.innerHTML =
            `<option value="">
                Selecciona un grado y sección
            </option>`;


        levels.forEach(level => {

            const option =
                document.createElement("option");

            option.value = level.id;

            option.textContent =
                getLevelDisplayName(level);

            levelSelect.appendChild(option);

        });

    }


    function populateFormSelects() {

        populateTeachers();

        populateSubjects();

        populateLevels();

    }


    /* =====================================================
       BUSCAR DATOS
       ===================================================== */

    function findTeacher(id) {

        return getTeachers()
            .find(teacher => {
                return teacher.id === id;
            });

    }


    function findSubject(id) {

        return getSubjects()
            .find(subject => {
                return subject.id === id;
            });

    }


    function findLevel(id) {

        return getLevels()
            .find(level => {
                return level.id === id;
            });

    }


    /* =====================================================
       VALIDACIÓN DE DUPLICADOS
       ===================================================== */

    function isDuplicateAssignment(
        teacherId,
        subjectId,
        levelId,
        currentId = null
    ) {

        const period =
            getActivePeriod();


        const assignments =
            getAssignments();


        return assignments.some(assignment => {

            if (
                currentId &&
                assignment.id === currentId
            ) {
                return false;
            }


            return (
                assignment.periodId === period.id &&
                assignment.teacherId === teacherId &&
                assignment.subjectId === subjectId &&
                assignment.levelId === levelId
            );

        });

    }


    /* =====================================================
       ABRIR MODAL
       ===================================================== */

    function openModal(assignment = null) {

        populateFormSelects();

        clearFormMessage();


        if (assignment) {

            editingAssignmentId =
                assignment.id;

            modalTitle.textContent =
                "Editar asignación";


            teacherSelect.value =
                assignment.teacherId;

            subjectSelect.value =
                assignment.subjectId;

            levelSelect.value =
                assignment.levelId;

            shiftSelect.value =
                assignment.shift;


        } else {

            editingAssignmentId = null;

            modalTitle.textContent =
                "Asignar docente";


            assignmentForm.reset();

        }


        updatePeriodUI();

        assignmentModal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeModal() {

        assignmentModal.classList.remove("active");

        document.body.style.overflow = "";

        editingAssignmentId = null;

        assignmentForm.reset();

        clearFormMessage();

    }


    /* =====================================================
       MENSAJES
       ===================================================== */

    function clearFormMessage() {

        assignmentFormMessage.textContent = "";

        assignmentFormMessage.className =
            "form-message";

    }


    function showFormError(message) {

        assignmentFormMessage.textContent =
            message;

        assignmentFormMessage.className =
            "form-message error";

    }


    function showPageMessage(
        message,
        type = "success"
    ) {

        pageMessage.textContent =
            message;

        pageMessage.className =
            `page-message ${type}`;


        setTimeout(() => {

            pageMessage.textContent = "";

            pageMessage.className =
                "page-message";

        }, 4000);

    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(
        message,
        title = "Listo"
    ) {

        clearTimeout(toastTimer);

        toastTitle.textContent =
            title;

        toastMessage.textContent =
            message;

        toast.classList.add("show");


        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

    }


    /* =====================================================
       GUARDAR ASIGNACIÓN
       ===================================================== */

    function handleAssignmentSubmit(event) {

        event.preventDefault();

        clearFormMessage();


        const period =
            getActivePeriod();


        if (!period) {

            showFormError(
                "No hay un período escolar activo."
            );

            return;
        }


        const teacherId =
            teacherSelect.value;

        const subjectId =
            subjectSelect.value;

        const levelId =
            levelSelect.value;

        const shift =
            shiftSelect.value;


        if (
            !teacherId ||
            !subjectId ||
            !levelId ||
            !shift
        ) {

            showFormError(
                "Completa todos los campos antes de guardar."
            );

            return;
        }


        /*
         * Verificar que los registros realmente
         * existan en sus respectivos catálogos.
         */
        const teacher =
            findTeacher(teacherId);

        const subject =
            findSubject(subjectId);

        const level =
            findLevel(levelId);


        if (!teacher) {

            showFormError(
                "El docente seleccionado no existe."
            );

            return;
        }


        if (!subject) {

            showFormError(
                "La materia seleccionada no existe."
            );

            return;
        }


        if (!level) {

            showFormError(
                "La sección seleccionada no existe."
            );

            return;
        }


        /*
         * Evitar duplicados.
         */
        if (
            isDuplicateAssignment(
                teacherId,
                subjectId,
                levelId,
                editingAssignmentId
            )
        ) {

            showFormError(
                "El docente ya estaba asignado a esa misma sección y materia."
            );

            return;
        }


        const assignments =
            getAssignments();


        if (editingAssignmentId) {

            const index =
                assignments.findIndex(
                    assignment => {
                        return assignment.id === editingAssignmentId;
                    }
                );


            if (index !== -1) {

                assignments[index] = {
                    ...assignments[index],

                    teacherId,

                    subjectId,

                    levelId,

                    shift,

                    periodId: period.id,

                    updatedAt:
                        new Date().toISOString()
                };

            }


            saveAssignments(assignments);

            closeModal();

            renderAssignments();

            showToast(
                "La asignación se actualizó correctamente.",
                "Asignación actualizada"
            );

            return;
        }


        /*
         * Nueva asignación.
         */
        const newAssignment = {

            id:
                `ASSIGN-${Date.now()}`,

            teacherId,

            subjectId,

            levelId,

            shift,

            periodId: period.id,

            status: "Vigente",

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString()

        };


        assignments.push(
            newAssignment
        );


        saveAssignments(assignments);

        closeModal();

        renderAssignments();


        /*
         * MENSAJE REQUERIDO
         */
        showToast(
            "La asignación se hizo bien.",
            "Asignación registrada"
        );

        showPageMessage(
            "La asignación se hizo bien.",
            "success"
        );

    }


    /* =====================================================
       RENDERIZAR TABLA
       ===================================================== */

    function renderAssignments() {

        const period =
            getActivePeriod();


        const assignments =
            getAssignments()
                .filter(assignment => {

                    return (
                        assignment.periodId === period.id
                    );

                });


        assignmentsBody.innerHTML = "";


        if (assignments.length === 0) {

            emptyState.classList.add("visible");

            return;

        }


        emptyState.classList.remove("visible");


        assignments.forEach(assignment => {

            const teacher =
                findTeacher(
                    assignment.teacherId
                );

            const subject =
                findSubject(
                    assignment.subjectId
                );

            const level =
                findLevel(
                    assignment.levelId
                );


            /*
             * Si alguno de los registros asociados
             * ya no existe, no se muestra como
             * una asignación válida.
             */
            if (
                !teacher ||
                !subject ||
                !level
            ) {
                return;
            }


            const row =
                document.createElement("tr");


            const initials =
                teacher.initials ||
                getInitials(teacher.name);


            const status =
                assignment.status === "Vigente"
                    ? "Vigente"
                    : "No vigente";


            const badgeClass =
                status === "Vigente"
                    ? "badge-success"
                    : "badge-warning";


            const actionText =
                status === "Vigente"
                    ? "Desactivar"
                    : "Activar";


            row.innerHTML = `

                <td>

                    <div class="teacher-info">

                        <div class="teacher-avatar">
                            ${escapeHTML(initials)}
                        </div>

                        <span class="teacher-name">
                            ${escapeHTML(teacher.name)}
                        </span>

                    </div>

                </td>


                <td>
                    ${escapeHTML(subject.name)}
                </td>


                <td>
                    ${escapeHTML(
                        getLevelDisplayName(level)
                    )}
                </td>


                <td>
                    ${escapeHTML(assignment.shift)}
                </td>


                <td>

                    <span class="badge ${badgeClass}">
                        ${status}
                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        <button
                            type="button"
                            class="btn-table"
                            data-action="edit"
                            data-id="${assignment.id}">
                            Editar
                        </button>

                        <button
                            type="button"
                            class="btn-table"
                            data-action="status"
                            data-id="${assignment.id}">
                            ${actionText}
                        </button>

                    </div>

                </td>
            `;


            assignmentsBody.appendChild(row);

        });


        /*
         * Volver a activar iconos por si fueron
         * agregados dinámicamente.
         */
        if (window.lucide) {
            lucide.createIcons();
        }

    }


    /* =====================================================
       EDITAR
       ===================================================== */

    function editAssignment(id) {

        const assignment =
            getAssignments()
                .find(item => {
                    return item.id === id;
                });


        if (!assignment) {
            return;
        }


        openModal(assignment);

    }


    /* =====================================================
       DESACTIVAR / ACTIVAR
       ===================================================== */

    function openStatusConfirmation(id) {

        const assignment =
            getAssignments()
                .find(item => {
                    return item.id === id;
                });


        if (!assignment) {
            return;
        }


        pendingStatusAssignmentId =
            id;


        const willActivate =
            assignment.status !== "Vigente";


        pendingStatusValue =
            willActivate
                ? "Vigente"
                : "No vigente";


        if (willActivate) {

            statusModalTitle.textContent =
                "Activar asignación";

            statusModalDescription.textContent =
                "La asignación volverá a estar vigente.";

            statusConfirmationText.textContent =
                "¿Deseas activar nuevamente esta asignación?";

            confirmStatus.textContent =
                "Activar";

        } else {

            statusModalTitle.textContent =
                "Desactivar asignación";

            statusModalDescription.textContent =
                "La asignación permanecerá registrada.";

            statusConfirmationText.textContent =
                "¿Deseas desactivar esta asignación?";

            confirmStatus.textContent =
                "Desactivar";

        }


        statusModal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeStatusConfirmation() {

        statusModal.classList.remove("active");

        document.body.style.overflow = "";

        pendingStatusAssignmentId = null;

        pendingStatusValue = null;

    }


    function confirmStatusChange() {

        if (!pendingStatusAssignmentId) {
            return;
        }


        const assignments =
            getAssignments();


        const index =
            assignments.findIndex(
                assignment => {
                    return (
                        assignment.id ===
                        pendingStatusAssignmentId
                    );
                }
            );


        if (index === -1) {

            closeStatusConfirmation();

            return;
        }


        assignments[index].status =
            pendingStatusValue;


        assignments[index].updatedAt =
            new Date().toISOString();


        saveAssignments(assignments);

        renderAssignments();


        const activated =
            pendingStatusValue === "Vigente";


        closeStatusConfirmation();


        showToast(
            activated
                ? "La asignación fue activada."
                : "La asignación fue desactivada.",
            activated
                ? "Asignación activada"
                : "Asignación desactivada"
        );

    }


    /* =====================================================
       UTILIDADES
       ===================================================== */

    function getInitials(name) {

        if (!name) {
            return "??";
        }


        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => {
                return word.charAt(0).toUpperCase();
            })
            .join("");

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       FECHA
       ===================================================== */

    function updateDate() {

        const now =
            new Date();


        try {

            currentDate.textContent =
                now.toLocaleDateString(
                    "es-DO",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        } catch (error) {

            currentDate.textContent =
                now.toLocaleDateString();

        }

    }


    /* =====================================================
       MENÚ MÓVIL
       ===================================================== */

    function openSidebar() {

        sidebar.classList.add("open");

        sidebarOverlay.classList.add("active");

    }


    function closeSidebar() {

        sidebar.classList.remove("open");

        sidebarOverlay.classList.remove("active");

    }


    /* =====================================================
       EVENTOS
       ===================================================== */

    openAssignmentModal.addEventListener(
        "click",
        () => {
            openModal();
        }
    );


    closeAssignmentModal.addEventListener(
        "click",
        closeModal
    );


    cancelAssignment.addEventListener(
        "click",
        closeModal
    );


    assignmentForm.addEventListener(
        "submit",
        handleAssignmentSubmit
    );


    assignmentsBody.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest("button");

            if (!button) {
                return;
            }


            const id =
                button.dataset.id;

            const action =
                button.dataset.action;


            if (
                action === "edit"
            ) {

                editAssignment(id);

            }


            if (
                action === "status"
            ) {

                openStatusConfirmation(id);

            }

        }
    );


    closeStatusModal.addEventListener(
        "click",
        closeStatusConfirmation
    );


    cancelStatus.addEventListener(
        "click",
        closeStatusConfirmation
    );


    confirmStatus.addEventListener(
        "click",
        confirmStatusChange
    );


    assignmentModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                assignmentModal
            ) {
                closeModal();
            }

        }
    );


    statusModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                statusModal
            ) {
                closeStatusConfirmation();
            }

        }
    );


    menuToggle.addEventListener(
        "click",
        openSidebar
    );


    sidebarOverlay.addEventListener(
        "click",
        closeSidebar
    );


    /* =====================================================
       ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                assignmentModal.classList.contains("active")
            ) {
                closeModal();
            }


            if (
                statusModal.classList.contains("active")
            ) {
                closeStatusConfirmation();
            }


            closeSidebar();

        }
    );


    /* =====================================================
       INICIALIZACIÓN
       ===================================================== */

    updatePeriodUI();

    updateDate();

    populateFormSelects();

    renderAssignments();

    lucide.createIcons();

});