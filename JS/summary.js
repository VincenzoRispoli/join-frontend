/**
 * Current date to be displayed in the summary.
 * @type {string}
 */
let date;

/**
 * Current hour in a 24-hour format.
 * @type {number}
 */
let hour;

/**
 * Greeting message based on the time of day (morning, afternoon, evening).
 * @type {string}
 */
let greating;

/**
 * Array containing tasks with "urgent" priority.
 * @type {Array<Object>}
 */
let urgents = [];

/**
 * Array containing tasks with "medium" priority.
 * @type {Array<Object>}
 */
let mediums = [];

/**
 * Array containing tasks with "low" priority.
 * @type {Array<Object>}
 */
let lows = [];

/**
 * Initializes the summary page, including loading tasks, setting greetings, and user data.
 * Redirects to the login page if the user is not authenticated.
 * @async
 */
async function initSummary() {
    authenticated = JSON.parse(localStorage.getItem('authenticated'));
    if (authenticated) {
        await includeHTML();
        highlightNavLink();
        loggedUser = await getLoggedUser();
        setInitialsCurrentUserInTheHeader(loggedUser);
        await loadTasks();
        date = getDate();
        checkTheDaytime();
        greatingMobile();
        loadTasksOverview();
    } else {
        window.location.href = 'login.html';
    }
}

/**
 * Displays a greeting message for mobile users.
 * If the screen width is below or equal to 1050px, the greeting is shown for 2 seconds.
 */
function greatingMobile() {
    if (windowWidthLessThan1050PxAndSummarySite()) {
        let greatingContainerMobile = document.getElementById('greating-mobile');
        greatingContainerMobile.innerHTML = /*html*/ `
          <span class="greating">${greating}</span>
          <span class="blue-username">${loggedUser.username}</span>
       `;
        setTimeout(() => {
            greatingContainerMobile.classList.add('d-none');
        }, 2000);
    }
}

/**
 * Return a truly or falsy value if the window width is less or equal than 1050 pixels and the current page is summary.html
 * @returns {boolean}
 */
function windowWidthLessThan1050PxAndSummarySite() {
    return windowWidth <= 1050 && window.location.href == "http://127.0.0.1:5500/summary.html"
}

/**
 * Call the greatingMobile function when the client resize the window
 */
window.addEventListener('resize', greatingMobile);

/**
 * Highlights the current navigation link based on the current URL.
 */
function highlightNavLink() {
    let navLinks = document.getElementsByClassName('navbar-link');
    let navLinksToArray = [...navLinks];
    navLinksToArray.forEach((link) => {
        link.style.backgroundColor = 'none';
    });
    if (window.location.href == 'http://127.0.0.1:5500/summary.html') {
        document.getElementById('summary-link').style.backgroundColor = '#091931';
    }
}

/**
 * Retrieves the logged-in user's data from local storage.
 * @async
 * @returns {Object} The logged-in user's data.
 */
async function getLoggedUser() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    return user;
}

/**
 * Loads an overview of tasks, including counts for todos, done tasks, urgent tasks, etc.
 */
function loadTasksOverview() {
    document.getElementById('number-of-todos').innerHTML = todos.length;
    document.getElementById('number-of-done').innerHTML = dones.length;
    urgents = tasks.filter(t => t['priority'] == 'urgent');
    document.getElementById('number-of-urgent-tasks').innerHTML = urgents.length;
    document.getElementById('number-of-tasks-in-board').innerHTML = tasks.length;
    document.getElementById('number-of-inProgress').innerHTML = inProgress.length;
    document.getElementById('number-of-awaitFeedback').innerHTML = awaitFeedBack.length;
    document.getElementById('date').innerHTML = date;
    document.getElementById('greating').innerHTML = `${greating}`;
    document.getElementById('username').innerHTML = `${loggedUser.username}`;
}

/**
 * Gets the current date in a formatted string (e.g., "March, 10, 2025").
 * @returns {string} The current date formatted as "Month, Day, Year".
 */
function getDate() {
    let now = new Date();
    let day = now.getDate();
    let month = now.toLocaleString('default', { month: 'long' });
    let year = now.getFullYear();
    let newDate = (`${month}, ${day}, ${year}`);
    hour = now.getHours();
    return newDate;
}

/**
 * Checks the current time of day and sets an appropriate greeting message.
 * Updates the `greating` variable based on the time of day.
 */
function checkTheDaytime() {
    if (hour > 0 && hour < 12) {
        greating = 'Good Morning';
    } else if (hour > 12 && hour < 18) {
        greating = 'Good Afternoon';
    } else {
        greating = 'Good Evening';
    }
}

/**
 * Changes the icon color to white and updates the icon image based on the task type.
 * @param {string} value - The type of task (e.g., 'todo', 'done').
 */
function iconWhite(value) {
    document.getElementById(`summary-icon-container-${value}`).style.backgroundColor = '#fff';
    if (value == 'todo') {
        document.getElementById(`summary-icon-${value}`).src = './assets/img/pencil-blue.png';
    } else {
        document.getElementById(`summary-icon-${value}`).src = './assets/img/check-blue.png';
    }
}

/**
 * Resets the icon color to the original state and updates the icon image based on the task type.
 * @param {string} value - The type of task (e.g., 'todo', 'done').
 */
function originalIcon(value) {
    document.getElementById(`summary-icon-container-${value}`).style.backgroundColor = '#2A3647';
    if (value == 'todo') {
        document.getElementById(`summary-icon-${value}`).src = './assets/img/pencil-white.png';
    } else {
        document.getElementById(`summary-icon-${value}`).src = './assets/img/check-white.png';
    }
}