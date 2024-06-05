function initAddTask() {
    includeHTML();
    showMenu();
    changeSvgOnHover();
    selectListItems();
}

function showMenu() {
    const selectBtn = document.getElementById('select-btn');

    selectBtn.addEventListener('click', () => {
        selectBtn.classList.toggle('show-menu');    
    })
}

function selectListItems() {
    const listItems = document.querySelectorAll('.list-item');
    const checkboxes = document.querySelectorAll('.checkbox');

    listItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('checked');
        })
    })
    checkboxes.forEach(item => {
        item.addEventListener('click', event => {
            event.stopPropagation();
            item.src = './assets/img/icons_add_task/checkedbox.svg';
        })
    })
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



