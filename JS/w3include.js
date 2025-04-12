/**
 * Loads HTML content into elements with the attribute `w3-include-html` by fetching the specified files.
 * This function returns a Promise that resolves once all the elements have been loaded with their respective content.
 * 
 * @returns {Promise} A Promise that resolves once all elements are loaded with content.
 */
function includeHTML() {
    return new Promise((resolve) => {
        // HTML elements loading
        let elements = document.querySelectorAll('[w3-include-html]');
        let total = elements.length; // Total number of elements to be loaded
        let loaded = 0; // Counter for the number of loaded elements

        // Iterate over each element with the `w3-include-html` attribute
        elements.forEach((el) => {
            let file = el.getAttribute('w3-include-html'); // Get the file URL from the element's attribute
            fetch(file)
                .then(response => response.text()) // Fetch the content of the file
                .then(data => {
                    el.innerHTML = data; // Insert the fetched content into the element
                    el.removeAttribute('w3-include-html'); // Remove the attribute after loading
                    loaded++; // Increment the loaded counter
                    if (loaded === total) {
                        resolve(); // Resolve the Promise when all elements are loaded
                    }
                })
                .catch(error => {
                    console.error('Error loading:', error); // Log an error if the fetch fails
                    loaded++; // Increment the loaded counter to avoid an infinite waiting loop
                    if (loaded === total) {
                        resolve(); // Resolve even if there's an error, as we want to handle the situation
                    }
                });
        });

        // Resolve the Promise immediately if there are no elements to load
        if (total === 0) {
            resolve();
        }
    });
}