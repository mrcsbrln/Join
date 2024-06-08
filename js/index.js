"use strict";

checkForCurrentUser();

// // check if a currentUser exists
// function checkForCurrentUser() {
//     const userString = sessionStorage.getItem('currentUser');

//     if (userString) {
//         try {
//             const userJSON = JSON.parse(userString);
//             console.log('Current user found in Session Storage:', userJSON.name);
//             redirectToSummary();
//         } catch (error) {
//             console.error('Error parsing JSON from Session Storage', error);
//             redirectToLogin();
//         }
//     } else {
//         console.log('No current user found in Session Storage');
//         redirectToLogin();
//     }
// }





// /**
//  * Redirects the browser to the login page.
//  * 
//  * This function changes the current location of the browser to 'login.html', effectively
//  * navigating the user to the login page.
//  *
//  * @function redirectToLogin
//  * @returns {void} This function does not return a value.
//  */
// function redirectToLogin() {
//     window.location.href = 'login.html';
// }


// /**
//  * Redirects the browser to the summary page.
//  * 
//  * This function changes the current location of the browser to 'summary.html', effectively
//  * navigating the user to the summary page.
//  *
//  * @function redirectToSummary
//  * @returns {void} This function does not return a value.
//  */
// function redirectToSummary() {
//     window.location.href = 'summary.html';
// }

