/**
 * Edits a task by loading the edit form with the current task details.
 * @param {number} id - The ID of the task to edit.
 * @returns {Promise<void>} - A promise that resolves once the edit form is displayed.
 */
async function editTask(id) {
    selectedAssignees = [];
    let findIndexOfSelectedTask = tasks.findIndex(task => task.id == id);
    let selectedTask = tasks[findIndexOfSelectedTask];
    let opacitySingleTaskContainer = document.getElementById('opacity-single-task-container');
    opacitySingleTaskContainer.innerHTML = editTaskHTML(id, selectedTask);
    loadDateInEditTask(selectedTask.due_date, id);
    await loadAssigneedContactsListToEditTask(id, selectedTask)
    await loadAllAssigneesFromDataBase(id, selectedTask.contacts);
    highlightPriorityBtn(selectedTask);
    await getSubtaskForEditTask(id)
}

/**
 * Edits the priority of a task and updates the button highlight.
 * @param {string} prio - The priority level to set.
 * @param {Event} event - The event object triggered by the button click.
 */
function editPriority(prio, event) {
    choosedPriorityEditTask = prio;
    highlightBtnOnClick(prio.toLowerCase());
    event.stopPropagation();
}

/**
 * Displays the details of a selected task in a modal.
 * @param {number} id - The ID of the task to display.
 * @returns {Promise<void>} - A promise that resolves once the task details are shown.
 */
async function showTask(id) {
    let selectedTaskIndex = tasks.findIndex(task => task.id == id);
    let selectedTask = tasks[selectedTaskIndex];
    let categoryTitleColor = setTheColorOfCategoryTitle(selectedTask);
    let priorityIcon = setIconOfPriorityBtn(selectedTask);
    let opacityContainer = document.getElementById('opacity-single-task-container');
    opacityContainer.innerHTML = taskCardOverviewHTML(id, selectedTask, categoryTitleColor, priorityIcon);
    loadAssigneeList(id, selectedTask);
    await getSubtasks(id);
    document.getElementById('opacity-single-task-container').classList.remove('d-none');
}

/**
 * Loads the list of assigned contacts for a task into the edit form.
 * @param {number} id - The ID of the task.
 * @param {Task} selectedTask - The task object to get the assignees from.
 * @returns {Promise<void>} - A promise that resolves once the assignees are loaded.
 */
async function loadAssigneedContactsListToEditTask(id, selectedTask) {
    let assigneeListEditTask = document.getElementById(`task-assignedTo-list-edit-task-${id}`);
    assigneeListEditTask.innerHTML = "";
    for (let i = 0; i < selectedTask.contacts.length; i++) {
        let contact = selectedTask.contacts[i]
        assigneeListEditTask.innerHTML += `
         <span id="assignee-edit-task-${id}-${i}" style="background: ${contact.badge_color}" class="contact-badge-task-overview">${contact.first_name.charAt(0).toUpperCase()}${contact.last_name.charAt(0).toUpperCase()}</span>
        `
    }
}

/**
 * Loads all assignees from the database and updates the assignee list for the task edit form.
 * @param {number} id - The ID of the task.
 * @param {Array} contacts - The list of contacts currently assigned to the task.
 * @returns {Promise<void>} - A promise that resolves once the assignees are loaded.
 */
async function loadAllAssigneesFromDataBase(id, contacts) {
    let response = await fetch(contactsUrl);
    assignees = await response.json();
    let allAssigneesEditTaskContainer = document.getElementById(`all-assignee-task-edit-container-${id}`);
    allAssigneesEditTaskContainer.innerHTML = "";
    for (let j = 0; j < assignees.length; j++) {
        let assignee = assignees[j];
        let isAssigned = contacts.some(contact => contact.id == assignee.id);
        if (isAssigned) {
            selectedAssignees.push(assignee.id);
            allAssigneesEditTaskContainer.innerHTML += assigneeCheckedHTML(j, assignee)
        } else {
            allAssigneesEditTaskContainer.innerHTML += assigneeNoCheckedHTML(j, assignee);
        }
    }
}

/**
 * Retrieves the subtasks of a task.
 * 
 * @param {number} taskId - The ID of the task whose subtasks are being fetched.
 */
