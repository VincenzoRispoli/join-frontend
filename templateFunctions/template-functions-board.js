

function taskCardHTML(task, i) {
    return (/*html*/`
    <div onclick="showTask(${task.id}, ${i})" id="${task.state}-card${i}" class="task-card" draggable="True" ondragstart="rotateCard(${i}, ${task.id})">
            <span id="task-category-${task.state}${i}" class="task-category">${task.category}</span>
            <h3 id="task-title">${task.title}</h3>
            <div id="task-description">${task.description}</div>
            <div class="progress-bar-and-subtask-count-container">
                <span class="progress-bar"></span>
                <span class="subtask-count"> 0/${2} subtasks</span>
            </div>
            <div class="assignees-and-icon-prio-container">
                <div id="assignees-container-${task.state}-of-task-card${i}" class="assignees-container">
                  
                </div>
                <img src="./assets/img/${task.priority}.png" alt="">
            </div>
        </div>
      `)
}

function taskCardOverviewHTML(id, selectedTask, categoryTitleColor, priorityIcon) {
    return (/*html*/ `
        <div onclick="dontClose(event)" id="single-task-overview-${id}" class="single-task-overview">
        <div class="single-task-overview-wrapper">
                <div class="category-title-and-cross-container">
                    <span class="category-title" style="background-color: ${categoryTitleColor}">${selectedTask.category}</span>
                    <img onclick="closeTaskOverview(event)" class="cross-icon" src="./assets/img/cross.png" alt="">
                </div>
                <h2 id="task-title" class="task-tile">${selectedTask.title}</h2>
                <p class="task-decription">${selectedTask.description}</p>
                <span class="task-due-date"> Due Date: ${selectedTask.due_date}</span>
                <div class="priority-container-task-overview">
                    Priority:
                    <div class="priority-title-and-icon-container">
                        <span class="task-priority">${selectedTask.priority}</span>
                        <img src="./assets/img/${priorityIcon}" alt="">
                    </div>
                </div>
                <div class="assigned-to-container-task-overview"> 
                <span>Assigned To:</span>
                <div id="task-assignedTo-list-${id}" class="task-assigned-to-list">

                </div>
                </div>
                <div class="subtask-container-task-overview">
                <span>Subtasks</span>
                <div id="subtask-list-${id}" class="subtasks-list-task-overview">

                </div>
                </div>
                <div class="edit-or-delete-buttons-container">
            <button onclick="deleteTask(${id}); return false" class="task-overview-btn">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_75601_14777" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                        width="25" height="24">
                        <rect x="0.144531" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_75601_14777)">
                        <path
                            d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z"
                            fill="#2A3647" />
                    </g>
                </svg>
                Delete
            </button>
            <button onclick="editTask(${id}, '${priorityIcon}')"; class="task-overview-btn">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_135789_4203" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
                        width="25" height="25">
                        <rect x="0.682129" y="0.396729" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_135789_4203)">
                        <path
                            d="M5.68213 19.3967H7.08213L15.7071 10.7717L14.3071 9.37173L5.68213 17.9967V19.3967ZM19.9821 9.32173L15.7321 5.12173L17.1321 3.72173C17.5155 3.3384 17.9863 3.14673 18.5446 3.14673C19.103 3.14673 19.5738 3.3384 19.9571 3.72173L21.3571 5.12173C21.7405 5.50506 21.9405 5.96756 21.9571 6.50923C21.9738 7.0509 21.7905 7.5134 21.4071 7.89673L19.9821 9.32173ZM18.5321 10.7967L7.93213 21.3967H3.68213V17.1467L14.2821 6.54673L18.5321 10.7967Z"
                            fill="#2A3647" />
                    </g>
                </svg>
                <span>Edit</span>
            </button>
        </div>
        </div>
        </div>
        <span id="delete-task-advice" class="advice-container"></span>
        `
    )
}

function loadAssigneeList(id, selectedTask) {
    let assigneesList = document.getElementById(`task-assignedTo-list-${id}`);
    assigneesList.innerHTML = "";
    selectedTask.contacts.forEach(contact => {
        assigneesList.innerHTML += `
    <div class="badge-and-name-assignees-container-task-overview">
        <span style="background: ${contact.badge_color}" class="contact-badge-task-overview">${contact.first_name.charAt(0)}${contact.last_name.charAt(0)}</span>
        <span>${contact.first_name} ${contact.last_name}</span>
    </div>
        `
    })
}

