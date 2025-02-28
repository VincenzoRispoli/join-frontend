let tasks = [];
let cardContainer;
let currentDraggedCard;
let todos;
let inProgress;
let awaitFeedBack;
let dones;
let todoContainer;
let inProgressContainer;
let awaitFeedbackContainer;
let doneContainer;
let tasksUrl = 'http://127.0.0.1:8000/kanban/tasks/';
let taskRelatedSubtaskList = [];
let dropDownMenuClosed = true;
let choosedPriorityEditTask;
let priorityType;
let subtaskIsClicked = false;
let actualValueInputEditSubtask;

async function initBoard() {
    authenticated = JSON.parse(localStorage.getItem('authenticated'))
    if (authenticated) {
        await getLoggedUser();
        await loadTasks()
    } else {
        window.location.href = 'login.html'
    }
}

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
    }
    setInitialsCurrentUserInTheHeader(loggedUser);
}

function searchTasks() {
    let searchText = document.getElementById('search-tasks-input');
    if (searchText && searchText.value.length > 0) {
        let matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(searchText.value.toLowerCase()))
        tasks = matchedTasks;
        console.log(tasks);
        document.getElementById('all-tasks-btn').classList.remove('d-none')
    }
}

function divideTaskByCategory() {
    todos = tasks.filter(t => t['state'] == 'todo');
    inProgress = tasks.filter(t => t['state'] == 'in-progress');
    awaitFeedBack = tasks.filter(t => t['state'] == 'await-feedback');
    dones = tasks.filter(t => t['state'] == 'done');
}

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

async function getLoggedUser() {
    loggedUser = JSON.parse(localStorage.getItem('currentUser'));
}

function showCreateTaskOverview() {
    let opacityAddTaskContainer = document.getElementById('opacity-add-task-container');
    opacityAddTaskContainer.classList.remove('d-none');
    loadAssignees();
    opacityAddTaskContainer.innerHTML = addTaskOverviewHTML();
}

function backToAllTask() {
    document.getElementById('search-tasks-input').value = "";
    loadTasks();
    document.getElementById('all-tasks-btn').classList.add('d-none');
}


function loadTodoContainer(todoContainer, todos) {
    todoContainer.innerHTML = "";
    for (let i = 0; i < todos.length; i++) {
        let todo = todos[i];
        todoContainer.innerHTML += taskCardHTML(todo, i)
        loadAssigneesInTheCard(i, todo);
        modifyCardCategory(i, todo.state);
    }
}

function loadinProgressContainer(inProgressContainer, inProgress) {
    inProgressContainer.innerHTML = "";
    for (let i = 0; i < inProgress.length; i++) {
        let inProg = inProgress[i];
        inProgressContainer.innerHTML += taskCardHTML(inProg, i)
        loadAssigneesInTheCard(i, inProg);
        modifyCardCategory(i, inProg.state);
    }
}

function loadAwaitFeedbackContainer(awaitFeedbackContainer, awaitFeedback) {
    awaitFeedbackContainer.innerHTML = "";
    for (let i = 0; i < awaitFeedback.length; i++) {
        let awaitFeed = awaitFeedback[i];
        awaitFeedbackContainer.innerHTML += taskCardHTML(awaitFeed, i)
        loadAssigneesInTheCard(i, awaitFeed);
        modifyCardCategory(i, awaitFeed.state);
    }
}

function loadDoneContainer(doneContainer, dones) {
    doneContainer.innerHTML = "";
    for (let i = 0; i < dones.length; i++) {
        let done = dones[i];
        doneContainer.innerHTML += taskCardHTML(done, i)
        loadAssigneesInTheCard(i, done);
        modifyCardCategory(i, done.state);
    }
}

function loadAssigneesInTheCard(i, task) {
    let assigneesContainer = document.getElementById(`assignees-container-${task.state}-of-task-card${i}`);
    assigneesContainer.innerHTML = "";
    for (let j = 0; j < task.contacts.length; j++) {
        let assignee = task.contacts[j]
        let capitalizedAssignee = assignee.first_name.charAt(0) + assignee.last_name.charAt(0);
        assigneesContainer.innerHTML += `
        <span class="assignee-badge" id="${task.state}-assignee${j}-of-task-card${i}">${capitalizedAssignee}</span>
        `
    }
}

function showDropDownAssigneesEditTask(id) {
    if (dropDownMenuClosed) {
        let allAssigneeContainer = document.getElementById(`all-assignee-task-edit-container-${id}`);
        setTimeout(() => {
            allAssigneeContainer.style.height = 'auto';
        }, 10)
        dropDownMenuClosed = false;
    } else {
        let allAssigneeContainer = document.getElementById(`all-assignee-task-edit-container-${id}`);
        setTimeout(() => {
            allAssigneeContainer.style.height = 0;
        }, 10)
        dropDownMenuClosed = true;
    }
}

