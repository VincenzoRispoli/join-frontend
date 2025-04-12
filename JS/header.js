/**
 * A boolean flag indicating the current state of the submenu (shown or hidden).
 * @type {boolean}
 */
let submenuStatus = false;

/**
 * Sets the initials of the currently logged-in user in the header.
 * Displays the first letter of the first name and the first letter of the last name.
 * @async
 * @param {Object} loggedUser - The logged-in user's data.
 * @param {string} loggedUser.first_name - The first name of the logged-in user.
 * @param {string} loggedUser.last_name - The last name of the logged-in user.
 */
async function setInitialsCurrentUserInTheHeader(loggedUser) {
    let initials = loggedUser.first_name.charAt(0) + loggedUser.last_name.charAt(0);
    let initialsContainer = document.getElementById('initials-current-user');
    if (initialsContainer) {
        initialsContainer.innerText = `${initials}`;
    }
}

/**
 * Logs the user out, clears the user data from local storage, and redirects to the login page.
 * Also hides the submenu if it's visible.
 * @async
 */
async function logOut() {
    try {
        loggedUser = [];
        authenticated = false;
        localStorage.setItem('currentUser', JSON.stringify(loggedUser));
        localStorage.setItem('authenticated', JSON.stringify(authenticated));
        window.location.href = 'login.html';
        submenuStatus = false;
        showOrHideSubmenu();
    } catch (e) {
        console.log(e);
    }
}

/**
 * Toggles the visibility of the submenu based on the current `submenuStatus`.
 */
function showOrHideSubmenu() {
    let submenu = document.getElementById('submenu');
    if (!submenuStatus) {
        hideSubmenu(submenu);
    } else {
        showSubmenu(submenu);
    }
}

/**
 * Hides the submenu by adding the 'd-none' class to each submenu option and adjusting the submenu's height and padding.
 * @param {HTMLElement} submenu - The submenu element to hide.
 */
function hideSubmenu(submenu) {
    let submenuOptionsHTMLCollection = document.getElementsByClassName('submenuOption');
    let submenuOptions = [...submenuOptionsHTMLCollection];
    submenuOptions.forEach((option) => {
        option.classList.add('d-none');
    });
    submenu.style.height = '0px';
    submenu.style.padding = '0px';
}

/**
 * Displays the submenu by removing the 'd-none' class from each submenu option and adjusting the submenu's height and padding.
 * @param {HTMLElement} submenu - The submenu element to show.
 */
function showSubmenu(submenu) {
    submenu.style.padding = '10px';
    submenu.style.height = 'auto';
    let submenuOptionsHTMLCollection = document.getElementsByClassName('submenuOption');
    let submenuOptions = [...submenuOptionsHTMLCollection];
    submenuOptions.forEach((option) => {
        option.classList.remove('d-none');
    });
}

/**
 * Toggles the `submenuStatus` and updates the visibility of the submenu.
 */
function submenuTrigger() {
    submenuStatus = !submenuStatus;
    showOrHideSubmenu();
}