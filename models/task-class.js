class Task {
    title
    description
    due_date
    category
    priority
    contacts_ids
    state

    constructor(title, description, category, due_date, priority, contacts_ids, state) {
        this.title = title
        this.description = description
        this.due_date = due_date
        this.category = category
        this.priority = priority
        this.contacts_ids = contacts_ids
        this.state = state
    }
}