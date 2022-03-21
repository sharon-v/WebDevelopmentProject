const loginForm = document.querySelector('#login');
loginForm.addEventListener('submit', (e) => {
  // e.preventDefault();
  const email = loginForm['login__email'].value;
  const password = loginForm['login__password'].value;
  loginUser(email, password);
});

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Perform your AJAX/Fetch login
    window.location.href = 'welcom.html';
  });
});
