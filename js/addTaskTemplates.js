const selectedContacts = [];
const subtasks = [];
let filteredContacts = contacts;
let tempTasks = [];
const svgMappings = {
    'urgent': './assets/img/icons_add_task/urgent.svg',
    'urgent-active': './assets/img/icons_add_task/urgent-white.svg',
    'medium': './assets/img/icons_add_task/medium.svg',
    'medium-active': './assets/img/icons_add_task/medium-white.svg',
    'low': './assets/img/icons_add_task/low.svg',
    'low-active': './assets/img/icons_add_task/low-white.svg'
};

function showMenu() {
    const selectBtns = document.querySelectorAll('.select-btn');

    selectBtns.forEach(selectBtn => {
        selectBtn.addEventListener('click', () => {
            selectBtn.classList.toggle('show-menu');
        })
    })
    selectBtns.forEach(selectBtn => {
        selectBtn.addEventListener('focus', () => {
            selectBtn.classList.toggle('show-menu');
        })
    })
}

function filterContacts() {
    const selectBtnInput = document.querySelector('.select-btn-input');
    selectBtnInput.addEventListener('input', () => {
        let filterValue = selectBtnInput.value.toLowerCase();
        filteredContacts = contacts.filter(contact => contact.name.toLowerCase().startsWith(filterValue));
        renderContacts();
    })
}

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

function renderSelectedContactsBelow() {
    const selectedContactsDiv = document.querySelector('.selected-contacts-div');
    selectedContactsDiv.innerHTML = '';
    selectedContacts.forEach(item => {
        selectedContactsDiv.innerHTML += `
            <div class="cicle" style="background-color: ${item.color}">${item.initials}</div>
        `;
    })
}

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


function categoryMenu() {
    const selectBtnCategory = document.querySelector('.select-btn.category');
    const categoryDisplayed = document.getElementById('category-displayed');
    const listItems = document.querySelectorAll('.list-item.category');

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            let selectedItemText = item.getAttribute('data-value');
            selectBtnCategory.classList.remove('show-menu');
            categoryDisplayed.textContent = selectedItemText;
            categoryDisplayed.dataset.selected = selectedItemText;  // Save selected category in dataset
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

function styleSubtaskInput() {
    const subtaskInput = document.querySelector('.subtask-input');
    const subtaskBtnAdd = document.querySelector('.subtask-btn.add');
    const subtaskBtnCheckCancel = document.querySelector('.check-cancel-div');
    const subtaskCancelBtn = document.querySelector('.subtask-cancel');

    subtaskBtnAdd.addEventListener('click', () => {
        subtaskBtnAdd.style.display = 'none';
        subtaskBtnCheckCancel.style.display = 'flex';
    })

    subtaskInput.addEventListener('focus', () => {
        subtaskBtnAdd.style.display = 'none';
        subtaskBtnCheckCancel.style.display = 'flex';
    })

    subtaskCancelBtn.addEventListener('click', () => {
        subtaskBtnAdd.style.display = 'flex';
        subtaskBtnCheckCancel.style.display = 'none';
    })
}


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
    })
    editSubTask();
    deleteSubtask();
}

function editSubTask() {
    const subtaskListItems = document.querySelectorAll('.subtask-list-item');

    subtaskListItems.forEach(item => {
        const editSubtaskBtn = item.querySelector('.edit-subtask-btn');

        // Function to handle subtask editing
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

        // Add click event listener to edit button
        editSubtaskBtn.addEventListener('click', handleEdit);

        // Add double click event listener to the list item
        item.addEventListener('dblclick', handleEdit);
    });
}

function deleteSubtask() {
    const subtaskListItems = document.querySelectorAll('.subtask-list-item');

    subtaskListItems.forEach((item, index) => {
        const deleteSubtaskBtn = item.querySelector('.delete-subtask-btn');
        deleteSubtaskBtn.addEventListener('click', () => {
            subtasks.splice(index, 1);
            renderSubtasks();
        })
    });
}

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

function saveTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date-input').value;
    const category = document.getElementById('category-displayed').textContent;
    const priorityBtns = document.querySelectorAll('.prio-btn');
    let priority;

    priorityBtns.forEach(item => {
        if (item.classList.contains('active')) {
            priority = item.id
        }
    })

    const assignedTo = selectedContacts.map(item => item.id);
    const newSubtasks = subtasks.map((item, index) => ({
        id: index,
        content: subtasks,
        completet: false,
    }));

    const newTask = {
        id: tempTasks.length,
        title: title,
        description: description,
        category: category,
        status: 'toDo',
        dueDate: dueDate,
        priority: priority,
        subTasks: newSubtasks,
        assignedTo: assignedTo
    }

    tempTasks.push(newTask);
    console.log(newTask);
    console.log(tempTasks);
    clearTask();
}


function clearTask() {
    document.querySelector('form').reset();
    document.querySelectorAll('checked').forEach(item => {
        item.classList.remove('checked');
    });
    selectedContacts.length = 0;
    subtasks.length = 0;
    deselectListItems();
    renderSubtasks();
    selectMediumPriority();
    resetCategory();
}

function deselectListItems() {
    const listItems = document.querySelectorAll('.list-item.assigned-to');

    listItems.forEach((item, i) => {
        if (item.classList.contains('checked')) {
            const img = item.querySelector('.checkbox');
            item.classList.remove('checked');
            img.classList.remove('checked');
            img.src = './assets/img/icons_add_task/checkbox.svg'; // Change the image to the unchecked state

            // Remove the contact from the selectedContacts array
            const contact = filteredContacts[i];
            const index = selectedContacts.indexOf(contact);
            if (index !== -1) {
                selectedContacts.splice(index, 1);
            }
        }
    });
    closeContactList();
    renderSelectedContactsBelow(); // Update the display of selected contacts
}


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

function resetCategory() {
    const categoryDisplayed = document.getElementById('category-displayed');
    categoryDisplayed.textContent = "Select task category";
}

function closeContactList() {
    document.getElementById('contacts-list').classList.remove('show-menu');
}

function closeContactListOnOutsideClick() {
    document.addEventListener('click', function (event) {
        const selectBtnContainer = document.getElementById('contacts-list');
        const listItemsContainer = document.querySelector('.list-items');

        if (!selectBtnContainer.contains(event.target) && !listItemsContainer.contains(event.target)) {
            closeContactList();
        }
    });
}



function preventFormSubmitOnEnter() {
    const form = document.querySelector('form');
    form.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    });
}





function preventDefaultValidation() {
    // Get form and relevant elements
    const form = document.getElementById('add-task-form');
    const titleInput = document.getElementById('title');
    const dueDateInput = document.getElementById('due-date-input');
    const categoryContainer = document.getElementById('category-container');
    const categoryDisplayed = document.getElementById('category-displayed');
    const titleRequiredMsg = document.getElementById('title-required');
    const dateRequiredMsg = document.getElementById('date-required');
    const categoryRequiredMsg = document.getElementById('category-required');

    // Flags to track interaction
    let titleClicked = false;
    let dueDateClicked = false;
    let categoryClicked = false;

    // Function to reset styles and messages
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

    // Add click event listeners to reset validation messages
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

    // Add submit event listener to the form
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Reset styles and messages before validation
        resetValidationMessages();

        // Check if fields are empty
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

        // Submit the form if valid
        if (isValid) {
            saveTask(); // Submit the form
        }
    });
}
