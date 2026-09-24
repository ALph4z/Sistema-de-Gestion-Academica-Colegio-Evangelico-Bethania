document.addEventListener("DOMContentLoaded", () => {
    const PAYMENTS_KEY = "edubethania_payments";
    const ENROLLMENTS_KEY = "edubethania_enrollments";

    const openPaymentModalBtn = document.getElementById("open-payment-modal");
    const paymentModal = document.getElementById("payment-modal");
    const closePaymentModalBtn = document.getElementById("close-payment-modal");
    const cancelPaymentBtn = document.getElementById("cancel-payment");
    const paymentForm = document.getElementById("payment-form");

    const paymentStudent = document.getElementById("payment-student");
    const paymentType = document.getElementById("payment-type");
    const paymentAmount = document.getElementById("payment-amount");
    const paymentStatus = document.getElementById("payment-status");
    const paymentFormMessage = document.getElementById("payment-form-message");

    const paymentsTableBody = document.getElementById("payments-table-body");
    const paymentsTotal = document.getElementById("payments-total");

    const receiptModal = document.getElementById("receipt-modal");
    const closeReceiptModalBtn = document.getElementById("close-receipt-modal");
    const receiptDetails = document.getElementById("receipt-details");
    const receiptDescription = document.getElementById("receipt-description");

    const toast = document.getElementById("toast");

    // ============================================================
    // DATOS DE DEMOSTRACIÓN
    // ============================================================

    const fallbackStudents = [
        {
            id: "ST-001",
            name: "Camila Núñez",
            enrollmentStatus: "Confirmada"
        },
        {
            id: "ST-002",
            name: "Sofía Martínez",
            enrollmentStatus: "Confirmada"
        },
        {
            id: "ST-003",
            name: "José Ramírez",
            enrollmentStatus: "Pendiente"
        },
        {
            id: "ST-004",
            name: "Luis Pérez",
            enrollmentStatus: "Pendiente"
        }
    ];

    const fallbackPayments = [
        {
            id: "PAY-001",
            receipt: "RC-2026-0048",
            studentId: "ST-001",
            studentName: "Camila Núñez",
            date: "2026-08-25",
            type: "Matrícula",
            amount: 8500,
            status: "Pagado"
        },
        {
            id: "PAY-002",
            receipt: "RC-2026-0049",
            studentId: "ST-002",
            studentName: "Sofía Martínez",
            date: "2026-08-25",
            type: "Mantenimiento",
            amount: 8500,
            status: "Pagado"
        }
    ];

    // ============================================================
    // UTILIDADES
    // ============================================================

    function getPayments() {
    const storedPayments = localStorage.getItem(PAYMENTS_KEY);

    if (!storedPayments) {
        localStorage.setItem(
            PAYMENTS_KEY,
            JSON.stringify(fallbackPayments)
        );

        return [...fallbackPayments];
    }

    try {
        const payments = JSON.parse(storedPayments);

        return Array.isArray(payments)
            ? payments
            : [...fallbackPayments];

    } catch (error) {
        console.error("Error leyendo los pagos:", error);

        return [...fallbackPayments];
    }
    }

    function savePayments(payments) {
        localStorage.setItem(
            PAYMENTS_KEY,
            JSON.stringify(payments)
        );
    }

    function getEnrollments() {
        const storedEnrollments = localStorage.getItem(ENROLLMENTS_KEY);

        if (!storedEnrollments) {
            return [];
        }

        try {
            const enrollments = JSON.parse(storedEnrollments);

            return Array.isArray(enrollments)
                ? enrollments
                : [];
        } catch (error) {
            console.error("Error leyendo las matrículas:", error);
            return [];
        }
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat("es-DO", {
            style: "currency",
            currency: "DOP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "";
        }

        const date = new Date(`${dateString}T00:00:00`);

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleDateString("es-DO", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function getToday() {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getCurrentPeriod() {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");

        return `${year}-${month}`;
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // ============================================================
    // ESTUDIANTES CON MATRÍCULA
    // ============================================================

    function buildStudents() {
        const enrollments = getEnrollments();

        /*
         * Si existen matrículas guardadas, utilizamos esas.
         * Solo los estudiantes con matrícula Confirmada o Completa
         * pueden registrar pagos.
         */

        if (enrollments.length > 0) {
            return enrollments
                .filter(enrollment => {
                    const status = String(
                        enrollment.status ||
                        enrollment.estado ||
                        enrollment.enrollmentStatus ||
                        ""
                    ).toLowerCase();

                    return (
                        status === "confirmada" ||
                        status === "completa"
                    );
                })
                .map(enrollment => {
                    const studentId =
                        enrollment.studentId ||
                        enrollment.student_id ||
                        enrollment.id ||
                        "";

                    const studentName =
                        enrollment.studentName ||
                        enrollment.student_name ||
                        enrollment.name ||
                        enrollment.student ||
                        "Estudiante";

                    return {
                        id: studentId,
                        name: studentName,
                        enrollmentStatus:
                            enrollment.status ||
                            enrollment.estado ||
                            "Confirmada"
                    };
                })
                .filter(student => student.id);
        }

        /*
         * Datos de demostración cuando todavía no existen
         * matrículas en localStorage.
         */

        return fallbackStudents.filter(student => {
            const status = String(
                student.enrollmentStatus || ""
            ).toLowerCase();

            return (
                status === "confirmada" ||
                status === "completa"
            );
        });
    }

    // ============================================================
    // CARGAR ESTUDIANTES EN EL SELECT
    // ============================================================

    function populateStudents() {
        if (!paymentStudent) {
            return;
        }

        const students = buildStudents();

        paymentStudent.innerHTML = `
            <option value="">Selecciona un estudiante</option>
        `;

        students.forEach(student => {
            const option = document.createElement("option");

            option.value = student.id;
            option.textContent = student.name;

            option.dataset.studentName = student.name;

            paymentStudent.appendChild(option);
        });
    }

    // ============================================================
    // COMPROBANTES
    // ============================================================

    function receiptExists(receiptNumber, payments) {
        return payments.some(
            payment => payment.receipt === receiptNumber
        );
    }

    function generateReceiptNumber(payments) {
        const currentYear = new Date().getFullYear();

        const prefix = `RC-${currentYear}-`;

        let highestNumber = 0;

        payments.forEach(payment => {
            const receipt = String(payment.receipt || "");

            if (!receipt.startsWith(prefix)) {
                return;
            }

            const numberPart = receipt.replace(prefix, "");
            const number = parseInt(numberPart, 10);

            if (!Number.isNaN(number) && number > highestNumber) {
                highestNumber = number;
            }
        });

        let nextNumber = highestNumber + 1;

        let receiptNumber =
            `${prefix}${String(nextNumber).padStart(4, "0")}`;

        /*
         * Si el número ya existe, seguimos incrementando
         * hasta encontrar uno disponible.
         */

        while (receiptExists(receiptNumber, payments)) {
            nextNumber++;

            receiptNumber =
                `${prefix}${String(nextNumber).padStart(4, "0")}`;
        }

        return receiptNumber;
    }

    // ============================================================
    // MODAL DE REGISTRO
    // ============================================================

    function openPaymentModal() {
        if (!paymentModal) {
            return;
        }

        populateStudents();

        clearPaymentForm();

        paymentModal.classList.add("active");
        paymentModal.removeAttribute("hidden");

        document.body.classList.add("modal-open");

        setTimeout(() => {
            if (paymentStudent) {
                paymentStudent.focus();
            }
        }, 50);
    }

    function closePaymentModal() {
        if (!paymentModal) {
            return;
        }

        paymentModal.classList.remove("active");
        paymentModal.setAttribute("hidden", "");

        document.body.classList.remove("modal-open");

        clearPaymentForm();
    }

    function clearPaymentForm() {
        if (paymentForm) {
            paymentForm.reset();
        }

        if (paymentFormMessage) {
            paymentFormMessage.textContent = "";
            paymentFormMessage.className = "payment-form-message";
        }
    }

    // ============================================================
    // VALIDACIÓN
    // ============================================================

    function showFormError(message) {
        if (!paymentFormMessage) {
            return;
        }

        paymentFormMessage.textContent = message;
        paymentFormMessage.className =
            "payment-form-message error";
    }

    function clearFormError() {
        if (!paymentFormMessage) {
            return;
        }

        paymentFormMessage.textContent = "";
        paymentFormMessage.className =
            "payment-form-message";
    }

    function validatePaymentForm() {
        clearFormError();

        const studentId = paymentStudent
            ? paymentStudent.value
            : "";

        const type = paymentType
            ? paymentType.value
            : "";

        const amountValue = paymentAmount
            ? paymentAmount.value
            : "";

        const status = paymentStatus
            ? paymentStatus.value
            : "";

        if (!studentId) {
            showFormError(
                "Debes seleccionar un estudiante."
            );

            return false;
        }

        const students = buildStudents();

        const student = students.find(
            item => String(item.id) === String(studentId)
        );

        if (!student) {
            showFormError(
                "El estudiante seleccionado no tiene una matrícula asociada."
            );

            return false;
        }

        const studentStatus = String(
            student.enrollmentStatus || ""
        ).toLowerCase();

        if (
            studentStatus !== "confirmada" &&
            studentStatus !== "completa"
        ) {
            showFormError(
                "El estudiante debe tener una matrícula confirmada o completa."
            );

            return false;
        }

        const allowedTypes = [
            "Matrícula",
            "Mantenimiento",
            "Libro",
            "Uniforme",
            "Otro"
        ];

        if (!allowedTypes.includes(type)) {
            showFormError(
                "Debes seleccionar un tipo de pago válido."
            );

            return false;
        }

        const amount = Number(amountValue);

        if (!amountValue || Number.isNaN(amount)) {
            showFormError(
                "Debes indicar el monto del pago."
            );

            return false;
        }

        if (amount <= 0) {
            showFormError(
                "El monto debe ser mayor que RD$0."
            );

            return false;
        }

        if (!status) {
            showFormError(
                "Debes seleccionar el estado del pago."
            );

            return false;
        }

        if (
            status !== "Pagado" &&
            status !== "Pendiente"
        ) {
            showFormError(
                "El estado seleccionado no es válido."
            );

            return false;
        }

        return true;
    }

    // ============================================================
    // GUARDAR PAGO
    // ============================================================

    function savePayment(event) {
        event.preventDefault();

        if (!validatePaymentForm()) {
            return;
        }

        const students = buildStudents();

        const student = students.find(
            item =>
                String(item.id) ===
                String(paymentStudent.value)
        );

        if (!student) {
            showFormError(
                "No se encontró el estudiante seleccionado."
            );

            return;
        }

        const payments = getPayments();

        const receiptNumber =
            generateReceiptNumber(payments);

        const newPayment = {
            id: `PAY-${Date.now()}`,

            receipt: receiptNumber,

            studentId: student.id,

            studentName: student.name,

            date: getToday(),

            type: paymentType.value,

            amount: Number(paymentAmount.value),

            status: paymentStatus.value
        };

        payments.push(newPayment);

        savePayments(payments);

        renderPayments();
        updateTotal();

        closePaymentModal();

        showToast(
            "El pago se registró sin problemas."
        );
    }

    // ============================================================
    // RENDERIZAR TABLA
    // ============================================================

    function renderPayments() {
        if (!paymentsTableBody) {
            return;
        }

        const payments = getPayments();

        /*
         * Los pagos más recientes aparecen primero.
         */

        payments.sort((a, b) => {
            const dateA = new Date(
                `${a.date}T00:00:00`
            );

            const dateB = new Date(
                `${b.date}T00:00:00`
            );

            return dateB - dateA;
        });

        paymentsTableBody.innerHTML = "";

        if (payments.length === 0) {
            const emptyRow =
                document.createElement("tr");

            emptyRow.innerHTML = `
                <td colspan="7" class="empty-table">
                    No hay pagos registrados.
                </td>
            `;

            paymentsTableBody.appendChild(emptyRow);

            return;
        }

        payments.forEach(payment => {
            const row =
                document.createElement("tr");

            const statusClass =
                payment.status === "Pagado"
                    ? "badge-success"
                    : "badge-warning";

            row.innerHTML = `
                <td>
                    <strong>
                        ${escapeHtml(payment.receipt)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(payment.studentName)}
                </td>

                <td>
                    ${escapeHtml(formatDate(payment.date))}
                </td>

                <td>
                    ${escapeHtml(payment.type)}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            formatCurrency(payment.amount)
                        )}
                    </strong>
                </td>

                <td>
                    <span class="badge ${statusClass}">
                        ${escapeHtml(payment.status)}
                    </span>
                </td>

                <td>
                    <button
                        type="button"
                        class="btn-table"
                        data-receipt="${escapeHtml(
                            payment.receipt
                        )}"
                    >
                        Ver
                    </button>
                </td>
            `;

            paymentsTableBody.appendChild(row);
        });

        /*
         * Eventos para los botones "Ver".
         */

        const viewButtons =
            paymentsTableBody.querySelectorAll(
                ".btn-table"
            );

        viewButtons.forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const receipt =
                        button.dataset.receipt;

                    openReceipt(receipt);
                }
            );
        });

        /*
         * Actualizamos los iconos de Lucide si están disponibles.
         */

        if (
            window.lucide &&
            typeof window.lucide.createIcons === "function"
        ) {
            window.lucide.createIcons();
        }
    }

    // ============================================================
    // TOTAL RECAUDADO
    // ============================================================

    function updateTotal() {
    if (!paymentsTotal) {
        return;
    }

    const payments = getPayments();

    const total = payments.reduce(
        (sum, payment) => {
            return sum + Number(payment.amount || 0);
        },
        0
    );

    paymentsTotal.textContent =
        formatCurrency(total);
}

    // ============================================================
    // DETALLE DEL COMPROBANTE
    // ============================================================

    function openReceipt(receiptNumber) {
        const payments = getPayments();

        const payment = payments.find(
            item =>
                item.receipt === receiptNumber
        );

        if (!payment) {
            showToast(
                "No se encontró el comprobante."
            );

            return;
        }

        if (receiptDetails) {
            receiptDetails.innerHTML = `
                <div class="receipt-detail-grid">

                    <div>
                        <span>Comprobante</span>
                        <strong>
                            ${escapeHtml(payment.receipt)}
                        </strong>
                    </div>

                    <div>
                        <span>Estudiante</span>
                        <strong>
                            ${escapeHtml(payment.studentName)}
                        </strong>
                    </div>

                    <div>
                        <span>Fecha</span>
                        <strong>
                            ${escapeHtml(
                                formatDate(payment.date)
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Tipo de pago</span>
                        <strong>
                            ${escapeHtml(payment.type)}
                        </strong>
                    </div>

                    <div>
                        <span>Monto</span>
                        <strong>
                            ${escapeHtml(
                                formatCurrency(
                                    payment.amount
                                )
                            )}
                        </strong>
                    </div>

                    <div>
                        <span>Estado</span>
                        <strong>
                            ${escapeHtml(payment.status)}
                        </strong>
                    </div>

                </div>
            `;
        }

        if (receiptDescription) {
            receiptDescription.textContent =
                "Detalle del pago registrado.";
        }

        if (receiptModal) {
            receiptModal.classList.add("active");
            receiptModal.removeAttribute("hidden");

            document.body.classList.add(
                "modal-open"
            );
        }
    }

    function closeReceiptModal() {
        if (!receiptModal) {
            return;
        }

        receiptModal.classList.remove("active");
        receiptModal.setAttribute("hidden", "");

        document.body.classList.remove(
            "modal-open"
        );
    }

    // ============================================================
    // TOAST
    // ============================================================

    function showToast(message) {
        if (!toast) {
            return;
        }

        toast.textContent = message;

        toast.classList.add("show");

        clearTimeout(
            showToast.timeout
        );

        showToast.timeout =
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3500);
    }

    // ============================================================
    // EVENTOS
    // ============================================================

    if (openPaymentModalBtn) {
        openPaymentModalBtn.addEventListener(
            "click",
            openPaymentModal
        );
    }

    if (closePaymentModalBtn) {
        closePaymentModalBtn.addEventListener(
            "click",
            closePaymentModal
        );
    }

    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener(
            "click",
            closePaymentModal
        );
    }

    if (paymentForm) {
        paymentForm.addEventListener(
            "submit",
            savePayment
        );
    }

    if (closeReceiptModalBtn) {
        closeReceiptModalBtn.addEventListener(
            "click",
            closeReceiptModal
        );
    }

    /*
     * Cerrar los modales haciendo clic fuera
     * de su contenido.
     */

    if (paymentModal) {
        paymentModal.addEventListener(
            "click",
            event => {
                if (
                    event.target === paymentModal
                ) {
                    closePaymentModal();
                }
            }
        );
    }

    if (receiptModal) {
        receiptModal.addEventListener(
            "click",
            event => {
                if (
                    event.target === receiptModal
                ) {
                    closeReceiptModal();
                }
            }
        );
    }

    /*
     * Cerrar con la tecla Escape.
     */

    document.addEventListener(
        "keydown",
        event => {
            if (event.key !== "Escape") {
                return;
            }

            if (
                paymentModal &&
                paymentModal.classList.contains("active")
            ) {
                closePaymentModal();
            }

            if (
                receiptModal &&
                receiptModal.classList.contains("active")
            ) {
                closeReceiptModal();
            }
        }
    );

    // ============================================================
    // INICIALIZACIÓN
    // ============================================================

    populateStudents();

    renderPayments();

    updateTotal();

    /*
     * Inicializar iconos Lucide.
     */

    if (
        window.lucide &&
        typeof window.lucide.createIcons === "function"
    ) {
        window.lucide.createIcons();
    }
});