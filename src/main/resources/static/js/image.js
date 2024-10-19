//image.js
import { addParagraph } from "./addParagraph.js";
import { buildAnchorStructure } from "./anchorStructure.js";
import { getActiveParagraph, setActiveParagraph } from "./para-toolbox.js";
import { updateVersionControl } from "./versionControl.js";
function removeBRsInPara(pElement) {
    // Select the <p> element with the specified class
    // Check if the <p> element is found
    if (!pElement) {
        console.error('Paragraph with the specified class not found');
        return;
    }
    console.log(pElement);
    
    // Iterate through child nodes of the <p> element
    let childNodes = pElement.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        let node = childNodes[i];
        
        // Check if the node is a <br> tag
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
            // Check if the <br> tag is a direct child of the <p> element
            if (!node.previousElementSibling || node.previousElementSibling.nodeType === Node.TEXT_NODE) {
                pElement.removeChild(node);
                i--; // Adjust index after removal
            }
        }
    }
}


















// document.addEventListener('DOMContentLoaded', () => {

//     const editor = document.getElementById('editor');
//     const insertImageBtn = document.getElementById('insert-image-btn');
//     const imageUpload = document.getElementById('image-upload');
//     let isImageDraggedFromEditor=null;

//     // Toggle image upload input visibility
//     insertImageBtn.addEventListener('click', () => {
//         imageUpload.click();
//     });

//     // Handle image file selection
//     imageUpload.addEventListener('change', (event) => {
//         handleImageUpload(event.target.files[0]);
//     });

//     // Handle image drag start in editor
//     editor.addEventListener('dragstart', (e) => {
//         if (e.target.tagName === 'IMG') {
//         isImageDraggedFromEditor = true;
//         }
//     });

//     // Handle image drag end in editor
//     editor.addEventListener('dragend', () => {
//         isImageDraggedFromEditor = false;
//     });

//     // Handle image drop
//     editor.addEventListener('dragover', (e) => {
//         e.preventDefault(); // Prevent default to allow drop
//     });

//     editor.addEventListener('drop', (e) => {
//     e.preventDefault();
//     if (isImageDraggedFromEditor) {
//         // If image was dragged from within the editor, do nothing
//         isImageDraggedFromEditor = false;
//         return;
//     }
//     const files = e.dataTransfer.files;
//     if (files && files.length > 0 && files[0].type.startsWith('image/')) {
//         handleImageUpload(files[0]);
//     }
// });


//         // Handle image paste
//     editor.addEventListener('paste', (e) => {

//             const items = (e.clipboardData || e.originalEvent.clipboardData).items;
//             for (let i = 0; i < items.length; i++) {
//                 if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
//                     const file = items[i].getAsFile();
//                     handleImageUpload(file);
//                     break;
//                 }
//             }
//     });


//     // Function to handle image upload (from input or drag-and-drop)
//     function handleImageUpload(file) {
//         let activeParagraph = getActiveParagraph();
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 const imageUrl = e.target.result;

//                 // const newParagraphContainer = addParagraph(activeParagraph.parentElement);
//                 let activeParagraph =getActiveParagraph();
//                 let newParagraphContainer = null;
//                 try{
//                     newParagraphContainer = addParagraph(activeParagraph.parentElement);
//                 }catch(e){
//                     newParagraphContainer = addParagraph();
//                 }
//                 const p = newParagraphContainer.querySelector('p');
//                 setActiveParagraph(p);

//                 // Create an image element
//                 const img = document.createElement('img');
//                 img.src = imageUrl;
//                 img.alt = 'Uploaded image';
//                 img.classList.add('image');

//                 // Create a div with class "image-container" and append the image to it
//                 const imageContainer = document.createElement('div');
//                 imageContainer.classList.add('image-container');
//                 imageContainer.appendChild(img);

//                 // Append the image to the <p> tag inside the new paragraph container
//                 newParagraphContainer.querySelector('p').appendChild(imageContainer);
//                 removeBRsInPara(newParagraphContainer.querySelector('p.para-container-paragraph'));

//                 // Insert the new paragraph into the editor
//             };
//             reader.readAsDataURL(file);

//             // Reset file input to allow re-upload of the same file
//             imageUpload.value = '';
//             updateVersionControl();
//         }
//     }
// });


