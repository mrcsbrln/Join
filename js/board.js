
let draggedItemId = "";
let minDate = "";
let actSubtasks = [];
let actAssignedTo = [];
let taskEditAsiggnedTo = [];
let actTaskPrio = "";
let actStatus = "";
let svgMappingsEdit = {
    'urgent': 'assets/img/icons_add_task/urgent.svg',
    'urgent-active': 'assets/img/icons_add_task/urgent-white.svg',
    'medium': 'assets/img/icons_add_task/medium.svg',
    'medium-active': 'assets/img/icons_add_task/medium-white.svg',
    'low': 'assets/img/icons_add_task/low.svg',
    'low-active': 'assets/img/icons_add_task/low-white.svg'
};

const statusLabels = {
    toDo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
    awaitingFeedback: 'Awaiting Feedback'
};

/**
 * init function to render all Cards and highlight the boards Button on the Side Navigation
 */
async function initBoard() {
    await includeHTML();
    let taskData = await loadData("/tasks")
    tasks = taskData;
    tasks = tasks.filter(task => task !== null);
    let contactsData = await loadData("/contacts")
    contacts = contactsData;
    contacts = contacts.filter(contact => contact !== null);
    initAddTaskBoard();
}

function initAddTaskBoard() {
    highlightBoard();
    renderCards();
    updateHeaderProfileInitials();
    pushSubtaskEdit();
    showMenu();
    changeSvgOnHover();
    changePrioBtn();
    changeSvgOnHover();
    categoryMenu();
    styleSubtaskInput();
    pushSubtask();
    renderContacts();
    closeContactListOnOutsideClick();
    categoryMenu();
    preventFormSubmitOnEnter();
    preventDefaultValidation();
    filterContacts();
}



/**
 * Retrieves the input value from the search bar and triggers the searchTasks function.
 */
function getSearchKeyword() {
    let input = document.getElementById('searchBar').value;
    searchTasks(input);
}

/**
 * Filters the tasks based on the keyword in their title or description and renders the filtered tasks.
 * @param {string} keyword - The input from the search bar.
 */
function searchTasks(keyword) {
    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(keyword.toLowerCase()) ||
            task.description.toLowerCase().includes(keyword.toLowerCase());
    });
    renderCards(filteredTasks);
}

/**
 * Renders the task cards filtered by the keyword from the searchTasks function.
 * @param {Array|null} filteredTasks - The array of tasks filtered by the search keyword. Defaults to null if no filtering is applied.
 */
function renderCards(filteredTasks = null) {
    const statuses = ["toDo", "inProgress", "awaitingFeedback", "done"];

    statuses.forEach(status => {
        const container = document.getElementById(`cardContainer${status}`);
        container.innerHTML = '';
        const tasksToRender = filteredTasks ? filteredTasks.filter(task => task.status === status) : tasks.filter(task => task.status === status);
        tasksToRender.forEach(task => {
            container.innerHTML += renderCardHtml(task);
            changeProgressBar(task.id);
        });
    });
    checkContainerTodo();
}
/**
 * Checks if the 'To Do' container is empty and toggles the visibility of the empty task message accordingly. 
 * Additionally, calls the 'checkContainerInProgress' function 
 */
function checkContainerTodo() {
    const container = document.getElementById('cardContainertoDo');
    document.getElementById('emptyTaskTodo').classList.toggle('hidden', container.innerHTML.trim() !== '');
    checkContainerInProgress();
}

/**
 * Checks if the 'In Progress' container is empty and toggles the visibility of the empty task message accordingly. 
 * Additionally, calls the 'checkContainerAwaitFeedback' function 
 */
function checkContainerInProgress() {
    const container = document.getElementById('cardContainerinProgress');
    document.getElementById('emptyTaskInProgress').classList.toggle('hidden', container.innerHTML.trim() !== '');
    checkContainerAwaitFeedback();
}

/**
 * Checks if the 'Awaiting Feedback' container is empty and toggles the visibility of the empty task message accordingly. 
 * Additionally, calls the 'checkContainerDone' function 
 */
