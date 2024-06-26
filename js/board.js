
let draggedItemId = "";
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
    highlightBoard();
    renderCards();
    highlightBoard();
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

/**
 * Renders a badge with the initials of a contact and background color.
 * @param {Object} contact - The contact object containing information such as initials and color.
 * @returns {string} - The HTML string representing the badge.
 */
function renderBadge(contact) {
    return `<div class="badgeImg" style="background-color: ${contact.color}">${contact.initials}</div>`;
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
    // Sicherstellen, dass tasks[i].assignedTo ein Array ist oder ein leeres Array verwenden
    const assignedToArray = Array.isArray(tasks[i]?.assignedTo) ? tasks[i].assignedTo : [];

    // Leeren der bisherigen Zuordnungen
    actAssignedTo = [];
    const badgeContainer = document.getElementById('badgeContainer');
    badgeContainer.innerHTML = '';

    // Durchlaufen des assignedTo-Arrays und Rendering der Badges
    assignedToArray.forEach(id => {
        // Überprüfen, ob die ID im contacts-Objekt existiert
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

    // Löschen aus der lokalen Liste
    tasks.splice(i, 1);

    // Löschen aus der Datenbank
    await deleteTaskFromDatabase(taskId);

    // Schließen des Dialogs und Neu-Rendern der Aufgabenliste
    closeDialogBtn();
    renderCards();
}
/**
 * Renders the edit card interface for a specific task.
 * It then calls `renderEditBadges` to render any badges and `renderEditSubtasks`
 * to display the subtasks of the task.
 *
 * @param {number} i - The index of the task in the tasks array.
 */
function renderCardEdit(i) {
    document.getElementById('containerCloseBtn').innerHTML = renderCardEditHeaderHtml();
    document.getElementById('containerCloseBtn').classList.add('flexEnd');
    document.getElementById('containerCloseBtn').classList.remove('spaceBetween');
    document.getElementById('dialogContent').innerHTML = renderCardEditHtml(i);

    if (tasks[i] && tasks[i].assignedTo) {
        taskEditAsiggnedTo = tasks[i].assignedTo.slice();
    } else {
        taskEditAsiggnedTo = [];
    }

    changePrioBtnEdit(i);
    renderContactsEdit(i);
    renderSelectedContactsEdit();
    renderEditSubtasks(i);
}

function showDropdown() {
    const dropdown = document.getElementById('dropDownContact');
    dropdown.classList.toggle('show-menu');
    const searchInput = document.getElementById('searchContacts');
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            dropdown.classList.add('show-menu');
            filterContactEdit();
        });
    }
}

function renderContactsEdit(i, filteredContacts = null) {
    const listContacts = document.getElementById('listContacts');
    listContacts.innerHTML = '';

    const contactsToRender = filteredContacts ? filteredContacts : contacts;

    if (!tasks[i]) {
        return;
    }
    if (!tasks[i].assignedTo || typeof tasks[i].assignedTo.includes !== 'function') {
        return;
    }
    contactsToRender.forEach(contact => {
        const isAssigned = tasks[i].assignedTo.includes(contact.id);
        const checkedClass = isAssigned ? 'checked' : '';

        listContacts.innerHTML += renderContactsEditHtml(contact, isAssigned, checkedClass);
    });

    selectListItemsEdit(i);
}



function selectListItemsEdit(i) {
    const listItems = document.querySelectorAll('.contactListItems');
    listItems.forEach((item, j) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.checkbox');
            item.classList.toggle('checked');
            img.classList.toggle('checked');
            const contactId = j;
            if (item.classList.contains('checked')) {
                taskEditAsiggnedTo.push(contactId);
                img.src = './assets/img/icons_add_task/checkedbox.svg';
            } else {
                const indexToRemove = taskEditAsiggnedTo.indexOf(contactId);
                if (indexToRemove !== -1) {
                    taskEditAsiggnedTo.splice(indexToRemove, 1);
                }
                img.src = './assets/img/icons_add_task/checkbox.svg';
            }
            renderSelectedContactsEdit();
        });
    });
}

function renderSelectedContactsEdit() {
    const selectedContactsDiv = document.querySelector('.selectedContactsContainer');
    selectedContactsDiv.innerHTML = '';
    taskEditAsiggnedTo.forEach(i => {
        selectedContactsDiv.innerHTML += `
            <div class="cicle" style="background-color: ${contacts[i].color}">${contacts[i].initials}</div>
        `;
    })
}

function getTaskAndPriority(taskIndex) {
    const task = tasks[taskIndex];
    const currentPrio = task.priority;
    actTaskPrio = currentPrio;
    return { task, currentPrio };
}

function handlePrioButtonClick(event, task, svgMappingsEdit) {
    const button = event.target.closest('.prioEdit');
    if (!button) return;
    const selectedPrio = button.value;
    task.priority = selectedPrio;
    actTaskPrio = selectedPrio;
    updatePrioButtons(selectedPrio, svgMappingsEdit);
}

function updatePrioButtons(selectedPrio, svgMappingsEdit) {
    document.querySelectorAll('.prioEdit').forEach(btn => {
        const prio = btn.value;
        const img = btn.querySelector('img');

        if (prio === selectedPrio) {
            btn.classList.add('active');
            img.src = svgMappingsEdit[`${prio}-active`];
        } else {
            btn.classList.remove('active');
            img.src = svgMappingsEdit[prio];
        }
    });
}

