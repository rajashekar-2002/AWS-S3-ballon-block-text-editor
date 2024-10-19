//anchorStructure.js

function findParagraphByPositionForAnchorStructure(position) {
    // List all <p> tags within .para-container
    // const paragraphs = Array.from(document.querySelectorAll('.para-container p'));
    // const paragraphs = Array.from(document.querySelectorAll('.para-container p[contenteditable="true"]'));
    const paragraphs = Array.from(document.querySelectorAll('.para-container p.para-container-paragraph'));



    // Find the <p> tag that matches the position
    if (position > 0 && position <= paragraphs.length) {
        const targetParagraph = paragraphs[position - 1]; // Adjust for zero-based index
        console.log(`Found <p> tag at position ${position}:`, targetParagraph);

        // Scroll to the target paragraph
        targetParagraph.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // targetParagraph.classList.add('shine-effect');
        targetParagraph.classList.add('shine-effect');
        // Remove the shine effect class after the animation ends
        targetParagraph.addEventListener('animationend', () => {
            targetParagraph.classList.remove('shine-effect');
        }, { once: true }); // Use { once: true } to ensure the listener is removed after it runs

        return targetParagraph;
    } else {
        console.log(`Position ${position} is out of range.`);
        return null;
    }
}




export function RemoveEmptyTagsAfterRemovingEdit() {
    //this code is required when remove edit is click it may not completly remove inline elemnts present at end
    //remove any empty tags present after clear formating
    const structureContainer = document.getElementById('anchor-structure-container');
    structureContainer.innerHTML = ''; // Clear previous structure

    const sections = document.querySelectorAll('.para-container');
    sections.forEach((section, index) => {
        const paragraph = section.querySelector('p');

        if (paragraph) {
            // Function to remove empty tags
            const removeEmptyTags = (node) => {
                const tagsToRemove = ['B', 'BUTTON'];
                const children = Array.from(node.childNodes);

                children.forEach(child => {
                    if (child.nodeType === 1) { // Element node
                        removeEmptyTags(child); // Recursively check child nodes

                        // Remove the element if it's empty and matches the tags to remove
                        if (tagsToRemove.includes(child.nodeName) && !child.textContent.trim()) {
                            node.removeChild(child);
                        }
                    }
                });
            };

            // Remove empty <b>, <i>, and <button> tags from the paragraph
            removeEmptyTags(paragraph);

            // Add the paragraph content to the structure container for demonstration purposes
            const paragraphContent = document.createElement('div');
            paragraphContent.textContent = `Paragraph ${index + 1}: ${paragraph.textContent}`;
            structureContainer.appendChild(paragraphContent);
        }
    });
}





let linkcountvar=0;
export function buildAnchorStructure() {
    const structureContainer = document.getElementById('anchor-structure-container');
    let linkCountElement = document.getElementById("linkCount");
    structureContainer.innerHTML = ''; // Clear previous structure

    const sections = document.querySelectorAll('.para-container');
    sections.forEach((section, index) => {
        const paragraph = section.querySelector('p');

        if (paragraph) {
            const buttons = paragraph.querySelectorAll('button');
            
            buttons.forEach((button) => {
                // Handle normal buttons
                const url = button.getAttribute('title') || button.getAttribute('data-original-title');
                
                if (url) {
                    createNewButton(url, index, structureContainer, linkCountElement);
                }
            });

            // Handle youtube-preview-button
            const youtubeButtons = paragraph.querySelectorAll('.youtube-preview-button');
            
            youtubeButtons.forEach((youtubeButton) => {
                const iframe = youtubeButton.querySelector('.youtube-preview iframe');
                
                if (iframe) {
                    const url = iframe.getAttribute('src');
                    
                    if (url) {
                        createNewButton(url, index, structureContainer, linkCountElement);
                    }
                }
            });
        }
    });

    const anchortargetCheckbox = document.getElementsByClassName("anchor-structure-collapse")[0];

    // Determine if the checkbox is checked or not
    if (!anchortargetCheckbox.checked && structureContainer.innerHTML.trim().length > 0) {
        console.log(`Checkbox with ID ${anchortargetCheckbox.id} is open.`);
        anchortargetCheckbox.checked = true;
    }

    linkcountvar = structureContainer.querySelectorAll('button.anchor-container-button').length;

    if(linkcountvar > 0) {
        linkCountElement.textContent = ` | ${linkcountvar}`;
    }else{
        linkcountvar = 0;
        linkCountElement.textContent = ` `;
    }

}





function createNewButton(url, index, structureContainer, linkCountElement) {
    const newButton = document.createElement('button');
    
    // Create a span for the prefix
    // const prefixSpan = document.createElement('span');
    // prefixSpan.textContent = '-';
    // prefixSpan.style.wordBreak = 'break-word';
    // prefixSpan.style.whiteSpace = "wrap";
    // prefixSpan.style.marginRight = '10px';
    // prefixSpan.style.color = 'goldenrod';
    // prefixSpan.style.fontWeight = 'bold';
    // prefixSpan.style.fontSize = '30px';

    // Set the button text content after the prefix
    if (url.length > 70) {
        newButton.textContent = url.slice(0, 80) + '...';
    } else {
        newButton.textContent = url;
    }

    newButton.value = index + 1; // Set the value attribute to the current position
    newButton.style.all = 'unset'; // Remove all default button styling
    newButton.style.cursor = 'pointer'; // Set cursor to pointer
    newButton.classList.add('anchor-container-button');

    // Add click event listener to the new button
    newButton.addEventListener('click', () => {
        const pos = parseInt(newButton.value, 10); // Get position from button
        console.log(`Position: ${pos}, URL: ${url}`);
        findParagraphByPositionForAnchorStructure(pos); // Find and log the paragraph
    });

    // Append the prefix span and the text content to the button
    // newButton.prepend(prefixSpan);

    // Append the new button to the structure container
    structureContainer.appendChild(newButton);
    // Update link count element
    linkCountElement.textContent = ` | ${structureContainer.getElementsByTagName("button").length}`;
}





