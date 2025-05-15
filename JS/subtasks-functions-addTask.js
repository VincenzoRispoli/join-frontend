/**
 * Prepares the UI for adding a subtask by displaying additional input options.
 */
function writeSubtask() {
  if (window.location.href == 'http://127.0.0.1:5500/addTask.html') {
    document.getElementById('cross-and-check-icons-container').classList.remove('d-none');
    document.getElementById('add-icon').classList.add('d-none');
    document.getElementById('input-subtask').focus();
  } else if (window.location.href == 'http://127.0.0.1:5500/board.html') {
    document.getElementById('cross-and-check-icons-container-board').classList.remove('d-none');
    document.getElementById('add-icon-board').classList.add('d-none');
    document.getElementById('input-subtask-board').focus();
  }
}

/**
 * Clears the input field for adding a subtask and resets the UI.
 * @param {Event} event - The event triggered by the action.
 */
function clearAddSubtaskInput(event) {
  event.stopPropagation();
  if (window.location.href == 'http://127.0.0.1:5500/addTask.html') {
    document.getElementById('input-subtask').value = "";
    document.getElementById('add-icon').classList.remove('d-none');
    document.getElementById('cross-and-check-icons-container').classList.add('d-none');
  } else if (window.location.href == 'http://127.0.0.1:5500/board.html') {
    document.getElementById('input-subtask-board').value = "";
    document.getElementById('add-icon-board').classList.remove('d-none');
    document.getElementById('cross-and-check-icons-container-board').classList.add('d-none');
  }
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
  let subtaskTitle;
  let errorAdviceElement;
  if (window.location.href == 'http://127.0.0.1:5500/addTask.html') {
    subtaskTitle = document.getElementById('input-subtask');
    errorAdviceElement = document.getElementById('error-advice-subtask-add-task');
  } else if (window.location.href == 'http://127.0.0.1:5500/board.html') {
    subtaskTitle = document.getElementById('input-subtask-board');
    errorAdviceElement = document.getElementById('error-advice-subtask-add-task-board');
  }
  addSubtaskToSubtaskListOrThrowError(event, subtaskTitle, errorAdviceElement);
  hideErrorOfAddingSubtaskInTheSubtaskList(errorAdviceElement);
}

/**
 * Adds a subtask to the subtasks list if the title meets the required length.
 * If not, displays an error message.
 *
 * @param {Event} event - The event triggered by user interaction (e.g., form submission).
 * @param {HTMLInputElement} subtaskTitle - The input element containing the subtask title.
 * @param {HTMLElement} errorAdviceElement - The DOM element used to display error messages.
 */
function addSubtaskToSubtaskListOrThrowError(event, subtaskTitle, errorAdviceElement) {
  if (subtaskTitle.value.length >= 3) {
    let subtaskListContainer = document.getElementById('subtask-list');
    let newSubtask = new Subtask(subtaskTitle.value, false);
    subtasksList.push(newSubtask);
    subtaskListContainer.innerHTML = '';
    loadCreatedSubtasksInTheListContainer(subtasksList, subtaskListContainer);
    clearAddSubtaskInput(event);
  } else {
    errorAdviceElement.innerText = 'Please the subtask must have at least 3 characters.'
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
 * Deletes a subtask from the subtasks list at the specified index
 * and updates the DOM to reflect the change.
 *
 * @param {number} i - The index of the subtask to be removed from the list.
 */
function deleteSubtaskFromSubtaskListAddtask(i) {
  subtasksList.splice(i, 1);
  let subtaskListContainer = document.getElementById('subtask-list');
  subtaskListContainer.innerHTML = "";
  for (let i = 0; i < subtasksList.length; i++) {
    let subtask = subtasksList[i]
    subtaskListContainer.innerHTML += subtaskHTML(i, subtask)
  }
}

/**
 * Displays the delete (bin) icon for a subtask input field in the Add Task section.
 *
 * @param {number} i - The index of the subtask whose bin icon should be shown.
 */
function showBinIconSubtaskAddTask(i) {
  document.getElementById(`delete-icon-add-task${i}`).classList.remove('d-none')
}

/**
 * Hides the delete (bin) icon for a subtask input field in the Add Task section.
 *
 * @param {number} i - The index of the subtask whose bin icon should be hidden.
 */
function removeBinIconSubtaskAddTask(i) {
  document.getElementById(`delete-icon-add-task${i}`).classList.add('d-none')
}

/**
 * Retrieve task data from the response and send the subtasks to the backend.
 * @param {Response} taskResponse - The response object from the task creation.
 */
async function getTaskDataAndPostSubtask(event, taskData) {
  try {
    await sendSubtasksToBackend(event, taskData);
  } catch (e) {
    console.log(e);
  }
}

/**
 * Send the subtasks to the backend.
 * @param {Object} taskData - The task data containing the task ID.
 */
async function sendSubtasksToBackend(event, taskData) {
  for (let subtask of subtasksList) {
    subtask.task_id = taskData.data.id;
    let response = await fetch(subtasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${loggedUser.token}`
      },
      body: JSON.stringify(subtask)
    });
    await checkTheResponseAndThrowSuccessOrFailAdvices(event, response, taskData);
  }
}

/**
 * Handles the response from a subtask creation request and displays the appropriate success or error message.
 *
 * If the response indicates success (`ok == true`), it shows a success message, clears the input values,
 * and resets the subtasks list. If the response indicates failure (`ok == false`), it displays the error message.
 *
 * @param {Event} event - The event object triggered by the user action (e.g., form submission or button click).
 * @param {Response} response - The response object returned from the fetch API containing the server's reply.
 */
async function checkTheResponseAndThrowSuccessOrFailAdvices(event, response, taskData) {
  let subtaskData = await response.json();
  if (subtaskData.ok == true) {
    await showSuccessfullTaskCreationAdvice(event, taskData.message)
    clearAddTaskValues();
    getAndClearSubtasksHTMLListAfterSend();
  } else if (subtaskData.ok == false) {
    showErrorOfSubtaskCreation(subtaskData.error);
  }
}

/**
 * Displays an error message related to subtask creation based on the current page URL.
 *
 * If the current URL matches the board page, the error message is displayed
 * in the element with ID 'task-created-advice-board'. Otherwise, it is shown
 * in the element with ID 'task-created-advice'.
 *
 * @param {string} subtaskError - The error message to display for the subtask creation process.
 */
function showErrorOfSubtaskCreation(subtaskError) {
  if (window.location.href == 'http://127.0.0.1:5500/board.html') {
    document.getElementById('task-created-advice-board').innerText = subtaskError;
  } else {
    document.getElementById('task-created-advice').innerText = subtaskError;
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