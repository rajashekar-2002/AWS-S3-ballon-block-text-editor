//paste-gist.js


document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');

    // Handle paste event in the editor
    editor.addEventListener('paste', async (event) => {
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedData = clipboardData.getData('text');

        if (isGistUrl(pastedData)) {
            event.preventDefault(); // Prevent the default paste action

            const activeParagraph = document.querySelector('.activeParagraph');

            if (activeParagraph) {
                showLoadingSpinner(activeParagraph); // Show the loading spinner
            }

            try {
                const gistContent = await fetchGistContent(pastedData);
                
                if (activeParagraph) {
                    activeParagraph.innerHTML = ''; // Clear the paragraph content
                }

                insertCodeBlock(gistContent, pastedData);
            } catch (error) {
                console.error('Failed to fetch Gist content:', error);
                
                if (activeParagraph) {
                    activeParagraph.innerHTML = ''; // Clear the paragraph content
                }

                insertPlainText(pastedData); // Insert URL as plain text
            }
        } else {
            insertPlainText(pastedData); // Insert URL as plain text
        }
    });
});

export function isGistUrl(url) {
    // Validate if the URL is a Gist URL
    const gistPattern = /^https:\/\/gist\.github\.com\/[^\/]+\/([a-f0-9]+)$/;
    return gistPattern.test(url);
}

export async function fetchGistContent(url) {
    const gistId = url.match(/^https:\/\/gist\.github\.com\/[^\/]+\/([a-f0-9]+)$/)[1];
    const apiUrl = `https://api.github.com/gists/${gistId}`;

    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Network response was not ok');

    const gistData = await response.json();
    const fileContent = Object.values(gistData.files)[0].content;

    await new Promise(resolve => setTimeout(resolve, 5000));

    return fileContent;
}

export function insertCodeBlock(content, url) {
    const codeElement = document.createElement('pre');
    const codeText = document.createElement('code');
    codeText.textContent = content;
    codeElement.appendChild(codeText);

    // Create a div element with a link to the Gist URL
    const gistContainerDiv = document.createElement('div');
    gistContainerDiv.className = 'gist-container-div';
    gistContainerDiv.setAttribute('contenteditable', 'false'); // Make div non-editable

    // Create the GitHub icon and text
    const gistLinkText = document.createElement('span');
    gistLinkText.className = "gist-github";
    gistLinkText.innerHTML = '<i class="fa fa-github" aria-hidden="true"></i> GitHub Gist';

    // Create the button to open the Gist
    const gistButton = document.createElement('button');
    gistButton.className = 'gist-button';
    gistButton.innerHTML = 'Open Gist';
    gistButton.addEventListener('click', () => {
        window.open(url, '_blank');
    });

    // Append elements to the gistContainerDiv
    gistContainerDiv.appendChild(gistLinkText);
    gistContainerDiv.appendChild(gistButton);

    // Insert the gistContainerDiv before the codeElement
    const containerDiv = document.createElement('div');
    containerDiv.className = 'gist-wrapper';
    containerDiv.appendChild(gistContainerDiv);
    containerDiv.appendChild(codeElement);

    // Insert the containerDiv into the editor
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Clear any selected content
        range.insertNode(containerDiv); // Insert the container with div and code block
    } else {
        editor.appendChild(containerDiv); // If no selection, just append the container
    }
}

export function insertPlainText(text) {
    const textNode = document.createTextNode(text);

    // Insert the plain text into the editor
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Clear any selected content
        range.insertNode(textNode); // Insert the plain text
    } else {
        editor.appendChild(textNode); // If no selection, just append the plain text
    }
}

function showLoadingSpinner(paragraph) {
    // Create a div to center the spinner button
    const spinnerContainer = document.createElement('div');
    spinnerContainer.style.display = 'flex';
    spinnerContainer.style.justifyContent = 'center';
    spinnerContainer.style.alignItems = 'center';
    spinnerContainer.style.height = '100%'; // Optional, adjust if necessary

    const spinnerButton = document.createElement('button');
    spinnerButton.className = 'btn btn-primary';
    spinnerButton.setAttribute('type', 'button');
    spinnerButton.setAttribute('disabled', true);
    spinnerButton.innerHTML = `
        <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
        Loading gist
    `;

    spinnerContainer.appendChild(spinnerButton); // Append the spinner button to the container
    paragraph.innerHTML = ''; // Clear the paragraph content
    paragraph.appendChild(spinnerContainer); // Append the centered container to the paragraph
}
