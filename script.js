// Simple test - this should show an alert when you click the button
function testButton() {
    alert("Button clicked! JavaScript is working!");
}

// Find the "Find Games Near Me" button and add click event
let findButton = document.querySelector('.hero-buttons .btn-primary');

if (findButton) {
    findButton.addEventListener('click', testButton);
    console.log("Button found and event listener added!");
} else {
    console.log("Button not found!");
}
