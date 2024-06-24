"use strict";

/**
 * Initializes the summary page by including HTML content and updating greeting text.
 * 
 * This function initializes the summary page by including HTML content using the includeHTML function
 * and updating the greeting text using the updateGreetingText function.
 *
 */
function initSummary() {
    includeHTML().then(() => {
      highlightSummary();
      updateHeaderProfileInitials()
    })

    updateGreetingText();
    setGreetingAnimation();
    
    // checks if a currentUser is existing in session storage. 
    // if true, nothing happens. 
    // if false, the user gets rediurected to the login.html
    checkForCurrentUser() ? '' : redirectToLogin();

}



function setGreetingAnimation() {
  const containerMobile = document.getElementById('overlay');

  // check, if already greeted!
  // if YES, dont show greeting again!
  // if NO, show greeting below! & set greeting to yes!

  if (window.innerWidth < 1220) {
    containerMobile.classList.remove("d-none");
    setTimeout(function () {
      containerMobile.classList.add("d-none");
    }, 1800);
    
  }
  
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




/* ####################################################################################################################################    */
/* ---------  Hover Effect with icon change --------- */
/* ####################################################################################################################################    */



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







/* ####################################################################################################################################    */
/* ---------  Set Greeting Text & loading currentUser from sessionStorage --------- */
/* ####################################################################################################################################    */



// loading currentUser-data from session storage
// this is not nessesary, because currentUser is already defined f.e. in script.js,
// but for savety we can load it here 'again'
currentUser = loadCurrentUser();


/**
 * Updates the greeting text based on the current user's name.
 * 
 * This function retrieves the current user information, clears the text content of
 * the greeting and user name elements, sets the appropriate greeting text based on
 * the time of the day, and updates the user name with the capitalized current user's name.
 *
 */
function updateGreetingText() {
    const userName = document.getElementById('user__name');
    const userNameMobile = document.getElementById('user__name-mobile');
    const greetingText = document.getElementById('greeting__text');
    const greetingTextMobile = document.getElementById('greeting__text-mobile');
    clearText(greetingText);
    clearText(greetingTextMobile);
    clearText(userName);
    clearText(userNameMobile);
    setGreetingText(greetingText);
    setGreetingText(greetingTextMobile);
    setCurrentUserName(userName);
    setCurrentUserName(userNameMobile);
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
 * Capitalizes the first character of a string.
 * 
 * @param {string} string - The string to capitalize the first character of.
 * @returns {string} The string with the first character capitalized.
 */
function capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function setCurrentUserName(userName) {
  if (currentUser) {
    userName.innerText = capitalizeFirstChar(currentUser['name']);
  }
}




/* ####################################################################################################################################    */
/* ---------  load tasks-datas from firebase realtime database  --------- */
/* ####################################################################################################################################    */


// function for fetching data from firebase
// while not existing we will take the data provided in script.js
// object called tasks
// else we will load data from firebase realtime database starting with calling getDataFromFirebase()

// this const should be declared in script.js - but some memeber have it in their .js, we need to fix this
const BASE_URL = "https://join-230-default-rtdb.europe-west1.firebasedatabase.app/";


// starts the fetch prozess. After data are fetched, the summary will get rendered with this fetched data. So the 'than' is mandatory
getDataFromFirebase().then(renderSummary);

async function getDataFromFirebase() {
    tasks = await checkIfDatabaseIsEmpty("/tasks");
}


async function checkIfDatabaseIsEmpty(path="") {
	let result = await loadData(path);
	if (!result) {
		console.warn("Datenbank bzw. angegebener Pfad innerhalb der Datenbank ist leer");
		return tasksDummy;
	} else {
		return result;
	}
}


async function loadData(path="") {
	let response = await fetch(BASE_URL + path + ".json");
	let responseToJson = await response.json();
	return responseToJson;
}





/* ####################################################################################################################################    */
/* ---------  render Date from database to summary.html --------- */
/* ####################################################################################################################################    */




function renderSummary() {
    const todo = countTasksByCriteria('status', 'toDo');
    const done = countTasksByCriteria('status', 'done');
    const progress = countTasksByCriteria('status', 'inProgress');
    const awaitingFeedback = countTasksByCriteria('status', 'awaitingFeedback');
    const urgent = countTasksByCriteria('priority', 'urgent');
    renderDataToSummary("summary__todo", todo);
    renderDataToSummary("summary__done", done);
    renderDataToSummary("summary__progress", progress);
    renderDataToSummary("summary__feedback", awaitingFeedback);
    renderDataToSummary("summary__urgent", urgent);
    renderUrgentTasksNearestDueDate();
}


function countTasksByCriteria(criteria, value) {
    return tasks.filter(task => task[criteria].toLowerCase() === value.toLowerCase()).length;
}


function renderDataToSummary(id, number) {
    let element = document.getElementById(id);
    element.innerText = `${number}`;
}


function getMostUrgentTask(tasks) {
    const urgentTasks = tasks.filter(task => task.priority.toLowerCase() === 'urgent');

    if (urgentTasks.length === 0) {
        return null;
    }

    return urgentTasks.reduce((earliestTask, currentTask) => {
        return new Date(currentTask.dueDate) < new Date(earliestTask.dueDate) ? currentTask : earliestTask;
    });
}


function formatDateString(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}


function renderUrgentTasksNearestDueDate() {
    const mostUrgentTask = getMostUrgentTask(tasks);
    if (mostUrgentTask) {
        const mostUrgentTasksDueDate = formatDateString(mostUrgentTask.dueDate);
        renderDataToSummary("summary__date", mostUrgentTasksDueDate);
    } else {
        renderDataToSummary("summary__date", 'no urgent tasks');
        console.log('No urgent tasks found.');
    }
}













///////////////////////////////////////////////////////////////////


// tesksDummy is existing while testing the application so checkIfDatabaseIsEmpty() has a return-value, if firebase is empty
let tasksDummy = [
	{
		"id" : 0,
		"title" : "Dummy 0",
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
		"title" : "Dummy 1",
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

]