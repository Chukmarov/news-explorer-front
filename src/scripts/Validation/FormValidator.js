export default class FormValidator {
  constructor(form) {
      this.form = form;
  }
  checkInputValidity(event) {
      const errorBlank = this.form.querySelector(`#${event.target.id}-error`);
      if (event.target.validity.valueMissing) {
          errorBlank.textContent = 'Это обязательное поле';
          return
      }
      if (event.target.validity.tooShort || event.target.validity.tooLong) {
          errorBlank.textContent = 'Должно быть от 2 до 30 символов';
          return
      }
      if (event.target.validity.patternMismatch) {
        errorBlank.textContent = 'Неправильный формат email';
        return
      }
      else {
          errorBlank.textContent = '';
      }
  }
  setSubmitButtonState(inputs, button) {
      const flag = inputs.every(item => item.checkValidity());

      if (flag) {
          button.removeAttribute('disabled');
      } else {
          if (!button.hasAttribute('disabled')) {
              button.setAttribute('disabled', 'disabled');
          }
      }
  }
  setEventListeners() {
      const inputs = Array.from(this.form.querySelectorAll('input'));
      const button = this.form.querySelector('button');

      this.form.addEventListener('input', (event) => {
          this.setSubmitButtonState(inputs, button);
          this.checkInputValidity(event);
      });
  }
  validationMessageHide(spanArr) {
      spanArr.forEach((item) => {
          item.textContent = ''
      });

  }

}