const deleteBuilding = btn => {
    const buildingId = btn.parentNode.querySelector('[name=buildingId]').value;

    const buildingElement = btn.closest('tr');

    fetch('/building/' + buildingId, {
        method: 'DELETE',
    })
     .then(result => {
        return result.json;
    })
     .then(data => {
        console.log(data);
        buildingElement.parentNode.removeChild(buildingElement);
     })
     .catch(err => {
        console.log(err);
    });

};

      // Open Modal
function openModal() {
        const imageInput = document.querySelector('.qrcodeImg');
        const imageValue = imageInput.value;
        const downloadLink = document.getElementById('downloadLink');

        const modal = document.getElementById('myModal');
        const modalImage = document.getElementById('modalImage');

        // Set the image source for the modal
        modalImage.src = imageValue;

         // Set the download link href attribute to the image URL
        downloadLink.href = imageValue;

        // Show the modal
        modal.style.display = 'block';
      }

      // Close Modal
function closeModal() {
        const modal = document.getElementById('myModal');
        modal.style.display = 'none';
}

 // Print Image
 function printImage() {
    const modalImage = document.getElementById('modalImage');
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print Image</title></head><body><img src="' + modalImage.src + '"></body></html>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  }

const deleteUser = btn => {
    // const userId = btn.parentNode.querySelector('[name=userId]').value;
      const userId = btn.dataset.userid; // get userId from data attribute

    const productElement = btn.closest('tr');

    fetch('/user/' + userId, {
        method: 'DELETE',
    })
     .then(result => {
        return result.json;
    })
     .then(data => {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
     })
     .catch(err => {
        console.log(err);
    });

};
