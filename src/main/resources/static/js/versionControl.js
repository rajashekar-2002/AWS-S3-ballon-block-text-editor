//version control.js

import { addParagraph, deleteParagraph, handlePasteAsPlainText, onDragEnd, onDragOver, onDragStart, onDrop, onKeyDown } from "./addParagraph.js";
import { buildAnchorStructure } from "./anchorStructure.js";

import { addBullet, handleDragBulletStart, handleDropBullet, hideBulletToolbox, removeSelectedClassFromBullets, showBulletToolbox } from './bullet.js';
import { hideImageToolbox } from "./image.js";
import { getActiveParagraph, hideToolbox, setActiveParagraph, showToolbox } from "./para-toolbox.js";
import { buildStructure, validateStructure } from "./section.js";
import { hideTableToolbox, unselectAllCells } from "./table.js";
import { printParagraphDetails } from "./TextSelection.js";


function attachEventListeners() {


    const editor = document.getElementById('editor');
    editor.addEventListener('click', (e) => {
        if (e.target === editor) {
            addParagraph();
        }
    });



      
    //title and subtitle

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




    const paraContainers = document.querySelectorAll('.para-container');
    
    paraContainers.forEach(container => {
        // Attach events to para-container
        container.addEventListener('dragstart', onDragStart);
        container.addEventListener('dragend', onDragEnd);
        container.addEventListener('dragover', onDragOver);
        container.addEventListener('drop', onDrop);
        container.addEventListener('input', function() {
            hideBulletToolbox();
            hideTableToolbox();
            hideImageToolbox();
            unselectAllCells();
            updateVersionControl();
            removeSelectedClassFromBullets();
            setActiveParagraph(container.querySelector('p.para-container-paragraph'));


            //because of usinf contenteditable in p on clcik enter bullet is getting added by itself so enter event is not gettting trigger 
            // Check if there is a div with the class 'bullet-container' inside paraContainer
            const bulletContainer = container.querySelector('div.bullet-container');
    
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
        
        container.addEventListener('mouseup', printParagraphDetails);
        container.addEventListener('keydown',  function (e) {
            // Check if Ctrl + A is pressed
            if (e.ctrlKey && e.key === 'a') {
                //e.preventDefault(); // Prevent the default browser action
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(container.querySelector('p'));
                selection.removeAllRanges();
                selection.addRange(range);
        
                setActiveParagraph(container.querySelector('p'));
                let activeParagraph = getActiveParagraph();
        
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
        
        
                updateRangeSlider();
            
            } );

        const addBtn = container.querySelector('.add-btn');
        const deleteBtn = container.querySelector('.delete-btn');

        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addParagraph(container);
        });
    
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteParagraph(container);
        });

        // Attach events to p tags
        const paragraphs = container.querySelectorAll('p.para-container-paragraph, p[contenteditable="true"]');
        paragraphs.forEach(p => {


            p.addEventListener('click',function(){
                hideBulletToolbox();
                hideTableToolbox();
                hideImageToolbox();
                // Check if the clicked paragraph contains a table element
                if (!p.querySelector('table')) {
                    unselectAllCells();
                }
                setActiveParagraph(container.querySelector('p.para-container-paragraph'));
            })



            if (!p.classList.contains('bullet-list')) {
                p.addEventListener('keydown', onKeyDown);

                // Add click event listener to the paragraph
                p.addEventListener('click', (e) => {
                    if (p) {
                        const isTextNode = e.target.nodeType === Node.TEXT_NODE || e.target.tagName === 'P' || e.target.tagName === 'CODE' || e.target.tagName === 'BLOCKQUOTE';

                        if (isTextNode) {

                            hideToolbox();
                            showToolbox(e.clientX, e.clientY, container);
                            e.stopPropagation(); // Prevent further propagation
                        } else {

  
                            hideToolbox(); // Hide toolbox if clicked on an image or table
                        }
                    } else {

                        hideToolbox();
                    }
                });

                // Handle paste event
                p.addEventListener('paste', handlePasteAsPlainText);
            }else{
                let currentBulletContainer;
                const bulletContainers = p.querySelectorAll('.bullet-container');
        
                bulletContainers.forEach(bulletContainer => {
                 // Add event listener to stop propagation within the bullet container
                bulletContainer.addEventListener('click', function(event) {
                    event.stopPropagation(); // Prevent event from reaching parent elements
                });

                // Add keydown event listener to handle Enter key
                bulletContainer.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        console.log("Enter key pressed");
                        addBullet();
                    }
                });

                bulletContainer.addEventListener('click', function(e) {
                    if (e.target.tagName === 'LI') {
                        const items = bulletContainer.querySelectorAll('ul > li');
                        items.forEach(item => item.classList.remove('selected'));
                        e.target.classList.add('selected');
                        currentBulletContainer = e.target.parentElement.parentElement;
                        }

                    // Show the toolbox near the cursor
                    const x = e.clientX;
                    const y = e.clientY;
                    showBulletToolbox(x, y, currentBulletContainer);
            });
        });
        }
        });


        
    });
}


