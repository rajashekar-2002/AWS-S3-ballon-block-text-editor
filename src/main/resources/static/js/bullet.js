//bullet.js
import { addParagraph } from "./addParagraph.js";
import { getActiveParagraph } from "./para-toolbox.js";

// let currentBulletContainer = null;

// function createParagraph() {
//     let activeParagraph = getActiveParagraph();
//     console.log("create paragraph");
//     const p = addParagraph(activeParagraph.parentElement,false,"bullet").querySelector('p');
//     p.textContent ='';

//     // Create the bullet container and append it to the paragraph
//     const bulletContainer = document.createElement('div');
//     bulletContainer.className = 'bullet-container';

//     // Create an empty unordered list
//     const ul = document.createElement('ul');
//     bulletContainer.appendChild(ul);
//     p.appendChild(bulletContainer);
//     console.log("consyainer",bulletContainer);

//     // Set the created bullet container as the current one


//     // Add event listener to stop propagation within the bullet container
//     bulletContainer.addEventListener('click', function(event) {
//         event.stopPropagation(); // Prevent event from reaching parent elements
//     });


//     // Add keydown event listener to handle Enter key
//     bulletContainer.addEventListener('keydown', function(event) {
//         if (event.key === 'Enter') {
//             event.preventDefault();
//             console.log("enter pressed");
//             addBullet();
//         }
//     });



//     bulletContainer.addEventListener('click', function(e) {

//         if (e.target.tagName === 'LI') {
//             const items = document.querySelectorAll('.bullet-container ul > li');
//             items.forEach(item => item.classList.remove('selected'));
//             e.target.classList.add('selected');
//             currentBulletContainer = e.target.parentElement.parentElement;
//         }

//         // Show the toolbox near the cursor
//         const x = e.clientX;
//         const y = e.clientY;
//         showBulletToolbox(x, y, currentBulletContainer);

//     });

//     currentBulletContainer = bulletContainer;
//     console.log("currentBulletcontainer",currentBulletContainer);
    
// }


// window.addBullet = addBullet;

// export function addBullet() {
//     console.log("add bullet fnt");
//     createParagraph();
//     if (!currentBulletContainer) {
//         alert('Please create a paragraph first.');
//         return;
//     }
//     const items = document.querySelectorAll('.bullet-container ul > li');
//     items.forEach(item => item.classList.remove('selected'));

//     const ul = currentBulletContainer.querySelector('ul');
//     const newItem = document.createElement('li');
//     newItem.innerHTML = '';
//     ul.appendChild(newItem);
// }


// window.indentBullet = indentBullet;
// // // Optional: Add click event to each item to select it for indentation/outdenting
// function indentBullet() {
//     if (!currentBulletContainer) {
//         alert('Please create a paragraph first.');
//         return;
//     }
//     const selectedItems = getSelectedItems();
//     if (selectedItems.length > 0) {
//         selectedItems.forEach(item => {
//             let currentMarginLeft = parseInt(window.getComputedStyle(item).marginLeft, 10) || 0;
//             item.style.marginLeft = (currentMarginLeft + 50) + 'px'; // Increment margin for indentation
//             item.classList.add('indent');
//         });
//     }
//     hideBulletToolbox();
// }

// window.outdentBullet = outdentBullet;
// function outdentBullet() {
//     if (!currentBulletContainer) {
//         alert('Please create a paragraph first.');
//         return;
//     }
//     const selectedItems = getSelectedItems();
//     if (selectedItems.length > 0) {
//         selectedItems.forEach(item => {
//             let currentMarginLeft = parseInt(window.getComputedStyle(item).marginLeft, 10) || 0;
//             if (currentMarginLeft > 50) {
//                 item.style.marginLeft = (currentMarginLeft - 50) + 'px'; // Decrement margin for outdenting
//             } else {
//                 item.style.marginLeft = '0';
//             }
//             item.classList.remove('indent');
//         });
//     }
//     hideBulletToolbox();
// }

