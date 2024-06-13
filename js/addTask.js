const selectedContacts = [];

function initAddTask() {
    includeHTML().then(highlightAddTask);
    renderAssignedToContacts();
    showMenu();
    changeSvgOnHover();
    selectListItems();
    changePrioBtn();
    changeSvgOnHover();
    categoryMenu();
    styleSubtaskInput();
    addSubTask();
}

function showMenu() {
    const selectBtns = document.querySelectorAll('.select-btn');

    selectBtns.forEach( selectBtn => {
        selectBtn.addEventListener('click', () => {
            selectBtn.classList.toggle('show-menu');    
        })
    })
}

function renderAssignedToContacts() {
    console.log(contacts);
    const assignedToList = document.querySelector('.list-items');

    contacts.forEach(item => {
        assignedToList.innerHTML += `
            <li class="list-item assigned-to">
                <div class="list-item-name">
                    <div class="cicle" style="background-color: ${item.color}">${item.initials}</div>
                    <span>${item.name}</span>
                </div>
                <img class="checkbox" src="./assets/img/icons_add_task/checkbox.svg" alt="">
            </li>
        `;
    })
}

function selectListItems() {
    const listItems = document.querySelectorAll('.list-item.assigned-to');

    listItems.forEach((item, i) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.checkbox');
            item.classList.toggle('checked');
            img.classList.toggle('checked');

            const contact = contacts[i];
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
            renderSelectedContacts();
        });
    });
}

function renderSelectedContacts() {
    const selectedContactsDiv = document.querySelector('.selected-contacts-div');
    selectedContactsDiv.innerHTML = '';
    selectedContacts.forEach(item => {
        selectedContactsDiv.innerHTML += `
            <div class="cicle" style="background-color: ${item.color}">${item.initials}</div>
        `;
    })
}

function restoreInputValue() {
    const selectBtnInput = document.querySelector('.select-btn-input');
    if (selectBtnInput.value === '') {
        selectBtnInput.value = 'Select contacts to assign';
    }
}

function changePrioBtn() {
    const buttons = document.querySelectorAll('.prio-btn');
    const svgMappings = {
        'urgent': './assets/img/icons_add_task/urgent.svg',
        'urgent-active': './assets/img/icons_add_task/urgent-white.svg',
        'medium': './assets/img/icons_add_task/medium.svg',
        'medium-active': './assets/img/icons_add_task/medium-white.svg',
        'low': './assets/img/icons_add_task/low.svg',
        'low-active': './assets/img/icons_add_task/low-white.svg'
    };

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

function categoryMenu(){
    const selectBtnCategory = document.querySelector('.select-btn.category');
    const categoryDisplayed = document.getElementById('category-displayed');
    const listItems = document.querySelectorAll('.list-item.category');

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            let selectedItemText = item.getAttribute('data-value');
            selectBtnCategory.classList.remove('show-menu');
            categoryDisplayed.textContent = selectedItemText;
        })
    })
    selectBtnCategory.addEventListener('click', () => {
        categoryDisplayed.textContent = "Select task category";
    })
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

function addSubTask() {
    const subtaskInput = document.querySelector('.subtask-input');
    const subtaskBtnCheck = document.querySelector('.subtask-check');
    const subtasksList = document.querySelector('.subtasks-list');

    subtaskBtnCheck.addEventListener('click', () => {
        if (subtaskInput.value != '') {
            subtasksList.innerHTML += `
                <li class="subtask-list-item">
                    <div class="li-text">
                        ${subtaskInput.value}
                    </div>
                    <div class="subtask-edit-icon-div">
                        <img  id="edit-subtask" src="./assets/img/icons_add_task/subtask-edit.svg" alt="">
                        <div class="subtask-divider-2"></div>
                        <img src="./assets/img/icons_add_task/subtask-delete.svg" alt="">
                    </div>
                </li>
            `;
            subtaskInput.value = '';
            editSubTask();
        } 
    })
}

function editSubTask() {
    const subTaskListItmes = document.querySelectorAll('.subtask-list-item');

    subTaskListItmes.forEach(item => {
        item.addEventListener('click', () => {
            let input = item.querySelector('.edit-subtask-input');
            if (!input) {
                let liText = item.querySelector('.li-text');
                item.innerHTML = `
                    <input class="edit-subtask-input" type="text" value="${liText.textContent.trim()}">
                    <div class="edit-subtask-button-div">
                        <span><img src="./assets/img/icons_add_task/subtask-delete.svg"></span>
                        <div class="subtask-divider"></div>
                        <span><img src="./assets/img/icons_add_task/subtask-check.svg"></span>
                    </div>
                `;
                input = item.querySelector('.edit-subtask-input');
                item.classList.add('subtask-list-item-edit');
            }
        })   
    })
}




