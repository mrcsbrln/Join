actStatus = "";


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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status) {
        actStatus = status;
        // Call any initialization function here if needed
        console.log('Status:', actStatus);
    } else {
        // Handle the case where the status parameter is missing
        actStatus = 'toDo'; // Set a default value or handle accordingly
        console.log('Status parameter is missing. Default value:', actStatus);
    }
});