window.onload = function() {
    fixEditorStructure();
    attachEventListeners();
};



function fixEditorStructure() {
    const paraContainers = document.querySelectorAll('.para-container');
    console.log(paraContainers);

    paraContainers.forEach(container => {
        const paragraphs = container.querySelectorAll('p.para-container-paragraph, p.bullet-list');
        console.log(paragraphs);

        paragraphs.forEach(p => {
            let nextSibling = p.nextElementSibling;

            while (nextSibling && (
                nextSibling.tagName === 'BLOCKQUOTE' || 
                nextSibling.tagName === 'TABLE' || 
                nextSibling.tagName === 'FIGCAPTION' ||
                (nextSibling.tagName === 'DIV' && 
                    (nextSibling.classList.contains('table-container') || 
                     nextSibling.classList.contains('image-container') || 
                     nextSibling.classList.contains('preview') || 
                     nextSibling.classList.contains('gist-wrapper') || 
                     nextSibling.classList.contains('code-block-div'))
                )
            )) {
                const elementToMove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                p.appendChild(elementToMove);
            }

            // Check if nextSibling exists and if it's the "captionContainer" or "bullet-container"
            if (nextSibling && nextSibling.id === 'captionContainer') {
                const elementToMove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                p.appendChild(elementToMove);
            }

            if (nextSibling && nextSibling.classList.contains('bullet-container')) {
                const elementToMove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                p.appendChild(elementToMove);
            }

            // Remove empty p tags or <br> tags after the current p tag
            let emptyParagraph = p.nextElementSibling;
            while (emptyParagraph && (emptyParagraph.tagName === 'P' || emptyParagraph.tagName === 'BR') && emptyParagraph.innerHTML.trim() === '') {
                const paragraphToRemove = emptyParagraph;
                emptyParagraph = emptyParagraph.nextElementSibling;
                paragraphToRemove.parentNode.removeChild(paragraphToRemove);
            }
        });
    });

    // Handle "captionContainer" not inside paragraphs
    const captionContainers = document.querySelectorAll('#captionContainer');
    captionContainers.forEach(container => {
        if (container.parentElement.classList.contains('para-container')) {
            container.parentElement.removeChild(container);
        }
    });

    // Handle "bullet-container" not inside paragraphs
    const bulletContainers = document.querySelectorAll('.bullet-container');
    bulletContainers.forEach(container => {
        if (container.parentElement.classList.contains('para-container')) {
            container.parentElement.removeChild(container);
        }
    });
}


function countTotalWords() {
    // Select all p tags with the class 'para-container-paragraph'
    const paragraphs = document.querySelectorAll('p.para-container-paragraph');
    console.log("000000000",paragraphs);

    let totalWords = 0;

    paragraphs.forEach(p => {
        // Get the text content of the p tag
        const text = p.textContent || p.innerText;

        // Split the text into words by spaces, and count the number of words
        const words = text.trim().split(/\s+/);
        totalWords += words.length;
    });
    console.log("total",totalWords);

    return totalWords;
}


let totalWordsInParagraph;


//version control
// const headingAndEditor = document.querySelector('#editor');
const headingAndEditor = document.querySelector('#headingAndEditor');
const versionRange = document.getElementById('versionRange');
const versionNumber = document.getElementById('versionNumber');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
// const versionControlCheckbox = document.getElementById("version-control-collapse");

let versions = [headingAndEditor.innerHTML];

let currentIndex = 0;
let isUserInput = true;

export function updateRangeSlider() {
    versionRange.max = versions.length;
    versionRange.value = currentIndex + 1;
    versionNumber.textContent = 
    (currentIndex + 1 > 0 ? `| Version: ${currentIndex + 1}` : '') +
    (totalWordsInParagraph > 0 ? ` | Words: ${totalWordsInParagraph}` : '');
    totalWordsInParagraph = countTotalWords();

    validateStructure();
    buildStructure();
    buildAnchorStructure();


}

function addVersion(newContent) {
    if (versions[currentIndex] !== newContent) {
        if (versions.length === 500) {
            versions.shift();
        } else {
            currentIndex++;
        }
        versions.push(newContent);

        updateRangeSlider();
    }
}



