let contacts = [
    {
        "id": 0,
        "name": "Anton Mayer",
        "email": "antom@gmail.com",
        "phone": "+49 1111 11 111 1",
        "password": "1234",
        "color": "#FF70AA",
        "initials": "AM",
    },
    {
        "id": 1,
        "name": "Tatjana Wolf",
        "email": "wolf@gmail.com",
        "phone": "+49 2222 222 22 2",
        "password": "1234",
        "color": "#FFC700",
        "initials": "TW",
    },
    {
        "id": 2,
        "name": "Benedikt Ziegler",
        "email": "benedikt@gmail.com",
        "phone": "+49 3333 333 33 3",
        "password": "1234",
        "color": "#6E52FF",
        "initials": "BZ",
    },
    {
        "id": 3,
        "name": "David Eisenberg",
        "email": "davidberg@gmail.com",
        "phone": "+49 4444 444 44 4",
        "password": "1234",
        "color": "#FC71FF",
        "initials": "DE",
    },
    {
        "id": 4,
        "name": "Eva Fischer",
        "email": "eva@gmail.com",
        "phone": "+49 5555 555 55 5",
        "password": "1234",
        "color": "#FFBB2B",
        "initials": "EF",
    },
    {
        "id": 5,
        "name": "Emmanuel Mauer",
        "email": "emmanuelma@gmail.com",
        "phone": "+49 6666 666 66 6",
        "password": "1234",
        "color": "#1FD7C1",
        "initials": "EM",
    },
    {
        "id": 6,
        "name": "Marcel Bauer",
        "email": "bauer@gmail.com",
        "phone": "+49 7777 777 77 7",
        "password": "1234",
        "color": "#462F8A",
        "initials": "MB",
    },
    {
        "id": 7,
        "name": "Sofia Müller",
        "email": "sofia@gmail.com",
        "phone": "+49 8888 888 88 8",
        "password": "1234",
        "color": "#00BEE8",
        "initials": "SM",
    },
    {
        "id": 8,
        "name": "Anja Schulz",
        "email": "schulz@gmail.com",
        "phone": "+49 9999 999 99 9",
        "password": "1234",
        "color": "#9327FF",
        "initials": "AS",
    },
];

let tasks = [
    {
        "id": 0,
        "title": "Kochwelt Page & Recipe Recommender",
        "description": "Build start page with recipe recommendation.",
        "category": "User Story",
        "status": "toDo",
        "dueDate": "2024-07-31",
        "priority": "medium",
        "subTasks": [
            {
                "id": 0,
                "content": "Implement Recipe Recommendation",
                "completet": true,
            },
            {
                "id": 1,
                "content": "Start Page Layout",
                "completet": false,
            },
        ],
        "assignedTo": [0,1,2,3,4, 5, 6],
    },
    {
        "id": 1,
        "title": "CSS Architecture Planning",
        "description": "Define CSS naming conventions and structure",
        "category": "Technical Tasks",
        "status": "inProgress",
        "dueDate": "2024-07-31",
        "priority": "urgent",
        "subTasks": [
            {
                "id": 0,
                "content": "Establish CSS Methodology",
                "completet": true,
            },
            {
                "id": 1,
                "content": "Setup Base Styles",
                "completet": true,
            },
        ],
        "assignedTo": [2, 7],
    },
    {
        "id": 2,
        "title": "HTML Base Template Creation",
        "description": "Create reusable HTML base templates",
        "category": "Technical Tasks",
        "status": "awaitingFeedback",
        "dueDate": "2024-07-31",
        "priority": "low",
        "subTasks": [],
        "assignedTo": [2, 3, 8],
    },
    {
        "id": 3,
        "title": "Daily Kochwelt Recipe",
        "description": "Implement daily recipe and portion calculator",
        "category": "User Story",
        "status": "awaitingFeedback",
        "dueDate": "2024-07-31",
        "priority": "medium",
        "subTasks": [],
        "assignedTo": [1, 4, 8],
    },
    {
        "id": 4,
        "title": "Contact Form & Imprint",
        "description": "Create a contac form and imprint page",
        "category": "User Story",
        "status": "toDo",
        "dueDate": "2024-07-31",
        "priority": "medium",
        "subTasks": [
            {
                "id": 0,
                "content": "Create contact form",
                "completet": false,
            },
            {
                "id": 1,
                "content": "set up imprint page",
                "completet": false,
            },
        ],
        "assignedTo": [3, 4, 8],
    },
];

let draggedItemId = "";
let actSubtask = [];
let actAssignedTo = [];
/**
 * init function to render all Cards and highlight the boards Button on the Side Navigation
 */
function initBoard() {
    renderCards();
    includeHTML().then(highlightBoard);
}

/**
 * Opens the Dialog if a card is clicked
 */
function openDialog() {
    document.getElementById('dialogContainer').classList.add('open');
    document.documentElement.classList.add('overflowHidden');
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

/**
 * Closes the dialog when a button is clicked.
 */
function closeDialogBtn() {
    document.getElementById('dialogContainer').classList.remove('open');
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
    renderCardBigTop(i);
    renderCardBigSubTo(i);
    renderCardBigSubtask(i);
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
        subtasksHtml += renderCardBigSubHtml(subtask);
    });
    document.getElementById('subtasks').innerHTML = subtasksHtml;
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
    renderEditBadges();
    renderEditSubtaks();
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
 * Renders subtasks in the edit card interface.
 * Updates 'subtaskEditList' with the content of each subtask from `actSubtasks`.
 */
function renderEditSubtaks() {
    const subtaskContainer = document.getElementById('subtaskEditList');
    subtaskContainer.innerHTML = "";
    actSubtasks.forEach(subtask => {
        subtaskContainer.innerHTML += `
            <li>${subtask.content}</li>
        `;
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
function changeProgressBar(id) {
    const completedSubtasks = tasks[id].subTasks.filter(subtask => subtask.completet).length;
    const totalSubtasks = tasks[id].subTasks.length;

    let percent = 0;
    if (totalSubtasks !== 0) {
        percent = (completedSubtasks / totalSubtasks) * 100;
    }
    document.getElementById(`progressBar${id}`).style.width = percent + '%';
}