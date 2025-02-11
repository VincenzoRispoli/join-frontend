let date;
let hour;
let greating;

async function initSummary() {
    authenticated = JSON.parse(localStorage.getItem('authenticated'));
    if (authenticated) {
        await getLoggedUser();
        await loadTasks();
        date = getDate();
        checkTheDaytime();
        loadTasksOverview();
    } else {
        window.location.href = 'login.html'
    }
}
document.addEventListener('DOMContentLoaded', () => {
    includeHTML(() => {
        setInitialsCurrentUserInTheHeader(); // Esegui la funzione dopo che tutto è stato caricato
    });
});

function loadTasksOverview() {
    let urgents = [];
    document.getElementById('number-of-todos').innerHTML = todos.length;
    document.getElementById('number-of-done').innerHTML = dones.length;
    urgents = tasks.filter(t => t['priority'] == 'urgent')
    document.getElementById('number-of-urgent-tasks').innerHTML = urgents.length;
    document.getElementById('number-of-tasks-in-board').innerHTML = tasks.length;
    document.getElementById('number-of-inProgress').innerHTML = inProgress.length;
    document.getElementById('number-of-awaitFeedback').innerHTML = awaitFeedBack.length;
    document.getElementById('date').innerHTML = date;
    document.getElementById('greating').innerHTML = `${greating} ${loggedUser.username}`
}

function getDate() {
    let now = new Date();
    let day = now.getDate();
    let month = now.toLocaleString('default', { month: 'long' })
    let year = now.getFullYear();
    let newDate = (`${month}, ${day}, ${year}`);
    hour = now.getHours();
    return newDate;
}

function checkTheDaytime() {
    if (hour > 0 && hour < 12) {
        greating = 'Good Morning'
    } else if (hour > 12 && hour < 18) {
        greating = 'Good Afternoon'
    } else {
        greating = 'Good Evening'
    }
}