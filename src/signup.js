document.addEventListener('DOMContentLoaded', () => {
  const signUpForm = document.querySelector('#signUp');

  // when press on sign up button
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform your AJAX/Fetch login
    window.location.href = 'welcom.html';
  });
});
