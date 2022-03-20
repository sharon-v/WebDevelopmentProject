function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector('.signUpForm__message');

  messageElement.textContent = message;
  messageElement.classList.remove('signUpForm__message--success', 'signUpForm__message--error');
  messageElement.classList.add(`signUpForm__message--${type}`);
}

function setInputError(inputElement, message) {
  inputElement.classList.add('signUpForm__input--error');
  inputElement.parentElement.querySelector('.signUpForm__input-error-message').textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove('signUpForm__input--error');
  inputElement.parentElement.querySelector('.signUpForm__input-error-message').textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.querySelector('#signUp');

  document.querySelector('#linkLogin').addEventListener('click', (e) => {
    // need to add implementation for transmition to login page

  });

  // when press on sign up button
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform your AJAX/Fetch login
  });

  document.querySelectorAll('.signUpForm__input').forEach((inputElement) => {
    inputElement.addEventListener('blur', (e) => {
      // chack if this the condition we want - if at all
      if (e.target.id === 'signUp__firstName' && e.target.value.length > 0 && e.target.value.length < 10) {
        setInputError(inputElement, 'First name must be at least 10 characters in length');
      }
    });


    inputElement.addEventListener('input', (e) => {
      clearInputError(inputElement);
    });
  });
});

const signUpForm = document.querySelector('#signUp');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // get user info
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;
    const firstName = signUpForm.
    createUserWithEmailAndPassword(auth, user.email).then((cred) => {
        console.log('user created inm auth');
        // adding the user's details to users collection
        addDoc(usersColRef, {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.id,
            birthDate: user.birthDate,
        }).then(() => {
            signUpForm.reset();
        })
    })
})
