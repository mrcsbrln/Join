

function initAddTask() {
    includeHTML().then(() => {
        highlightAddTask();
        updateHeaderProfileInitials()
        })
    filterContacts();
    showMenu();
    changeSvgOnHover();
    changePrioBtn();
    changeSvgOnHover();
    categoryMenu();
    styleSubtaskInput();
    pushSubtask();
    renderContacts();
    closeContactListOnOutsideClick();
    categoryMenu();
    preventFormSubmitOnEnter();
    preventDefaultValidation(); 
}

