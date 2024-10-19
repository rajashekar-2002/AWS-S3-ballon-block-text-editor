//aligin.js

let alignTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const alignmentBtn = document.getElementById('alignment-btn');
    const alignmentSelect = document.getElementById('alignment-select');
    const editor = document.getElementById('editor');

    // Add an empty option to reset the select element
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select alignment';
    alignmentSelect.add(defaultOption, alignmentSelect.firstChild);
    alignmentSelect.value = '';

    // Hide the default option using CSS
    defaultOption.style.display = 'none';

    // Toggle alignment dropdown visibility
    alignmentBtn.addEventListener('click', () => {
        clearTimeout(alignTimeout);
        alignmentSelect.style.display = alignmentSelect.style.display === 'none' ? 'block' : 'none';
        alignTimeout = setTimeout(() => {
            alignmentSelect.style.display = 'none';  // Hide dropdown after selection
        }, 8000);
    });

    // Handle alignment change
    alignmentSelect.addEventListener('change', () => {
        const alignment = alignmentSelect.value;
        alignSelectedText(alignment);
        alignmentSelect.style.display = 'none'; // Hide dropdown after selection
        // Reset the select element to the default option
        alignmentSelect.value = '';
    });

  


    function alignSelectedText(alignment) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            let container = range.commonAncestorContainer;

            // Traverse up to find the nearest parent paragraph, code, or blockquote
            while (container && container.nodeType !== 1) {
                container = container.parentElement;
            }

            if (container && (container.tagName === 'P' || container.tagName === 'CODE' || container.tagName === 'BLOCKQUOTE')) {
                container.style.textAlign = alignment;
            }
        }
    }



    // Handle clicks in the editor to hide the alignment dropdown when clicking outside
    editor.addEventListener('click', (event) => {
        if (event.target.tagName !== 'SELECT' && event.target.tagName !== 'OPTION' && event.target.tagName !== 'BUTTON') {
            alignmentSelect.style.display = 'none';
        }
    });


    // Stop the timeout if the mouse is over the dropdown
    alignmentSelect.addEventListener('mouseover', () => {
        clearTimeout(alignTimeout);
    });

    // Restart the timeout when the mouse leaves the dropdown
    alignmentSelect.addEventListener('mouseout', () => {
        if (alignmentSelect.style.display === 'block') {
            alignTimeout = setTimeout(() => {
                alignmentSelect.style.display = 'none'; // Hide dropdown after timeout
            }, 8000);
        }
    });



});



