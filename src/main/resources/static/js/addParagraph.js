
import { printParagraphDetails } from './TextSelection.js';
import { buildAnchorStructure } from './anchorStructure.js';
import { handleDragBulletStart, handleDropBullet, hideBulletToolbox, removeSelectedClassFromBullets } from './bullet.js';
import { getActiveParagraph, hideToolbox, setActiveParagraph, showToolbox } from './para-toolbox.js';
import { buildStructure, validateStructure } from './section.js';
import { hideTableToolbox, unselectAllCells } from './table.js';
import { updateRangeSlider, updateVersionControl } from './versionControl.js';

import { sendDeleteRequest } from './image.js';


document.addEventListener('DOMContentLoaded', function() {
    addParagraph();

    const headingParagraph = document.getElementById('title-input');
    const subHeadingParagraph = document.getElementById('subtitle-input');

    function setPlaceholder(paragraph, placeholderText) {
        if (paragraph.innerText.trim() === '') {
            paragraph.innerText = placeholderText;
            paragraph.classList.add('placeholder');
        }
    }

    function removePlaceholder(paragraph) {
        if (paragraph.classList.contains('placeholder')) {
            paragraph.innerText = '';
            paragraph.classList.remove('placeholder');
        }
    }
    //enter innerText for title and subtitle
    setPlaceholder(headingParagraph, 'Enter heading...');
    setPlaceholder(subHeadingParagraph, 'Enter sub-heading...');

    headingParagraph.addEventListener('focus', function() {
        removePlaceholder(headingParagraph);
    });

    headingParagraph.addEventListener('blur', function() {
        setPlaceholder(headingParagraph, 'Enter heading...');
    });

    subHeadingParagraph.addEventListener('focus', function() {
        removePlaceholder(subHeadingParagraph);
    });

    subHeadingParagraph.addEventListener('blur', function() {
        setPlaceholder(subHeadingParagraph, 'Enter sub-heading...');
    });

    headingParagraph.addEventListener('input', function() {
        updateVersionControl();
    });

    subHeadingParagraph.addEventListener('input', function() {
        updateVersionControl();
    });



});





//mkae sure one dropdown is open at a time
// document.addEventListener('DOMContentLoaded', function () {
//     const checkboxes = document.querySelectorAll('input[type="checkbox"].tab');

//     checkboxes.forEach(checkbox => {
//         checkbox.addEventListener('change', function () {
//             if (this.checked) {
//                 checkboxes.forEach(otherCheckbox => {
//                     if (otherCheckbox !== this) {
//                         otherCheckbox.checked = false;
//                     }
//                 });
//             }
//         });
//     });
// });




