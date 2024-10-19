//table.js
import { addParagraph } from "./addParagraph.js";
import { getActiveParagraph, setActiveParagraph } from "./para-toolbox.js";
import { updateVersionControl } from "./versionControl.js";


document.addEventListener('DOMContentLoaded', () => {
    // Table button event listener
    document.getElementById('table-btn').addEventListener('click', () => {
        let activeParagraph = getActiveParagraph();
        let paraContainer = null;
        try{
            paraContainer = addParagraph(activeParagraph.parentElement);
        }catch(e){
            paraContainer = addParagraph();
        }
        const p = paraContainer.querySelector('p');
        setActiveParagraph(p);
        p.innerHTML = `
        <div class="table-container">
            <table id="dynamicTable">
                <thead>
                    <tr>
                        <th draggable="true" ondragstart="startDrag(event, this)">Name</th>
                        <th draggable="true" ondragstart="startDrag(event, this)">Age</th>
                        <th draggable="true" ondragstart="startDrag(event, this)">Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td draggable="true" ondragstart="startDrag(event, this)" onclick="selectCell(this)"
                            contenteditable="true" class="editable">row 1 col 1</td>
                        <td draggable="true" ondragstart="startDrag(event, this)" onclick="selectCell(this)"
                            contenteditable="true" class="editable">row 1 col 2</td>
                        <td draggable="true" ondragstart="startDrag(event, this)" onclick="selectCell(this)"
                            contenteditable="true" class="editable">row 1 col 3</td>
                    </tr>
                    <tr>
                        <td draggable="true" ondragstart="startDrag(event, this)" onclick="selectCell(this)"
                            contenteditable="true" class="editable">row 2 col 1</td>
                        <td draggable="true" ondragstart="startDrag(event, this)" onclick="selectCell(this)"
                            contenteditable="true" class="editable">row 2 col 2</td>
                        <td draggable="true" ondragstart="startDrag(event, this)" onclick="selectCell(this)"
                            contenteditable="true" class="editable">row 2 col 3</td>
                    </tr>
                </tbody>
            </table>
        </div>
            
        `;

        attachTableEventListeners(p.querySelector('table'));
        updateVersionControl();
    });

});

function attachTableEventListeners(table) {
    // Add drag and drop event listeners to the table headers and cells
    table.querySelectorAll('td[draggable="true"], th[draggable="true"]').forEach(item => {
        item.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        item.addEventListener('drop', (event) => {
            event.preventDefault();
            if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
                if (dragged.tagName === 'TH') {
                    swapHeaders(dragged, event.target);
                } else {
                    swapRows(dragged.parentNode, event.target.parentNode);
                }
                recordUndoState();
            }
        });
    });
}


let dragged;
let undoStack = [];
let redoStack = [];


window.startDrag = startDrag;
function startDrag(event, element) {
    dragged = element;
    event.dataTransfer.setData("text/plain", null); // For Firefox compatibility
}

document.querySelectorAll('td[draggable="true"], th[draggable="true"]').forEach(item => {
    item.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    item.addEventListener('drop', (event) => {
        event.preventDefault();
        if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
            if (dragged.tagName === 'TH') {
                swapHeaders(dragged, event.target);
            } else {
                swapRows(dragged.parentNode, event.target.parentNode);
            }
            recordUndoState();
        }
    });
});





window.selectCell = selectCell;

function selectCell(cell) {
    // Deselect any previously selected cell
    const previouslySelectedCell = document.querySelector('td.selected');
    if (previouslySelectedCell && previouslySelectedCell !== cell) {
        previouslySelectedCell.classList.remove('selected');

        // Clear text selection from the previously selected cell
        const selection = window.getSelection();
        selection.removeAllRanges(); // Clear any current selections
    }

    // Select the current cell
    if (!cell.classList.contains('selected')) {
        cell.classList.add('selected');

        // Programmatically select the text inside the cell
        const range = document.createRange();
        range.selectNodeContents(cell);
        const selection = window.getSelection();
        selection.removeAllRanges(); // Clear any current selections
        selection.addRange(range); // Add the new selection
        activePtagForTableCaptions = cell.closest('p.para-container-paragraph');
        setActiveParagraph(activePtagForTableCaptions);
    } else {
        // If the cell is already selected, deselect it
        cell.classList.remove('selected');
        const selection = window.getSelection();
        selection.removeAllRanges(); // Clear selection if deselected
        
        // Reset activePtagForTableCaptions if the cell is deselected
        activePtagForTableCaptions = null;
    }

    console.log('Selected Cell:', cell); // Log the current selected cell
}







