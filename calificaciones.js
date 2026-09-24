/* =========================================================
   EDU BETHANIA
   CALIFICACIONES
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CLAVES
       ===================================================== */

    const GRADES_KEY =
        "edubethania_grades";

    const ENROLLMENTS_KEY =
        "edubethania_enrollments";

    const STUDENTS_KEY =
        "edubethania_students";

    const SCHOOL_PERIOD_KEY =
        "edubethania_active_school_period";


    /* =====================================================
       CONFIGURACIÓN ACADÉMICA
       ===================================================== */

    const MIN_GRADE = 0;

    const MAX_GRADE = 20;

    const PASSING_GRADE = 10;


    const DEFAULT_PERIOD = {
        id: "PERIOD-2026-2027",
        name: "2026–2027",
        startYear: 2026,
        endYear: 2027,
        active: true
    };


    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const gradesBody =
        document.getElementById("grades-body");

    const emptyState =
        document.getElementById("empty-state");

    const openGradeModal =
        document.getElementById("open-grade-modal");

    const gradeModal =
        document.getElementById("grade-modal");

    const closeGradeModal =
        document.getElementById("close-grade-modal");

    const cancelGrade =
        document.getElementById("cancel-grade");

    const gradeForm =
        document.getElementById("grade-form");

    const gradeStudent =
        document.getElementById("grade-student");

    const gradeTerm =
        document.getElementById("grade-term");

    const gradeValue =
        document.getElementById("grade-value");

    const gradeFormMessage =
        document.getElementById("grade-form-message");

    const pageMessage =
        document.getElementById("page-message");

    const activePeriodLabel =
        document.getElementById("active-period-label");

    const schoolYear =
        document.getElementById("school-year");

    const currentDate =
        document.getElementById("current-date");

    const toast =
        document.getElementById("toast");

    const toastTitle =
        document.getElementById("toast-title");

    const toastMessage =
        document.getElementById("toast-message");

    const menuToggle =
        document.getElementById("menu-toggle");

    const sidebar =
        document.querySelector(".sidebar");

    const sidebarOverlay =
        document.getElementById("sidebar-overlay");


    /* =====================================================
       ESTADO
       ===================================================== */

    let editingStudentId = null;

    let toastTimer = null;


    /* =====================================================
       STORAGE
       ===================================================== */

    function readStorage(key, fallback = null) {

        try {

            const value =
                localStorage.getItem(key);

            if (!value) {
                return fallback;
            }

            return JSON.parse(value);

        } catch (error) {

            console.error(
                `Error leyendo ${key}`,
                error
            );

            return fallback;
        }
    }


    function writeStorage(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }


    /* =====================================================
       PERÍODO ACTIVO
       ===================================================== */

    function getActivePeriod() {

        const stored =
            readStorage(
                SCHOOL_PERIOD_KEY,
                null
            );


        if (
            stored &&
            stored.active === true
        ) {
            return stored;
        }


        writeStorage(
            SCHOOL_PERIOD_KEY,
            DEFAULT_PERIOD
        );


        return DEFAULT_PERIOD;
    }


    function updatePeriodUI() {

        const period =
            getActivePeriod();


        schoolYear.textContent =
            `Año escolar ${period.name}`;


        activePeriodLabel.textContent =
            period.name;

    }


    /* =====================================================
       ESTUDIANTES
       ===================================================== */

    function getStudents() {

        const students =
            readStorage(
                STUDENTS_KEY,
                []
            );


        return Array.isArray(students)
            ? students
            : [];

    }


    /* =====================================================
       MATRÍCULAS
       ===================================================== */

    function getEnrollments() {

        const enrollments =
            readStorage(
                ENROLLMENTS_KEY,
                []
            );


        return Array.isArray(enrollments)
            ? enrollments
            : [];

    }


    /*
     * Determina si el estudiante tiene una
     * matrícula activa en el período actual.
     */
    function isStudentEnrolledAndActive(
        student
    ) {

        if (!student) {
            return false;
        }


        const period =
            getActivePeriod();


        const enrollments =
            getEnrollments();


        return enrollments.some(enrollment => {

            const sameStudent =
                String(
                    enrollment.studentId
                ) ===
                String(
                    student.id
                );


            const samePeriod =
                enrollment.periodId ===
                period.id;


            const activeEnrollment =
                enrollment.active !== false &&
                enrollment.status !== "Cancelada" &&
                enrollment.status !== "Inactiva";


            return (
                sameStudent &&
                samePeriod &&
                activeEnrollment
            );

        });

    }


    /*
     * Obtiene únicamente estudiantes que:
     *
     * 1. Existen.
     * 2. Están matriculados.
     * 3. Están activos.
     * 4. Pertenecen al período activo.
     */
    function getEligibleStudents() {

        return getStudents()
            .filter(student => {

                return (
                    student.active !== false &&
                    isStudentEnrolledAndActive(student)
                );

            });

    }


    /* =====================================================
       FALLBACK DE ESTUDIANTES
       ===================================================== */

    /*
     * Si el módulo de estudiantes todavía no tiene
     * datos cargados, no se inventan estudiantes
     * como "matriculados".
     *
     * El requisito de matrícula activa se respeta.
     */
    function ensureStudentData() {

        const students =
            getStudents();


        if (students.length > 0) {
            return;
        }


        /*
         * Estos estudiantes son únicamente registros
         * base del catálogo de estudiantes.
         *
         * La matrícula debe existir aparte para que
         * puedan aparecer en Calificaciones.
         */
        const defaults = [

            {
                id: "STUDENT-001",
                name: "Sofía Martínez",
                active: true
            },

            {
                id: "STUDENT-002",
                name: "Luis Manuel Reyes",
                active: true
            },

            {
                id: "STUDENT-003",
                name: "Camila Núñez",
                active: true
            },

            {
                id: "STUDENT-004",
                name: "José Alejandro Díaz",
                active: true
            }

        ];


        writeStorage(
            STUDENTS_KEY,
            defaults
        );

    }


    /* =====================================================
       CALIFICACIONES
       ===================================================== */

    function getGrades() {

        const grades =
            readStorage(
                GRADES_KEY,
                []
            );


        return Array.isArray(grades)
            ? grades
            : [];

    }


    function saveGrades(grades) {

        writeStorage(
            GRADES_KEY,
            grades
        );

    }


    /* =====================================================
       BUSCAR NOTAS
       ===================================================== */

    function getStudentGrades(
        studentId
    ) {

        const period =
            getActivePeriod();


        const grades =
            getGrades();


        const result = {

            first: null,

            second: null,

            third: null

        };


        grades
            .filter(grade => {

                return (
                    String(
                        grade.studentId
                    ) ===
                    String(
                        studentId
                    ) &&
                    grade.periodId ===
                    period.id
                );

            })
            .forEach(grade => {

                if (
                    grade.term === 1
                ) {
                    result.first =
                        Number(
                            grade.value
                        );
                }


                if (
                    grade.term === 2
                ) {
                    result.second =
                        Number(
                            grade.value
                        );
                }


                if (
                    grade.term === 3
                ) {
                    result.third =
                        Number(
                            grade.value
                        );
                }

            });


        return result;

    }


    /* =====================================================
       PROMEDIO
       ===================================================== */

    function calculateAverage(
        grades
    ) {

        const values = [

            grades.first,

            grades.second,

            grades.third

        ].filter(value => {

            return (
                value !== null &&
                value !== undefined &&
                Number.isFinite(
                    Number(value)
                )
            );

        });


        if (values.length === 0) {
            return null;
        }


        const total =
            values.reduce(
                (sum, value) => {

                    return (
                        sum +
                        Number(value)
                    );

                },
                0
            );


        return Number(
            (
                total /
                values.length
            ).toFixed(1)
        );

    }


    /* =====================================================
       ESTADO ACADÉMICO
       ===================================================== */

    function getAcademicStatus(
        average
    ) {

        if (
            average === null ||
            average === undefined
        ) {

            return {
                label: "Pendiente",
                className: "status-pending"
            };

        }


        if (
            average >= PASSING_GRADE
        ) {

            return {
                label: "Aprueba",
                className: "status-pass"
            };

        }


        return {
            label: "No aprueba",
            className: "status-fail"
        };

    }


    /* =====================================================
       FORMATO
       ===================================================== */

    function formatGrade(
        value
    ) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "—";
        }


        const number =
            Number(value);


        if (
            !Number.isFinite(number)
        ) {
            return "—";
        }


        if (
            Number.isInteger(number)
        ) {
            return String(number);
        }


        return number.toFixed(1);

    }


    /* =====================================================
       POBLAR ESTUDIANTES
       ===================================================== */

    function populateStudents() {

        const students =
            getEligibleStudents();


        gradeStudent.innerHTML =
            `<option value="">
                Selecciona un estudiante
            </option>`;


        students.forEach(student => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.id;


            option.textContent =
                student.name;


            gradeStudent.appendChild(
                option
            );

        });


        /*
         * Si no hay estudiantes elegibles,
         * se deshabilita el selector.
         */
        gradeStudent.disabled =
            students.length === 0;

    }


    /* =====================================================
       ABRIR MODAL
       ===================================================== */

    function openModal() {

        gradeForm.reset();

        clearFormMessage();

        populateStudents();

        updatePeriodUI();


        gradeModal.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }


    function closeModal() {

        gradeModal.classList.remove(
            "active"
        );


        document.body.style.overflow =
            "";


        clearFormMessage();

        gradeForm.reset();

    }


    /* =====================================================
       MENSAJES
       ===================================================== */

    function clearFormMessage() {

        gradeFormMessage.textContent =
            "";

        gradeFormMessage.className =
            "form-message";

    }


    function showFormError(
        message
    ) {

        gradeFormMessage.textContent =
            message;

        gradeFormMessage.className =
            "form-message error";

    }


    function showFormSuccess(
        message
    ) {

        gradeFormMessage.textContent =
            message;

        gradeFormMessage.className =
            "form-message success";

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

            pageMessage.textContent =
                "";

            pageMessage.className =
                "page-message";

        }, 4000);

    }


    function showToast(
        message,
        title = "Listo"
    ) {

        clearTimeout(toastTimer);


        toastTitle.textContent =
            title;


        toastMessage.textContent =
            message;


        toast.classList.add(
            "show"
        );


        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3500);

    }


    /* =====================================================
       VALIDAR NOTA
       ===================================================== */

    function validateGrade(
        value
    ) {

        if (
            value === "" ||
            value === null ||
            value === undefined
        ) {

            return {
                valid: false,
                message:
                    "Escribe una calificación."
            };

        }


        const number =
            Number(value);


        if (
            !Number.isFinite(number)
        ) {

            return {
                valid: false,
                message:
                    "Escribe una calificación válida."
            };

        }


        if (
            number < MIN_GRADE ||
            number > MAX_GRADE
        ) {

            return {
                valid: false,
                message:
                    "Se intentó ingresar un valor que estaba fuera del rango permitido."
            };

        }


        return {
            valid: true,
            value: Number(
                number.toFixed(1)
            )
        };

    }


    /* =====================================================
       GUARDAR NOTA
       ===================================================== */

    function saveGrade(
        studentId,
        term,
        value
    ) {

        const validation =
            validateGrade(value);


        if (!validation.valid) {

            return {
                success: false,
                message:
                    validation.message
            };

        }


        const period =
            getActivePeriod();


        const students =
            getStudents();


        const student =
            students.find(item => {

                return (
                    String(item.id) ===
                    String(studentId)
                );

            });


        if (!student) {

            return {
                success: false,
                message:
                    "El estudiante seleccionado no existe."
            };

        }


        if (
            !isStudentEnrolledAndActive(
                student
            )
        ) {

            return {
                success: false,
                message:
                    "El estudiante debe estar matriculado y activo en ese período."
            };

        }


        const grades =
            getGrades();


        const numericTerm =
            Number(term);


        const existingIndex =
            grades.findIndex(grade => {

                return (
                    String(
                        grade.studentId
                    ) ===
                    String(
                        studentId
                    ) &&
                    grade.periodId ===
                    period.id &&
                    Number(
                        grade.term
                    ) ===
                    numericTerm
                );

            });


        const record = {

            id:
                existingIndex >= 0
                    ? grades[existingIndex].id
                    : `GRADE-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2, 8)}`,

            studentId:
                student.id,

            studentName:
                student.name,

            periodId:
                period.id,

            term:
                numericTerm,

            value:
                validation.value,

            updatedAt:
                new Date().toISOString()

        };


        if (
            existingIndex >= 0
        ) {

            grades[
                existingIndex
            ] = {
                ...grades[existingIndex],
                ...record
            };

        } else {

            grades.push(
                record
            );

        }


        saveGrades(
            grades
        );


        return {
            success: true
        };

    }


    /* =====================================================
       GUARDAR DESDE MODAL
       ===================================================== */

    function handleGradeSubmit(
        event
    ) {

        event.preventDefault();

        clearFormMessage();


        const studentId =
            gradeStudent.value;


        const term =
            gradeTerm.value;


        const value =
            gradeValue.value;


        if (!studentId) {

            showFormError(
                "Selecciona un estudiante."
            );

            return;
        }


        if (!term) {

            showFormError(
                "Selecciona el trimestre."
            );

            return;
        }


        const result =
            saveGrade(
                studentId,
                term,
                value
            );


        if (!result.success) {

            showFormError(
                result.message
            );

            return;
        }


        closeModal();

        renderGrades();


        showToast(
            "La nota se registró correctamente.",
            "Nota registrada"
        );


        showPageMessage(
            "La nota se registró correctamente.",
            "success"
        );

    }


    /* =====================================================
       RENDER TABLA
       ===================================================== */

    function renderGrades() {

        const students =
            getEligibleStudents();


        gradesBody.innerHTML =
            "";


        if (
            students.length === 0
        ) {

            emptyState.classList.add(
                "visible"
            );

            return;

        }


        emptyState.classList.remove(
            "visible"
        );


        students.forEach(student => {

            const grades =
                getStudentGrades(
                    student.id
                );


            const average =
                calculateAverage(
                    grades
                );


            const status =
                getAcademicStatus(
                    average
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.dataset.studentId =
                student.id;


            row.innerHTML = `

                <td class="student-name">
                    ${escapeHTML(student.name)}
                </td>


                <td class="grade-cell">
                    <span class="grade-value">
                        ${formatGrade(grades.first)}
                    </span>
                </td>


                <td class="grade-cell">
                    <span class="grade-value">
                        ${formatGrade(grades.second)}
                    </span>
                </td>


                <td class="grade-cell">
                    <span class="grade-value">
                        ${formatGrade(grades.third)}
                    </span>
                </td>


                <td class="average">
                    ${
                        average === null
                            ? "—"
                            : average.toFixed(1)
                    }
                </td>


                <td>

                    <span
                        class="status-badge ${status.className}">

                        ${status.label}

                    </span>

                </td>


                <td>

                    <button
                        type="button"
                        class="btn-edit"
                        data-edit-student="${escapeHTML(student.id)}">

                        Editar

                    </button>

                </td>

            `;


            gradesBody.appendChild(
                row
            );

        });


        if (window.lucide) {
            lucide.createIcons();
        }

    }


    /* =====================================================
       EDITAR FILA
       ===================================================== */

    function startInlineEdit(
        studentId
    ) {

        /*
         * Si ya existe una fila editándose,
         * se cancela antes de comenzar otra.
         */
        if (
            editingStudentId &&
            editingStudentId !== studentId
        ) {

            cancelInlineEdit();

        }


        const row =
            gradesBody.querySelector(
                `tr[data-student-id="${CSS.escape(
                    String(studentId)
                )}"]`
            );


        if (!row) {
            return;
        }


        const grades =
            getStudentGrades(
                studentId
            );


        editingStudentId =
            String(studentId);


        row.classList.add(
            "editing-row"
        );


        /*
         * Celdas de los tres trimestres.
         */
        const termCells = [

            {
                index: 1,
                value: grades.first,
                term: 1
            },

            {
                index: 2,
                value: grades.second,
                term: 2
            },

            {
                index: 3,
                value: grades.third,
                term: 3
            }

        ];


        termCells.forEach(item => {

            const cell =
                row.children[
                    item.index
                ];


            cell.innerHTML = `

                <input
                    type="number"
                    class="inline-grade-input"
                    min="0"
                    max="20"
                    step="0.1"
                    data-inline-term="${item.term}"
                    value="${
                        item.value === null ||
                        item.value === undefined
                            ? ""
                            : item.value
                    }"
                    aria-label="Nota del ${item.term} trimestre">

            `;

        });


        /*
         * La última celda cambia a Guardar/Cancelar.
         */
        const actionCell =
            row.children[6];


        actionCell.innerHTML = `

            <div class="inline-actions">

                <button
                    type="button"
                    class="btn-save-inline"
                    data-inline-save="${escapeHTML(studentId)}">

                    Guardar

                </button>


                <button
                    type="button"
                    class="btn-cancel-inline"
                    data-inline-cancel="${escapeHTML(studentId)}">

                    Cancelar

                </button>

            </div>

        `;


        const firstInput =
            row.querySelector(
                ".inline-grade-input"
            );


        if (firstInput) {
            firstInput.focus();
        }

    }


    /* =====================================================
       GUARDAR EDICIÓN DIRECTA
       ===================================================== */

    function saveInlineEdit(
        studentId
    ) {

        const row =
            gradesBody.querySelector(
                `tr[data-student-id="${CSS.escape(
                    String(studentId)
                )}"]`
            );


        if (!row) {
            return;
        }


        const inputs =
            row.querySelectorAll(
                ".inline-grade-input"
            );


        const values = {};


        /*
         * Primero validamos TODOS los campos.
         * Si uno falla, no se guarda ninguno.
         */
        for (
            const input of inputs
        ) {

            const term =
                Number(
                    input.dataset.inlineTerm
                );


            const validation =
                validateGrade(
                    input.value
                );


            if (!validation.valid) {

                input.classList.add(
                    "invalid"
                );


                showPageMessage(
                    validation.message,
                    "error"
                );


                input.focus();

                return;

            }


            input.classList.remove(
                "invalid"
            );


            values[term] =
                validation.value;

        }


        const period =
            getActivePeriod();


        const grades =
            getGrades();


        const student =
            getStudents()
                .find(item => {

                    return (
                        String(item.id) ===
                        String(studentId)
                    );

                });


        if (!student) {

            showPageMessage(
                "El estudiante seleccionado no existe.",
                "error"
            );

            return;

        }


        if (
            !isStudentEnrolledAndActive(
                student
            )
        ) {

            showPageMessage(
                "El estudiante debe estar matriculado y activo en ese período.",
                "error"
            );

            return;

        }


        /*
         * Actualizar los tres trimestres.
         */
        [1, 2, 3].forEach(term => {

            const value =
                values[term];


            const index =
                grades.findIndex(
                    grade => {

                        return (
                            String(
                                grade.studentId
                            ) ===
                            String(
                                studentId
                            ) &&
                            grade.periodId ===
                            period.id &&
                            Number(
                                grade.term
                            ) === term
                        );

                    }
                );


            if (index >= 0) {

                grades[index].value =
                    value;

                grades[index].updatedAt =
                    new Date().toISOString();

            } else {

                grades.push({

                    id:
                        `GRADE-${Date.now()}-${term}-${Math.random()
                            .toString(36)
                            .slice(2, 7)}`,

                    studentId:
                        student.id,

                    studentName:
                        student.name,

                    periodId:
                        period.id,

                    term,

                    value,

                    updatedAt:
                        new Date().toISOString()

                });

            }

        });


        saveGrades(
            grades
        );


        editingStudentId =
            null;


        renderGrades();


        showToast(
            "La nota se registró correctamente.",
            "Notas actualizadas"
        );


        showPageMessage(
            "La nota se registró correctamente.",
            "success"
        );

    }


    /* =====================================================
       CANCELAR EDICIÓN
       ===================================================== */

    function cancelInlineEdit() {

        if (!editingStudentId) {
            return;
        }


        editingStudentId =
            null;


        renderGrades();

    }


    /* =====================================================
       ESCAPAR HTML
       ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

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

        sidebar.classList.add(
            "open"
        );

        sidebarOverlay.classList.add(
            "active"
        );

    }


    function closeSidebar() {

        sidebar.classList.remove(
            "open"
        );

        sidebarOverlay.classList.remove(
            "active"
        );

    }


    /* =====================================================
       EVENTOS DEL MODAL
       ===================================================== */

    openGradeModal.addEventListener(
        "click",
        openModal
    );


    closeGradeModal.addEventListener(
        "click",
        closeModal
    );


    cancelGrade.addEventListener(
        "click",
        closeModal
    );


    gradeForm.addEventListener(
        "submit",
        handleGradeSubmit
    );


    gradeModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                gradeModal
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       EVENTOS DE TABLA
       ===================================================== */

    gradesBody.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    "[data-edit-student]"
                );


            if (editButton) {

                startInlineEdit(
                    editButton.dataset.editStudent
                );

                return;

            }


            const saveButton =
                event.target.closest(
                    "[data-inline-save]"
                );


            if (saveButton) {

                saveInlineEdit(
                    saveButton.dataset.inlineSave
                );

                return;

            }


            const cancelButton =
                event.target.closest(
                    "[data-inline-cancel]"
                );


            if (cancelButton) {

                cancelInlineEdit();

            }

        }
    );


    /* =====================================================
       MENÚ
       ===================================================== */

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

            if (
                event.key !== "Escape"
            ) {
                return;
            }


            if (
                gradeModal.classList.contains(
                    "active"
                )
            ) {

                closeModal();

            }


            if (
                editingStudentId
            ) {

                cancelInlineEdit();

            }


            closeSidebar();

        }
    );


    /* =====================================================
       INICIALIZACIÓN
       ===================================================== */

    ensureStudentData();

    updatePeriodUI();

    updateDate();

    renderGrades();

    lucide.createIcons();

});