async function getSubtasks(taskId) {
    try {
        await getSubtasksData(taskId)
    } catch (e) {
        console.log(e);
    }
}

/**
 * Retrieves the subtasks of a task for editing purposes.
 * 
 * @param {number} taskId - The ID of the task whose subtasks are being fetched for editing.
 */
async function getSubtaskForEditTask(taskId) {
    try {
        getSubtasksDataForEditTask(taskId);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Allows editing of a subtask in the task overview.
 * 
 * @param {number} i - The index of the subtask being edited.
 */
function editSubtaskEditOverview(i, event) {
    event.stopPropagation();
    actualValueInputEditSubtask = document.getElementById(`subtask-edit-task-overview${i}`).innerText;
    subtaskIsClicked = true;
    let listItem = document.getElementById(`subtask-edit-task-overview${i}`);
    listItem.setAttribute("contenteditable", "true");
    listItem.focus();
    document.getElementById(`pencil-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`check-icon-edit${i}`).classList.remove('d-none');
}

/**
 * Disables content editing for a subtask.
 * 
 * @param {number} i - The index of the subtask being edited.
 */
function confirmContentEditingSubtask(i, event) {
    event.stopPropagation();
    let listItem = document.getElementById(`subtask-edit-task-overview${i}`);
    listItem.setAttribute("contenteditable", "false");
    document.getElementById(`subtask-edit-task-overview-container${i}`).style.background = 'none';
    document.getElementById(`pencil-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`delete-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`check-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`icon-separator-edit-subtask${i}`).classList.add('d-none');
    subtaskIsClicked = false;
}

/**
 * Adds a new subtask to the edit task.
 * 
 * @param {number} id - The ID of the task to which the subtask is being added.
 * @param {Event} event - The event that triggered the function call.
 */
async function addSubtaskEditTask(id, event) {
    event.stopPropagation();
    let subtaskTitle = document.getElementById(`input-subtask-edit-task${id}`);
    let newSubtask = new Subtask(subtaskTitle.value);
    newSubtask.task_id = id
    try {
        await postAndTheGetNewSubtaskEditTask(event, id, newSubtask);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates the title of a subtask related to a task.
 * 
 * @param {number} i - The index of the subtask being edited.
 * @param {number} taskId - The ID of the task to which the subtask belongs.
 */
async function updateTitleTaskRelatedSubtask(i, taskId, event) {
    confirmContentEditingSubtask(i, event)
    let editedSubtask = taskRelatedSubtaskList[i];
    let id = editedSubtask.id
    editedSubtask.task_id = taskId
    editedSubtask.title = document.getElementById(`subtask-edit-task-overview${i}`).innerText;
    try {
        await updateEditedTitle(i, id, editedSubtask);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Updates the completion status of a subtask related to a task.
 * 
 * @param {number} i - The index of the subtask being updated.
 * @param {number} taskId - The ID of the task to which the subtask belongs.
 * @param {HTMLInputElement} checkbox - The checkbox element indicating the completion status.
 */
async function updateTaskRelatedSubtask(i, taskId, checkbox) {
    let selectedSubtask = taskRelatedSubtaskList[i];
    selectedSubtask.task_id = taskId
    let id = selectedSubtask.id
    if (checkbox && checkbox.checked) {
        selectedSubtask.is_completed = true;
    } else if (checkbox) {
        selectedSubtask.is_completed = false;
    }
    try {
        updateCompletedStatusOfSubtask(id, selectedSubtask)
    } catch (e) {
        console.log(e);
    }
}

/**
 * Clears the input field used for adding a new subtask.
 * 
 * @param {number} id - The ID of the task for which the subtask is being added.
 */
function clearInputAddSubtask(id) {
    document.getElementById(`input-subtask-edit-task${id}`).value = "";
}

/**
 * Deletes a task from the database.
 * 
 * @param {number} id - The ID of the task to be deleted.
 */
async function deleteTask(id) {
    let singleTaskUrl = tasksUrl + `${id}/`;
    try {
        await deleteTaskData(singleTaskUrl, id);
    } catch (e) {
        console.error(e);
    }
}