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

/**
 * Renders a list of contacts for editing based on the provided index and optional filtered list.
 *
 * Clears the existing content in 'listContacts' element and populates it with HTML generated
 * from each contact in the filtered list or default contacts array.
 *
 * @param {number} i - The index of the task in the tasks array.
 * @param {Array} [filteredContacts=null] - Optional. An array of contacts to render instead of default contacts.
 */
function renderContactsEdit(i, filteredContacts = null) {
    const listContacts = document.getElementById('listContacts');
    listContacts.innerHTML = '';

    const contactsToRender = filteredContacts ? filteredContacts : contacts;


    contactsToRender.forEach(contact => {
        const isAssigned = tasks[i].assignedTo.includes(contact.id);
        const checkedClass = isAssigned ? 'checked' : '';

        listContacts.innerHTML += renderContactsEditHtml(contact, isAssigned, checkedClass);
    });

    selectListItemsEdit(i, contactsToRender);
}

/**
 * Filters and displays contacts for editing based on the search input.
 * Retrieves the search input value, filters the contacts whose names start with
 * the search input in a case-insensitive manner, and renders the filtered contacts
 *
 * @param {number} i - The index of the task in the tasks array.
 */
function filterContactEdit(i) {
    const searchInput = document.getElementById('searchContacts').value.toLowerCase();
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().startsWith(searchInput)
    );
    document.getElementById('dropDownContact').classList.add('show-menu');
    renderContactsEdit(i, filteredContacts);

}

/**
 * Toggles the selection state of a contact item.
 *
 * Toggles the 'checked' class on the item and its checkbox image ('.checkbox'). 
 * Manages the `taskEditAsiggnedTo` array to track selected contact IDs based on the item's state.
 * Updates the checkbox image source accordingly to reflect the selection state.
 *
 * @param {HTMLElement} item - The HTML element representing the contact item.
 * @param {string} contactId - The unique identifier of the contact.
 */
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

/**
 * Synchronizes the checkbox state of a contact item with the `taskEditAsiggnedTo` array.
 *
 * Checks if the `taskEditAsiggnedTo` array includes the specified contact ID. Updates
 * the visual state of the item and its checkbox image accordingly.
 *
 * @param {HTMLElement} item - The HTML element representing the contact item.
 * @param {string} contactId - The unique identifier of the contact.
 */
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

/**
 * Sets up a click listener on an item to toggle its selection state. 
 */
function setupClickListener(item, contactId) {
    item.addEventListener('click', () => {
        toggleSelection(item, contactId);
    });
}

/**
 * Updates the checkbox state and click listener for a list of items.
 *
 * Iterates over the provided list of items, synchronizing each item's checkbox state
 * based on its 'data-contact-id' attribute using the `syncCheckboxState` function.
 * Sets up a click listener on each item to toggle its selection state using the `setupClickListener` function.
 *
 * @param {NodeList} listItems - The NodeList of HTML elements representing contact items.
 */
function updateCheckboxState(listItems) {
    listItems.forEach((item) => {
        const contactId = parseInt(item.getAttribute('data-contact-id'), 10);
        syncCheckboxState(item, contactId);
        setupClickListener(item, contactId);
    });
}

/**
 * Selects and updates the checkbox state for a list of contact list items.
 */
function selectListItemsEdit(i, filteredContacts) {
    const listItems = document.querySelectorAll('.contactListItems');
    updateCheckboxState(listItems);
}


/**
 * Renders selected contacts in the UI.
 */
function renderSelectedContactsEdit() {
    const selectedContactsDiv = document.querySelector('.selectedContactsContainer');
    selectedContactsDiv.innerHTML = '';
    taskEditAsiggnedTo.forEach(i => {
        selectedContactsDiv.innerHTML += `
            <div class="cicle" style="background-color: ${contacts[i].color}">${contacts[i].initials}</div>
        `;
    })
}

/**
 * Retrieves the task object and its priority based on the given index.
 *
 * Retrieves the task object from the global `tasks` array at the specified index.
 * Assigns the current priority of the retrieved task to the global variable `actTaskPrio`.
 *
 * @param {number} taskIndex - The index of the task in the `tasks` array.
 * @returns {object} An object containing the retrieved task and its current priority.
 */
function getTaskAndPriority(taskIndex) {
    const task = tasks[taskIndex];
    const currentPrio = task.priority;
    actTaskPrio = currentPrio;
    return { task, currentPrio };
}


/**
 * Handles a priority button click event.
 *
 * Updates the priority of the given task object based on the clicked button's value.
 * Updates the global variable `actTaskPrio` with the selected priority.
 * Updates the visual state of priority buttons using the `updatePrioButtons` function.
 *
 * @param {Event} event - The click event object.
 * @param {object} task - The task object to update with the selected priority.
 * @param {object} svgMappingsEdit - An object mapping priority values to SVG image URLs.
 */
