
/**
 * Generates the HTML structure for a task card.
 * 
 * @param {Object} task - The task object containing details to display.
 * @param {number} i - The index of the task in the list.
 * @returns {string} - The HTML structure for the task card.
 */
function taskCardHTML(task, i) {
    return (/*html*/`
    <div onclick="showTask(${task.id}, ${i})" id="${task.state}-card${i}" class="task-card" draggable="True" ondragstart="rotateCard(${i}, ${task.id})">
        <img onclick="showPopUpDragTaskMobile(${task.id},event)" class="drag-icon" src="./assets/img/drag-icon.png" alt="">
        <span id="task-category-${task.state}${i}" class="task-category">${task.category}</span>
            <h3 id="task-title">${task.title}</h3>
            <div id="task-description">${task.description}</div>
            <div class="progress-bar-and-subtask-count-container">
                <div class="progress-bar-container">
                    <span id="progress-bar-${task.id}" class="progress-bar"></span>
                </div>
                <div class="subtasks-count-info-container">
                    <span id="completed-subtasks-${task.id}"></span>
                    <span id="subtasks-count-${task.id}" class="subtask-count"></span>
                </div>
            </div>
            <div class="assignees-and-icon-prio-container">
                <div id="assignees-container-${task.state}-of-task-card${i}" class="assignees-container">
                   <!-- Assignees will be loaded here -->
                </div>
                <img src="./assets/img/${task.priority}.png" alt="">
            </div>
        </div>
    `)
}

/**
 * Generates the HTML structure for the task overview.
 * 
 * @param {number} id - The unique ID of the task.
 * @param {Object} selectedTask - The selected task object.
 * @param {string} categoryTitleColor - The background color for the category title.
 * @param {string} priorityIcon - The icon representing the priority level.
 * @returns {string} - The HTML structure for the task overview.
 */
function taskCardOverviewHTML(id, selectedTask, categoryTitleColor, priorityIcon) {
    return (/*html*/`
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
                <span class="assigned-to-title">Assigned To:</span>
                <div id="task-assignedTo-list-${id}" class="task-assigned-to-list">
                    <!-- Assigned contacts will be loaded here -->
                </div>
                </div>
                <div class="subtask-container-task-overview">
                <span>Subtasks</span>
                <div id="subtask-list-${id}" class="subtasks-list-task-overview">
                    <!-- Subtasks will be loaded here -->
                </div>
                </div>
                <div class="edit-or-delete-buttons-container">
                    <button onclick="deleteTask(${id}); return false" class="task-overview-btn" onmouseover="highlightEditTaskButton('delete')" onmouseleave="turnEditTaskButtonOff('delete')">
                       <img id="delete-icon" src="./assets/img/delete.png" alt=""> 
                       <img id="delete-icon-light-blue" class="d-none" src="./assets/img/delete-light-blue.png" alt="">
                       Delete
                    </button>
                    <span style="height: 100%; width:2px; background: #D1D1D1"></span>
                    <button onclick="editTask(${id}, '${priorityIcon}')"; class="task-overview-btn" onmouseover="highlightEditTaskButton('pencil')" onmouseleave="turnEditTaskButtonOff('pencil')">
                       <img id="pencil-icon" src="./assets/img/pencil.png" alt=""> 
                       <img id="pencil-icon-light-blue" class="d-none" src="./assets/img/pencil-light-blue.png" alt="">
                       Edit
                    </button>
                </div>
        </div>
        </div>
        <span id="delete-task-advice" class="advice-container"></span>
    `)
}

/**
 * Loads and displays the list of assignees for a task.
 * 
 * @param {number} id - The unique ID of the task.
 * @param {Object} selectedTask - The selected task object containing assignees information.
 */
function loadAssigneeList(id, selectedTask) {
    let assigneesList = document.getElementById(`task-assignedTo-list-${id}`);
    assigneesList.innerHTML = "";
    selectedTask.contacts.forEach(contact => {
        assigneesList.innerHTML += /*html*/ `
        <div class="badge-and-name-assignees-container-task-overview">
            <span style="background: ${contact.badge_color}" class="contact-badge-task-overview">${contact.first_name.charAt(0)}${contact.last_name.charAt(0)}</span>
            <span>${contact.first_name} ${contact.last_name}</span>
        </div>
        `;
    })
}