document.addEventListener('DOMContentLoaded', () => {

    const editor = document.getElementById('editor');
    const insertImageBtn = document.getElementById('insert-image-btn');
    const imageUpload = document.getElementById('image-upload');
    let isImageDraggedFromEditor = null;

    // Toggle image upload input visibility
    insertImageBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    // Handle image file selection
    imageUpload.addEventListener('change', (event) => {
        handleImageUpload(event.target.files[0]);
    });

    // Handle image drag start in editor
    editor.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            isImageDraggedFromEditor = true;
        }
    });

    // Handle image drag end in editor
    editor.addEventListener('dragend', () => {
        isImageDraggedFromEditor = false;
    });

    // Handle image drop
    editor.addEventListener('dragover', (e) => {
        e.preventDefault(); // Prevent default to allow drop
    });

    editor.addEventListener('drop', (e) => {
        e.preventDefault();
        if (isImageDraggedFromEditor) {
            // If image was dragged from within the editor, do nothing
            isImageDraggedFromEditor = false;
            return;
        }
        const files = e.dataTransfer.files;
        if (files && files.length > 0 && files[0].type.startsWith('image/')) {
            handleImageUpload(files[0]);
        }
    });

    // Handle image paste
    editor.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                const file = items[i].getAsFile();
                handleImageUpload(file);
                break;
            }
        }
    });

    // Function to handle image upload (from input or drag-and-drop)
// Function to handle image upload (from input or drag-and-drop)
function handleImageUpload(file) {
    if (file) {
        // Send POST request with file
        uploadFile(file)
            .then(({ imageUrl, fileName }) => {
                // Handle successful upload and add image to editor
                let activeParagraph = getActiveParagraph();
                let newParagraphContainer = null;
                try {
                    newParagraphContainer = addParagraph(activeParagraph.parentElement);
                } catch (e) {
                    newParagraphContainer = addParagraph();
                }
                const p = newParagraphContainer.querySelector('p');
                setActiveParagraph(p);

                // Create an image element
                const img = document.createElement('img');
                img.src = imageUrl; // Set image URL
                img.alt = 'Uploaded image';
                img.classList.add('image');
                img.setAttribute('value', fileName);// Add filename as a value

                // Create a div with class "image-container" and append the image to it
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.appendChild(img);

                // Append the image to the <p> tag inside the new paragraph container
                newParagraphContainer.querySelector('p').appendChild(imageContainer);
                removeBRsInPara(newParagraphContainer.querySelector('p.para-container-paragraph'));

                // Reset file input to allow re-upload of the same file
                imageUpload.value = '';
                updateVersionControl();
            })
            .catch(error => {
                console.error('Error uploading file:', error);
            });
    }
}

    // Function to send POST request with file
function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    return fetch('/upload', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Return both the URL and filename from the response
        return {
            imageUrl: data.imageUrl, // URL of the uploaded image
            fileName: data.fileName // Actual filename
        };
    });
}

});

































































const imageOptions = document.getElementById('image-options');


window.hideImageToolbox = hideImageToolbox;
export function hideImageToolbox(){
    // const imageOptions = document.getElementById('image-options');
    imageOptions.style.display = 'none';
}



document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    // const imageOptions = document.getElementById('image-options');
    let selectedImage = null;

    // Event listener for image click
    editor.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            selectImage(event.target);
        } else {
            imageOptions.style.display = 'none';
            selectedImage = null;
        }
    });

   

    let toolboxImageTimeout;
    // Function to select image and show options
    function selectImage(image) {
        let activeParagraph = getActiveParagraph();
        selectedImage = image;
        const rect = image.getBoundingClientRect();
        imageOptions.style.display = 'flex';

        console.log("===============================================",activeParagraph);
    
        const paraRect = activeParagraph.getBoundingClientRect();
    
        // Calculate the center position for x-axis relative to the activeParagraph
        const paraCenterX = paraRect.left + (paraRect.width / 2);
        const optionsWidth = imageOptions.offsetWidth;
        const centerX = paraCenterX - (optionsWidth / 2);
    
        // Set the position of imageOptions
        imageOptions.style.left = `${centerX}px`;
        imageOptions.style.top = `${rect.top - imageOptions.offsetHeight}px`;
    
        clearTimeout(toolboxImageTimeout);
        toolboxImageTimeout = setTimeout(() => {
            imageOptions.style.display = 'none';
        }, 2000);
    }
    





    // Stop the timeout if the mouse is over the dropdown
    imageOptions.addEventListener('mouseover', () => {
        clearTimeout(toolboxImageTimeout);
    });

    // Restart the timeout when the mouse leaves the dropdown
    imageOptions.addEventListener('mouseout', () => {
        if (imageOptions.style.display === 'block') {
            toolboxImageTimeout = setTimeout(() => {
                imageOptions.style.display = 'none'; // Hide dropdown after timeout
            }, 4000);
        }
    });