window.unselectAllCells = unselectAllCells;
export function unselectAllCells() {
        // Find all selected cells
            const selectedCells = document.querySelectorAll('td.selected');

            // Remove the 'selected' class from each cell
            selectedCells.forEach(cell => {
            cell.classList.remove('selected');
            });

    // Optionally, hide the button container if no cells are selected
    toggleButtonContainer(); // Show or hide button container based on selection
}







const addLinkToSelectedCellTable = document.getElementById("insert-link-btn").addEventListener("click", addLink);



function addLink() {
    const url = document.getElementById('link-url').value;

    const selectedCells = document.querySelectorAll('td.selected');

    selectedCells.forEach(cell => {
        // Check if the cell already contains a button
        const existingButton = cell.querySelector('button');
        if (existingButton) {
            // Remove the existing button
            removeTableLink(cell);
        }

        // Create a new button element
        const button = document.createElement('button');
        button.textContent = cell.innerHTML; // Preserve the existing cell content

        // Set the button styles directly
        button.style.background = 'none'; // No background
        button.style.border = 'none'; // No border
        button.style.outline = 'none'; // No outline
        button.style.color = 'blue'; // Text color blue
        button.style.cursor = 'pointer'; // Pointer cursor on hover

        // Add tooltip attributes
        button.setAttribute('data-toggle', 'tooltip');
        button.setAttribute('data-placement', 'top');
        button.setAttribute('title', url); // Set the title to the URL

        // Set the button's click event to open the URL
        button.onclick = function() {
            window.open(url, '_blank'); // Open the URL in a new tab
        };

        cell.innerHTML = ''; // Clear the cell content
        cell.appendChild(button); // Append the button to the cell
    });

    $('#addLinkModal').modal('hide'); // Hide the modal after adding the link

    // Initialize Bootstrap tooltips (if using Bootstrap)
    $('[data-toggle="tooltip"]').tooltip();
    updateVersionControl();
}

function removeTableLink(cell) {
    const button = cell.querySelector('button'); // Select the button element
    if (button) {
        // Restore the original content of the cell
        cell.innerHTML = button.textContent; // Set the cell's innerHTML to the button's text content
    }
}















window.toggleButtonContainer = toggleButtonContainer;

function toggleButtonContainer() {
    const buttonContainer = document.getElementById('buttonContainer');
    const selectedCells = document.querySelectorAll('td.selected');
    buttonContainer.style.display = selectedCells.length > 0 ? 'flex' : 'none'; // Show buttons if cells are selected
}


window.addRowBefore = addRowBefore;

function addRowBefore() {
    const selectedCells = document.querySelectorAll('td.selected');
    if (selectedCells.length > 0) {
        const firstSelectedCell = selectedCells[0];
        const newRow = createRow();
        firstSelectedCell.parentNode.parentNode.insertBefore(newRow, firstSelectedCell.parentNode);
        recordUndoState();
        updateVersionControl();
    }
}



window.addRowAfter = addRowAfter;

function addRowAfter() {
    const selectedCells = document.querySelectorAll('td.selected');
    if (selectedCells.length > 0) {
        const firstSelectedCell = selectedCells[0];
        const newRow = createRow();
        firstSelectedCell.parentNode.parentNode.insertBefore(newRow, firstSelectedCell.parentNode.nextSibling);
        recordUndoState();
        updateVersionControl();
    }
}



function createRow() {
    const newRow = document.createElement('tr');
    const cellsCount = document.querySelectorAll('th').length;
    for (let i = 0; i < cellsCount; i++) {
        const newCell = document.createElement('td');
        newCell.innerHTML = `New Row, Col ${i + 1}`;
        newCell.draggable = true;
        newCell.ondragstart = (event) => startDrag(event, newCell);
        newCell.onclick = () => selectCell(newCell);
        newCell.contentEditable = true;
        newCell.classList.add('editable');
        newRow.appendChild(newCell);
    }

    return newRow;
}



