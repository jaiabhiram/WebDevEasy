
    document.addEventListener("DOMContentLoaded", function() {
        const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const assignmentId = urlParams.get('assignmentId');
    console.log(assignmentId);
        fetchAssignmentDetails(assignmentId);
        const form = document.getElementById('submissionForm');
        const feedbackText = document.getElementById('feedbackText');

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get the code from textarea or the uploaded file
            let code = document.getElementById('codeInput').value;
            const file = document.getElementById('fileUpload').files[0];
            
            if (file) {
                // Read the file if a file is selected
                const reader = new FileReader();
                reader.onload = async function(e) {
                    const fileContent = e.target.result;
                    await submitCode(fileContent);
                };
                reader.readAsText(file);
            } else {
                // Submit the text from the textarea if no file is selected
                await submitCode(code);
            }
        }); 

        async function submitCode(jscode) {
            try {
                const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const assignmentId = urlParams.get('assignmentId');
    console.log(`in actual ${assignmentId}`);
                const response = await fetch(`http://127.0.0.1:3000/api/v1/assignment/validate/${assignmentId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ jscode })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const data = await response.json();
                // feedbackText.textContent = data; // Assuming the server response is a string of feedback
                displayFeedback(data);
            } catch (error) {
                console.error('Error during fetch operation:', error.message);
                feedbackText.textContent = 'Error submitting your code. Please try again.';
            }
        }
    });

    const codeInput = document.getElementById('codeInput');
const lineNumbers = document.getElementById('lineNumbers');

const updateLineNumbers = () => {
  const lines = codeInput.value.split('\n').length;
  lineNumbers.innerHTML = '';
  for (let i = 1; i <= lines; i++) {
    lineNumbers.innerHTML += `${i}<br>`;
  }
};

codeInput.addEventListener('input', updateLineNumbers);
codeInput.addEventListener('scroll', () => {
  lineNumbers.scrollTop = codeInput.scrollTop;
});

// Initialize line numbers
updateLineNumbers();


function displayFeedback(feedbackArray) {
    const container = document.getElementById("feedbackArea");

    // Clear previous feedback
    container.innerHTML = '<h2>Feedback</h2>'; // Retain the heading

    feedbackArray.forEach(item => {
        // Create a new div element for each feedback item
        const feedbackDiv = document.createElement("div");
        feedbackDiv.classList.add("feedback-card");
        feedbackDiv.setAttribute('data-status', item.status.toLowerCase());

        // Create an icon element for symbol
        const symbol = document.createElement("i");
        const iconClass = item.status === "Passed" ? "fas fa-check" : "fas fa-times";
        symbol.className = `feedback-symbol ${iconClass}`;

        const message = document.createElement("span");
        message.classList.add("feedback-message");
        message.textContent = item.message;

        // Append symbol and message to the feedback div
        feedbackDiv.appendChild(symbol);
        feedbackDiv.appendChild(message);

        // Append the feedback div to the container
        container.appendChild(feedbackDiv);
    });
}

// document.addEventListener("DOMContentLoaded", );
function fetchAssignmentDetails(assignmentId) {
    console.log('bkfdms');
    const endpoint = `http://127.0.0.1:3000/api/v1/assignment/${assignmentId}`;
    console.log(endpoint);
    fetch(endpoint)
        .then(response => {
            console.log(response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            displayAssignmentDetails(data.data.assignment);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayAssignmentDetails(data) {
    const displayTitle = document.getElementById("displayTitle");
    const displayQuestion = document.getElementById("displayQuestion");

    // Assuming 'data' is an object that contains 'title' and 'question' properties
    displayTitle.textContent = data.title || "Title not available";
    displayQuestion.textContent = data.question || "Question not available";
}

// Example call to fetch assignment details
// This ID would be dynamically determined based on your app's requirements
// const assignmentId = '65f19e1f789e054f480005b3';



