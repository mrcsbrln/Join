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
        "assignedTo": [0, 5, 6],
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

function init() {
    renderCards();
}


function openDialog() {
    document.getElementById('dialogContainer').classList.add('open');
}


function closeDialog(event) {
    if (event.currentTarget === event.target) {
        event.stopPropagation();
        document.getElementById('dialogContainer').classList.remove('open');
    }
}


function closeDialogBtn() {
    document.getElementById('dialogContainer').classList.remove('open');
}


function renderCards(filteredTasks = null) {
    const statuses = ["toDo", "inProgress", "awaitingFeedback", "done"];
    statuses.forEach(status => {
        const container = document.getElementById(`cardContainer${status}`);
        container.innerHTML = ''; // Clear existing cards in container

        const tasksToRender = filteredTasks ? filteredTasks.filter(task => task.status === status) : tasks.filter(task => task.status === status);

        tasksToRender.forEach(task => {
            container.innerHTML += renderCardHtml(task);
        });
    });

    checkContainerTodo();
}

function checkContainerTodo() {
    const container = document.getElementById('cardContainertoDo');
    document.getElementById('emptyTaskTodo').classList.toggle('hidden', container.innerHTML.trim() !== '');
    checkContainerInProgress();
}

function checkContainerInProgress() {
    const container = document.getElementById('cardContainerinProgress');
    document.getElementById('emptyTaskInProgress').classList.toggle('hidden', container.innerHTML.trim() !== '');
    checkContainerAwaitFeedback();
}

function checkContainerAwaitFeedback() {
    const container = document.getElementById('cardContainerawaitingFeedback');
    document.getElementById('emptyTaskAwait').classList.toggle('hidden', container.innerHTML.trim() !== '');
    checkContainerDone();
}

function checkContainerDone() {
    const container = document.getElementById('cardContainerdone');
    document.getElementById('emptyTaskDone').classList.toggle('hidden', container.innerHTML.trim() !== '');
}

function renderCardHtml(task) {
    const completedSubtasks = task.subTasks.filter(subtask => subtask.completet).length;
    return `
    <div draggable="true" ondragstart="startDragging(${task.id})" id="taskCard${task.id}"onclick="openDialog(); renderCardBig(${task.id})" class="taskCard">
        <label class="category">${task.category}</label>
        <p class="titelCard">${task.title}</p>
        <p class="descriptionCard">${task.description}</p>
        <div>
            <div class="progress boardFlex">
                <div class="progressBarContainer">
                    <div class="progressBar"></div>
                </div>
                <p class="amountSubtasks">${completedSubtasks}/${task.subTasks.length}</p>
            </div>
            <div class="footerCard boardFlex">
                <div class="profileBadges">
                    ${task.assignedTo.map(id => renderBadge(contacts[id])).join('')}
                </div>
                <div class="prioImg">
                    <img src="assets/img/icons/${task.priority}.svg" alt="">
                </div>
            </div>
        </div>
    </div>`;
}
function renderBadge(contact) {
    return `<div class="badgeImg" style="background-color: ${contact.color}">${contact.initials}</div>`;
}


function renderCardBig(i) {
    renderCardBigTop(i);
    renderCardBigSubTo(i);
    renderCardBigSubtask(i);
}


function renderCardBigTop(i) {
    document.getElementById('dialogContent').innerHTML = `
    <div class="taskCardBig">
        <div class="taskCardBigHeader">
            <label class="categoryBig">${tasks[i].category}</label>
            <span id="closeDialogBtn" onclick="closeDialogBtn()" class="closeBtn">
                <img src="assets/img/icons/close.svg" alt="">
            </span>
        </div>
        <p class="titelCardBig">${tasks[i].title}</p>
        <p class="descriptionCardBig cardTextBlack">${tasks[i].description}</p>
        <div class="dateContainer boardFlex">
            <p class="date cardTextGrey">Due date:</p>
            <p class="cardTextBlack">${tasks[i].dueDate}</p>
        </div>
        <div class="prioContainer boardFlex">
            <p class="priority cardTextGrey">Priority:</p>
            <div class="boardFlex">
                <p class="prioText cardTextBlack">${tasks[i].priority}</p>
                <img src="assets/img/icons/${tasks[i].priority}.svg" alt="">
            </div>
        </div>
        <span id="submitedTo" class="cardTextGrey">Assigned To:</span>
        <ul id="badgeContainer" class="profileBadgesBig"></ul>
    </div>
    <span class="cardTextGrey">Subtasks</span>
    <div id="subtasks" class="subtasks"></div>
    <div class="footerCardBig boardFlex">
        <div class="imgDelete boardFlex"><img src="assets/img/icons/delete.svg" alt="">
            <p>Delete</p>
        </div>
        <div class="seperator"></div>
        <div class="imgEdit boardFlex"><img src="assets/img/icons/edit.svg" alt="">
        <p>Edit</p>
        </div>
    </div>`
}



function renderCardBigSubTo(i) {
    badgeContainer = document.getElementById('badgeContainer');
    badgeContainer.innerHTML = '';
    tasks[i].assignedTo.forEach(id => {
        let contact = contacts[id];
        badgeContainer.innerHTML += `
        <li>
            <div class="badgeContainer">
                <span class="badgeImg" style="background-color: ${contact.color}">${contact.initials}</span>
                <span>${contact.name}</span>
            </div>
        </li>`
    });
}


function renderCardBigSubtask(i) {
    let subtasksHtml = '';
    tasks[i].subTasks.forEach(subtask => {
        subtasksHtml += `
            <ul class="subtasksItem">
                <li>
                    <input type="checkbox" id="subtask-${subtask.id}" ${subtask.completet ? 'checked' : ''}>
                    <label for="subtask-${subtask.id}">${subtask.content}</label>
                </li>
            </ul> `
    });
    document.getElementById('subtasks').innerHTML = subtasksHtml;
}

function startDragging(id) {
    draggedItemId = id;
    const card = document.getElementById(`taskCard${id}`);
    card.classList.add('dragging');
    highlightDropZones();

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(status) {
    const taskIndex = tasks.findIndex(task => task.id === draggedItemId);
    tasks[taskIndex].status = status;
    removeHighlight();
    renderCards();

}

function highlightDropZones() {
    const containers = document.querySelectorAll('.cardContainer');
    containers.forEach(container => {
        if (container.id !== `cardContainer${tasks.find(task => task.id === draggedItemId).status}`) {
            container.classList.add('highlightDragArea');
        }
    });
}


function removeHighlight() {
    const containers = document.querySelectorAll('.cardContainer');
    containers.forEach(container => {
        container.classList.remove('highlightDragArea');
    });
}

function getSearchKeyword() {
    let input = document.getElementById('searchBar').value;

    searchTasks(input);

}

function searchTasks(keyword) {
    const filteredTasks = tasks.filter(task => {
        return task.title.toLowerCase().includes(keyword.toLowerCase()) ||
            task.description.toLowerCase().includes(keyword.toLowerCase());
    });
    renderCards(filteredTasks);
}
