const imageUpload = document.getElementById('file-input');
const imagePreview = document.getElementById('imagePreview');
const imageDiv = document.getElementById('drop-area');

// Attach an event listener to the input file field
imageUpload.addEventListener('change', function(event) {
  const file = event.target.files[0];

  // Check if a file is selected
  if (file) {
    // Create a FileReader object
    const reader = new FileReader();

    // Set the image source when the FileReader has finished reading the file
    reader.onload = function() {
      imagePreview.src = reader.result;
      imagePreview.style.display = 'block'; // Display the image preview
      imageDiv.style.display = 'block';
    };

    // Read the file as a URL
    reader.readAsDataURL(file);
  } else {
    // Clear the image preview if no file is selected
    imagePreview.src = '#';
    imagePreview.style.display = 'none'; // Hide the image preview
    imageDiv.style.display = 'none';
  }
});