let urlLogin = 'http://127.0.0.1:8000/api/auth/login/';
let loggedUser;
let authenticated;

async function login() {
    let email = document.getElementById('input-login-email');
    let password = document.getElementById('input-login-password');
    let username = document.getElementById('input-login-username');
    await postLoginData(username, email, password);
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
                'username': username.value,
                'password': password.value
            })
        })
        let loginData = await response.json();
        await getPostedLoginData(loginData);
    } catch (e) {
        console.log(e);
    }
}

async function getPostedLoginData(loginData) {
    if (loginData.ok) {
        loggedUser = loginData.data
        authenticated = true
        localStorage.setItem('currentUser', JSON.stringify(loggedUser))
        localStorage.setItem('authenticated', JSON.stringify(authenticated))
        window.location.href = 'summary.html'
    } else {
        authenticated = false
        document.getElementById('false-credential-advice').classList.remove('d-none')
    }
}

async function guestUserLogin() {
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
        getPostedGuestLoginData(response);
    } catch (e) {
        console.log(e);
        document.getElementById('false-credential-advice').classList.remove('d-none')
    }
}

async function getPostedGuestLoginData(response) {
    try {
        let guestLoginData = await response.json();
        loggedUser = guestLoginData.data;
        authenticated = true;
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
        window.location.href = 'summary.html';
    } catch (e) {
        console.log(e);
    }
}
