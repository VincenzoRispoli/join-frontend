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
            await loadTasks()
            document.getElementById('opacity-single-task-container').classList.add('d-none')
        }
    } catch (e) {
        console.log(e);
    }
}

async function updateTaskState(movedTask, singleTaskUrl) {
    let contactsIds = movedTask.contacts.map(contact => contact.id)
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
        let updateTaskData = await response.json()
        showTaskDragUpdateFailedAdvice(updateTaskData.detail)
    } else {
        loadTasks();
    }
}

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
    loadSubtasksInTheCardOverview(taskId, taskRelatedSubtaskList)
}

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
    let taskId = fetchedSubtask.task
    getSubtaskForEditTask(taskId)
}

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
        getSubtaskForEditTask(taskId)
    } catch (e) {
        console.log(e);
    }
}

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
        document.getElementById('opacity-single-task-container').classList.add('d-none')
    }
}

function showDeleteTaskFailedAdvice(data) {
    let deleteTaskAdvice = document.getElementById('delete-task-advice');
    deleteTaskAdvice.innerHTML = `${data}`
    setTimeout(() => {
        deleteTaskAdvice.innerHTML = "";
    }, 2000)
}