// تحديد منطقة الشواهد
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

// 🟢 وظيفة تحميل التقرير كصورة أو PDF
function downloadAsImage() {
    const container = document.querySelector('.container');
    if (!container) return alert('العنصر غير موجود');

    // 🟢 إخفاء الأزرار أثناء التحميل
    const buttons = document.querySelectorAll('button, .buttons-container, .download, .exit-buttons');
    buttons.forEach(button => button.style.display = 'none');

    // 🟢 تحويل التقرير إلى صورة باستخدام html2canvas
    html2canvas(container, { scale: 3, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');

        // ✅ حفظ كصورة
        const link = document.createElement('a');
        link.download = 'report.png';
        link.href = imageData;
        link.click();

        // ✅ حفظ كـ PDF
        generatePDF(imageData);

        // 🟢 إعادة الأزرار لوضعها الطبيعي
        buttons.forEach(button => button.style.display = 'block');
    }).catch(error => {
        console.error('❌ خطأ أثناء إنشاء الصورة:', error);
        buttons.forEach(button => button.style.display = 'block');
    });
}

// 🟢 وظيفة تحميل التقرير كـ PDF
function generatePDF(imageData) {
    const { jsPDF } = window.jspdf; // التأكد من استدعاء jsPDF بشكل صحيح
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgWidth = 210; // عرض الورقة A4 بالـ mm
    const imgHeight = (297 * imgWidth) / 210; // نسبة الارتفاع للحفاظ على الأبعاد الصحيحة

    pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('report.pdf');
}

// 🟢 زر تحميل PDF مستقل
function downloadAsPDF() {
    const container = document.querySelector('.container');
    if (!container) return alert('العنصر غير موجود');

    html2canvas(container, { scale: 3, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');
        generatePDF(imageData);
    }).catch(error => {
        console.error('❌ خطأ أثناء إنشاء PDF:', error);
    });
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
    "0536183076": "1234"
};

// 🟢 وظيفة تسجيل الدخول
function login(event) {
    event.preventDefault(); // منع إرسال النموذج الافتراضي

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
        window.location.href = "choose.html";
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