/**
 * Assigns tasks to their corresponding containers on the board.
 */
function setTasksInRelatedContainer() {
    todoContainer = document.getElementById('todo');
    inProgressContainer = document.getElementById('in-progress');
    awaitFeedbackContainer = document.getElementById('await-feedback');
    doneContainer = document.getElementById('done');
    loadTodoContainer(todoContainer, todos);
    loadinProgressContainer(inProgressContainer, inProgress);
    loadAwaitFeedbackContainer(awaitFeedbackContainer, awaitFeedBack);
    loadDoneContainer(doneContainer, dones);
}

/**
 * Displays the create task overlay and initializes the assignees.
 * @param {string} state - The state of the task being created.
 */
function showCreateTaskOverview(state) {
    selectedAssignees = [];
    creationTaskState = state;
    let opacityAddTaskContainer = document.getElementById('opacity-add-task-container');
    opacityAddTaskContainer.classList.remove('d-none');
    loadAssignees();
    opacityAddTaskContainer.innerHTML = addTaskOverviewHTML();
}

/**
 * Resets the search input and reloads all tasks.
 */
function backToAllTask() {
    let searchInput;
    if (windowWidth <= 1110) {
        searchInput = document.getElementById('search-tasks-input-mobile');
        document.getElementById('cross-icon-search-input-mobile').classList.add('d-none');
    } else if (windowWidth > 1110) {
        searchInput = document.getElementById('search-tasks-input');
        document.getElementById('all-tasks-btn').classList.add('d-none');
    }
    searchInput.value = "";
    loadTasks();
}

/**
 * Loads and displays tasks in the To-Do container.
 * @param {HTMLElement} todoContainer - The container for To-Do tasks.
 * @param {Array} todos - The list of To-Do tasks.
 */
function loadTodoContainer(todoContainer, todos) {
    todoContainer.innerHTML = "";
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        todoContainer.innerHTML += taskCardHTML(todo, i);
        loadAssigneesInTheCard(i, todo);
        modifyCardCategory(i, todo.state);
    }
}

/**
 * Loads and displays tasks in the In-Progress container.
 */
function loadinProgressContainer(inProgressContainer, inProgress) {
    inProgressContainer.innerHTML = "";
    for (let i = 0; i < inProgress.length; i++) {
        let inProg = inProgress[i];
        inProgressContainer.innerHTML += taskCardHTML(inProg, i);
        loadAssigneesInTheCard(i, inProg);
        modifyCardCategory(i, inProg.state);
    }
}

/**
 * Loads and displays tasks in the Await Feedback container.
 */
function loadAwaitFeedbackContainer(awaitFeedbackContainer, awaitFeedback) {
    awaitFeedbackContainer.innerHTML = "";
    for (let i = 0; i < awaitFeedback.length; i++) {
        let awaitFeed = awaitFeedback[i];
        awaitFeedbackContainer.innerHTML += taskCardHTML(awaitFeed, i);
        loadAssigneesInTheCard(i, awaitFeed);
        modifyCardCategory(i, awaitFeed.state);
    }
}

/**
 * Loads and displays tasks in the Done container.
 */
function loadDoneContainer(doneContainer, dones) {
    doneContainer.innerHTML = "";
    for (let i = 0; i < dones.length; i++) {
        let done = dones[i];
        doneContainer.innerHTML += taskCardHTML(done, i);
        loadAssigneesInTheCard(i, done);
        modifyCardCategory(i, done.state);
    }
}

/**
 * Loads and displays the assignees inside a task card.
 */
function loadAssigneesInTheCard(i, task) {
    let assigneesContainer = document.getElementById(`assignees-container-${task.state}-of-task-card${i}`);
    assigneesContainer.innerHTML = "";
    for (let j = 0; j < task.contacts.length; j++) {
        let assignee = task.contacts[j];
        let capitalizedAssignee = assignee.first_name.charAt(0) + assignee.last_name.charAt(0);
        assigneesContainer.innerHTML += /*html*/ `
        <span style="background: ${assignee.badge_color}" class="assignee-badge" id="${task.state}-assignee${j}-of-task-card${i}">${capitalizedAssignee}</span>
        `;
    }
}

