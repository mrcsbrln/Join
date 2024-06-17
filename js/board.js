
let draggedItemId = "";
let actSubtask = [];
let actAssignedTo = [];
let taskEditAsiggnedTo = [];
let svgMappingsEdit = {
    'urgent': 'assets/img/icons_add_task/urgent.svg',
    'urgent-active': 'assets/img/icons_add_task/urgent-white.svg',
    'medium': 'assets/img/icons_add_task/medium.svg',
    'medium-active': 'assets/img/icons_add_task/medium-white.svg',
    'low': 'assets/img/icons_add_task/low.svg',
    'low-active': 'assets/img/icons_add_task/low-white.svg'
};
/**
 * init function to render all Cards and highlight the boards Button on the Side Navigation
 */
function initBoard() {
    renderCards();
    includeHTML().then(() => {
        highlightBoard();
        updateHeaderProfileInitials();
    });
}

/**
 * Opens the Dialog if a card is clicked
 */
function openDialog() {
    document.getElementById('dialogContainer').classList.add('open');
    document.documentElement.classList.add('overflowHidden');
}

function openDialogTasks() {
    document.getElementById('dialogContainerAddTask').classList.add('open');
    document.documentElement.classList.add('overflowHidden');
    filterContacts();
    showMenu();
    changeSvgOnHover();
    changePrioBtn();
    changeSvgOnHover();
    categoryMenu();
    styleSubtaskInput();
    pushSubtask();
    renderContacts();
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
            renderCardBigTop(index);
            renderCardBigSubTo(index);
            renderCardBigSubtask(index);
        }

    });

}

/**
 * Renders the assigned members section of a large task card.
 * @param {number} i - The index of the task.
 */
function renderCardBigSubTo(i) {
    actAssignedTo = [];
    badgeContainer = document.getElementById('badgeContainer');
    badgeContainer.innerHTML = '';
    tasks[i].assignedTo.forEach(id => {
        let contact = contacts[id];
        actAssignedTo.push({
            color: contact.color,
            initials: contact.initials,
            name: contact.name
        });
        badgeContainer.innerHTML += renderCardBigSubToHtml(contact);
    });
}

/**
 * Renders the subtasks section of a large task card.
 * @param {number} i - The index of the task.
 */
function renderCardBigSubtask(i) {
    let subtasksHtml = '';
    actSubtasks = [];
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

/**
 * Renders the edit card interface for a specific task.
 * It then calls `renderEditBadges` to render any badges and `renderEditSubtasks`
 * to display the subtasks of the task.
 *
 * @param {number} i - The index of the task in the tasks array.
 */
function renderCardEdit(i) {
    document.getElementById('dialogContent').innerHTML = renderCardEditHtml(i);
    taskEditAsiggnedTo = tasks[i].assignedTo.slice();
    changePrioBtnEdit(i);
    renderContacsEdit(i);
    selectListItemsEdit(i);
    styleSubtaskInput();
 
    renderSelectedContactsEdit();
    renderEditSubtasks(i);
    pushSubtask();
}


function showDropdown() {
    document.getElementById('dropDownContact').classList.toggle('show-menu')
}

function renderContacsEdit(i) {
    const listContacts = document.getElementById('listContacts');
    contacts.forEach(item => {
        // Check if contact is already assigned

        const isAssigned = tasks[i].assignedTo.includes(item.id);

        const checkedClass = isAssigned ? 'checked' : '';

        listContacts.innerHTML += `
            <li class="list-item assigned-to contactListItems ${checkedClass}">
                <div class="list-item-name">
                    <div class="cicle" style="background-color: ${item.color}">${item.initials}</div>
                    <span>${item.name}</span>
                </div>
                <img class="checkbox" src="./assets/img/icons_add_task/${isAssigned ? 'checkedbox' : 'checkbox'}.svg" alt="">
            </li>
        `;
    });
}

function selectListItemsEdit(i) {
    const listItems = document.querySelectorAll('.contactListItems');
    listItems.forEach((item, j) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.checkbox');
            item.classList.toggle('checked');
            img.classList.toggle('checked');

            const contactId = j; // Nehmen Sie die ID des Kontakts aus NodeList

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

function saveEdit(i) {
    tasks[i].assignedTo = taskEditAsiggnedTo;
    tasks[i].title = document.getElementById('editedTitle').value;
    tasks[i].description = document.getElementById('editedDescription').value;
    tasks[i].dueDate = document.getElementById('editedDate').value;
    closeDialogBtn();
    renderCards();
}

function deleteTask(i) {
    tasks.splice(i, 1);
    closeDialogBtn();
    renderCards();
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
    tasks[taskIndex].status = status;
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
    const containers = document.querySelectorAll('.cardContainer');
    containers.forEach(container => {
        container.classList.remove('highlightDragArea');
    });
}

/**
 * Updates the progress bar width based on completed and total subtasks.
 * @param {number} id - The ID of the task.
 */
function changeProgressBar(i) {
    tasks.forEach((task, index) => {
        if (task.id == i) {
            const completedSubtasks = tasks[index].subTasks.filter(subtask => subtask.completet).length;
            const totalSubtasks = tasks[index].subTasks.length;

            let percent = 0;
            if (totalSubtasks !== 0) {
                percent = (completedSubtasks / totalSubtasks) * 100;
            }
            document.getElementById(`progressBar${i}`).style.width = percent + '%';

        }

    });

}

function changePrioBtnEdit() {
    const prioContainer = document.querySelector('.prio-buttons');
    if (!prioContainer) return;

    prioContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.prioEdit');
        if (!button) return;
        document.querySelectorAll('.prioEdit').forEach(btn => {
            const prio = btn.value;
            const img = btn.querySelector('img');
            if (btn === button) {
                btn.classList.add('active');
                img.src = svgMappingsEdit[`${prio}-active`];
            } else {
                btn.classList.remove('active');
                img.src = svgMappingsEdit[prio];
            }
        });
    });
}

function renderEditSubtasks(i) {
    tasks[i].subTasks.forEach(subtask => {
        document.getElementById('subtaskList').innerHTML += renderSubtaskEditHtml(subtask,i);
       
    });
   
}
