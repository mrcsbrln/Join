// Funktion zum Rendern der Dropdown-Optionen für den Statuswechsel
function renderDropdownOptions(taskId, currentStatus) {
    const allStatuses = ['toDo', 'inProgress', 'done', 'awaitingFeedback'];
    const availableStatuses = allStatuses.filter(status => status !== currentStatus);
    const dropdownId = `dropdown-content-${taskId}`;

    return availableStatuses.map(status => `
        <p onclick="moveToStatus(${taskId}, '${status}', '${dropdownId}')">${statusLabels[status]}</p>
    `).join('');
}

// Funktion zum Rendern der Badges für die zugewiesenen Kontakte
function renderBadges(assignedToArray, maxBadges = 6) {
    let renderedCount = 0;
    let addedContacts = new Set(); // Vermeidung von Duplikaten

    let badgesHtml = assignedToArray.map(id => {
        if (contacts[id] && !addedContacts.has(id) && renderedCount < maxBadges) {
            addedContacts.add(id); // Kontakt als hinzugefügt markieren
            renderedCount++;
            return renderBadge(contacts[id]);
        }
        return '';
    }).join('');

    // Anzahl zusätzlicher Badges berechnen
    const extraBadgesCount = assignedToArray.length - addedContacts.size;
    if (extraBadgesCount > 0) {
        badgesHtml += `<div class="badgeImg" style="background-color: grey">+${extraBadgesCount}</div>`;
    }

    return badgesHtml;
}

// Funktion zum Rendern der Fortschrittsanzeige
function renderProgress(task) {
    const completedSubtasks = task.subTasks ? task.subTasks.filter(subtask => subtask.completet).length : 0;
    const totalSubtasks = task.subTasks ? task.subTasks.length : 0;

    return `
        <div class="progress boardFlex">
            <div class="progressBarContainer">
                <div id="progressBar${task.id}" class="progressBar"></div>
            </div>
            <p class="amountSubtasks">${completedSubtasks}/${totalSubtasks}</p>
        </div>
    `;
}

