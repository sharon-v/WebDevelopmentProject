function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector('.form__message');

  messageElement.textContent = message;
  messageElement.classList.remove('form__message--success', 'form__message--error');
  messageElement.classList.add(`form__message--${type}`);
}

function validate() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if ( username == 'Formget' && password == 'formget#123') {
    alert('Login successfully');
    window.location = 'success.html'; // Redirecting to other page.
    return false;
  } else {
    attempt --;// Decrementing by one.
    alert('You have left '+attempt+' attempt;');
    // Disabling fields after 3 attempts..
    if ( attempt == 0) {
      document.getElementById('username').disabled = true;
      document.getElementById('password').disabled = true;
      document.getElementById('submit').disabled = true;
      return false;
    }
  }
}


function setInputError(inputElement, message) {
  inputElement.classList.add('form__input--error');
  inputElement.parentElement.querySelector('.form__input-error-message').textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove('form__input--error');
  inputElement.parentElement.querySelector('.form__input-error-message').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login');
  const createAccountForm = document.querySelector('#createAccount');

  // document.querySelector("#linkCreateAccount").addEventListener("click", e => {
  //     e.preventDefault();
  //     loginForm.classList.add("form--hidden");
  //     createAccountForm.classList.remove("form--hidden");
  // });

  // document.querySelector("#linkLogin").addEventListener("click", e => {
  //     e.preventDefault();
  //     loginForm.classList.remove("form--hidden");
  //     createAccountForm.classList.add("form--hidden");
  // });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform your AJAX/Fetch login

    setFormMessage(loginForm, 'error', 'Invalid username/password combination');
  });

  document.querySelectorAll('.form__input').forEach((inputElement) => {
    inputElement.addEventListener('blur', (e) => {
      if (e.target.id === 'signupUsername' && e.target.value.length > 0 && e.target.value.length < 10) {
        setInputError(inputElement, 'Username must be at least 10 characters in length');
      }
    });

    inputElement.addEventListener('input', (e) => {
      clearInputError(inputElement);
    });
  });
});