// function getSelectedItems() {
//     if (!currentBulletContainer) return [];
//     const items = Array.from(currentBulletContainer.querySelectorAll('ul > li'));
//     return items.filter(item => item.classList.contains('selected'));
// }






// let bulletToolboxTimeout;
// let activeBulletContainer;
// export function showBulletToolbox(x, y, bulletContainer) {
//     const bulletList = bulletContainer.querySelector('ul');
//     const bulletItems = bulletList.querySelectorAll('li');
//     activeBulletContainer = bulletContainer;

//     clearTimeout(bulletToolboxTimeout);

//     if (bulletItems.length > 0) {
//         const bulletToolbox = document.getElementById('bullet-toolbox');
//         bulletToolbox.style.display = 'flex';
//         bulletToolbox.style.left = `${x}px`;
//         bulletToolbox.style.top = `${y}px`;

//         const toolboxRect = bulletToolbox.getBoundingClientRect();
//         const viewportWidth = window.innerWidth;
//         const viewportHeight = window.innerHeight;

//         if (toolboxRect.right > viewportWidth) {
//             bulletToolbox.style.left = `${viewportWidth - toolboxRect.width}px`;
//         }
//         if (toolboxRect.bottom > viewportHeight) {
//             bulletToolbox.style.top = `${viewportHeight - toolboxRect.height}px`;
//         }

//         bulletContainer.removeEventListener('input', hideBulletToolboxOnInput);
//         bulletContainer.addEventListener('input', hideBulletToolboxOnInput);

//         bulletToolbox.removeEventListener('mouseover', stopHideBulletTimeout);
//         bulletToolbox.addEventListener('mouseover', stopHideBulletTimeout);

//         bulletToolbox.removeEventListener('mouseout', restartHideBulletTimeout);
//         bulletToolbox.addEventListener('mouseout', restartHideBulletTimeout);

//         document.removeEventListener('click', handleClickOutsideBullet);
//         document.addEventListener('click', handleClickOutsideBullet);

//         startHideBulletTimeout();
//     } else {
//         hideBulletToolbox();
//     }
// }

// export function hideBulletToolbox() {
//     const bulletToolbox = document.getElementById('bullet-toolbox');
//     bulletToolbox.style.display = 'none';
//     if (activeBulletContainer) {
//         activeBulletContainer.removeEventListener('input', hideBulletToolboxOnInput);
//     }
//     clearTimeout(bulletToolboxTimeout);
// }

// function hideBulletToolboxOnInput() {
//     hideBulletToolbox();
// }

// function startHideBulletTimeout() {
//     bulletToolboxTimeout = setTimeout(() => {
//         hideBulletToolbox();
//     }, 4000);
// }

// function stopHideBulletTimeout() {
//     clearTimeout(bulletToolboxTimeout);
// }

// function restartHideBulletTimeout() {
//     if (document.getElementById('bullet-toolbox').style.display === 'flex') {
//         startHideBulletTimeout();
//     }
// }

// function handleClickOutsideBullet(event) {
//     const bulletToolbox = document.getElementById('bullet-toolbox');
//     if (!bulletToolbox.contains(event.target) && !activeBulletContainer.contains(event.target)) {
//         hideBulletToolbox();
//     }
// }
















let currentBulletContainer = null;

window.createParagraph = createParagraph;

