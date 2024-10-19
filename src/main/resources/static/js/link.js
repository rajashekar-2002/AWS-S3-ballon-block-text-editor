//link.js
import { addParagraph } from "./addParagraph.js";
import { RemoveEmptyTagsAfterRemovingEdit, buildAnchorStructure } from "./anchorStructure.js";
import { getActiveParagraph } from "./para-toolbox.js";

document.addEventListener('DOMContentLoaded', () => {
    const insertLinkBtn = document.getElementById('insert-link-btn');
    const linkUrlInput = document.getElementById('link-url');

    insertLinkBtn.addEventListener('click', () => {
        const url = linkUrlInput.value.trim();
        if (!url) {
            // alert('Please enter a valid URL.');
            return;
        }

        // Retrieve the stored selection details
        const details = window.lastSelectionDetails;
        if (!details || !details.range) {
            alert('No text is selected. Please select some text first.');
            return;
        }

        // Get the range from the selection details
        const range = details.range;

        // Check if the selected text contains a button element
        const selectedContent = range.cloneContents();
        const existingButton = selectedContent.querySelector('button');

        let button;
        if (existingButton) {
            // If a button exists in the selection, replace it
            button = existingButton;
            button.textContent = details.selectedText; // Update the text of the button
            button.setAttribute('title', url); // Update the tooltip with the new URL
            button.onclick = () => window.open(url, '_blank'); // Update the click handler
        } else {
            // Create a new button element
            button = document.createElement('button');
            button.textContent = details.selectedText; // Set the text of the button
            button.style.border = 'none'; // Remove border
            button.style.outline = 'none'; // Remove outline
            button.style.background = 'none'; // Remove background
            button.style.cursor = 'pointer'; // Change cursor to pointer
            button.style.color = "blue";
            button.setAttribute('data-toggle', 'tooltip');
            button.setAttribute('data-placement', 'top');
            button.setAttribute('title', url);

            // Add the redirection functionality
            button.addEventListener('click', () => {
                window.open(url, '_blank');
            });
        }

        // Replace the selected text or existing button with the updated/new button element
        range.deleteContents(); // Remove the selected text or existing button
        range.insertNode(button); // Insert the button element

        // Ensure the new button is not nested within another button
        const parentButton = button.parentElement.closest('button');
        if (parentButton) {
            parentButton.replaceWith(button); // Replace the parent button with the new button
        }


        // Clear the input field
        linkUrlInput.value = '';

        // Optional: Re-select the newly created/updated button element
        const selection = window.getSelection();
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNode(button);
        selection.addRange(newRange);
        selection.removeAllRanges();
        RemoveEmptyTagsAfterRemovingEdit();
        buildAnchorStructure();
        //updateVersionControl();

    });

});







let linkTimeout;

document.addEventListener('DOMContentLoaded', () => {
    const showLinkOptionsButton = document.getElementById('showLinkOptionsButton');
    const linkActionSelect = document.getElementById('link-actionselect');

    // Function to toggle the visibility of the dropdown menu
    const toggleLinkOptions = () => {
        linkActionSelect.style.display = linkActionSelect.style.display === 'none' ? 'block' : 'none';
        clearTimeout(linkTimeout); // Clear the timeout if options are manually closed
        if (linkActionSelect.style.display === 'block') {
            // Hide dropdown after 8 seconds if it's visible
            linkTimeout = setTimeout(() => {
                linkActionSelect.style.display = 'none'; // Hide dropdown after timeout
            }, 8000);
        }
    };

    // Add an empty option to reset the select element
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select link type';
    linkActionSelect.add(defaultOption, linkActionSelect.firstChild);
    linkActionSelect.value = '';

    // Hide the default option using CSS
    defaultOption.style.display = 'none';

    showLinkOptionsButton.addEventListener('click', toggleLinkOptions);

    linkActionSelect.addEventListener('change', () => {
        const selectedOption = linkActionSelect.value;

        if (selectedOption === 'openModal') {
            document.getElementById('openModal').click();
        } else if (selectedOption === 'embedLink') {
            document.getElementById('embed-link-button').click();
        }

        // Reset and hide the select element
        linkActionSelect.value = '';
        linkActionSelect.style.display = 'none';
        clearTimeout(linkTimeout); // Clear the timeout if an option is selected
    });

    // Stop the timeout if the mouse is over the dropdown
    linkActionSelect.addEventListener('mouseover', () => {
        clearTimeout(linkTimeout);
    });

    // Restart the timeout when the mouse leaves the dropdown
    linkActionSelect.addEventListener('mouseout', () => {
        if (linkActionSelect.style.display === 'block') {
            linkTimeout = setTimeout(() => {
                linkActionSelect.style.display = 'none'; // Hide dropdown after timeout
            }, 8000);
        }
    });
});

