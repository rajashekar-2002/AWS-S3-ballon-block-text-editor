//section.js
import { getActiveParagraph, hideToolbox } from "./para-toolbox.js";

document.addEventListener('DOMContentLoaded', () => {

    const targetCheckbox = document.getElementById("structure-collapse");
    let sectionContainer = document.getElementById("structure-container");
    
    
    // Function to remove existing section classes
    function removeSectionClasses(element) {
        element.classList.remove('section-branch', 'subsection-branch', 'sub-subsection-branch');
    }

    // Add section class
    document.getElementById('sectionButton').onclick = () => {
        let activeParagraph = getActiveParagraph();
        removeSectionClasses(activeParagraph);
        if (activeParagraph) {
            activeParagraph.classList.add('section-branch');
            buildStructure();
            hideToolbox();
        }

        const targetCheckbox = document.getElementById("structure-collapse");

 

        // Determine if the checkbox is checked or not
        if (!targetCheckbox.checked &&  sectionContainer.querySelector('button')) {
            console.log(`Checkbox with ID ${targetCheckbox.id} is open.`);
                targetCheckbox.checked = true;
        } 


    };

    // Add subsection class
    document.getElementById('subsectionButton').onclick = () => {
        let activeParagraph = getActiveParagraph();
        removeSectionClasses(activeParagraph);
        if (activeParagraph) {
            activeParagraph.classList.add('subsection-branch');
            buildStructure();
            hideToolbox();
        }
        // Determine if the checkbox is checked or not
        if (!targetCheckbox.checked &&   sectionContainer.querySelector('button')) {
            console.log(`Checkbox with ID ${targetCheckbox.id} is open.`);
                targetCheckbox.checked = true;
        } 

    };

    // Add sub-subsection class
    document.getElementById('subSubsectionButton').onclick = () => {
        let activeParagraph = getActiveParagraph();
        removeSectionClasses(activeParagraph);
        if (activeParagraph) {
            activeParagraph.classList.add('sub-subsection-branch');
            buildStructure();
            hideToolbox();
        }
           // Determine if the checkbox is checked or not
            if (!targetCheckbox.checked &&   sectionContainer.querySelector('button')) {
                console.log(`Checkbox with ID ${targetCheckbox.id} is open.`);
                    targetCheckbox.checked = true;
            } 
    };




    document.getElementById('RemoveSectionButton').onclick = () => {
        let activeParagraph = getActiveParagraph();

        removeSectionClasses(activeParagraph);
        buildStructure();
           // Determine if the checkbox is checked or not
            if (!targetCheckbox.checked &&   sectionContainer.querySelector('button')) {
                console.log(`Checkbox with ID ${targetCheckbox.id} is open.`);
                    targetCheckbox.checked = true;
            } 
    };

    // Hide toolbox when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#para-toolbox')) {
            hideToolbox();
        }
    });


    // validateStructure();
    // Initial build of the structure
    // buildStructure();

});









export function validateStructure() {
    const paragraphs = document.querySelectorAll('.para-container p');

    let hasSection = false;
    let hasSubsection = false;

    paragraphs.forEach(paragraph => {
        if (paragraph.classList.contains('section-branch')) {
            hasSection = true;
            hasSubsection = false;
        } else if (paragraph.classList.contains('subsection-branch')) {
            if (!hasSection) {
                paragraph.classList.remove('subsection-branch');
            } else {
                hasSubsection = true;
            }
        } else if (paragraph.classList.contains('sub-subsection-branch')) {
            if (!hasSubsection) {
                paragraph.classList.remove('sub-subsection-branch');
            }
        }
    });
}





