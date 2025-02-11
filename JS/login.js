let urlLogin = 'http://127.0.0.1:8000/api/auth/login/';
window.loggedUser;
let authenticated;

async function login() {
    let username = document.getElementById('input-login-username')
    let email = document.getElementById('input-login-email')
    let password = document.getElementById('input-login-password')
    let response = await fetch(urlLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `${loggedUser.token}`
        },
        body: JSON.stringify({
            'username': username.value,
            'email': email.value,
            'password': password.value
        })
    })
    let loginData = await response.json()
    if (loginData.ok == true) {
        try {
            loggedUser = loginData.data
            authenticated = true
            localStorage.setItem('currentUser', JSON.stringify(loggedUser))
            localStorage.setItem('authenticated', JSON.stringify(authenticated))
            window.location.href = 'summary.html'
        } catch (e) {
            console.log(e);
        }
    } else {
        authenticated = false
        document.getElementById('false-credential-advice').classList.remove('d-none')
    }
    console.log(loginData);

    username.value = "";
    email.value = "";
    password.value = "";
}

async function guestUserLogin() {
    try{
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
        let guestLoginData = await response.json();
        loggedUser = guestLoginData.data;
        authenticated = true;
        localStorage.setItem('currentUser',JSON.stringify(loggedUser));
        localStorage.setItem('authenticated',JSON.stringify(authenticated));
        window.location.href = 'summary.html';
    } catch(e){
        console.log(e);
        document.getElementById('false-credential-advice').classList.remove('d-none')
    }
}

// guestLogin123 password
