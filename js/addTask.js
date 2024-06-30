actStatus = 'toDo'


async function initAddTask() {
    contacts = await loadData('/contacts');
    await includeHTML();
    highlightAddTask();
    updateHeaderProfileInitials();
    filterContacts(); 
    showMenu();
    changeSvgOnHover();
    changePrioBtn();
    categoryMenu();
    styleSubtaskInput();
    pushSubtask();
    closeContactListOnOutsideClick();
    preventFormSubmitOnEnter();
    preventDefaultValidation();
}

function showTaskAddedMessage() {
    const messageElement = document.querySelector('.task-added-msg');
    messageElement.classList.add('d-flex-visible');


    // Hide the message after 3 seconds (adjust as needed)
    setTimeout(() => {
        messageElement.classList.add('task-added-msg-slide-in');
    }, 100);
    setTimeout(() => {
        redirectToBoard()
    }, 2000);

}

function showMenu() {
    const selectBtns = document.querySelectorAll('.select-btn.assigned-to');

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