export function updateToolboxButtons() {
    let activeParagraph=getActiveParagraph();
    // Find the active paragraph
    // let activeParagraph = document.querySelector('.active-paragraph'); // Or however you define it
    let currentParaContainer = activeParagraph.closest('.para-container');
    let previousContainer = currentParaContainer.previousElementSibling;

    // console.log("Active Paragraph:", activeParagraph);
    // console.log("Checking previous sibling containers...");

    const removeSectionButton = document.getElementById('RemoveSectionButton');
    if (activeParagraph.classList.contains('section-branch') ||
        activeParagraph.classList.contains('subsection-branch') ||
        activeParagraph.classList.contains('sub-subsection-branch')) {
        removeSectionButton.style.display = 'block';
    } else {
        removeSectionButton.style.display = 'none';
    }

    // Loop through previous sibling containers to find the latest <p> tag
    while (previousContainer) {
        // console.log("Checking previous container:", previousContainer);

        // Get the <p> tag inside the previous container
        let previousParagraph = previousContainer.querySelector('p');

        if (previousParagraph) {
            // console.log("Found previous <p> tag:", previousParagraph);

            if (previousParagraph.classList.contains('section-branch')) {
                // console.log("Found section-branch class on previous <p> tag.");
                document.getElementById('sectionButton').style.display = 'block'; // Hide Add Section
                document.getElementById('subsectionButton').style.display = 'block'; // Show Add Sub-Section
                document.getElementById('subSubsectionButton').style.display = 'none'; // Show Add Sub-Sub-Section
                // document.getElementById('RemoveSectionButton').style.display = 'block';
                return; // Stop checking further
            } else if (previousParagraph.classList.contains('subsection-branch')) {
                // console.log("Found subsection-branch class on previous <p> tag.");
                document.getElementById('sectionButton').style.display = 'block'; // Show Add Section
                document.getElementById('subsectionButton').style.display = 'block'; // Show Add Sub-Section
                document.getElementById('subSubsectionButton').style.display = 'block'; // Show Add Sub-Sub-Section
                // document.getElementById('RemoveSectionButton').style.display = 'block';
                return; // Stop checking further
            } else if (previousParagraph.classList.contains('sub-subsection-branch')) {
                // console.log("Found sub-subsection-branch class on previous <p> tag.");
                document.getElementById('sectionButton').style.display = 'block'; // Show Add Section
                document.getElementById('subsectionButton').style.display = 'block'; // Show Add Sub-Section
                document.getElementById('subSubsectionButton').style.display = 'block'; // Hide Add Sub-Sub-Section
                // document.getElementById('RemoveSectionButton').style.display = 'block';
                return; // Stop checking further
            } else {
                // console.log("Previous <p> tag does not have the required classes.");
            }
        } else {
            // console.log("No <p> tag found in the previous container.");
        }

        // Move to the previous sibling container
        previousContainer = previousContainer.previousElementSibling;
    }

    // If no relevant class is found, show only the section button
    // console.log("No relevant <p> tag found, defaulting to showing only the section button.");
    document.getElementById('sectionButton').style.display = 'block'; // Show Add Section
    document.getElementById('subsectionButton').style.display = 'none'; // Hide Add Sub-Section
    document.getElementById('subSubsectionButton').style.display = 'none'; // Hide Add Sub-Sub-Section
    // document.getElementById('RemoveSectionButton').style.display = 'none';
}








function findParagraphByPositionForSections(position) {
    // List all <p> tags with section-related classes
    const paragraphs = Array.from(document.querySelectorAll('p.section-branch, p.subsection-branch, p.sub-subsection-branch'));

    // Find the <p> tag that matches the position
    if (position > 0 && position <= paragraphs.length) {
        console.log("??????????/",position);
        const targetParagraph = paragraphs[position - 1]; // Adjust for zero-based index
        console.log(`Found <p> tag at position ${position}:`, targetParagraph);

        // Scroll to the target paragraph
        targetParagraph.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // targetParagraph.classList.add('shine-effect');
        targetParagraph.classList.add('shine-effect');
        // Remove the shine effect class after the animation ends
        targetParagraph.addEventListener('animationend', () => {
            targetParagraph.classList.remove('shine-effect');
        }, { once: true }); // Use { once: true } to ensure the listener is removed after it runs

        return targetParagraph;
    } else {
        console.log(`Position ${position} is out of range.`);
        return null;
    }
}



// Add event listeners to buttons
function addButtonListeners() {
    document.querySelectorAll('#structure-container button').forEach(button => {
        button.addEventListener('click', () => {
            const position = parseInt(button.value, 10); // Get the position from the button's value
            findParagraphByPositionForSections(position); // Find and log the paragraph based on position
        });
    });
}

