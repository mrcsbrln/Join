
function openSubMenu() {
    document.getElementById('sub-menu-bg').classList.remove('d-none')
}
function closeSubMenu() {
    document.getElementById('sub-menu-bg').classList.add('d-none')
}
window.onclick = function (event) {
    const bg = document.getElementById('sub-menu-bg');
    if (event.target === bg) {
        closeSubMenu() ;
    }
}

