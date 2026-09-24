document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CLAVES DE ALMACENAMIENTO
       ===================================================== */

    const KEY = {
        students: "edubethania_students",
        tutors: "edubethania_tutors",
        grades: "edubethania_grades",
        enrollments: "edubethania_enrollments",
        period: "edubethania_active_school_period",
        requests: "edubethania_document_update_requests",
        currentTutor: "edubethania_current_tutor"
    };


    /* =====================================================
       ELEMENTOS
       ===================================================== */

    const selector = document.getElementById("student-selector");
    const portalData = document.getElementById("portal-data");
    const portalEmpty = document.getElementById("portal-empty");
    const message = document.getElementById("portal-message");
    const requestButton = document.getElementById("request-documents");

    let linkedStudents = [];
    let selectedStudentId = null;


    /* =====================================================
       LECTURA DE LOCALSTORAGE
       ===================================================== */

    function readArray(key) {

        try {

            const value = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(value) ? value : [];

        } catch {

            return [];
        }
    }


    function readObject(key) {

        try {

            const value = JSON.parse(
                localStorage.getItem(key) || "null"
            );

            return value && typeof value === "object"
                ? value
                : null;

        } catch {

            return null;
        }
    }


    function normalize(value) {

        return String(value ?? "")
            .trim()
            .toLowerCase();
    }


    /* =====================================================
       PERÍODO ESCOLAR ACTIVO
       ===================================================== */

    function activePeriod() {

        const savedPeriod = readObject(KEY.period);

        if (savedPeriod && savedPeriod.id) {

            return savedPeriod;
        }

        return {
            id: "PERIOD-2026-2027",
            name: "2026–2027",
            active: true
        };
    }


    /* =====================================================
       TUTOR ACTUAL
       ===================================================== */

    function currentTutor() {

        const savedTutor = readObject(KEY.currentTutor);

        if (savedTutor) {

            return savedTutor;
        }

        const tutors = readArray(KEY.tutors);

        if (tutors.length === 1) {

            return tutors[0];
        }

        return null;
    }


    /* =====================================================
       DATOS DEL ESTUDIANTE
       ===================================================== */

    function studentId(student) {

        return student.id ??
               student.studentId;
    }


    function studentName(student) {

        return student.fullName ||
               student.name ||
               [
                   student.firstName,
                   student.lastName
               ]
               .filter(Boolean)
               .join(" ") ||
               "Estudiante";
    }


    function isActive(student) {

        const status = normalize(
            student.status ??
            student.estado ??
            "activo"
        );

        return ![
            "inactivo",
            "inactive",
            "cancelado",
            "cancelled"
        ].includes(status);
    }


    /* =====================================================
       COMPROBAR VINCULACIÓN CON EL TUTOR
       ===================================================== */

    function linkedToTutor(student, tutor) {

        if (!tutor) {

            return false;
        }

        const tutorId =
            tutor.id ??
            tutor.tutorId ??
            tutor.userId;

        const tutorIds =
            Array.isArray(student.tutorIds)
                ? student.tutorIds.map(String)
                : [];


        /* Vinculación por ID */

        const studentTutorId =
            student.tutorId ??
            student.tutor_id ??
            student.guardianId ??
            student.responsibleId;


        if (
            tutorId != null &&
            studentTutorId != null &&
            String(studentTutorId) === String(tutorId)
        ) {

            return true;
        }


        /* Vinculación mediante lista de tutores */

        if (
            tutorId != null &&
            tutorIds.includes(String(tutorId))
        ) {

            return true;
        }


        /* Vinculación mediante correo */

        const studentEmail = normalize(
            student.tutorEmail ??
            student.guardianEmail ??
            student.responsibleEmail ??
            ""
        );

        const tutorEmail = normalize(
            tutor.email ??
            tutor.correo ??
            ""
        );


        if (
            studentEmail &&
            tutorEmail &&
            studentEmail === tutorEmail
        ) {

            return true;
        }


        /* Vinculación mediante nombre */

        const studentTutorName = normalize(
            student.tutorName ??
            student.guardianName ??
            student.responsibleName ??
            ""
        );

        const tutorName = normalize(
            tutor.name ??
            tutor.fullName ??
            tutor.nombre ??
            ""
        );


        if (
            studentTutorName &&
            tutorName &&
            studentTutorName === tutorName
        ) {

            return true;
        }


        return false;
    }


    /* =====================================================
       MATRÍCULA ACTIVA DEL PERÍODO
       ===================================================== */

    function enrolledThisPeriod(studentIdValue) {

        const period = activePeriod();

        const enrollments =
            readArray(KEY.enrollments);


        return enrollments.some(enrollment => {

            const enrolledStudentId =
                enrollment.studentId ??
                enrollment.student_id ??
                enrollment.idStudent;

            const enrollmentPeriodId =
                enrollment.periodId ??
                enrollment.schoolPeriodId ??
                enrollment.periodoId;

            const status = normalize(
                enrollment.status ??
                enrollment.estado ??
                "activo"
            );


            return (
                String(enrolledStudentId) ===
                String(studentIdValue)
            )
            &&
            (
                !enrollmentPeriodId ||
                String(enrollmentPeriodId) ===
                String(period.id)
            )
            &&
            ![
                "inactivo",
                "inactive",
                "cancelado",
                "cancelled"
            ].includes(status)
            ;
        });
    }


    /* =====================================================
       OBTENER ESTUDIANTES VINCULADOS
       ===================================================== */

    function getLinkedStudents() {

        const tutor = currentTutor();

        if (!tutor) {

            return [];
        }

        const students =
            readArray(KEY.students);


        return students.filter(student => {

            const id = studentId(student);

            return (
                id != null &&
                isActive(student) &&
                linkedToTutor(student, tutor) &&
                enrolledThisPeriod(id)
            );
        });
    }


    /* =====================================================
       CALIFICACIONES
       ===================================================== */

    function gradesFor(studentIdValue) {

        const grades =
            readArray(KEY.grades);


        const record = grades.find(item => {

            const id =
                item.studentId ??
                item.student_id ??
                item.idStudent;

            return String(id) ===
                   String(studentIdValue);
        });


        if (!record) {

            return {
                first: null,
                second: null,
                third: null
            };
        }


        return {

            first: grade(
                record.first ??
                record.trimester1 ??
                record.trimestre1 ??
                record["1ro"]
            ),

            second: grade(
                record.second ??
                record.trimester2 ??
                record.trimestre2 ??
                record["2do"]
            ),

            third: grade(
                record.third ??
                record.trimester3 ??
                record.trimestre3 ??
                record["3ro"]
            )
        };
    }


    function grade(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return null;
        }

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : null;
    }


    /* =====================================================
       PROMEDIO GENERAL
       ===================================================== */

    function average(grades) {

        const values = [
            grades.first,
            grades.second,
            grades.third
        ]
        .filter(value => value !== null);


        if (!values.length) {

            return null;
        }


        const total =
            values.reduce(
                (sum, value) => sum + value,
                0
            );


        return total / values.length;
    }


    /* =====================================================
       DOCUMENTOS
       ===================================================== */

    function documentsFor(student) {

        const source = {

            ...(student.expediente || {}),

            ...(student.documents || {}),

            ...(student.documentos || {})
        };


        function has(...keys) {

            return keys.some(
                key => Boolean(source[key])
            );
        }


        return [

            {
                name: "Acta de nacimiento",
                confirmed: has(
                    "birthCertificate",
                    "actaNacimiento",
                    "acta_de_nacimiento"
                )
            },

            {
                name: "Cédula del tutor",
                confirmed: has(
                    "tutorId",
                    "tutorCedula",
                    "cedulaTutor",
                    "cedula_del_tutor"
                )
            },

            {
                name: "Foto 2x2",
                confirmed: has(
                    "photo2x2",
                    "foto2x2",
                    "foto",
                    "fotoCarnet"
                )
            },

            {
                name: "Carta de buena conducta",
                confirmed: has(
                    "goodConduct",
                    "cartaBuenaConducta",
                    "carta_de_buena_conducta"
                )
            },

            {
                name: "Certificado médico",
                confirmed: has(
                    "medicalCertificate",
                    "certificadoMedico",
                    "certificado_medico"
                )
            }

        ];
    }


    /* =====================================================
       MENSAJES
       ===================================================== */

    function showMessage(
        text,
        type = "success"
    ) {

        message.textContent = text;

        message.className =
            `portal-message ${type}`;


        clearTimeout(
            showMessage.timer
        );


        showMessage.timer = setTimeout(() => {

            message.textContent = "";

            message.className =
                "portal-message";

        }, 4500);
    }


    /* =====================================================
       RENDER PRINCIPAL
       ===================================================== */

    function render() {

        linkedStudents =
            getLinkedStudents();


        /* Sin estudiantes vinculados */

        if (!linkedStudents.length) {

            portalData.style.display = "none";

            portalEmpty.style.display = "block";

            selector.innerHTML = "";

            selector.disabled = true;

            return;
        }


        /* Con estudiantes */

        portalEmpty.style.display = "none";

        portalData.style.display = "grid";


        selector.innerHTML =
            linkedStudents.map(student => {

                return `
                    <option value="${escapeHtml(
                        studentId(student)
                    )}">
                        ${escapeHtml(
                            studentName(student)
                        )}
                    </option>
                `;

            }).join("");


        /* Mantener estudiante seleccionado */

        const selectedStillExists =
            linkedStudents.some(student =>
                String(studentId(student)) ===
                String(selectedStudentId)
            );


        if (!selectedStillExists) {

            selectedStudentId =
                studentId(linkedStudents[0]);
        }


        selector.value =
            selectedStudentId;


        selector.disabled =
            linkedStudents.length <= 1;


        const student =
            linkedStudents.find(item =>
                String(studentId(item)) ===
                String(selectedStudentId)
            );


        if (student) {

            renderStudent(student);
        }
    }


    /* =====================================================
       RENDER DEL ESTUDIANTE
       ===================================================== */

    function renderStudent(student) {

        const name =
            studentName(student);


        const grades =
            gradesFor(
                studentId(student)
            );


        const avg =
            average(grades);


        const tutor =
            currentTutor();


        /* Avatar */

        document.getElementById(
            "student-avatar"
        ).textContent =
            name
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word[0])
            .join("")
            .toUpperCase();


        /* Nombre */

        document.getElementById(
            "student-name"
        ).textContent = name;


        /* Curso / sección / tanda */

        const course =
            student.courseName ??
            student.course ??
            student.grade ??
            student.nivel ??
            "";


        const section =
            student.section ??
            student.seccion ??
            "";


        const shift =
            normalize(
                student.shift ??
                student.tanda ??
                ""
            );


        const shiftText =
            shift === "matutina"
                ? "Tanda Mañana"
                : shift === "vespertina"
                    ? "Tanda Tarde"
                    : "";


        const classText =
            [
                course,
                section
            ]
            .filter(Boolean)
            .join(" ");


        document.getElementById(
            "student-class"
        ).textContent =
            [classText, shiftText]
            .filter(Boolean)
            .join(" · ") ||
            "Matrícula activa";


        /* Tutor */

        const tutorName =
            tutor?.name ??
            tutor?.fullName ??
            tutor?.nombre ??
            student.tutorName ??
            "Tutor vinculado";


        document.getElementById(
            "student-tutor"
        ).textContent =
            `Encargado: ${tutorName}`;


        /* Teléfono */

        const phone =
            student.phone ??
            student.telefono ??
            student.tutorPhone ??
            student.guardianPhone;


        document.getElementById(
            "student-phone"
        ).textContent =
            phone ||
            "Teléfono no registrado";


        /* Promedio */

        document.getElementById(
            "student-average"
        ).textContent =
            avg === null
                ? "—"
                : avg.toFixed(2);


        /* Estado */

        const status =
            document.getElementById(
                "student-status"
            );


        if (avg === null) {

            status.textContent =
                "Sin notas";

        } else if (avg >= 10) {

            status.textContent =
                "Aprueba";

        } else {

            status.textContent =
                "No aprueba";
        }


        /* Trimestres */

        renderGrade(
            "grade-1",
            grades.first
        );

        renderGrade(
            "grade-2",
            grades.second
        );

        renderGrade(
            "grade-3",
            grades.third
        );


        /* Documentos */

        const documents =
            documentsFor(student);


        document.getElementById(
            "documents-list"
        ).innerHTML =
            documents.map(document => {

                return `
                    <div class="document-row">

                        <span>
                            ${escapeHtml(
                                document.name
                            )}
                        </span>

                        <span class="document-status ${
                            document.confirmed
                                ? "confirmed"
                                : "pending"
                        }">

                            ${
                                document.confirmed
                                    ? "Confirmada"
                                    : "Pendiente"
                            }

                        </span>

                    </div>
                `;

            }).join("");
    }


    /* =====================================================
       RENDER DE UNA NOTA
       ===================================================== */

    function renderGrade(
        elementId,
        value
    ) {

        const element =
            document.getElementById(
                elementId
            );


        if (value === null) {

            element.textContent =
                "Pendiente";

            element.classList.add(
                "pending"
            );

            return;
        }


        element.textContent =
            Number.isInteger(value)
                ? value
                : value.toFixed(2);


        element.classList.remove(
            "pending"
        );
    }


    /* =====================================================
       SOLICITAR ACTUALIZACIÓN
       ===================================================== */

    function requestUpdate() {

        const student =
            linkedStudents.find(item =>
                String(studentId(item)) ===
                String(selectedStudentId)
            );


        if (!student) {

            return;
        }


        const tutor =
            currentTutor();


        const requests =
            readArray(KEY.requests);


        const request = {

            id:
                `DOCREQ-${Date.now()}`,

            studentId:
                studentId(student),

            tutorId:
                tutor?.id ??
                tutor?.tutorId ??
                null,

            periodId:
                activePeriod().id,

            type:
                "actualizacion_documentos",

            status:
                "pendiente",

            createdAt:
                new Date().toISOString()
        };


        requests.push(request);


        localStorage.setItem(
            KEY.requests,
            JSON.stringify(requests)
        );


        showMessage(
            "La solicitud de actualización de documentos se envió correctamente.",
            "success"
        );
    }


    /* =====================================================
       ESCAPAR HTML
       ===================================================== */

    function escapeHtml(value) {

        return String(value ?? "")

            .replaceAll(
                "&",
                "&amp;"
            )

            .replaceAll(
                "<",
                "&lt;"
            )

            .replaceAll(
                ">",
                "&gt;"
            )

            .replaceAll(
                '"',
                "&quot;"
            )

            .replaceAll(
                "'",
                "&#039;"
            );
    }


    /* =====================================================
       CAMBIO DE ESTUDIANTE
       ===================================================== */

    selector.addEventListener(
        "change",
        () => {

            selectedStudentId =
                selector.value;

            render();
        }
    );


    /* =====================================================
       BOTÓN SOLICITUD
       ===================================================== */

    requestButton.addEventListener(
        "click",
        requestUpdate
    );


    /* =====================================================
       PERFIL DEMOSTRATIVO
       ===================================================== */

    const profile =
        document.getElementById(
            "profile-select"
        );


    if (profile) {

        profile.value = "Tutor";


        profile.addEventListener(
            "change",
            () => {

                if (
                    profile.value !==
                    "Tutor"
                ) {

                    profile.value =
                        "Tutor";


                    showMessage(
                        "El Portal tutor está disponible para el perfil Tutor.",
                        "error"
                    );
                }
            }
        );
    }


    /* =====================================================
       AÑO ESCOLAR
       ===================================================== */

    const period =
        activePeriod();


    const schoolYear =
        document.getElementById(
            "school-year"
        );


    if (schoolYear) {

        schoolYear.textContent =
            `Año escolar ${
                period.name ||
                "2026–2027"
            }`;
    }


    /* =====================================================
       INICIALIZAR
       ===================================================== */

    render();


    if (window.lucide) {

        lucide.createIcons();
    }

});