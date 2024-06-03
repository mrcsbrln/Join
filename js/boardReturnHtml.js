/**
 * Renders the HTML snippet for a task card, including progress bar and number of completed subtasks.
 * @param {Object} task - The task object containing information about the task.
 * @returns {string} The HTML snippet for the task card.
 */
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
                    <div id="progressBar${task.id}" class="progressBar"></div>
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

/**
 * Renders the top section of a large task card with details such as category, title, description, due date, priority, and assigned members.
 * @param {number} i - The index of the task.
 */
function renderCardBigTop(i) {
    document.getElementById('dialogContent').innerHTML = `
    <div class="taskCardBig">
        <div class="taskCardBigHeader">
            <label class="categoryBig">${tasks[i].category}</label>
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
        <span class="cardTextGrey">Subtasks</span>
        <div id="subtasks" class="subtasks"></div>
    </div>
    <div class="footerCardBig boardFlex">
        <div class="imgDelete boardFlex"><img src="assets/img/icons/delete.svg" alt="">
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
function renderCardBigSubHtml(subtask) {
    return `
    <ul class="subtasksItem">
    <li>
        <input type="checkbox" id="subtask-${subtask.id}" ${subtask.completet ? 'checked' : ''}>
        <label for="subtask-${subtask.id}">${subtask.content}</label>
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
            <input class="cardTextBlack inputEdit" type="text" value="${tasks[i].title}">
        </div>
        <div class="descriptionEdit">
            <p class="cardTextGrey">Description</p>
            <div class="textareaContainer">
                <textarea class="cardTextGrey" placeholder="">${tasks[i].description}</textarea>
            </div>
        </div>
        <div class="dueDateEdit">
            <p class="cardTextGrey">Due Date</p>
            <div>
                <input class="cardTextBlack inputEdit" type="date" value="${tasks[i].dueDate}">
            </div>
        </div>
        <div class="priorityEdit">
            <p class="cardTextGrey">Priority</p>
            <div class="prioEditContainer cardTextGrey">
                <button class="prioEdit">Urgent <img src="assets/img/icons/urgent.svg" alt=""></button>
                <button class="prioEdit">Medium <img src="assets/img/icons/medium.svg" alt=""></button>
                <button class="prioEdit">Low <img src="assets/img/icons/low.svg" alt=""></button>
            </div>
        </div>
        <div class="assignedEdit">
            <p class="cardTextGrey">Assigned to</p>
            <select class="cardTextBlack inputEdit">
                <option value="">Du</option>
                <option value="">Benjamin Blümchen</option>
                <option value="">Karl Heinz</option>
            </select>
        </div>
        <div id="profileBadgesEdit" class="profileBadgesEdit boardFlex">
        </div>
        <div class="subtaskEdit">
            <p class="cardTextGrey">Suptasks</p>
            <div>
            <input class="cardTextBlack inputEdit imgInput" type="text">
            <ul id="subtaskEditList" class="subtasksEditList">
            </ul>
            </div>
        </div>
    </div>
    <div class="footerCardEdit boardFlex">
        <div class="okBtnContainer">
            <button class="addBtn">Ok<img src="assets/img/icons/check.svg" alt=""></button>
        </div>
    </div>
   `
}