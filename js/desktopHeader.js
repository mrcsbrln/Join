function openSubMenu() {
    let subMenu = document.getElementById('sub-menu');
    let subModal = document.getElementById('sub-menu-modal');
    subModal.classList.remove('d-none');
    subMenu.classList.remove('d-none');
    setTimeout(() => {
        subMenu.classList.remove('sub-menu-close');
        subMenu.classList.add('sub-menu-open');
    }, 10);

}
function closeSubMenu() {
    let subMenu = document.getElementById('sub-menu');
    let subModal = document.getElementById('sub-menu-modal');
    subMenu.classList.remove('sub-menu-open');
    subMenu.classList.add('sub-menu-close');
    setTimeout(() => {
        subModal.classList.add('d-none');
        subMenu.classList.add('d-none');
    }, 100);
}

window.onclick = function (event) {
    const subMenu = document.getElementById('sub-menu-modal');
    if (event.target === subMenu) {
        closeSubMenu() ;
    }
}

function hideHeaderIcons() {
    document.getElementById('header-icons').classList.add('d-none');
    // document.getElementById('header-icons-mobile').classList.add('d-none');
}

function updateHeaderProfileInitials() {
    let userProfileIcon = document.getElementById('header-profile-icon');
    userProfileIcon.innerHTML = '';
    userProfileIcon.classList.remove('initials-fsize');
    if (currentUser && currentUser.initials) {
        userProfileIcon.innerHTML = currentUser.initials;
        if (currentUser.initials.length === 1) {
            userProfileIcon.classList.add('guest-font-size');
        }
    } else {
        navLinks.classList.add('d-none');
    }
}

function LogOut() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('greeting');
    redirectToLogin()
} 