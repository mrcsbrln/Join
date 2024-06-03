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
 * 
 * Initializes-function for summary.html 
 * - setting up the necessary event listeners.
 * 
*/
function initSignUp() {
    // includeHTML();
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
 * Redirects the browser to the last visited page.
 * 
 * This function changes the current location of the browser
 *
 */
function goBack() {
    window.history.back();
}
