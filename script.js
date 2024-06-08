"use strict";


// global variables  : by Meik 
// const BASE_URL = "https://join-230-default-rtdb.europe-west1.firebasedatabase.app/";





/**
 * 
 * Initializes-function for summary.html 
 * - setting up the necessary event listeners.
 * 
*/
function init() {
    includeHTML();
}


/**
 * Updates the href-attribut of the link-tag in summary-html based on the user's preferred color scheme
 * to access and show dirfferent machting favicon
 * 
 * IMPORTANT: Working on firefox and edge, maybe working on Chrome (Devtools -> Rendering -> emulate prefered color scheme)
 * 
 */
function updateFavicon() {
    favicon.href = './assets/img/favicon/logo_white.png';
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
 * This function will redirect the user back to login.html
 */
function backToLogin() {
    setTimeout(function () {
        window.location.href = "login.html";
    }, 1000);
}



/* -----------   Session Storage & globle variable : by Meik   -------------  */


const defaultUser = {
    name: '',
    email: '',
    id: '',
    color: '',
    initials: '',
    password: '',
};



// check if in session storage already
function loadCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : defaultUser;
}


// initialise globle variable
let currentUser = loadCurrentUser();
// console.log('main.js currentUser:', currentUser);





/* ----------- Temporary contacts and tasks are initialised and set up here --------- */
/* later we will get data from firebase realtime datebase  : by Meik  */


let contacts = [
	{
		"id" : 0,
		"name" : "Anton Mayer",
		"email" : "antom@gmail.com",
		"phone" : "+49 1111 11 111 1",
		"password" : "1234",
		"color" : "#FF70AA",
		"initials" : "AM",
	},

	{
		"id" : 1,
		"name" : "Tatjana Wolf",
		"email" : "wolf@gmail.com",
		"phone" : "+49 2222 222 22 2",
		"password" : "1234",
		"color" : "#FFC700",
		"initials" : "TW",
	},

	{
		"id" : 2,
		"name" : "Benedikt Ziegler",
		"email" : "benedikt@gmail.com",
		"phone" : "+49 3333 333 33 3",
		"password" : "1234",
		"color" : "#6E52FF",
		"initials" : "BZ",
	},

	{
		"id" : 3,
		"name" : "David Eisenberg",
		"email" : "davidberg@gmail.com",
		"phone" : "+49 4444 444 44 4",
		"password" : "1234",
		"color" : "#FC71FF",
		"initials" : "DE",
	},

	{
		"id" : 4,
		"name" : "Eva Fischer",
		"email" : "eva@gmail.com",
		"phone" : "+49 5555 555 55 5",
		"password" : "1234",
		"color" : "#FFBB2B",
		"initials" : "EF",
	},

	{
		"id" : 5,
		"name" : "Emmanuel Mauer",
		"email" : "emmanuelma@gmail.com",
		"phone" : "+49 6666 666 66 6",
		"password" : "1234",
		"color" : "#1FD7C1",
		"initials" : "EM",
	},

	{
		"id" : 6,
		"name" : "Marcel Bauer",
		"email" : "bauer@gmail.com",
		"phone" : "+49 7777 777 77 7",
		"password" : "1234",
		"color" : "#462F8A",
		"initials" : "MB",
	},

	{
		"id" : 7,
		"name" : "Sofia Müller",
		"email" : "sofia@gmail.com",
		"phone" : "+49 8888 888 88 8",
		"password" : "1234",
		"color" : "#00BEE8",
		"initials" : "SM",
	},

	{
		"id" : 8,
		"name" : "Anja Schulz",
		"email" : "schulz@gmail.com",
		"phone" : "+49 9999 999 99 9",
		"password" : "1234",
		"color" : "#9327FF",
		"initials" : "AS",
	},

];



let tasks = [
	{
		"id" : 0,
		"title" : "Kochwelt Page & Recipe Recommender",
		"description" : "Build start page with recipe recommendation.",
		"category" : "User Story",
		"status" : "toDo",
		"dueDate" : "2024-07-31",
		"priority" : "medium",
		"subTasks" : [
			{
				"id" : 0,
				"content" : "Implement Recipe Recommendation",
				"completet" : true,
			},
			{
				"id" : 1,
				"content" : "Start Page Layout",
				"completet" : false,
			},
		],
		"assignedTo" : [0,5,6],
	},

	{
		"id" : 1,
		"title" : "CSS Architecture Planning",
		"description" : "Define CSS naming conventions and structure",
		"category" : "Technical Tasks",
		"status" : "inProgress",
		"dueDate" : "2024-07-31",
		"priority" : "urgent",
		"subTasks" : [
			{
				"id" : 0,
				"content" : "Establish CSS Methodology",
				"completet" : true,
			},
			{
				"id" : 1,
				"content" : "Setup Base Styles",
				"completet" : true,
			},
		],

		"assignedTo" : [2,7],
	},

	{
		"id" : 2,
		"title" : "HTML Base Template Creation",
		"description" : "Create reusable HTML base templates",
		"category" : "Technical Tasks",
		"status" : "awaitingFeedback",
		"dueDate" : "2024-07-31",
		"priority" : "low",
		"subTasks" : [],
		"assignedTo" : [2,3,8],
	},

	{
		"id" : 3,
		"title" : "Daily Kochwelt Recipe",
		"description" : "Implement daily recipe and portion calculator",
		"category" : "User Story",
		"status" : "awaitingFeedback",
		"dueDate" : "2024-07-31",
		"priority" : "medium",
		"subTasks" : [],
		"assignedTo" : [1,4,8],
	},

	{
		"id" : 4,
		"title" : "Contact Form & Imprint",
		"description" : "Create a contac form and imprint page",
		"category" : "User Story",
		"status" : "done",
		"dueDate" : "2024-07-31",
		"priority" : "medium",
		"subTasks" : [
			{
				"id" : 0,
				"content" : "Create contact form",
				"completet" : false,
			},
			{
				"id" : 1,
				"content" : "set up imprint page",
				"completet" : false,
			},
		],
		"assignedTo" : [3,4,8],
	},
]