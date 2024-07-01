function contactsListHtml(contact) {
    return `
    <div onclick="displayContact(${contact['id']})" id="${contact['id']}" class="contact">
    <div class="contact-icon d-flex-center" style="background-color: ${contact['color']};">
    ${contact['initials']}
    </div>
    <div class="contact-data">
    <p>${contact['name']}</p>
    <a href="#">${contact['email']}</a>
    </div>
    </div>
    `;
}

function contactsSeparatorHtml(letter) {
    return `
    <div class="section-letter">
    ${letter}
    </div>
    <div class="separator-line"></div>`;
}

function displayContactHtml(contact) {
    return `
    <div class="contact-header">
    <div class="contact-img contact-img-mobile d-flex-center" style="background-color: ${contact['color']};">
    ${contact['initials']}</div>
    <div class="contact-name">
        <h2>${contact['name']}</h2>
        <div class="contact-btns">
        <div>
            <div onclick="editContact(${contact['id']})" class="edit-contact">
                <img src="./assets/img/contacts_img/edit_contact.svg" alt="">
                <p>Edit</p>
            </div>
            </div>
            <div onclick="deleteContact(${contact['id']})" class="delete-contact">
                <img src="./assets/img/contacts_img/delete_contact.svg" alt="">
                <p>Delete</p>
            </div>
        </div>
    </div>
</div>
<p class="contact-info-p">Contact Information</p>
<div class="contact-info">
    <div>
        <p>Email</p>
        <a href="#">${contact['email']}</a>
    </div>
    <div>
        <p>Phone</p>
        <div>${contact['phone']}</div>
    </div>
</div>

 <div id="mobile-modal" class="sub-menu-bg d-none">
        <div id="contact-sub-menu" class="contact-sub-menu d-none">
            <div onclick="editContact(${contact['id']})" class="contact-options-btns">
                <img src="./assets/img/contacts_img/edit_contact.svg" alt="">
                <p>Edit</p>
            </div>
            <div onclick="deleteContact(${contact['id']})" class="contact-options-btns">
                <img src="./assets/img/contacts_img/delete_contact.svg" alt="">
                <p>Delete</p>
            </div>
        </div>
    </div>
    `;
}

function editContactHtml(contact) {
    return `
            <div class="pop-up-banner">
                <div class="pop-up-banner-content">
                <div>
                    <img src="./assets/img/contacts_img/banner_logo.svg" alt="">
                    <h1>Edit contact</h1>
                    <span></span>
                    </div>
                </div>
            </div>
            <div class="pop-up-content">
                <div onclick="closePopUpWindow('edit-contact', 'modal', 'pop-up-open', 'pop-up-close')" class="close-pop-up d-flex-center">
                    <img src="./assets/img/contacts_img/close_pop_up.svg" alt="">
                </div>
                <div class="contact-img d-flex-center pop-up-img" style="background-color: ${contact['color']};">${contact['initials']}</div>
                <div class="form">
                    <form id="edit-contact-form" onsubmit="updateContact(${contact['id']}); return false">
                        <div class="input">
                            <input id="edit-name" type="text" placeholder="Name" value="${contact['name']}" required>
                            <div class="icon-container">
                                <img src="./assets/img/contacts_img/name_icon.svg" alt="">
                            </div>
                        </div>
                        <div class="input">
                            <input id="edit-email" type="email" placeholder="Email" value="${contact['email']}" required>
                            <div class="icon-container">
                                <img src="./assets/img/contacts_img/mail_icon.svg" alt="">
                            </div>
                        </div>
                        <div class="input">
                            <input id="edit-phone" type="number" pattern="^[0-9-+\s()]{6,16}" placeholder="Phone" value="${contact['phone']}" required>
                            <div class="icon-container">
                                <img src="./assets/img/contacts_img/phone_icon.svg" alt="">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="pop-up-btns">
                    <button onclick="deleteContact(${contact['id']})" class="cancel-btn delete-btn">
                        <p>Delete</p>
                    </button>
                    <button type="submit" form="edit-contact-form" class="approve-btn">
                        <p><b>Save</b></p>
                        <div class="icon-container">
                            <img src="./assets/img/contacts_img/check_icon.svg" alt="">
                        </div>
                    </button>
                </div>
            </div>
    `;
}