async function sendEditedTask(id, state, category) {
    let newEditedTask = editAndCreateNewTask(id, state, category);
    try {
        await updateTheNewEditedTask(id, newEditedTask);
    } catch (e) {
        console.log(e);
    }
}

function editAndCreateNewTask(id, state, category) {
    loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    let editedTitle = document.getElementById(`task-title-edit${id}`).innerText;
    let editedDescription = document.getElementById(`task-description-edit${id}`).innerText;
    let editedDate = document.getElementById(`date${id}`);
    let editedAssignees = selectedAssignees;
    let newTask = new Task(editedTitle, editedDescription, category, editedDate.value, choosedPriorityEditTask, editedAssignees, state)
    return newTask
}

function editPriority(prio, event) {
    choosedPriorityEditTask = prio;
    highlightBtnOnClick(prio.toLowerCase());
    event.stopPropagation();
}

function capitalizeAssignee(assignee) {
    let parts = assignee.split(" ");
    let initials = parts.map(part => part.charAt(0).toUpperCase()).join("")
    return initials
}

function modifyCardCategory(i, taskType) {
    let categoryTitle = document.getElementById(`task-category-${taskType}${i}`);
    if (categoryTitle.innerText == 'technical-task') {
        categoryTitle.style = 'background: #1FD7C1'
    } else {
        categoryTitle.style.background = '#0038FF'
    }
}

function rotateCard(i, id) {
    currentDraggedCard = id;
    let getDraggedCard = tasks.filter(t => t.id == id)
    let currentstate = getDraggedCard[0]['state'];
    document.getElementById(`${currentstate}-card${i}`).classList.add('rotate-card')
}

async function mooveTo(state) {
    let singleTaskUrl = `http://127.0.0.1:8000/kanban/tasks/${currentDraggedCard}/`;
    let movedTask = setTheNewStateToMoovedTask(state);
    try {
        await updateTaskState(movedTask, singleTaskUrl);
    } catch (e) {
        console.log(e);
    }
}

function setTheNewStateToMoovedTask(state) {
    let indexOfMovedTask = tasks.findIndex(task => task.id == currentDraggedCard);
    let movedTask = tasks[indexOfMovedTask];
    movedTask.state = state;
    return movedTask
}

async function showTask(id) {
    let selectedTaskIndex = tasks.findIndex(task => task.id == id);
    let selectedTask = tasks[selectedTaskIndex];
    let categoryTitleColor = setTheColorOfCategoryTitle(selectedTask);
    let priorityIcon = setIconOfPriorityBtn(selectedTask);
    let opacityContainer = document.getElementById('opacity-single-task-container');
    opacityContainer.innerHTML = taskCardOverviewHTML(id, selectedTask, categoryTitleColor, priorityIcon);
    loadAssigneeList(id, selectedTask);
    await getSubtasks(id)
    document.getElementById('opacity-single-task-container').classList.remove('d-none');
}

async function editTask(id) {
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

function loadDateInEditTask(date, id) {
    document.getElementById(`date${id}`).value = date;
}

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

function selectAssigneeEditTask(j, checkbox) {
    let selectedAssignee = assignees[j];
    if (checkbox && checkbox.checked) {
        console.log(checkbox);
        selectedAssignees.push(selectedAssignee.id);
    } else if (checkbox) {
        let indexOfSelectedAssignee = selectedAssignees.indexOf(selectedAssignee.id);
        if (indexOfSelectedAssignee != -1) {
            selectedAssignees.splice(indexOfSelectedAssignee, 1)
        }
    }
}

async function getSubtasks(taskId) {
    try {
        await getSubtasksData(taskId)
    } catch (e) {
        console.log(e);
    }
}

async function getSubtaskForEditTask(taskId) {
    try {
        getSubtasksDataForEditTask(taskId);
    } catch (e) {
        console.log(e);
    }
}

function loadSubtasksInTheCardOverview(id, taskRelatedSubtaskList) {
    let subtaskList = document.getElementById(`subtask-list-${id}`);
    subtaskList.innerHTML = ""
    for (let i = 0; i < taskRelatedSubtaskList.length; i++) {
        let subtask = taskRelatedSubtaskList[i]
        subtaskList.innerHTML += subtaskForTaskOverviewHTML(i, id, subtask);
    }
}

function loadSubtasksInTheEditTaskOverview(subtasks, taskId) {
    let subtasksListEditTask = document.getElementById(`subtask-list-edit-task-${taskId}`);
    subtasksListEditTask.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        subtasksListEditTask.innerHTML += subtaskForEditTaskOverview(i, taskId, subtask);
    }
}

