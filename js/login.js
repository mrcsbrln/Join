"use strict";


/* ####################################################################################################################################    */
/* ---------  Still to implement --------- */
/* ####################################################################################################################################    */
/* 
/* 
/* 
/* 
/* 
/**/







// global variables  : by Meik  - shoule be only declared in script.js
const BASE_URL = "https://join-230-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Initializes the application by setting up everything:
 * - animations
 * 
 */
async function initLogin() {

    checkForCurrentUserLogin();

    changeOfDisplayNoneAfterAnimation();

    // check if a currentUser exists in local storage (remember me was checked!)
    // if YES, form.mail & form.password & checkbox=checked are set in login.form, currentUser get data of local-storage
    // if NO, form.mail & form.password = currentUSer & checkbox=unchecked are set in login.form
    checkLocalStorageForUserData();
    changePasswordIcon();
    disableLoginButtonIfFormIsEmpty();
    logInIsCorrected();


}



/* ####################################################################################################################################    */
/* ---------  Take Care of the Animation --------- */
/* ####################################################################################################################################    */

/**
 * Toggles the display of overlay and overlay-logo elements after an animation delay.
 * 
 * This function adds the 'd-none' class to the overlay element and removes the
 * 'd-none' class from the logo element after a delay of 1800 milliseconds, simulating
 * the end of an animation.
 *
 */
function changeOfDisplayNoneAfterAnimation() {
    let overlay = document.getElementById('overlay');
    let logo = document.getElementById('header__logo');

    if (overlay && logo) {
        setTimeout(() => {
            overlay.classList.add('d-none');
            logo.classList.remove('d-none');
        }, 2000);
    }
}




/* ####################################################################################################################################    */
/* ---------  Functions for redirection --------- */
/* ####################################################################################################################################    */

/**
 * Redirects the browser to the summary page.
 * 
 * This function changes the current location of the browser to 'summary.html', effectively
 * navigating the user to the summary page.
 *
 */
function redirectToSummary() {
    window.location.href = 'summary.html';
}



/**
 * Redirects the browser to the signup page.
 * 
 * This function changes the current location of the browser to 'signup.html', effectively
 * navigating the user to the signup page.
 *
 */
function redirectToSignUp() {
    window.location.href = 'signup.html';
}






/* ####################################################################################################################################    */
/* ---------  Checking local Storage & updating login-Form --------- */
/* ####################################################################################################################################    */



function checkLocalStorageForUserData() {
    const userInLocalStorage = checkLocalStorageForLoginData();
    if (userInLocalStorage) {
        currentUser = userInLocalStorage;
        updateLogInForm(true);
    } else {
        updateLogInForm(false);
    }
}


function checkLocalStorageForLoginData() {
    const userInLocalStorageString = localStorage.getItem('currentUser');
    if (userInLocalStorageString) {
        try {
            const userInLocalStorage = JSON.parse(userInLocalStorageString);
            // console.log('Current user found in Local Storage:', userInLocalStorage);
            return userInLocalStorage;
        } catch (error) {
            console.error('Error parsing JSON from Local Storage', error);
            return null;
        }
    } else {
        // console.log('No current user found in Local Storage');
        return null;
    }
}


function updateCheckboxState(checkbox, isChecked) {
    checkbox.src = isChecked ? './assets/img/icons_login/checkbox_checked.png' : './assets/img/icons_login/checkbox_unchecked.png';
    checkbox.dataset.checked = isChecked ? 'true' : 'false';
}


function updateLogInForm(inStorage) {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const checkbox = document.getElementById('checkbox');
    emailField.value = inStorage ? currentUser.email : '';
    passwordField.value = inStorage ? currentUser.password : '';
    updateCheckboxState(checkbox, inStorage);
}


function checkBoxClicked() {
    const checkbox = document.getElementById('checkbox');
    const isChecked = checkIfCheckBoxIsClicked(checkbox);
    updateCheckboxState(checkbox, !isChecked);
}




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









/* ####################################################################################################################################    */
/* ---------  LOAD DATA FROM FIREBASE --------- */
/* ####################################################################################################################################    */




async function loadData(path="") {
	let response = await fetch(BASE_URL + path + ".json");
	let responseToJson = await response.json();
	return responseToJson;
}


async function checkLoginValues(email, password) {
    const datas = await loadData("/contacts");
    const matchingContact = datas.find(data => data.email === email);
    if (matchingContact) {
        if (matchingContact.password === password) {
            console.log("Login successful");
            return matchingContact;
        } else {
            console.warn("Falsches Passwort");
            wrongPassword();
        }
    } else {
        console.warn("Kein Benutzer mit dieser E-Mail gefunden");
    }
}