window.addColumnBefore = addColumnBefore;
function addColumnBefore() {
    const selectedCells = document.querySelectorAll('td.selected');
    if (selectedCells.length === 0) return;
    const columnIndex = Array.from(selectedCells[0].parentNode.children).indexOf(selectedCells[0]);
    const headers = document.querySelectorAll('th');
    const newHeader = document.createElement('th');
    newHeader.setAttribute('draggable', 'true');
    newHeader.innerHTML = `Header ${headers.length + 1}`;
    newHeader.ondragstart = (event) => startDrag(event, newHeader);
    headers[0].parentNode.insertBefore(newHeader, headers[columnIndex]);

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        newCell.innerHTML = `New Row, Col ${columnIndex + 1}`;
        newCell.draggable = true;
        newCell.ondragstart = (event) => startDrag(event, newCell);
        newCell.onclick = () => selectCell(newCell);
        newCell.contentEditable = true;
        newCell.classList.add('editable');
        row.insertBefore(newCell, row.children[columnIndex]);
    });
    updateVersionControl();
    recordUndoState();
}

window.addColumnAfter = addColumnAfter;
function addColumnAfter() {
    const selectedCells = document.querySelectorAll('td.selected');
    if (selectedCells.length === 0) return;
    const columnIndex = Array.from(selectedCells[0].parentNode.children).indexOf(selectedCells[0]);
    const headers = document.querySelectorAll('th');
    const newHeader = document.createElement('th');
    newHeader.setAttribute('draggable', 'true');
    newHeader.innerHTML = `Header ${headers.length + 1}`;
    newHeader.ondragstart = (event) => startDrag(event, newHeader);
    headers[0].parentNode.insertBefore(newHeader, headers[columnIndex + 1]);

    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const newCell = document.createElement('td');
        newCell.innerHTML = `New Row, Col ${columnIndex + 2}`;
        newCell.draggable = true;
        newCell.ondragstart = (event) => startDrag(event, newCell);
        newCell.onclick = () => selectCell(newCell);
        newCell.contentEditable = true;
        newCell.classList.add('editable');
        row.insertBefore(newCell, row.children[columnIndex + 1]);
    });
    recordUndoState();
    updateVersionControl();
}



window.addCaption = addCaption;
function addCaption() {
    const captionInput = document.getElementById('captionInput');
    const captionText = captionInput.value;
    const activeP = activePtagForTableCaptions; // Get the focused or active <p> tag

    if (captionText && activeP) {
        // Find the table within the active <p> tag
        const table = activeP.querySelector('table');

        if (table) {
            // Check if a <figcaption> already exists in the <p> tag
            const existingCaption = activeP.querySelector('figcaption.table-caption');

            if (!existingCaption) {
                // Create a new <figcaption> if none exists
                const captionElement = document.createElement('figcaption');
                captionElement.className = 'table-caption'; // Use a specific class for table captions
                captionElement.textContent = captionText; // Add caption text

                // Append the figcaption after the table, still within the <p>
                table.parentNode.insertBefore(captionElement, table.nextSibling);
            } else {
                // Update the existing <figcaption>
                existingCaption.textContent = captionText; // Update caption text
            }
            // updateVersionControl();
        } else {
            // Handle case where no table is found within the active <p> tag
            console.log('No table found within the active <p> tag.');
        }


    } else {
        console.log('No caption text provided or no active <p> tag.');
    }
}

window.removeCaption = removeCaption;

function removeCaption() {
    const activeP = activePtagForTableCaptions; // Get the focused or active <p> tag

    if (activeP) {
        // Find the <figcaption> with the class "table-caption" within the active <p> tag
        const tableCaption = activeP.querySelector('figcaption.table-caption');

        if (tableCaption) {
            console.log('Table caption element found:', tableCaption);
            tableCaption.remove(); // Remove the caption element from the DOM
            console.log('Table caption has been removed.');
            // updateVersionControl(); // Uncomment if needed
        } else {
            console.error('Table caption element not found within the active <p> tag.');
        }
    } else {
        console.log('No active <p> tag found.');
    }
}


window.addHeaderColor = addHeaderColor;
function addHeaderColor() {
    const headers = document.querySelectorAll('th');
    headers.forEach(header => {
        header.style.backgroundColor = '#f2f2f2';
    });
    recordUndoState();
}



function recordUndoState() {
    // Capture the current state of the table for undo functionality
    const tableState = document.getElementById('dynamicTable').outerHTML;
    undoStack.push(tableState);
    redoStack = []; // Clear redo stack on new action
}

window.undo = undo;
function undo() {
    if (undoStack.length > 0) {
        const lastState = undoStack.pop();
        redoStack.push(document.getElementById('dynamicTable').outerHTML);
        document.body.innerHTML = lastState + document.body.innerHTML.split('</body>')[1];
    }
}
window.redo = redo;

