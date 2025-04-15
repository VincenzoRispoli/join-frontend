/**
 * Array containing all tasks.
 * @type {Array}
 */
let tasks = [];

let cardContainer;
let currentDraggedCard;

/**
 * Array of tasks in the "To-Do" state.
 * @type {Array}
 */
let todos;

/**
 * Array of tasks in the "In Progress" state.
 * @type {Array}
 */
let inProgress;

/**
 * Array of tasks in the "Await Feedback" state.
 * @type {Array}
 */
let awaitFeedBack;

/**
 * Array of tasks in the "Done" state.
 * @type {Array}
 */
let dones;

let todoContainer;
let inProgressContainer;
let awaitFeedbackContainer;
let doneContainer;

/**
 * Tracks the current task creation state.
 * @type {boolean}
 */
let creationTaskState;

/**
 * API endpoint for fetching task data.
 * @type {string}
 */
let tasksUrl = 'http://127.0.0.1:8000/kanban/tasks/';

/**
 * List of subtasks related to a specific task.
 * @type {Array}
 */
let taskRelatedSubtaskList = [];

/**
 * Indicates whether the dropdown menu is closed.
 * @type {boolean}
 */
let dropDownMenuClosed = true;

/**
 * Stores the selected priority level for editing a task.
 * @type {string}
 */
let choosedPriorityEditTask;

/**
 * Stores the priority type of a task.
 * @type {string}
 */
let priorityType;

/**
 * Indicates whether a subtask has been clicked.
 * @type {boolean}
 */
let subtaskIsClicked = false;

let subtaskChangesConfirmed = false;

/**
 * Stores the current value of an input field when editing a subtask.
 * @type {string}
 */
let actualValueInputEditSubtask;

let selectedTaskToDragMobile;

/**
 * List of  task states for mobile views.
 * @type {Array<{technical-state: string, state: string}>}
 */
let mobileStates = [
    {
        'technical-state': 'todo',
        'state': 'To-Do'
    },
    {
        'technical-state': 'in-progress',
        'state': 'In Progress'
    },
    {
        'technical-state': 'await-feedback',
        'state': 'Await Feedback'
    },
    {
        'technical-state': 'done',
        'state': 'Done'
    }
];

/**
 * Initializes the Kanban board by verifying authentication and loading tasks.
 * Redirects to the login page if the user is not authenticated.
 * @async
 */
async function initBoard() {
    authenticated = JSON.parse(localStorage.getItem('authenticated'));
    if (authenticated) {
        await includeHTML();
        highlightNavLink();
        loggedUser = await getLoggedUser();
        await setInitialsCurrentUserInTheHeader(loggedUser);
        await loadTasks();
    } else {
        window.location.href = 'login.html';
    }
}

/**
 * Retrieves the currently logged-in user from local storage.
 * @async
 * @returns {Promise<Object>} The logged-in user object.
 */
async function getLoggedUser() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    return user;
}

/**
 * Loads tasks from the backend and categorizes them.
 * If the user is on the board page, tasks are displayed in their respective containers.
 * @async
 */
async function loadTasks() {
    try {
        await getTaskData();
    } catch (e) {
        console.log(e);
    }
    searchTasks();
    divideTaskByCategory();

    if (window.location.href === 'http://127.0.0.1:5500/board.html') {
        setTasksInRelatedContainer();
        await assignRelatedSubtaskToTask();
    }
}

/**
 * Updates the progress bars and subtask counts for each task.
 * @param {Array} subtasksData - The list of all subtasks.
 */
function showProgressBarAndCountInfos(subtasksData) {
    tasks.forEach(task => {
        let relatedSubtasks = subtasksData.filter(subtask => subtask.task == task.id);
        let completedSubtask = relatedSubtasks.filter(subtask => subtask['is_completed'] == true);
        let percentual;
        if (relatedSubtasks.length == 0) {
            percentual = 0;
        } else {
            percentual = (completedSubtask.length / relatedSubtasks.length) * 100;
        }
        document.getElementById(`progress-bar-${task.id}`).style.width = `${percentual}%`;
        document.getElementById(`completed-subtasks-${task.id}`).innerHTML = completedSubtask.length + ' /';
        document.getElementById(`subtasks-count-${task.id}`).innerHTML = relatedSubtasks.length + ' subtasks';
    });
}