function createParagraph() {
    let activeParagraph = getActiveParagraph();
    console.log("create paragraph");
    const p = addParagraph(activeParagraph.parentElement, false, "bullet").querySelector('p');
    p.textContent = '';

    // Create the bullet container and append it to the paragraph
    const bulletContainer = document.createElement('div');
    bulletContainer.className = 'bullet-container';

    // Create an empty unordered list
    const ul = document.createElement('ul');
    ul.className = "bullet-container-ul";
    bulletContainer.appendChild(ul);
    p.appendChild(bulletContainer);
    console.log("container", bulletContainer);

    // Set the created bullet container as the current one
    currentBulletContainer = bulletContainer;

    // Add event listener to stop propagation within the bullet container
    bulletContainer.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event from reaching parent elements
    });

    // Add keydown event listener to handle Enter key
    bulletContainer.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            console.log("<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            event.preventDefault();
            console.log("Enter pressed");
            addBullet();
        }
    });



    // Handle clicking on bullet items and showing the toolbox
    bulletContainer.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            console.log("clcik in li toolbox show ..........................")
            const items = document.querySelectorAll('.bullet-container ul > li');
            items.forEach(item => item.classList.remove('selected'));
            e.target.classList.add('selected');
            currentBulletContainer = e.target.parentElement.parentElement;
        }

        // Show the toolbox near the cursor
        const x = e.clientX;
        const y = e.clientY;
        showBulletToolbox(x, y, currentBulletContainer);
    });

    console.log("currentBulletContainer", currentBulletContainer);

    // Add the first bullet immediately after creating the container
    addBullet();
}

window.addBullet = addBullet;

export function addBullet() {
    console.log("|||||||||||||||||||||||||||||||||||||||||add bullet function");

    // If no bullet container exists, create one first
    if (!currentBulletContainer) {
        createParagraph();
        return; // Exit if we had to create a new paragraph
    }

    const ul = currentBulletContainer.querySelector('ul');



    const newItem = document.createElement('li');
    newItem.innerHTML = 'text here';
    newItem.setAttribute('draggable', 'true'); // Make the item draggable


    ul.appendChild(newItem);

}



window.indentBullet = indentBullet;
// // Optional: Add click event to each item to select it for indentation/outdenting
function indentBullet() {
    if (!currentBulletContainer) {
        alert('Please create a paragraph first.');
        return;
    }
    const selectedItems = getSelectedItems();
    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            let currentMarginLeft = parseInt(window.getComputedStyle(item).marginLeft, 10) || 0;
            item.style.marginLeft = (currentMarginLeft + 50) + 'px'; // Increment margin for indentation
            item.classList.add('indent');
        });
    }
    hideBulletToolbox();
}

window.outdentBullet = outdentBullet;
function outdentBullet() {
    if (!currentBulletContainer) {
        alert('Please create a paragraph first.');
        return;
    }
    const selectedItems = getSelectedItems();
    if (selectedItems.length > 0) {
        selectedItems.forEach(item => {
            let currentMarginLeft = parseInt(window.getComputedStyle(item).marginLeft, 10) || 0;
            if (currentMarginLeft > 50) {
                item.style.marginLeft = (currentMarginLeft - 50) + 'px'; // Decrement margin for outdenting
            } else {
                item.style.marginLeft = '0';
            }
            item.classList.remove('indent');
        });
    }
    hideBulletToolbox();
}

function getSelectedItems() {
    if (!currentBulletContainer) return [];
    const items = Array.from(currentBulletContainer.querySelectorAll('ul > li'));
    return items.filter(item => item.classList.contains('selected'));
}

export function removeSelectedClassFromBullets() {
    // Find all <li> elements with the class 'selected' inside '.bullet-container-ul'
    const selectedBullets = document.querySelectorAll('.bullet-container-ul li.selected');
    
    // Loop through each selected bullet and remove the 'selected' class
    selectedBullets.forEach(bullet => {
        bullet.classList.remove('selected');
    });
}


let draggedItem = null; // Global variable to store the dragged item

export function handleDragBulletStart(e) {
    draggedItem = e.target; // Store the dragged item
    console.log("in handle start",draggedItem);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging'); // Optional: Add a class to style the dragged item
}

