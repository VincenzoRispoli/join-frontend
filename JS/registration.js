let urlRegistration = 'http://127.0.0.1:8000/api/auth/registration/'
let first_name;
let last_name;

async function register(){
    let name = document.getElementById('input-regist-name');
    let email = document.getElementById('input-regist-email');
    let password = document.getElementById('input-regist-password');
    let repeated_password = document.getElementById('input-regist-repeated-password');
    splitName(name.value);

    let response = await fetch(urlRegistration, {
        method : 'POST',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
           'username': first_name,
           'first_name': first_name,
           'last_name': last_name,
           'email': email.value,
           'password': password.value,
           'repeated_password': repeated_password.value,
           'is_staff': 0
        })
    })
    let userData = await response.json();
    console.log(userData);
    if(response){
        window.location.href = 'login.html'
    }
}

function splitName(name){
   let splittedName = name.split(" ")
   first_name = splittedName[0];
   last_name = splittedName[1]
}