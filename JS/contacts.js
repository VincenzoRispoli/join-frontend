let contacts = [];
let badgeColors = ['#f76b25', '#07cbd9', '#e8ce07', '#c60af5', '#0814fc'];
let germanAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Ä", "Ö", "Ü"];

let contactsUrl = 'http://127.0.0.1:8000/kanban/contacts/';

let firstName;
let lastName;

async function initContacts() {
    authenticated = JSON.parse(localStorage.getItem('authenticated'))
    if (authenticated) {
        includeHTML();
        await getLoggedUser();
        await loadContactBook();
    } else {
        window.location.href = 'login.html'
    }
}

async function getLoggedUser() {
    loggedUser = JSON.parse(localStorage.getItem('currentUser'));
}

async function loadContactBook() {
    await loadCurrentUser();
    await loadContacts();
    let contactList = document.getElementById('contact-list');
    contactList.innerHTML = "";
    let initialsOfAllContacts = contacts.map(contact => contact['first_name'].charAt(0).toUpperCase());
    let matchingLetters = germanAlphabet.filter(letter => initialsOfAllContacts.includes(letter));
    contactBookLoops(contactList, matchingLetters);
}

async function loadCurrentUser() {
    try {
        let loggedUser = JSON.parse(localStorage.getItem('currentUser'));
        setInitialsCurrentUserInTheHeader(loggedUser);
    } catch (e) {
        console.log(e);
    }
}

function contactBookLoops(contactList, matchingLetters) {
    for (let i = 0; i < matchingLetters.length; i++) {
        let letter = matchingLetters[i];
        contactList.innerHTML += generateContactListHTML(letter);
        let letterContainer = document.getElementById(`contacts-for-specific-letter-container${letter}`);
        letterContainer.innerHTML = "";
        for (let j = 0; j < contacts.length; j++) {
            let contact = contacts[j]
            let contactInitials = contact.first_name.charAt(0) + contact.last_name.charAt(0);
            if (letterContainer.id.slice(-1) == contactInitials.charAt(0)) {
                letterContainer.innerHTML += generateContactHTML(j, contact, contactInitials);
            }
        }
    }
}

async function loadContacts() {
    let response = await fetch(contactsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'appplication/json',
            'Authorization': `${loggedUser.token}`
        }
    });
    let fetchedContacts = await response.json()
    contacts = fetchedContacts;
}

function capitalizeContact(contactName) {
    let parts = contactName.split(" ");
    let initials = parts.map(part => part.charAt(0).toUpperCase()).join("")
    return initials
}

function showContactInTheDetails(contactId) {
    let contactDetailsContainer = document.getElementById('contact-details');
    let selectedContact = contacts[contactId];
    let initials = selectedContact.first_name.charAt(0) + selectedContact.last_name.charAt(0)
    contactDetailsContainer.innerHTML = showContactDetailsHTML(contactId, selectedContact, initials);
    contactDetailsContainer.classList.remove('hide-contact-details')
    for (let i = 0; i < contacts.length; i++) {
        document.getElementById(`contact${i}`).classList.remove('contact-on-focus');
        if (i == contactId) {
            document.getElementById(`contact${i}`).classList.add('contact-on-focus');
        }
    }
}

async function createContact(event) {
    let loggedUser = JSON.parse(localStorage.getItem('currentUser'))
    event.preventDefault();
    let name = document.getElementById('input-name');
    let email = document.getElementById('input-email');
    let phone = document.getElementById('input-phone');
    let randomColor = Math.floor(Math.random() * (badgeColors.length - 1));
    let badgeColor = badgeColors[randomColor];
    splitName(name.value)
    let newContact = new Contact(loggedUser.user_id, firstName, lastName, email.value, phone.value, badgeColor)
    try {
        await postNewContact(newContact, loggedUser, name, email, phone);
    } catch (e) {
        console.log(e);
    }
}

