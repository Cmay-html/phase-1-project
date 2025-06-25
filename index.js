let parks = [];
let currentEditIndex = null;

document.addEventListener('DOMContentLoaded', () => {
  const parksContainer = document.getElementById('parks-container');
  const newForm = document.getElementById('new-form');
  const editForm = document.getElementById('edit-form');
  const cancelEditBtn = document.getElementById('cancel-edit');

  // Display parks
  function displayParks(parksToDisplay) {
    parksContainer.innerHTML = '';
    if (parksToDisplay.length === 0) {
      parksContainer.innerHTML = '<p>No parks found.</p>';
      return;
    }
    parksToDisplay.forEach((park, index) => {
      const parkDiv = document.createElement('div');
      parkDiv.classList.add('park');
      parkDiv.innerHTML = `
        <h2>${park.name}</h2>
        ${park.image ? `<img src="${park.image}" alt="${park.name}" style="max-width:300px; max-height:200px;" />` : ''}
        <p><strong>Location:</strong> ${park.location}</p>
        <p><strong>Wildlife:</strong> ${park.wildlife.join(', ')}</p>
        <p><strong>Activities:</strong> ${park.activities.join(', ')}</p>
        <button class="edit-btn" data-index="${index}">Edit</button>
      `;
      parksContainer.appendChild(parkDiv);
    });
  }

  // Show edit form
  function showEditForm(index) {
    currentEditIndex = index;
    const park = parks[index];
    editForm.name.value = park.name;
    editForm.location.value = park.location;
    editForm.wildlife.value = park.wildlife.join(', ');
    editForm.activities.value = park.activities.join(', ');
    editForm.image.value = park.image || '';
    editForm.classList.remove('hidden');
    newForm.classList.add('hidden');
  }

  // Hide edit form
  function hideEditForm() {
    currentEditIndex = null;
    editForm.reset();
    editForm.classList.add('hidden');
    newForm.classList.remove('hidden');
  }

  // Add park
  newForm.addEventListener('submit', e => {
    e.preventDefault();
    const newPark = {
      id: parks.length ? parks[parks.length - 1].id + 1 : 1, // simple id increment
      name: newForm.name.value.trim(),
      location: newForm.location.value.trim(),
      wildlife: newForm.wildlife.value.split(',').map(w => w.trim()).filter(Boolean),
      activities: newForm.activities.value.split(',').map(a => a.trim()).filter(Boolean),
      image: newForm.image.value.trim()
    };
    parks = [...parks, newPark];
    newForm.reset();
    displayParks(parks);
  });

  // Edit park
  editForm.addEventListener('submit', e => {
    e.preventDefault();
    if (currentEditIndex === null) return;
    const updatedPark = {
      ...parks[currentEditIndex],
      name: editForm.name.value.trim(),
      location: editForm.location.value.trim(),
      wildlife: editForm.wildlife.value.split(',').map(w => w.trim()).filter(Boolean),
      activities: editForm.activities.value.split(',').map(a => a.trim()).filter(Boolean),
      image: editForm.image.value.trim()
    };
    parks = parks.map((p, i) => (i === currentEditIndex ? updatedPark : p));
    hideEditForm();
    displayParks(parks);
  });

  // Cancel edit
  cancelEditBtn.addEventListener('click', hideEditForm);

  // Event delegation for edit buttons
  parksContainer.addEventListener('click', e => {
    if (e.target.classList.contains('edit-btn')) {
      const index = parseInt(e.target.dataset.index, 10);
      showEditForm(index);
    }
  });

  // Initial display
  displayParks(parks);
});
