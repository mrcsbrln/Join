const teamBASE_URL = "https://join-230-default-rtdb.europe-west1.firebasedatabase.app/";
// const myBASE_URL = "https://join-database-6441e-default-rtdb.europe-west1.firebasedatabase.app/";


let highestId = 0;


/**
 * Initializes the contacts by including HTML, highlighting contacts, reading data, loading tasks, updating header profile initials, and rendering contacts.
 *
 * @return {Promise<void>} A promise that resolves when all the initialization steps are completed.
 */
async function initContacts() {
    await includeHTML();
    checkForCurrentUser() ? "": redirectToLogin();
    highlightContacts();
    await readData();
    tasks = loadData("/tasks");
    updateHeaderProfileInitials();
    renderContacts();
}


/**
 * Asynchronously fetches data from the specified path in the teamBASE_URL and returns the parsed JSON response.
 *
 * @param {string} [path=""] - The path to fetch data from. Defaults to an empty string.
 * @return {Promise<object>} A Promise that resolves to the parsed JSON response from the server.
 */
async function loadData(path = "") {
    let response = await fetch(teamBASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Reads data from the "/contacts" path asynchronously and updates the contacts and highestId variables.
 *
 * @return {Promise<void>} A Promise that resolves when the data is successfully read and processed.
 */
async function readData() {
    const contactsData = await loadData("/contacts");
    if (!contactsData) {
        contacts = [];
        highestId = 0;
        return;
    }
    contacts = filterNullValues(Object.values(contactsData));
    highestId = contacts.reduce((maxId, contact) => Math.max(maxId, contact.id), 0);
}


/**
 * Checks if the contacts array is empty and updates the contacts list container accordingly.
 *
 * @return {void} This function does not return anything.
 */
function emptyContacts() {
    if (contacts.length === 0) {
        const contactsListContainer = document.getElementById('contacts-list');
        contactsListContainer.innerHTML = '<p class="no-contacts">No contacts</p>';
        return;
    }
}


/**
 * Checks if the contacts array is empty and updates the contacts list container accordingly.
 *
 * @return {void} This function does not return anything.
 */
function checkIfArrayIsEmpty() {
    if (contacts.length === 0) {
        const contactsListContainer = document.getElementById('contacts-list');
        contactsListContainer.innerHTML = '<p class="no-contacts">No contacts</p>';
        return;
    } 
}


/**
 * Renders contacts if there are any, otherwise displays a message.
 *
 * @return {void} This function does not return anything.
 */
async function renderContacts() {
    if (contacts.length === 0) {
        displayNoContactsMessage();
        return;
    }

    const sortedContacts = sortContactsByName(contacts);
    renderSortedContacts(sortedContacts);
}


/**
 * Displays a message when there are no contacts.
 *
 */
function displayNoContactsMessage() {
    const contactsListContainer = document.getElementById('contacts-list');
    contactsListContainer.innerHTML = '<p class="no-contacts">No contacts</p>';
}


/**
 * Sorts the contacts array by name in ascending order.
 *
 * @param {Array} contacts - The array of contacts to be sorted.
 * @return {Array} The sorted contacts array.
 */
function sortContactsByName(contacts) {
    return contacts.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Renders the sorted contacts in the contacts list container, with each contact
 * separated by a separator line based on the first letter of their name.
 *
 * @param {Array<Object>} sortedContacts - The array of contacts to be rendered.
 * @return {void} This function does not return anything.
 */
function renderSortedContacts(sortedContacts) {
    const contactsListContainer = document.getElementById('contacts-list');
    contactsListContainer.innerHTML = '';
    let currentLetter = '';

    sortedContacts.forEach(contact => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            contactsListContainer.innerHTML += contactsSeparatorHtml(currentLetter);
        }
        contactsListContainer.innerHTML += contactsListHtml(contact);
    });
}


/**
 * Slides the contact container in and out of view.
 *
 * @param {HTMLElement} container - The container element to be slid.
 * @return {void} This function does not return anything.
 */
function slideContact(container) {
    container.classList.remove('contact-slide-in');
    container.classList.add('contact-slide-out');
    setTimeout(() => {
        container.classList.remove('contact-slide-out');
        container.classList.add('contact-slide-in');
    }, 175);
}


/**
 * Selects a contact element by its ID and adds the 'contact-selected' class to it.
 *
 * @param {string} id - The ID of the contact element to select.
 * @return {void} This function does not return a value.
 */
function selectedContact(id) {
    document.querySelectorAll('.contact').forEach(contactElement => {
        contactElement.classList.remove('contact-selected');
    });
    const selectedContactElement = document.getElementById(`${id}`);
    if (selectedContactElement) {
        selectedContactElement.classList.add('contact-selected');
    }
}


/**
 * Filters out null values from the given array.
 *
 * @param {Array} array - The array to filter null values from.
 * @return {Array} A new array with non-null values.
 */
function filterNullValues(array) {
    return array.filter(item => item !== null);
}


/**
 * Creates initials from the given name.
 *
 * @param {string} name - The full name to create initials from.
 * @returns {string} Initials generated from the first letters of each word in the name.
 */
function createUserInitials(name) {
    const names = name.split(' ');
    const firstNameInitial = names[0].charAt(0).toUpperCase();
    const lastNameInitial = names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
    return firstNameInitial + lastNameInitial;
}


/**
 * Displays the contact with the given ID.
 *
 * @param {number} id - The ID of the contact to display.
 * @return {Promise<void>} A promise that resolves when the contact is displayed.
 */
async function displayContact(id) {
    const contact = contacts.find(contact => contact.id === id);
    if (contact) {
        const contactDetailsContainer = document.getElementById('contact-displayed');
        contactDetailsContainer.innerHTML = displayContactHtml(contact);
        if (window.innerWidth <= 768) {
            openMobileContact();
        } else {
            selectedContact(id);
            slideContact(contactDetailsContainer);
        }
    }
}


/**
 * Sets the display style of the main container element to 'flex' to open the mobile contact view.
 *
 * @return {void} This function does not return anything.
 */
function openMobileContact() {
    document.getElementById('main-container').style.display = 'flex';
}


/**
 * Sets the display style of the main container element to 'none' to close the mobile contact view.
 *
 * @return {void} This function does not return anything.
 */
function closeMobileContact() {
    document.getElementById('main-container').style.display = 'none';
}


/**
 * Slides the toast message in and out of view.
 *
 * @return {void} This function does not return anything.
 */
function slideToastMsg() {
    let container = document.getElementById('toast-msg')
    setTimeout(() => {
        container.classList.remove('toast-msg-slide-out');
        container.classList.add('toast-msg-slide-in');
    }, 500);
    setTimeout(() => {
        container.classList.remove('toast-msg-slide-in');
        container.classList.add('toast-msg-slide-out');
    }, 2000);

}


/**
 * Asynchronously adds a new contact to the database and updates the UI after successful addition.
 *
 * @return {Promise<void>} A Promise that resolves when the contact is successfully added and the UI is updated.
 *                         If an error occurs during the process, it is logged to the console.
 * @throws {Error} If an error occurs during the process of creating a new contact or saving it to the database.
 */
async function addContact() {
    try {
        const newContact = await createNewContact();
        await saveContactToDatabase(newContact);
        await updateUIAfterAddingContact(newContact);
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}


/**
 * Creates a new contact object with the provided name, email, and phone.
 *
 * @return {object} The newly created contact object containing id, name, email, phone, color, and initials.
 */
async function createNewContact() {
    const name = document.getElementById('new-name').value;
    const email = document.getElementById('new-email').value;
    const phone = document.getElementById('new-phone').value;
    const initials = createUserInitials(name);
    highestId += 1;
    
    return {
        id: highestId,
        name: name,
        email: email,
        phone: phone,
        color: randomColors(),
        initials: initials,
    };
}


/**
 * Saves a new contact to the database.
 *
 * @param {object} newContact - The new contact to be saved.
 * @return {Promise<void>} A Promise that resolves after the contact is successfully saved.
 */
async function saveContactToDatabase(newContact) {
    contacts.push(newContact);
    await updateDataBase(contacts, 'contacts');
}


/**
 * Updates the UI after adding a new contact.
 *
 * @param {object} newContact - The new contact to be added.
 * @return {Promise<void>} A Promise that resolves after updating the UI.
 */
async function updateUIAfterAddingContact(newContact) {
    await renderContacts();
    await displayContact(newContact.id);
    closePopUpWindow('add-contact', 'modal', 'pop-up-open', 'pop-up-close');
    scrollToContact(newContact.id);
    slideToastMsg();
}


/**
 * Updates the database with the given array and array name.
 *
 * @param {Array} array - The array to be updated in the database.
 * @param {string} arrayName - The name of the array in the database.
 * @return {Promise<void>} A Promise that resolves when the database update is complete.
 */
async function updateDataBase(array, arrayName) {
    await fetch(`${teamBASE_URL}/${arrayName}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(array)
    }); 
}


/**
 * Edits a contact by finding the contact with the given ID, populating the edit contact container with the contact's details, opening the edit contact pop-up window, and adding input event listeners.
 *
 * @param {number} id - The ID of the contact to edit.
 * @return {void} This function does not return anything.
 */
function editContact(id) {
    const contact = contacts.find(contact => contact.id === id);
    if (!contact) return;
    const editContactContainer = document.getElementById('edit-contact');
    editContactContainer.innerHTML = editContactHtml(contact);
    openPopUpWindow('edit-contact', 'modal', 'pop-up-open', 'pop-up-close');
    addInputEventListeners()
}


/**
 * Updates a contact in the database with the given ID.
 *
 * @param {number} id - The ID of the contact to update.
 * @return {Promise<void>} A Promise that resolves when the contact is successfully updated.
 */
async function updateContact(id) {
        const updatedValues = getUpdatedContactValues();
        if (!updatedValues) return;
        updateContactLocally(id, updatedValues);
        await updateDataBase(contacts, 'contacts');
        await renderContacts();
        await displayContact(id);
        closePopUpWindow('edit-contact', 'modal', 'pop-up-open', 'pop-up-close');
  
}


/**
 * Retrieves the updated values of a contact from the HTML form.
 *
 * @return {Object} An object containing the updated values of the contact, including the name, email, phone, and initials.
 */
function getUpdatedContactValues() {
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    const initials = createUserInitials(name);
    return { name, email, phone, initials };
}


/**
 * Updates the contact locally based on the provided id and new contact details.
 *
 * @param {type} id - Description of the id parameter
 * @param {type} name - Description of the name parameter
 * @param {type} email - Description of the email parameter
 * @param {type} phone - Description of the phone parameter
 * @param {type} initials - Description of the initials parameter
 * @return {type} Description of the return value
 */
function updateContactLocally(id, { name, email, phone, initials }) {
    const contact = contacts.find(contact => contact.id === id);
    if (contact) {
        contact.name = name;
        contact.email = email;
        contact.phone = phone;
        contact.initials = initials;
    }
}


/**
 * Deletes a contact from the contacts array and updates the UI.
 *
 * @param {number} id - The ID of the contact to be deleted.
 * @return {Promise<void>} A Promise that resolves when the contact is successfully deleted and the UI is updated.
 */
async function deleteContact(id) {
        contacts = contacts.filter(contact => contact.id !== id);
        const container = document.getElementById('contact-displayed');
        await hideContactDisplay(container);
        closePopUpWindow('edit-contact', 'modal', 'pop-up-open', 'pop-up-close');
        await updateDataBase(contacts, 'contacts');
        await renderContacts();
    
}


/**
 * Hides the contact display by removing the appropriate CSS classes from the container element.
 * If the window width is less than or equal to 768 pixels, the 'contact-slide-out' class is removed
 * and the mobile contact is closed. Otherwise, the 'contact-slide-in' class is removed and the
 * 'contact-slide-out' class is added. Then, the container content is cleared.
 *
 * @param {HTMLElement} container - The container element to hide the contact display.
 * @return {Promise<void>} - A promise that resolves when the contact display is hidden.
 */
async function hideContactDisplay(container) {
    if (window.innerWidth <= 768) {
        container.classList.remove('contact-slide-out');
        closeMobileContact();
    } else {
        container.classList.remove('contact-slide-in');
        container.classList.add('contact-slide-out');
    }
    await clearContainerContent(container);
}


/**
 * Clears the content of a container element after a delay.
 *
 * @param {HTMLElement} container - The container element to clear.
 * @return {Promise<void>} - A promise that resolves when the content is cleared.
 */
function clearContainerContent(container) {
    return new Promise(resolve => {
        setTimeout(() => {
            container.innerHTML = '';
            resolve();
        }, 75);
    });
}


/**
 * Scrolls the contacts container to the specified contact element.
 *
 * @param {string} id - The id of the contact element to scroll to.
 */
function scrollToContact(id) {
    const contactsContainer = document.querySelector('.contacts-container');
    const contactElement = document.getElementById(`${id}`);

    if (contactElement && contactsContainer) {
        const { contactTopRelativeToContainer, contactBottomRelativeToContainer, containerHeight } = calculatePositions(contactsContainer, contactElement);

        if (contactTopRelativeToContainer < 0) {
            scrollToSmooth(contactsContainer, contactsContainer.scrollTop + contactTopRelativeToContainer);
        } else if (contactBottomRelativeToContainer > containerHeight) {
            scrollToSmooth(contactsContainer, contactsContainer.scrollTop + (contactBottomRelativeToContainer - containerHeight) + 14);
        } else {
            const offset = (containerHeight - contactElement.clientHeight) / 2;
            scrollToSmooth(contactsContainer, contactTopRelativeToContainer - offset);
        }
    }
}


/**
 * Calculates the position of the element relative to its container.
 *
 * @param {Element} container - The container element.
 * @param {Element} element - The element whose position is being calculated.
 * @return {Object} An object containing the top position relative to the container, the bottom position relative to the container, and the container height.
 */
function calculatePositions(container, element) {
    const contactRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const contactTopRelativeToContainer = contactRect.top - containerRect.top;
    const contactBottomRelativeToContainer = contactTopRelativeToContainer + contactRect.height;
    const containerHeight = containerRect.height;

    return { contactTopRelativeToContainer, contactBottomRelativeToContainer, containerHeight };
}


/**
 * Scrolls the element smoothly to the specified position.
 *
 * @param {Element} element - The element to scroll.
 * @param {number} top - The top position to scroll to.
 */
function scrollToSmooth(element, top) {
    element.scrollTo({ top: top, behavior: 'smooth' });
}


/**
 * Adds event listeners to all input elements with the class 'input'.
 *
 * @return {void}
 */
function addInputEventListeners() {
    const inputs = document.querySelectorAll('.input input');
    inputs.forEach(function (input) {
        const container = input.parentElement;
        input.addEventListener('focus', function () {
            container.classList.add('input-active');
        });
        input.addEventListener('blur', function () {
            container.classList.remove('input-active');
        });
        input.addEventListener('input', function () {
            container.classList.add('input-active');
        });
    });
}


/**
 * Adds event listeners to all input elements with the class 'input'.
 * This function is called when the DOM content is fully loaded.
 *
 * @return {void}
 */
document.addEventListener('DOMContentLoaded', function () {
    addInputEventListeners();
});


/**
 * Clears the values of all input fields with the class 'input'.
 *
 * @return {void}
 */
function clearInputs() {
    const inputs = document.querySelectorAll('.input input');
    inputs.forEach(function (input) {
        input.value = '';
    });
}


/**
 * Generates a random hexadecimal color code.
 *
 * @return {string} A random hexadecimal color code.
 */
function randomColors() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/**
 * Opens a pop-up window by removing 'd-none' class from modal and pop-up window elements.
 *
 * @param {string} windowId - The id of the pop-up window element.
 * @param {string} modalId - The id of the modal element.
 * @param {string} classOpen - The class to add to pop-up window to open it.
 * @param {string} classClose - The class to remove from pop-up window to close it.
 * @return {void}
 */
function openPopUpWindow(windowId, modalId, classOpen, classClose) {
    let popUpWindow = document.getElementById(windowId);
    let modal = document.getElementById(modalId);
    modal.classList.remove('d-none');
    popUpWindow.classList.remove('d-none');
    setTimeout(() => {
        popUpWindow.classList.remove(classClose);
        popUpWindow.classList.add(classOpen);
    }, 10);
}


/**
 * Closes the pop-up window by changing classes and adding a timeout.
 *
 * @param {string} windowId - The id of the pop-up window element.
 * @param {string} modalId - The id of the modal element.
 * @param {string} classOpen - The class to remove from pop-up window.
 * @param {string} classClose - The class to add to pop-up window.
 * @return {void} No return value.
 */
function closePopUpWindow(windowId, modalId, classOpen, classClose) {
    let popUpWindow = document.getElementById(windowId);
    let modal = document.getElementById(modalId);
    popUpWindow.classList.remove(classOpen);
    popUpWindow.classList.add(classClose);
    setTimeout(() => {
        modal.classList.add('d-none');
        popUpWindow.classList.add('d-none');
    }, 110);
    clearInputs();

}


/**
 * Handles the click event on the modal and mobile modal to close the pop-up windows.
 *
 * @param {Event} event - The click event.
 * @return {void} This function does not return anything.
 */
function closeModalOnClick(event) {
    const modal = document.getElementById('modal');
    const mobileModal = document.getElementById('mobile-modal');
    const addContactContent = document.getElementById('add-contact');
    const editContactContent = document.getElementById('edit-contact');
    const subMenuContent = document.getElementById('contact-sub-menu');
    if (event.target === modal) {
        if (!addContactContent.classList.contains('d-none')) {
            closePopUpWindow('add-contact', 'modal', 'pop-up-open', 'pop-up-close');
        }
        if (!editContactContent.classList.contains('d-none')) {
            closePopUpWindow('edit-contact', 'modal', 'pop-up-open', 'pop-up-close');
        }
    }
    if (event.target === mobileModal) {
        if (!subMenuContent.classList.contains('d-none')) {
            closePopUpWindow('contact-sub-menu', 'mobile-modal', 'sub-menu-open', 'sub-menu-close');
        }
    }

}


/**
 * Deselects all mobile contact elements by removing the 'contact-selected' class.
 */
function deselectContactOnMobile() {
    const selectedContact = document.querySelectorAll('.contact');
    if (window.innerWidth <= 768) {
        selectedContact.forEach(contactElement => {
            contactElement.classList.remove('contact-selected');
        })
    }
}


/**
 * Adjusts the main container display based on the window width.
 *
 * @return {void} This function does not return anything.
 */
function adjustMainContainerDisplay() {
    const mainContainer = document.getElementById('main-container');
    if (window.innerWidth > 768) {
        mainContainer.style.display = 'flex';
    } else {
        mainContainer.style.display = 'none';
    }
}


/**
 * Validates an email address based on specific criteria and sets a custom validity message.
 *
 * @param {string} id - The ID of the email input element.
 * @return {void} This function does not return anything.
 */
function validateEmail(id) {
    const emailElement = document.getElementById(id);
    const email = emailElement.value;
    const validations = [
        { condition: email.indexOf('@') < 1, message: 'Die E-Mail-Adresse muss ein @-Symbol enthalten.\n' },
        { condition: email.lastIndexOf('.') <= email.indexOf('@') + 1, message: 'Die E-Mail-Adresse muss einen Punkt (.) nach dem @-Symbol enthalten.\n' },
        { condition: email.lastIndexOf('.') === email.length - 1, message: 'Die E-Mail-Adresse darf nicht mit einem Punkt (.) enden.\n' },
        { condition: !/^[a-zA-Z0-9._%+-]+@/.test(email), message: 'Der lokale Teil der E-Mail-Adresse enthält ungültige Zeichen.\n' },
        { condition: !/[a-zA-Z]{2,}$/.test(email.split('.').pop()), message: 'Die Top-Level-Domain muss mindestens zwei Buchstaben lang sein.\n' }
    ];
    const errorMessage = validations.reduce((msg, val) => val.condition ? msg + val.message : msg, '');
    emailElement.setCustomValidity(errorMessage);
}


/**
 * Attaches event listeners to the window object for click and resize events.
 * The click event listener calls the closeModalOnClick function.
 * The resize event listener calls the deselectContactOnMobile and adjustMainContainerDisplay functions.
 *
 * @return {void} This function does not return anything.
 */
window.addEventListener('click', closeModalOnClick);
window.addEventListener('resize', deselectContactOnMobile);
window.addEventListener('resize', adjustMainContainerDisplay);

