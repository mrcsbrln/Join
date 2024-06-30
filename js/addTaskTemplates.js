/**
 * @constant {string} BASE_URL - The base URL for the Firebase database.
 */
const BASE_URL = "https://join-230-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * @constant {Array} selectedContacts - Array to store selected contacts.
 */
const selectedContacts = [];

/**
 * @constant {Array} subtasks - Array to store subtasks.
 */
const subtasks = [];

/**
 * @constant {Object} newTask - Object to store the new task.
 */
let newTask = {};

/**
 * @constant {Array} filteredContacts - Array to store filtered contacts.
 */
let filteredContacts = contacts;

/**
 * @constant {Array} tempTasks - Array to store temporary tasks.
 */
let tempTasks = [];

/**
 * @constant {Object} svgMappings - Object to map priority levels to their corresponding SVG file paths.
 */
const svgMappings = {
    'urgent': './assets/img/icons_add_task/urgent.svg',
    'urgent-active': './assets/img/icons_add_task/urgent-white.svg',
    'medium': './assets/img/icons_add_task/medium.svg',
    'medium-active': './assets/img/icons_add_task/medium-white.svg',
    'low': './assets/img/icons_add_task/low.svg',
    'low-active': './assets/img/icons_add_task/low-white.svg'
};

/**
 * Show the menu for select buttons.
 */
function showMenuTemplate() {
    const selectBtns = document.querySelectorAll('.select-btn');

    selectBtns.forEach(selectBtn => {
        selectBtn.addEventListener('click', () => {
            selectBtn.classList.toggle('show-menu');
        });
    });

    selectBtns.forEach(selectBtn => {
        selectBtn.addEventListener('focus', () => {
            selectBtn.classList.toggle('show-menu');
        });
    });
}

/**
 * Filter contacts based on user input.
 */function filterContacts() {
    const selectBtnInput = document.querySelector('.select-btn-input');
    
    // Füge Eventlistener für 'click' und 'input' hinzu
    selectBtnInput.addEventListener('click', handleFilter);
    selectBtnInput.addEventListener('input', handleFilter);

    /**
     * Handle filter and render contacts based on input value.
     */
    function handleFilter() {
        const filterValue = selectBtnInput.value.toLowerCase().trim();

        // Filtere Kontakten basierend auf dem Input-Wert
        if (filterValue === '') {
            // Wenn Input leer ist, zeige alle Kontakten
            filteredContacts = contacts;
        } else {
            // Ansonsten filtere Kontakten nach Namen, die mit dem Input-Wert beginnen
            filteredContacts = contacts.filter(contact => contact.name.toLowerCase().startsWith(filterValue));
        }

        // Rendere die gefilterten Kontakten
        renderContacts();
    }
}

/**
 * Render the list of filtered contacts.
 */
function renderContacts() {
    const assignedToList = document.querySelector('.list-items');
    assignedToList.innerHTML = '';

    filteredContacts.forEach(item => {
        const isSelected = selectedContacts.includes(item);
        assignedToList.innerHTML += `
            <li class="list-item assigned-to ${isSelected ? 'checked' : ''}" data-id="${item.id}">
                <div class="list-item-name">
                    <div class="cicle" style="background-color: ${item.color}">${item.initials}</div>
                    <span>${item.name}</span>
                </div>
                <img class="checkbox ${isSelected ? 'checked' : ''}" src="./assets/img/icons_add_task/${isSelected ? 'checkedbox' : 'checkbox'}.svg" alt="">
            </li>
        `;
    });
    selectListItems();
}

/**
 * Add event listeners to list items for selection.
 */
function selectListItems() {
    const listItems = document.querySelectorAll('.list-item.assigned-to');

    listItems.forEach((item, i) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.checkbox');
            item.classList.toggle('checked');
            img.classList.toggle('checked');

            const contact = filteredContacts[i];
            if (item.classList.contains('checked')) {
                if (!selectedContacts.includes(contact)) {
                    selectedContacts.push(contact);
                }
                img.src = './assets/img/icons_add_task/checkedbox.svg';
            } else {
                const index = selectedContacts.indexOf(contact);
                if (index !== -1) {
                    selectedContacts.splice(index, 1);
                }
                img.src = './assets/img/icons_add_task/checkbox.svg';
            }
            renderSelectedContactsBelow();
        });
    });
}

