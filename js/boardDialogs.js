
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
 * Opens the Dialog if a card is clicked
 */
function openDialog() {
    document.getElementById('dialogContainer').classList.add('open');
    document.documentElement.classList.add('overflowHidden');
}

function openDialogTasks(status) {
    document.getElementById('dialogContainerAddTask').classList.add('open');
    document.documentElement.classList.add('overflowHidden');
    actStatus = status;
}

/**
 * Closes the dialog if the background is clicked.
 * @param {Event} event - The event object.
 */
function closeDialog(event) {
    if (event.currentTarget === event.target) {
        event.stopPropagation();
        document.getElementById('dialogContainer').classList.remove('open');
        document.documentElement.classList.remove('overflowHidden');
    }
}

function closeDialogTask(event) {
    if (event.currentTarget === event.target) {
        event.stopPropagation();
        document.getElementById('dialogContainerAddTask').classList.remove('open');
        document.documentElement.classList.remove('overflowHidden');
    }
}

/**
 * Closes the dialog when a button is clicked.
 */
function closeDialogBtn() {
    document.getElementById('dialogContainer').classList.remove('open');
    document.documentElement.classList.remove('overflowHidden');
}

function closeDialogTaskBtn() {
    document.getElementById('dialogContainerAddTask').classList.remove('open');
    document.documentElement.classList.remove('overflowHidden');
}

/**
 * Renders a large version of a task card with additional details.
 * @param {number} i - The index of the task.
 */
function renderCardBig(i) {
    tasks.forEach((task, index) => {
        if (task.id == i) {
            renderCardBigHeader(index);
            renderCardBigTop(index);
            renderCardBigSubTo(index);
            renderCardBigSubtask(index);
        }
    });
}

function renderCardBigHeader(i) {
    let color = (tasks[i].category === 'User Story') ? 'Blue' : 'Green';
    document.getElementById('containerCloseBtn').innerHTML = renderCardBigHeaderHtml(i, color);
    document.getElementById('containerCloseBtn').classList.remove('flexEnd');
    document.getElementById('containerCloseBtn').classList.add('spaceBetween');
}

/**
 * Renders the assigned members section of a large task card.
 * @param {number} i - The index of the task.
 */
function renderCardBigSubTo(i) {
    const assignedToArray = Array.isArray(tasks[i]?.assignedTo) ? tasks[i].assignedTo : [];
    actAssignedTo = [];
    const badgeContainer = document.getElementById('badgeContainer');
    badgeContainer.innerHTML = '';
    assignedToArray.forEach(id => {
        if (contacts[id]) {
            const contact = contacts[id];
            actAssignedTo.push({
                color: contact.color,
                initials: contact.initials,
                name: contact.name
            });
            badgeContainer.innerHTML += renderCardBigSubToHtml(contact);
        }
    });
}

/**
 * Renders the subtasks section of a large task card.
 * @param {number} i - The index of the task.
 */
function renderCardBigSubtask(i) {
    let subtasksHtml = '';
    actSubtasks = [];
    if (tasks[i].subTasks === undefined) {
        tasks[i].subTasks = [];
    }
    tasks[i].subTasks.forEach(subtask => {
        actSubtasks.push({
            id: subtask.id,
            completet: subtask.completet,
            content: subtask.content
        });
        subtasksHtml += renderCardBigSubHtml(subtask, i);
    });
    document.getElementById('subtasks').innerHTML = subtasksHtml;
}

function handleSubtaskChange(taskId, subtaskId, checkboxElement) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const subtask = task.subTasks.find(st => st.id === subtaskId);
        if (subtask) {
            subtask.completet = checkboxElement.checked;
            updateTaskDisplay();
        }
    }
}

/**
 * Shows a task added message by adding a CSS class to the element with the class 'task-added-msg'.
 * After 2 seconds, it redirects to the board.
 *
 * @return {void} 
 */
function showTaskAddedMessage() {
    const messageElement = document.querySelector('.task-added-msg');
    messageElement.classList.add('d-flex-visible');
    setTimeout(() => {
        redirectToBoard()
    }, 2000);
}


/**
 * Sets the minimum date for the 'editedDate' input element to today's date and adds
 * a blur event listener for date validation.
 */
function getMinDate() {
    const dateIn = document.getElementById('editedDate');
    const minDate = getFormattedTodayDate();

    dateIn.min = minDate;
    addDateInputValidationListener(dateIn, minDate);
}

/**
 * Returns today's date in 'YYYY-MM-DD' format.
 * 
 * @returns {string} Formatted today's date.
 */
function getFormattedTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Adds a blur event listener to a date input element for date validation.
 * 
 * @param {HTMLInputElement} dateInput - The date input element.
 * @param {string} minDate - The minimum date in 'YYYY-MM-DD' format.
 */
function addDateInputValidationListener(dateInput, minDate) {
    dateInput.addEventListener('blur', function() {
        validateDateInput(this, minDate);
    });
}

/**
 * Validates the date input value against the minimum date and today's date,
 * resetting the input value if invalid.
 * 
 * @param {HTMLInputElement} dateInput - The date input element to validate.
 * @param {string} minDate - The minimum date in 'YYYY-MM-DD' format.
 */
function validateDateInput(dateInput, minDate) {
    const inputValue = dateInput.value.trim();
    const today = new Date();

    if (inputValue.length === 0 || new Date(inputValue) <= today) {
        setDateInputToMin(dateInput, minDate);
    } else {
        resetFieldStyle(dateInput, document.getElementById('edit-task-duo-date-required'));
    }
}

/**
 * Sets the date input value to the minimum date and displays a validation error.
 * 
 * @param {HTMLInputElement} dateInput - The date input element to update.
 * @param {string} minDate - The minimum date in 'YYYY-MM-DD' format.
 */
function setDateInputToMin(dateInput, minDate) {
    dateInput.value = minDate;
    showValidationError(dateInput, document.getElementById('edit-task-duo-date-required'));
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
