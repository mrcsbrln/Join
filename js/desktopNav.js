function highlightSummary() {
    document.getElementById('summary-link').classList.add('link-active');
    document.getElementById('summary-img').src = "./assets/img/nav_img/summary_icon_active.svg";
}


function highlightAddTask() {
    document.getElementById('add-task-link').classList.add('link-active');
    document.getElementById('add-task-img').src = "./assets/img/nav_img/add_task_icon_active.svg";
}


function highlightBoard() {
    document.getElementById('board-link').classList.add('link-active');
    document.getElementById('board-img').src = "./assets/img/nav_img/board_icon_active.svg";
}


function highlightContacts() {
    document.getElementById('contacts-link').classList.add('link-active');
    document.getElementById('contacts-img').src = "./assets/img/nav_img/contacts_icon_active.svg";
}


function highlightPrivacyPolicy() {
    document.getElementById('privacy-policy-link').classList.add('link-active');
}


function highlightLegalNotice() {
    document.getElementById('legal-notice-link').classList.add('link-active');
}

function hideNavBar() {
    let navLinks = document.getElementById('nav-links');
    if (!currentUser.name) {
        navLinks.classList.add('d-none');
    } else {
        navLinks.classList.remove('d-none');
    }
}





