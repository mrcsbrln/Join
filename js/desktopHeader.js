function openSubMenu() {
    document.getElementById('sub-menu-modal').classList.remove('d-none');
}
function closeSubMenu() {
    document.getElementById('sub-menu-modal').classList.add('d-none');
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