/**
 * Render the selected contacts below the input field.
 */
function renderSelectedContactsBelow() {
    const selectedContactsDiv = document.querySelector('.selected-contacts-div');
    selectedContactsDiv.innerHTML = '';
    selectedContacts.forEach(item => {
        selectedContactsDiv.innerHTML += `
            <div class="cicle" style="background-color: ${item.color}">${item.initials}</div>
        `;
    });
}

/**
 * Add event listeners to priority buttons to change their state.
 */
function changePrioBtn() {
    const buttons = document.querySelectorAll('.prio-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => {
                const prio = btn.id;
                const img = btn.querySelector('img');
                if (btn === button) {
                    if (btn.classList.contains('active')) {
                        btn.classList.remove('active');
                        img.src = svgMappings[prio];
                    } else {
                        btn.classList.add('active');
                        img.src = svgMappings[`${prio}-active`];
                    }
                } else {
                    btn.classList.remove('active');
                    img.src = svgMappings[prio];
                }
            });
        });
    });
}

/**
 * Change the SVG icon on hover for the clear button.
 */
function changeSvgOnHover() {
    const clearBtn = document.getElementById('clear-btn');
    const cancelIcon = document.getElementById('cancel-icon');

    clearBtn.addEventListener('mouseover', () => {
        cancelIcon.src = './assets/img/icons_add_task/cancel-hover.svg';
    });

    clearBtn.addEventListener('mouseout', () => {
        cancelIcon.src = './assets/img/icons_add_task/cancel.svg';
    });
}

/**
 * Show and handle the category menu.
 */
function categoryMenu() {
    const selectBtnCategory = document.querySelector('.select-btn.category');
    const categoryDisplayed = document.getElementById('category-displayed');
    const listItems = document.querySelectorAll('.list-item.category');

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            let selectedItemText = item.getAttribute('data-value');
            selectBtnCategory.classList.remove('show-menu');
            categoryDisplayed.textContent = selectedItemText;
            categoryDisplayed.dataset.selected = selectedItemText;
        });
    });

    selectBtnCategory.addEventListener('click', () => {
        selectBtnCategory.classList.toggle('show-menu');
    });

    document.addEventListener('click', (event) => {
        if (!selectBtnCategory.contains(event.target) &&
            !categoryDisplayed.contains(event.target) &&
            !Array.from(listItems).some(item => item.contains(event.target))) {
            selectBtnCategory.classList.remove('show-menu');
        }
    });
}

/**
 * Style the subtask input and buttons.
 */
function styleSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input');
    const subtaskBtnAdd = document.querySelector('.subtask-btn.add');
    const subtaskBtnCheckCancel = document.querySelector('.check-cancel-div');
    const subtaskCancelBtn = document.querySelector('.subtask-cancel');

    subtaskBtnAdd.addEventListener('click', () => {
        subtaskBtnAdd.style.display = 'none';
        subtaskBtnCheckCancel.style.display = 'flex';
    });

    subtaskInput.addEventListener('focus', () => {
        subtaskBtnAdd.style.display = 'none';
        subtaskBtnCheckCancel.style.display = 'flex';
    });

    subtaskCancelBtn.addEventListener('click', () => {
        subtaskBtnAdd.style.display = 'flex';
        subtaskBtnCheckCancel.style.display = 'none';
    });
}

/**
 * Add a subtask to the list of subtasks.
 */
function pushSubtask() {
    const subtaskInput = document.querySelector('.subtask-input');
    const subtaskBtnCheck = document.querySelector('.subtask-check');

    function addSubtask() {
        if (subtaskInput.value !== '') {
            subtasks.push(subtaskInput.value);
            renderSubtasks();
            subtaskInput.value = '';
        }
    }

    subtaskBtnCheck.addEventListener('click', addSubtask);

    subtaskInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            addSubtask();
        }
    });
}

/**
 * Render the list of subtasks.
 */
