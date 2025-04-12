/**
 * List of subtasks for the task.
 * @type {Array<Subtask>}
 */
let subtasksList = [];

/**
 * The selected priority for the task.
 * @type {string}
 */
let choosedPriority;

/**
 * The selected category for the task.
 * Default is 'technical-task'.
 * @type {string}
 */
let choosedCategory = 'technical-task';

/**
 * List of assignees fetched from the server.
 * @type {Array<Object>}
 */
let assignees = [];

/**
 * List of selected assignees for the task.
 * @type {Array<number>}
 */
let selectedAssignees = [];

/**
 * The URL for fetching and posting subtasks.
 * @type {string}
 */
let subtasksUrl = 'http://127.0.0.1:8000/kanban/subtasks/';

/**
 * The button representing the active priority.
 * @type {HTMLElement}
 */
let prioBtnActive;

/**
 * The title of the task.
 * @type {string}
 */
let title;

/**
 * The description of the task.
 * @type {string}
 */
let description;

/**
 * The due date for the task.
 * @type {string}
 */
let due_date;

/**
 * The priority of the task.
 * @type {string}
 */
let priority;

/**
 * The category of the task.
 * @type {string}
 */
let category;

/**
 * The state of the task (e.g., 'in-progress', 'completed').
 * @type {string}
 */
let state;

/**
 * List of contacts' IDs associated with the task.
 * @type {Array<number>}
 */
let contacts_ids = [];

/**
 * List of responses related to the subtasks.
 * @type {Array<Object>}
 */
let subtasksResponses = [];

/**
 * Initializes the task creation page by checking authentication and loading necessary data.
 * @async
 */
async function initAddTasks() {
  authenticated = JSON.parse(localStorage.getItem('authenticated'));
  if (authenticated) {
    await includeHTML();
    highlightNavLink();
    loggedUser = await getLoggedUser();
    await setInitialsCurrentUserInTheHeader(loggedUser);
    await loadAssignees();
  } else {
    window.location.href = 'login.html';
  }
}

/**
 * Retrieves the currently logged-in user's data from localStorage.
 * @async
 * @returns {Object} The logged-in user's data.
 */
async function getLoggedUser() {
  let user = JSON.parse(localStorage.getItem('currentUser'));
  return user;
}

/**
 * Loads the list of assignees from the server and displays them in the dropdown menu.
 * @async
 */
async function loadAssignees() {
  let response = await fetch(contactsUrl);
  let fetchedContacts = await response.json();
  assignees = fetchedContacts;
  let assigneesContainer = document.getElementById('drop-down-menu-assignees');
  assigneesContainer.style.border = '1px solid #D1D1D1';
  assigneesContainer.innerHTML = "";
  for (let i = 0; i < assignees.length; i++) {
    let assignee = assignees[i];
    let initials = assignee.first_name.charAt(0).toUpperCase() + assignee.last_name.charAt(0).toUpperCase();
    assigneesContainer.innerHTML += assigneeHTML(i, initials, assignee);
  }
}

/**
 * Toggles the visibility of the assignees dropdown menu.
 */
function showAssigneesInTheDropDownMenu() {
  let assigneeContainer = document.getElementById('drop-down-menu-assignees');
  assigneeContainer.classList.toggle('moveDownDropDownMenu');
  document.getElementById('arrow-drop-down').classList.toggle('rotateArrowDropDown');
}

/**
 * Selects or deselects an assignee from the dropdown list.
 * @param {number} i - The index of the assignee to select or deselect.
 */
function selectAssignees(i) {
  let selectedAssignee = assignees[i];
  let checkbox = document.getElementById(`input-checkbox-assignees${i}`);
  if (checkbox && checkbox.checked == false) {
    checkbox.checked = true;
    selectedAssignees.push(assignees[i].id);
  } else if (checkbox && checkbox.checked == true) {
    checkbox.checked = false;
    let index = selectedAssignees.indexOf(selectedAssignee.id);
    if (index !== -1) {
      selectedAssignees.splice(index, 1);
    }
  }
}

/**
 * Prepares the UI for adding a subtask by displaying additional input options.
 */
function writeSubtask() {
  document.getElementById('cross-and-check-icons-container').classList.remove('d-none');
  document.getElementById('add-icon').classList.add('d-none');
  document.getElementById('input-subtask').focus();
}

/**
 * Clears the input field for adding a subtask and resets the UI.
 * @param {Event} event - The event triggered by the action.
 */
function clearAddSubtaskInput(event) {
  event.stopPropagation();
  document.getElementById('input-subtask').value = "";
  document.getElementById('add-icon').classList.remove('d-none');
  document.getElementById('cross-and-check-icons-container').classList.add('d-none');
}

/**
 * Prepares the UI for editing a subtask by displaying additional input options.
 * @param {number} id - The ID of the subtask being edited.
 */
function writeSubtaskEditTask(id) {
  document.getElementById(`input-subtask-edit-task${id}`).focus();
  document.getElementById('add-icon').classList.add('d-none');
  document.getElementById('cross-and-check-icons-container').classList.remove('d-none');
}

