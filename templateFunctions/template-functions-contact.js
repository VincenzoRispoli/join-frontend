/**
 * Generates HTML structure for displaying a contact list section, grouped by the specified letter.
 * 
 * @param {string} letter - The letter used to categorize the contact list (e.g., "A", "B", "C").
 * @returns {string} The HTML string representing the contact list section for the given letter.
 */
function generateContactListHTML(letter) {
    return (
        /*html*/ `
        <div id="letter-container${letter}" class="letter-container">
           <span id="${letter}" class="letter">${letter}</span>
            <div id="contacts-for-specific-letter-container${letter}" class="contacts-for-specific-letter-container">
            </div>
        </div>
        `
    )
}

/**
 * Generates HTML structure for a single contact item.
 * 
 * @param {number} j - The index of the contact in the contact list.
 * @param {Object} contact - The contact object containing contact details.
 * @param {string} contact.first_name - The first name of the contact.
 * @param {string} contact.last_name - The last name of the contact.
 * @param {string} contact.email - The email address of the contact.
 * @param {string} contact.badge_color - The color code for the contact badge.
 * @param {string} contactInitials - The initials derived from the contact's first and last names.
 * @returns {string} The HTML string representing the individual contact item.
 */
function generateContactHTML(j, contact, contactInitials) {
    return (/*html*/ `
        <div onclick="showContactInTheDetails(${j})" id="contact${j}" class="contact">
            <span class="contact-badge" style="background:${contact.badge_color};">${contactInitials}</span>
            <div class="name-and-email-container">
                <span class="contact-name">${contact.first_name} ${contact.last_name}</span>
                <span class="contact-email">${contact.email}</span>
            </div>
        </div>      
        `)
}

/**
 * Generates the HTML structure to display the detailed contact information.
 * 
 * @param {number} contactId - The ID of the selected contact.
 * @param {Object} selectedContact - The contact object containing full details of the selected contact.
 * @param {string} initials - The initials derived from the contact's first and last names.
 * @returns {string} The HTML string representing the contact details view.
 */
function showContactDetailsHTML(contactId, selectedContact, initials) {
    return (
        /*html*/ `
        <div class="contact-badge-and-name-container">
                <span class="contact-details-badge" style="background: ${selectedContact.badge_color}">${initials}</span>
                <div class="name-and-buttons-contact-details-container">
                    <h2 id="contact-details-name" class="contact-details-name">${selectedContact.first_name} ${selectedContact.last_name}</h2>
                    <div id="btn-contacts-details-container" class="btn-contacts-details-container right-200">
                        <span onclick="showEditContactOverview(${contactId})" class="btn-contact-detail"><img src="./assets/img/pencil.png" alt=""> Edit</span>
                        <span onclick="deleteContact(${contactId})" class="btn-contact-detail"><img src="./assets/img/delete.png" alt="">Delete </span>
                    </div>
                </div>
        </div>
        <span id="permission-error-advice-edit-contact" style="color:red; font-size:21px"></span>
        <span class="contact-info-title">Contact Information</span>
        <div class="email-and-phone-container">
            <h3>Email</h3>
            <a class="email-text" href="mailto:${selectedContact.email}">${selectedContact.email}</a>
            <h3>Phone</h3>
            <a class="phone-text" href="tel:+49${selectedContact.phone}">+49 ${selectedContact.phone}</a>
        </div>
        <div onclick="showEditOrDeleteContactBtnMobile(event)" class="edit-contact-mobile-button"><img class="ellipse-icon" src="./assets/img/more_vert.png" alt=""></div>
        `
    )
}

/**
 * Generates the HTML structure for editing a contact's details.
 * 
 * @param {number} contactId - The ID of the contact being edited.
 * @returns {string} The HTML string representing the contact edit view.
 */