/**
 * Filters tasks based on the search input.
 */
function searchTasks() {
    let searchText = checkSearchTextAndBackToAllTasksButtons();
    if (searchText && searchText.value.length > 0) {
        let matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(searchText.value.toLowerCase()));
        tasks = matchedTasks;
    }
}

/**
 * Checks the search input field and toggles the "back to all tasks" button visibility.
 * @returns {HTMLElement} The search input element.
 */
function checkSearchTextAndBackToAllTasksButtons() {
    let searchText;
    if (windowWidthMoreThan1110PxAndBoardSite()) {
        searchText = document.getElementById('search-tasks-input');
        if (searchText.value.length > 0) {
            document.getElementById('all-tasks-btn').classList.remove('d-none');
        }
    } else if (windowWidthLessThan1110PxAndBoardSite()) {
        searchText = document.getElementById('search-tasks-input-mobile');
        if (searchText.value.length > 0) {
            document.getElementById('cross-icon-search-input-mobile').classList.remove('d-none');
        }
    }
    return searchText;
}

/**
 * Checks if the window width is greater than 1110px and if the user is on the board page.
 * @returns {boolean} True if the conditions are met, otherwise false.
 */
function windowWidthMoreThan1110PxAndBoardSite() {
    return windowWidth > 1110 && window.location.href == 'http://127.0.0.1:5500/board.html';
}

/**
 * Checks if the window width is 1110px or less and if the user is on the board page.
 * @returns {boolean} True if the conditions are met, otherwise false.
 */
function windowWidthLessThan1110PxAndBoardSite() {
    return windowWidth <= 1110 && window.location.href == 'http://127.0.0.1:5500/board.html';
}

/**
 * Categorizes tasks into different states: To-Do, In Progress, Await Feedback, and Done.
 */
function divideTaskByCategory() {
    todos = tasks.filter(t => t['state'] == 'todo');
    inProgress = tasks.filter(t => t['state'] == 'in-progress');
    awaitFeedBack = tasks.filter(t => t['state'] == 'await-feedback');
    dones = tasks.filter(t => t['state'] == 'done');
}

/**
 * Rotates a task card when it is dragged.
 * @param {number} i - The index of the task card.
 * @param {string} id - The ID of the dragged task.
 */
function rotateCard(i, id) {
    currentDraggedCard = id;
    let getDraggedCard = tasks.filter(t => t.id == id)
    let currentstate = getDraggedCard[0]['state'];
    document.getElementById(`${currentstate}-card${i}`).classList.add('rotate-card')
}

/**
 * Moves a task to a new state (e.g., from one column to another).
 * @param {string} state - The new state to move the task to.
 * @returns {Promise<void>} - A promise that resolves once the task is moved.
 */
async function mooveTo(state) {
    let singleTaskUrl = `http://127.0.0.1:8000/kanban/tasks/${currentDraggedCard}/`;
    let movedTask = setTheNewStateToMoovedTask(state);
    try {
        await updateTaskState(movedTask, singleTaskUrl);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Sets the new state for a moved task.
 * @param {string} state - The new state of the task.
 * @returns {Task} - The task with the updated state.
 */
function setTheNewStateToMoovedTask(state) {
    let indexOfMovedTask = tasks.findIndex(task => task.id == currentDraggedCard);
    let movedTask = tasks[indexOfMovedTask];
    movedTask.state = state;
    return movedTask
}

/**
 * Drags a task to a new state on mobile.
 * 
 * @param {string} state - The new state to which the task is being dragged.
 */
async function dragTaskMobile(state) {
    let contacts_ids = selectedTaskToDragMobile.contacts.map(contact => contact.id);
    selectedTaskToDragMobile.state = state;
    selectedTaskToDragMobile.contacts_ids = contacts_ids
    let id = selectedTaskToDragMobile.id;
    let response = await fetch(tasksUrl + `${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(selectedTaskToDragMobile)
    });
    if (response.ok) {
        await loadTasks();
        closeDragTasksMobile();
    }
}

/**
 * Closes the mobile drag task popup.
 */
function closeDragTasksMobile() {
    document.getElementById('drag-tasks-mobile-container').classList.add('d-none');
}