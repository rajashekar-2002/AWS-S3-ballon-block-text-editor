//search and replace

// Function to highlight search term and create buttons
function highlightSearchTerm() {
    const searchTerm = document.getElementById('searchTerm').value.trim();
    const paraContainers = document.querySelectorAll('.para-container');
    const searchContainer = document.getElementById('search-container');

    // Clear previous search results
    searchContainer.innerHTML = '';

    if (searchTerm === '') {
        return; // Exit if the search term is empty
    }

    // Create a regex for case-insensitive matching
    const regex = new RegExp(searchTerm, 'gi');

    let totalMatches = 0; // To count total number of matches
    let hasMatch = false; // To check if at least one match is found

    paraContainers.forEach((container, containerIndex) => {
        // const paragraph = container.querySelector('p[contenteditable="true"]');
        const paragraph = container.querySelector('p.para-container-paragraph');




        if (paragraph) {
            const text = paragraph.textContent; // Use textContent to avoid HTML tags
            const matches = text.match(regex); // Check if the search term is present

            if (matches) {
                hasMatch = true; // Set to true if there is a match
                totalMatches += matches.length; // Increment total matches

                // Create a button for the search result
                const button = document.createElement('button');
                button.className = 'search-result-button';
                const highlightedText = text.replace(regex, match => `<span class="highlight-button">${match}</span>`); // Highlight the matched term
                const buttonText = getButtonText(highlightedText, searchTerm, matches.length); // Get the button text
                button.innerHTML = buttonText;
                button.value = containerIndex; // Use the container index as the value
                button.addEventListener('click', () => {
                    findParagraphByPositionForSearchAndReplace(button.value);
                });

                const resultDiv = document.createElement('div');
                resultDiv.appendChild(button);
                searchContainer.appendChild(resultDiv);

                const searchreplacecollapse = document.getElementsByClassName("search-replace-collapse")[0];

                // Determine if the checkbox is checked or not
                if (!searchreplacecollapse.checked) {
                    // console.log(`Checkbox with ID ${searchreplacecollapse.id} is open.`);
                    searchreplacecollapse.checked = true;
                } 
            }
        }
    });

    // If no matches found, display a message
    if (!hasMatch) {
        searchContainer.innerHTML = '<div>No matches found.</div>';
    } else {
        // Display total number of matches
        const totalMatchesDiv = document.createElement('div');
        totalMatchesDiv.classList.add("total-search-count");
        totalMatchesDiv.innerHTML = `<span class="badge badge-primary " style=" margin-bottom: 10px;">${totalMatches}</span> total matches found.`;

        searchContainer.prepend(totalMatchesDiv);
    }
}

// Function to find a paragraph by position
function findParagraphByPositionForSearchAndReplace(containerIndex) {
    const paraContainers = document.querySelectorAll('.para-container');

    if (containerIndex >= 0 && containerIndex < paraContainers.length) {
        const targetContainer = paraContainers[containerIndex];
        // const targetParagraph = targetContainer.querySelector('p[contenteditable="true"]');
        const targetParagraph = targetContainer.querySelector('p.para-container-paragraph');


        if (targetParagraph) {
            console.log(`Found <p> tag in container ${containerIndex}:`, targetParagraph);

            targetParagraph.scrollIntoView({ behavior: 'smooth', block: 'center' });

            targetParagraph.classList.add('shine-effect');
            targetParagraph.addEventListener('animationend', () => {
                targetParagraph.classList.remove('shine-effect');
            }, { once: true });

            return targetParagraph;
        }
    }

    console.log(`Container index ${containerIndex} is out of range.`);
    return null;
}

// Add event listener for input on the search field
document.getElementById('searchTerm').addEventListener('input', highlightSearchTerm);

// Function to replace text
document.getElementById('replaceButton').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchTerm').value.trim();
    const replaceTerm = document.getElementById('replaceTerm').value;
    const paraContainers = document.querySelectorAll('.para-container');

    if (searchTerm === '') {
        return; // Exit if the search term is empty
    }

    // Create a regex for case-insensitive matching
    const regex = new RegExp(searchTerm, 'gi');

    paraContainers.forEach(container => {
        // const paragraph = container.querySelector('p[contenteditable="true"]');
        const paragraph = container.querySelector('p.para-container-paragraph');

        if (paragraph) {
            const newText = paragraph.innerHTML.replace(regex, replaceTerm); // Replace text

            // Update the paragraph's innerHTML with the replaced text
            paragraph.innerHTML = newText;
        }
    });

    // After replacing, re-highlight the new text
    highlightSearchTerm();
});

// Helper function to escape HTML special characters
function escapeHTML(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// Function to get the button text based on highlighted portions
function getButtonText(highlightedText, searchTerm, matchCount) {
    const regex = new RegExp(`<span class="highlight-button">${searchTerm}</span>`, 'gi');
    const matches = highlightedText.match(regex);

    if (!matches) return escapeHTML(highlightedText); // Return escaped full text if no matches

    const parts = highlightedText.split(regex);
    let buttonText = '';
    const maxContextWords = 10;

    // Add the badge with the number of matches
    buttonText += `<span class="badge badge-primary" style="">${matchCount}</span> `;

    // Construct the button text ensuring all highlighted text is included
    for (let i = 0; i < parts.length; i++) {
        const part = escapeHTML(parts[i]); // Escape HTML in parts
        
        if (i > 0) {
            // Add the highlighted text
            buttonText += `<span class="highlight-button">${escapeHTML(searchTerm)}</span>`;
        }

        // Add some surrounding context
        const words = part.split(' ');
        if (i === 0) {
            // For the first part, include up to the last 10 words
            buttonText += words.slice(-maxContextWords).join(' ');
        } else if (i === parts.length - 1) {
            // For the last part, include up to the first 10 words
            buttonText += words.slice(0, maxContextWords).join(' ');
        } else {
            // For middle parts, include up to the first 10 words and the last 10 words
            buttonText += words.slice(0, maxContextWords).join(' ') + ' ... ' + words.slice(-maxContextWords).join(' ');
        }

        // Add ellipsis between parts
        if (i < parts.length - 1) {
            buttonText += ' ... ';
        }
    }

    // Trim any extra spaces
    return buttonText.trim();
}