async function postNewContact(newContact, loggedUser, name, email, phone) {
    let response = await fetch(contactsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(newContact)
    })
    let createdContactData = await response.json();
    await loadContactBook();
    await clearFormContactValueAndLoadContacts(name, email, phone);
    findeIndexOfCreatedContact(createdContactData)
}

function findeIndexOfCreatedContact(createdContactData) {
    let index = contacts.findIndex(c => c.id == createdContactData.id);
    showContactInTheDetails(index);
    setTimeout(() => {
        document.getElementById('created-or-deleted-contact-advice').classList.remove('hide-contact-created-advice')
    }, 500)

    setTimeout(() => {
        document.getElementById('created-or-deleted-contact-advice').classList.add('hide-contact-created-advice')
    }, 3000)
}

async function clearFormContactValueAndLoadContacts(name, email, phone) {
    name.value = "";
    email.value = "";
    phone.value = "";
    await loadContactBook();
    document.getElementById('add-contact-overlay-container').classList.add('d-none')
}

function splitName(name) {
    let splittedName = name.split(" ");
    firstName = splittedName[0];
    lastName = splittedName[1];
}

function showContactOverlay(containerId) {
    document.getElementById(`${containerId}`).classList.remove('d-none')
}

function closeContactOverlay(containerId) {
    document.getElementById(`${containerId}`).classList.add('d-none')
}

function stopPropagation(event) {
    event.stopPropagation();
}

function showEditContactOverview(contactId) {
    let contact = contacts[contactId];
    let opacityContainer = document.getElementById('opacity-edit-contact-overlay');
    opacityContainer.classList.remove('d-none');
    opacityContainer.innerHTML = editContactOverviewHTML(contactId, contact);
    document.getElementById(`input-name-${contactId}`).value = `${contact.first_name} ${contact.last_name}`;
    document.getElementById(`input-email-${contactId}`).value = contact.email;
    document.getElementById(`input-phone-${contactId}`).value = contact.phone;
}

async function editContact(contactId) {
    let selectedContact = contacts[contactId];
    let id = selectedContact.id
    let user = selectedContact.user;
    let name = document.getElementById(`input-name-${contactId}`);
    let email = document.getElementById(`input-email-${contactId}`);
    let phone = document.getElementById(`input-phone-${contactId}`);
    let badgeColor = selectedContact.badge_color;
    splitName(name.value);
    let editedContact = new Contact(user, firstName, lastName, email.value, phone.value, badgeColor);
    try {
        await updateContact(id, editedContact);
    } catch (e) {
        console.log(e);
    }
}

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
    checkIfResponseOfUpdateContactIsOk(response, responseData);
    await loadContactBook();
    let indexOfContact = contacts.findIndex(contact => contact.id == id);
    if (indexOfContact != -1) {
        closeEditContactOverview(indexOfContact);
    }
}

function checkIfResponseOfUpdateContactIsOk(response, responseData) {
    if (!response.ok) {
        getDataAndShowAdvice(responseData.detail) // error message
    } else {
        getDataAndShowAdvice(responseData.message) // success message
    }
}

function closeEditContactOverview(id) {
    document.getElementById('opacity-edit-contact-overlay').classList.add('d-none')
    showContactInTheDetails(id);
}

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

async function deleteContactAndShowAdvices(id, loggedUser) {
    let response = await fetch(contactsUrl + `${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        }
    })
    let data = await response.json();
    if (!response.ok) {
        getDataAndShowAdvice(data.detail) // error message
    } else {
        document.getElementById('contact-details').innerHTML = "";
        await getDataAndShowAdvice(data.message); // success message
        await loadContactBook().then(() => showRamdomContactAfterDelete())
    }
}

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

function showRamdomContactAfterDelete() {
    if (contacts.length > 0) {
        let randomContactToDisplay = Math.floor(Math.random() * contacts.length);
        document.getElementById('contact-details').innerHTML = "";
        showContactInTheDetails(randomContactToDisplay)
    }
    document.getElementById('opacity-edit-contact-overlay').classList.add('d-none')
}