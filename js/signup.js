"use strict";




/**
 * 
 * Initializes-function for summary.html 
 * 
*/
function initSignUp() {
    // includeHTML();
    changePasswordIcon('password');
    changePasswordIcon('password__confirm');
    disableSignupButtonIfFormIsEmpty();
    logInIsCorrected();
}






/* ####################################################################################################################################    */
/* ---------  Effects --------- */
/* allows to check and uncheck the checkbox */
/* clicking on the bluw arrow redirects back to last visited page */
/* show password and toggle icon */
/* disable login button until form is filled */
/* ####################################################################################################################################    */





/**
 * Checks if the checkbox is checked (true) or unchecked (false).
 * 
 * This function checks if a checkbox element is currently checked by
 * retrieving the value of its 'data-checked' attribute. It returns true
 * if the checkbox is checked, otherwise it returns false.
 *
 * @param {HTMLElement} checkbox - The checkbox element to check.
 * @returns {boolean} True if the checkbox is checked, otherwise false.
 */
function checkIfCheckBoxIsClicked(checkbox) {
    const isChecked = checkbox.getAttribute('data-checked') === 'true';
    return isChecked;
}


/**
 * Toggles the checkbox state and updates its appearance.
 * 
 * This function checks the current state of a checkbox element (based on its `data-checked` attribute),
 * and toggles its state between checked and unchecked. It also updates the `src` attribute of the
 * checkbox image to reflect the new state.
 *
 * @function checkBoxClicked
 * @returns {void} This function does not return a value.
 */
function checkBoxClicked() {
    const checkbox = document.getElementById('checkbox');
    const isChecked = checkIfCheckBoxIsClicked(checkbox);
    checkbox.src = isChecked 
        ? './assets/img/icons_signup/checkbox_unchecked.png' 
        : './assets/img/icons_signup/checkbox_checked.png';
    checkbox.dataset.checked = isChecked ? 'false' : 'true';

    disableSignupButtonIfFormIsEmpty();
}


/**
 * Redirects the browser to the last visited page.
 * 
 * This function changes the current location of the browser
 *
 */
function goBack() {
    window.history.back();
}


function showPassword(element) {
    const passwordField = document.getElementById(element);
    const passwordIcon = document.getElementById(element+'__icon');
    const isPasswordVisible = passwordField.type === 'password';
    passwordField.type = isPasswordVisible ? 'text' : 'password';
    passwordIcon.src = isPasswordVisible ? './assets/img/icons_signup/visibility.png' : './assets/img/icons_signup/visibility_off.png';
    passwordIcon.classList.toggle('visible', isPasswordVisible);
    passwordField.onkeyup = isPasswordVisible ? '' : 'changePasswordIcon()';
}


function changePasswordIcon(element) {
    const passwordField = document.getElementById(element);
    const passwordIcon = document.getElementById(element+'__icon');
    const isEmpty = passwordField.value.length === 0;
    passwordIcon.src = isEmpty ? './assets/img/icons_signup/lock.png' : './assets/img/icons_signup/visibility_off.png';
    passwordIcon.classList.toggle('visible__no', !isEmpty);
    passwordIcon.classList.toggle('pointerEvents__none', isEmpty);
}



function disableSignupButtonIfFormIsEmpty() {
    let button = document.getElementById('btn__signUp');
    const name = document.getElementById('name').value.length
    const email = document.getElementById('email').value.length
    const password = document.getElementById('password').value.length
    const password__confirm = document.getElementById('password__confirm').value.length
    const checkbox = document.getElementById('checkbox');
    const isChecked = checkIfCheckBoxIsClicked(checkbox);
    if (email == 0 || password == 0 || name == 0 || password__confirm == 0 || !isChecked) {
        button.disabled = true;
        button.classList.add('btn__disabled');
    } else {
        button.disabled = false;
        button.classList.remove('btn__disabled')
    }
}




/* ####################################################################################################################################    */
/* ---------  SIGNUP PROCEDURE --------- */
/* ####################################################################################################################################    */


function signUpSubmit(event) {
    event.preventDefault();
    signUp();
}



// should be async function
function signUp() {
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('password__confirm').value
    const passwordsMatching = checkIfPasswordsAreMatching(password, passwordConfirm);

    if (!passwordsMatching) {
        wrongPassword();
    }


    if (passwordsMatching) {
        // check if password and passwordConfirm matching.
        // if NOT passwordsMatching -> show text like in login wrong password
        // if YES, creat newUser (see below)
        //  - write function to get the id
        //  - write function for initials
        //  - creat array with 15 colors and pick one random for the newUser
        //  - save newUser to firebase-database AND to global variable contacts

        logInIsCorrected();

        const newUser = {
            name : name,
            email : email,
            password : password,
            phone: '',
            color: '',  // random please
            initials: '',  // write a function for this
            id: '', // write a function for this
        }


        // if everythign is fine:
        // clearSignUpForm();
        // redirectToLogin();
    
    }
}


function checkIfPasswordsAreMatching(password, passwordConfirm) {
    const check = password === passwordConfirm;
    return check;

    // if not than show 'Ups! Your passwords don't match!
}



function clearSignUpForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password__confirm').value = '';
}



/* Temprary for testing..... */
let containerPassword = document.getElementById('password__container');
let feedbackPassword = document.getElementById('form__wrongPassword__message');


function wrongPassword() {
    containerPassword.classList.add('wrongPassword');
    feedbackPassword.innerHTML = `Ups! Your passwords don't match!`;
}

function logInIsCorrected() {
    containerPassword.classList.remove('wrongPassword');
    feedbackPassword.innerHTML = '';
}


/* .... new featur until here*/










// let containerPassword = document.getElementById('password__container');
// let feedbackPassword = document.getElementById('form__wrongPassword__message');


// function wrongPassword() {
//     containerPassword.classList.add('wrongPassword');
//     feedbackPassword.innerHTML = 'Wrong password Ups! Try again.';
// }

// function logInIsCorrected() {
//     containerPassword.classList.remove('wrongPassword');
//     feedbackPassword.innerHTML = '';
// }


