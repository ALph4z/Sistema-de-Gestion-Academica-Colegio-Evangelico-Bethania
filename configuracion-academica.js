document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       CONFIGURACIÓN
       ========================================================= */

    const LEVELS_KEY = "edubethania_academic_levels";
    const SCHOOL_PERIOD_KEY = "edubethania_active_school_period";

    /*
     * Periodo escolar que ya viene cargado para la demostración.
     * Si otro módulo del sistema guarda un periodo activo,
     * este valor puede ser reemplazado automáticamente.
     */

    const DEFAULT_ACTIVE_PERIOD = {
        id: "PERIOD-2026-2027",
        name: "2026–2027",
        startYear: 2026,
        endYear: 2027,
        active: true
    };


    /* =========================================================
       ELEMENTOS
       ========================================================= */

    const levelsGrid =
        document.getElementById("levels-grid");

    const createLevelButton =
        document.getElementById("create-level-button");

    const levelModal =
        document.getElementById("level-modal");

    const closeLevelModal =
        document.getElementById("close-level-modal");

    const cancelLevel =
        document.getElementById("cancel-level");

    const levelForm =
        document.getElementById("level-form");

    const levelModalTitle =
        document.getElementById("level-modal-title");

    const courseNameInput =
        document.getElementById("course-name");

    const academicLevelInput =
        document.getElementById("academic-level");

    const sectionInput =
        document.getElementById("section-name");

    const shiftInput =
        document.getElementById("shift");

    const activePeriodLabel =
        document.getElementById("active-period-label");

    const activePeriodBox =
        document.getElementById("active-period-box");

    const formMessage =
        document.getElementById("level-form-message");

    const deleteModal =
        document.getElementById("delete-modal");

    const deleteModalDescription =
        document.getElementById("delete-modal-description");

    const cancelDelete =
        document.getElementById("cancel-delete");

    const confirmDelete =
        document.getElementById("confirm-delete");

    const toast =
        document.getElementById("toast");

    const schoolYear =
        document.getElementById("school-year");


    /* =========================================================
       ESTADO
       ========================================================= */

    let editingLevelId = null;

    let deletingLevelId = null;


    /* =========================================================
       DATOS INICIALES
       ========================================================= */

    const defaultLevels = [
        {
            id: "LEVEL-001",
            courseName: "Inicial",
            academicLevel: "Inicial",
            section: "Pre-K",
            shift: "Matutina",
            periodId: "PERIOD-2026-2027",
            periodName: "2026–2027"
        },

        {
            id: "LEVEL-002",
            courseName: "Inicial",
            academicLevel: "Inicial",
            section: "Kinder",
            shift: "Matutina",
            periodId: "PERIOD-2026-2027",
            periodName: "2026–2027"
        },

        {
            id: "LEVEL-003",
            courseName: "4to de Primaria",
            academicLevel: "Primaria",
            section: "A",
            shift: "Matutina",
            periodId: "PERIOD-2026-2027",
            periodName: "2026–2027"
        },

        {
            id: "LEVEL-004",
            courseName: "5to de Primaria",
            academicLevel: "Primaria",
            section: "B",
            shift: "Matutina",
            periodId: "PERIOD-2026-2027",
            periodName: "2026–2027"
        },

        {
            id: "LEVEL-005",
            courseName: "1ro de Secundaria",
            academicLevel: "Secundaria",
            section: "A",
            shift: "Vespertina",
            periodId: "PERIOD-2026-2027",
            periodName: "2026–2027"
        }
    ];


    /* =========================================================
       UTILIDADES
       ========================================================= */

    function normalizeText(value) {
        return String(value || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }


    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function createId() {
        return `LEVEL-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 8)}`;
    }


    /* =========================================================
       PERIODO ESCOLAR
       ========================================================= */

    function getActivePeriod() {

        const storedPeriod =
            localStorage.getItem(
                SCHOOL_PERIOD_KEY
            );

        /*
         * Si otro módulo ya cargó el periodo,
         * utilizamos ese periodo.
         */

        if (storedPeriod) {

            try {

                const parsed =
                    JSON.parse(storedPeriod);

                if (
                    parsed &&
                    parsed.active === true
                ) {
                    return parsed;
                }

            } catch (error) {

                console.error(
                    "Error leyendo el periodo escolar:",
                    error
                );

            }
        }


        /*
         * Para la versión demostrativa dejamos
         * cargado el periodo 2026–2027.
         */

        localStorage.setItem(
            SCHOOL_PERIOD_KEY,
            JSON.stringify(DEFAULT_ACTIVE_PERIOD)
        );

        return DEFAULT_ACTIVE_PERIOD;
    }


    function updatePeriodDisplay() {

        const period =
            getActivePeriod();

        if (!period) {

            if (schoolYear) {
                schoolYear.textContent =
                    "Sin periodo escolar activo";
            }

            if (activePeriodLabel) {
                activePeriodLabel.textContent =
                    "No disponible";
            }

            return;
        }


        if (schoolYear) {

            schoolYear.textContent =
                `Año escolar ${period.name}`;

        }


        if (activePeriodLabel) {

            activePeriodLabel.textContent =
                period.name;

        }
    }


    /* =========================================================
       NIVELES
       ========================================================= */

    function getLevels() {

        const stored =
            localStorage.getItem(
                LEVELS_KEY
            );


        if (!stored) {

            localStorage.setItem(
                LEVELS_KEY,
                JSON.stringify(defaultLevels)
            );

            return [...defaultLevels];
        }


        try {

            const parsed =
                JSON.parse(stored);

            if (Array.isArray(parsed)) {
                return parsed;
            }

            return [...defaultLevels];

        } catch (error) {

            console.error(
                "Error leyendo los niveles:",
                error
            );

            return [...defaultLevels];
        }
    }


    function saveLevels(levels) {

        localStorage.setItem(
            LEVELS_KEY,
            JSON.stringify(levels)
        );
    }


    /* =========================================================
       VALIDACIÓN DE PERIODO
       ========================================================= */

    function hasActivePeriod() {

        const period =
            getActivePeriod();

        return Boolean(
            period &&
            period.active === true &&
            period.id
        );
    }


    /* =========================================================
       DETECTAR DUPLICADOS
       ========================================================= */

    function isDuplicateLevel(
        data,
        currentId = null
    ) {

        const levels =
            getLevels();

        const period =
            getActivePeriod();


        if (!period) {
            return false;
        }


        const course =
            normalizeText(
                data.courseName
            );

        const academicLevel =
            normalizeText(
                data.academicLevel
            );

        const section =
            normalizeText(
                data.section
            );

        const shift =
            normalizeText(
                data.shift
            );


        return levels.some(level => {

            /*
             * Durante una edición no debemos
             * compararnos con nosotros mismos.
             */

            if (
                currentId &&
                String(level.id) ===
                String(currentId)
            ) {
                return false;
            }


            /*
             * Solo comprobamos dentro
             * del mismo periodo escolar.
             */

            if (
                String(level.periodId) !==
                String(period.id)
            ) {
                return false;
            }


            return (
                normalizeText(
                    level.courseName
                ) === course &&

                normalizeText(
                    level.academicLevel
                ) === academicLevel &&

                normalizeText(
                    level.section
                ) === section &&

                normalizeText(
                    level.shift
                ) === shift
            );

        });
    }


    /* =========================================================
       MODAL CREAR
       ========================================================= */

    function openCreateModal() {

        if (!hasActivePeriod()) {

            showToast(
                "No se puede crear el nivel porque no existe un periodo escolar activo."
            );

            return;
        }


        editingLevelId = null;

        levelForm.reset();

        clearFormMessage();


        levelModalTitle.textContent =
            "Crear nivel";


        activePeriodBox.style.display =
            "flex";


        updatePeriodDisplay();


        levelModal.removeAttribute(
            "hidden"
        );

        document.body.classList.add(
            "modal-open"
        );


        setTimeout(() => {

            courseNameInput.focus();

        }, 50);
    }


    /* =========================================================
       MODAL EDITAR
       ========================================================= */

    function openEditModal(levelId) {

        const levels =
            getLevels();

        const level =
            levels.find(
                item =>
                    String(item.id) ===
                    String(levelId)
            );


        if (!level) {

            showToast(
                "No se encontró el nivel seleccionado."
            );

            return;
        }


        editingLevelId =
            level.id;


        levelModalTitle.textContent =
            "Editar nivel";


        courseNameInput.value =
            level.courseName || "";


        academicLevelInput.value =
            level.academicLevel || "";


        sectionInput.value =
            level.section || "";


        shiftInput.value =
            level.shift || "";


        clearFormMessage();

        updatePeriodDisplay();


        levelModal.removeAttribute(
            "hidden"
        );

        document.body.classList.add(
            "modal-open"
        );


        setTimeout(() => {

            courseNameInput.focus();

        }, 50);
    }


    /* =========================================================
       CERRAR MODAL
       ========================================================= */

    function closeLevelModalWindow() {

        levelModal.setAttribute(
            "hidden",
            ""
        );

        document.body.classList.remove(
            "modal-open"
        );

        editingLevelId = null;

        levelForm.reset();

        clearFormMessage();
    }


    /* =========================================================
       MENSAJES DEL FORMULARIO
       ========================================================= */

    function clearFormMessage() {

        if (!formMessage) {
            return;
        }

        formMessage.textContent = "";

        formMessage.className =
            "form-message";
    }


    function showFormError(message) {

        if (!formMessage) {
            return;
        }

        formMessage.textContent =
            message;

        formMessage.className =
            "form-message error";
    }


    function showFormSuccess(message) {

        if (!formMessage) {
            return;
        }

        formMessage.textContent =
            message;

        formMessage.className =
            "form-message success";
    }


    /* =========================================================
       VALIDAR FORMULARIO
       ========================================================= */

    function getFormData() {

        return {

            courseName:
                courseNameInput.value.trim(),

            academicLevel:
                academicLevelInput.value,

            section:
                sectionInput.value.trim(),

            shift:
                shiftInput.value

        };
    }


    function validateForm(data) {

        clearFormMessage();


        if (!hasActivePeriod()) {

            showFormError(
                "No se puede guardar porque no existe un periodo escolar activo."
            );

            return false;
        }


        if (!data.courseName) {

            showFormError(
                "Debes indicar el nombre del curso."
            );

            courseNameInput.focus();

            return false;
        }


        if (!data.academicLevel) {

            showFormError(
                "Debes seleccionar el nivel."
            );

            academicLevelInput.focus();

            return false;
        }


        if (!data.section) {

            showFormError(
                "Debes indicar la sección."
            );

            sectionInput.focus();

            return false;
        }


        if (!data.shift) {

            showFormError(
                "Debes seleccionar la tanda."
            );

            shiftInput.focus();

            return false;
        }


        /*
         * No permitimos duplicados.
         */

        if (
            isDuplicateLevel(
                data,
                editingLevelId
            )
        ) {

            showFormError(
                "No se pudo crear porque ya existía uno igual."
            );

            return false;
        }


        return true;
    }


    /* =========================================================
       GUARDAR NIVEL
       ========================================================= */

    function saveLevel(event) {

        event.preventDefault();


        const data =
            getFormData();


        if (!validateForm(data)) {
            return;
        }


        const period =
            getActivePeriod();


        const levels =
            getLevels();


        /*
         * EDITAR
         */

        if (editingLevelId) {

            const index =
                levels.findIndex(
                    level =>
                        String(level.id) ===
                        String(editingLevelId)
                );


            if (index === -1) {

                showFormError(
                    "No se encontró el nivel que deseas editar."
                );

                return;
            }


            levels[index] = {

                ...levels[index],

                courseName:
                    data.courseName,

                academicLevel:
                    data.academicLevel,

                section:
                    data.section,

                shift:
                    data.shift,

                periodId:
                    period.id,

                periodName:
                    period.name

            };


            saveLevels(levels);

            renderLevels();

            closeLevelModalWindow();


            showToast(
                "El nivel se actualizó correctamente."
            );


            return;
        }


        /*
         * CREAR
         */

        const newLevel = {

            id:
                createId(),

            courseName:
                data.courseName,

            academicLevel:
                data.academicLevel,

            section:
                data.section,

            shift:
                data.shift,

            periodId:
                period.id,

            periodName:
                period.name,

            createdAt:
                new Date().toISOString()

        };


        levels.push(
            newLevel
        );


        saveLevels(
            levels
        );


        renderLevels();

        closeLevelModalWindow();


        showToast(
            "El nivel se creó correctamente."
        );
    }


    /* =========================================================
       RENDERIZAR TARJETAS
       ========================================================= */

    function renderLevels() {

        if (!levelsGrid) {
            return;
        }


        const levels =
            getLevels();

        const period =
            getActivePeriod();


        /*
         * Solo mostramos las tarjetas
         * correspondientes al periodo activo.
         */

        const activeLevels =
            levels.filter(level => {

                if (!period) {
                    return false;
                }

                return (
                    String(level.periodId) ===
                    String(period.id)
                );

            });


        levelsGrid.innerHTML = "";


        if (
            activeLevels.length === 0
        ) {

            levelsGrid.innerHTML = `

                <div class="empty-levels">

                    <strong>
                        No hay niveles creados
                    </strong>

                    Todavía no hay cursos y secciones
                    registrados para este periodo escolar.

                </div>

            `;

            return;
        }


        activeLevels.forEach(level => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "level-card";


            card.dataset.levelId =
                level.id;


            card.innerHTML = `

                <div class="level-card-content">

                    <div class="level-info">

                        <h3 class="level-title">
                            ${escapeHtml(
                                level.courseName
                            )}
                        </h3>


                        <div class="section-tags">

                            <span class="section-tag">
                                ${escapeHtml(
                                    formatSection(
                                        level
                                    )
                                )}
                            </span>

                        </div>


                        <p class="level-meta">

                            Tanda:
                            ${escapeHtml(
                                level.shift
                            )}

                            · Año escolar
                            ${escapeHtml(
                                level.periodName
                            )}

                        </p>

                    </div>


                    <div class="level-actions">

                        <button
                            class="btn-edit"
                            type="button"
                            data-action="edit"
                            data-id="${escapeHtml(
                                level.id
                            )}"
                        >
                            Editar
                        </button>


                        <button
                            class="btn-delete"
                            type="button"
                            data-action="delete"
                            data-id="${escapeHtml(
                                level.id
                            )}"
                        >
                            Eliminar
                        </button>

                    </div>

                </div>

            `;


            levelsGrid.appendChild(
                card
            );
        });


        attachCardEvents();


        if (
            window.lucide &&
            typeof window.lucide.createIcons ===
                "function"
        ) {

            window.lucide.createIcons();

        }
    }


    /* =========================================================
       FORMATO DE SECCIÓN
       ========================================================= */

    function formatSection(level) {

        /*
         * Para que aparezca:
         *
         * 5to B
         *
         * y no solamente:
         *
         * B
         *
         * en cursos que no sean Inicial.
         */

        if (
            level.academicLevel ===
            "Inicial"
        ) {

            return level.section;
        }


        const courseName =
            String(
                level.courseName || ""
            ).trim();


        /*
         * Buscamos el número del curso.
         */

        const match =
            courseName.match(
                /^(\d+(?:ro|do|to|mo|er)?)/i
            );


        if (match) {

            return `${match[1]} ${level.section}`;

        }


        return level.section;
    }


    /* =========================================================
       EVENTOS DE LAS TARJETAS
       ========================================================= */

    function attachCardEvents() {

        const editButtons =
            levelsGrid.querySelectorAll(
                '[data-action="edit"]'
            );


        const deleteButtons =
            levelsGrid.querySelectorAll(
                '[data-action="delete"]'
            );


        editButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openEditModal(
                        button.dataset.id
                    );

                }
            );

        });


        deleteButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openDeleteModal(
                        button.dataset.id
                    );

                }
            );

        });
    }


    /* =========================================================
       ELIMINAR
       ========================================================= */

    function openDeleteModal(levelId) {

        const levels =
            getLevels();


        const level =
            levels.find(
                item =>
                    String(item.id) ===
                    String(levelId)
            );


        if (!level) {

            showToast(
                "No se encontró el nivel seleccionado."
            );

            return;
        }


        deletingLevelId =
            levelId;


        deleteModalDescription.textContent =
            `¿Estás seguro de que deseas eliminar "${level.courseName} - ${formatSection(level)}"?`;


        deleteModal.removeAttribute(
            "hidden"
        );


        document.body.classList.add(
            "modal-open"
        );
    }


    function closeDeleteModal() {

        deleteModal.setAttribute(
            "hidden",
            ""
        );


        document.body.classList.remove(
            "modal-open"
        );


        deletingLevelId = null;
    }


    function deleteLevel() {

        if (!deletingLevelId) {
            return;
        }


        const levels =
            getLevels();


        const level =
            levels.find(
                item =>
                    String(item.id) ===
                    String(deletingLevelId)
            );


        if (!level) {

            closeDeleteModal();

            return;
        }


        const filteredLevels =
            levels.filter(
                item =>
                    String(item.id) !==
                    String(deletingLevelId)
            );


        saveLevels(
            filteredLevels
        );


        renderLevels();

        closeDeleteModal();


        showToast(
            "El nivel se eliminó correctamente."
        );
    }


    /* =========================================================
       TOAST
       ========================================================= */

    let toastTimer = null;


    function showToast(message) {

        if (!toast) {
            return;
        }


        toast.textContent =
            message;


        toast.classList.add(
            "show"
        );


        clearTimeout(
            toastTimer
        );


        toastTimer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3500);
    }


    /* =========================================================
       CERRAR MODALES AL HACER CLICK AFUERA
       ========================================================= */

    if (levelModal) {

        levelModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    levelModal
                ) {

                    closeLevelModalWindow();

                }

            }
        );

    }


    if (deleteModal) {

        deleteModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    deleteModal
                ) {

                    closeDeleteModal();

                }

            }
        );

    }


    /* =========================================================
       TECLA ESCAPE
       ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }


            if (
                levelModal &&
                !levelModal.hasAttribute(
                    "hidden"
                )
            ) {

                closeLevelModalWindow();

            }


            if (
                deleteModal &&
                !deleteModal.hasAttribute(
                    "hidden"
                )
            ) {

                closeDeleteModal();

            }

        }
    );


    /* =========================================================
       EVENTOS PRINCIPALES
       ========================================================= */

    if (createLevelButton) {

        createLevelButton.addEventListener(
            "click",
            openCreateModal
        );

    }


    if (closeLevelModal) {

        closeLevelModal.addEventListener(
            "click",
            closeLevelModalWindow
        );

    }


    if (cancelLevel) {

        cancelLevel.addEventListener(
            "click",
            closeLevelModalWindow
        );

    }


    if (levelForm) {

        levelForm.addEventListener(
            "submit",
            saveLevel
        );

    }


    if (cancelDelete) {

        cancelDelete.addEventListener(
            "click",
            closeDeleteModal
        );

    }


    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            deleteLevel
        );

    }


    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */

    updatePeriodDisplay();

    renderLevels();


    if (
        window.lucide &&
        typeof window.lucide.createIcons ===
            "function"
    ) {

        window.lucide.createIcons();

    }

});