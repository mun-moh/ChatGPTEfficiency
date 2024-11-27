

// Function to toggle dark and light mode
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

// Function to fetch data from the backend
function fetchDataAndInitializeCharts() {
  fetch('https://chatgpt-backend-y899.onrender.com/evaluation')
    .then(response => response.json())
    .then(data => {
      console.log("Fetched Data:", data); // Log the data to check if we got it correctly
      if (data) {
        initializeCharts(data); // Initialize charts if data is present
      } else {
        console.error('No data received from the server');
      }
    })
    .catch(error => {
      console.error('Error fetching evaluation data:', error);
    });
}

// Function to initialize all charts for the results
function initializeCharts(data) {
  const grid = document.getElementById('charts-grid');
  grid.innerHTML = ''; // Clear any previous charts

  // Extract topics and metrics (accuracy and response time)
  const topics = Object.keys(data);
  const topicData = topics.map(topic => ({
    name: topic,
    accuracy: data[topic].accuracy * 100, // Convert accuracy to percentage
    responseTime: data[topic].avgResponseTime
  }));

  console.log("Chart Data:", topicData); // Log the data to verify

  if (topicData.length === 0) {
    console.error('No valid data for charts');
    return;
  }

  // Create Cards for each chart visualization
  createBarChartCard(topicData, grid);
  createPieChartCard(topicData, grid);
  createScatterPlotCard(topicData, grid);
  createLineChartCard(topicData, grid); // Add line chart for comparing accuracy
}

// Function to create Bar Chart Card
function createBarChartCard(topicData, grid) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `
    <h3>Accuracy Comparison (Bar Chart)</h3>
    <canvas id="barChart"></canvas>
  `;
  grid.appendChild(card);

  const barChartCtx = card.querySelector('#barChart');
  new Chart(barChartCtx, {
    type: 'bar',
    data: {
      labels: topicData.map(item => item.name),
      datasets: [{
        label: 'Accuracy Distribution',
        data: topicData.map(item => item.accuracy),
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 20,
            padding: 15
          }
        }
      }
    }
  });
}

// Function to create Pie Chart Card
function createPieChartCard(topicData, grid) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `
    <h3>Accuracy Distribution (Pie Chart)</h3>
    <canvas id="pieChart" style="max-width: 400px; margin: auto;"></canvas>
  `;
  grid.appendChild(card);

  const pieChartCtx = card.querySelector('#pieChart');
  new Chart(pieChartCtx, {
    type: 'pie',
    data: {
      labels: topicData.map(item => item.name),
      datasets: [{
        label: 'Accuracy Distribution',
        data: topicData.map(item => item.accuracy),
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 20,
            padding: 15
          }
        }
      }
    }
  });
}



// Function to create Scatter Plot Card (Accuracy vs Response Time)
function createScatterPlotCard(topicData, grid) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `
    <h3>Accuracy vs Response Time (Scatter Plot)</h3>
    <canvas id="scatterPlot"></canvas>
  `;
  
  // Hide the scatter plot card
  card.style.display = 'none'; // This hides the scatterplot

  grid.appendChild(card);

  const scatterPlotCtx = card.querySelector('#scatterPlot');
  new Chart(scatterPlotCtx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Accuracy vs Response Time',
        data: topicData.map(item => ({
          x: item.responseTime,
          y: item.accuracy
        })),
        backgroundColor: ['#3498db', '#e74c3c', '#2ecc71'],
        borderColor: '#fff',
        borderWidth: 2
      }]

    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Response Time (ms)'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Accuracy (%)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 20,
            padding: 15
          }
        }
      }
    }
  });
}









// Function to create Line Chart Card (Accuracy over Topics)
function createLineChartCard(topicData, grid) {
  const card = document.createElement('div');
  card.className = 'chart-card';
  card.innerHTML = `
    <h3>Accuracy Comparison Over Topics (Line Chart)</h3>
    <canvas id="lineChart"></canvas>
  `;
  grid.appendChild(card);

  const lineChartCtx = card.querySelector('#lineChart');
  new Chart(lineChartCtx, {
    type: 'line',
    data: {
      labels: topicData.map(item => item.name),
      datasets: [{
        label: 'Accuracy (%)',
        data: topicData.map(item => item.accuracy),
        fill: false,
        borderColor: '#3498db',
        tension: 0.1,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Topics'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Accuracy (%)'
          },
          ticks: {
            stepSize: 10
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 20,
            padding: 15
          }
        }
      }
    }
  });
}


// Function to handle Results navigation
function showResults() {
  document.getElementById('profile-section').style.display = 'none'; // Hide Profile
  document.getElementById('dataset-overview').style.display = 'none'; // Hide Dataset Overview
  document.getElementById('demo-section').style.display = 'none';     // Hide Demo section
  document.getElementById('charts-grid').style.display = 'grid';      // Show Results section
  fetchDataAndInitializeCharts(); // Fetch and display results for all topics
}