export function handleDropBullet(e) {
    e.preventDefault(); // Prevent default action (open as link for some elements)

    const droppedItem = e.target.closest('li'); // Ensure dropping is within an <li>

    // Ensure both draggedItem and droppedItem are valid elements and different
    if (draggedItem && droppedItem && draggedItem !== droppedItem) {
        // Swap the content and classes between draggedItem and droppedItem
        const draggedContent = draggedItem.innerHTML;
        const draggedClasses = [...draggedItem.classList];
        
        draggedItem.innerHTML = droppedItem.innerHTML;
        draggedItem.className = droppedItem.className;

        droppedItem.innerHTML = draggedContent;
        droppedItem.className = draggedClasses.join(' ');

        // Optional: Update any other properties or attributes as needed
    }

    // Clean up after drop
    if (draggedItem) {
        draggedItem.classList.remove('dragging'); // Remove dragging class
        draggedItem = null; // Clear the reference to the dragged item
    }
}

export function handleDragBulletOver(e) {
    e.preventDefault(); // Prevent default to allow drop
    e.dataTransfer.dropEffect = 'move'; // Indicate the allowed effect
}




let bulletToolboxTimeout;
let activeBulletContainer;
export function showBulletToolbox(x, y, bulletContainer) {

    const bulletList = bulletContainer.querySelector('ul');
    const bulletItems = bulletList.querySelectorAll('li');
    activeBulletContainer = bulletContainer;

    clearTimeout(bulletToolboxTimeout);
    console.log("================",bulletContainer.querySelectorAll('.bullet-container-ul li.selected'));

    if (bulletItems.length > 0 &&  bulletContainer.querySelectorAll('.bullet-container-ul li.selected').length > 0) {
        const bulletToolbox = document.getElementById('bullet-toolbox');
        bulletToolbox.style.display = 'flex';
        bulletToolbox.style.left = `${x}px`;
        bulletToolbox.style.top = `${y}px`;

        const toolboxRect = bulletToolbox.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (toolboxRect.right > viewportWidth) {
            bulletToolbox.style.left = `${viewportWidth - toolboxRect.width}px`;
        }
        if (toolboxRect.bottom > viewportHeight) {
            bulletToolbox.style.top = `${viewportHeight - toolboxRect.height}px`;
        }

        bulletContainer.removeEventListener('input', hideBulletToolboxOnInput);
        bulletContainer.addEventListener('input', hideBulletToolboxOnInput);

        bulletToolbox.removeEventListener('mouseover', stopHideBulletTimeout);
        bulletToolbox.addEventListener('mouseover', stopHideBulletTimeout);

        bulletToolbox.removeEventListener('mouseout', restartHideBulletTimeout);
        bulletToolbox.addEventListener('mouseout', restartHideBulletTimeout);

        document.removeEventListener('click', handleClickOutsideBullet);
        document.addEventListener('click', handleClickOutsideBullet);

        startHideBulletTimeout();
    } else {
        hideBulletToolbox();
    }
}

export function hideBulletToolbox() {
    const bulletToolbox = document.getElementById('bullet-toolbox');
    bulletToolbox.style.display = 'none';
    if (activeBulletContainer) {
        activeBulletContainer.removeEventListener('input', hideBulletToolboxOnInput);
    }
    removeSelectedClassFromBullets();
    clearTimeout(bulletToolboxTimeout);
}

function hideBulletToolboxOnInput() {
    hideBulletToolbox();
}

function startHideBulletTimeout() {
    bulletToolboxTimeout = setTimeout(() => {
        hideBulletToolbox();
    }, 4000);
}

function stopHideBulletTimeout() {
    clearTimeout(bulletToolboxTimeout);
}

function restartHideBulletTimeout() {
    if (document.getElementById('bullet-toolbox').style.display === 'flex') {
        startHideBulletTimeout();
    }
}

function handleClickOutsideBullet(event) {
    const bulletToolbox = document.getElementById('bullet-toolbox');
    if (!bulletToolbox.contains(event.target) && !activeBulletContainer.contains(event.target)) {
        hideBulletToolbox();
    }
}


