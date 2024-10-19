//quote.js


let quoteTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const quoteBtn = document.getElementById('quote-btn');
    const quoteColorSelect = document.getElementById('quote-color');

    // Add an empty option to reset the select element
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select color';
    quoteColorSelect.add(defaultOption, quoteColorSelect.firstChild);
    quoteColorSelect.value = '';

    // Hide the default option using CSS
    defaultOption.style.display = 'none';

    // Toggle quote color dropdown visibility
    quoteBtn.addEventListener('click', () => {
        quoteColorSelect.style.display = quoteColorSelect.style.display === 'none' ? 'block' : 'none';
    });

    // Apply quote formatting when a color is selected
    quoteColorSelect.addEventListener('change', () => {
        const color = quoteColorSelect.value;
        const selection = window.getSelection();

        if (color !== '' && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const blockquote = document.createElement('blockquote');
            blockquote.style.backgroundColor = color;
            blockquote.style.borderColor = color;
            blockquote.setAttribute('spellcheck', 'false'); // Disable spellcheck

            const contents = range.extractContents();
            blockquote.appendChild(contents);
            range.insertNode(blockquote);

            // Clear the selection
            selection.removeAllRanges();

            // Update version control
            //updateVersionControl();
        }

        // Hide the dropdown and reset the select element to the default option
        quoteColorSelect.style.display = 'none';
        quoteColorSelect.value = '';
    });

    // Stop the timeout if the mouse is over the dropdown
    quoteColorSelect.addEventListener('mouseover', () => {
        clearTimeout(quoteTimeout);
    });

    // Restart the timeout when the mouse leaves the dropdown
    quoteColorSelect.addEventListener('mouseout', () => {
        if (quoteColorSelect.style.display === 'block') {
            quoteTimeout = setTimeout(() => {
                quoteColorSelect.style.display = 'none'; // Hide dropdown after timeout
            }, 8000);
        }
    });
});


