document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registration-form');
  const successModal = document.getElementById('success-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const progressFill = document.getElementById('progress-fill');
  const progressPercent = document.getElementById('progress-percent');

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
      errEl: document.getElementById('err-phone'),
      group: document.getElementById('group-phone'),
      validate: (val) => {
        const phoneRegex = /^(05|5|\+966|00966)?[0-9]{9,10}$/;
        return phoneRegex.test(val.trim().replace(/[\s-]/g, ''));
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

  // التحقق من صحة حقل معين وتحديث المظهر
  function validateField(key, showErrors = true) {
    const field = fields[key];
    const isValid = field.validate(field.el.value);

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
        field.errEl.style.display = 'block';
      }
      return false;
    }
  }

  // تحديث شريط تقدم تعبئة النموذج
  function updateProgress() {
    let validCount = 0;
    const totalFields = Object.keys(fields).length;

    Object.keys(fields).forEach((key) => {
      if (fields[key].validate(fields[key].el.value)) {
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

    field.el.addEventListener('input', () => {
      updateProgress();
      if (field.group.classList.contains('error') || field.validate(field.el.value)) {
        validateField(key, true);
      }
    });

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
    updateProgress();
  });
});