let draggedItem = null;
// Function to create a new paragraph with drag, add, and delete features
export function addParagraph(afterElement = null, focus=false, classname= null) {
    const paraContainer = document.createElement('div');
    paraContainer.className = 'para-container';
    paraContainer.draggable = true;
    paraContainer.addEventListener('dragstart', onDragStart);
    paraContainer.addEventListener('dragend', onDragEnd);
    paraContainer.addEventListener('dragover', onDragOver);
    paraContainer.addEventListener('drop', onDrop);

    paraContainer.addEventListener('input',function(){
        hideBulletToolbox();
        hideTableToolbox();
        updateVersionControl();
        hideImageToolbox();
        unselectAllCells();
        removeSelectedClassFromBullets();
        setActiveParagraph(paraContainer.querySelector('p.para-container-paragraph'));


        //because of usinf contenteditable in p on clcik enter bullet is getting added by itself so enter event is not gettting trigger 
        // Check if there is a div with the class 'bullet-container' inside paraContainer
        const bulletContainer = paraContainer.querySelector('div.bullet-container');
    
        if (bulletContainer) {
        // Find all <li> elements inside the <ul> within the bullet-container
        const listItems = bulletContainer.querySelectorAll('ul > li');
        
        // Attach the drag event listeners to each <li> element
        listItems.forEach(newItem => {
            newItem.addEventListener('dragstart', handleDragBulletStart);
            newItem.addEventListener('dragover', handleDragBulletOver);
            newItem.addEventListener('drop', handleDropBullet);
            });
        }

                


    });



    // Add event listener for text selection
    paraContainer.addEventListener('mouseup', printParagraphDetails);

    //cntrl + a and tab
    paraContainer.addEventListener('keydown',   function (e) {
        // Check if Ctrl + A is pressed
        if (e.ctrlKey && e.key === 'a') {
            //e.preventDefault(); // Prevent the default browser action
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(paraContainer.querySelector('p'));
            selection.removeAllRanges();
            selection.addRange(range);
    
            setActiveParagraph( paraContainer.querySelector('p'));
            let activeParagraph=getActiveParagraph();
    
            window.lastSelectionDetails = {
                selectedText: activeParagraph.textContent,
                startOffset: 0,
                endOffset: activeParagraph.textContent.length,
                paragraphIndex: Array.from(document.querySelectorAll('.para-container p')).indexOf(activeParagraph) + 1, // Index of the <p> tag
                parentNode: activeParagraph,
                range: range // You can store the range for later use if needed
            };
    
            console.log("<><><><>", window.lastSelectionDetails);
        }
    
        if (e.key === 'Tab') {
            e.preventDefault(); // Prevent the default Tab behavior
    
            // Get the current selection
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const tabNode = document.createTextNode('\u00A0\u00A0\u00A0\u00A0'); // Non-breaking spaces
    
            // Insert the tabNode at the current cursor position
            range.insertNode(tabNode);
    
            // Create a new range to move the cursor after the inserted spaces
            const newRange = document.createRange();
            newRange.setStartAfter(tabNode);
            newRange.setEndAfter(tabNode);
    
            // Remove all ranges and add the new range
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    

            updateVersionControl();
        
        });

    const addBtn = document.createElement('div');
    addBtn.className = 'add-btn';
    addBtn.innerHTML = '+';
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        addParagraph(paraContainer);
    });

    const holder = document.createElement('div');
    holder.className = 'holder';
    holder.innerHTML = '⇅';

    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '✖';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteParagraph(paraContainer);
    });

    const p = document.createElement('p');
    p.contentEditable = true;
    p.classList.add( 'para-container-paragraph');
    p.innerHTML = '<br>';
    if(classname == null){
        p.addEventListener('keydown', onKeyDown);

        // Add click event listener to the paragraph container on code p and quote
        p.addEventListener('click', (e) => {

        if (p) {
            const isTextNode = e.target.nodeType === Node.TEXT_NODE || e.target.tagName === 'P' || e.target.tagName === 'CODE' || e.target.tagName === 'BLOCKQUOTE' ;

            if (isTextNode) {
                hideToolbox();
                showToolbox(e.clientX, e.clientY, paraContainer);
                e.stopPropagation(); // Prevent further propagation
            } else {
                hideToolbox(); // Hide toolbox if clicked on an image or table
            }
        } else {

            hideToolbox();
        }
    });
    }else{
        p.classList.add('bullet-list');
    }



    p.addEventListener('click',function(){
        hideBulletToolbox();
        hideTableToolbox();
        hideImageToolbox();
        // Check if the clicked paragraph contains a table element
        if (!p.querySelector('table')) {
            unselectAllCells();
        }
        setActiveParagraph(paraContainer.querySelector('p.para-container-paragraph'));
    })

    p.addEventListener('paste', handlePasteAsPlainText);

    paraContainer.appendChild(addBtn);
    paraContainer.appendChild(holder);
    paraContainer.appendChild(p);
    paraContainer.appendChild(deleteBtn);

    if (afterElement) {
        afterElement.after(paraContainer);
        if(focus){
        p.focus();
        }
        return paraContainer;
    } else {
        editor.appendChild(paraContainer);
    }

    p.focus();

    setActiveParagraph(p);
    
    return paraContainer; // Return the container to access it for further modifications


}



export function handlePasteAsPlainText(event) {
    event.preventDefault(); // Prevent the default paste behavior

    // Get the plain text from the clipboard
    const text = (event.clipboardData || window.clipboardData).getData('text/plain');

    // Get the current selection
    const selection = window.getSelection();
    if (!selection.rangeCount) return false;

    // Get the range of the current selection
    const range = selection.getRangeAt(0);
    
    // Delete the current selection
    range.deleteContents();

    // Create a document fragment to hold the plain text node
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(text));

    // Insert the plain text fragment
    range.insertNode(fragment);

    // Move the cursor to the end after inserting text
    // range.setStartAfter(fragment);
    // range.setEndAfter(fragment);
    selection.removeAllRanges();
    selection.addRange(range);
}



// Drag and Drop Functions
export function onDragStart(e) {
    draggedItem = e.target.closest('.para-container');
    e.dataTransfer.effectAllowed = 'move';
    document.getElementById('editor').classList.add('dragging');
}

export function onDragEnd() {
    editor.classList.remove('dragging');
    draggedItem = null;
}

export function onDragOver(e) {
    e.preventDefault();
}


export function onDrop(e) {
    e.preventDefault();
    const target = e.target.closest('.para-container'); // Get the closest para-container
    if (target && target !== draggedItem) {
        const parent = document.getElementById('editor');
        const items = Array.from(parent.children);
        const draggedIndex = items.indexOf(draggedItem);
        const targetIndex = items.indexOf(target);

        // Swap the entire paragraph containers
        if (draggedIndex > targetIndex) {
            parent.insertBefore(draggedItem, target);
        } else {
            parent.insertBefore(draggedItem, target.nextSibling);
        }
    }
    validateStructure();
    buildStructure();
    onDragEnd();
    buildAnchorStructure();
    updateRangeSlider();

}



