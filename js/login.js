"use strict";


/**
 * Updates the href-attribut of the link-tag in summary-html based on the user's preferred color scheme
 * to access and show dirfferent machting favicon
 * 
 * IMPORTANT: Working on firefox and edge, maybe working on Chrome (Devtools -> Rendering -> emulate prefered color scheme)
 * 
 */
function updateFavicon() {
    favicon.href = './assets/img/logo_white.png';
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    favicon.href = isDarkMode ? './assets/img/logo_white.png' : './assets/img/logo_black.png';
}


/**
 * Adds event listeners for the summary.html. 
 * - update href on change of preferred color scheme
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    updateFavicon();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
});





/* ===============  Explizites JavaScript für die Seite =============== */



/**
 * Initializes the application by setting up everything:
 * - animations
 * 
 */
async function initLogin() {
    changeOfDisplayNoneAfterAnimation();
    deleteCurrentUserFromSessionStorage();    // temporary function for testing
}


/**
 * This function deleted the 'currentUser' from session storage
 * 
 */
function deleteCurrentUserFromSessionStorage() {
    sessionStorage.removeItem('currentUser');
}


/**
 * Toggles the display of overlay and overlay-logo elements after an animation delay.
 * 
 * This function adds the 'd-none' class to the overlay element and removes the
 * 'd-none' class from the logo element after a delay of 1800 milliseconds, simulating
 * the end of an animation.
 *
 * @function changeOfDisplayNoneAfterAnimation
 * @returns {void} This function does not return a value.
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
        ? './assets/img/icons_login/checkbox_unchecked.png' 
        : './assets/img/icons_login/checkbox_checked.png';
    checkbox.dataset.checked = isChecked ? 'false' : 'true';
}





/**
 * Logs in a guest user by setting the current user information in session storage
 * and redirects to the summary page.
 *
 * This function creates a guest user object with predefined credentials, stores
 * this object in the session storage, and then calls the `redirectToSummary` function
 * to navigate to the summary page.
 *
 * @function loginAsGuest
 * @returns {void} This function does not return a value.
 */
async function loginAsGuest() {
    const guestUser = {
        name: 'guest',
        email: 'guest@join.de',
        id: 'guest',
        color: '#00BEE8',
        initials: 'G',
    };
    setCurrentUser(guestUser);
    // saveCurrentUserToSessionStorage(guestUser);
    redirectToSummary();
}


/**
 * Saves the current user object to the session storage.
 * 
 * This function saves the current user object to the session storage if it exists.
 * If the currentUser parameter is null or undefined, a warning message is logged
 * to the console, and the function returns early without saving anything.
 *
  * @param {object|null} currentUser - The current user object to be saved.
  */
function saveCurrentUserToSessionStorage(currentUser) {
    if (currentUser) {
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
        console.warn("currentUser NA - save to local Storage not possible");
        return;
    }
}


/**
 * Redirects the browser to the summary page.
 * 
 * This function changes the current location of the browser to 'summary.html', effectively
 * navigating the user to the summary page.
 *
 * @function redirectToSummary
 * @returns {void} This function does not return a value.
 */
function redirectToSummary() {
    window.location.href = 'summary.html';
}





/* ####################################################################################################################################    */
/* ####################################################################################################################################    */
/* ####################################################################################################################################    */
/* ####################################################################################################################################    */



/* ---------  LOAD DATA FROM FIREBASE --------- */

const BASE_URL = "https://join-230-default-rtdb.europe-west1.firebasedatabase.app/";


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
        }
    } else {
        console.warn("Kein Benutzer mit dieser E-Mail gefunden");
    }
}




/* ---------  LOGIN PROCEDURE --------- */

function loginSubmit(event) {
    event.preventDefault();
    login();
}


async function login() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const matchingContact = await checkLoginValues(email, password);
    if (matchingContact) {
        setCurrentUser(matchingContact);
        clearForm('email', 'password');
        const checkbox = document.getElementById('checkbox');
        if (checkIfCheckBoxIsClicked(checkbox)) {
            let currentUserString = sessionStorage.getItem('currentUser');
            localStorage.setItem('currentUser', currentUserString);
        }
        redirectToSummary();
    } else {
        console.warn("Fehler bei der Anmeldung!");
    }
}



function setCurrentUser(userData) {
    const currentUser = {
        name: userData.name,
        email: userData.email,
        id: userData.id,
        color: userData.color,
        initials: userData.initials,
    };
    saveCurrentUserToSessionStorage(currentUser);
}





function clearForm(email, password) {
    document.getElementById(`${email}`).value = '';
    document.getElementById(`${password}`).value = '';
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


