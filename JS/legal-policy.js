
async function initCopyrigth() {
    await includeHTML();
    let loggedUser = await getLoggedUser();
    await setInitialsCurrentUserInTheHeader(loggedUser);
}

async function getLoggedUser() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    return user
}