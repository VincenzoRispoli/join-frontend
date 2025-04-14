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
 * @param {HTMLElement} inProgressContainer - The container for In-Progress tasks.
 * @param {Array} inProgress - The list of In-Progress tasks.
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
 * @param {HTMLElement} awaitFeedbackContainer - The container for Await Feedback tasks.
 * @param {Array} awaitFeedback - The list of Await Feedback tasks.
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
 * @param {HTMLElement} doneContainer - The container for Done tasks.
 * @param {Array} dones - The list of Done tasks.
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
 * @param {number} i - The index of the task card.
 * @param {Object} task - The task object containing assignees.
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
 * @param {number} id - The ID of the task being edited.
 */
function showDropDownAssigneesEditTask(id) {
    if (dropDownMenuClosed) {
        let allAssigneeContainer = document.getElementById(`all-assignee-task-edit-container-${id}`);
        setTimeout(() => {
            allAssigneeContainer.style.height = 'auto';
        }, 10);
        dropDownMenuClosed = false;
    } else {
        let allAssigneeContainer = document.getElementById(`all-assignee-task-edit-container-${id}`);
        setTimeout(() => {
            allAssigneeContainer.style.height = 0;
        }, 10);
        dropDownMenuClosed = true;
    }
}

/**
 * Sends an edited task to be updated.
 * @param {number} id - The ID of the task to edit.
 * @param {string} state - The current state of the task.
 * @param {string} category - The category of the task.
 * @returns {Promise<void>} - A promise that resolves once the task is updated.
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
 * @param {number} id - The ID of the task to edit.
 * @param {string} state - The current state of the task.
 * @param {string} category - The category of the task.
 * @returns {Task} - A new Task object with the edited details.
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
 * Loads the date of a task into the edit form.
 * @param {string} date - The due date of the task.
 * @param {number} id - The ID of the task.
 */
function loadDateInEditTask(date, id) {
    document.getElementById(`date${id}`).value = date;
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
function loadSubtasksInTheEditTaskOverview(subtasks, taskId) {
    let subtasksListEditTask = document.getElementById(`subtask-list-edit-task-${taskId}`);
    subtasksListEditTask.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        subtasksListEditTask.innerHTML += subtaskForEditTaskOverview(i, taskId, subtask);
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
    let subtaskTitle = document.getElementById(`input-subtask-edit-task${id}`);
    if (subtaskTitle.value.length > 0) {
        let newSubtask = new Subtask(subtaskTitle.value);
        newSubtask.task_id = id
        try {
            await postAndTheGetNewSubtaskEditTask(newSubtask);
            clearAddSubtaskInputEdit(id, event);
        } catch (e) {
            console.log(e);
        }
    } else {
        clearAddSubtaskInputEdit(id, event);
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
        await updateEditedTitle(id, editedSubtask);
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
 * Deletes a task from the database.
 * 
 * @param {number} id - The ID of the task to be deleted.
 */
async function deleteTask(id) {
    let singleTaskUrl = tasksUrl + `${id}/`;
    try {
        await deleteTaskData(singleTaskUrl);
    } catch (e) {
        console.error(e);
    }
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