/**
 * Toggles the dropdown menu for selecting assignees when editing a task.
 */
function showDropDownAssigneesEditTask(id) {
    if (dropDownMenuClosed) {
        let allAssigneeContainer = document.getElementById(`all-assignee-task-edit-container-${id}`);
        setTimeout(() => {
            allAssigneeContainer.style.height = 'auto';
            allAssigneeContainer.style.border = '1px solid #D1D1D1'
        }, 10);
        dropDownMenuClosed = false;
    } else {
        let allAssigneeContainer = document.getElementById(`all-assignee-task-edit-container-${id}`);
        setTimeout(() => {
            allAssigneeContainer.style.height = 0;
            allAssigneeContainer.style.border = 'none'
        }, 10);
        dropDownMenuClosed = true;
    }
}

/**
 * Sends an edited task to be updated.
 */
async function sendEditedTask(id, state, category) {
    let newEditedTask = editAndCreateNewTask(id, state, category);
    try {
        await updateTheNewEditedTask(id, newEditedTask);
    } catch (e) {
        console.log(e);
    }
}

/**
 * Edits and creates a new task based on the given ID, state, and category.
 */
function editAndCreateNewTask(id, state, category) {
    loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    let editedTitle = document.getElementById(`task-title-edit${id}`).innerText;
    let editedDescription = document.getElementById(`task-description-edit${id}`).innerText;
    let editedDate = document.getElementById(`date${id}`);
    let editedAssignees = selectedAssignees;
    let newTask = new Task(editedTitle, editedDescription, category, editedDate.value, choosedPriorityEditTask, editedAssignees, state)
    return newTask
}

/**
 * Capitalizes the first letters of the words in the assignee's name.
 * @param {string} assignee - The assignee's name.
 * @returns {string} - A string containing the initials of the assignee.
 */
function capitalizeAssignee(assignee) {
    let parts = assignee.split(" ");
    let initials = parts.map(part => part.charAt(0).toUpperCase()).join("")
    return initials
}

/**
 * Modifies the category of a task card based on its type.
 * @param {number} i - The index of the task.
 * @param {string} taskType - The type of task.
 */
function modifyCardCategory(i, taskType) {
    let categoryTitle = document.getElementById(`task-category-${taskType}${i}`);
    if (categoryTitle.innerText == 'technical-task') {
        categoryTitle.style = 'background: #1FD7C1'
    } else {
        categoryTitle.style.background = '#0038FF'
    }
}

/**
 * Sets the color of the category title based on the task's category.
 * 
 * @param {Object} selectedTask - The task object whose category is used to determine the color.
 * @returns {string} The color to be applied to the category title.
 */
function setTheColorOfCategoryTitle(selectedTask) {
    if (selectedTask.category == 'technical-task') {
        return '#1FD7C1'
    } else {
        return '#0038FF'
    }
}

/**
 * Sets the icon for the priority button based on the task's priority.
 * 
 * @param {Object} selectedTask - The task object whose priority is used to determine the icon.
 * @returns {string} The filename of the icon to be used for the priority button.
 */
function setIconOfPriorityBtn(selectedTask) {
    if (selectedTask.priority == 'urgent') {
        return 'urgent.png'
    } else if (selectedTask.priority == 'medium') {
        return 'medium.png'
    } else {
        return 'low.png'
    }
}

/**
 * Loads the date of a task into the edit form.
 * @param {string} date - The due date of the task.
 * @param {number} id - The ID of the task.
 */
function loadDateInEditTask(date, id) {
    document.getElementById(`date${id}`).value = date;
}

/**
 * Loads subtasks into the task overview card.
 * 
 * @param {number} id - The ID of the task.
 * @param {Array} taskRelatedSubtaskList - The list of subtasks related to the task.
 */
