/**
 * Fetches task data from the server.
 * @async
 */
async function getTaskData() {
    let response = await fetch(tasksUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        }
    })
    if (response.ok) {
        let fetchedTasks = await response.json();
        tasks = fetchedTasks;
    } else {
        console.log('error');
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
        if (!response.ok) {
            let updateData = await response.json();
            showTaskActionFailedAdvice(updateData.detail);
        } else {
            await loadTasks();
            document.getElementById('opacity-single-task-container').classList.add('d-none');
        }
    } catch (e) {
        console.log(e);
    }
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
    loadSubtasksInTheEditTaskOverview(subtasks, taskId);
}

/**
 * Creates a new subtask and fetches it for editing.
 * @async
 * @param {Object} newSubtask - The new subtask data.
 */
async function postAndTheGetNewSubtaskEditTask(newSubtask) {
    let response = await fetch(subtasksUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(newSubtask)
    })
    let fetchedSubtask = await response.json();
    let taskId = fetchedSubtask.task;
    getSubtaskForEditTask(taskId);
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
        getSubtaskForEditTask(taskId);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates the title of a subtask.
 * @async
 * @param {string} id - The ID of the subtask to update.
 * @param {Object} editedSubtask - The edited subtask data.
 */
async function updateEditedTitle(id, editedSubtask) {
    let response = await fetch(subtasksUrl + `${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(editedSubtask)
    })
    let subtasksData = await response.json();
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
async function deleteTaskData(singleTaskUrl) {
    let response = await fetch(singleTaskUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${loggedUser.token}`
        }
    })
    if (!response.ok) {
        let deleteData = await response.json();
        showDeleteTaskFailedAdvice(deleteData.detail);
    } else {
        await loadTasks();
        document.getElementById('opacity-single-task-container').classList.add('d-none');
    }
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
function showDeleteTaskFailedAdvice(data) {
    let deleteTaskAdvice = document.getElementById('delete-task-advice');
    deleteTaskAdvice.innerHTML = `${data}`;
    setTimeout(() => {
        deleteTaskAdvice.innerHTML = "";
    }, 2000);
}