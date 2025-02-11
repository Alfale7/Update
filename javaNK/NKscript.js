// 🟢 التأكد من وجود منطقة الشواهد
const shahidGrid = document.getElementById("shahid-grid");

// 🟢 وظيفة إضافة شاهد جديد
function addShahid() {
    if (!shahidGrid) return;

    const newId = `shahid${shahidGrid.children.length + 1}`;
    const newShahid = document.createElement("div");
    newShahid.className = "shahid";
    newShahid.id = newId;

    // 🔹 إنشاء عنصر إدخال (ملف) لاختيار الصورة
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    // 🔹 إنشاء صورة افتراضية داخل الشاهد
    const img = document.createElement("img");
    img.src = "";
    img.alt = "اضغط لاختيار صورة";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";

    // 🔹 عند النقر على الشاهد، يفتح اختيار الصور
    newShahid.addEventListener("click", () => fileInput.click());

    // 🔹 عند تحديد صورة، يتم عرضها داخل الشاهد
    fileInput.addEventListener("change", (event) => displayImage(event, newId));

    // 🔹 زر الحذف
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = ""; // ✅ الإبقاء على X فقط

    // ✅ عند النقر على زر الحذف، يتم حذف العنصر الصحيح
    removeBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // ✅ منع تشغيل أي أحداث أخرى عند الضغط
        newShahid.remove(); // ✅ حذف العنصر مباشرة
    });

    // ✅ إضافة العناصر إلى الشاهد الجديد
    newShahid.appendChild(removeBtn);
    newShahid.appendChild(fileInput);
    newShahid.appendChild(img);
    
    // ✅ إضافة الشاهد إلى الصفحة
    shahidGrid.appendChild(newShahid);
}

// 🟢 وظيفة عرض الصورة داخل الشاهد
function displayImage(event, id) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.querySelector(`#${id} img`).src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// ✅ التأكد من تشغيل زر "إضافة شاهد جديد" عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
    const addButton = document.querySelector(".add-shahid-button");
    if (addButton) {
        addButton.addEventListener("click", addShahid);
    } else {
        console.error("🔴 زر إضافة الشاهد غير موجود!");
    }
});


// 🟢 وظيفة تحميل التقرير كصورة
function downloadAsImage() {
    const container = document.querySelector('.container');
    if (!container) {
        alert('Container not found!');
        return;
    }

    // 🟢 إخفاء جميع الأزرار أثناء التصوير
    const buttons = document.querySelectorAll('.buttons-container, .download, .exit-buttons, button');
    buttons.forEach(button => button.style.visibility = 'hidden');

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
        textElement.style.padding = '5px';

        // ✅ تحسين تنسيق النص ليكون واضحًا بعد التحميل
        textElement.style.display = 'flex';
        textElement.style.alignItems = 'center';
        textElement.style.justifyContent = 'flex-start';
        textElement.style.fontWeight = 'bold';
        textElement.style.whiteSpace = 'nowrap';
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

        inputs.forEach(input => (input.style.visibility = 'visible'));
        tempElements.forEach(el => el.remove());
    }).catch(error => {
        console.error('Error generating image:', error);
        buttons.forEach(button => button.style.visibility = 'visible');
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
    "0536183076": "1234",
    "0504864020": "1234"
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