/**
 * Clears the input field for editing a subtask and resets the UI.
 * @param {number} id - The ID of the subtask being edited.
 * @param {Event} event - The event triggered by the action.
 */
function clearAddSubtaskInputEdit(id, event) {
  event.stopPropagation();
  document.getElementById(`input-subtask-edit-task${id}`).value = "";
  document.getElementById('add-icon').classList.remove('d-none');
  document.getElementById('cross-and-check-icons-container').classList.add('d-none');
}

/**
 * Adds a new subtask to the list if the title is provided and updates the UI.
 * @param {Event} event - The event triggered by the action.
 */
function addSubtasks(event) {
  event.stopPropagation();
  let subtaskTitle = document.getElementById('input-subtask');
  if (subtaskTitle.value.length > 0) {
    let subtaskListContainer = document.getElementById('subtask-list');
    let newSubtask = new Subtask(subtaskTitle.value, false);
    subtasksList.push(newSubtask);
    subtaskListContainer.innerHTML = '';
    loadCreatedSubtasksInTheListContainer(subtasksList, subtaskListContainer);
    clearAddSubtaskInput(event);
  }
}

/**
 * Loads the list of created subtasks into the container.
 * @param {Array<Subtask>} subtasksList - The list of subtasks to display.
 * @param {HTMLElement} subtaskListContainer - The container to display the subtasks in.
 */
function loadCreatedSubtasksInTheListContainer(subtasksList, subtaskListContainer) {
  for (let i = 0; i < subtasksList.length; i++) {
    let subtask = subtasksList[i];
    subtaskListContainer.innerHTML += subtaskHTML(i, subtask);
  }
}

/**
 * Highlights the selected priority button and updates its icon.
 * @param {string} priority - The priority level to highlight (e.g., 'low', 'medium', 'high').
 */
function fillButton(priority) {
  choosedPriority = priority;
  let prioButtons = document.getElementsByClassName('prio-btn');
  let prioButtonsToArray = [...prioButtons];
  prioButtonsToArray.forEach((button) => {
    let prio = button.innerText.toLowerCase();
    button.classList.remove('highlithedBtnEditTask');
    button.classList.remove(`${prio}-btn-edit-task`);
    document.getElementById(`${prio}-icon`).src = `./assets/img/${prio}.png`;
  });
  document.getElementById(`${priority}-btn`).classList.add(`${priority}-btn-edit-task`);
  document.getElementById(`${priority}-btn`).classList.add('highlithedBtnEditTask');
  document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`;
}

/**
 * Highlights the priority button when hovered over.
 * @param {string} priority - The priority level to highlight (e.g., 'low', 'medium', 'high').
 */
function fillBtnOnOver(priority) {
  document.getElementById(`${priority}-btn`).classList.add(`${priority}-btn-edit-task`);
  document.getElementById(`${priority}-btn`).classList.add('highlithedBtnEditTask');
  document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`;
}

/**
 * Removes the highlight from the priority button when the mouse is not over it.
 * @param {string} priority - The priority level to remove the highlight from (e.g., 'low', 'medium', 'high').
 */