// // Call this function after building the structure
// export function buildStructure() {
//     const targetCheckbox = document.getElementById("structure-collapse");
//     const structureContainer = document.getElementById('structure-container');
//     let sectionCount = document.getElementById("sectionCount");
//     structureContainer.innerHTML = ''; // Clear previous structure

//     const sections = document.querySelectorAll('.para-container');

//     let currentSection = null;
//     let currentSubsection = null;
//     let position = 1; // Start position counter

//     sections.forEach(section => {
//         const paragraph = section.querySelector('p');
//         let textContent = paragraph.textContent;

//         if (textContent.length > 20) {
//             textContent = textContent.slice(0, 80) + '...';
//         }

//         // Create a button for the text content
//         const button = document.createElement('button');
//         button.textContent = textContent;
//         button.value = position; // Set the value attribute to the current position
//         button.style.all = 'unset'; // Remove all default button styling
//         button.style.cursor = 'pointer'; // Set cursor to pointer

//         // Add click event listener to the button
//         button.addEventListener('click', () => {
//             const pos = parseInt(button.value, 10); // Get position from button
//             findParagraphByPosition(pos); // Find and log the paragraph
//         });

//         if (paragraph.classList.contains('section-branch')) {
//             currentSection = document.createElement('li');
//             currentSection.classList.add('section');
//             const sectionContent = document.createElement('div');
//             sectionContent.classList.add('section-content');
//             sectionContent.appendChild(button); // Append the button to the section content

//             const sectionList = document.createElement('ul');
//             sectionList.classList.add('section-list');
//             currentSection.appendChild(sectionContent);
//             currentSection.appendChild(sectionList);
//             structureContainer.appendChild(currentSection);

//             currentSubsection = null; // Reset currentSubsection
//             position++;
//         } else if (paragraph.classList.contains('subsection-branch')) {
//             if (currentSection) {
//                 currentSubsection = document.createElement('li');
//                 currentSubsection.classList.add('subsection');
//                 const subsectionContent = document.createElement('div');
//                 subsectionContent.classList.add('subsection-content');
//                 subsectionContent.appendChild(button); // Append the button to the subsection content

//                 const subsectionList = document.createElement('ul');
//                 subsectionList.classList.add('subsection-list');
//                 currentSubsection.appendChild(subsectionContent);
//                 currentSubsection.appendChild(subsectionList);
//                 currentSection.querySelector('.section-list').appendChild(currentSubsection);

//                 currentSubsection.classList.add('has-children');
//                 position++;
//             }
//         } else if (paragraph.classList.contains('sub-subsection-branch')) {
//             if (currentSubsection) {
//                 const subSubsection = document.createElement('li');
//                 subSubsection.classList.add('sub-subsection');
//                 const subSubsectionContent = document.createElement('div');
//                 subSubsectionContent.classList.add('sub-subsection-content');
//                 subSubsectionContent.appendChild(button); // Append the button to the sub-subsection content
//                 subSubsection.appendChild(subSubsectionContent);
//                 currentSubsection.querySelector('.subsection-list').appendChild(subSubsection);
//                 position++;
//             }
//         }

//             // Get the counts of each class
//             const sectionCountValue = document.querySelectorAll('p.section-branch').length;
//             const subsectionCountValue = document.querySelectorAll('p.subsection-branch').length;
//             const subSubsectionCountValue = document.querySelectorAll('p.sub-subsection-branch').length;

//             // Construct the display string with conditional checks and ternary operators
//             const sectionCountText = 
//             (sectionCountValue > 0 ? `s : ${sectionCountValue}` : '') +
//             (subsectionCountValue > 0 ? `  ss : ${subsectionCountValue}` : '') +
//             (subSubsectionCountValue > 0 ? `  sss : ${subSubsectionCountValue}` : '');

//             // Set the textContent of sectionCount element
//             sectionCount.textContent = sectionCountText.trim() ? ` | ${sectionCountText}` : '';
//             // Increment position for each node
//     });

