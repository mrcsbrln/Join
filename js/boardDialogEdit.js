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



function renderContactsEdit(i, filteredContacts = null) {
    const listContacts = document.getElementById('listContacts');
    listContacts.innerHTML = '';

    const contactsToRender = filteredContacts ? filteredContacts : contacts;


    contactsToRender.forEach(contact => {
        const isAssigned = tasks[i].assignedTo.includes(contact.id);
        const checkedClass = isAssigned ? 'checked' : '';

        listContacts.innerHTML += renderContactsEditHtml(contact, isAssigned, checkedClass);
    });

    selectListItemsEdit(i,contactsToRender);
}

function filterContactEdit(i) {
    const searchInput = document.getElementById('searchContacts').value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().startsWith(searchInput)
    );
    document.getElementById('dropDownContact').classList.add('show-menu');
    renderContactsEdit(i, filteredContacts);

}



function toggleSelection(item, contactId) {
    const img = item.querySelector('.checkbox');
    item.classList.toggle('checked');
    img.classList.toggle('checked');

    if (item.classList.contains('checked')) {
        if (!taskEditAsiggnedTo.includes(contactId)) {
            taskEditAsiggnedTo.push(contactId);
        }
        img.src = './assets/img/icons_add_task/checkedbox.svg';
    } else {
        const indexToRemove = taskEditAsiggnedTo.indexOf(contactId);
        if (indexToRemove !== -1) {
            taskEditAsiggnedTo.splice(indexToRemove, 1);
        }
        img.src = './assets/img/icons_add_task/checkbox.svg';
    }
    renderSelectedContactsEdit();
}


function syncCheckboxState(item, contactId) {
    const img = item.querySelector('.checkbox');
    if (taskEditAsiggnedTo.includes(contactId)) {
        item.classList.add('checked');
        img.classList.add('checked');
        img.src = './assets/img/icons_add_task/checkedbox.svg';
    } else {
        item.classList.remove('checked');
        img.classList.remove('checked');
        img.src = './assets/img/icons_add_task/checkbox.svg';
    }
}


function setupClickListener(item, contactId) {
    item.addEventListener('click', () => {
        toggleSelection(item, contactId);
    });
}


function updateCheckboxState(listItems) {
    listItems.forEach((item) => {
        const contactId = parseInt(item.getAttribute('data-contact-id'), 10);
        syncCheckboxState(item, contactId);
        setupClickListener(item, contactId);
    });
}


function selectListItemsEdit(i, filteredContacts) {
    const listItems = document.querySelectorAll('.contactListItems');
    updateCheckboxState(listItems);
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
    eventEnterSubtaskEdit();
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

function eventEnterSubtaskEdit() {
    const subtaskInput = document.getElementById('subtaskInput');
    const addButton = document.getElementById('pushSubtaskEditBtn');
    subtaskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            pushSubtaskEdit();
        }
    });
    if (addButton) {
        addButton.addEventListener('click', function () {
            pushSubtaskEdit();
        });
    }
}

function hideInputTools() {
    document.getElementById('addSubtaskBtn').classList.remove('hidden');
    document.getElementById('cancelDiv').classList.remove('show');
}

function emptyInput() {
    document.getElementById('subtaskInput').value = "";
}


function showDropdown() {
    const dropdown = document.getElementById('dropDownContact');
    const searchInput = document.getElementById('searchContacts');
    dropdown.classList.toggle('show-menu');
}

function closeContactListEdit() {
    document.getElementById('dropDownContact').classList.remove('show-menu');
}


function closeContactListEditOnOutsideClick() {
    document.addEventListener('click', function (event) {
        const selectBtnContainer = document.getElementById('dropDownContact');
        const listItemsContainer = document.getElementById('listContacts');

        // Check if selectBtnContainer or listItemsContainer is null before using .contains()
        if (selectBtnContainer && listItemsContainer &&
            !selectBtnContainer.contains(event.target) && !listItemsContainer.contains(event.target)) {
            closeContactListEdit();
        }
    });
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