// Function to show the Profile Section
function showProfile() {
  document.getElementById('profile-section').style.display = 'block'; // Show Profile
  document.getElementById('dataset-overview').style.display = 'none'; // Hide Dataset Overview
  document.getElementById('demo-section').style.display = 'none';     // Hide Demo
  document.getElementById('charts-grid').style.display = 'none';      // Hide Results
}

// Function to show Dataset Overview Section
function showDatasetOverview() {
  document.getElementById('profile-section').style.display = 'none'; // Hide Profile
  document.getElementById('dataset-overview').style.display = 'block'; // Show Dataset Overview
  document.getElementById('demo-section').style.display = 'none';     // Hide Demo
  document.getElementById('charts-grid').style.display = 'none';      // Hide Results
}

// Function to show Demo Section (Question Retrieval)
function showDemo() {
  // Hide all sections first
  document.getElementById('profile-section').style.display = 'none';  // Hide Profile
  document.getElementById('dataset-overview').style.display = 'none'; // Hide Dataset Overview
  document.getElementById('charts-grid').style.display = 'none';      // Hide Results
  // Show Demo section
  document.getElementById('demo-section').style.display = 'block';    // Show Demo section

  retrieveRandomQuestion();  // Call function to get a random question when demo section is shown
}




// Function to fetch a random question and display it
function retrieveRandomQuestion() {
  // Disable both buttons to avoid concurrent requests
  document.getElementById('demo-button').disabled = true;
  document.getElementById('process-question-button').disabled = true;

  console.log("Fetching random question...");

  // Fetch a random question from the backend
  fetch('https://chatgpt-backend-y899.onrender.com/randomQuestion')
    .then(response => response.json())
    .then(data => {
      console.log("Random Question Data");

      if (data && data.questionText) {
        // Clear previous results from ChatGPT and anticipated answer
        document.getElementById('chatgpt-response').innerHTML = '';
        document.getElementById('anticipated-answer').innerHTML = '';
        
        // Display the new random question and collection name
        document.getElementById('random-question').textContent = data.questionText;
        document.getElementById('collection-name').textContent = `Collection: ${data.collectionName}`;

        // Show the process question button and enable it
        document.getElementById('process-question-button').style.display = 'inline-block';
        document.getElementById('process-question-button').disabled = false; // Enable the button
        
        // Store the questionData globally so it can be accessed by processQuestion()
        window.currentQuestionData = data;  // Save the data globally
      } else {
        document.getElementById('random-question').textContent = "No question found.";
      }
    })
    .catch(error => {
      console.error('Error fetching random question:', error);
      document.getElementById('random-question').textContent = "Error retrieving question.";
    })
    .finally(() => {
      // Re-enable the "Get New Random Question" button after the fetch is complete
      document.getElementById('demo-button').disabled = false;
    });
}

// Function to process the selected question
function processQuestion() {
  // Disable the "Process Question" button to prevent multiple clicks
  document.getElementById('process-question-button').disabled = true;

  const { questionText, collectionName } = window.currentQuestionData;  // Get current question data

  const questionData = { questionText, collectionName };
  console.log("Sending to backend for processing:");

  // Send question to the backend for processing
  fetch('https://chatgpt-backend-y899.onrender.com/processQuestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(questionData)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Processing result:");

    // Display the ChatGPT response if available
    if (data && data.chatGPTResponse) {
      document.getElementById('chatgpt-response').innerHTML = `ChatGPT Answer: ${data.chatGPTResponse}`;
    } else {
      document.getElementById('chatgpt-response').innerHTML = "No response from ChatGPT. Please try again.";
    }

    // Display the anticipated answer
    if (data && data.anticipatedAnswer) {
      document.getElementById('anticipated-answer').innerHTML = `Anticipated Answer: ${data.anticipatedAnswer}`;
    } else {
      document.getElementById('anticipated-answer').innerHTML = "No anticipated answer available.";
    }
  })
  .catch(error => {
    console.error('Error processing the question:', error);
    document.getElementById('chatgpt-response').innerHTML = "Error processing the question.";
    document.getElementById('anticipated-answer').innerHTML = "Error retrieving anticipated answer.";
  })
  .finally(() => {
    // Re-enable the "Get New Random Question" button after processing is done
    document.getElementById('demo-button').disabled = false;
    
    // Re-enable the "Process Question" button for further processing if needed
    document.getElementById('process-question-button').disabled = false;
  });
}







// Event listener for the process question button
document.getElementById('process-question-button').addEventListener('click', processQuestion);

// Event listener for demo button to fetch a random question
document.getElementById('demo-button').addEventListener('click', retrieveRandomQuestion);