function editTaskHTML(id, selectedTask) {
    return ( /*html*/`
    <div onclick="dontClose(event)" id="single-task-overview-${id}" class="single-task-overview">
    <div class="single-task-overview-wrapper">
       <div style="justify-content: flex-end" class="category-title-and-cross-container">
         <img onclick="closeTaskOverview(event)" class="cross-icon" src="./assets/img/cross.png" alt="">
       </div>
       <h2 contenteditable="true" id="task-title-edit${id}" class="task-title">${selectedTask.title}</h2>
        <p contenteditable="true" id="task-description-edit${id}" class="task-decription-edit">${selectedTask.description}</p>
        <input id="date${id}" class="input-date-edit-task" type="date">
        <div class="priority-container-edit-task-overview">
          Priority:
           <div class="priority-buttons-and-icon-container-edit-task">
            <button onfocus="editPriority('Urgent', event)" onblur="removeHighlightOnBlur('urgent')" onmouseover="highlightBtnOnHover('urgent')" onmouseleave="turnTheBtnOffOnLeave('urgent')" id="edit-task-urgent-btn" class="prio-btn-edit-task">Urgent <img id="urgent-icon" src="./assets/img/urgent.png" alt=""></button>
            <button onfocus="editPriority('Medium', event)" onblur="removeHighlightOnBlur('medium')"  onmouseover="highlightBtnOnHover('medium')" onmouseleave="turnTheBtnOffOnLeave('medium')" id="edit-task-medium-btn" class="prio-btn-edit-task">Medium <img id="medium-icon" src="./assets/img/medium.png"></button>
            <button onfocus="editPriority('Low', event)" onblur="removeHighlightOnBlur('low')"  onmouseover="highlightBtnOnHover('low')" onmouseleave="turnTheBtnOffOnLeave('low')" id="edit-task-low-btn" class="prio-btn-edit-task">Low <img id="low-icon" src="./assets/img/low.png"></button>
            </div>
        </div>
        <div class="assigned-to-container-task-overview">
           <span>Assigned To:</span>
           <div class="input-search-assignee-container" onclick="showDropDownAssigneesEditTask(${id})">
                <span class="input-search-assignee">Select contact to assign</span>
                <img id="arrow-drop-down" class="arrow-drop-down" src="./assets/img/arrow_drop_down.png" alt="">
            </div>
            <div id="all-assignee-task-edit-container-${id}" class="all-assignee-task-edit-container">
    
            </div>
        <div id="task-assignedTo-list-edit-task-${id}" class="task-assigned-to-list-edit-task">

        </div>
        </div>
        <div class="subtask-container-edit-task-overview">
            <span>Subtasks</span>
            <div onclick="writeSubtaskEditTask(${id})" class="subtask-input-container">
                <input id="input-subtask-edit-task${id}" class="input-subtask" placeholder="Add new subtask" type="text">
                <div class="icons-subtask-container">
                    <img onclick="writeSubtaskEditTask(${id})" id="add-icon" class="subtask-icon" src="./assets/img/add-blue.png" alt="">
                    <div id="cross-and-check-icons-container" class="cross-and-check-icons-container d-none">
                        <img onclick="clearAddSubtaskInputEdit(${id}, event)" class="subtask-icon" src="./assets/img/cross.png" alt="">
                        <img onclick="addSubtaskEditTask(${id}, event)" class="subtask-icon" src="./assets/img/check-small.png" alt="">
                    </div>
                </div>
            </div>
            <ul id="subtask-list-edit-task-${id}" class="subtasks-list-overview">

            </ul>
        </div>
        <div class="confirm-edit-task-btn-container">
           <button onclick="sendEditedTask(${id}, '${selectedTask.state}', '${selectedTask.category}')" class="confirm-edit-task-btn">Ok <img class="check-icon-edit-task" src="./assets/img/check-white.png" alt=""></button>
        </div>
    </div>
    </div>
    <span id="advice-container" class="advice-container"></span>
  `)
}

