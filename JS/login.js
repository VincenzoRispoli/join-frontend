/**
 * URL endpoint for login API.
 * @constant {string}
 */
let urlLogin = 'http://127.0.0.1:8000/api/auth/login/';

/**
 * Stores the currently logged-in user object.
 * @type {Object}
 */
let loggedUser;

/**
 * Represents the authentication status of the user.
 * @type {boolean}
 */
let authenticated;

/**
 * Stores the current window width.
 * @type {number}
 */
let windowWidth = window.innerWidth;

/**
 * Updates the windowWidth whenever the window is resized.
 */
window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
});

/**
 * Handles the logo animation during login based on window size.
 * @async
 */
async function joinLogoAnimation() {
    if (windowWidth <= 720) {
        document.getElementById('big-logo-animation-login').src = './assets/img/logo-small-white.png';
        setTimeout(() => {
            document.getElementById('big-logo-animation-login').src = './assets/img/logo-small-blue.png';
        }, 600)
    }
    setTimeout(() => {
        document.getElementById('login-animation-container').classList.add('d-none');
        document.getElementById('big-logo-animation-login').src = './assets/img/logo-small-blue.png';
    }, 900)
}

/**
 * Handles the login process, including form data collection and API call.
 * @async
 */
async function login() {
    let email = document.getElementById('input-login-email');
    let password = document.getElementById('input-login-password');
    let username = document.getElementById('input-login-username');
    if (windowWidth <= 720) {
        document.getElementById('curtain-logo').src = './assets/img/logo-small-white.png'
    }
    document.getElementById('loading-curtain').classList.remove('d-none');
    await postLoginData(username.value, email, password);
    document.getElementById('loading-curtain').classList.add('d-none');
    username.value = "";
    email.value = "";
    password.value = "";
}

/**
 * Sends a POST request with login credentials to the login API.
 * @async
 * @param {string} username - The username input value.
 * @param {HTMLElement} email - The email input element.
 * @param {HTMLElement} password - The password input element.
 */
async function postLoginData(username, email, password) {
    try {
        let response = await fetch(urlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': username,
                'email': email.value,
                'password': password.value
            })
        })
        await getResponseAndPostData(response);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Handles the response from the login API and processes the login data.
 * @async
 * @param {Response} response - The response object from the login API.
 */
async function getResponseAndPostData(response) {
    let loginData = await response.json();
    if (loginData.ok) {
        await getPostedLoginData(loginData);
    } else {
        authenticated = false
        document.getElementById('false-credential-advice').classList.remove('d-none')
        document.getElementById('false-credential-advice').innerHTML = loginData.error
    }
}

/**
 * Processes the login data and sets the user as authenticated.
 * @async
 * @param {Object} loginData - The login data returned from the login API.
 */
async function getPostedLoginData(loginData) {
    loggedUser = loginData.data;
    await loadContacts();
    let username = loggedUser.username.toString();
    let modifiedUsername = username.replace(/-/g, ' ');
    loggedUser.username = modifiedUsername;
    authenticated = true
    localStorage.setItem('currentUser', JSON.stringify(loggedUser))
    localStorage.setItem('authenticated', JSON.stringify(authenticated));
    let loggedUserExist = contacts.findIndex(c => c.first_name == loggedUser.first_name && c.email == loggedUser.email);
    if (loggedUserExist == -1) {
        await createContactWithTheRegisteredUser(loggedUser);
    }
    if (loggedUser) {
        window.location.href = 'summary.html'
    }
}

/**
 * Creates a contact for the newly registered user.
 * @async
 * @param {Object} loggedUser - The logged-in user object.
 */
async function createContactWithTheRegisteredUser(loggedUser) {
    let firstName = loggedUser.first_name;
    let lastName = loggedUser.last_name;
    let email = loggedUser.email;
    let phone = '12345';
    let randomColor = Math.floor(Math.random() * (badgeColors.length - 1));
    let badgeColor = badgeColors[randomColor];
    let newContact = new Contact(loggedUser.user_id, firstName, lastName, email, phone, badgeColor);
    try {
        postTheNewRegisteredContact(newContact, loggedUser);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Sends a POST request to create a new contact for the logged-in user.
 * @async
 * @param {Object} newContact - The new contact object to be created.
 * @param {Object} loggedUser - The logged-in user object.
 */
async function postTheNewRegisteredContact(newContact, loggedUser) {
    let response = await fetch(contactsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(newContact)
    })
    let result = await response.json();
}

/**
 * Logs in as a guest user.
 * @async
 */
async function guestUserLogin() {
    document.getElementById('loading-curtain').classList.remove('d-none')
    try {
        let response = await fetch(urlLogin, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': 'Guest',
                'email': 'guestlogin@gmail.com',
                'password': 'guestLogin123'
            })
        })
        await getPostedGuestLoginData(response);
        document.getElementById('loading-curtain').classList.add('d-none')
    } catch (e) {
        console.log(e);
        document.getElementById('false-credential-advice').classList.remove('d-none')
    }
}

/**
 * Processes the response for the guest login and sets the user as authenticated.
 * @async
 * @param {Response} response - The response object from the guest login API.
 */
async function getPostedGuestLoginData(response) {
    let guestLoginData = await response.json();
    if (response.ok) {
        loggedUser = guestLoginData.data;
        authenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
        window.location.href = 'summary.html';
    }
}