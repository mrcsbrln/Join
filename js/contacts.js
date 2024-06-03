const BASE_URL = "https://join-230-default-rtdb.europe-west1.firebasedatabase.app/";

function initContacts() {
    includeHTML().then(() => {
        highlightContacts();
        renderContacts();
    });
}

async function loadData(path="") {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}

async function readData() {
    console.log(await loadData("/contacts"));
    console.log(await loadData("/tasks"));
}

readData();


function contactsListHtml(contact) {
return `
<div onclick="displayContact(${contact['id']})" id="${contact['id']}" class="contact">
<div class="contact-icon" style="background-color: ${contact['color']};">
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
    <div class="contact-img" style="background-color: ${contact['color']};">
    ${contact['initials']}</div>
    <div class="contact-name">
        <h2>${contact['name']}</h2>
        <div class="contact-btns">
            <div onclick="editContact(${contact['id']})" class="edit-contact">
                <img src="./assets/img/contacts_img/edit_contact.svg" alt="">
                <p>Edit</p>
            </div>
            <div onclick="${contact['id']}" class="delete-contact">
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
    `;
}


async function renderContacts() {
    const contacts = await loadData("/contacts");
    const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
    const contactsListContainer = document.getElementById('contacts-list');
    contactsListContainer.innerHTML = '';
    let currentLetter = '';

    sortedContacts.forEach((contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactsListContainer.innerHTML += contactsSeparatorHtml(currentLetter);
        }
        contactsListContainer.innerHTML += contactsListHtml(contact);
    });
}


function slideContact(container) {
    container.style.transform = 'translateX(100%)';
    container.style.opacity = '0';
    setTimeout(() => {
        container.style.transform = 'translateX(0)';
        container.style.opacity = '1';
    }, 75);
}

function selectedContact(id) {
    document.querySelectorAll('.contact').forEach(contactElement => {
        contactElement.classList.remove('contact-selected');
    });
    const selectedContactElement = document.getElementById(`${id}`);
    if (selectedContactElement) {
        selectedContactElement.classList.add('contact-selected');
    }
}

async function displayContact(id) {
    await loadData("/contacts").then(contacts => {
        const contact = contacts.find(contact => contact.id === id);
        if (contact) {
            const contactDetailsContainer = document.getElementById('contact-displayed');
            contactDetailsContainer.innerHTML = displayContactHtml(contact);
            
            selectedContact(id); 
            slideContact(contactDetailsContainer); 
        }
    });
}

function slideNewContact() {
    let container = document.getElementById('contact-created')
    container.style.transform = 'translateX(2000%)';
    setTimeout(() => {
        container.style.transform = 'translateX(0)';
    }, 75);
    setTimeout(() => {
        container.style.transform = 'translateX(2000%)';
    }, 1500);

}


