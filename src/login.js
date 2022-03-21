function setInputError(inputElement, message) {
  inputElement.classList.add('loginForm__input--error');
  inputElement.parentElement.querySelector('.loginForm__input-error-message').textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove("loginForm__input--error");
  inputElement.parentElement.querySelector('.loginForm__input-error-message').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // check if this the condition we want - if at all
    if (loginForm['login__password'].value.length < 6) {
      setInputError(inputElement, 'password must be at least 6 characters in length');
    }
    else {
      // Perform your AJAX/Fetch login
      window.location.href = 'welcom.html';
    }
  });
});
