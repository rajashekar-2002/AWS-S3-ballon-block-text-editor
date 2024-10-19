//para-toolbox.js
import { updateToolboxButtons } from "./section.js";

document.addEventListener('DOMContentLoaded', () => {

    // Hide the toolbox if the user clicks outside
    document.addEventListener('click', (e) => {
        const paraContainer = document.querySelector('.para-container');
        if (!paraContainer || !paraContainer.contains(e.target)) {
            hideToolbox();
        }
    });
});




export function setActiveParagraph(paragraph) {
    // Get all paragraphs inside the container
    const allParagraphs = document.querySelectorAll('.para-container-paragraph');
    
    // Remove the class 'activeParagraph' from all paragraphs
    allParagraphs.forEach(p => p.classList.remove('activeParagraph'));
    
    // Add the class 'activeParagraph' to the specified paragraph
    paragraph.classList.add('activeParagraph');
    console.log('set active p',paragraph);
}



export function getActiveParagraph() {
    // Find and return the paragraph with the class 'activeParagraph'
    console.log("get active p",document.querySelector('.para-container-paragraph.activeParagraph'));
    return document.querySelector('.para-container-paragraph.activeParagraph');
}



let toolboxTimeout = null;


export function showToolbox(x, y, paraContainer) {
    const paragraph = paraContainer.querySelector('p');
    const paragraphText = paragraph.textContent.trim();
    setActiveParagraph(paragraph);
    clearTimeout(toolboxTimeout);

    // Check if the paragraph has any text content
    if (paragraphText !== '') {
        const toolbox = document.getElementById('para-toolbox');
        toolbox.style.display = 'flex';
        toolbox.style.left = `${x}px`;
        toolbox.style.top = `${y}px`;

        const toolboxRect = toolbox.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust position if the toolbox goes off-screen
        if (toolboxRect.right > viewportWidth) {
            toolbox.style.left = `${viewportWidth - toolboxRect.width}px`;
        }
        if (toolboxRect.bottom > viewportHeight) {
            toolbox.style.top = `${viewportHeight - toolboxRect.height}px`;
        }

        // Ensure the toolbox is hidden when the paragraph content changes
        paragraph.removeEventListener('input', hideToolboxOnInput);
        paragraph.addEventListener('input', hideToolboxOnInput);

        // Stop the timeout if the mouse is over the toolbox
        toolbox.removeEventListener('mouseover', stopHideTimeout);
        toolbox.addEventListener('mouseover', stopHideTimeout);

        // Restart the timeout when the mouse leaves the toolbox
        toolbox.removeEventListener('mouseout', restartHideTimeout);
        toolbox.addEventListener('mouseout', restartHideTimeout);

        // Ensure the toolbox is hidden if the user clicks elsewhere
        document.removeEventListener('click', handleClickOutside);
        document.addEventListener('click', handleClickOutside);

        // Update toolbox buttons
        updateToolboxButtons();

        // Start the hide timeout
        startHideTimeout();

    } else {
        hideToolbox(); // Hide the toolbox if the paragraph is empty
    }
}

export function hideToolbox() {
    let activeParagraph = getActiveParagraph();
    const toolbox = document.getElementById('para-toolbox');
    toolbox.style.display = 'none';
    if (activeParagraph) {
        activeParagraph.removeEventListener('input', hideToolboxOnInput);
    }
    clearTimeout(toolboxTimeout);
}

function hideToolboxOnInput() {
    hideToolbox();
}

function startHideTimeout() {
    toolboxTimeout = setTimeout(() => {
        hideToolbox();
    }, 4000);
}

function stopHideTimeout() {
    clearTimeout(toolboxTimeout);
}

function restartHideTimeout() {
    if (document.getElementById('para-toolbox').style.display === 'flex') {
        startHideTimeout();
    }
}

function handleClickOutside(event) {
    let activeParagraph = getActiveParagraph();
    const toolbox = document.getElementById('para-toolbox');
    if (!toolbox.contains(event.target) && !activeParagraph.contains(event.target)) {
        hideToolbox();
    }
}




