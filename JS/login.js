let urlLogin = 'http://127.0.0.1:8000/api/auth/login/';
let loggedUser;
let authenticated;

function joinLogoAnimation() {
    setTimeout(() => {
        document.getElementById('login-animation-container').classList.add('d-none')
    }, 2000)
}

async function login() {
    let email = document.getElementById('input-login-email');
    let password = document.getElementById('input-login-password');
    let username = document.getElementById('input-login-username');
    document.getElementById('loading-curtain').classList.remove('d-none');
    await postLoginData(username.value, email, password);
    document.getElementById('loading-curtain').classList.add('d-none');
    username.value = "";
    email.value = "";
    password.value = "";
}

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

async function getPostedLoginData(loginData) {
    loggedUser = loginData.data
    let username = loggedUser.username.toString();
    let modifiedUsername = username.replace(/-/g, ' ');
    loggedUser.username = modifiedUsername;
    authenticated = true
    localStorage.setItem('currentUser', JSON.stringify(loggedUser))
    localStorage.setItem('authenticated', JSON.stringify(authenticated))
    window.location.href = 'summary.html'
}

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