function renderSubtasks() {
    const subtasksList = document.querySelector('.subtasks-list');
    subtasksList.innerHTML = '';
    subtasks.forEach((item, index) => {
        subtasksList.innerHTML += `
            <li class="subtask-list-item" data-index="${index}">
                <div class="li-text">
                    ${item}
                </div>
                <div class="subtask-edit-icon-div">
                    <img class="edit-subtask-btn" src="./assets/img/icons_add_task/subtask-edit.svg" alt="">
                    <div class="subtask-divider-2"></div>
                    <img class="delete-subtask-btn" src="./assets/img/icons_add_task/subtask-delete.svg" alt="">
                </div>
            </li>
        `;
    });
    editSubTask();
    deleteSubtask();
}

/**
 * Edit a subtask in the list.
 */
function editSubTask() {
    const subtaskListItems = document.querySelectorAll('.subtask-list-item');

    subtaskListItems.forEach(item => {
        const editSubtaskBtn = item.querySelector('.edit-subtask-btn');

        const handleEdit = () => {
            let input = item.querySelector('.edit-subtask-input');
            if (!input) {
                let liText = item.querySelector('.li-text');
                item.innerHTML = `
                    <input class="edit-subtask-input" type="text" value="${liText.textContent.trim()}">
                    <div class="edit-subtask-button-div">
                        <span class="delete-subtask-btn edit"><img src="./assets/img/icons_add_task/subtask-delete.svg"></span>
                        <div class="subtask-divider"></div>
                        <span class="confirm-subtask-edit-btn"><img src="./assets/img/icons_add_task/subtask-check.svg"></span>
                    </div>
                `;
                item.classList.add('subtask-list-item-edit');
                deleteSubtask();
                confirmSubtaskEdit();
            }
        };

        editSubtaskBtn.addEventListener('click', handleEdit);

        item.addEventListener('dblclick', handleEdit);
    });
}

/**
 * Delete a subtask from the list.
 */
function deleteSubtask() {
    const subtaskListItems = document.querySelectorAll('.subtask-list-item');

    subtaskListItems.forEach((item, index) => {
        const deleteSubtaskBtn = item.querySelector('.delete-subtask-btn');
        deleteSubtaskBtn.addEventListener('click', () => {
            subtasks.splice(index, 1);
            renderSubtasks();
        });
    });
}

/**
 * Confirm and save the edited subtask.
 */
function confirmSubtaskEdit() {
    const subtaskListItemsEdit = document.querySelectorAll('.subtask-list-item-edit');

    subtaskListItemsEdit.forEach(item => {
        const confirmSubtaskEditBtn = item.querySelector('.confirm-subtask-edit-btn');
        confirmSubtaskEditBtn.addEventListener('click', () => {
            const index = item.getAttribute('data-index');
            const input = item.querySelector('.edit-subtask-input');
            if (input.value !== '') {
                subtasks[index] = input.value;
                renderSubtasks();
            }
        });
    });
}

/**
 * Save the task and push it to the database.
 */
async function saveTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date-input').value;
    const category = document.getElementById('category-displayed').textContent;
    const priorityBtns = document.querySelectorAll('.prio-btn');
    let priority;

    priorityBtns.forEach(item => {
        if (item.classList.contains('active')) {
            priority = item.id;
        }
    });

    const assignedTo = selectedContacts.map(item => item.id);
    const newSubtasks = subtasks.map((item, index) => ({
        id: index,
        content: item,
        completed: false,
    }));

    const newTask = {
        id: Date.now(), 
        title: title,
        description: description,
        category: category,
        status: actStatus,
        dueDate: dueDate,
        priority: priority,
        subTasks: newSubtasks,
        assignedTo: assignedTo,
    };

    try {
        // Fetch existing tasks
        const tasks = await fetchTasks();
        
        // Append new task
        tasks.push(newTask);
        
        // Update tasks array
        await updateTasks(tasks);
        
        console.log(newTask);
        console.log(tasks);
        showTaskAddedMessage();
    } catch (error) {
        console.error('Error saving task:', error);
    }
}

/**
 * Clear the task form and reset all fields.
 */
function clearTask() {
    document.querySelector('form').reset();
    document.querySelectorAll('.checked').forEach(item => {
        item.classList.remove('checked');
    });
    selectedContacts.length = 0;
    subtasks.length = 0;
    deselectListItems();
    renderSubtasks();
    renderContacts();
    selectMediumPriority();
    resetCategory();
}

/**
 * Deselect all list items and update the display.
 */
