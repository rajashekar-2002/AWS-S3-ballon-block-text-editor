//fontedit.js
import { addParagraph } from "./addParagraph.js";
import { hideToolbox } from "./para-toolbox.js";
import { updateVersionControl } from "./versionControl.js";

document.addEventListener('DOMContentLoaded', () => {
    hideToolbox();
    const editor = document.getElementById('editor');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById("underline-btn");

    //add p tag on click on editor
    // Event Listeners
    editor.addEventListener('click', (e) => {
        if (e.target === editor) {
            addParagraph();
 
        }
    });


     //using execcommand selected text will than clear formating workss correctly 
    //if using span than we need to reselect the same again to clear text

    //bold text
    boldBtn.addEventListener('click', () => {
        document.execCommand('bold'); updateVersionControl(); });
    //italic text
    italicBtn.addEventListener('click', () => { document.execCommand('italic'); updateVersionControl(); });

    underlineBtn.addEventListener('click', () => { document.execCommand('underline');updateVersionControl(); });

    //updateVersionControl();



    // Function to wrap selected text in a span with a specific style
    // function wrapSelectionWithStyle(style) {
    //     const selection = window.getSelection();
    //     if (!selection.rangeCount) return;

    //     const range = selection.getRangeAt(0);
    //     const span = document.createElement('span');

//     // Apply the style
    //     if (style === 'bold') {
    //         span.style.fontWeight = 'bold';
    //     } else if (style === 'italic') {
    //         span.style.fontStyle = 'italic';
     //     } else if (style === 'underline') {
    //         span.style.textDecoration = 'underline';
    //     }

//     // Wrap the selected text in the span
    //     range.surroundContents(span);

//     // Clear the selection
    //     selection.removeAllRanges();
    //     selection.addRange(range);
    // }

    //without using execommand

    // // Bold text
    // boldBtn.addEventListener('click', () => wrapSelectionWithStyle('bold'));

    // // Italic text
    // italicBtn.addEventListener('click', () => wrapSelectionWithStyle('italic'));

    // // Underline text
    // underlineBtn.addEventListener('click', () => wrapSelectionWithStyle('underline'));

});










let fontTimeout;
document.addEventListener('DOMContentLoaded', () => {
    clearTimeout(fontTimeout);
    const fontSizeBtn = document.getElementById('font-size-btn');
    const fontSizeSelect = document.getElementById('font-size');

    // Initially hide the dropdown
    fontSizeSelect.style.display = 'none';

    // Add an empty option to reset the select element
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select font size';
    fontSizeSelect.add(defaultOption, fontSizeSelect.firstChild);
    fontSizeSelect.value = '';

    // Hide the default option using CSS
    defaultOption.style.display = 'none';

    fontSizeBtn.addEventListener('click', () => {
        fontSizeSelect.style.display = fontSizeSelect.style.display === 'none' ? 'flex' : 'none';
        fontTimeout = setTimeout(() => {
            fontSizeSelect.style.display = 'none'; // Hide dropdown after timeout
        }, 8000); // Adjust the timeout as necessary
    });

    fontSizeSelect.addEventListener('change', () => {
        const size = fontSizeSelect.value;

        // Ensure the contentEditable area is focused
        const editableArea = document.getElementById('editor');
        editableArea.focus();

        document.execCommand('styleWithCSS', false, true);

        // Use setTimeout to allow dropdown to close before applying format
        setTimeout(() => {
            // Apply the selected font size
            if (size) {
                document.execCommand('fontSize', false, '7'); // Use '7' as a placeholder size
                const spans = editableArea.getElementsByTagName('span'); // Get all spans in the editor
                for (let span of spans) {
                    if (span.style.fontSize === 'xxx-large') { // Check for the applied placeholder size
                        span.removeAttribute('style'); // Remove all styles
                        span.classList.add(size); // Add the class based on the selected option
                    }
                }
            }

            fontSizeSelect.style.display = 'none'; // Hide dropdown after selection
            fontSizeSelect.value = ''; // Reset the select element to the default option
        }, 200); // Adjust the timeout as necessary

        // Stop the timeout if the mouse is over the dropdown


  

    });
    fontSizeSelect.addEventListener('mouseover', () => {
        clearTimeout(fontTimeout);
    });

    // Restart the timeout when the mouse leaves the dropdown
    fontSizeSelect.addEventListener('mouseleave', () => {
        if (fontSizeSelect.style.display === 'block') {
            fontTimeout = setTimeout(() => {
                fontSizeSelect.style.display = 'none'; // Hide dropdown after timeout
            }, 8000);
        }
    });

    // updateVersionControl();

});



