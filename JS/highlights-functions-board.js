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
        addOrRemoveHighlihtsIfTheButtonIsNotFocused(btn, priority);
    }
}

function addOrRemoveHighlihtsIfTheButtonIsNotFocused(btn, priority) {
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