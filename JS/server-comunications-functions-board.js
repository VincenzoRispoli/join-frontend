/**
 * Fetches task data from the server.
 * @async
 */
async function getTaskData() {
    try {
        let response = await fetch(tasksUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${loggedUser.token}`
            }
        })
        let taskData = await response.json();
        tasks = taskData;
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates a task with new data.
 * @async
 * @param {string} id - The ID of the task to update.
 * @param {Object} newEditedTask - The new task data to update.
 */
async function updateTheNewEditedTask(id, newEditedTask) {
    try {
        let response = await fetch(tasksUrl + `${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${loggedUser.token}`
            },
            body: JSON.stringify(newEditedTask)
        })
        let editedTaskData = await response.json();
        if (editedTaskData.ok == true) {
            showTaskSuccessEditedAdvice(id, editedTaskData.message);
        } else {
            showTaskActionFailedAdvice(id, editedTaskData.error, editedTaskData.data);
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Displays a temporary success message in the UI after a task has been successfully edited.
 * Reloads the tasks and hides the single task view after 2 seconds.
 */
function showTaskSuccessEditedAdvice(id, successMessage) {
    document.getElementById(`advice-container-edit-task${id}`).classList.remove('d-none');
    document.getElementById(`advice-container-edit-task${id}`).innerText = successMessage;
    setTimeout(() => {
        loadTasks();
        document.getElementById('opacity-single-task-container').classList.add('d-none');
        document.getElementById(`advice-container-edit-task${id}`).classList.add('d-none')
        document.getElementById(`advice-container-edit-task${id}`).innerText = "";
    }, 2000)
}

/**
 * Updates the state of a task after it is moved.
 * @async
 * @param {Object} movedTask - The task object with updated state.
 * @param {string} singleTaskUrl - The URL of the task to update.
 */
async function updateTaskState(movedTask, singleTaskUrl) {
    let contactsIds = movedTask.contacts.map(contact => contact.id);
    movedTask.contacts_ids = contactsIds;
    let response = await fetch(singleTaskUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(movedTask)
    })
    if (!response.ok) {
        let updateTaskData = await response.json();
        showTaskDragUpdateFailedAdvice(updateTaskData.detail);
    } else {
        loadTasks();
    }
}

/**
 * Fetches the subtasks related to a task.
 * @async
 * @param {string} taskId - The ID of the task to fetch subtasks for.
 */
async function getSubtasksData(taskId) {
    let response = await fetch(subtasksUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
    })
    let subtasksDataFetched = await response.json();
    taskRelatedSubtaskList = subtasksDataFetched.filter(s => s.task == taskId);
    loadSubtasksInTheCardOverview(taskId, taskRelatedSubtaskList);
}

/**
 * Fetches subtasks data for editing a task.
 * @async
 * @param {string} taskId - The ID of the task to fetch subtasks for.
 */
async function getSubtasksDataForEditTask(taskId) {
    let response = await fetch(subtasksUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        }
    })
    let fetchedSubtasks = await response.json();
    let subtasks = fetchedSubtasks.filter(s => s.task == taskId);
    taskRelatedSubtaskList = subtasks
    loadSubtasksInTheEditTaskOverview(taskRelatedSubtaskList, taskId);
}

/**
 * Creates a new subtask and fetches it for editing.
 * @async
 * @param {Object} newSubtask - The new subtask data.
 */
async function postAndTheGetNewSubtaskEditTask(event, id, newSubtask) {
    let response = await fetch(subtasksUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(newSubtask)
    })
    let subtaskData = await response.json();
    if (subtaskData.ok == true) {
        clearAddSubtaskInputEdit(id, event);
        getSubtaskForEditTask(id);
    } else if (subtaskData.ok == false) {
        showErrorOfSubtaskCreationEditTask(subtaskData, id)
    }
}

function showErrorOfSubtaskCreationEditTask(subtaskData, taskId) {
    if (subtaskData.data.title) {
        document.getElementById(`error-advice-write-subtask-edit-task${taskId}`).style.color = 'red'
        document.getElementById(`error-advice-write-subtask-edit-task${taskId}`).innerText = subtaskData.data.title
        setTimeout(() => {
            document.getElementById(`error-advice-write-subtask-edit-task${taskId}`).innerText = ""
        }, 3000)
    }
}

/**
 * Deletes a subtask from the task being edited.
 * @async
 * @param {number} i - The index of the subtask in the list.
 * @param {string} taskId - The ID of the task to delete the subtask from.
 */
async function deleteSubtaskEditTask(i, taskId) {
    let subtask = taskRelatedSubtaskList[i];
    let id = subtask.id;
    try {
        let response = await fetch(subtasksUrl + `${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${loggedUser.token}`
            }
        })
        let subtaskData = await response.json();
        showErrorOrSuccessOfSubtaskDeleting(subtaskData, taskId)
    } catch (e) {
        console.log(e);
    }
}

function showErrorOrSuccessOfSubtaskDeleting(subtaskData, taskId) {
    if (subtaskData.ok == true) {
        document.getElementById('advice-container-edit-task').classList.remove('d-none');
        document.getElementById('advice-container-edit-task').innerHTML = subtaskData.message
    } else {
        document.getElementById('advice-container-edit-task').classList.remove('d-none');
        document.getElementById('advice-container-edit-task').innerHTML = 'Subtask not deleted, an error occurred'
    }
    setTimeout(() => {
        getSubtaskForEditTask(taskId);
        document.getElementById('advice-container-edit-task').innerHTML = "";
        document.getElementById('advice-container-edit-task').classList.add('d-none');
    }, 2000)
}

/**
 * Updates the title of a subtask.
 * @async
 * @param {string} id - The ID of the subtask to update.
 * @param {Object} editedSubtask - The edited subtask data.
 */
async function updateEditedTitle(i, id, editedSubtask) {
    let response = await fetch(subtasksUrl + `${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(editedSubtask)
    })
    let subtasksData = await response.json();
    showErrorOrSuccesUpdateForSubtask(i, subtasksData);
    setTimeout(hideErrorOrSuccessMessagesForSubtaskUpdate, 3000)
}

/**
 * Displays a success or error message based on the result of a subtask update.
 * The message is shown in the element corresponding to the given index `i`.
 *
 * @param {number} i - The index of the subtask used to target the specific message element.
 * @param {Object} subtasksData - The response object containing the result of the subtask update.
 * @param {boolean} subtasksData.ok - Indicates whether the update was successful.
 * @param {string} subtasksData.message - The success message to display when the update is successful.
 * @param {string} subtasksData.error - The error message to display when the update fails.
 */
function showErrorOrSuccesUpdateForSubtask(i, subtasksData) {
    if (subtasksData.ok == true) {
        document.getElementById(`error-advice-subtask-edit${i}`).innerText = subtasksData.message
        document.getElementById(`error-advice-subtask-edit${i}`).style.color = 'green'
    } else {
        document.getElementById(`error-advice-subtask-edit${i}`).innerText = subtasksData.error
        document.getElementById(`error-advice-subtask-edit${i}`).style.color = 'red'
    }
}

/**
 * Clears all success and error messages related to subtask updates.
 * Selects all elements with the class 'error-advice-subtask-edit' and resets their content.
 */
function hideErrorOrSuccessMessagesForSubtaskUpdate() {
    let subtasksUpdateAdvices = document.getElementsByClassName('error-advice-subtask-edit');
    let subtasksUpdateAdvicesToArray = [...subtasksUpdateAdvices];
    subtasksUpdateAdvicesToArray.forEach(advice => {
        advice.innerText = "";
    })
}

/**
 * Updates the completed status of a subtask.
 * @async
 * @param {string} id - The ID of the subtask to update.
 * @param {Object} selectedSubtask - The subtask object with updated status.
 */
async function updateCompletedStatusOfSubtask(id, selectedSubtask) {
    let response = await fetch(subtasksUrl + `${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(selectedSubtask)
    })
    let subtaskData = await response.json();
    await loadTasks();
}

/**
 * Deletes a task from the server.
 * @async
 * @param {string} singleTaskUrl - The URL of the task to delete.
 */
async function deleteTaskData(singleTaskUrl, id) {
    let response = await fetch(singleTaskUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        }
    })
    let deletedTaskData = await response.json();
    if (deletedTaskData.ok == true) {
        showSuccessTaskDeletedAdvice(deletedTaskData.message);
    } else {
        showDeleteTaskFailedAdvice(deletedTaskData.permission, id);
    }
}

/**
 * Displays a success message after a task has been deleted,
 * hides the single task view, reloads the task list, and 
 * shows a temporary confirmation message on the board.
 *
 * @param {string} successMessage - The message to be displayed as a confirmation of task deletion.
 */
function showSuccessTaskDeletedAdvice(successMessage) {
    loadTasks();
    document.getElementById('opacity-single-task-container').classList.add('d-none');
    document.getElementById('task-created-advice-container-board').classList.remove('d-none');
    document.getElementById('task-created-advice-board').innerText = successMessage
    setTimeout(() => {
        document.getElementById('task-created-advice-container-board').classList.add('d-none');
        document.getElementById('task-created-advice-board').innerText = ""
    }, 2000)
}

/**
 * Assigns a related subtask to a task and shows progress.
 * @async
 */
async function assignRelatedSubtaskToTask() {
    let response = await fetch(subtasksUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        }
    })
    let subtasksData = await response.json();
    showProgressBarAndCountInfos(subtasksData);
}

/**
 * Displays a message when the task deletion fails.
 * @param {Object} data - The error details of the failed task deletion.
 */
function showDeleteTaskFailedAdvice(permissionError, id) {
    let deleteTaskAdvice = document.getElementById(`delete-task-advice${id}`);
    deleteTaskAdvice.classList.remove('d-none');
    deleteTaskAdvice.innerHTML = permissionError;
    setTimeout(() => {
        deleteTaskAdvice.innerHTML = "";
        deleteTaskAdvice.classList.add('d-none');
    }, 2000);
}