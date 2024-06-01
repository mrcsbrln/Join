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
    const checked = document.getElementById('checkbox').dataset.checked;
    if (checked !== 'false') {
        document.getElementById('checkbox').src = './assets/img/icons_login/checkbox_unchecked.png';
        document.getElementById('checkbox').dataset.checked = 'false';
    } else {
        document.getElementById('checkbox').src = './assets/img/icons_login/checkbox_checked.png';
        document.getElementById('checkbox').dataset.checked = 'true';
    }
}