/**
 * Generates the HTML structure for editing a task.
 * 
 * @param {number} id - The unique ID of the task.
 * @param {Object} selectedTask - The selected task object containing details to edit.
 * @returns {string} - The HTML structure for the task edit form.
 */
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
            <button onfocus="editPriority('Urgent', event)" onmouseover="highlightBtnOnHover('urgent')" onmouseleave="turnTheBtnOffOnLeave('urgent')" id="edit-task-urgent-btn" class="prio-btn-edit-task">Urgent <img id="urgent-icon" src="./assets/img/urgent.png" alt=""></button>
            <button onfocus="editPriority('Medium', event)" onmouseover="highlightBtnOnHover('medium')" onmouseleave="turnTheBtnOffOnLeave('medium')" id="edit-task-medium-btn" class="prio-btn-edit-task">Medium <img id="medium-icon" src="./assets/img/medium.png" alt=""></button>
            <button onfocus="editPriority('Low', event)" onmouseover="highlightBtnOnHover('low')" onmouseleave="turnTheBtnOffOnLeave('low')" id="edit-task-low-btn" class="prio-btn-edit-task">Low <img id="low-icon" src="./assets/img/low.png" alt=""></button>
            </div>
        </div>
        <div class="assigned-to-container-task-overview">
           <span class="assigned-to-title">Assigned To:</span>
           <div class="input-search-assignee-container" onclick="showDropDownAssigneesEditTask(${id})">
                <span class="input-search-assignee">Select contact to assign</span>
                <img id="arrow-drop-down" class="arrow-drop-down" src="./assets/img/arrow_drop_down.png" alt="">
            </div>
            <div id="all-assignee-task-edit-container-${id}" class="all-assignee-task-edit-container">
                <!-- Assignees will be shown here -->
            </div>
        <div id="task-assignedTo-list-edit-task-${id}" class="task-assigned-to-list-edit-task">
            <!-- Assigned contacts for edit will be displayed here -->
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
                <!-- Subtasks for edit will be listed here -->
            </ul>
        </div>
        <div class="confirm-edit-task-btn-container">
           <button onclick="sendEditedTask(${id}, '${selectedTask.state}', '${selectedTask.category}')" class="confirm-edit-task-btn">Ok</button>
        </div>
    </div>
    </div>
    <span id="advice-container-edit-task" class="advice-container-edit-task d-none"></span>
  `)
}

/**
 * Generates HTML markup for adding a task overview.
 * @returns {string} The HTML markup for the task overview form.
 */
function addTaskOverviewHTML() {
    return /*html*/ `
    <div onclick="dontClose(event)" class="add-task-overview-wrapper">
      <div id="add-task-overview" class="add-task-overview">
        <div class="title-and-cross-icon-container">
            <h2 class="add-tasks-title">Add Tasks</h2>
            <img onclick="closeAddTaskOverview(event)" class="cross-icon" src="./assets/img/cross.png" alt="">
        </div>
        <form id="add-task-form" onsubmit="createTasks(event); return false">
                    <div class="form-container">
                        <div class="left-block">
                            <div class="label-and-writeField-container">
                                <label for="title">Title</label>
                                <input oninput="checkValidityOfFormInputs()" required id="title" minlength="3"
                                    class="input-title validation-element" type="text" placeholder="Enter a title..."
                                    name="title">
                            </div>
                            <div class="label-and-writeField-container">
                                <label for="description">Description</label>
                                <textarea oninput="checkValidityOfFormInputs()" required minlength="3" id="description"
                                    class="textarea validation-element" name="description"
                                    placeholder="Enter a description..." id=""></textarea>
                            </div>
                            <div class="assigned-to-container">
                                <label class="label-for-assigned-to" for="">Assigned To</label>
                                <div onclick="showAssigneesInTheDropDownMenu()" class="input-search-assignee-container">
                                    <span class="input-search-assignee">Select contact to assign</span>
                                    <img id="arrow-drop-down" class="arrow-drop-down"
                                        src="./assets/img/arrow_drop_down.png" alt="">
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
                                <input oninput="checkValidityOfFormInputs()" required id="date"
                                    class="input-date validation-element" type="date" name="due-date">
                            </div>
                            <div class="prio-container">
                                <span>Prio</span>
                                <div class="prio-buttons-container">
                                    <span onclick="fillButton('urgent')" onmouseover="fillBtnOnOver('urgent')"
                                        onmouseleave="blurPrioButton('urgent')" id="urgent-btn"
                                        class="urgent-btn prio-btn">Urgent <img class="prio-icon" id="urgent-icon"
                                            src="./assets/img/urgent.png" alt=""></span>
                                    <span onclick="fillButton('medium')" onmouseover="fillBtnOnOver('medium')"
                                        onmouseleave="blurPrioButton('medium')" id="medium-btn"
                                        class="medium-btn prio-btn">Medium <img class="prio-icon" id="medium-icon"
                                            src="./assets/img/medium.png" alt=""></span>
                                    <span onclick="fillButton('low')" onmouseover="fillBtnOnOver('low')"
                                        onmouseleave="blurPrioButton('low')" id="low-btn" class="low-btn prio-btn">Low
                                        <img class="prio-icon" id="low-icon" src="./assets/img/low.png" alt=""></span>
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
                                    <input id="input-subtask" minlength="3" class="input-subtask"
                                        placeholder="Add new subtask" type="text">
                                    <div class="icons-subtask-container">
                                        <img id="add-icon" class="subtask-icon" src="./assets/img/add-blue.png" alt="">
                                        <div id="cross-and-check-icons-container"
                                            class="cross-and-check-icons-container d-none">
                                            <img onclick="clearAddSubtaskInput(event)" class="subtask-icon"
                                                src="./assets/img/cross.png" alt="">
                                            <img onclick="addSubtasks(event)" class="subtask-icon"
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
                    <button onclick="clearAddTaskForm()" onmouseover="highlightClearButton()"
                            onmouseleave="turnClearBtnOff()" class="form-btn-guest-login">
                            Clear
                            <img id="cross-icon-black" src="./assets/img/cross.png" class="cross-icon-clear-task"
                                alt="">
                            <img id="cross-icon-light-blue" class="cross-icon-clear-task d-none"
                                src="./assets/img/cross-light-blue.png" alt="">
                        </button>
                        <button id="submit-btn" type="submit" disabled="true" class="form-btn">
                            Create Task
                            <img src="./assets/img/check-white.png" class="check-icon-clear-task" alt="">
                        </button>
                    </div>
                </form>
        </div>
    </div>
    `
}

/**
 * Generates HTML markup for a checked assignee in task overview.
 * @param {number} j - The index of the assignee.
 * @param {Object} assignee - The assignee object containing details like first name, last name, and badge color.
 * @returns {string} The HTML markup for the checked assignee.
 */
function assigneeCheckedHTML(j, assignee) {
    return /*html*/ `
        <div onclick="selectAssigneesForEditTask(${j})" id="assignee-edit-task${j}" class="assignee">
            <span style="background: ${assignee.badge_color}" class="contact-badge-task-overview">${assignee.first_name.charAt(0)}${assignee.last_name.charAt(0)}</span>
            <span class="assignee-name">${assignee.first_name} ${assignee.last_name}</span>
            <input id="input-checkbox-assignees-edit-task${j}" type="checkbox" checked="true">
        </div>
    `
}

/**
 * Generates HTML markup for a non-checked assignee in task overview.
 * @param {number} j - The index of the assignee.
 * @param {Object} assignee - The assignee object containing details like first name, last name, and badge color.
 * @returns {string} The HTML markup for the non-checked assignee.
 */
function assigneeNoCheckedHTML(j, assignee) {
    return /*html*/ `
        <div onclick="selectAssignees(${j})" id="assignee-edit-task${j}" class="assignee">
            <span class="contact-badge-task-overview" style="background:${assignee.badge_color}">${assignee.first_name.charAt(0)}${assignee.last_name.charAt(0)}</span>
            <span>${assignee.first_name} ${assignee.last_name}</span>
            <input id="input-checkbox-assignees${j}" type="checkbox">
        </div>
    `
}

/**
 * Generates HTML markup for a checked subtask in task overview.
 * @param {number} i - The index of the subtask.
 * @param {number} id - The task ID related to the subtask.
 * @param {Object} subtask - The subtask object containing details like title.
 * @returns {string} The HTML markup for the checked subtask.
 */
function subtaskForTaskOverviewHTMLChecked(i, id, subtask) {
    return /*html*/`
    <div class="checkbox-and-subtaskTitle-container-task-overview">
       <input onclick="updateTaskRelatedSubtask(${i}, ${id}, this)" type="checkbox" checked="true">
       <span>${subtask.title}</span>
    </div>
      `
}

/**
 * Generates HTML markup for a non-checked subtask in task overview.
 * @param {number} i - The index of the subtask.
 * @param {number} id - The task ID related to the subtask.
 * @param {Object} subtask - The subtask object containing details like title.
 * @returns {string} The HTML markup for the non-checked subtask.
 */
function subtaskForTaskOverviewHTMLNoChecked(i, id, subtask) {
    return /*html*/`
    <div class="checkbox-and-subtaskTitle-container-task-overview">
       <input onclick="updateTaskRelatedSubtask(${i}, ${id}, this)" type="checkbox">
       <span>${subtask.title}</span>
    </div>
      `
}

/**
 * Generates HTML markup for a subtask in the task overview for editing.
 * @param {number} i - The index of the subtask.
 * @param {number} taskId - The task ID related to the subtask.
 * @param {Object} subtask - The subtask object containing details like title.
 * @returns {string} The HTML markup for the subtask in the edit task overview.
 */
function subtaskForEditTaskOverview(i, taskId, subtask) {
    return /*html*/ `
    <div onmouseover="highlightContainerAndIcons(${i})" onmouseleave="turnhighlightContainerAndIconsOff(${i})" id="subtask-edit-task-overview-container${i}" class="subtask-edit-task-overview-container">
            <li id="subtask-edit-task-overview${i}" contenteditable="false" class="subtask-edit-task-overview">
                   ${subtask.title}
                </li>
                <div class="icon-edit-subtask-container">
                    <img onclick="editSubtaskEditOverview(${i}, event)" id="pencil-icon-edit${i}" class="icon-edit-subtask" src="./assets/img/pencil.png" alt="">
                    <img onclick="updateTitleTaskRelatedSubtask(${i}, ${taskId}, event)" id="check-icon-edit${i}" class="icon-edit-subtask d-none" src="./assets/img/check-small.png" alt="">
                    <span id="icon-separator-edit-subtask${i}" class="icon-separator-edit-subtask"></span>
                    <img onclick="deleteSubtaskEditTask(${i}, ${taskId}, event)" id="delete-icon-edit${i}" class="icon-edit-subtask" src="./assets/img/delete.png" alt="">
                </div>
    </div>
 `
}