function setInitialPrioButtons(currentPrio, svgMappingsEdit) {
    document.querySelectorAll('.prioEdit').forEach(btn => {
        const prio = btn.value;
        const img = btn.querySelector('img');

        if (prio === currentPrio) {
            btn.classList.add('active');
            img.src = svgMappingsEdit[`${prio}-active`];
        } else {
            btn.classList.remove('active');
            img.src = svgMappingsEdit[prio];
        }
    });
}

function changePrioBtnEdit(taskIndex) {
    const prioContainer = document.querySelector('.prioBtn');
    if (!prioContainer) return;

    const { task, currentPrio } = getTaskAndPriority(taskIndex);

    prioContainer.addEventListener('click', (event) => {
        handlePrioButtonClick(event, task, svgMappingsEdit);
    });

    setInitialPrioButtons(currentPrio, svgMappingsEdit);
    actTaskPrio = currentPrio;
}

function renderEditSubtasks() {
    const subtasksList = document.getElementById('subtaskList');
    subtasksList.innerHTML = "";
    actSubtasks.forEach((item, index) => {
        subtasksList.innerHTML += renderEditSubtasksUneditedHtml(item, index);
    });
    subTaskEdit();
}

function subTaskEdit() {
    const subtaskListItems = document.querySelectorAll('.subtask-list-item');
    subtaskListItems.forEach((item, index) => {
        const editSubtaskBtn = item.querySelector('.edit-subtask-btn');
        editSubtaskBtn.addEventListener('click', () => {
            let input = item.querySelector('.edit-subtask-input');
            if (!input) {
                let liText = item.querySelector('.li-text');
                const content = liText.textContent.trim();
                item.innerHTML = renderSubtaskEditHtml(content, index);
                item.classList.add('subtask-list-item-edit');
                acceptSubtaskEdit();
            }
        });
    });
}

function acceptSubtaskEdit() {
    const subtaskListItemsEdit = document.querySelectorAll('.subtask-list-item-edit');

    subtaskListItemsEdit.forEach(item => {
        const confirmSubtaskEditBtn = item.querySelector('.confirm-subtask-edit-btn');
        confirmSubtaskEditBtn.addEventListener('click', () => {
            const index = item.getAttribute('data-index');
            const input = item.querySelector('.edit-subtask-input');
            actSubtasks[index].content = input.value;
            renderEditSubtasks();
        });
    });
}

function deleteSubtaskEdit(index) {
    actSubtasks.splice(index, 1);
    renderEditSubtasks();
}

function styleSubtaskInputEdit() {
    const subtaskBtnAdd = document.getElementById('addSubtaskBtn');
    const subtaskBtnCheckCancel = document.getElementById('cancelDiv');
    subtaskBtnAdd.classList.add('hidden');
    subtaskBtnCheckCancel.classList.add('show');
}

function pushSubtaskEdit() {
    const subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInput) {
        const subtaskInputValue = subtaskInput.value.trim();

        if (subtaskInputValue !== '') {
            actSubtasks.push({
                id: actSubtasks.length + 1,
                completet: false,
                content: subtaskInputValue
            });

            renderEditSubtasks();
            subtaskInput.value = '';
            hideInputTools();
        }
    }
}

function hideInputTools() {
    document.getElementById('addSubtaskBtn').classList.remove('hidden');
    document.getElementById('cancelDiv').classList.remove('show');
}

function emptyInput() {
    document.getElementById('subtaskInput').value = "";
}

function filterContactEdit() {
    const searchInput = document.getElementById('searchContacts').value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().startsWith(searchInput)
    );
    renderContactsEdit(0, filteredContacts);
}

/**
 * Renders badges for assigned contacts in the edit card interface.
 */
function renderEditBadges() {
    const badgeContainer = document.getElementById('profileBadgesEdit');
    badgeContainer.innerHTML = '';
    actAssignedTo.forEach(contact => {
        badgeContainer.innerHTML += `
            <span class="badgeImg" style="background-color: ${contact.color}">${contact.initials}</span>`;
    });
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
function drop(status) {
    const taskIndex = tasks.findIndex(task => task.id === draggedItemId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = status;
    }
    putDataEdit(`/tasks/${tasks[taskIndex].id}`, tasks[taskIndex])
    removeHighlight();
    renderCards();
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
            const completedSubtasks = task.subTasks.filter(subtask => subtask.completet).length;
            const totalSubtasks = task.subTasks.length;

            let percent = 0;
            if (totalSubtasks !== 0) {
                percent = (completedSubtasks / totalSubtasks) * 100;
            }
            document.getElementById(`progressBar${i}`).style.width = percent + '%';

            // Update data in the database
            try {
                await putData(`/tasks/${task.id}`, task);
            } catch (error) {
            }
        }
    });
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

    
        // 1. Aktualisiere den Status lokal im tasks-Array
        tasks[taskIndex].status = newStatus;

        // 2. Aktualisiere die Datenbank mit der neuen Task-Information
        await putDataEdit(`/tasks/${taskIndex}`, tasks[taskIndex]);

        // 3. Rendere die Karten neu, um die visuelle Änderung anzuzeigen
        toggleDropdown(dropdownId);
        renderCards();

        // 4. Schließe das Dropdown-Menü
        

    } catch (error) {
        console.error('Fehler beim Aktualisieren der Datenbank oder beim Rendern der Karten:', error);
        // Hier könnten weitere Fehlerbehandlungsschritte implementiert werden
    }
}/**
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