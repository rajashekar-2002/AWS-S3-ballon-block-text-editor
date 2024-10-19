//clearformatting

import { RemoveEmptyTagsAfterRemovingEdit, buildAnchorStructure } from "./anchorStructure.js";
import { updateVersionControl } from "./versionControl.js";

const clearFormattingBtn = document.getElementById('clear-formatting-btn');

function clearFormatting() {

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const text = range.toString();
    
    if (text) {
      //also consider space around the text selection
      // Adjust the start of the range to include any leading space
      while (range.startOffset > 0 && /\s/.test(range.startContainer.textContent[range.startOffset - 1])) {
        range.setStart(range.startContainer, range.startOffset - 1);
      }

      // Adjust the end of the range to include any trailing space
      while (range.endOffset < range.endContainer.textContent.length && /\s/.test(range.endContainer.textContent[range.endOffset])) {
        range.setEnd(range.endContainer, range.endOffset + 1);
      }

      // Adjust to include surrounding inline elements, including buttons
      let startNode = range.startContainer;
      let endNode = range.endContainer;

      while (startNode.parentNode && startNode.parentNode.nodeType === Node.ELEMENT_NODE &&
        (getComputedStyle(startNode.parentNode).display === 'inline' || startNode.parentNode.tagName === 'BUTTON' )) {
        startNode = startNode.parentNode;
      }

      while (endNode.parentNode && endNode.parentNode.nodeType === Node.ELEMENT_NODE &&
        (getComputedStyle(endNode.parentNode).display === 'inline' || endNode.parentNode.tagName === 'BUTTON')) {
        endNode = endNode.parentNode;
      }


      //remove alignment
            //   // Check if the startNode or endNode is a <p> tag with style attribute
      if (startNode.parentNode.tagName === 'P' && startNode.parentNode.hasAttribute('style')) {
                startNode.parentNode.removeAttribute('style');
              }
      if (endNode.parentNode.tagName === 'P' && endNode.parentNode.hasAttribute('style')) {
                endNode.parentNode.removeAttribute('style');
              }
    

      // Check if the startNode or endNode is a <p> tag with contenteditable="true"
      if ((startNode.tagName === 'P' && startNode.classList.contains('para-container-paragraph')) || 
          (endNode.tagName === 'P' && endNode.classList.contains('para-container-paragraph')) ){
        return;
          }

      //handle table clear formatting seperatky
      //remove table link method for selected
      if( (startNode.tagName === 'TD'  || endNode.tagName === 'TD' )){
        const selectedCells = document.querySelectorAll('td.selected');
            selectedCells.forEach(cell => {
                const button = cell.querySelector('button'); // Select the button element
                if (button) {
                    // Restore the original content of the cell
                    cell.innerHTML = button.textContent; // Set the cell's innerHTML to the button's text content
                }

                //check for marker code quote if any 
                selectedCells.forEach(cell => {
                    // Select all span, blockquote, code, and pre elements within the cell
                    const elements = cell.querySelectorAll('span, blockquote, code, pre, i, b');
                    elements.forEach(element => {
                      // Create a text node with the element's text content
                      const textNode = document.createTextNode(element.textContent);
                  
                      // Replace the element with the text node
                      element.replaceWith(textNode);
                    });
                  });
                  
            });
            buildAnchorStructure();
            return
          }




      range.setStartBefore(startNode);
      range.setEndAfter(endNode);

      selection.removeAllRanges();
      selection.addRange(range);



      // Clear formatting by removing all styles and tags
      const content = range.extractContents();

      const fragment = document.createDocumentFragment();


      const textNode = document.createTextNode(content.textContent);
      fragment.appendChild(textNode);
      range.insertNode(fragment);
      selection.removeAllRanges();



      // Additional functions after clearing formatting
      RemoveEmptyTagsAfterRemovingEdit();
      buildAnchorStructure();
      updateVersionControl();
    }
  }
  
}

clearFormattingBtn.addEventListener('click', clearFormatting);



