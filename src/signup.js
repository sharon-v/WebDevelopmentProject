function setFormMessage(formElement, type, message) {
    const messageElement = formElement.querySelector(".signUpForm__message");

    messageElement.textContent = message;
    messageElement.classList.remove("signUpForm__message--success", "signUpForm__message--error");
    messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
    inputElement.classList.add("signUpForm__input--error");
    inputElement.parentElement.querySelector(".signUpForm__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    inputElement.classList.remove("signUpForm__input--error");
    inputElement.parentElement.querySelector(".signUpForm__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.querySelector("#signUp");

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault();
        // loginForm.classList.remove("form--hidden");
        // createAccountForm.classList.add("form--hidden");
    });

    signUpForm.addEventListener("submit", e => {
        e.preventDefault();

        // Perform your AJAX/Fetch login

        setFormMessage(loginForm, "error", "Invalid username/password combination");
    });

    document.querySelectorAll(".signUpForm__input").forEach(inputElement => {
        inputElement.addEventListener("blur", e => {
            if (e.target.id === "signUp__firstName" && e.target.value.length > 0 && e.target.value.length < 10) {
                setInputError(inputElement, "First name must be at least 10 characters in length");
            }
        });

        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});