function handlePrioButtonClick(event, task, svgMappingsEdit) {
    const button = event.target.closest('.prioEdit');
    if (!button) return;
    const selectedPrio = button.value;
    task.priority = selectedPrio;
    actTaskPrio = selectedPrio;
    updatePrioButtons(selectedPrio, svgMappingsEdit);
}

/**
 * Updates the priority buttons based on the selected priority.
 * Updates the visual state of buttons with class 'prioEdit' to reflect the selected priority.
 * Applies the 'active' class and updates the SVG icon accordingly from the provided mappings.
 *
 * @param {string} selectedPrio - The selected priority value to be highlighted.
 * @param {object} svgMappingsEdit - An object mapping priority values to SVG image URLs.
 */
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

/**
 * Sets the initial state of priority buttons based on the current priority.
 *
 * Applies the 'active' class and updates the SVG icon for buttons whose value matches
 * the given current priority. Resets other buttons to their default state.
 *
 * @param {string} currentPrio - The current priority value to be highlighted.
 * @param {object} svgMappingsEdit - An object mapping priority values to SVG image URLs.
 */
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

/**
 *  Changes the priority of a task. 
 * 
 * @param {*} taskIndex index of the task in the tasks array
 * @returns 
 */
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

/**
 * Renders the subtasks of a task in the edit card interface.
 * Calls `renderEditSubtasksUneditedHtml` to render the subtasks as list items.
 */
function renderEditSubtasks() {
    const subtasksList = document.getElementById('subtaskList');
    subtasksList.innerHTML = "";
    actSubtasks.forEach((item, index) => {
        subtasksList.innerHTML += renderEditSubtasksUneditedHtml(item, index);
    });
    subTaskEdit();
    eventEnterSubtaskEdit();
}

/**
 * Renders the subtasks of a task in the edit card interface.
 * The subtasks are rendered as list items with an edit button.
 * The edit button allows the user to edit the content of the subtask.
 *
 * @param {number} i - The index of the task in the tasks array. 
 */
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

/**
 * Accepts the edit of a subtask.
 * The content of the subtask is updated in the `actSubtasks` array.
 * The subtasks are then re-rendered.
 */
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

/**
 *  Deletes a subtask from the `actSubtasks` array.
 * @param {*} index   The index of the subtask to delete.
 */
function deleteSubtaskEdit(index) {
    actSubtasks.splice(index, 1);
    renderEditSubtasks();
}

/**
 * hides the input tools for subtasks.
 * shows the input field for subtasks.
 */
function styleSubtaskInputEdit() {
    const subtaskBtnAdd = document.getElementById('addSubtaskBtn');
    const subtaskBtnCheckCancel = document.getElementById('cancelDiv');
    subtaskBtnAdd.classList.add('hidden');
    subtaskBtnCheckCancel.classList.add('show');
}

/**
 * Pushes a new subtask to the `actSubtasks` array.
 * The subtask is created from the value of the subtask input field.
 * The input field is then cleared and the subtasks are re-rendered.
 * Additionally, the input tools are hidden.
 */
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

/**
 * Adds an event listener to the subtask input field to detect when the Enter key is pressed.
 * If the Enter key is pressed, the `pushSubtaskEdit` function is called.
 * Additionally, an event listener is added to the 'pushSubtaskEditBtn' button to call the
 * `pushSubtaskEdit` function when clicked.
 * 
 * @returns {void} 
 */
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

/**
 * Hides the input tools for subtasks.
 */
function hideInputTools() {
    document.getElementById('addSubtaskBtn').classList.remove('hidden');
    document.getElementById('cancelDiv').classList.remove('show');
}

/**
 * Clears the input field for subtasks.
 */
function emptyInput() {
    document.getElementById('subtaskInput').value = "";
}


/**
 * Toggles the visibility of the dropdown menu for contacts.
 *
 * Finds the dropdown element with ID 'dropDownContact' and toggles the 'show-menu'
 * class to control its visibility.
 */
function showDropdown() {
    const dropdown = document.getElementById('dropDownContact');
    const searchInput = document.getElementById('searchContacts');
    dropdown.classList.toggle('show-menu');
}


/**
 * Closes the contact list edit view.
 */
function closeContactListEdit() {
    document.getElementById('dropDownContact').classList.remove('show-menu');
}


/**
 * Closes the contact list edit view when clicking outside the dropdown or list.
 *
 * Adds a document-wide click event listener to detect clicks outside the
 * 'dropDownContact' and 'listContacts' elements. If a click occurs outside these
 * elements, it triggers the `closeContactListEdit` function.
 */
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

