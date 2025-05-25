// Initialize the map
  // Initialize the map
const map = L.map('map').setView(listing.geometry.coordinates.reverse(), 8);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);



// Add marker
L.marker(listing.geometry.coordinates,)
  .addTo(map)
  .bindPopup(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`);