// Embed and link button function
document.getElementById('embed-link-button').addEventListener('click', async function(event) {
    let activeParagraph =getActiveParagraph();
    event.preventDefault();
    const selectedText = window.lastSelectionDetails.selectedText;
    const url = selectedText;

    // Get the pasted text
    let pastedText = url;

    // Add a new paragraph and set it as the preview container
    const newParagraph = addParagraph(activeParagraph.parentElement).querySelector('p');
    newParagraph.innerHTML = ''; // Clear any previous content

    // Determine the preview type and create the preview element
    let previewContainer = newParagraph;

    // Create a container for the preview
    let previewElement = document.createElement('div');
    previewElement.className = 'preview';

    // Add a delete button
    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => {
        previewElement.remove();
        if (loadingElement) loadingElement.remove(); // Remove loading if present
        controller.abort(); // Abort the fetch request
    });
    previewElement.appendChild(deleteButton);

    // Display loading status
    let loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.innerHTML = `
        <div class="loading-buttons">
            <button class="btn btn-primary" type="button" disabled>
                <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                <span class="sr-only">Loading...</span>
            </button>
            <button class="btn btn-danger" type="button" id="stop-button">
                <span class="" role="status" aria-hidden="true"></span>
                x stop
            </button>
        </div>
    `;
    previewElement.appendChild(loadingElement);
    previewContainer.appendChild(previewElement);

    // Create an AbortController to cancel the fetch request
    const controller = new AbortController();
    const { signal } = controller;

    document.getElementById('stop-button').addEventListener('click', () => {
        previewElement.remove();
        controller.abort(); // Abort the fetch request
    });

    try {
        if (pastedText.includes('youtube.com') || pastedText.includes('youtu.be')) {
            // Display YouTube video preview
            let videoId = getYouTubeVideoId(pastedText);
            if (videoId) {
                // Create a clickable button for the YouTube video
                const button = document.createElement('button');
                button.className = 'youtube-preview-button';
                button.innerHTML = `
                    <div class="youtube-preview">
                        <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
                        <div class="preview-content">
                            <h3>YouTube Video</h3>
                            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="video-link">Watch on YouTube</a>
                        </div>
                    </div>
                `;
                button.onclick = () => {
                    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                };
                previewElement.appendChild(button);
                loadingElement.remove();
                deleteButton.style.display = 'none'; // Hide delete button after loading
            }
        } else if (isValidURL(pastedText)) {
            // Display website preview card
            let data = await getLinkPreview(pastedText, signal);
            let faviconHtml = data.img ? `<img src="${data.img}" alt="${data.sitename} logo">` : '';

            // Create a clickable button for the website preview
            const button = document.createElement('button');
            button.className = 'website-preview-button';
            button.setAttribute('data-toggle', 'tooltip'); // Add data-toggle attribute
            button.setAttribute('data-placement', 'bottom'); // Add data-placement attribute
            button.title = data.url;
            button.innerHTML = `
                <div class="preview-content">
                    <h3>${data.title || data.sitename}</h3>
                    <p>${data.url}</p>
                </div>
                ${faviconHtml}
            `;
            button.onclick = () => {
                window.open(data.url, '_blank');
            };
            previewElement.appendChild(button);
            loadingElement.remove();
            deleteButton.style.display = 'none'; // Hide delete button after loading
        } else {
            loadingElement.innerHTML = '<p>Invalid URL try again</p>';
            const selection = window.getSelection();

            selection.removeAllRanges();
            deleteButton.style.display = 'none'; // Hide delete button after loading
        }
    } catch (error) {
        console.error('Error fetching preview:', error);
        loadingElement.innerHTML = '<p>Failed to fetch data.</p>';
        deleteButton.style.display = 'none'; // Hide delete button after error
    }

    // Clear any stored variables after use
    window.lastSelectionDetails = {};
    buildAnchorStructure();
});

// Link preview function
function getYouTubeVideoId(url) {
    let videoId = null;
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|watch\/|v=|.+\/)([^"&?\/\s]{11})|youtu\.be\/([^"&?\/\s]{11})/;
    const matches = url.match(regex);
    if (matches) {
        videoId = matches[1] || matches[2];
    }
    return videoId;
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

async function getLinkPreview(url, signal) {
    try {
        // Ensure the URL has a scheme
        let parsedUrl = new URL(url);
        if (!parsedUrl.protocol) {
            url = `https://${url}`;
            parsedUrl = new URL(url);
        }

        // Validate the URL scheme
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            throw new Error("Only 'http' and 'https' protocols are allowed.");
        }

        // Fetch the HTML content
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { signal });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        const html = data.contents;

        // Parse the HTML content
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Extract metadata
        const metaTags = doc.getElementsByTagName('meta');
        const linkTags = doc.getElementsByTagName('link');
        let title = doc.querySelector('title') ? doc.querySelector('title').textContent : '';
        let description = '';
        let img = '';
        let sitename = parsedUrl.hostname;
        let favicon = '';
        let ogImage = '';

        for (let meta of metaTags) {
            if (meta.getAttribute('property') === 'og:title' || meta.getAttribute('name') === 'og:title') {
                title = meta.getAttribute('content');
            }
            if (meta.getAttribute('property') === 'og:description' || meta.getAttribute('name') === 'og:description') {
                description = meta.getAttribute('content');
            }
            if (meta.getAttribute('property') === 'og:image' || meta.getAttribute('name') === 'og:image') {
                ogImage = meta.getAttribute('content');
            }
        }

        for (let link of linkTags) {
            if (link.getAttribute('rel') === 'icon' || link.getAttribute('rel') === 'shortcut icon') {
                favicon = link.getAttribute('href');
                if (favicon && !favicon.startsWith('http')) {
                    // Resolve relative favicon URLs
                    if (favicon.startsWith('/')) {
                        favicon = parsedUrl.origin + favicon;
                    } else {
                        favicon = parsedUrl.origin + '/' + favicon;
                    }
                }
            }
        }

        img = ogImage || favicon;

        return { title, description, img, sitename, url };
    } catch (error) {
        console.error('Failed to fetch link preview:', error);
        throw error;
    }
}


