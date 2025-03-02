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

function highlightTasksContainer(state, event) {
    event.preventDefault();
    document.getElementById(state).classList.add('dashed-border');
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