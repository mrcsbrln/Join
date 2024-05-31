
function activateLink(activeId) {
    const links = [
        { id: 'summary-link', imgId: 'summary-img', activeSrc: './assets/img/summary_icon_active.svg', inactiveSrc: './assets/img/summary_icon.svg' },
        { id: 'add-task-link', imgId: 'add-task-img', activeSrc: './assets/img/add_task_icon_active.svg', inactiveSrc: './assets/img/add_task_icon.svg' },
        { id: 'board-link', imgId: 'board-img', activeSrc: './assets/img/board_icon_active.svg', inactiveSrc: './assets/img/board_icon.svg' },
        { id: 'contacts-link', imgId: 'contacts-img', activeSrc: './assets/img/contacts_icon_active.svg', inactiveSrc: './assets/img/contacts_icon.svg' },
    ];

    links.forEach(link => {
        const element = document.getElementById(link.id);
        const imgElement = document.getElementById(link.imgId);

        if (link.id === activeId) {
            element.classList.add('link-active');
            imgElement.src = link.activeSrc;
        } else {
            element.classList.remove('link-active');
            imgElement.src = link.inactiveSrc;
        }
    });
}

function openPrivacyPolicy() {
document.getElementById('privacy-btn').classList.add('link-active');
document.getElementById('legal-btn').classList.remove('link-active');

}

function openLegalNotice() {
    document.getElementById('legal-btn').classList.add('link-active');
    document.getElementById('privacy-btn').classList.remove('link-active');
}




