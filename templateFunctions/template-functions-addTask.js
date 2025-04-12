/**
 * Generates the HTML for an assignee.
 * 
 * This function creates a div element representing an assignee with their initials, name, 
 * and a checkbox for selection. The badge color is applied according to the assignee's 
 * `badge_color` property.
 * 
 * @param {number} i - The index of the assignee in the list.
 * @param {string} initials - The initials of the assignee to display in the badge.
 * @param {Object} assignee - The assignee object containing the details of the assignee.
 * @param {string} assignee.first_name - The first name of the assignee.
 * @param {string} assignee.last_name - The last name of the assignee.
 * @param {string} assignee.badge_color - The background color of the assignee's badge.
 * @returns {string} The HTML structure for the assignee.
 */
function assigneeHTML(i, initials, assignee) {
    return /*html*/ `
    <div onclick="selectAssignees(${i})" id="assignee${i}" class="assignee">
         <span class="assignee-badge" style="background:${assignee.badge_color}">${initials}</span>
         <span class="assignee-name">${assignee.first_name} ${assignee.last_name}</span>
         <input id="input-checkbox-assignees${i}" type="checkbox" name="checkbox" class="input-checkbox-assignees">
     </div>
   `
}

/**
 * Generates the HTML for a subtask.
 * 
 * This function creates a list item element for a subtask, displaying its title.
 * 
 * @param {number} i - The index of the subtask in the list.
 * @param {Object} subtask - The subtask object containing the details of the subtask.
 * @param {string} subtask.title - The title of the subtask.
 * @returns {string} The HTML structure for the subtask.
 */
function subtaskHTML(i, subtask) {
    return /*html*/ `
          <li id="subtask${i}">${subtask.title}</li>
          `
}