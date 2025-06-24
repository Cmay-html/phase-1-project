let parks = [];

//Getting elements
const parksContainer = getElementById("park-container");
const countySelect= getElementById("county-container");
const activitySelect= getElementById("activity-container");
const seachInput= getElementById("search-input");

//Fetching Parks from json-server
fetch('http://localhost:3000/parks')
    .then((res) => res.json())
    .then((data)=>{
        parks = data;
        renderParks(parks);
    })
    .catch((error) => console.error('Error fetching parks:', error));
 
    
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