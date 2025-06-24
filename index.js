let parks = [];

//Getting elements
document.addEventListener('DOMContentLoaded', () => {
const parksContainer = document.getElementById("park-container");
const countySelect= document.getElementById("county-container");
const activitySelect= document.getElementById("activity-container");
const seachInput= document.getElementById("search-input");
const darkModeToggle = document.getElementById('dark-mode-toggle');

//Fetching Parks from json-server
fetch('http://localhost:3000/parks')
    .then((res) => res.json())
    .then((data)=>{
        parks = data;
        renderParks(parks);
    })
    .catch((error) => console.error('Error fetching parks:', error));
 
 //Rendering parks to DOM 
 function renderParks(parks) {
    parksContainer.innerHTML = '';

    if (parks.length === 0)  {
        parksContainer.innerHTML = `<p>No such park.</p>`;
        return;
    }
    parks.forEach(park => {
        const parkDiv = document.createElement('div');
        parkDiv.classList.add("park");
        
        parkDiv.innerHTML = `
          <h2>${park.name}</h2>
        <p><strong>Location:</strong> ${park.location}</p>
        <p><strong>Wildlife:</strong> ${park.wildlife.join(', ')}</p>
        <p><strong>Activities:</strong> ${park.activities.join(', ')}</p>
      `;
       parksContainer.appendChild(parkDiv);
    });
  

//Event Listeners
searchInput.addEventListener('input', () => {
  filterParks();
});
countySelect.addEventListener('change', () => {
  filterParks();
});
activitySelect.addEventListener('change', () => {
  filterParks();
});
darkModeToggle.addEventListener('click', toggleDarkMode);
})