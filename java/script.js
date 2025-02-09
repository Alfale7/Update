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

function downloadAsImage() {
    const container = document.querySelector('.container');
    if (!container) return alert('العنصر غير موجود');

    // 🟢 إخفاء الأزرار أثناء التحميل
    const buttons = document.querySelectorAll('button, .buttons-container, .download, .exit-buttons');
    buttons.forEach(button => button.style.display = 'none');

    // 🟢 تثبيت حجم صندوق الشواهد لمنع التمدد
    const shahidContainer = document.querySelector('.shahid-container');
    if (shahidContainer) {
        shahidContainer.style.maxHeight = `${shahidContainer.offsetHeight}px`;
        shahidContainer.style.overflow = 'hidden';
    }

    // 🟢 تحويل الحقول النصية إلى نصوص ثابتة
    const inputs = container.querySelectorAll('input, textarea');
    const tempElements = [];

    inputs.forEach(input => {
        const textElement = document.createElement('div');
        textElement.textContent = input.value || input.placeholder;
        textElement.style.cssText = `
            width: ${input.offsetWidth}px;
            height: ${input.offsetHeight}px;
            font-size: ${window.getComputedStyle(input).fontSize};
            font-family: ${window.getComputedStyle(input).fontFamily};
            color: #000;
            background-color: white;
            text-align: ${input.style.textAlign || 'right'};
            display: flex;
            align-items: center;
            justify-content: ‏right;
            border: 1px solid #ccc;
            padding: 5px;
            border-radius: 5px;
            position: absolute;
            left: ${input.getBoundingClientRect().left}px;
            top: ${input.getBoundingClientRect().top}px;
        `;
        textElement.className = 'temp-text';
        container.appendChild(textElement);
        tempElements.push(textElement);
        input.style.visibility = 'hidden';
    });

    // 🟢 تحويل الصفحة إلى صورة باستخدام html2canvas
    html2canvas(container, { scale: 3, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'report.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // 🟢 إعادة الأزرار والحقول النصية لحالتها الطبيعية
        buttons.forEach(button => button.style.display = 'flex');
        if (shahidContainer) {
            shahidContainer.style.maxHeight = '';
            shahidContainer.style.overflow = '';
        }

        inputs.forEach(input => input.style.visibility = 'visible');
        tempElements.forEach(el => el.remove());
    }).catch(error => {
        console.error('❌ خطأ أثناء إنشاء الصورة:', error);
        buttons.forEach(button => button.style.display = 'flex');
    });
}


// 🟢 وظيفة تحميل التقرير كـ PDF مع ضبط الأبعاد تلقائيًا
function downloadAsPDF() {
    const container = document.querySelector('.container');
    if (!container) return alert('العنصر غير موجود');

    // 🟢 تحويل الصفحة إلى صورة ثم إلى PDF
    html2canvas(container, { scale: 4, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210; // عرض الورقة A4 بالـ mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // حساب الطول بناءً على العرض

        // ✅ التحقق مما إذا كانت الصورة أطول من صفحة واحدة
        let pageHeight = 297; // ارتفاع صفحة A4 بالـ mm
        let heightLeft = imgHeight;
        let yPosition = 0;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, yPosition, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // ✅ إذا كان المحتوى أطول من صفحة A4، يتم تقسيمه إلى عدة صفحات
        while (heightLeft > 0) {
            yPosition -= pageHeight;
            pdf.addPage();
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, yPosition, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('report.pdf');
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