// Hauptfunktion zum Rendern der Task-Karte
function renderCardHtml(task) {
    const color = (task.category === 'User Story') ? 'Blue' : 'Green';
    const assignedToArray = Array.isArray(task.assignedTo) ? task.assignedTo : [];
    const dropdownOptions = renderDropdownOptions(task.id, task.status);
    const badgesHtml = renderBadges(assignedToArray);
    const progressHtml = renderProgress(task);

    return `
    <div draggable="true" ondragstart="startDragging(${task.id})" id="taskCard${task.id}" class="taskCard">
        <div class="taskCardTop">
            <label class="category${color}">${task.category}</label>
            <div class="dropdown">
                <button onclick="toggleDropdown('dropdown-content-${task.id}')" class="dropdown-btn">
                    <div class="dropdownBtnContainer"><img src="assets/img/icons/contacts_sub_menu.svg" alt="Dropdown Arrow"></div>
                </button>
                <div id="dropdown-content-${task.id}" class="dropdown-content">
                    ${dropdownOptions}
                </div>
            </div>
        </div>
        <div class="cardBody" onclick="openDialog(); renderCardBig(${task.id})">
            <p class="titleCard">${task.title}</p>
            <p class="descriptionCard">${task.description}</p>
            <div>
                ${progressHtml}
                <div class="footerCard boardFlex">
                    <div class="profileBadges">
                        ${badgesHtml}
                    </div>
                    <div class="prioImg">
                        <img src="assets/img/icons/${task.priority}.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// Beispielimplementierung der Funktion renderBadge
function renderBadge(contact) {
    return `<div class="badgeImg" style="background-color: ${contact.color}">${contact.initials}</div>`;
}

/**
 * Renders the top section of a large task card with details such as category, title, description, due date, priority, and assigned members.
 * @param {number} i - The index of the task.
 */
function renderCardBigTop(i) {
    document.getElementById('dialogContent').innerHTML = `
    <div class="taskCardBig">
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
        <span class="cardTextGrey">Subtasks</span>
        <div id="subtasks" class="subtasks"></div>
    </div>
    <div class="footerCardBig boardFlex">
        <div onclick="deleteTask(${i})" class="imgDelete boardFlex"><img src="assets/img/icons/delete.svg" alt="">
            <p>Delete</p>
        </div>
        <div class="seperator"></div>
        <div onclick="renderCardEdit(${i})" class="imgEdit boardFlex"><img src="assets/img/icons/edit.svg" alt="">
            <p>Edit</p>
        </div>
    </div>`
}

/**
 * Renders HTML for a subtask item in the detailed task view.
 * 
 * @param {Object} subtask - The subtask object containing id, completet, and content.
 * @returns {string} - The HTML string for the subtask item.
 */
function renderCardBigSubHtml(subtask, taskId) {
    return `
    <ul class="subtasksItem">
        <li>
            <input type="checkbox" id="subtask${subtask.id}" ${subtask.completet ? 'checked' : ''} onchange="handleSubtaskChange(${tasks[taskId].id}, ${subtask.id}, this)">
            <label for="subtask${subtask.id}">${subtask.content}</label>
        </li>
    </ul> `
}

/**
 * Renders HTML for a badge representing a contact in the detailed task view.
 * 
 * @param {Object} contact - The contact object containing color, initials, and name.
 * @returns {string} - The HTML string for the badge representing the contact.
 */
function renderCardBigSubToHtml(contact) {
    return `
    <li>
        <div class="badgeContainer">
            <span class="badgeImg" style="background-color: ${contact.color}">${contact.initials}</span>
            <span>${contact.name}</span>
        </div>
    </li>`
}

function renderCardBigHeaderHtml(i, color) {
    return `
     <label class="categoryBig${color}">${tasks[i].category}</label>
    <span onclick="closeDialogBtn()" class="closeBtn closeEdit">
        <img src="assets/img/icons/close.svg" alt="">
    </span>
    `}

function renderCardEditHeaderHtml() {
    return `   
               <span onclick="closeDialogBtn()" class="closeBtn closeEdit">
                   <img src="assets/img/icons/close.svg" alt="">
               </span>
   `}

/**
 * Generates HTML for editing task details in the dialog box.
 * 
 * @param {number} i - The index of the task.
 * @returns {string} - The HTML string for editing task details.
 */
function renderCardEditHtml(i) {
    return `
    <div class="titleEdit">
        <p class="cardTextGrey">Title</p>
        <input id="editedTitle" class="cardTextBlack inputEdit margin-bottom-4" type="text" value="${tasks[i].title}">
        <div id="edit-task-title-required" class="field-required-msg margin-edit-task-inputs">This field is required</div>
    </div>
    <div class="descriptionEdit">
        <p class="cardTextGrey">Description</p>
        <div class="textareaContainer">
            <textarea id="editedDescription" class="cardTextGrey" placeholder="">${tasks[i].description}</textarea>
        </div>
    </div>
    <div class="dueDateEdit">
        <p class="cardTextGrey">Due Date</p>
        <div>
            <input id="editedDate" class="cardTextBlack inputEdit margin-bottom-4" type="date" value="${tasks[i].dueDate}">
            <div id="edit-task-duo-date-required" class="field-required-msg margin-edit-task-inputs">This field is required</div>
        </div>
    </div>
    <div class="priorityEdit">
        <p class="cardTextGrey">Priority</p>
        <div class="prio-buttons prioBtn">
            <button type="button" value="urgent" class="prio-btn prioEdit urgent">Urgent<img src="./assets/img/icons_add_task/urgent.svg" alt=""></button>
            <button type="button" value="medium" class="prio-btn prioEdit medium">Medium<img src="./assets/img/icons_add_task/medium-white.svg" alt=""></button>
            <button type="button" value="low" class="prio-btn prioEdit low">Low<img src="./assets/img/icons_add_task/low.svg" alt=""></button>
        </div>
    </div>
    <div class="assignedEdit">
        <p class="cardTextGrey">Assigned to</p>
        <div class="dropdown-container">
            <div onclick="showDropdown()" id="dropDownContact" class="select-btn">
                <input onkeyup="filterContactEdit()" id="searchContacts" class="select-btn-input selectBtnIn" type="text" Placeholder="Select contacts to assign">
                <span class="arrow-down">
                    <img src="./assets/img/icons_add_task/chevron.svg" alt="">
                </span>
            </div>
            <ul id="listContacts" class="list-items">
            </ul>
            <div class="selected-contacts-div selectedContactsContainer">
            </div>
        </div>
    </div>
    <div id="profileBadgesEdit" class="profileBadgesEdit boardFlex">
    </div>
    <div class="form-group">
        <p class="cardTextGrey">Subtasks</p>
        <div class="subtask-input-container subtaskContainer">
            <input onclick="styleSubtaskInputEdit()" id="subtaskInput" class="form-input subtask-input subtaskInputEdit" type="text" placeholder="Add new subtask">
            <div id="addSubtaskBtn" class="subtask-btn add" onclick="hideInputTools()">
                <img onclick="styleSubtaskInputEdit()"  src="./assets/img/icons_add_task/add.svg" alt="">
            </div>
            <div id="cancelDiv" class="subtask-btn check-cancel-div">
                <div onclick="emptyInput()" id="subtaskCancel" class="subtask-cancel" >
                    <img onclick="emptyInput()" src="./assets/img/icons_add_task/subtask-close.svg" alt="">
                </div>
                <div class="subtask-divider"></div>
                    <div onclick="pushSubtaskEdit()" class="subtask-check subtaskChekEdit">
                        <img src="./assets/img/icons_add_task/subtask-check.svg" alt="">
                    </div>
                </div>
            </div>
            <div class="display-subtasks-container">
                <ul id="subtaskList" class="subtasks-list">
                 </ul>
            </div>
        </div>
    </div>
    <div class="footerCardEdit boardFlex">
        <div class="okBtnContainer">
            <button onclick="saveEditValidation(${i})" class="addBtn">Ok<img src="assets/img/icons/check.svg" alt=""></button>
        </div>
    </div>
   `
}

function renderSubtaskEditHtml(content, index) {
    return `
            <input class="edit-subtask-input" type="text" value="${content}">
            <div class="edit-subtask-button-div">
                <span onclick="deleteSubtaskEdit(${index})" class="delete-subtask-btn edit"><img src="./assets/img/icons_add_task/subtask-delete.svg"></span>
                <div class="subtask-divider"></div>
                <span class="confirm-subtask-edit-btn"><img src="./assets/img/icons_add_task/subtask-check.svg"></span>
            </div>
                `
}


function renderEditSubtasksUneditedHtml(item, index) {
    return `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">
                    ${item.content} 
                </div>
                <div class="subtask-edit-icon-div">
                    <img  class="edit-subtask-btn" src="./assets/img/icons_add_task/subtask-edit.svg" alt="">
                    <div class="subtask-divider-2"></div>
                    <img onclick="deleteSubtaskEdit(${index})" class="delete-subtask-btn" src="./assets/img/icons_add_task/subtask-delete.svg" alt="">
                </div>
            </li>
        `
}

function renderContactsEditHtml(contact, isAssigned, checkedClass) {
    return ` <li class="list-item assigned-to contactListItems ${checkedClass}">
                <div class="list-item-name">
                    <div class="cicle" style="background-color: ${contact.color}">${contact.initials}</div>
                    <span>${contact.name}</span>
                </div>
                <img class="checkbox" src="./assets/img/icons_add_task/${isAssigned ? 'checkedbox' : 'checkbox'}.svg" alt="">
            </li>
`;
}