function editContactOverviewHTML(contactId) {
    return /*html*/ `
            <div id="edit-contact-overlay" class="add-contact-overlay" onclick="stopPropagation(event)">
                <div class="add-contact-overlay-left-side">
                    <div class="left-side-content-container">
                        <div class="join-logo-container">
                            <img src="./assets/img/logo-small-white.png" alt="">
                        </div>
                        <h2>Edit Contact</h2>
                        <span class="vector"></span>
                    </div>
                </div>
                <div class="add-contact-overlay-rigth-side">
                    <div class="right-side-content-container">
                        <span class="cross-icon-container">
                            <img onclick="closeContactOverlay('opacity-edit-contact-overlay')" id="cross-icon-edit-contact-overlay" class="cross-icon" src="./assets/img/cross.png"
                                alt="">
                        </span>
                        <div class="badge-and-add-form-container">
                            <div class="badge-main-container">
                                <div class="badge-container">
                                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <mask id="mask0_71395_17941" style="mask-type:alpha" maskUnits="userSpaceOnUse"
                                            x="0" y="0" width="64" height="64">
                                            <rect width="64" height="64" fill="#D9D9D9" />
                                        </mask>
                                        <g mask="url(#mask0_71395_17941)">
                                            <path
                                                d="M32.0001 32.0001C29.0667 32.0001 26.5556 30.9556 24.4667 28.8667C22.3779 26.7779 21.3334 24.2667 21.3334 21.3334C21.3334 18.4001 22.3779 15.889 24.4667 13.8001C26.5556 11.7112 29.0667 10.6667 32.0001 10.6667C34.9334 10.6667 37.4445 11.7112 39.5334 13.8001C41.6223 15.889 42.6667 18.4001 42.6667 21.3334C42.6667 24.2667 41.6223 26.7779 39.5334 28.8667C37.4445 30.9556 34.9334 32.0001 32.0001 32.0001ZM48.0001 53.3334H16.0001C14.5334 53.3334 13.2779 52.8112 12.2334 51.7668C11.189 50.7223 10.6667 49.4668 10.6667 48.0001V45.8667C10.6667 44.3556 11.0556 42.9667 11.8334 41.7001C12.6112 40.4334 13.6445 39.4667 14.9334 38.8001C17.689 37.4223 20.489 36.389 23.3334 35.7001C26.1779 35.0112 29.0667 34.6667 32.0001 34.6667C34.9334 34.6667 37.8223 35.0112 40.6667 35.7001C43.5112 36.389 46.3112 37.4223 49.0667 38.8001C50.3556 39.4667 51.389 40.4334 52.1667 41.7001C52.9445 42.9667 53.3334 44.3556 53.3334 45.8667V48.0001C53.3334 49.4668 52.8112 50.7223 51.7668 51.7668C50.7223 52.8112 49.4668 53.3334 48.0001 53.3334ZM16.0001 48.0001H48.0001V45.8667C48.0001 45.3779 47.8779 44.9334 47.6334 44.5334C47.389 44.1334 47.0667 43.8223 46.6667 43.6001C44.2668 42.4001 41.8445 41.5001 39.4001 40.9001C36.9556 40.3001 34.489 40.0001 32.0001 40.0001C29.5112 40.0001 27.0445 40.3001 24.6001 40.9001C22.1556 41.5001 19.7334 42.4001 17.3334 43.6001C16.9334 43.8223 16.6112 44.1334 16.3667 44.5334C16.1223 44.9334 16.0001 45.3779 16.0001 45.8667V48.0001ZM32.0001 26.6667C33.4667 26.6667 34.7223 26.1445 35.7668 25.1001C36.8112 24.0556 37.3334 22.8001 37.3334 21.3334C37.3334 19.8667 36.8112 18.6112 35.7668 17.5667C34.7223 16.5223 33.4667 16.0001 32.0001 16.0001C30.5334 16.0001 29.2779 16.5223 28.2334 17.5667C27.189 18.6112 26.6667 19.8667 26.6667 21.3334C26.6667 22.8001 27.189 24.0556 28.2334 25.1001C29.2779 26.1445 30.5334 26.6667 32.0001 26.6667Z"
                                                fill="white" />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <form onsubmit="editContact(${contactId}); return false">
                                <span class="add-contact-input-container">
                                    <input id="input-first-name-${contactId}" class="add-contact-input" placeholder="First Name" type="text">
                                    <img class="input-icon" src="./assets/img/person-icon.png" alt="">
                                </span>
                                <span style="color:red" class="error-add-contact-advice" id="error-advice-edit-contact-first-name"></span>
                                <span class="add-contact-input-container">
                                    <input id="input-last-name-${contactId}" class="add-contact-input" placeholder="Last Name" type="text">
                                    <img class="input-icon" src="./assets/img/person-icon.png" alt="">
                                </span>
                                <span style="color:red" class="error-add-contact-advice" id="error-advice-edit-contact-last-name"></span>
                                <span class="add-contact-input-container">
                                    <input id="input-email-${contactId}" class="add-contact-input" placeholder="Email" type="email">
                                    <img class="input-icon" src="./assets/img/mail-icon.png" alt="">
                                </span>
                                <span style="color:red" class="error-add-contact-advice" id="error-advice-edit-contact-email"></span>
                                <span class="add-contact-input-container">
                                    <input id="input-phone-${contactId}" class="add-contact-input" type="number">
                                    <img class="input-icon" src="./assets/img/phone-icon.png" alt="">
                                </span>
                                <span style="color:red" class="error-add-contact-advice" id="error-advice-edit-contact-phone"></span>
                                <span class="add-contact-overlay-btn-container">
                                    <button onclick="deleteContact(${contactId});return false" class="cancel-btn">Delete</button>
                                    <button type="submit" class="create-contact-btn">Save <img class="check-icon-add-contact" src="./assets/img/check-white.png" alt=""></button>
                                </span>
                            </form>
                        </div>
                    </div>
                </div>
        </div>
   `
}