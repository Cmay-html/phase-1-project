let parks = [];

// Getting elements
document.addEventListener('DOMContentLoaded', () => {
  const parksContainer = document.getElementById("parks-container");
  const countySelect = document.getElementById("county-container");
  const activitySelect = document.getElementById("activity-container");
  const searchInput = document.getElementById("search-input");
  const darkModeToggle = document.getElementById('dark-mode-toggle');

  // Fetching parks from json-server
  fetch('http://localhost:3000/parks')
    .then(res => res.json())
    .then(data => {
      parks = data;
      displayParks(parks);
    })
    .catch(error => console.error('Error fetching parks:', error));

  // Display parks in the DOM
  function displayParks(parksToDisplay) {
    parksContainer.innerHTML = '';

    if (parksToDisplay.length === 0) {
      parksContainer.innerHTML = `<p>No such park.</p>`;
      return;
    }

    parksToDisplay.forEach(park => {
      const parkDiv = document.createElement('div');
      parkDiv.classList.add("park");

      parkDiv.innerHTML = `
        <h2>${park.name}</h2>
        <img src="${park.image}" alt="Image of ${park.name}" />
        <p><strong>Location:</strong> ${park.location}</p>
        <p><strong>Wildlife:</strong> ${park.wildlife.join(', ')}</p>
        <p><strong>Activities:</strong> ${park.activities.join(', ')}</p>
      `;

      parksContainer.appendChild(parkDiv);
    });
  }

  // Apply filters based on user input
  function applyFilters() {
    const countyValue = countySelect.value.toLowerCase();
    const activityValue = activitySelect.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = parks.filter(park => {
      const matchesCounty = countyValue === "all" || park.location.toLowerCase().includes(countyValue);
      const matchesActivity = activityValue === "all" || park.activities.some(activity =>
        activity.toLowerCase().includes(activityValue)
      );
      const matchesSearch = park.name.toLowerCase().includes(searchTerm) ||
        park.wildlife.some(animal => animal.toLowerCase().includes(searchTerm));

      return matchesCounty && matchesActivity && matchesSearch;
    });

    displayParks(filtered);
  }

  // Dark mode toggle function
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }

  // Event listeners for filtering and dark mode
  searchInput.addEventListener('input', applyFilters);
  countySelect.addEventListener('change', applyFilters);
  activitySelect.addEventListener('change', applyFilters);
  darkModeToggle.addEventListener('click', toggleDarkMode);
});