function addTaskOverviewHTML() {
    return /*html*/ `
    <div onclick="dontClose(event)" class="add-task-overview-wrapper">
      <div id="add-task-overview" class="add-task-overview">
        <div class="title-and-cross-icon-container">
            <h2 class="add-tasks-title">Add Tasks</h2>
            <img onclick="closeAddTaskOverview(event)" class="cross-icon" src="./assets/img/cross.png" alt="">
        </div>
            <form onsubmit="createTasks(event); return false">
                <div class="form-container">
                    <div class="left-block">
                        <div class="label-and-writeField-container">
                            <label for="title">Title</label>
                            <input id="title" class="input-title" type="text" placeholder="Enter a title..."
                                name="title">
                        </div>
                        <div class="label-and-writeField-container">
                            <label for="description">Description</label>
                            <textarea id="description" class="textarea" name="description"
                                placeholder="Enter a description..." id=""></textarea>
                        </div>
                        <div class="assigned-to-container">
                            <label for="">Assigned To</label>
                            <div onclick="showAssigneesInTheDropDownMenu()" class="input-search-assignee-container">
                                <span class="input-search-assignee">Select contact to assign</span>
                                <img id="arrow-drop-down" class="arrow-drop-down" src="./assets/img/arrow_drop_down.png"
                                    alt="">
                            </div>
                            <div class="drop-down-menu-assignees-container">
                                <div id="drop-down-menu-assignees" class="drop-down-menu-assignees">

                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="form-separator"></span>
                    <div class="rigth-block">
                        <div class="due-date-container">
                            <label for="due-date">Date</label>
                            <input id="date" class="input-date" type="date" name="due-date">
                        </div>
                        <div class="prio-container">
                            <span>Prio</span>
                            <div class="prio-buttons-container">
                                <span onclick="fillButton('urgent')" id="urgent-btn" class="urgent-btn prio-btn">Urgent
                                    <img src="" alt=""></span>
                                <span onclick="fillButton('medium')" id="medium-btn" class="medium-btn prio-btn">Medium
                                    <img src="" alt=""></span>
                                <span onclick="fillButton('low')" id="low-btn" class="low-btn prio-btn">Low <img src=""
                                        alt=""></span>
                            </div>
                        </div>
                        <div class="category-container">
                            <label for="categories">Category</label>
                            <select onclick="selectCategory()" name="categories" id="categories" class="categories">
                                <option id="technical-task" value="technical-task">Technical Task</option>
                                <option id="user-story" value="user-story">User Story</option>
                            </select>
                        </div>
                        <div class="subtasks-container">
                            <label for="input-subtask">Subtask</label>
                            <div onclick="writeSubtask()" class="subtask-input-container">
                                <input id="input-subtask" class="input-subtask" placeholder="Add new subtask"
                                    type="text">
                                <div class="icons-subtask-container">
                                    <img id="add-icon" class="subtask-icon" src="./assets/img/add.png" alt="">
                                    <div id="cross-and-check-icon-container"
                                        class="cross-and-check-icons-container d-none">
                                        <img class="subtask-icon" src="" alt="">
                                        <img onclick="addSubtasks()" class="subtask-icon"
                                            src="./assets/img/check-small.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <ul id="subtask-list" class="subtask-list">

                            </ul>
                        </div>
                    </div>
                </div>
                <div class="buttons-container">
                    <button>Clear</button>
                    <button id="submit-btn" type="submit">Create Task</button>
                </div>
            </form>
        </div>
    </div>
    `
}

function assigneeCheckedHTML(j, assignee) {
    return /*html*/ `
        <div id="assignee-edit-task${j}" class="assignee">
            <span style="background: ${assignee.badge_color}" class="contact-badge-task-overview">${assignee.first_name.charAt(0)}${assignee.last_name.charAt(0)}</span>
            <span class="assignee-name">${assignee.first_name} ${assignee.last_name}</span>
            <input onclick="selectAssigneeEditTask(${j}, this)" id="input-checkbox-${j}" type="checkbox" checked="true">
        </div>
    `
}

function assigneeNoCheckedHTML(j, assignee) {
    return /*html*/ `
        <div id="assignee-edit-task${j}" class="assignee">
            <span class="contact-badge-task-overview" style="background:${assignee.badge_color}">${assignee.first_name.charAt(0)}${assignee.last_name.charAt(0)}</span>
            <span>${assignee.first_name} ${assignee.last_name}</span>
            <input onclick="selectAssigneeEditTask(${j}, this)" id="input-checkbox-${j}" type="checkbox">
        </div>
    `
}

function subtaskForTaskOverviewHTML(i, id, subtask) {
    return /*html*/`
    <div class="checkbox-and-subtaskTitle-container-task-overview">
       <input onclick="updateTaskRelatedSubtask(${i}, ${id}, this)" type="checkbox">
       <span>${subtask.title}</span>
    </div>
      `
}

function subtaskForEditTaskOverview(i, taskId, subtask) {
    return /*html*/ `
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

