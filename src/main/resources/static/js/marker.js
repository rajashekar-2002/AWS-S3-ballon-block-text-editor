
let markerTimeout;
document.addEventListener('DOMContentLoaded', () => {
    const markerBtn = document.getElementById('marker-btn');
    const markerColorSelect = document.getElementById('marker-color');

    // Reduce the intensity of the color
    const adjustColorIntensity = (color) => {
        const colorMap = {
            yellow: 'rgba(255, 255, 0, 0.3)', // Reduced intensity yellow
            green: 'rgba(0, 128, 0, 0.3)',   // Reduced intensity green
            red: 'rgba(255, 0, 0, 0.3)'      // Reduced intensity red
        };
        return colorMap[color] || color; // Return the adjusted color or the original color
    };

    // Add an empty option to reset the select element
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select color';
    markerColorSelect.add(defaultOption, markerColorSelect.firstChild);
    markerColorSelect.value = '';

    // Hide the default option using CSS
    defaultOption.style.display = 'none';

    markerBtn.addEventListener('click', () => {
        markerColorSelect.style.display = markerColorSelect.style.display === 'none' ? 'block' : 'none';
        clearTimeout(markerTimeout);
        markerTimeout = setTimeout(() => {
            markerColorSelect.style.display = 'none'; // Hide dropdown after selection
        }, 8000);

    });

    markerColorSelect.addEventListener('change', () => {
        const color = markerColorSelect.value;
        const adjustedColor = adjustColorIntensity(color);

        // Use styleWithCSS to apply custom styles
        document.execCommand('styleWithCSS', false, true);
        document.execCommand('backColor', false, adjustedColor);

        markerColorSelect.style.display = 'none'; // Hide dropdown after selection
        // Reset the select element to the default option
        markerColorSelect.value = '';
        //updateVersionControl();
    });

    // Stop the timeout if the mouse is over the dropdown
    markerColorSelect.addEventListener('mouseover', () => {
        clearTimeout(markerTimeout);
    });

    // Restart the timeout when the mouse leaves the dropdown
    markerColorSelect.addEventListener('mouseout', () => {
        if (markerColorSelect.style.display === 'block') {
            markerTimeout = setTimeout(() => {
                markerColorSelect.style.display = 'none'; // Hide dropdown after timeout
            }, 8000);
        }
    });

});