function redo() {
    if (redoStack.length > 0) {
        const redoState = redoStack.pop();
        undoStack.push(document.getElementById('dynamicTable').outerHTML);
        document.body.innerHTML = redoState + document.body.innerHTML.split('</body>')[1];
    }
}

function swapHeaders(header1, header2) {
    const headers = Array.from(document.querySelectorAll('th'));
    const index1 = headers.indexOf(header1);
    const index2 = headers.indexOf(header2);

    // Swap headers
    const temp = header1.innerHTML;
    header1.innerHTML = header2.innerHTML;
    header2.innerHTML = temp;

    // Swap corresponding cells in each row
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = Array.from(row.children);
        const tempCell = cells[index1].innerHTML;
        cells[index1].innerHTML = cells[index2].innerHTML;
        cells[index2].innerHTML = tempCell;
    });
    updateVersionControl();
}

function swapRows(row1, row2) {
    const tempCells = Array.from(row1.children).map(cell => cell.innerHTML);
    Array.from(row1.children).forEach((cell, index) => {
        cell.innerHTML = row2.children[index].innerHTML;
    });
    Array.from(row2.children).forEach((cell, index) => {
        cell.innerHTML = tempCells[index];
    });
    updateVersionControl();
}




window.toggleColorDropdown = toggleColorDropdown;
function toggleColorDropdown() {
    const dropdown = document.getElementById('colorDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

window.colorSelectedCells = colorSelectedCells;
function colorSelectedCells() {
    const color = document.getElementById('colorSelect').value;
    const selectedCells = document.querySelectorAll('td.selected');
    if (color && selectedCells.length > 0) {
        selectedCells.forEach(cell => {
            cell.style.backgroundColor = color; // Apply selected color to each selected cell
        });
        document.getElementById('colorSelect').value = ''; // Reset dropdown
    }
    toggleColorDropdown(); // Hide dropdown after selection
    updateVersionControl();
}







// let activePtagForTableCaptions;

// document.addEventListener('DOMContentLoaded', () => {
//     const editor = document.getElementById('editor');
//     const tableOptions = document.getElementById('table-options');
//     const buttonContainer = document.getElementById('buttonContainer');
//     const editButton = buttonContainer.querySelector('.showTableEditOptionsToolboxbutton');
//     activePtagForTableCaptions = document.querySelector('p:focus, p:active');
//     console.log(activePtagForTableCaptions);

//     // Hide toolbox initially
//     tableOptions.style.display = 'none';

//     // Function to position toolbox near the cursor and keep it within the viewport
//     function positionToolboxNearCursor(event) {
//         const x = event.clientX;
//         const y = event.clientY;
//         const toolboxWidth = tableOptions.offsetWidth;
//         const toolboxHeight = tableOptions.offsetHeight;
//         const viewportWidth = window.innerWidth;
//         const viewportHeight = window.innerHeight;

//         // Calculate new position
//         let left = x + 90;
//         let top = y + 10;

//         // Adjust position if the toolbox goes out of the viewport
//         if (left + toolboxWidth > viewportWidth) {
//             left = viewportWidth - toolboxWidth - 10;
//         }
//         if (top + toolboxHeight > viewportHeight) {
//             top = viewportHeight - toolboxHeight - 10;
//         }

//         tableOptions.style.left = `${left}px `;
//         tableOptions.style.top = `${top}px`;
//     }

//     // Function to update button container layout using inline styles
//     function updateButtonContainerLayout() {
//         const visibleButtons = Array.from(buttonContainer.children).filter(button => button.style.display !== 'none');
//         const buttonCount = visibleButtons.length;

//         // Reset styles
//         buttonContainer.style.display = 'grid';
//         buttonContainer.style.whiteSpace = 'nowrap';
//         buttonContainer.style.width = 'auto';
        
//         if (buttonCount === 1) {
//             buttonContainer.style.gridTemplateColumns = '1fr';
//         } else {
//             buttonContainer.style.gridTemplateColumns = `repeat(5, 1fr)`;
//         }
//     }

//     // Function to center the toolbox on the screen
//     function centerToolbox() {
//         const viewportWidth = window.innerWidth;
//         const viewportHeight = window.innerHeight;
//         const toolboxWidth = tableOptions.offsetWidth;
//         const toolboxHeight = tableOptions.offsetHeight;

//         tableOptions.style.left = `${(viewportWidth - toolboxWidth) / 2 + 100}px`;
//         tableOptions.style.top = `${(viewportHeight - toolboxHeight) / 2 - 100}px`;
//         tableOptions.style.transform = 'none'; // Remove any previous transformation
//     }

//     // Function to show all buttons
//     function showAllButtons() {
//         Array.from(buttonContainer.children).forEach(button => {
//             button.style.display = 'block';
//         });
//         toggleColorDropdown();
//         updateButtonContainerLayout();
//     }

//     // Function to hide all buttons except the first one
//     function showEditButtonOnly() {
//         Array.from(buttonContainer.children).forEach(button => {
//             if (button === editButton) {
//                 button.style.display = 'block';
//             } else {
//                 button.style.display = 'none';
//             }
//         });
//         updateButtonContainerLayout();
//     }

//     // Show toolbox when clicking on a table
//     function showTableOptions(target, event) {
//         tableOptions.style.display = 'block';

//         // Show only the "Edit Table" button
//         showEditButtonOnly();

//         // Position toolbox near the cursor for "Edit Table" button
//         positionToolboxNearCursor(event);

//         // Handle click on the "Edit Table" button
//         if (editButton) {
//             editButton.addEventListener('click', () => {
//                 showAllButtons(); // Show all buttons
//                 editButton.style.display = 'none'; // Hide "Edit Table" button
//                 centerToolbox(); // Center the toolbox on the screen
//                 tableOptions.style.width = 'auto'; // Adjust width to content
//                 tableOptions.style.height = 'auto'; // Adjust height to content
                
//             }, { once: true }); // Ensure this listener is only added once
//         }
//     }

//     // Hide toolbox if clicking outside
//     editor.addEventListener('click', (event) => {
//         // Check if the click is on the table or within the tableOptions
//         if (tableOptions.style.display === 'block' && !tableOptions.contains(event.target) && !event.target.closest('table')) {
//             tableOptions.style.display = 'none';
//             unselectAllCells();
//         } else if (event.target.tagName === 'TABLE' || event.target.closest('table')) {
//             if(activePtagForTableCaptions==null){
//                 tableOptions.style.display = 'none';
//                 unselectAllCells();
//             }else{
                
//                 showTableOptions(event.target, event);
//             }
//         }
//     });
// });






// window.hideTableToolbox = hideTableToolbox;
// export function hideTableToolbox(){
//     const tableOptions = document.getElementById('table-options');
//     tableOptions.style.display = 'none';
// }
let activePtagForTableCaptions;
let hideTableTimeout;

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const tableOptions = document.getElementById('table-options');
    const buttonContainer = document.getElementById('buttonContainer');
    const editButton = buttonContainer.querySelector('.showTableEditOptionsToolboxbutton');
    activePtagForTableCaptions = document.querySelector('p:focus, p:active');
    console.log(activePtagForTableCaptions);

    // Hide toolbox initially
    tableOptions.style.display = 'none';

    // Function to position toolbox near the cursor and keep it within the viewport
    function positionToolboxNearCursor(event) {
        const x = event.clientX;
        const y = event.clientY;
        const toolboxWidth = tableOptions.offsetWidth;
        const toolboxHeight = tableOptions.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = x + 90;
        let top = y + 10;

        if (left + toolboxWidth > viewportWidth) {
            left = viewportWidth - toolboxWidth - 10;
        }
        if (top + toolboxHeight > viewportHeight) {
            top = viewportHeight - toolboxHeight - 10;
        }

        tableOptions.style.left = `${left}px `;
        tableOptions.style.top = `${top}px`;
    }

    // Function to update button container layout using inline styles
    function updateButtonContainerLayout() {
        const visibleButtons = Array.from(buttonContainer.children).filter(button => button.style.display !== 'none');
        const buttonCount = visibleButtons.length;

        buttonContainer.style.display = 'grid';
        buttonContainer.style.whiteSpace = 'nowrap';
        buttonContainer.style.width = 'auto';
        
        if (buttonCount === 1) {
            buttonContainer.style.gridTemplateColumns = '1fr';
        } else {
            buttonContainer.style.gridTemplateColumns = `repeat(5, 1fr)`;
        }
    }

    // Function to center the toolbox on the screen
    function centerToolbox() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const toolboxWidth = tableOptions.offsetWidth;
        const toolboxHeight = tableOptions.offsetHeight;

        tableOptions.style.left = `${(viewportWidth - toolboxWidth) / 2 + 100}px`;
        tableOptions.style.top = `${(viewportHeight - toolboxHeight) / 2 - 100}px`;
        tableOptions.style.transform = 'none';
    }

    // Function to show all buttons
    function showAllButtons() {
        Array.from(buttonContainer.children).forEach(button => {
            button.style.display = 'block';
        });
        toggleColorDropdown();
        updateButtonContainerLayout();
    }

    // Function to hide all buttons except the first one
    function showEditButtonOnly() {
        Array.from(buttonContainer.children).forEach(button => {
            if (button === editButton) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });
        updateButtonContainerLayout();
    }

    // Show toolbox when clicking on a table
    function showTableOptions(target, event) {
        tableOptions.style.display = 'block';

        // Show only the "Edit Table" button
        showEditButtonOnly();

        // Position toolbox near the cursor for "Edit Table" button
        positionToolboxNearCursor(event);

        // Handle click on the "Edit Table" button
        if (editButton) {
            editButton.addEventListener('click', () => {
                showAllButtons();
                editButton.style.display = 'none';
                centerToolbox();
                tableOptions.style.width = 'auto';
                tableOptions.style.height = 'auto';
            }, { once: true });
        }

        startHideTimeout(); // Start the timeout for hiding the toolbox
    }

    // Hide toolbox if clicking outside
    editor.addEventListener('click', (event) => {
        if (tableOptions.style.display === 'block' && !tableOptions.contains(event.target) && !event.target.closest('table')) {
            hideTableToolbox();
            unselectAllCells();
        } else if (event.target.tagName === 'TABLE' || event.target.closest('table')) {
            if(activePtagForTableCaptions == null) {
                hideTableToolbox();
                unselectAllCells();
            } else {
                showTableOptions(event.target, event);
            }
        }
    });

    // Function to hide the toolbox with timeout and mouse events
    function startHideTimeout() {
        clearTimeout(hideTableTimeout); // Clear any existing timeout

        hideTableTimeout = setTimeout(() => {
            hideTableToolbox();
        }, 3000); // Hide the toolbox after 3 seconds of inactivity
    }

    // Clear the timeout when the mouse enters the toolbox
    tableOptions.addEventListener('mouseenter', () => {
        clearTimeout(hideTableTimeout);
    });

    // Restart the timeout when the mouse leaves the toolbox
    tableOptions.addEventListener('mouseleave', () => {
        startHideTimeout();
    });
});

