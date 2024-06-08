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