/* ####################################################################################################################################    */
/* ---------  LOGIN PROCEDURE :    GUEST --------- */
/* ####################################################################################################################################    */




function loginAsGuest() {
    let guestUser = {
        name: 'guest',
        email: 'guest@join.de',
        id: 'guest',
        color: '#00BEE8',
        initials: 'G',
        password: 'guest',
    };
    currentUser = guestUser;
    saveCurrentUser(currentUser);
    clearForm('email', 'password');
    localStorage.removeItem('currentUser');
    checkbox.src = './assets/img/icons_login/checkbox_unchecked.png';
    redirectToSummary();
}



// save to session storage
function saveCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}





/* ####################################################################################################################################    */
/* ---------  LOGIN PROCEDURE --------- */
/* ####################################################################################################################################    */


function loginSubmit(event) {
    event.preventDefault();
    login();
}


async function login() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const matchingContact = await checkLoginValues(email, password);
    if (matchingContact) {
        currentUser = matchingContact;
        saveCurrentUserToSessionStorage(currentUser);
        // setCurrentUser(matchingContact);
        clearForm('email', 'password');
        const checkbox = document.getElementById('checkbox');
        if (checkIfCheckBoxIsClicked(checkbox)) {
            let currentUserString = JSON.stringify(currentUser);
            localStorage.setItem('currentUser', currentUserString);
        } else {
            localStorage.removeItem('currentUser');
        }
        redirectToSummary();
    } else {
        localStorage.removeItem('currentUser');
        console.warn("Fehler bei der Anmeldung!");
    }
}



function clearForm(email, password) {
    document.getElementById(`${email}`).value = '';
    document.getElementById(`${password}`).value = '';
}



function saveCurrentUserToSessionStorage(currentUser) {
    if (currentUser) {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        console.warn("currentUser NA - save to local Storage not possible");
        return;
    }
}




/* ####################################################################################################################################    */
/* ---------  Effects --------- */
/* show password and toggle icon */
/* disable login button until form is filled */
/* ####################################################################################################################################    */



function showPassword() {
    const passwordField = document.getElementById('password');
    const passwordIcon = document.getElementById('password__icon');
    const isPasswordVisible = passwordField.type === 'password';
    passwordField.type = isPasswordVisible ? 'text' : 'password';
    passwordIcon.src = isPasswordVisible ? './assets/img/icons_login/visibility.png' : './assets/img/icons_login/visibility_off.png';
    passwordIcon.classList.toggle('visible', isPasswordVisible);
    passwordField.onkeyup = isPasswordVisible ? null : 'changePasswordIcon()';
}


function changePasswordIcon() {
    const passwordField = document.getElementById('password');
    const passwordIcon = document.getElementById('password__icon');
    const isEmpty = passwordField.value.length === 0;
    passwordIcon.src = isEmpty ? './assets/img/icons_login/lock.png' : './assets/img/icons_login/visibility_off.png';
    passwordIcon.classList.toggle('visible__no', !isEmpty);
    passwordIcon.classList.toggle('pointerEvents__none', isEmpty);
}



function disableLoginButtonIfFormIsEmpty() {
    let button = document.getElementById('btn__logIn');
    const email = document.getElementById('email').value.length
    const password = document.getElementById('password').value.length
    if (email == 0 || password == 0) {
        button.disabled = true;
        button.classList.add('btn__disabled');
    } else {
        button.disabled = false;
        button.classList.remove('btn__disabled')
    }
}




let containerPassword = document.getElementById('password__container');
let feedbackPassword = document.getElementById('form__wrongPassword__message');


function wrongPassword() {
    containerPassword.classList.add('wrongPassword');
    feedbackPassword.innerHTML = 'Wrong password Ups! Try again.';
}

function logInIsCorrected() {
    containerPassword.classList.remove('wrongPassword');
    feedbackPassword.innerHTML = '';
}


function keyIsUp() {
    console.log("Key is up");
}



/* ####################################################################################################################################    */
/* ---------  If currentUser exists in session Storage, one can not access login.html  but --------- */
/* ---------  get redirected to summary.html  --------- */
/* ####################################################################################################################################    */


// check if a currentUser exists
function checkForCurrentUserLogin() {
    const userString = sessionStorage.getItem('currentUser');

    if (userString) {
        try {
            const userJSON = JSON.parse(userString);
            return true;
            // console.log('Current user found in Session Storage:', userJSON.name);
            redirectToSummary();
        } catch (error) {
            console.error('Error parsing JSON from Session Storage', error);
            return false;
            // redirectToLogin();
        }
    } else {
        console.warn('No current existing - please log in or sign up');
        return false;
        // redirectToLogin();
    }
}