function checkContainerAwaitFeedback() {
    const container = document.getElementById('cardContainerawaitingFeedback');
    document.getElementById('emptyTaskAwait').classList.toggle('hidden', container.innerHTML.trim() !== '');
    checkContainerDone();
}

/**
 * Checks if the 'Done' container is empty and toggles the visibility of the empty task message accordingly.
 */
function checkContainerDone() {
    const container = document.getElementById('cardContainerdone');
    document.getElementById('emptyTaskDone').classList.toggle('hidden', container.innerHTML.trim() !== '');
}





function updateTaskDisplay() {
    renderCards();
}

function saveEdit(i) {
    // Update the specific task object with new values from the form
    tasks[i].assignedTo = taskEditAsiggnedTo;
    tasks[i].title = document.getElementById('editedTitle').value;
    tasks[i].description = document.getElementById('editedDescription').value;
    tasks[i].dueDate = document.getElementById('editedDate').value;
    tasks[i].subTasks = actSubtasks;
    tasks[i].priority = actTaskPrio;

    // Reset temporary variables and update UI
    actSubtasks = [];
    closeDialogBtn();
    renderCards();

    // Send updated task to the server
    putDataEdit(`/tasks/${tasks[i].id}`, tasks[i])
}

async function putDataEdit(path = "", data = {}) {
    try {
        const response = await fetch(`${BASE_URL}${path}.json`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const responseToJson = await response.json();
        return responseToJson;
    } catch (error) {

        throw error;
    }
}

/**
 * Deletes task from Databse based on the ID
 * @param {number} taskId - Id of the task to be deleted
 * @returns {Promise<void>} - a Promise that resolves when the task is deleted
 */
async function deleteTaskFromDatabase(taskId) {
    try {
        const response = await fetch(`${BASE_URL}/tasks/${taskId}.json`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Löschen der Aufgabe aus der Datenbank: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        throw new Error(`Fehler beim Löschen der Aufgabe aus der Datenbank: ${error.message}`);
    }
}

/**
 * deletes a task from the `tasks` array and the database.
 * @param {number} i - Index of the task to be deleted
 */
async function deleteTask(i) {
    const taskId = tasks[i].id;
    tasks.splice(i, 1);
    await deleteTaskFromDatabase(taskId);
    closeDialogBtn();
    renderCards();
}




/**
 * Initiates the dragging operation for a task card.
 * @param {number} id - The ID of the task card being dragged.
 */
function startDragging(id) {
    draggedItemId = id;
    const card = document.getElementById(`taskCard${id}`);
    card.classList.add('dragging');
    highlightDropZones();
}

/**
 * Allows dropping elements into the specified drop target.
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Handles the dropping of a task into a specified status.
 * @param {string} status - The status where the task is dropped.
 */
async function drop(status) {
    const taskIndex = tasks.findIndex(task => task.id === draggedItemId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = status;
        removeHighlight();
        renderCards();
    }
   await putDataEdit(`/tasks`, tasks)
  
}

/**
 * Highlights the drop zones where a task can be dropped.
 */
function highlightDropZones() {
    const containers = document.querySelectorAll('.cardContainer');
    containers.forEach(container => {
        if (container.id !== `cardContainer${tasks.find(task => task.id === draggedItemId).status}`) {
            container.classList.add('highlightDragArea');
        }
    });
}

/**
 * Removes the highlight from all drop zones.
 */
function removeHighlight() {
    const card = document.getElementById(`taskCard${draggedItemId}`);
    if (card) {
        card.classList.remove('dragging');
    }

    const containers = document.querySelectorAll('.cardContainer');
    containers.forEach(container => {
        container.classList.remove('highlightDragArea');
    });
}

// Event listener for the drag end event
document.addEventListener('dragend', function (event) {
    const card = document.getElementById(`taskCard${draggedItemId}`);
    if (card) {
        card.classList.remove('dragging');
    }
    removeHighlight();
});


/**
 * Updates the progress bar width based on completed and total subtasks.
 * @param {number} id - The ID of the task.
 */
async function changeProgressBar(i) {
    tasks.forEach(async (task, index) => {
        if (task.id == i && task.subTasks) {
            changeProgressCheckEmpty(task, i);
            try {
                await putData(`/tasks/`, tasks);
            } catch (error) {
            }
        }
    });
}

function changeProgressCheckEmpty( task, i){
    const completedSubtasks = task.subTasks.filter(subtask => subtask.completet).length;
    const totalSubtasks = task.subTasks.length;
    let percent = 0;
    if (totalSubtasks !== 0) {
        percent = (completedSubtasks / totalSubtasks) * 100;
    }
     const progressBarElement = document.getElementById(`progressBar${i}`);
    if (progressBarElement) {
        progressBarElement.style.width = percent + '%';
    }
}

function saveEditValidation(i) {
    const editedTitle = document.getElementById('editedTitle');
    const editedDate = document.getElementById('editedDate');
    const titleRequired = document.getElementById('edit-task-title-required');
    const dateRequired = document.getElementById('edit-task-duo-date-required');

    validateField(editedTitle, titleRequired);
    validateField(editedDate, dateRequired);

    if (isFieldFilled(editedTitle) && isFieldFilled(editedDate)) {
        saveEdit(i);
    }
}

function validateField(inputElement, requiredElement) {
    if (inputElement.value.trim() === '') {
        showValidationError(inputElement, requiredElement);
        addInputListener(inputElement, requiredElement);
    } else {
        resetFieldStyle(inputElement, requiredElement);
    }
}

function isFieldFilled(inputElement) {
    return inputElement.value.trim() !== '';
}

function showValidationError(inputElement, requiredElement) {
    inputElement.style.border = '1px solid red';
    requiredElement.style.opacity = 1;
}

function resetFieldStyle(inputElement, requiredElement) {
    inputElement.style.border = '1px solid grey';
    requiredElement.style.opacity = 0;
}


function addInputListener(inputElement, requiredElement) {
    inputElement.addEventListener('input', function listener() {
        if (isFieldFilled(inputElement)) {
            resetFieldStyle(inputElement, requiredElement);
            inputElement.removeEventListener('input', listener);
        }
    });
}

function toggleDropdown(dropdownId) {
    const dropdownContent = document.getElementById(dropdownId);
    dropdownContent.classList.toggle('showDropdown');
}

async function moveToStatus(taskId, newStatus, dropdownId) {
    try {
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            return;
        }
        tasks[taskIndex].status = newStatus;
        console.log(taskIndex);
        await putDataEdit(`/tasks/${taskIndex}`, tasks[taskIndex]);
        toggleDropdown(dropdownId);
        renderCards();
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Datenbank oder beim Rendern der Karten:', error);
    }

}

function renderDropdownOptions(taskId, currentStatus) {
    const allStatuses = ['toDo', 'inProgress', 'done', 'awaitingFeedback'];
    const availableStatuses = allStatuses.filter(status => status !== currentStatus);
    const dropdownId = `dropdown-content-${taskId}`;

    return availableStatuses.map(status => `
        <p onclick="moveToStatus(${taskId}, '${status}', '${dropdownId}')">${statusLabels[status]}</p>
    `).join('');
}


function renderBadges(assignedToArray, maxBadges = 6) {
    let renderedCount = 0;
    let addedContacts = new Set();
    let badgesHtml = assignedToArray.map(id => {
        if (contacts[id] && !addedContacts.has(id) && renderedCount < maxBadges) {
            addedContacts.add(id); 
            renderedCount++;
            return renderBadge(contacts[id]);
        }
        return '';
    }).join('');
    const extraBadgesCount = assignedToArray.length - addedContacts.size;
    if (extraBadgesCount > 0) {
        badgesHtml += `<div class="badgeImg" style="background-color: grey">+${extraBadgesCount}</div>`;
    }
    return badgesHtml;
}

function getMinDate() {
const dateIn = document.getElementById('editedDate');
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
minDate =`${year}-${month}-${day}`;
dateIn.min = minDate;
dateIn.addEventListener('input', function() {
    const selectedDate = new Date(this.value);
    const minDate = new Date(dateIn.min);

    if (selectedDate < minDate) {
        this.value = ''; // Setze das Eingabefeld zurück, wenn das Datum ungültig ist
        alert('Bitte wähle ein Datum ab dem heutigen Tag aus.');
    }});
}