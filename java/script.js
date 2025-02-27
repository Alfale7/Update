// 🟢 تحديد منطقة الشواهد
const shahidGrid = document.getElementById("shahid-grid");

// 🟢 وظيفة إزالة الشاهد
function removeShahid(id) {
    const shahid = document.getElementById(id);
    if (shahid) {
        shahid.remove();
    }
}

// 🟢 وظيفة إضافة شاهد جديد
function addShahid() {
    if (!shahidGrid) return;

    const newId = `shahid${shahidGrid.children.length + 1}`;
    const newShahid = document.createElement("div");
    newShahid.className = "shahid";
    newShahid.id = newId;

    newShahid.innerHTML = `
        <input type="file" id="${newId}Input" accept="image/*" onchange="displayImage(event, '${newId}')">
        <img src="" alt="شاهد جديد">
        <button class="remove-btn" onclick="removeShahid('${newId}')">حذف</button>
    `;
    shahidGrid.appendChild(newShahid);
}

// 🟢 وظيفة رفع الصورة
function toggleFileInput(id) {
    const fileInput = document.getElementById(id);
    if (fileInput) {
        fileInput.click();
    }
}

// 🟢 وظيفة عرض الصورة
function displayImage(event, id) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.querySelector(`#${id} img`);
            if (img) img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// 🟢 وظيفة تحميل التقرير كصورة (موجودة مسبقًا في مشروعك)
function downloadAsImage() {
    const container = document.querySelector('.container');
    if (!container) {
        alert('Container not found!');
        return;
    }

    // إخفاء الأزرار
    const buttons = document.querySelectorAll('.buttons-container, .download, .exit-buttons, button');
    buttons.forEach(button => button.style.visibility = 'hidden');

    // تحويل حقول الإدخال إلى عناصر نصية
    const inputs = container.querySelectorAll('input, textarea');
    const tempElements = [];

    inputs.forEach(input => {
        const rect = input.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(input);

        // عنصر نصي مؤقت يحل محل الحقل
        const textElement = document.createElement('div');
        textElement.style.position = 'absolute';
        textElement.style.left = `${rect.left - containerRect.left}px`;
        textElement.style.top = `${rect.top - containerRect.top}px`;
        textElement.style.width = `${rect.width}px`;
        textElement.style.height = `${rect.height}px`;
        textElement.style.fontSize = computedStyle.fontSize;
        textElement.style.fontFamily = computedStyle.fontFamily;
        textElement.style.color = computedStyle.color;
        textElement.style.textAlign = 'right';
        textElement.style.direction = 'rtl';
        textElement.style.lineHeight = computedStyle.lineHeight;
        textElement.style.padding = '5px';
        textElement.style.display = 'flex';
        textElement.style.alignItems = 'center';
        textElement.style.fontWeight = 'bold';
        textElement.style.whiteSpace = 'nowrap';
        textElement.style.overflow = 'hidden';

        textElement.textContent = input.value || input.placeholder;
        textElement.className = 'temp-element';

        container.appendChild(textElement);
        tempElements.push(textElement);

        // إخفاء الحقل الأصلي
        input.style.visibility = 'hidden';
    });

    // التقاط الصورة
    html2canvas(container, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // إنشاء رابط لتحميل الصورة
        const link = document.createElement('a');
        link.download = 'report.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
    }).catch(error => {
        console.error('Error generating image:', error);
    }).finally(() => {
        // إعادة الأزرار والحقول كما كانت
        buttons.forEach(button => button.style.visibility = 'visible');
        inputs.forEach(input => (input.style.visibility = 'visible'));
        tempElements.forEach(el => el.remove());
    });
}

