let urlRegistration = 'http://127.0.0.1:8000/api/auth/registration/'
let first_name;
let last_name;
let privacyPolicyAccepted = false;
let isSuperuser;
let isStaff;

async function register() {
    if (privacyPolicyAccepted) {
        let username = document.getElementById('input-regist-username')
        let name = document.getElementById('input-regist-name');
        let email = document.getElementById('input-regist-email');
        let password = document.getElementById('input-regist-password');
        let repeated_password = document.getElementById('input-regist-repeated-password');
        splitName(name.value);
        await postRegistrationData(username, first_name, last_name, email, password, repeated_password);
    } else {
        document.getElementById('privacy-policy-advice').classList.remove('d-none');
    }
}

async function postRegistrationData(username, first_name, last_name, email, password, repeated_password) {
    try {
        let response = await fetch(urlRegistration, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username.value,
                'first_name': first_name,
                'last_name': last_name,
                'email': email.value,
                'password': password.value,
                'repeated_password': repeated_password.value,
                'is_staff': isStaff || 0,
                'is_superuser': isSuperuser || 0
            })
        })
        await getPostedRegistData(response);
    } catch (e) {
        console.log(e);
    }
}

async function getPostedRegistData(response) {
    try {
        let userData = await response.json();
        console.log(userData);
        if (response) {
            console.log(response);
            window.location.href = 'login.html'
        }
    } catch (e) {
        console.log(e);
    }
}

function splitName(name) {
    let splittedName = name.split(" ")
    first_name = splittedName[0];
    last_name = splittedName[1]
}

function acceptPrivacyPolicy(checkbox) {
    if (checkbox && checkbox.checked) {
        privacyPolicyAccepted = true;
        document.getElementById('privacy-policy-advice').classList.add('d-none');
    } else if (checkbox) {
        privacyPolicyAccepted = false;
    }
}

function selectLevel(selected, level) {
    let checkboxes = document.querySelectorAll('.level-choices input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox && checkbox != selected) {
            checkbox.checked = false;
        }
    })
    setTheLevelOfRegistUser(level);
}

function setTheLevelOfRegistUser(level) {
    if (level == 'superuser') {
        isSuperuser = 1;
        isStaff = 1;
    } else if (level == 'staff') {
        isStaff = 1
        isSuperuser = 0;
    } else {
        isStaff = 0;
        isSuperuser = 0;
    }
}