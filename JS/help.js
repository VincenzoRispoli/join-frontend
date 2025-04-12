
async function initHelp() {
    await includeHTML();
    loggedUser = await getLoggedUser();
    setInitialsCurrentUserInTheHeader(loggedUser);
}

async function getLoggedUser() {
    user = JSON.parse(localStorage.getItem('currentUser'));
    return user;
}