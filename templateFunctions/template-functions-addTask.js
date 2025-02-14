function assigneeHTML(i, initials, assignee) {
    return /*html*/ `
    <div id="assignee${i}" class="assignee">
         <span class="assignee-badge" style="background:${assignee.badge_color}">${initials}</span>
         <span class="assignee-name">${assignee.first_name} ${assignee.last_name}</span>
         <input onchange="selectAssignees(${i}, this)" type="checkbox" name="checkbox" class="input-checkbox">
     </div>
   `
}

function subtaskHTML(i, subtask) {
    return /*html*/ `
          <li id="subtask${i}">${subtask.title}</li>
          `
}