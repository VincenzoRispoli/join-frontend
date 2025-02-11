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
    console.log(loggedUser);
    let response = await fetch(tasksUrl, {
        method: 'GET',
        headers: {
            'Authorization': `${loggedUser.token}`,
            'Content-Type': 'application/json'
        }
    })
    if (response.ok) {
        let fetchedTasks = await response.json();
        console.log(fetchedTasks);
        tasks = fetchedTasks;
    } else {
        console.log('error');
    }
    let searchText = document.getElementById('search-tasks-input');
    if (searchText && searchText.value.length > 0) {
        let matchedTasks = tasks.filter(t => t.title.toLowerCase().includes(searchText.value.toLowerCase()))
        tasks = matchedTasks;
        console.log(tasks);
        document.getElementById('all-tasks-btn').classList.remove('d-none')
    }
    todos = tasks.filter(t => t['state'] == 'todo');
    inProgress = tasks.filter(t => t['state'] == 'in-progress');
    awaitFeedBack = tasks.filter(t => t['state'] == 'await-feedback');
    dones = tasks.filter(t => t['state'] == 'done');

    if (window.location.href === 'http://127.0.0.1:5500/board.html') {
        todoContainer = document.getElementById('todo');
        inProgressContainer = document.getElementById('in-progress');
        awaitFeedbackContainer = document.getElementById('await-feedback');
        doneContainer = document.getElementById('done');
        loadTodoContainer(todoContainer, todos);
        loadinProgressContainer(inProgressContainer, inProgress);
        loadAwaitFeedbackContainer(awaitFeedbackContainer, awaitFeedBack);
        loadDoneContainer(doneContainer, dones);
    }
    setInitialsCurrentUserInTheHeader(loggedUser);
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
    loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    let editedTitle = document.getElementById(`task-title-edit${id}`).innerText;
    let editedDescription = document.getElementById(`task-description-edit${id}`).innerText;
    let editedDate = document.getElementById(`date${id}`);
    let editedAssignees = selectedAssignees;
    let newTask = new Task(editedTitle, editedDescription, category, editedDate.value, choosedPriorityEditTask, editedAssignees, state)
    try {
        let response = await fetch(tasksUrl + `${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            },
            body: JSON.stringify(newTask)
        })
        let editedTaskData = await response.json();
        document.getElementById('opacity-single-task-container').classList.add('d-none')
    } catch (e) {
        console.log(e);
    }
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
    let indexOfMovedTask = tasks.findIndex(task => task.id == currentDraggedCard);
    let movedTask = tasks[indexOfMovedTask];
    movedTask.state = state;
    let response = await fetch(singleTaskUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${loggedUser.token}`
        },
        body: JSON.stringify(movedTask)
    })
    let result = await response.json();
    console.log(result);
    loadTasks();
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
    console.log(id);
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
            allAssigneesEditTaskContainer.innerHTML += /*html*/ `
                    <div id="assignee-edit-task${j}" class="assignee">
                        <span style="background: ${assignee.badge_color}" class="contact-badge-task-overview">${assignee.first_name.charAt(0)}${assignee.last_name.charAt(0)}</span>
                        <span class="assignee-name">${assignee.first_name} ${assignee.last_name}</span>
                        <input onclick="selectAssigneeEditTask(${j}, this)" id="input-checkbox-${j}" type="checkbox" checked="true">
                    </div>
                    `
        } else {
            allAssigneesEditTaskContainer.innerHTML += /*html*/ `
                    <div id="assignee-edit-task${j}" class="assignee">
                        <span>${assignee.first_name.charAt(0)}${assignee.last_name.charAt(0)}</span>
                        <span>${assignee.first_name}${assignee.last_name}</span>
                        <input onclick="selectAssigneeEditTask(${j}, this)" id="input-checkbox-${j}" type="checkbox">
                    </div>
                    `
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



function highlightPriorityBtn(selectedTask) {
    let priority = selectedTask.priority.toLowerCase();
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.add(`${priority}-btn-edit-task`);
    btn.classList.add('highlithedBtnEditTask');
    btn.focus();
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`
}

function highlightBtnOnHover(priority) {
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.add(`${priority}-btn-edit-task`);
    btn.classList.add('highlithedBtnEditTask');
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`
}

function turnTheBtnOffOnLeave(priority) {
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    if (btn.matches(':focus')) {
        btn.classList.add(`${priority}-btn-edit-task`);
        btn.classList.add('highlithedBtnEditTask');
        document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`
    } else {
        if (priorityType != priority) {
            btn.classList.remove(`${priority}-btn-edit-task`);
            btn.classList.remove('highlithedBtnEditTask');
            document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}.png`
        } else {
            btn.classList.add(`${priority}-btn-edit-task`);
            btn.classList.add('highlithedBtnEditTask');
            document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`
        }
    }
}

function highlightBtnOnClick(priority) {
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.add(`${priority}-btn-edit-task`);
    btn.classList.add('highlithedBtnEditTask');
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`
}

function removeHighlightOnBlur(priority) {
    let btn = document.getElementById(`edit-task-${priority}-btn`);
    btn.classList.remove(`${priority}-btn-edit-task`);
    btn.classList.remove('highlithedBtnEditTask');
    document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}.png`
}



async function getSubtasks(taskId) {
    try {
        let response = await fetch(subtasksUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            },
        })
        let subtasksDataFetched = await response.json();
        taskRelatedSubtaskList = subtasksDataFetched.filter(s => s.task == taskId);
        loadSubtasksInTheCardOverview(taskId, taskRelatedSubtaskList)
    } catch (e) {
        console.log(e);
    }
}

async function getSubtaskForEditTask(taskId) {
    try {
        let response = await fetch(subtasksUrl)
        let fetchedSubtasks = await response.json();
        let subtasks = fetchedSubtasks.filter(s => s.task == taskId);
        loadSubtasksInTheEditTaskOverview(subtasks, taskId);
    } catch (e) {
        console.log(e);
    }
}

function loadSubtasksInTheCardOverview(id, taskRelatedSubtaskList) {
    let subtaskList = document.getElementById(`subtask-list-${id}`);
    subtaskList.innerHTML = ""
    for (let i = 0; i < taskRelatedSubtaskList.length; i++) {
        let subtask = taskRelatedSubtaskList[i]
        subtaskList.innerHTML += /*html*/`
        <div class="checkbox-and-subtaskTitle-container-task-overview">
           <input onclick="updateTaskRelatedSubtask(${i}, ${id}, this)" type="checkbox">
           <span>${subtask.title}</span>
        </div>
          `
    }
}

function loadSubtasksInTheEditTaskOverview(subtasks, taskId) {
    let subtasksListEditTask = document.getElementById(`subtask-list-edit-task-${taskId}`);
    subtasksListEditTask.innerHTML = "";
    for (let i = 0; i < subtasks.length; i++) {
        let subtask = subtasks[i];
        subtasksListEditTask.innerHTML += /*html*/ `
        <div onmouseover="highlightContainerAndIcons(${i})" onmouseleave="turnhighlightContainerAndIconsOff(${i})" id="subtask-edit-task-overview-container${i}" class="subtask-edit-task-overview-container">
                <li onblur="turnTheOriginalInputValueOfSubtaskBack(${i})" id="subtask-edit-task-overview${i}" contenteditable="false" class="subtask-edit-task-overview">
                       ${subtask.title}
                    </li>
                    <div class="icon-edit-subtask-container">
                        <img onclick="editSubtaskEditOverview(${i})" id="pencil-icon-edit${i}" src="./assets/img/pencil.png" alt="">
                        <img onclick="updateTitleTaskRelatedSubtask(${i}, ${taskId})" id="check-icon-edit${i}" class="d-none" src="./assets/img/check-small.png" alt="">
                        <span id="icon-separator-edit-subtask${i}" class="icon-separator-edit-subtask"></span>
                        <img onclick="deleteSubtaskEditTask(${i}, ${taskId})" id="delete-icon-edit${i}" src="./assets/img/delete.png" alt="">
                    </div>
        </div>
     `
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

async function addSubtaskEditTask(id) {
    let subtaskTitle = document.getElementById(`input-subtask-edit-task${id}`);
    let newSubtask = new Subtask(subtaskTitle.value, false);
    newSubtask.task_id = id
    try {
        let response = await fetch(subtasksUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            },
            body: JSON.stringify(newSubtask)
        })
        let fetchedSubtask = await response.json();
        let taskId = fetchedSubtask.task
        getSubtaskForEditTask(taskId)
    } catch (e) {
        console.log(e);
    }
}

async function deleteSubtaskEditTask(i, taskId) {
    let subtask = taskRelatedSubtaskList[i];
    let id = subtask.id;
    try {
        let response = await fetch(subtasksUrl + `${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            }
        })
        getSubtaskForEditTask(taskId)
    } catch (e) {
        console.log(e);
    }
}

async function updateTitleTaskRelatedSubtask(i, taskId) {
    disableContentEditingSubtask(i)
    let editedSubtask = taskRelatedSubtaskList[i];
    let id = editedSubtask.id
    editedSubtask.task_id = taskId
    editedSubtask.title = document.getElementById(`subtask-edit-task-overview${i}`).innerText;
    try {
        let response = await fetch(subtasksUrl + `${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            },
            body: JSON.stringify(editedSubtask)
        })
        let subtasksData = await response.json();
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
        let response = await fetch(subtasksUrl + `${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            },
            body: JSON.stringify(selectedSubtask)
        })
        let subtaskData = await response.json();
    } catch (e) {
        console.log(e);
    }
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
    let detailTaskUrl = tasksUrl + `${id}/`;
    try {
        await fetch(detailTaskUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${loggedUser.token}`
            }
        })
        await loadTasks();
        document.getElementById('opacity-single-task-container').classList.add('d-none')
    } catch (e) {
        console.log(e);
    }
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

function allowDrop(ev) {
    ev.preventDefault();
}