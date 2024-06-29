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
