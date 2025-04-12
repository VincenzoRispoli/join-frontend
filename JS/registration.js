/**
 * URL endpoint for registration API.
 * @constant {string}
 */
let urlRegistration = 'http://127.0.0.1:8000/api/auth/registration/';

/**
 * Indicates whether the user has accepted the privacy policy.
 * @type {boolean}
 */
let privacyPolicyAccepted = false;

/**
 * Handles the registration process, including form validation and API call.
 * @async
 */
async function register() {
    if (privacyPolicyAccepted) {
        let username = document.getElementById('input-regist-username');
        let firstName = document.getElementById('input-regist-first-name');
        let lastName = document.getElementById('input-regist-last-name');
        let email = document.getElementById('input-regist-email');
        let password = document.getElementById('input-regist-password');
        let repeated_password = document.getElementById('input-regist-repeated-password');
        await postRegistrationData(username.value, firstName, lastName, email, password, repeated_password);
    } else {
        document.getElementById('privacy-policy-advice').classList.remove('d-none');
    }
}

/**
 * Event listener for the username input field. Replaces spaces with underscores as the user types.
 * @param {Event} event - The input event triggered by the user.
 */
document.getElementById('input-regist-username').addEventListener('input', (event) => {
    let value = event.target.value;
    event.target.value = value.replace(/\s/g, "_");
});

/**
 * Sends a POST request with the registration data to the registration API.
 * @async
 * @param {string} username - The username input value.
 * @param {HTMLElement} firstName - The first name input element.
 * @param {HTMLElement} lastName - The last name input element.
 * @param {HTMLElement} email - The email input element.
 * @param {HTMLElement} password - The password input element.
 * @param {HTMLElement} repeated_password - The repeated password input element.
 */
async function postRegistrationData(username, firstName, lastName, email, password, repeated_password) {
    try {
        let response = await fetch(urlRegistration, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'first_name': firstName.value,
                'last_name': lastName.value,
                'email': email.value,
                'password': password.value,
                'repeated_password': repeated_password.value,
            })
        })
        await getPostedRegistData(response);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Handles the response from the registration API and processes the registration data.
 * If the registration is successful, the user is redirected to the login page.
 * If there are validation errors, an error message is displayed.
 * @async
 * @param {Response} response - The response object from the registration API.
 */
async function getPostedRegistData(response) {
    let userData = await response.json();
    if (response.ok) {
        window.location.href = 'login.html';
    } else {
        for (let field in userData) {
            if (userData.hasOwnProperty(field)) {
                document.getElementById('pop-up-validation-advice').classList.remove('d-none');
                let valMessage = document.getElementById('advice-text');
                valMessage.innerHTML = `${userData[field]}`;
            }
        }
    }
}

/**
 * Hides the validation advice popup.
 */
function removeValidationAdvice() {
    document.getElementById('pop-up-validation-advice').classList.add('d-none');
}

/**
 * Accepts or rejects the privacy policy based on the checkbox status.
 * If accepted, the privacy policy advice message is hidden.
 * @param {HTMLInputElement} checkbox - The checkbox input element for accepting the privacy policy.
 */
function acceptPrivacyPolicy(checkbox) {
    if (checkbox && checkbox.checked) {
        privacyPolicyAccepted = true;
        document.getElementById('privacy-policy-advice').classList.add('d-none');
    } else if (checkbox) {
        privacyPolicyAccepted = false;
    }
}