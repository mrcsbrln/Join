/**
 * Highlights the summary link in the navigation bar.
 */
function highlightSummary() {
    document.getElementById('summary-link').classList.add('link-active');
    document.getElementById('summary-img').src = "./assets/img/nav_img/summary_icon_active.svg";
}


/**
 * Highlights the add task link in the navigation bar.
 */
function highlightAddTask() {
    document.getElementById('add-task-link').classList.add('link-active');
    document.getElementById('add-task-img').src = "./assets/img/nav_img/add_task_icon_active.svg";
}


/**
 * Highlights the board link in the navigation bar.
 */
function highlightBoard() {
    document.getElementById('board-link').classList.add('link-active');
    document.getElementById('board-img').src = "./assets/img/nav_img/board_icon_active.svg";
}


/**
 * Highlights the contacts link in the navigation bar.
 */
function highlightContacts() {
    document.getElementById('contacts-link').classList.add('link-active');
    document.getElementById('contacts-img').src = "./assets/img/nav_img/contacts_icon_active.svg";
}


/**
 * Highlights the privacy policy link in the navigation bar.
 */
function highlightPrivacyPolicy() {
    document.getElementById('privacy-policy-link').classList.add('link-active');
}


/**
 * Highlights the legal notice link in the navigation bar.
 */
function highlightLegalNotice() {
    document.getElementById('legal-notice-link').classList.add('link-active');
}


/**
 * Hides the navigation bar links if no current user is logged in.
 */
function hideNavBar() {
    let navLinks = document.getElementById('nav-links');
    if (!currentUser.name) {
        navLinks.classList.add('d-none');
    } else {
        navLinks.classList.remove('d-none');
    }
}