function blurPrioButton(priority) {
  if (choosedPriority !== priority) {
    document.getElementById(`${priority}-btn`).classList.remove(`${priority}-btn-edit-task`);
    document.getElementById(`${priority}-btn`).classList.remove('highlithedBtnEditTask');
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}.png`;
  }
}

/**
 * Clears all the input fields and resets the form for adding a task.
 */
function clearAddTaskForm() {
  document.getElementById('title').value = "";
  document.getElementById('description').value = "";
  let checkboxses = document.getElementsByClassName('input-checkbox-assignees');
  let checkboxsesToArray = [...checkboxses];
  checkboxsesToArray.forEach((checkbox) => {
    checkbox.checked = false;
  });
  let prioButtons = document.getElementsByClassName('prio-btn');
  let prioButtonsToArray = [...prioButtons];
  prioButtonsToArray.forEach((button) => {
    let prio = button.innerText.toLowerCase();
    button.classList.remove('highlithedBtnEditTask');
    button.classList.remove(`${prio}-btn-edit-task`);
    document.getElementById(`${prio}-icon`).src = `./assets/img/${prio}.png`;
  });
  document.getElementById('date').value = "";
  subtasksList = [];
  document.getElementById('subtask-list').innerHTML = "";
}

/**
 * Select the chosen category from the categories dropdown.
 */
function selectCategory() {
  choosedCategory = document.getElementById('categories').value;
}

/**
 * Create a new task by collecting form data and sending it to the backend.
 * @param {Event} event - The event triggered by form submission.
 */
async function createTasks(event) {
  let newTask = createNewTaskFromTheForm(event);
  try {
    await postTheNewCreatedTask(newTask);
    if (window.location.href == 'http://127.0.0.1:5500/board.html') {
      await loadTasks();
      closeAddTaskOverview(event);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Create a new task object from the data in the form.
 * @param {Event} event - The event triggered by form submission.
 * @returns {Task} - The newly created task object.
 */
function createNewTaskFromTheForm(event) {
  event.preventDefault();
  title = document.getElementById('title');
  description = document.getElementById('description');
  due_date = document.getElementById('date');
  priority = choosedPriority;
  category = choosedCategory;
  state = checkState();
  contacts_ids = selectedAssignees;
  let newTask = new Task(title.value, description.value, category, due_date.value, priority, contacts_ids, state);
  return newTask;
}

/**
 * Check the state of the task.
 * @returns {string} - The current state of the task, defaulting to 'todo'.
 */
function checkState() {
  if (creationTaskState !== '') {
    return creationTaskState;
  } else {
    return "todo";
  }
}

/**
 * Send the newly created task to the backend.
 * @param {Task} newTask - The task object to be sent.
 */
async function postTheNewCreatedTask(newTask) {
  try {
    let taskResponse = await fetch(tasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${loggedUser.token}`
      },
      body: JSON.stringify(newTask)
    });
    if (taskResponse.ok) {
      await getTaskDataAndPostSubtask(taskResponse);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Retrieve task data from the response and send the subtasks to the backend.
 * @param {Response} taskResponse - The response object from the task creation.
 */
async function getTaskDataAndPostSubtask(taskResponse) {
  try {
    let taskData = await taskResponse.json();
    if (taskData) {
      await sendSubtasks(taskData);
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Send subtasks to the backend after the task is created.
 * @param {Object} taskData - The task data received from the backend.
 */
async function sendSubtasks(taskData) {
  try {
    await sendSubtasksToBackend(taskData);
    let checkFalseResponse = subtasksResponses.some(response => response.ok == false);
    if (checkFalseResponse == false) {
      clearAddTaskValues();
      getAndClearSubtasksHTMLListAfterSend();
    }
  } catch (e) {
    console.log(e);
  }
}

/**
 * Send the subtasks to the backend.
 * @param {Object} taskData - The task data containing the task ID.
 */
async function sendSubtasksToBackend(taskData) {
  for (let subtask of subtasksList) {
    subtask.task_id = taskData.id;
    let response = await fetch(subtasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${loggedUser.token}`
      },
      body: JSON.stringify(subtask)
    });
    subtasksResponses.push(response);
  }
}

/**
 * Clear the list of subtasks in the HTML after sending them to the backend.
 */
async function getAndClearSubtasksHTMLListAfterSend() {
  subtasksList = [];
  if (window.location.href == "board.html") {
    showCreateTaskOverview();
  } else {
    document.getElementById('subtask-list').innerHTML = "";
  }
}

/**
 * Clear the values of the task form and reset task-related states.
 */
function clearAddTaskValues() {
  title.value = "";
  description.value = "";
  due_date.value = "";
  removeHighlightsOnPrioButtons();
  priority = "";
  category = "";
  contacts_ids = [];
  selectedAssignees = [];
  subtasksResponses = [];
  switchAllAssigneesCheckboxesToFalse();
  showAssigneesInTheDropDownMenu();
}

/**
 * Remove highlights from the priority buttons.
 */
function removeHighlightsOnPrioButtons() {
  let prioButtons = document.getElementsByClassName('prio-btn');
  let prioButtonsToArray = [...prioButtons];
  prioButtonsToArray.forEach(btn => {
    btn.classList.remove('highlithedBtnEditTask');
    btn.classList.remove(`${priority}-btn-edit-task`);
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}.png`;
  });
}

/**
 * Uncheck all assignees checkboxes.
 */
function switchAllAssigneesCheckboxesToFalse() {
  let checkboxsesHTMLcollection = document.getElementsByClassName('input-checkbox-assignees');
  let checkboxes = [...checkboxsesHTMLcollection];
  checkboxes.forEach(c => {
    c.checked = false;
  });
}

/**
 * Check the validity of the task form inputs and enable the submit button if valid.
 */
function checkValidityOfFormInputs() {
  let form = document.getElementById('add-task-form');
  if (form.checkValidity()) {
    let submitButton = document.getElementById('submit-btn');
    submitButton.disabled = false;
  }
}

/**
 * Highlight the clear button in the task form.
 */
function highlightClearButton() {
  document.getElementById('cross-icon-black').classList.add('d-none');
  document.getElementById('cross-icon-light-blue').classList.remove('d-none');
}

/**
 * Turn off the highlighting of the clear button in the task form.
 */
function turnClearBtnOff() {
  document.getElementById('cross-icon-black').classList.remove('d-none');
  document.getElementById('cross-icon-light-blue').classList.add('d-none');
}

/**
 * Highlight the navigation link based on the current page.
 */
function highlightNavLink() {
  let navLinks = document.getElementsByClassName('navbar-link');
  let navLinksToArray = [...navLinks];
  navLinksToArray.forEach((link) => {
    link.style.backgroundColor = 'none';
  });
  if (window.location.href == 'http://127.0.0.1:5500/addTask.html') {
    document.getElementById('add-task-link').style.backgroundColor = '#091931';
  }
}