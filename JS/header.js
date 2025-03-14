let submenuStatus = false;
function setInitialsCurrentUserInTheHeader(loggedUser) {
    let initials = loggedUser.first_name.charAt(0) + loggedUser.last_name.charAt(0)
    let initialsContainer = document.getElementById('initials-current-user');
    if (initialsContainer) {
        initialsContainer.innerText = `${initials}`
    }
}

async function logOut() {
    try {
        loggedUser = [];
        authenticated = false
        localStorage.setItem('currentUser', JSON.stringify(loggedUser))
        localStorage.setItem('authenticated', JSON.stringify(authenticated))
        window.location.href = 'login.html'
        submenuStatus = false;
        showOrHideSubmenu();
    } catch (e) {
        console.log(e);
    }
}

function showOrHideSubmenu() {
    let submenu = document.getElementById('submenu');
    if (!submenuStatus) {
        hideSubmenu(submenu);
    } else {
        showSubmenu(submenu);
    }
}

function hideSubmenu(submenu) {
    let submenuOptionsHTMLCollection = document.getElementsByClassName('submenuOption');
    let submenuOptions = [...submenuOptionsHTMLCollection];
    submenuOptions.forEach((option) => {
        option.classList.add('d-none');
    })
    submenu.style.height = '0px';
    submenu.style.padding = '0px';
}

function showSubmenu(submenu) {
    submenu.style.padding = '10px';
    submenu.style.height = 'auto';
    let submenuOptionsHTMLCollection = document.getElementsByClassName('submenuOption');
    let submenuOptions = [...submenuOptionsHTMLCollection];
    submenuOptions.forEach((option) => {
        option.classList.remove('d-none');
    })
}

function submenuTrigger() {
    submenuStatus = !submenuStatus
    showOrHideSubmenu()
}