document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const progressFill = document.getElementById('progress-fill');
  const progressPercent = document.getElementById('progress-percent');

  // إعدادات قواعد التحقق والتلميحات الخاصة بكل دولة
  const countryConfigs = {
    '+966': { placeholder: '5xxxxxxxx', pattern: /^5[0-9]{8}$/, example: '512345678' }, // السعودية
    '+962': { placeholder: '7xxxxxxxx', pattern: /^7[0-9]{8}$/, example: '781234567' }, // الأردن
    '+20':  { placeholder: '1xxxxxxxxx', pattern: /^1[0-9]{9}$/, example: '1012345678' }, // مصر
    '+971': { placeholder: '5xxxxxxxx', pattern: /^5[0-9]{8}$/, example: '501234567' }, // الإمارات
    '+970': { placeholder: '5xxxxxxxx', pattern: /^5[0-9]{8}$/, example: '591234567' }  // فلسطين
  };

  // تعريف الحقول وقواعد التحقق الخاصة بكل حقل
  const fields = {
    name: {
      el: document.getElementById('full-name'),
      errEl: document.getElementById('err-name'),
      group: document.getElementById('group-name'),
      validate: (val) => val.trim().length >= 3
    },
    email: {
      el: document.getElementById('email'),
      errEl: document.getElementById('err-email'),
      group: document.getElementById('group-email'),
      validate: (val) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val.trim());
      }
    },
    phone: {
      el: document.getElementById('phone'),
      countryEl: document.getElementById('country-code'),
      errEl: document.getElementById('err-phone'),
      group: document.getElementById('group-phone'),
      validate: (val, countryCode) => {
        const cleanVal = val.trim().replace(/[\s-]/g, '');
        const config = countryConfigs[countryCode];
        if (config) {
          return config.pattern.test(cleanVal);
        }
        return cleanVal.length >= 7; // احتياطي في حال لم تطابق القائمة
      }
    },
    age: {
      el: document.getElementById('age'),
      errEl: document.getElementById('err-age'),
      group: document.getElementById('group-age'),
      validate: (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1 && num <= 120;
      }
    },
    city: {
      el: document.getElementById('city'),
      errEl: document.getElementById('err-city'),
      group: document.getElementById('group-city'),
      validate: (val) => val !== '' && val !== null
    }
  };

  // تحديث التلميح ورسالة الخطأ بناءً على رمز الدولة المختار
  function updatePhonePlaceholder() {
    const selectedCode = fields.phone.countryEl.value;
    const config = countryConfigs[selectedCode];
    if (config) {
      fields.phone.el.placeholder = config.placeholder;
      fields.phone.errEl.textContent = `يرجى إدخال رقم هاتف صحيح متوافق مع صيغة الدولة (مثال: ${config.example})`;
    }
  }

  // استدعاء أولي لتحديد التلميح المناسب
  updatePhonePlaceholder();

  // الاستماع لتغيير رمز الدولة
  fields.phone.countryEl.addEventListener('change', () => {
    updatePhonePlaceholder();
    // التحقق مجدداً إذا كان هناك رقم مكتوب بالفعل
    if (fields.phone.el.value.trim() !== '') {
      validateField('phone', true);
    }
    updateProgress();
  });

  // التحقق من صحة حقل معين وتحديث المظهر
  function validateField(key, showErrors = true) {
    const field = fields[key];
    let isValid = false;

    if (key === 'phone') {
      isValid = field.validate(field.el.value, field.countryEl.value);
    } else {
      isValid = field.validate(field.el.value);
    }

    if (isValid) {
      field.group.classList.remove('error');
      field.group.classList.add('success');
      if (showErrors) {
        field.errEl.style.display = 'none';
      }
      return true;
    } else {
      field.group.classList.remove('success');
      if (showErrors) {
        field.group.classList.add('error');
        field.errEl.style.display = 'flex';
      }
      return false;
    }
  }

  // تحديث شريط تقدم تعبئة النموذج
  function updateProgress() {
    let validCount = 0;
    const totalFields = Object.keys(fields).length;

    Object.keys(fields).forEach((key) => {
      let isValid = false;
      if (key === 'phone') {
        isValid = fields[key].validate(fields[key].el.value, fields[key].countryEl.value);
      } else {
        isValid = fields[key].validate(fields[key].el.value);
      }
      if (isValid) {
        validCount++;
      }
    });

    const percentage = Math.round((validCount / totalFields) * 100);
    progressFill.style.width = `${percentage}%`;
    progressPercent.textContent = `${percentage}%`;
  }

  // ربط الأحداث للحقول للتفاعل اللحظي
  Object.keys(fields).forEach((key) => {
    const field = fields[key];

    // الاستماع للتغييرات لتحديث شريط التقدم والتحقق
    field.el.addEventListener('input', () => {
      updateProgress();
      let isValid = false;
      if (key === 'phone') {
        isValid = field.validate(field.el.value, field.countryEl.value);
      } else {
        isValid = field.validate(field.el.value);
      }
      if (field.group.classList.contains('error') || isValid) {
        validateField(key, true);
      }
    });

    // التحقق عند خروج التركيز من الحقل (blur)
    field.el.addEventListener('blur', () => {
      if (field.el.value.trim() !== '') {
        validateField(key, true);
      }
    });
  });

  // معالجة إرسال النموذج
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    Object.keys(fields).forEach((key) => {
      const isValid = validateField(key, true);
      if (!isValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      successModal.classList.add('active');
    }
  });

  // إغلاق النافذة المنبثقة وإعادة تعيين النموذج
  modalCloseBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    form.reset();
    
    Object.keys(fields).forEach((key) => {
      fields[key].group.classList.remove('success', 'error');
      fields[key].errEl.style.display = 'none';
    });
    
    updatePhonePlaceholder();
    updateProgress();
  });
});