// Function to hide the toolbox
window.hideTableToolbox = hideTableToolbox;
export function hideTableToolbox() {
    const tableOptions = document.getElementById('table-options');
    tableOptions.style.display = 'none';
}




























window.deleteSelectedRow = deleteSelectedRow;

function deleteSelectedRow() {
    const selectedCells = document.querySelectorAll('td.selected');
    if (selectedCells.length === 0) return;

    // Get the row of the first selected cell
    const row = selectedCells[0].parentNode;
    row.parentNode.removeChild(row); // Remove the row from the table


    toggleButtonContainer(); // Update button visibility
    updateVersionControl();
}

window.deleteSelectedColumn = deleteSelectedColumn;
function deleteSelectedColumn() {
    const selectedCells = document.querySelectorAll('td.selected');
    if (selectedCells.length === 0) return;

    // Get the column index of the first selected cell
    const columnIndex = Array.from(selectedCells[0].parentNode.children).indexOf(selectedCells[0]);

    // Get all rows in the table
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cellToDelete = row.children[columnIndex];
        if (cellToDelete) {
            row.removeChild(cellToDelete); // Remove the cell from the row
        }
    });

    // Remove the corresponding header
    const headers = document.querySelectorAll('th');
    headers[columnIndex].parentNode.removeChild(headers[columnIndex]);

    // Clear selectedCells after deletion

    toggleButtonContainer(); // Update button visibility
    updateVersionControl();
}


window.deleteTable = deleteTable;
function deleteTable() {
    // Find all selected cells
    const selectedCells = document.querySelectorAll('td.selected');

    if (selectedCells.length > 0) {
        // Find the parent div with the class "table-container"
        const tableContainer = selectedCells[0].closest('.table-container');

        if (tableContainer) {
            // Remove the entire table container div from the DOM
            tableContainer.parentNode.removeChild(tableContainer);
        }

        removeCaption();
        hideTableToolbox();
        updateVersionControl();
    } else {
        console.log('No selected cells found.');
    }
}

