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

function generateContactHTML(j,contact, contactInitials) {
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

function showContactDetailsHTML(selectedContact, initials) {
    return (
        /*html*/ `
        <div class="contact-badge-and-name-container">
                <span class="contact-details-badge" style="background: ${selectedContact.badge_color}">${initials}</span>
                <div class="name-and-buttons-contact-details-container">
                    <h2 id="contact-details-name" class="contact-details-name">${selectedContact.first_name} ${selectedContact.last_name}</h2>
                    <div class="btn-contacts-details-container">
                        <span>Edit <img src="" alt=""></span>
                        <span>Delete <img src="" alt=""></span>
                    </div>
                </div>
        </div>
        <span class="contact-info-title">Contact Information</span>
        <div class="email-and-phone-container">
            <h3>Email</h3>
            <a href="mailto:${selectedContact.email}">${selectedContact.email}</a>
            <h3>Phone</h3>
            <a href="tel:${selectedContact.phone}">${selectedContact.phone}</a>
        </div>
        `
    )
}