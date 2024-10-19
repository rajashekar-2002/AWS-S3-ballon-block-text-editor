//textselection.js

//add link to selected text


let selectionDetails={};

export function printParagraphDetails(event) {
    const selection = window.getSelection();

    // Check if there is a selection
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        // Get the start and end offsets relative to the parent node
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        // Get the parent node (the <p> tag in this case)
        const parentNode = range.startContainer.nodeType === Node.TEXT_NODE
            ? range.startContainer.parentNode
            : range.startContainer;


        // Find the index of the <p> tag within its parent container
        const paragraphIndex = Array.from(document.querySelectorAll('.para-container p')).indexOf(parentNode) + 1;

        // Store the selection details in an object
        selectionDetails = {
            selectedText: selectedText,
            startOffset: startOffset,
            endOffset: endOffset,
            paragraphIndex: paragraphIndex, // Index of the <p> tag
            parentNode: parentNode,
            range: range // You can store the range for later use if needed
        };

        // Print the details to the console (or handle them as needed)
        console.log('Selection Details:', selectionDetails);

        // Optionally, you can store the selectionDetails object in a global variable
        window.lastSelectionDetails = selectionDetails;
        // buildAnchorStructure();
    }
}