// 🟢 وظيفة تحميل التقرير كـ PDF (جديدة)
async function downloadAsPDF() {
    const container = document.querySelector('.container');
    if (!container) {
        alert('Container not found!');
        return;
    }

    // إخفاء الأزرار
    const buttons = document.querySelectorAll('.buttons-container, .download, .exit-buttons, button');
    buttons.forEach(button => button.style.visibility = 'hidden');

    // تحويل حقول الإدخال إلى عناصر نصية
    const inputs = container.querySelectorAll('input, textarea');
    const tempElements = [];

    inputs.forEach(input => {
        const rect = input.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(input);

        // عنصر نصي مؤقت
        const textElement = document.createElement('div');
        textElement.style.position = 'absolute';
        textElement.style.left = `${rect.left - containerRect.left}px`;
        textElement.style.top = `${rect.top - containerRect.top}px`;
        textElement.style.width = `${rect.width}px`;
        textElement.style.height = `${rect.height}px`;
        textElement.style.fontSize = computedStyle.fontSize;
        textElement.style.fontFamily = computedStyle.fontFamily;
        textElement.style.color = computedStyle.color;
        textElement.style.textAlign = 'right';
        textElement.style.direction = 'rtl';
        textElement.style.lineHeight = computedStyle.lineHeight;
        textElement.style.padding = '5px';
        textElement.style.display = 'flex';
        textElement.style.alignItems = 'center';
        textElement.style.fontWeight = 'bold';
        textElement.style.whiteSpace = 'nowrap';
        textElement.style.overflow = 'hidden';

        textElement.textContent = input.value || input.placeholder;
        textElement.className = 'temp-element';

        container.appendChild(textElement);
        tempElements.push(textElement);

        // إخفاء الحقل الأصلي
        input.style.visibility = 'hidden';
    });

    try {
        // التقاط الصورة عبر html2canvas
        const canvas = await html2canvas(container, {
            scale: 3,
            useCORS: true,
            backgroundColor: '#ffffff'
        });

        // إنشاء كائن jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4'); // الاتجاه عمودي، القياس بالنقاط، حجم الورقة A4

        // حساب عرض وارتفاع صفحة الـPDF
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // أبعاد الـcanvas الناتج
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // إيجاد النسبة المناسبة لتصغير الـcanvas حتى يحت fit داخل صفحة الـPDF
        const ratio = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);

        // الأبعاد النهائية للعرض داخل الـPDF
        const pdfWidth = canvasWidth * ratio;
        const pdfHeight = canvasHeight * ratio;

        // إضافة الصورة للـPDF
        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

        // حفظ الملف
        pdf.save('report.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        // إعادة الأزرار والحقول كما كانت
        buttons.forEach(button => button.style.visibility = 'visible');
        inputs.forEach(input => (input.style.visibility = 'visible'));
        tempElements.forEach(el => el.remove());
    }
}

// 🟢 بيانات تسجيل الدخول
const users = {
    "0504854223": "1234",
    "0506399549": "1234",
    "0551234567": "3344",
    "0530490887": "1234",
    "0531415531": "1234",
    "0558176875": "1234",
    "0559357091": "1234",
    "0503393365": "1234",
    "0536183076": "1234",
    "0504864020": "1234",
    "0556003663": "1234",
    "0568861023": "1234"
};

// 🟢 وظيفة تسجيل الدخول
function login(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة

    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorElement = document.getElementById('error'); 

    if (!phone || !password) {
        showError("يرجى تعبئة جميع الحقول.", errorElement);
        return false;
    }

    if (users[phone] && users[phone] === password) {
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('userPhone', phone);
        window.location.href = "choose.html"; // ✅ يوجه المستخدم إلى صفحة النماذج
        return false;
    } else {
        showError("رقم الجوال أو كلمة المرور غير صحيحة.", errorElement);
        return false;
    }
}

// 🟢 وظيفة عرض رسالة الخطأ
function showError(message, element) {
    if (element) {
        element.textContent = message;
        element.style.color = "red";
        element.style.display = "block";
        setTimeout(() => { element.style.display = "none"; }, 3000);
    }
}