export function updateVersionControl(){

        const editorContent = headingAndEditor.innerHTML;
        addVersion(editorContent);


        // start of AWS s3 version control save latest
        const versionNumber = getVersionNumber(document.getElementById('versionNumber').textContent);
        // Create JSON payload
        const payload = {
            blogId: getIdFromUrl(),
            version: versionNumber,
            content: editorContent
            
        };
    

        if (!versionControlClient || !versionControlClient.connected) {
            console.error('Version Control WebSocket is not connected.');
            scheduleReconnect();
        }else{
            
            // updateStatus('Draft Saved', 'fa-save');
            versionControlClient.send("/receiveMessageEditEditorWS/saveVersion", {}, JSON.stringify(payload));
        }
        
}



export function getIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    // Get the 'id' parameter from the URL
    const id = urlParams.get('id');
    // Return the ID as a string, or an empty string if 'id' is not present
    return id ? id : '';
}

function getVersionNumber(versionText) {
    // Use a regular expression to extract the number after "Version: "
    const match = versionText.match(/Version:\s*(\d+)/);
    // Check if a match was found and return the number, otherwise return null
    return match ? match[1] : null;
}


// headingAndEditor.addEventListener('input', () => {
//     if (isUserInput) {
//         const content = headingAndEditor.innerHTML;
//         addVersion(content);
//     }
// });

// function disableEditorEvents() {
//     headingAndEditor.removeEventListener('input', handleEditorInput);
//     // Remove any other events you want to temporarily disable here
// }

// function enableEditorEvents() {
//     headingAndEditor.addEventListener('input', handleEditorInput);
//     // Re-add any other events you want to enable here
// }


undoBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        // disableEditorEvents();
        headingAndEditor.innerHTML = "";
        headingAndEditor.innerHTML = versions[currentIndex];

        // enableEditorEvents();
        updateRangeSlider();
        fixEditorStructure();
        attachEventListeners();
    }
});

redoBtn.addEventListener('click', () => {

    if (currentIndex < versions.length - 1) {
        currentIndex++;
        // disableEditorEvents();
        headingAndEditor.innerHTML = "";
        headingAndEditor.innerHTML = versions[currentIndex];

        // enableEditorEvents();
        updateRangeSlider();
        fixEditorStructure();
        attachEventListeners();
    }
});

versionRange.addEventListener('input', () => {

    const value = parseInt(versionRange.value, 10) - 1;
    if (value !== currentIndex) {
        currentIndex = value;
        
        headingAndEditor.innerHTML = versions[currentIndex];

        updateRangeSlider();
        fixEditorStructure();
        attachEventListeners();
    }
});


















let versionControlClient;
const reconnectDelay = 3000; // Delay in milliseconds for attempting reconnection

function initializeVersionControlSocket() {
    updateStatus('Connecting...', 'fa-spinner fa-spin'); // Connecting status
    const socket = new SockJS('/VersionControlWebSocketEndpoint');
    versionControlClient = Stomp.over(socket);

    versionControlClient.connect({}, function (frame) {
        console.log('Connected to Version Control WebSocket: ' + frame);
        updateStatus('Connected', 'fa-check-circle'); // Connected status

        // Subscribe to the version control topic
        versionControlClient.subscribe('/sendMessageToUpdateVersionControlWS/saveVersion', function (messageOutput) {
            console.log('Version Control Message received: ' + messageOutput.body);

        });

        // Subscribe to the draft status updates
        versionControlClient.subscribe('/sendMessageToUpdateVersionControlWS/draftStatus', function (messageOutput) {
            if(messageOutput.body== "failed to save"){
                updateStatus(messageOutput.body, 'fa-times-circle'); 
            }
            if(messageOutput.body== "Draft saved"){
                updateStatus(messageOutput.body, 'fa-save'); // Update status with a draft saved message
            }

            
        });

    }, function (error) {
        console.error('Version Control WebSocket connection error:', error);
        scheduleReconnect();
    });
}

function scheduleReconnect() {
    setTimeout(function () {
        updateStatus('Reconnecting...', 'fa-exclamation-triangle');
        console.log('Attempting to reconnect to Version Control WebSocket...');
        initializeVersionControlSocket();
    }, reconnectDelay);
}

document.addEventListener('DOMContentLoaded', () => {
    initializeVersionControlSocket();
});

function updateStatus(status, icon) {
    const statusElement = document.getElementById('version-control-status');
    statusElement.innerHTML = `<i class="fas ${icon}"></i> ${status}`;
}







