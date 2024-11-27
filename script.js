
function toggleTheme() {
  const body = document.body;
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
  } else {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
  }
}

// Fetch data from backend and initialize the charts
function fetchDataAndInitializeCharts() {
  fetch('https://chatgpt-backend-y899.onrender.com/evaluation')
      .then(response => response.json())
      .then(data => {
          initializeCharts(data); // Pass the data to your chart initialization function
      })
      .catch(error => {
          console.error('Error fetching evaluation data:', error);
      });
}

// Initialize charts based on the fetched data
function initializeCharts(data) {
  const grid = document.getElementById('charts-grid');
  grid.innerHTML = ''; // Clear any existing charts

  // Loop through the data and create charts
  for (let domain in data) {
      const { accuracy, avgResponseTime } = data[domain];

      // Create chart cards based on the evaluation results
      const chartCard = document.createElement('div');
      chartCard.classList.add('chart-card');
      chartCard.innerHTML = `
          <div class="header">
              <h2>${domain}</h2>
              <p>Accuracy: ${(accuracy * 100).toFixed(2)}%</p>
              <p>Avg Response Time: ${(avgResponseTime).toFixed(2)} ms</p>
          </div>
          <div class="content">
              <canvas id="${domain.toLowerCase()}-chart" width="200" height="200"></canvas>
          </div>
      `;
      grid.appendChild(chartCard);

      // Get the context of the canvas
      const ctx = chartCard.querySelector('canvas').getContext('2d');

      // Render the chart
      new Chart(ctx, {
          type: 'bar', // You can change this to other types like 'pie', 'line', etc.
          data: {
              labels: ['Accuracy', 'Avg Response Time'],
              datasets: [{
                  label: domain,
                  data: [accuracy * 100, avgResponseTime], // Use accuracy and response time data
                  backgroundColor: ['#3498db', '#2ecc71'], // You can change the colors
              }],
          },
      });
  }
}

// Change the topic when a navigation link is clicked
function changeTopic(topic) {
  document.getElementById('profile-section').style.display = 'none';
  document.getElementById('dataset-overview').style.display = 'none';
  document.getElementById('charts-grid').style.display = 'grid';
  fetchDataAndInitializeCharts(); // Call to fetch and display charts for the selected topic
}

// Show Profile Section
function showProfile() {
  document.getElementById('profile-section').style.display = 'block';
  document.getElementById('dataset-overview').style.display = 'none';
  document.getElementById('charts-grid').style.display = 'none';
}

// Show Dataset Overview Section
function showDatasetOverview() {
  document.getElementById('profile-section').style.display = 'none';
  document.getElementById('dataset-overview').style.display = 'block';
  document.getElementById('charts-grid').style.display = 'none';
}

// Initialize the page by fetching the data and setting up charts on load
document.addEventListener('DOMContentLoaded', function() {
  fetchDataAndInitializeCharts(); // This will fetch data and initialize charts for the default view
});