function loadSubtasksInTheCardOverview(id, taskRelatedSubtaskList) {
    let subtaskList = document.getElementById(`subtask-list-${id}`);
    subtaskList.innerHTML = ""
    for (let i = 0; i < taskRelatedSubtaskList.length; i++) {
        let subtask = taskRelatedSubtaskList[i]
        if (subtask.is_completed == true) {
            subtaskList.innerHTML += subtaskForTaskOverviewHTMLChecked(i, id, subtask);
        } else {
            subtaskList.innerHTML += subtaskForTaskOverviewHTMLNoChecked(i, id, subtask);
        }
    }
}

/**
 * Loads subtasks into the task edit overview.
 * 
 * @param {Array} subtasks - The list of subtasks to be loaded.
 * @param {number} taskId - The ID of the task being edited.
 */
function loadSubtasksInTheEditTaskOverview(taskRelatedSubtaskList, taskId) {
    let subtasksListEditTask = document.getElementById(`subtask-list-edit-task-${taskId}`);
    subtasksListEditTask.innerHTML = "";
    for (let i = 0; i < taskRelatedSubtaskList.length; i++) {
        let subtask = taskRelatedSubtaskList[i];
        subtasksListEditTask.innerHTML += subtaskForEditTaskOverview(i, taskId, subtask);
    }
    loadTasks();
}

/**
 * Displays an error message when a task action fails.
 * 
 * @param {string} data - The error message to be displayed.
 */
function showTaskActionFailedAdvice(data) {
    let adviceContainer = document.getElementById('advice-container');
    adviceContainer.innerHTML = /*html*/ `
    <span id="update-task-failed" style="color:white">${data}</span>
   `
    setTimeout(() => {
        adviceContainer.innerHTML = "";
    }, 3000)
}

/**
 * Displays an error message when a task drag action fails.
 * 
 * @param {string} data - The error message to be displayed.
 */
function showTaskDragUpdateFailedAdvice(data) {
    let popUpContainer = document.getElementById('opacity-single-task-container');
    popUpContainer.classList.remove('d-none');
    popUpContainer.innerHTML = /*html*/  `
    <div class="pop-up-task-drag-failed-advice">${data}</div>
    `
    setTimeout(() => {
        popUpContainer.classList.add('d-none');
        popUpContainer.innerHTML = "";
    }, 3000)
}

/**
 * Closes the task overview when the close action is triggered.
 * 
 * @param {Event} event - The event that triggered the close action.
 */
function closeTaskOverview(event) {
    event.stopPropagation();
    document.getElementById('opacity-single-task-container').classList.add('d-none');
}

/**
 * Closes the add task overview when the close action is triggered.
 * 
 * @param {Event} event - The event that triggered the close action.
 */
function closeAddTaskOverview(event) {
    event.stopPropagation();
    document.getElementById('opacity-add-task-container').classList.add('d-none');
    subtasksList = [];
}

/**
 * Displays the task drag options on mobile.
 * 
 * @param {number} taskId - The ID of the task to be dragged.
 * @param {Event} event - The event that triggered the function.
 */
function showPopUpDragTaskMobile(taskId, event) {
    event.stopPropagation();
    let index = tasks.findIndex(t => t.id == taskId);
    if (index != -1) {
        selectedTaskToDragMobile = tasks[index];
    }
    document.getElementById('drag-tasks-mobile-container').classList.remove('d-none');
    iterateTheMobileStatesInTheMobileOptionsContainer();
}

/**
 * Iterates through the mobile states and generates the task drag options.
 */
function iterateTheMobileStatesInTheMobileOptionsContainer() {
    let dragOptionMobile = document.getElementById('drag-tasks-mobile-options');
    dragOptionMobile.innerHTML = "";
    mobileStates.forEach(ms => {
        if (selectedTaskToDragMobile.state != ms["technical-state"]) {
            dragOptionMobile.innerHTML += /*html*/ `
            <span onclick="dragTaskMobile('${ms['technical-state']}')" class="drag-task-mobile-option">${ms.state}</span>
            `
        };
    });
}