export function onKeyDown(e) {
    const p = e.target;
    const paraContainer = p.parentElement;

    if (e.key === 'Backspace' && p.innerHTML === '<br>') {
        e.preventDefault();
        const previousContainer = paraContainer.previousElementSibling;
        if (previousContainer && previousContainer.querySelector('p')) {
            previousContainer.querySelector('p').focus();
        }
        paraContainer.remove();
    }

    if (e.key === 'Enter') {
        e.preventDefault();

        // Check if the last key pressed was also 'Enter'
        if (p.dataset.lastKey === 'Enter') {
            addParagraph(paraContainer,true);
            p.dataset.lastKey = ''; // Reset after adding a paragraph
        } else {
            // Insert a line break and mark this as the last key pressed
            document.execCommand('insertLineBreak');
            p.dataset.lastKey = 'Enter'; // Mark the current key press as 'Enter'
        }
    } else {
        p.dataset.lastKey = ''; // Reset if any other key is pressed
    }
    updateRangeSlider();
}





// Delete Paragraph Function
// export function deleteParagraph(paraContainer) {
//     const previousContainer = paraContainer.previousElementSibling;
//     paraContainer.remove();
//     if (previousContainer && previousContainer.querySelector('p')) {
//         previousContainer.querySelector('p').focus();
//     }
//     validateStructure();
//     // Initial build of the structure
//     buildStructure();
//     buildAnchorStructure();
//     updateRangeSlider();


// }





// Delete Paragraph Function
export function deleteParagraph(paraContainer) {
    // Find the image inside the container
    const imageContainer = paraContainer.querySelector('.image-container');
    const imgTag = imageContainer ? imageContainer.querySelector('img') : null;

    if (imgTag) {
        // Extract the filename from the value attribute of the img tag
        const imageFilename = imgTag.getAttribute('value');

        // Send GET request to backend to delete the image
        sendDeleteRequest(imageFilename)
            .then(() => {
                // Once the image is successfully deleted, remove the paragraph
                paraContainer.remove();

                // Optionally, focus on the previous paragraph
                const previousContainer = paraContainer.previousElementSibling;
                if (previousContainer && previousContainer.querySelector('p')) {
                    previousContainer.querySelector('p').focus();
                }

                // Rebuild the structure and update the range slider
                validateStructure();
                buildStructure();
                buildAnchorStructure();
                updateRangeSlider();
            })
            .catch(error => {
                console.error('Error deleting image:', error);
            });
    } else {
        // If there's no image, just remove the paragraph
        paraContainer.remove();

        // Optionally, focus on the previous paragraph
        const previousContainer = paraContainer.previousElementSibling;
        if (previousContainer && previousContainer.querySelector('p')) {
            previousContainer.querySelector('p').focus();
        }

        // Rebuild the structure and update the range slider
        validateStructure();
        buildStructure();
        buildAnchorStructure();
        updateRangeSlider();
    }
}




















// let quoteTimeout;
// document.addEventListener('DOMContentLoaded', () => {
//     const quoteBtn = document.getElementById('quote-btn');
//     const quoteColorSelect = document.getElementById('quote-color');

//     // Add an empty option to reset the select element
//     const defaultOption = document.createElement('option');
//     defaultOption.value = '';
//     defaultOption.text = 'Select color';
//     quoteColorSelect.add(defaultOption, quoteColorSelect.firstChild);
//     quoteColorSelect.value = '';

//     // Hide the default option using CSS
//     defaultOption.style.display = 'none';

//     // Toggle quote color dropdown visibility
//     quoteBtn.addEventListener('click', () => {
//         quoteColorSelect.style.display = quoteColorSelect.style.display === 'none' ? 'block' : 'none';
//         clearTimeout(quoteTimeout);
//         quoteTimeout = setTimeout(() => {
//             quoteColorSelect.style.display = 'none'; // Hide dropdown after selection
//         }, 8000); // Adjust the timeout as necessary
//     });

//     // Apply quote formatting when a color is selected
//     quoteColorSelect.addEventListener('change', () => {
//         const color = quoteColorSelect.value;
//         const selection = window.getSelection();

//         if (color !== '' && selection.rangeCount > 0) {
//             const range = selection.getRangeAt(0);
//             const blockquote = document.createElement('blockquote');
//             blockquote.style.backgroundColor = color;
//             blockquote.style.borderColor = color;
//             blockquote.setAttribute('spellcheck', 'false'); // Disable spellcheck

//             blockquote.appendChild(range.extractContents());
//             range.insertNode(blockquote);

//             // Remove selection
//             selection.removeAllRanges();
//         }

//         // Hide the dropdown after selection
//         quoteColorSelect.style.display = 'none';
//         // Reset the select element to the default option
//         quoteColorSelect.value = '';
//         //updateVersionControl();
//     });




//     // Stop the timeout if the mouse is over the dropdown
//     quoteColorSelect.addEventListener('mouseover', () => {
//         clearTimeout(quoteTimeout);
//     });

//     // Restart the timeout when the mouse leaves the dropdown
//     quoteColorSelect.addEventListener('mouseout', () => {
//         if (quoteColorSelect.style.display === 'block') {
//             quoteTimeout = setTimeout(() => {
//                 quoteColorSelect.style.display = 'none'; // Hide dropdown after timeout
//             }, 8000);
//         }
//     });



// });

















































































































