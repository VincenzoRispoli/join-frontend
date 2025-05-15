let contacts = [];
let badgeColors = ['#f76b25', '#07cbd9', '#e8ce07', '#c60af5', '#0814fc'];
let germanAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Ä", "Ö", "Ü"];

let contactsUrl = 'http://127.0.0.1:8000/kanban/contacts/';

/**
 * Initializes the contact book by checking authentication status and loading the required data.
 * @async
 */
async function initContacts() {
    authenticated = JSON.parse(localStorage.getItem('authenticated'));
    if (authenticated) {
        await includeHTML();
        highlightNavLink();
        loggedUser = await getLoggedUser();
        await setInitialsCurrentUserInTheHeader(loggedUser);
        await loadContactBook();
    } else {
        window.location.href = 'login.html';
    }
}

/**
 * Retrieves the logged-in user from local storage.
 * @async
 * @returns {Object} The logged-in user's data.
 */
async function getLoggedUser() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    return user;
}

/**
 * Loads the contact book and displays contacts sorted by their initials.
 * @async
 */
async function loadContactBook() {
    await loadCurrentUser();
    await loadContacts();
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = "";
    let initialsOfAllContacts = contacts.map(contact => contact['first_name'].charAt(0).toUpperCase());
    let matchingLetters = germanAlphabet.filter(letter => initialsOfAllContacts.includes(letter));
    contactBookLoops(contactList, matchingLetters);
}

/**
 * Loads the current user's details and displays them.
 * @async
 */
async function loadCurrentUser() {
    try {
        let loggedUser = JSON.parse(localStorage.getItem('currentUser'));
        setInitialsCurrentUserInTheHeader(loggedUser);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Loops through the matching letters and generates contact lists based on initials.
 * @param {HTMLElement} contactList - The DOM element to display the contacts.
 * @param {Array<string>} matchingLetters - The list of letters to filter contacts by.
 */
function contactBookLoops(contactList, matchingLetters) {
    for (let i = 0; i < matchingLetters.length; i++) {
        let letter = matchingLetters[i];
        contactList.innerHTML += generateContactListHTML(letter);
        let letterContainer = document.getElementById(`contacts-for-specific-letter-container${letter}`);
        letterContainer.innerHTML = "";
        for (let j = 0; j < contacts.length; j++) {
            let contact = contacts[j];
            let contactInitials = contact.first_name.charAt(0) + contact.last_name.charAt(0);
            if (letterContainer.id.slice(-1) == contactInitials.charAt(0)) {
                letterContainer.innerHTML += generateContactHTML(j, contact, contactInitials);
            }
        }
    }
}

/**
 * Fetches all contacts from the server and updates the contact list.
 * @async
 */
async function loadContacts() {
    let response = await fetch(contactsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'appplication/json',
            'Authorization': `${loggedUser.token}`
        }
    });
    let fetchedContacts = await response.json();
    contacts = fetchedContacts;
}

/**
 * Capitalizes the initials of a contact's full name.
 * @param {string} contactName - The full name of the contact.
 * @returns {string} The initials of the contact.
 */
function capitalizeContact(contactName) {
    let parts = contactName.split(" ");
    let initials = parts.map(part => part.charAt(0).toUpperCase()).join("");
    return initials;
}

/**
 * Displays the details of a contact.
 * @param {number} contactId - The ID of the contact to display.
 */
function showContactInTheDetails(contactId) {
    let contactDetailsContainer = document.getElementById('contact-details');
    let selectedContact = contacts[contactId];
    let initials = selectedContact.first_name.charAt(0) + selectedContact.last_name.charAt(0);
    contactDetailsContainer.innerHTML = showContactDetailsHTML(contactId, selectedContact, initials);
    contactDetailsContainer.classList.remove('hide-contact-details');
    for (let i = 0; i < contacts.length; i++) {
        document.getElementById(`contact${i}`).classList.remove('contact-on-focus');
        if (i == contactId) {
            document.getElementById(`contact${i}`).classList.add('contact-on-focus');
        }
    }
    if (windowWidth <= 1050) {
        document.getElementById('contact-list-container').classList.add('d-none-mobile');
        document.getElementById('contacts-header-and-details-container').classList.remove('d-none-mobile');
    }
}

