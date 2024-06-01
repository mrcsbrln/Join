"use strict";

/**
 * 
 * Initializes-function for summary.html 
 * - setting up the necessary event listeners.
 * 
*/
function initSummary() {
    includeHTML();
    updateGreetingText();
}


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
    favicon.href = isDarkMode ? './assets/img/favicon/logo_white.png' : './assets/img/favicon/logo_black.png';
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


/**
 * Asynchronously loads HTML content into elements with a specified attribute.
 * 
 * This function searches for all elements with the attribute `w3-include-html`,
 * fetches the HTML content from the URL specified by the attribute value and 
 * inserts the content into the element. 
 * If the fetch operation fails, it inserts a "Page not found" message into the element.
 *
 * @async
 * @function includeHTML
 * @returns {Promise<void>} A promise that resolves when all HTML content is loaded and inserted.
 * 
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    let file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}


/**
 * Changes the source image of buttons based on the provided state.
 * 
 * @param {Element} element - The element containing the button image.
 * @param {string} state - The state indicating whether to highlight or reset the button.
 */
function changeIconImage(element, state) {
  if (window.innerWidth > 992) {
    const img = element.querySelector('img');
    const imgIdToSrcMap = {
      summary__toDo: {
        highlight: './assets/img/icons_summary/edit_light.png',
        reset: './assets/img/icons_summary/edit_dark.png'
      },
      summary__done: {
        highlight: './assets/img/icons_summary/done_light.png',
        reset: './assets/img/icons_summary/done_dark.png'
      }
    };
    const newSrc = imgIdToSrcMap[img.id]?.[state];
    if (newSrc) {
      img.src = newSrc;
    }
  }
}


/**
 * Changes the source image of buttons to a highlighted version.
 * 
 * @param {Element} element - The element containing the button image.
 */
function changeIcon(element) {
  changeIconImage(element, 'highlight');
}


/**
 * Resets the source image of buttons to their original version.
 * 
 * @param {Element} element - The element containing the button image.
 */
function resetIcon(element) {
  changeIconImage(element, 'reset');
}



/**
 * Retrieves the current user information from session storage.
 * 
 * This function retrieves the current user information stored in the session storage.
 * If the current user information exists, it is returned; otherwise, an error message
 * is logged to the console and `null` is returned.
 *
 * @function getCurrentUser
 * @returns {object|null} The current user object if it exists, otherwise `null`.
 */
function getCurrentUser() {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  return currentUser ? currentUser : (console.error('No current user in local storage!'), null);
}



function updateGreetingText() {
    const currentUser = getCurrentUser();
    const userName = document.getElementById('user__name');
    const greetingText = document.getElementById('greeting__text');
    clearText(greetingText);
    clearText(userName);
    setGreetingText(greetingText);
    setCurrentUserName(userName, currentUser);
}


function clearText(element) {
    element.innerText = '';
}


function setGreetingText(greetingText) {
    const timesOfDay = {
        morning: "Good morning,",
        afternoon: "Good afternoon,",
        evening: "Good evening,"
    };
    const currentTime = new Date().getHours();
    const greeting = currentTime < 12 ? timesOfDay.morning : (currentTime < 18 ? timesOfDay.afternoon : timesOfDay.evening);
    greetingText.innerText = greeting;
}



function setCurrentUserName(userName, currentUser) {
    if (currentUser) {
      userName.innerText = capitalizeFirstChar(currentUser['name']);
    }
}


function capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