function deselectListItems() {
    const listItems = document.querySelectorAll('.list-item.assigned-to');

    listItems.forEach((item, i) => {
        if (item.classList.contains('checked')) {
            const img = item.querySelector('.checkbox');
            item.classList.remove('checked');
            img.classList.remove('checked');
            img.src = './assets/img/icons_add_task/checkbox.svg';

            const contact = filteredContacts[i];
            const index = selectedContacts.indexOf(contact);
            if (index !== -1) {
                selectedContacts.splice(index, 1);
            }
        }
    });
    closeContactList();
    renderSelectedContactsBelow();
}

/**
 * Set the medium priority button as active.
 */
function selectMediumPriority() {
    const buttons = document.querySelectorAll('.prio-btn');
    buttons.forEach(button => {
        const prio = button.id;
        const img = button.querySelector('img');
        if (prio === 'medium') {
            button.classList.add('active');
            img.src = svgMappings['medium-active'];
        } else {
            button.classList.remove('active');
            img.src = svgMappings[prio];
        }
    });
}

/**
 * Reset the category display to the default text.
 */
function resetCategory() {
    const categoryDisplayed = document.getElementById('category-displayed');
    categoryDisplayed.textContent = "Select task category";
}

/**
 * Close the contact list menu.
 */
function closeContactList() {
    document.getElementById('contacts-list').classList.remove('show-menu');
}

/**
 * Close the contact list when clicking outside of it.
 */
function closeContactListOnOutsideClick() {
    document.addEventListener('click', function (event) {
        const selectBtnContainer = document.getElementById('contacts-list');
        const listItemsContainer = document.querySelector('.list-items');

        if (!selectBtnContainer.contains(event.target) && !listItemsContainer.contains(event.target)) {
            closeContactList();
        }
    });
}

/**
 * Prevent form submission when pressing Enter key.
 */
function preventFormSubmitOnEnter() {
    const form = document.querySelector('form');
    form.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
}

/**
 * Validate the form fields and show error messages.
 */
function preventDefaultValidation() {
    const form = document.getElementById('add-task-form');
    const titleInput = document.getElementById('title');
    const dueDateInput = document.getElementById('due-date-input');
    const categoryContainer = document.getElementById('category-container');
    const categoryDisplayed = document.getElementById('category-displayed');
    const titleRequiredMsg = document.getElementById('title-required');
    const dateRequiredMsg = document.getElementById('date-required');
    const categoryRequiredMsg = document.getElementById('category-required');

    let titleClicked = false;
    let dueDateClicked = false;
    let categoryClicked = false;

    function resetValidationMessages() {
        if (titleClicked) {
            titleInput.classList.remove('field-required');
            titleRequiredMsg.style.opacity = '0';
        }
        if (dueDateClicked) {
            dueDateInput.classList.remove('field-required');
            dateRequiredMsg.style.opacity = '0';
        }
        if (categoryClicked) {
            categoryContainer.classList.remove('category-required-border');
            categoryRequiredMsg.style.opacity = '0';
        }
    }

    titleInput.addEventListener('click', () => {
        titleClicked = true;
        resetValidationMessages();
    });

    dueDateInput.addEventListener('click', () => {
        dueDateClicked = true;
        resetValidationMessages();
    });

    categoryContainer.addEventListener('click', () => {
        categoryClicked = true;
        resetValidationMessages();
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        resetValidationMessages();

        let isValid = true;
        if (titleInput.value.trim() === '') {
            titleInput.classList.add('field-required');
            titleRequiredMsg.style.opacity = '1';
            isValid = false;
        }
        if (dueDateInput.value.trim() === '') {
            dueDateInput.classList.add('field-required');
            dateRequiredMsg.style.opacity = '1';
            isValid = false;
        }
        if (categoryDisplayed.textContent === 'Select task category') {
            categoryContainer.classList.add('category-required-border');
            categoryRequiredMsg.style.opacity = '1';
            isValid = false;
        }

        if (isValid) {
            saveTask();
        }
    });
}

/**
 * Send the new task data to the Firebase database.
 */
async function updateTasks(newTasksArray) {
    await fetch(`${BASE_URL}/tasks.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTasksArray)
    });
}

async function fetchTasks() {
    const response = await fetch(`${BASE_URL}/tasks.json`);
    const data = await response.json();
    return data || []; // Return an empty array if no data is found
}

function redirectToBoard() {
    window.location.href = 'board.html';
}