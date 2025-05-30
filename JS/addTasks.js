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
    if (window.location.href == "http://127.0.0.1:5500/addTask.html") {
      assigneesContainer.innerHTML += assigneeHTML(i, initials, assignee);
    } else if (window.location.href == "http://127.0.0.1:5500/board.html") {
      assigneesContainer.innerHTML += assigneeHTMLForAddTaskBoard(i, initials, assignee);
    }
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
 * Toggles the selection of an assignee when adding a task from the board.
 * If the checkbox is unchecked, it will be checked and the assignee's ID will be added to the selectedAssignees array.
 * If the checkbox is already checked, it will be unchecked and the assignee's ID will be removed.
 *
 * @param {number} i - The index of the assignee in the `assignees` array.
 */
function selectAssigneesForAddTaskBoard(i) {
  let selectedAssignee = assignees[i];
  let checkbox = document.getElementById(`input-checkbox-assignees-add-task-board${i}`);
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
 * Toggles the selection of an assignee when editing an existing task.
 * If the checkbox is unchecked, it will be checked and the assignee's ID will be added to the selectedAssignees array.
 * If the checkbox is already checked, it will be unchecked and the assignee's ID will be removed.
 *
 * @param {number} i - The index of the assignee in the `assignees` array.
 */
function selectAssigneesForEditTask(i) {
  let selectedAssignee = assignees[i];
  let checkbox = document.getElementById(`input-checkbox-assignees-edit-task${i}`);
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
 * Hides the error message shown when trying to add an invalid subtask title.
 *
 * @param {HTMLElement} errorAdviceElement - The DOM element displaying the error message.
 */
function hideErrorOfAddingSubtaskInTheSubtaskList(errorAdviceElement) {
  setTimeout(() => {
    errorAdviceElement.innerText = "";
  }, 3000)
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
    await postTheNewCreatedTask(newTask, event);
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
  let due_date = document.getElementById('date').value == "" ? null : document.getElementById('date').value;
  priority = choosedPriority || "low";
  category = choosedCategory;
  state = checkState();
  contacts_ids = selectedAssignees;
  let newTask = new Task(title.value, description.value, category, due_date, priority, contacts_ids, state);
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
async function postTheNewCreatedTask(newTask, event) {
  try {
    let taskResponse = await fetch(tasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${loggedUser.token}`
      },
      body: JSON.stringify(newTask)
    });
    await checkResponseThenCreateTaskOrThrowErrors(event, taskResponse)
  } catch (e) {
    showFailedTaskCreationAdvice(e);
  }
}

/**
 * Handles the response from a task creation request.
 * If the response is successful, it retrieves the task data and posts a subtask,
 * then displays a success message. If there are errors, it shows error messages accordingly.
 *
 * @async
 * @function
 * @param {Event} event - The event triggered by the task creation process.
 * @param {Response} taskResponse - The fetch API response object from the task creation request.
 * @throws Will not explicitly throw an error, but may call functions that update the UI to indicate failure.
 */
async function checkResponseThenCreateTaskOrThrowErrors(event, taskResponse) {
  let taskData = await taskResponse.json();
  if (taskData.ok == true) {
    if (subtasksList.length > 0) {
      await getTaskDataAndPostSubtask(event, taskData);
    } else {
      await showSuccessfullTaskCreationAdvice(event, taskData.message)
      clearAddTaskValues();
    }
  } else if (taskData.ok == false) {
    showErrorsOfTaskCreationAdvices(taskData.data)
  } else if (taskData.detail) {
    showPermissionErrorTaskCreation(taskData.detail)
  }
}

function showPermissionErrorTaskCreation(permissionError) {
  let requiredFieldAdviceContainer;
  if (window.location.href == "http://127.0.0.1:5500/addTask.html") {
    requiredFieldAdviceContainer = document.getElementById('required-fields-advice');
  } else if (window.location.href == "http://127.0.0.1:5500/board.html") {
    requiredFieldAdviceContainer = document.getElementById('required-fields-advice-board');
  }
  requiredFieldAdviceContainer.innerText = permissionError
  setTimeout(() => {
    requiredFieldAdviceContainer.innerText = "";
  }, 3000)
}

/**
 * Displays error messages related to the task creation process.
 * Updates the DOM to show validation errors for the title and due date fields.
 *
 * @function
 * @param {Object} response - The response object containing error messages.
 * @param {Object} response.data - An object containing specific error messages.
 * @param {string} [response.data.title] - Error message related to the task title, if any.
 * @param {string} [response.data.due_date] - Error message related to the task due date, if any.
 */
function showErrorsOfTaskCreationAdvices(taskData) {
  if (taskData.title) {
    document.getElementById('title-error-advice').innerText = taskData.title;
  } else {
    document.getElementById('title-error-advice').innerText = ""
  }
  if (taskData.due_date) {
    document.getElementById('due-date-error-advice').innerText = taskData.due_date;
  } else {
    document.getElementById('due-date-error-advice').innerText = ""
  }
  setTimeout(hideErrorOfTaskCreation, 5000)
}

/**
 * Hides all error messages related to task creation.
 * 
 * This function selects all elements with the class 'error-advice-addTask',
 * converts the HTMLCollection to an array, and clears their inner text,
 * effectively hiding any visible error messages.
 */
function hideErrorOfTaskCreation() {
  let errorAdvices = document.getElementsByClassName('error-advice-addTask');
  let errorAdvicesToArray = [...errorAdvices]
  errorAdvicesToArray.forEach(error => {
    error.innerText = "";
  })
}

/**
 * Displays a visual confirmation that a task has been successfully created.
 * If the current page is 'board.html', it reloads the task list and closes the task overview.
 * Then, it shows a success message for 2 seconds.
 *
 * @param {Event} event - The event triggered when the task is created, used to close the task overview.
 */
async function showSuccessfullTaskCreationAdvice(event, message) {
  if (window.location.href == 'http://127.0.0.1:5500/board.html') {
    await loadTasks();
    closeAddTaskOverview(event);
    document.getElementById('task-created-advice-container-board').classList.remove('d-none');
    document.getElementById('task-created-advice-board').innerText = message;
    setTimeout(() => {
      document.getElementById('task-created-advice-container-board').classList.add('d-none');
    }, 2000)
  } else {
    document.getElementById('task-created-advice-container').classList.remove('d-none');
    document.getElementById('task-created-advice').innerText = message;
    setTimeout(() => {
      document.getElementById('task-created-advice-container').classList.add('d-none');
    }, 2000)
  }
}

/**
 * Displays an error message in the UI when task creation fails.
 * Updates the appropriate advice element
 * depending on the current page.
 *
 * @param {any} e - The error object or message to be logged and used for debugging.
 */
function showFailedTaskCreationAdvice(e) {
  if (window.location.href == 'http://127.0.0.1:5500/board.html') {
    document.getElementById('task-created-advice-board').innerText = 'Task not created, a problem occurred';
  } else {
    document.getElementById('task-created-advice').innerText = 'Task not created, a problem occurred';
  }
}

/**
 * Clear the values of the task form and reset task-related states.
 */
function clearAddTaskValues() {
  title.value = "";
  description.value = "";
  document.getElementById('date').value = "";
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