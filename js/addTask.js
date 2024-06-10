function initAddTask() {
    includeHTML().then(highlightAddTask);
    showMenu();
    changeSvgOnHover();
    selectListItems();
    changePrioBtn();
    changeSvgOnHover();
    categoryMenu();
    styleSubtaskInput();
    addSubtask();
}

function showMenu() {
    const selectBtns = document.querySelectorAll('.select-btn');

    selectBtns.forEach( selectBtn => {
        selectBtn.addEventListener('click', () => {
            selectBtn.classList.toggle('show-menu');    
        })
    })
}

function selectListItems() {
    const listItems = document.querySelectorAll('.list-item.assigned-to');

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('.checkbox');
            item.classList.toggle('checked');
            img.classList.toggle('checked');

            if (img.classList.contains('checked')) {
                img.src = './assets/img/icons_add_task/checkedbox.svg';
            } else {
                img.src = './assets/img/icons_add_task/checkbox.svg';
            }
        });
    });
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

function addSubtask() {
    const subtaskInput = document.querySelector('.subtask-input');
    const subtaskBtnCheck = document.querySelector('.subtask-check');
    const subtasksList = document.querySelector('.subtasks-list');

    subtaskBtnCheck.addEventListener('click', () => {
        if (subtaskInput.value != '') {
            subtasksList.innerHTML += `
                <li class="subtask-list-item">
                    <div>
                        <span class="li-text">${subtaskInput.value}</span>
                    </div>
                    <div class="subtask-edit-icon-div">
                        <img src="./assets/img/icons_add_task/subtask-edit.svg" alt="">
                        <div class="subtask-divider-2"></div>
                        <img src="./assets/img/icons_add_task/subtask-delete.svg" alt="">
                    </div>
                </li>
            `;
            subtaskInput.value = '';
        } 
    })
}