function editSubtaskEditOverview(i) {
    actualValueInputEditSubtask = document.getElementById(`subtask-edit-task-overview${i}`).innerText;
    subtaskIsClicked = true;
    let listItem = document.getElementById(`subtask-edit-task-overview${i}`);
    listItem.setAttribute("contenteditable", "true");
    listItem.focus();
    document.getElementById(`pencil-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`check-icon-edit${i}`).classList.remove('d-none');
}

function disableContentEditingSubtask(i) {
    let listItem = document.getElementById(`subtask-edit-task-overview${i}`);
    listItem.setAttribute("contenteditable", "false");
    document.getElementById(`subtask-edit-task-overview-container${i}`).style.background = 'none';
    document.getElementById(`pencil-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`delete-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`check-icon-edit${i}`).classList.add('d-none');
    document.getElementById(`icon-separator-edit-subtask${i}`).classList.add('d-none');
    subtaskIsClicked = false;
}

function turnTheOriginalInputValueOfSubtaskBack(i) {
    document.getElementById(`subtask-edit-task-overview${i}`).innerText = actualValueInputEditSubtask;
    disableContentEditingSubtask(i)
}

function highlightContainerAndIcons(i) {
    if (subtaskIsClicked == false) {
        document.getElementById(`subtask-edit-task-overview-container${i}`).style.background = '#eee';
        document.getElementById(`pencil-icon-edit${i}`).classList.remove('d-none');
        document.getElementById(`delete-icon-edit${i}`).classList.remove('d-none');
        document.getElementById(`icon-separator-edit-subtask${i}`).classList.remove('d-none');
    }
}

function turnhighlightContainerAndIconsOff(i) {
    if (subtaskIsClicked == false) {
        document.getElementById(`subtask-edit-task-overview-container${i}`).style.background = 'none';
        document.getElementById(`pencil-icon-edit${i}`).classList.add('d-none');
        document.getElementById(`delete-icon-edit${i}`).classList.add('d-none');
        document.getElementById(`check-icon-edit${i}`).classList.add('d-none');
        document.getElementById(`icon-separator-edit-subtask${i}`).classList.add('d-none');
    }
}

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

async function updateTitleTaskRelatedSubtask(i, taskId) {
    disableContentEditingSubtask(i)
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

function clearInputAddSubtask(id) {
    document.getElementById(`input-subtask-edit-task${id}`).value = "";
}

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

async function updateCompletedStatusOfSubtask(id, selectedSubtask) {
    let response = await fetch(subtasksUrl + `${id}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${loggedUser.token}`
        },
        body: JSON.stringify(selectedSubtask)
    })
    let subtaskData = await response.json();
}

function setTheColorOfCategoryTitle(selectedTask) {
    if (selectedTask.category == 'technical-task') {
        return '#1FD7C1'
    } else {
        return '#0038FF'
    }
}

function setIconOfPriorityBtn(selectedTask) {
    if (selectedTask.priority == 'urgent') {
        return 'urgent.png'
    } else if (selectedTask.priority == 'medium') {
        return 'medium.png'
    } else {
        return 'low.png'
    }
}

async function deleteTask(id) {
    let singleTaskUrl = tasksUrl + `${id}/`;
    try {
        await deleteTaskData(singleTaskUrl);
    } catch (e) {
        console.error(e);
    }
}

function showTaskActionFailedAdvice(data) {
    let adviceContainer = document.getElementById('advice-container');
    adviceContainer.innerHTML = /*html*/ `
    <span id="update-task-failed" style="color:white">${data}</span>
   `
    setTimeout(() => {
        adviceContainer.innerHTML = "";
    }, 3000)
}

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

function closeTaskOverview(event) {
    event.stopPropagation();
    document.getElementById('opacity-single-task-container').classList.add('d-none');
}

function closeAddTaskOverview(event) {
    event.stopPropagation();
    document.getElementById('opacity-add-task-container').classList.add('d-none');
}

function dontClose(event) {
    event.stopPropagation()
}

document.addEventListener('DOMContentLoaded', () => {
    includeHTML(() => {
        setInitialsCurrentUserInTheHeader(); // Esegui la funzione dopo che tutto è stato caricato
    });
});

function allowDrop(ev, state) {
    ev.preventDefault();
}

function highlightContainer(state, event) {
    event.preventDefault();
    document.getElementById(state).classList.add('dashed-border');
}

function removeBorderOnLeave(state, event) {
    event.preventDefault();
    setTimeout(() => {
        document.getElementById(state).classList.remove('dashed-border')
    })
}

function removeBorderOnDrop(state, event) {
    event.preventDefault();
    document.getElementById(state).classList.remove('dashed-border');
}