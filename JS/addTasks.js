let subtasksList = [];
let choosedPriority;
let choosedCategory;
let assignees = [];
let selectedAssignees = [];
let subtasksUrl = 'http://127.0.0.1:8000/kanban/subtasks/';

async function initAddTasks() {
  authenticated = JSON.parse(localStorage.getItem('authenticated'));
  if (authenticated) {
    await getLoggedUser();
    await loadAssignees();
  } else {
    window.location.href = 'login.html'
  }
}

async function loadAssignees() {
  let response = await fetch(contactsUrl);
  let fetchedContacts = await response.json();
  assignees = fetchedContacts;
  let assigneesContainer = document.getElementById('drop-down-menu-assignees');
  assigneesContainer.style.border = '1px solid #D1D1D1'
  assigneesContainer.innerHTML = "";
  for (let i = 0; i < assignees.length; i++) {
    let assignee = assignees[i];
    let initials = assignee.first_name.charAt(0).toUpperCase() + assignee.last_name.charAt(0).toUpperCase();
    assigneesContainer.innerHTML += assigneeHTML(i, initials, assignee);
  }
  setInitialsCurrentUserInTheHeader(loggedUser);
}

async function getLoggedUser() {
  loggedUser = JSON.parse(localStorage.getItem('currentUser'))
}

function showAssigneesInTheDropDownMenu() {
  let assigneeContainer = document.getElementById('drop-down-menu-assignees');
  assigneeContainer.classList.toggle('moveDownDropDownMenu')
  document.getElementById('arrow-drop-down').classList.toggle('rotateArrowDropDown');
  console.log('clicked');
}

function selectAssignees(i, checkbox) {
  let selectedAssignee = assignees[i];
  if (checkbox && checkbox.checked) {
    selectedAssignees.push(assignees[i].id);
  } else if (checkbox) {
    let index = selectedAssignees.indexOf(selectedAssignee);
    if (index != -1) {
      selectedAssignees.splice(index, 1);
    }
  }
}


function writeSubtask() {
  document.getElementById('cross-and-check-icon-container').classList.remove('d-none');
  document.getElementById('add-icon').classList.add('d-none')
}

function addSubtasks() {
  let subtaskTitle = document.getElementById('input-subtask');
  if (subtaskTitle.value.length > 0) {
    let subtaskListContainer = document.getElementById('subtask-list');
    let newSubtask = new Subtask(subtaskTitle.value, false)
    subtasksList.push(newSubtask);
    console.log(subtasksList);
    subtaskListContainer.innerHTML = '';
    for (let i = 0; i < subtasksList.length; i++) {
      let subtask = subtasksList[i]
      subtaskListContainer.innerHTML += subtaskHTML(i, subtask);
    }
    subtaskTitle.value = "";
  }
}

function fillButton(priority) {
  choosedPriority = priority
  document.getElementById('urgent-btn').classList.remove('highlithedBtnEditTask');
  document.getElementById('urgent-btn').classList.remove(`urgent-btn-edit-task`);
  document.getElementById('urgent-icon').src = './assets/img/urgent.png'
  document.getElementById('medium-btn').classList.remove('highlithedBtnEditTask');
  document.getElementById('medium-btn').classList.remove(`medium-btn-edit-task`);
  document.getElementById('medium-icon').src = './assets/img/medium.png';
  document.getElementById('low-btn').classList.remove('highlithedBtnEditTask');
  document.getElementById('low-btn').classList.remove(`low-btn-edit-task`);
  document.getElementById('low-icon').src = './assets/img/low.png'
  document.getElementById(`${priority}-btn`).classList.add(`${priority}-btn-edit-task`);
  document.getElementById(`${priority}-btn`).classList.add('highlithedBtnEditTask');
  document.getElementById(`${priority}-icon`).src = `./assets/img/${priority}-white.png`
}


function selectCategory() {
  choosedCategory = document.getElementById('categories').value;
}

async function createTasks(event) {
  let newTask = createNewTaskFromTheForm(event);
  try {
    await postTheNewCreatedTask(newTask);
  }
  catch (e) {
    console.log(e);
  }
}

function createNewTaskFromTheForm(event) {
  event.preventDefault();
  let title = document.getElementById('title');
  let description = document.getElementById('description');
  let due_date = document.getElementById('date');
  let priority = choosedPriority;
  let category = choosedCategory;
  let state = 'todo';
  let contacts_ids = selectedAssignees
  let newTask = new Task(title.value, description.value, category, due_date.value, priority, contacts_ids, state);
  clearAddTaskValues(title, description, due_date, priority, category);
  return newTask
}

async function postTheNewCreatedTask(newTask) {
  try {
    let taskResponse = await fetch(tasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${loggedUser.token}`
      },
      body: JSON.stringify(newTask)
    })
    await getTaskDataAndPostSubtask(taskResponse)
  } catch (e) {
    console.log(w);
  }
}

async function getTaskDataAndPostSubtask(taskResponse) {
  try {
    let taskData = await taskResponse.json();
    console.log("Task Data", taskData);
    if (taskData) {
      await sendSubtasks(taskData)
    }
  } catch (e) {
    console.log(e);
  }
}

async function sendSubtasks(taskData) {
  try {
    for (let subtask of subtasksList) {
      subtask.task_id = taskData.id
      let subtaskResponse = await fetch(subtasksUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${loggedUser.token}`
        },
        body: JSON.stringify(subtask)
      })
      let subtasksData = await subtaskResponse.json();
    }
    getAndClearSubtasksHTMLListAfterSend();
  } catch (e) {
    console.log(e);
  }
}

async function getAndClearSubtasksHTMLListAfterSend() {
  subtasksList = [];
  if (window.location.href == "board.html") {
    showCreateTaskOverview()
  } else {
    document.getElementById('subtask-list').innerHTML = "";
  }
}

function clearAddTaskValues(title, description, due_date, priority, category) {
  title.value = "";
  description.value = "";
  due_date.value = "";
  priority = "";
  category = "";
  users_ids = [];
  let checkboxsesHTMLcollection = document.getElementsByClassName('input-checkbox');
  let checkboxes = [...checkboxsesHTMLcollection];
  checkboxes.forEach(c => {
    c.checked = false;
  })
}

document.addEventListener('DOMContentLoaded', () => {
  includeHTML(() => {
    setInitialsCurrentUserInTheHeader(loggedUser); // Esegui la funzione dopo che tutto è stato caricato
  });
});