//     // Add toggle buttons after building the structure
//     document.querySelectorAll('.section, .subsection').forEach(section => {
//         const childList = section.querySelector('ul');
//         if (childList && childList.children.length > 0) {
//             const toggleButton = createToggleButton();
//             section.querySelector('div').appendChild(toggleButton);
//             toggleButton.addEventListener('click', () => {
//                 toggleVisibility(childList);
//             });
//         }
//     });

//     // Add button listeners
//     addButtonListeners();




  


//     // Determine if the checkbox is checked or not
//     if (!targetCheckbox.checked &&   structureContainer.querySelector('button')) {
//         console.log(`Checkbox with ID ${targetCheckbox.id} is open.`);
//         targetCheckbox.checked = true;
//     }else{
//         targetCheckbox.checked = false;
//     } 


// }






// function createToggleButton() {
//     const button = document.createElement('button');
//     button.textContent = '▼'; // Down arrow symbol
//     button.classList.add('toggle-button');
//     return button;
// }

// function toggleVisibility(element) {
//     if (element.style.display === 'none' || element.style.display === '') {
//         element.style.display = 'block';
//     } else {
//         element.style.display = 'none';
//     }
// }































export function buildStructure() {
    const targetCheckbox = document.getElementById("structure-collapse");
    const structureContainer = document.getElementById('structure-container');
    let sectionCount = document.getElementById("sectionCount");
    structureContainer.innerHTML = ''; // Clear previous structure

    const sections = document.querySelectorAll('.para-container');

    let currentSection = null;
    let currentSubsection = null;
    let position = 1; // Start position counter

    sections.forEach((section, index) => {
        const paragraph = section.querySelector('p');
        let textContent = paragraph.textContent;

        if (textContent.length > 20) {
            textContent = textContent.slice(0, 80) + '...';
        }

        // Create a button for the text content
        const button = document.createElement('button');
        button.textContent = textContent;
        button.value = position; // Set the value attribute to the current position
        button.style.all = 'unset'; // Remove all default button styling
        button.style.cursor = 'pointer'; // Set cursor to pointer

        // Add single click event listener to the button
        button.addEventListener('click', () => {
            const pos = parseInt(button.value, 10); // Get position from button
            findParagraphByPositionForSections(pos); // Find and log the paragraph
        });

        // Add double-click event listener to the button for toggling content visibility
        button.addEventListener('dblclick', () => {
            toggleVisibility(button.parentElement.nextElementSibling); // Toggle visibility of the content
        });

        if (paragraph.classList.contains('section-branch')) {
            currentSection = document.createElement('li');
            currentSection.classList.add('section');
            const sectionContent = document.createElement('div');
            sectionContent.classList.add('section-content');
            sectionContent.appendChild(button); // Append the button to the section content

            const sectionList = document.createElement('ul');
            sectionList.classList.add('section-list');
            currentSection.appendChild(sectionContent);
            currentSection.appendChild(sectionList);
            structureContainer.appendChild(currentSection);

            currentSubsection = null; // Reset currentSubsection

            // Calculate the count of subsections and sub-subsections
            const subsectionCount = calculateTotalSubsections(index + 1);
            const subSubsectionCount = calculateTotalSubSubsections(index + 1);

            // Create badges for subsection and sub-subsection counts
            const badges = document.createDocumentFragment();

            if (subsectionCount > 0) {
                const subsectionBadge = document.createElement('span');
                subsectionBadge.classList.add('badge', 'badge-secondary');
                subsectionBadge.textContent = `${subsectionCount}`;
                badges.appendChild(subsectionBadge);
                badges.appendChild(document.createTextNode(' ')); // Add a space
            }

            // if (subSubsectionCount > 0) {
            //     const subSubsectionBadge = document.createElement('span');
            //     subSubsectionBadge.classList.add('badge', 'badge-secondary');
            //     subSubsectionBadge.textContent = `sss: ${subSubsectionCount}`;
            //     badges.appendChild(subSubsectionBadge);
            // }

            // Append badges to the button
            button.appendChild(document.createTextNode(' ')); // Add a space between text and badges
            button.appendChild(badges);

            position++;
        } else if (paragraph.classList.contains('subsection-branch')) {
            if (currentSection) {
                currentSubsection = document.createElement('li');
                currentSubsection.classList.add('subsection');
                const subsectionContent = document.createElement('div');
                subsectionContent.classList.add('subsection-content');
                subsectionContent.appendChild(button); // Append the button to the subsection content

                const subsectionList = document.createElement('ul');
                subsectionList.classList.add('subsection-list');
                currentSubsection.appendChild(subsectionContent);
                currentSubsection.appendChild(subsectionList);
                currentSection.querySelector('.section-list').appendChild(currentSubsection);

                currentSubsection.classList.add('has-children');

                // Calculate the count of sub-subsections for this subsection
                const subSubsectionCount = calculateTotalSubSubsections(index + 1);

                // Create a badge for the sub-subsection count
                if (subSubsectionCount > 0) {
                    const subSubsectionBadge = document.createElement('span');
                    subSubsectionBadge.classList.add('badge', 'badge-secondary');
                    subSubsectionBadge.textContent = `${subSubsectionCount}`;
                    button.appendChild(document.createTextNode(' ')); // Add a space between text and badge
                    button.appendChild(subSubsectionBadge);
                }

                position++;
            }
        } else if (paragraph.classList.contains('sub-subsection-branch')) {
            if (currentSubsection) {
                const subSubsection = document.createElement('li');
                subSubsection.classList.add('sub-subsection');
                const subSubsectionContent = document.createElement('div');
                subSubsectionContent.classList.add('sub-subsection-content');
                subSubsectionContent.appendChild(button); // Append the button to the sub-subsection content
                subSubsection.appendChild(subSubsectionContent);
                currentSubsection.querySelector('.subsection-list').appendChild(subSubsection);
                position++;
            }
        }

        // Get the counts of each class
        const sectionCountValue = document.querySelectorAll('p.section-branch').length;
        const subsectionCountValue = document.querySelectorAll('p.subsection-branch').length;
        const subSubsectionCountValue = document.querySelectorAll('p.sub-subsection-branch').length;

        // Construct the display string with conditional checks and ternary operators
        const sectionCountText =
            (sectionCountValue > 0 ? `s : ${sectionCountValue} ` : '') +
            (subsectionCountValue > 0 ? ` | ss : ${subsectionCountValue} ` : '') +
            (subSubsectionCountValue > 0 ? ` | sss : ${subSubsectionCountValue}` : '');

        // Set the textContent of sectionCount element
        sectionCount.textContent = sectionCountText.trim() ? ` | ${sectionCountText}` : '';
    });

    // Determine if the checkbox is checked or not
    if (!targetCheckbox.checked && structureContainer.querySelector('button')) {
        console.log(`Checkbox with ID ${targetCheckbox.id} is open.`);
        targetCheckbox.checked = true;
    } else {
        targetCheckbox.checked = false;
    }
}


function toggleVisibility(element) {
    if (element.style.display === 'none' || element.style.display === '') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

function calculateTotalSubsections(start) {
    const paragraphs = document.querySelectorAll('.para-container p');
    let subsectionCount = 0;

    for (let i = start; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];

        if (paragraph.classList.contains('section-branch') ) {
            break; // Stop counting if a section-branch or sub-subsection-branch is found
        }

        if (paragraph.classList.contains('subsection-branch')) {
            subsectionCount++; // Increment the count for each subsection-branch
        }
    }

    return subsectionCount;
}

function calculateTotalSubSubsections(start) {
    const paragraphs = document.querySelectorAll('.para-container p');
    let subSubsectionCount = 0;

    for (let i = start; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];

        if (paragraph.classList.contains('section-branch') || paragraph.classList.contains('subsection-branch')) {
            break; // Stop counting if a section-branch or subsection-branch is found
        }

        if (paragraph.classList.contains('sub-subsection-branch')) {
            subSubsectionCount++; // Increment the count for each sub-subsection-branch
        }
    }

    return subSubsectionCount;
}
