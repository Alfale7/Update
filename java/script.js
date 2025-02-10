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
    if (!container) {
        alert('Container not found!');
        return;
    }

    // 🟢 إخفاء جميع الأزرار بطريقة لا تؤثر على التصميم
    const buttons = document.querySelectorAll('.buttons-container, .download, .exit-buttons, button');
    buttons.forEach(button => button.style.visibility = 'hidden');

    // 🟢 إصلاح تمدد الشواهد عن طريق حفظ حجمها الأصلي
    const shahidElements = document.querySelectorAll('.shahid');
    const shahidSizes = [];
    
    shahidElements.forEach((shahid, index) => {
        shahidSizes[index] = {
            width: shahid.offsetWidth + "px",
            height: shahid.offsetHeight + "px"
        };
        shahid.style.width = shahidSizes[index].width;
        shahid.style.height = shahidSizes[index].height;
        shahid.style.overflow = 'hidden';
    });

    const inputs = container.querySelectorAll('input, textarea');
    const tempElements = [];

    inputs.forEach(input => {
        const rect = input.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(input);

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
        textElement.style.display = 'flex';
        textElement.style.alignItems = 'center';
        textElement.style.padding = '5px';
        textElement.style.whiteSpace = 'pre-wrap'; // منع التمدد غير الطبيعي
        textElement.style.overflow = 'hidden';
        textElement.textContent = input.value || input.placeholder;
        textElement.className = 'temp-element';

        container.appendChild(textElement);
        tempElements.push(textElement);

        input.style.visibility = 'hidden';
    });

    html2canvas(container, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'report.jpg';
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();

        // 🟢 إعادة الأزرار بعد التحميل
        buttons.forEach(button => button.style.visibility = 'visible');

        // 🟢 إعادة حجم الشواهد إلى الوضع الطبيعي
        shahidElements.forEach((shahid, index) => {
            shahid.style.width = '';
            shahid.style.height = '';
            shahid.style.overflow = '';
        });

        inputs.forEach(input => (input.style.visibility = 'visible'));
        tempElements.forEach(el => el.remove());
    }).catch(error => {
        console.error('Error generating image:', error);
        buttons.forEach(button => button.style.visibility = 'visible');
    });
}


// 🟢 وظيفة تحميل التقرير كـ PDF مع ضبط الأبعاد تلقائيًا

function downloadAsPDF() {
    const container = document.querySelector('.container');
    if (!container) return alert('العنصر غير موجود');

    // 🟢 استبدال المدخلات بنصوص ثابتة قبل التحويل
    const inputs = container.querySelectorAll('input, textarea');
    const tempElements = [];

    inputs.forEach(input => {
        const textElement = document.createElement('div');
        textElement.textContent = input.value || input.placeholder;
        textElement.style.cssText = `
            position: absolute;
            width: ${input.offsetWidth}px;
            height: ${input.offsetHeight}px;
            font-size: ${window.getComputedStyle(input).fontSize};
            font-family: ${window.getComputedStyle(input).fontFamily};
            color: black;
            text-align: right;
            line-height: ${window.getComputedStyle(input).lineHeight};
            display: flex;
            align-items: center;
            justify-content: right;
            padding: 5px;
        `;
        textElement.className = 'temp-text';
        textElement.style.right = `${input.getBoundingClientRect().right - container.getBoundingClientRect().right}px`;
        textElement.style.top = `${input.getBoundingClientRect().top - container.getBoundingClientRect().top}px`;

        container.appendChild(textElement);
        tempElements.push(textElement);
        input.style.visibility = 'hidden';
    });

    // 🟢 التقاط الصورة وتحويلها إلى PDF
    html2canvas(container, { scale: 3, useCORS: true, backgroundColor: '#ffffff' }).then(canvas => {
        const imageData = canvas.toDataURL('image/png');

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210; // عرض الورقة A4 بالـ mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // الحفاظ على نسبة الأبعاد

        pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('report.pdf');

        // 🟢 إعادة الأزرار والحقول إلى وضعها الطبيعي
        inputs.forEach(input => input.style.visibility = 'visible');
        tempElements.forEach(el => el.remove());
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