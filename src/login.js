
// function setFormMessage(formElement, type, message) {
//     const messageElement = formElement.querySelector(".loginForm__message");

//     messageElement.textContent = message;
//     messageElement.classList.remove("loginForm__message--success", "loginForm__message--error");
//     messageElement.classList.add(`loginForm__message--${type}`);
// }

// function validate(){
//     var email = document.getElementById("login__email").value;
//     var password = document.getElementById("login__password").value;
//     if ( email == "Formget" && password == "formget#123"){
//     alert ("Login successfully");
//     window.location = "welcom.html"; // Redirecting to other page.
//     return false;
//     }
//     else
//     alert ("failed to login, please try again");
//     }
const loginForm = document.querySelector('#login');
loginForm.addEventListener('submit', (e)=>{
    // e.preventDefault();
    const email = loginForm['login__email'].value;
    const password = loginForm['login__password'].value;
    loginUser(email, password);
})

// function setInputError(inputElement, message) {
//     inputElement.classList.add("loginForm__input--error");
//     inputElement.parentElement.querySelector(".loginForm__input-error-message").textContent = message;
// }

// function clearInputError(inputElement) {
//     inputElement.classList.remove("loginForm__input--error");
//     inputElement.parentElement.querySelector(".loginForm__input-error-message").textContent = "";
// }

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login");

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

    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login
        window.location.href="welcom.html";

    });

    document.querySelectorAll(".loginForm__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "login__email" && e.target.value.length > 0 && e.target.value.length < 10) {
                alert('??');
                // setInputError(inputElement, "Username must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            // clearInputError(inputElement);
        });
    });
});