// hide toolbox if clic outside

    editor.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            imageOptions.style.display = 'flex';
        } else {
            imageOptions.style.display = 'none';
            
        }
    });




    // Resize options
    document.getElementById('resize-70').addEventListener('click', () => resizeImage(70));
    document.getElementById('resize-50').addEventListener('click', () => resizeImage(50));
    document.getElementById('resize-100').addEventListener('click', () => resizeImage(100));

    function resizeImage(percent) {
        if (selectedImage) {
            selectedImage.style.width = `${percent}%`;
        }
        imageOptions.style.display = 'none';
        updateVersionControl();
    }


    document.getElementById('addImageCaption').addEventListener('click', () => {
        if (selectedImage) {
            const caption = document.getElementById('captionImageInput').value;
            if (caption) {
                // Check if a caption already exists
                const existingCaption = selectedImage.parentElement.querySelector('.image-caption');
                if (!existingCaption) {
                    const captionElement = document.createElement('figcaption');
                    captionElement.className = 'image-caption';
                    captionElement.textContent = caption;
                    selectedImage.parentElement.appendChild(captionElement);
                } else {
                    // Optionally update the existing caption if needed
                    existingCaption.textContent = caption;
                }
                updateVersionControl();
            }
        }
        imageOptions.style.display = 'none';
    });


    // Remove caption
    document.getElementById('remove-caption-btn').addEventListener('click', () => {
        if (selectedImage) {
            const caption = selectedImage.parentElement.querySelector('.image-caption');
            if (caption) {
                caption.remove();
                updateVersionControl();
            }
        }
        imageOptions.style.display = 'none';
    });



    document.getElementById('insert-image-link-btn').addEventListener('click', () => {
        if (selectedImage) {
            const linkInput = document.getElementById('link-image-url');
            const link = linkInput.value;
            console.log(link);
    
            if (link) {
                // Check if the selected image's parent is a button
                let buttonElement = selectedImage.parentElement.tagName === 'BUTTON' ? selectedImage.parentElement : null;
                
                if (buttonElement) {
                    // Update the existing button's title attribute for the tooltip and onclick listener
                    buttonElement.setAttribute('title', link);
                    buttonElement.onclick = () => {
                        window.open(link, '_blank');
                    };
                    
                    // Reinitialize the tooltip to update the title
                    $(buttonElement).tooltip('dispose'); // Remove the old tooltip
                    $(buttonElement).tooltip(); // Initialize the new tooltip
                } else {
                    // Create a new button element
                    buttonElement = document.createElement('button');
                    buttonElement.classList.add('btn', 'btn-link');
                    buttonElement.setAttribute('data-toggle', 'tooltip');
                    buttonElement.setAttribute('data-placement', 'top');
                    buttonElement.setAttribute('title', link); // Set URL as title for tooltip
    
                    // Set onclick listener to redirect to the URL
                    buttonElement.onclick = () => {
                        window.open(link, '_blank');
                    };
    
                    // Insert the button before the image and append the image to the button
                    selectedImage.parentElement.insertBefore(buttonElement, selectedImage);
                    buttonElement.appendChild(selectedImage);
    
                    // Initialize Bootstrap tooltip (required for dynamically added elements)
                    $(buttonElement).tooltip();
                }
    
                // Clear the input field
                linkInput.value = '';
                buildAnchorStructure();
                updateVersionControl();
            }
        }
    });
    
    



    



    // Delete image
    // document.getElementById('delete-image').addEventListener('click', () => {
    //     if (selectedImage) {
    //         const container = selectedImage.parentElement;
    //         container.remove();
    //         imageOptions.style.display = 'none';
    //         updateVersionControl();

    //         const caption = selectedImage.parentElement.querySelector('.image-caption');
    //         if (caption) {
    //             caption.remove();
    //         }
            
    //     }
    // });


    document.getElementById('delete-image').addEventListener('click', () => {
        if (selectedImage) {
            const container = selectedImage.parentElement;
    
            // Extract the part of the URL after '/images/'
            const imageFilename = selectedImage.getAttribute('value');
            
            // Send GET request to backend
            sendDeleteRequest(imageFilename)
                .then(() => {
                    // Remove the image and caption from the DOM
                    container.remove();
                    imageOptions.style.display = 'none';
                    updateVersionControl();
                    
                    const caption = selectedImage.parentElement.querySelector('.image-caption');
                    if (caption) {
                        caption.remove();
                    }
                })
                .catch(error => {
                    console.error('Error deleting image:', error);
                });
        }
    });
    



});

    
    // Function to send GET request
   export function sendDeleteRequest(filename) {
        if (!filename) {
            return Promise.reject('Filename is null or empty');
        }
    
        const url = `/delete-image?filename=${encodeURIComponent(filename)}`;
        return fetch(url, {
            method: 'GET'
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
    }


