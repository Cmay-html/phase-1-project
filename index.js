// A list to keep all the parks
let parks = [];
let currentEditIndex = null;

document.addEventListener("DOMContentLoaded", function() {
  // Grab page elements
  const parksContainer = document.getElementById("parks-container");
  const countyFilter = document.getElementById("county-container");
  const activityFilter = document.getElementById("activity-container");
  const searchInput = document.getElementById("search-input");
  const darkModeBtn = document.getElementById("dark-mode-toggle");

  const newForm = document.getElementById("new-form");
  const editForm = document.getElementById("edit-form");
  const cancelEdit = document.getElementById("cancel-edit");

  // Load parks from the server
  function loadParks() {
    fetch("http://localhost:3000/parks")
      .then(res => res.json())
      .then(data => {
        parks = data;
        showFilteredParks();
      })
      .catch(err => {
        console.log("Problem loading parks:", err);
        parksContainer.innerHTML = "<p>Oops! Could not load parks.</p>";
      });
  }

  // Show parks on screen
  function showParks(parksList) {
    parksContainer.innerHTML = "";

    if (parksList.length === 0) {
      parksContainer.innerHTML = "<p>No parks found.</p>";
      return;
    }

    parksList.forEach((park, index) => {
      const card = document.createElement("div");
      card.className = "park";

       // Create image HTML if there are multiple image URLs
    let imageHTML = "";
    if (park.images && park.images.length > 0) {
      imageHTML = park.images.map(url =>
        `<img src="${url}" alt="${park.name}" style="max-width:300px; margin: 0 10px 10px 0; display: inline-block;" />
`
      ).join('');
    }

      card.innerHTML = `
        <h2>${park.name}</h2>
        ${imageHTML}
        <p><strong>Location:</strong> ${park.location}</p>
        <p><strong>Wildlife:</strong> ${park.wildlife.join(", ")}</p>
        <p><strong>Activities:</strong> ${park.activities.join(", ")}</p>
        <button class="edit-btn" data-index="${index}">Edit</button>
        <button class="delete-btn" data-index="${index}">Delete</button>
      `;

      parksContainer.appendChild(card);
    });
  }

  // Filter based on user input
  function showFilteredParks() {
    const county = countyFilter.value.toLowerCase();
    const activity = activityFilter.value.toLowerCase();
    const keyword = searchInput.value.toLowerCase();

    const filtered = parks.filter(park => {
      const inCounty = county === "all" || park.location.toLowerCase().includes(county);
      const hasActivity = activity === "all" || park.activities.some(a => a.toLowerCase() === activity);
      const matchesSearch = park.name.toLowerCase().includes(keyword) ||
        park.location.toLowerCase().includes(keyword) ||
        park.wildlife.some(w => w.toLowerCase().includes(keyword)) ||
        park.activities.some(a => a.toLowerCase().includes(keyword));

      return inCounty && hasActivity && matchesSearch;
    });

    showParks(filtered);
  }

  // When user submits new park form
  newForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const newPark = {
      name: newForm.name.value,
      location: newForm.location.value,
      wildlife: newForm.wildlife.value.split(",").map(w => w.trim()),
      activities: newForm.activities.value.split(",").map(a => a.trim()),
      image: newForm.image.value
    };

    fetch("http://localhost:3000/parks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPark)
    })
    .then(() => {
      loadParks();
      newForm.reset();
    })
    .catch(() => alert("Failed to add park."));
  });

  // Edit button clicked
  parksContainer.addEventListener("click", function(e) {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("edit-btn")) {
      currentEditIndex = index;
      const park = parks[index];

      editForm.name.value = park.name;
      editForm.location.value = park.location;
      editForm.wildlife.value = park.wildlife.join(", ");
      editForm.activities.value = park.activities.join(", ");
      editForm.images.value = park.images;

      newForm.classList.add("hidden");
      editForm.classList.remove("hidden");
    }

    if (e.target.classList.contains("delete-btn")) {
      const parkId = parks[index].id;
      fetch(`http://localhost:3000/parks/${parkId}`, {
        method: "DELETE"
      })
      .then(() => loadParks())
      .catch(() => alert("Could not delete park."));
    }
  });

  // Cancel editing
  cancelEdit.addEventListener("click", function() {
    currentEditIndex = null;
    editForm.reset();
    editForm.classList.add("hidden");
    newForm.classList.remove("hidden");
  });

  // Submit updated park
  editForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const park = parks[currentEditIndex];

    const updated = {
      ...park,
      name: editForm.name.value,
      location: editForm.location.value,
      wildlife: editForm.wildlife.value.split(",").map(w => w.trim()),
      activities: editForm.activities.value.split(",").map(a => a.trim()),
      images: editForm.images.value
    };

    fetch(`http://localhost:3000/parks/${park.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
    .then(() => {
      loadParks();
      cancelEdit.click();
    })
    .catch(() => alert("Update failed."));
  });

  // Filter when inputs change
  searchInput.addEventListener("input", showFilteredParks);
  countyFilter.addEventListener("change", showFilteredParks);
  activityFilter.addEventListener("change", showFilteredParks);

  // Toggle dark mode
  darkModeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
  });

  // Load parks when the page is ready
  loadParks();
});
