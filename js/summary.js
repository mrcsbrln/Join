"use strict";

/**
 * Initializes the summary page by including HTML content and updating greeting text.
 * 
 * This function initializes the summary page by including HTML content using the includeHTML function
 * and updating the greeting text using the updateGreetingText function.
 *
 */
function initSummary() {
    includeHTML().then(highlightSummary);
    updateGreetingText();
}


/**
 * Asynchronously loads HTML content into elements with a specified attribute.
 * 
 * This function searches for all elements with the attribute `w3-include-html`,
 * fetches the HTML content from the URL specified by the attribute value and 
 * inserts the content into the element. 
 * If the fetch operation fails, it inserts a "Page not found" message into the element.
 *
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



// /**
//  * Retrieves the current user information from session storage.
//  * 
//  * This function retrieves the current user information stored in the session storage.
//  * If the current user information exists, it is returned; otherwise, an error message
//  * is logged to the console and `null` is returned.
//  *
//   * @returns {object|null} The current user object if it exists, otherwise `null`.
//  */
// function getCurrentUser() {
//   const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
//   return currentUser ? currentUser : (console.error('No current user in local storage!'), null);
// }


/**
 * Updates the greeting text based on the current user's name.
 * 
 * This function retrieves the current user information, clears the text content of
 * the greeting and user name elements, sets the appropriate greeting text based on
 * the time of the day, and updates the user name with the capitalized current user's name.
 *
 */
function updateGreetingText() {
    // const currentUser = getCurrentUser();
    const userName = document.getElementById('user__name');
    const greetingText = document.getElementById('greeting__text');
    clearText(greetingText);
    clearText(userName);
    setGreetingText(greetingText);
    // setCurrentUserName(userName, currentUser);
    setCurrentUserName(userName);
}


/**
 * Clears the text content of an HTML element.
 * 
 * @param {HTMLElement} element - The HTML element whose text content will be cleared.
 */
function clearText(element) {
    element.innerText = '';
}


/**
 * Sets the greeting text based on the current time of the day.
 * 
 * @param {HTMLElement} greetingText - The HTML element to set the greeting text into.
 */
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


/**
 * Sets the current user's name in the provided HTML element.
 * 
 * @param {HTMLElement} userName - The HTML element to set the user's name into.
 * @param {object|null} currentUser - The current user object.
 */
function setCurrentUserName(userName) {
    if (currentUser) {
      userName.innerText = capitalizeFirstChar(currentUser['name']);
    }
}


/**
 * Capitalizes the first character of a string.
 * 
 * @param {string} string - The string to capitalize the first character of.
 * @returns {string} The string with the first character capitalized.
 */
function capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
