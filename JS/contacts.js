let contacts = [];
let badgeColors = ['#f76b25', '#07cbd9', '#e8ce07', '#c60af5', '#0814fc'];
let germanAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "Ä", "Ö", "Ü"];

let contactsUrl = 'http://127.0.0.1:8000/kanban/contacts/';

let firstName;
let lastName;

async function initContacts(){
    authenticated = JSON.parse(localStorage.getItem('authenticated'))
    if(authenticated){
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
    loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    setInitialsCurrentUserInTheHeader(loggedUser);
    console.log(loggedUser);
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
    contactDetailsContainer.innerHTML = showContactDetailsHTML(selectedContact, initials)
}

async function createContact(event) {
    event.preventDefault();
    let name = document.getElementById('input-name');
    let email = document.getElementById('input-email');
    let phoneNumber = document.getElementById('input-phone');
    let randomColor = Math.floor(Math.random() * (badgeColors.length - 1));
    let badgeColor = badgeColors[randomColor];
    splitName(name.value)
    try {
        let response = await fetch(contactsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            },
            body: JSON.stringify({
                'user': loggedUser.user_id,
                'first_name': firstName,
                'last_name': lastName,
                'email': email.value,
                'phone': phoneNumber.value,
                'badgeColor': badgeColor
            })
        })
        let result = await response.json();
    } catch (e) {
        console.log(e);
    }
    name.value = "";
    email.value = "";
    phoneNumber.value = "";
    await loadContactBook();
}

function splitName(name){
   let splittedName = name.split(" ");
   firstName = splittedName[0];
   lastName = splittedName[1];
}

function showAddContactOverlay() {
    document.getElementById('add-contact-overlay-container').classList.remove('d-none')
}

function closeAddContactOverlay() {
    document.getElementById('add-contact-overlay-container').classList.add('d-none');
}

function stopPropagation(event) {
    event.stopPropagation();
}