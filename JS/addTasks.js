let subtasksList = [];
let choosedPriority;
let choosedCategory;
let assignees = [];
let selectedAssignees = [];
let subtasksUrl = 'http://127.0.0.1:8000/kanban/subtasks/';
let loggedUser;

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
    assigneesContainer.innerHTML += /*html*/ `
           <div id="assignee${i}" class="assignee">
                <span class="assignee-badge" style="background:${assignee.badge_color}">${initials}</span>
                <span class="assignee-name">${assignee.first_name} ${assignee.last_name}</span>
                <input onchange="selectAssignees(${i}, this)" type="checkbox" name="checkbox" class="input-checkbox">
            </div>
          `
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
      subtaskListContainer.innerHTML += `
          <li id="subtask${i}">${subtask.title}</li>
          `
    }
    subtaskTitle.value = "";
  }
}

function fillButton(priority) {
  if (priority == "urgent") {
    choosedPriority = "urgent"
    document.getElementById('urgent-btn').style = 'background: #FF3D00'
    document.getElementById('medium-btn').style = 'background: none';
    document.getElementById('low-btn').style = 'background: none';
  } else if (priority == "medium") {
    choosedPriority = "medium"
    document.getElementById('medium-btn').style = 'background: #FFA800'
    document.getElementById('urgent-btn').style = 'background: none'
    document.getElementById('low-btn').style = 'background: none';
  } else {
    choosedPriority = "low"
    document.getElementById('low-btn').style = 'background: #7AE229'
    document.getElementById('medium-btn').style = 'background: none'
    document.getElementById('urgent-btn').style = 'background: none'
  }
}

function selectCategory() {
  choosedCategory = document.getElementById('categories').value;
  console.log(choosedCategory);
}

async function createTasks(event) {
  event.preventDefault();
  let title = document.getElementById('title');
  let description = document.getElementById('description');
  let due_date = document.getElementById('date');
  let priority = choosedPriority;
  let category = choosedCategory;
  let state = 'todo';
  let contacts_ids = selectedAssignees
  let newTask = new Task(title.value, description.value, category, due_date.value, priority, contacts_ids, state);
  try {
    let taskResponse = await fetch(tasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${loggedUser.token}`
      },
      body: JSON.stringify(newTask)
    })
    let taskData = await taskResponse.json();
    console.log("Task Data", taskData);
    if (taskData) {
      sendSubtask(taskData)
    }
  }
  catch (e) {
    console.log(e);
  }
  clearAddTaskValues(title, description, due_date, priority, category)
}

async function sendSubtask(taskData) {
  for (let subtask of subtasksList) {
    subtask.task_id = taskData.id
    let subtaskResponse = await fetch(subtasksUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${loggedUser.token}`
      },
      body: JSON.stringify(subtask)
    })
    let subtasksData = await subtaskResponse.json();
    subtasksList = [];
    if (window.location.href == "board.html") {
      showCreateTaskOverview()
    } else {
      document.getElementById('subtask-list').innerHTML = "";
    }
    console.log("Subtask Data", subtasksData);
  }
}

function clearAddTaskValues(title, description, due_date, priority, category) {
  title.value = "";
  description.value = "";
  due_date.value = "";
  priority = "";
  category = "";
  users_ids = [];
  subtasksList = [];
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