//code.js


//code for  on doc load








document.getElementById('code-btn').addEventListener('click', () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;

        // Find the closest parent <p> tag
        const parentParagraph = startContainer.nodeType === Node.TEXT_NODE
            ? startContainer.parentElement.closest('p.para-container-paragraph')
            : startContainer.closest('p.para-container-paragraph');

        // Proceed only if the parent paragraph exists and has the correct class
        if (parentParagraph && parentParagraph.classList.contains('para-container-paragraph')) {
            // Create code block elements
            const codeElement = document.createElement('code');
            codeElement.contentEditable = "true"; // Allow user to edit the code block

            if (selection.toString().trim()) {
                // If text is selected, use it as the code block content
                codeElement.textContent = selection.toString();
            } else {
                // If no text is selected, use placeholder text
                codeElement.textContent = 'code here';
            }

            const codeBlockDiv = document.createElement('div');
            codeBlockDiv.className = 'code-block-div';

            const codeTypeSelect = document.createElement('div');
            codeTypeSelect.contentEditable = "false";
            codeTypeSelect.className = 'code-type-select';

            // Create the dropdown button
            const dropdownButton = document.createElement('button');
            dropdownButton.className = 'btn btn-outline-secondary btn-sm dropdown-toggle';
            dropdownButton.type = 'button';
            dropdownButton.setAttribute('data-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-haspopup', 'true');
            dropdownButton.setAttribute('aria-expanded', 'false');
            dropdownButton.textContent = 'Select Type';

            // Create the dropdown menu
            const dropdownMenu = document.createElement('div');
            dropdownMenu.className = 'dropdown-menu';

            // Add dropdown items
            const languages = ['JavaScript', 'Python', 'Java'];
            languages.forEach(language => {
                const dropdownItem = document.createElement('a');
                dropdownItem.className = 'dropdown-item';
                dropdownItem.href = '#';
                dropdownItem.textContent = language;

                // Add event listener to each dropdown item
                dropdownItem.addEventListener('click', (event) => {
                    event.preventDefault();
                    dropdownButton.textContent = language; // Set the button text to the selected option
                });

                dropdownMenu.appendChild(dropdownItem);
            });

            // Append the dropdown button and menu to codeTypeSelect
            codeTypeSelect.appendChild(dropdownButton);
            codeTypeSelect.appendChild(dropdownMenu);

            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'btn btn-outline-secondary copy-btn btn-sm';
            copyButton.contentEditable = "false";
            copyButton.textContent = 'Copy Code';

            // Add event listener to copy button
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeElement.textContent).then(() => {
                    alert('Code copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy code: ', err);
                });
            });

            // Append copy button to codeTypeSelect
            codeTypeSelect.appendChild(copyButton);

            // Append codeTypeSelect and codeElement to codeBlockDiv
            codeBlockDiv.appendChild(codeTypeSelect);
            codeBlockDiv.appendChild(codeElement);

            // Clear the selected text
            range.deleteContents();

            // Remove any empty text nodes or line breaks within the <p> before inserting the code block
            const nodes = Array.from(parentParagraph.childNodes);
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
                    node.remove();
                }
            });

            // Insert the code block div
            range.insertNode(codeBlockDiv);

            // Move the code block div to the end of the <p> to avoid any empty space above it
            parentParagraph.appendChild(codeBlockDiv);

            // Add the CSS to style the divs
            const style = document.createElement('style');
            style.textContent = `
                .code-block-div {
                    display: flex;
                    flex-direction: column; /* Stack the elements vertically */
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    padding: 5px;
                    border-radius: 5px;
                }
                .code-type-select {
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px; /* Space between dropdown and code */
                }
                .copy-btn {
                    margin-left: auto;
                }
                .code-block-div[contenteditable="true"] {
                    pointer-events: none; /* Prevent text addition */
                }
                code[contenteditable="true"] {
                    outline: none; /* Remove the outline when focused */
                    display: block;
                    padding: 5px;
                    background-color: #f5f5f5;
                    border-radius: 4px;
                }
            `;
            document.head.appendChild(style);

            // Make the code element active and editable
            codeElement.focus();
            removeBRsInPara(parentParagraph);
        }
    }
});
