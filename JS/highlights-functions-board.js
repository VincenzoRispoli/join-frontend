/**
 * Highlight the priority button of the selected task.
 * @param {Object} selectedTask - The task object that contains the priority.
 */
function highlightPriorityBtn(selectedTask) {
    let priority = selectedTask.priority.toLowerCase();
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.add(`${priority}-btn-edit-task`);
    btn.classList.add('highlithedBtnEditTask');
    btn.focus();
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`;
}

/**
 * Highlight the priority button when hovered over.
 * @param {string} priority - The priority level of the task (e.g., 'high', 'medium', 'low').
 */
function highlightBtnOnHover(priority) {
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.add(`${priority}-btn-edit-task`);
    btn.classList.add('highlithedBtnEditTask');
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`;
}

/**
 * Turn off the highlight on the priority button when the mouse leaves, but maintain it if the button is focused.
 * @param {string} priority - The priority level of the task (e.g., 'high', 'medium', 'low').
 */
function turnTheBtnOffOnLeave(priority) {
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    if (btn.matches(':focus')) {
        btn.classList.add(`${priority}-btn-edit-task`);
        btn.classList.add('highlithedBtnEditTask');
        document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`;
    } else {
        addOrRemoveHighlightsIfTheButtonIsNotFocused(btn, priority);
    }
}

/**
 * Add or remove highlights on the priority button based on whether it is focused or not.
 * @param {HTMLElement} btn - The button element representing the priority button.
 * @param {string} priority - The priority level of the task (e.g., 'high', 'medium', 'low').
 */
function addOrRemoveHighlightsIfTheButtonIsNotFocused(btn, priority) {
    if (priorityType != priority) {
        btn.classList.remove(`${priority}-btn-edit-task`);
        btn.classList.remove('highlithedBtnEditTask');
        document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}.png`;
    } else {
        btn.classList.add(`${priority}-btn-edit-task`);
        btn.classList.add('highlithedBtnEditTask');
        document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`;
    }
}

/**
 * Highlight the priority button when it is clicked.
 * @param {string} priority - The priority level of the task (e.g., 'high', 'medium', 'low').
 */
function highlightBtnOnClick(priority) {
    let priorityBtnEditTask = document.getElementsByClassName('prio-btn-edit-task');
    let buttonsToArray = [...priorityBtnEditTask]
    buttonsToArray.forEach((button) => {
        let prio = button.innerText.toLowerCase();
        button.classList.remove(`${prio}-btn-edit-task`);
        button.classList.remove('highlithedBtnEditTask');
        document.getElementById(`${prio}-icon`).src = `./assets/img/${prio}.png`;
    })
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.add(`${priority}-btn-edit-task`);
    btn.classList.add('highlithedBtnEditTask');
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`;
}

/**
 * Remove the highlight from the priority button when it loses focus.
 * @param {string} priority - The priority level of the task (e.g., 'high', 'medium', 'low').
 */
function removeHighlightOnBlur(priority) {
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.remove(`${priority}-btn-edit-task`);
    btn.classList.remove('highlithedBtnEditTask');
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}.png`;
}

/**
 * Highlight the container of tasks based on their state.
 * @param {string} state - The state of the task container (e.g., 'todo', 'in-progress').
 * @param {Event} event - The event triggered by the action.
 */
function highlightTasksContainer(state, event) {
    event.preventDefault();
    document.getElementById(state).classList.add('dashed-border');
}

/**
 * Prevent the default event behavior, usually used to stop event propagation.
 * @param {Event} event - The event triggered by the action.
 */
function dontClose(event) {
    event.stopPropagation();
}

/**
 * Initialize the page after the HTML content is loaded.
 * Set up the current user's information in the header.
 */
document.addEventListener('DOMContentLoaded', () => {
    includeHTML(() => {
        setInitialsCurrentUserInTheHeader(); // Execute the function after everything has loaded
    });
});

/**
 * Allow the drag event to happen on the element.
 * @param {Event} ev - The drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Remove the dashed border around a task container when the mouse leaves.
 * @param {string} state - The state of the task container (e.g., 'todo', 'in-progress').
 * @param {Event} event - The event triggered by the action.
 */
function removeBorderOnLeave(state, event) {
    event.preventDefault();
    setTimeout(() => {
        document.getElementById(state).classList.remove('dashed-border');
    });
}

/**
 * Remove the dashed border around a task container when an item is dropped.
 * @param {string} state - The state of the task container (e.g., 'todo', 'in-progress').
 * @param {Event} event - The event triggered by the action.
 */
function removeBorderOnDrop(state, event) {
    event.preventDefault();
    document.getElementById(state).classList.remove('dashed-border');
}

/**
 * Highlight the subtask container and related icons when a subtask is clicked.
 * @param {number} i - The index of the subtask.
 */
function highlightContainerAndIcons(i) {
    if (subtaskIsClicked == false) {
        document.getElementById(`subtask-edit-task-overview-container${i}`).style.background = '#eee';
        document.getElementById(`pencil-icon-edit${i}`).classList.remove('d-none');
        document.getElementById(`delete-icon-edit${i}`).classList.remove('d-none');
        document.getElementById(`icon-separator-edit-subtask${i}`).classList.remove('d-none');
    }
}

/**
 * Turn off the highlight on the subtask container and related icons.
 * @param {number} i - The index of the subtask.
 */
function turnhighlightContainerAndIconsOff(i) {
    if (subtaskIsClicked == false) {
        document.getElementById(`subtask-edit-task-overview-container${i}`).style.background = 'none';
        document.getElementById(`pencil-icon-edit${i}`).classList.add('d-none');
        document.getElementById(`delete-icon-edit${i}`).classList.add('d-none');
        document.getElementById(`check-icon-edit${i}`).classList.add('d-none');
        document.getElementById(`icon-separator-edit-subtask${i}`).classList.add('d-none');
    } else if (subtaskIsClicked == true) {
        turnTheHighLightContainerAndIconsOffAndResetSubtaskValue(i);
    }
}

function turnTheHighLightContainerAndIconsOffAndResetSubtaskValue(i) {
    document.getElementById(`subtask-edit-task-overview-container${i}`).style.background = 'none';
    document.getElementById(`pencil-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`delete-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`check-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`icon-separator-edit-subtask${i}`).classList.add('d-none');
    let listItem = document.getElementById(`subtask-edit-task-overview${i}`);
    listItem.setAttribute("contenteditable", "false");
    subtaskIsClicked = false;
    document.getElementById(`subtask-edit-task-overview${i}`).innerText = actualValueInputEditSubtask;
}

/**
 * Highlight the active navigation link based on the current page.
 */
function highlightNavLink() {
    let navLinks = document.getElementsByClassName('navbar-link');
    let navLinksToArray = [...navLinks];
    navLinksToArray.forEach((link) => {
        link.style.backgroundColor = 'none';
    });
    if (window.location.href == 'http://127.0.0.1:5500/board.html') {
        document.getElementById('board-link').style.backgroundColor = '#091931';
    }
}

function highlightEditTaskButton(value){
   document.getElementById(`${value}-icon`).classList.add('d-none');
   document.getElementById(`${value}-icon-light-blue`).classList.remove('d-none');
}

function turnEditTaskButtonOff(value){
    document.getElementById(`${value}-icon`).classList.remove('d-none');
    document.getElementById(`${value}-icon-light-blue`).classList.add('d-none');
 }