/**
 * Creates a new contact based on form inputs and posts it to the server.
 * @async
 * @param {Event} event - The event triggered by the form submission.
 */
async function createContact(event) {
    let loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    event.preventDefault();
    let firstName = document.getElementById('input-first-name');
    let lastName = document.getElementById('input-last-name');
    let email = document.getElementById('input-email');
    let phone = document.getElementById('input-phone');
    let randomColor = Math.floor(Math.random() * (badgeColors.length - 1));
    let badgeColor = badgeColors[randomColor];
    let newContact = new Contact(loggedUser.user_id, firstName.value, lastName.value, email.value, phone.value, badgeColor);
    try {
        await postNewContact(newContact, loggedUser, firstName, lastName, email, phone);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Posts a new contact to the server.
 * @async
 * @param {Object} newContact - The contact data to be posted.
 * @param {Object} loggedUser - The logged-in user's data.
 * @param {HTMLElement} name - The name input field.
 * @param {HTMLElement} email - The email input field.
 * @param {HTMLElement} phone - The phone input field.
 */
async function postNewContact(newContact, loggedUser, firstName, lastName, email, phone) {
    let response = await fetch(contactsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(newContact)
    });
    let createdContactData = await response.json();
    console.log(createdContactData);
    if (createdContactData.ok == true) {
        await loadContactBook();
        await clearFormContactValueAndLoadContacts(firstName, lastName, email, phone);
        findIndexOfCreatedContact(createdContactData);
    } else {
        showErrorsOfContactsCreation(createdContactData);
    }
}

/**
 * Finds the index of the newly created contact and displays its details.
 * @param {Object} createdContactData - The data of the created contact.
 */
function findIndexOfCreatedContact(createdContactData) {
    let contactData = createdContactData.data
    let index = contacts.findIndex(c => c.id == contactData.id);
    showContactInTheDetails(index);
    setTimeout(() => {
        document.getElementById('created-or-deleted-contact-advice').innerText = createdContactData.message
        document.getElementById('created-or-deleted-contact-advice').classList.remove('hide-contact-created-advice');
    }, 500);

    setTimeout(() => {
        document.getElementById('created-or-deleted-contact-advice').classList.add('hide-contact-created-advice');
    }, 3000);
}

/**
 * Displays error messages related to contact creation.
 * Retrieves HTML elements for each input error field and passes them to a helper function.
 *
 * @function
 * @param {Object} createdContactData - The response object containing error messages for contact fields.
 */
function showErrorsOfContactsCreation(createdContactData) {
    let firstNameInput = document.getElementById('error-advice-add-contact-first-name')
    let lastNameInput = document.getElementById('error-advice-add-contact-last-name')
    let emailInput = document.getElementById('error-advice-add-contact-email')
    let phoneInput = document.getElementById('error-advice-add-contact-phone');

    showErrorsUnderTheFields(createdContactData, firstNameInput, lastNameInput, emailInput, phoneInput)
}

/**
 * Populates error messages below the respective input fields for contact creation.
 * Also sets a timeout to clear the errors after 3 seconds.
 *
 * @function
 * @param {Object} createdContactData - The object containing field-specific error messages.
 * @param {HTMLElement} firstNameInput - DOM element where first name error message is displayed.
 * @param {HTMLElement} lastNameInput - DOM element where last name error message is displayed.
 * @param {HTMLElement} emailInput - DOM element where email error message is displayed.
 * @param {HTMLElement} phoneInput - DOM element where phone error message is displayed.
 */
function showErrorsUnderTheFields(createdContactData, firstNameInput, lastNameInput, emailInput, phoneInput) {
    if (createdContactData.data.first_name) {
        firstNameInput.innerText = createdContactData.data.first_name
    }
    if (createdContactData.data.last_name) {
        lastNameInput.innerText = createdContactData.data.last_name
    }
    if (createdContactData.data.email) {
        emailInput.innerText = createdContactData.data.email
    }
    if (createdContactData.data.phone) {
        phoneInput.innerText = createdContactData.data.phone
    }
    setTimeout(hideErrorsAfter3Seconds, 3000)
}

/**
 * Clears all error messages related to contact creation after 3 seconds.
 * Targets all elements with the class 'error-add-contact-advice' and clears their inner text.
 *
 * @function
 */
function hideErrorsAfter3Seconds() {
    let errorsAddContactAdvices = document.getElementsByClassName('error-add-contact-advice')
    let errorsAsArray = [...errorsAddContactAdvices]
    errorsAsArray.forEach(errorAdvice => {
        errorAdvice.innerText = ""
    }, 3000);
}

/**
 * Clears the contact form and reloads the contact list.
 * @async
 * @param {HTMLElement} name - The name input field.
 * @param {HTMLElement} email - The email input field.
 * @param {HTMLElement} phone - The phone input field.
 */
async function clearFormContactValueAndLoadContacts(name, email, phone) {
    name.value = "";
    email.value = "";
    phone.value = "";
    await loadContactBook();
    document.getElementById('add-contact-overlay-container').classList.add('d-none');
}

/**
 * Clears all input fields in the "Add Contact" form.
 * Prevents the event from bubbling up the DOM tree.
 *
 * @param {Event} event - The event object triggered by the cancel button click.
 */
function clearAddContactForm(event) {
    event.stopPropagation();
    document.getElementById('input-name').value = "";
    document.getElementById('input-email').value = "";
    document.getElementById('input-phone').value = "";
}

/**
 * Displays the contact overlay modal for adding or editing contacts.
 * @param {string} containerId - The ID of the container element for the overlay.
 */
function showContactOverlay(containerId) {
    document.getElementById(`${containerId}`).classList.remove('d-none');
    if (windowWidth <= 1050) {
        document.getElementById('cross-icon-contact-overlay').src = './assets/img/cross-icon-white.png';
    }
}

/**
 * Closes the contact overlay modal.
 * @param {string} containerId - The ID of the container element for the overlay.
 */
function closeContactOverlay(containerId) {
    document.getElementById(`${containerId}`).classList.add('d-none');
}

/**
 * Stops the event propagation.
 * @param {Event} event - The event to stop propagation for.
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * Displays the edit contact overlay modal.
 * @param {number} contactId - The ID of the contact to edit.
 */
function showEditContactOverview(contactId) {
    let contact = contacts[contactId];
    let opacityContainer = document.getElementById('opacity-edit-contact-overlay');
    opacityContainer.classList.remove('d-none');
    opacityContainer.innerHTML = editContactOverviewHTML(contactId, contact);
    document.getElementById(`input-first-name-${contactId}`).value = contact.first_name;
    document.getElementById(`input-last-name-${contactId}`).value = contact.last_name;
    document.getElementById(`input-email-${contactId}`).value = contact.email;
    document.getElementById(`input-phone-${contactId}`).value = contact.phone;
    if (windowWidth <= 1050) {
        document.getElementById('cross-icon-edit-contact-overlay').src = './assets/img/cross-icon-white.png';
    }
}

/**
 * Event listener for window resize to change the cross icon color for the edit contact overlay on mobile.
 */
window.addEventListener('resize', changeColorOnCrossIconEditMobile);
/**
 * Event listener for window resize to change the cross icon color for the add contact overlay on mobile.
 */
window.addEventListener('resize', changeColorOnCrossIconAddContactMobile);

/**
 * Changes the color of the cross icon in the edit contact overlay based on window width.
 * If the width is less than or equal to 1050px, it changes to a white cross icon.
 */
function changeColorOnCrossIconEditMobile() {
    let crossIconEdit = document.getElementById('cross-icon-edit-contact-overlay');
    if (crossIconEdit) {
        if (windowWidth <= 1050) {
            crossIconEdit.src = './assets/img/cross-icon-white.png';
        } else {
            crossIconEdit.src = './assets/img/cross.png'
        }
    }
}

/**
 * Changes the color of the cross icon in the add contact overlay based on window width.
 * If the width is less than or equal to 1050px, it changes to a white cross icon.
 */
function changeColorOnCrossIconAddContactMobile() {
    let crossIconAddContact = document.getElementById('cross-icon-contact-overlay');
    if (crossIconAddContact) {
        if (windowWidth <= 1050) {
            crossIconAddContact.src = './assets/img/cross-icon-white.png';
        } else {
            crossIconAddContact.src = './assets/img/cross.png'
        }
    }
}

/**
 * Edits a contact based on the provided contactId.
 * It updates the contact's information and sends the changes to the server.
 * 
 * @param {number} contactId - The unique identifier of the contact to be edited.
 */
async function editContact(contactId) {
    let selectedContact = contacts[contactId];
    let id = selectedContact.id
    let user = selectedContact.user;
    let firstName = document.getElementById(`input-first-name-${contactId}`);
    let lastName = document.getElementById(`input-last-name-${contactId}`);
    let email = document.getElementById(`input-email-${contactId}`);
    let phone = document.getElementById(`input-phone-${contactId}`);
    let badgeColor = selectedContact.badge_color;
    let editedContact = new Contact(user, firstName.value, lastName.value, email.value, phone.value, badgeColor);
    try {
        await updateContact(id, editedContact);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates the contact information on the server using a PUT request.
 * 
 * @param {number} id - The unique identifier of the contact to be updated.
 * @param {Contact} editedContact - The new contact data to be saved.
 */
async function updateContact(id, editedContact) {
    let loggedUser = JSON.parse(localStorage.getItem('currentUser'))
    try {
        await updateContactAndShowAdvices(loggedUser, id, editedContact)
    }
    catch (e) {
        alert(e)
        console.error(e);
    }
}

/**
 * Sends the updated contact data to the server and handles success/error messages.
 * 
 * @param {Object} loggedUser - The current logged-in user.
 * @param {number} id - The unique identifier of the contact to be updated.
 * @param {Contact} editedContact - The new contact data to be saved.
 */
async function updateContactAndShowAdvices(loggedUser, id, editedContact) {
    let response = await fetch(contactsUrl + `${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(editedContact)
    });
    let responseData = await response.json();
    if (responseData.ok == true) {
        getDataAndShowAdvice(responseData.message) // success message
        await loadContactBook();
        let indexOfContact = contacts.findIndex(contact => contact.id == id);
        if (indexOfContact != -1) {
            closeEditContactOverview(indexOfContact);
        }
    } else {
        showUpdateContactErrorMessages(responseData.data);
    }
}

/**
 * Closes the edit contact overlay and shows the updated contact details.
 * 
 * @param {number} id - The unique identifier of the contact to be shown.
 */
function closeEditContactOverview(id) {
    document.getElementById('opacity-edit-contact-overlay').classList.add('d-none')
    showContactInTheDetails(id);
}

/**
 * Deletes the contact based on the provided contactId and sends the deletion request to the server.
 * 
 * @param {number} contactId - The unique identifier of the contact to be deleted.
 */
async function deleteContact(contactId) {
    let loggedUser = JSON.parse(localStorage.getItem('currentUser'))
    let selectedContact = contacts[contactId];
    let id = selectedContact.id;
    try {
        deleteContactAndShowAdvices(id, loggedUser);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Sends a DELETE request to the server to delete the specified contact.
 * 
 * @param {number} id - The unique identifier of the contact to be deleted.
 * @param {Object} loggedUser - The current logged-in user.
 */
async function deleteContactAndShowAdvices(id, loggedUser) {
    let response = await fetch(contactsUrl + `${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        }
    })
    let contactData = await response.json();
    document.getElementById('contact-details').innerHTML = "";
    await getDataAndShowAdvice(contactData.message); // success message
    await loadContactBook().then(() => showRamdomContactAfterDelete())
}

/**
 * Displays an advisory message after creating or deleting a contact.
 * The message is shown temporarily before disappearing.
 * 
 * @param {string} data - The message to be shown (either success or error message).
 */
async function getDataAndShowAdvice(data) {
    let createdOrDeletedContactAdvice = document.getElementById('created-or-deleted-contact-advice');
    createdOrDeletedContactAdvice.innerHTML = data
    setTimeout(() => {
        createdOrDeletedContactAdvice.classList.remove('hide-contact-created-advice')
    }, 500)

    setTimeout(() => {
        createdOrDeletedContactAdvice.classList.add('hide-contact-created-advice')
    }, 3000)
}

function showUpdateContactErrorMessages(data) {
    if (data.first_name) {
        document.getElementById('error-advice-edit-contact-first-name').innerText = data.first_name
    }
    if (data.last_name) {
        document.getElementById('error-advice-edit-contact-last-name').innerText = data.last_name
    }
    if (data.email) {
        document.getElementById('error-advice-edit-contact-email').innerText = data.email
    }
    if (data.phone) {
        document.getElementById('error-advice-edit-contact-phone').innerText = data.phone
    }

    setTimeout(hideErrorsAfter3Seconds, 3000)
}

/**
 * Displays a random contact's details after a contact has been deleted.
 */
function showRamdomContactAfterDelete() {
    if (contacts.length > 0) {
        let randomContactToDisplay = Math.floor(Math.random() * contacts.length);
        document.getElementById('contact-details').innerHTML = "";
        showContactInTheDetails(randomContactToDisplay)
    }
    document.getElementById('opacity-edit-contact-overlay').classList.add('d-none')
}

/**
 * Highlights the navigation link based on the current URL.
 */
function highlightNavLink() {
    let navLinks = document.getElementsByClassName('navbar-link');
    let navLinksToArray = [...navLinks];
    navLinksToArray.forEach((link) => {
        link.style.backgroundColor = 'none'
    })
    if (window.location.href == 'http://127.0.0.1:5500/contacts.html') {
        document.getElementById('contacts-link').style.backgroundColor = '#091931'
    }
}

/**
 * Switches the display between the contact details and contact list on mobile.
 */
function backToContactsListMobile() {
    document.getElementById('contacts-header-and-details-container').classList.add('d-none-mobile');
    document.getElementById('contact-list-container').classList.remove('d-none-mobile');
}

/**
 * Shows the edit or delete contact button container on mobile devices.
 * 
 * @param {Event} event - The event object.
 */
function showEditOrDeleteContactBtnMobile(event) {
    event.stopPropagation();
    document.getElementById('btn-contacts-details-container').classList.remove('right-200');
}

/**
 * Hides the edit or delete contact button container on mobile devices.
 */
function closeEditOrDeleteContactBtnMobile() {
    document.getElementById('btn-contacts-details-container').classList.add('right-200');
}

/**
 * Highlights the cancel button in the "Add Contact" form.
 * Hides the default cross icon and shows the light blue version to indicate focus or hover.
 */
function highlightCancelBtnAddContact() {
    document.getElementById('cross-icon-add-contact').classList.add('d-none');
    document.getElementById('cross-light-blue-add-contact').classList.remove('d-none');
}

/**
 * Reverts the cancel button in the "Add Contact" form to its default state.
 * Shows the default cross icon and hides the light blue version.
 */
function turnCancelBtnAddContactOff() {
    document.getElementById('cross-icon-add-contact').classList.remove('d-none');
    document.getElementById('cross-light-blue-add-contact').classList.add('d-none');
}