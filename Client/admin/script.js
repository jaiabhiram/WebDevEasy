document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("addCriterion")
    .addEventListener("click", function () {
      addCriteriaForm(document.getElementById("criteria-builder"), "0");
    });

  document
    .getElementById("generateObject")
    .addEventListener("click", function () {
      const criteriaObjects = generateCriteriaObject(
        document.getElementById("criteria-builder")
      );
      document.getElementById("jsonOutput").textContent = JSON.stringify(
        criteriaObjects,
        null,
        2
      );
    });
});

function addCriteriaForm(parentElement, level) {
  const uniqueId = `criterion-${Date.now()}`;
  const criterionContainer = document.createElement("div");
  criterionContainer.classList.add("criteria-container");
  criterionContainer.setAttribute("id", uniqueId);
  criterionContainer.setAttribute("data-level", level);

  criterionContainer.innerHTML = `
        <div class="mb-3">
            <label class="form-label">Selector</label>
            <input type="text" class="form-control criteria-selector">
        </div>
        <div class="mb-3">
            <label class="form-label">Message</label>
            <input type="text" class="form-control criteria-message">
        </div>
        <div class="sub-criteria-container"></div>
        <button class="btn btn-info btn-sm addSubCriteria me-2">Add Sub-Criteria</button>
        <button class="btn btn-danger btn-sm removeCriterion">Remove</button>
    `;

  parentElement.appendChild(criterionContainer);

  criterionContainer
    .querySelector(".addSubCriteria")
    .addEventListener("click", function () {
      addCriteriaForm(
        criterionContainer.querySelector(".sub-criteria-container"),
        `${level}.${Date.now()}`
      );
    });

  criterionContainer
    .querySelector(".removeCriterion")
    .addEventListener("click", function () {
      criterionContainer.remove();
    });
}

function generateCriteriaObject(element) {
  let criteriaObjects = [];
  element.querySelectorAll(".criteria-container").forEach((container) => {
    // Only process direct children to avoid duplication
    if (container.parentNode === element) {
      const selector = container.querySelector(".criteria-selector").value;
      const message = container.querySelector(".criteria-message").value;
      const subCriteriaContainer = container.querySelector(
        ".sub-criteria-container"
      );
      let contains = [];

      if (subCriteriaContainer && subCriteriaContainer.hasChildNodes()) {
        contains = generateCriteriaObject(subCriteriaContainer); // Recursively generate sub-criteria
      }

      const criterionObj = { selector, message };
      if (contains.length > 0) {
        criterionObj.contains = contains;
      }

      criteriaObjects.push(criterionObj);
    }
  });

  // Filter out empty criteria before returning
  return criteriaObjects.filter(
    (criterion) => criterion.selector || criterion.message
  );
}

// Adjust textarea height dynamically based on content
const textarea = document.getElementById("questionInput");
textarea.addEventListener("input", function () {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

document
  .getElementById("submitCriteria")
  .addEventListener("click", function () {
    console.log('ji');
    const title = document.getElementById("titleInput").value;
    const difficulty = document.getElementById("difficultyInput").value;
    const question = document.getElementById("questionInput").value;
    const criteriaObjects = generateCriteriaObject(
      document.getElementById("criteria-builder")
    );
    console.log(criteriaObjects);

    const submissionData = {
        title: title,
        difficulty: difficulty,
        question: question,
        criteria: criteriaObjects,
    };
    console.log(submissionData);

    // Display the submission data in JSON format for debugging
    document.getElementById("jsonOutput").textContent = JSON.stringify(
      submissionData,
      null,
      2
    );
    const sdata = JSON.stringify(
        submissionData,
        null,
        2
      );
    // Submit the data to the backend
    submitToBackend(
      "http://127.0.0.1:3000/api/v1/assignment",
      sdata
    );
  });

function submitToBackend(url, data) {
    console.log('hi');
    // console.log(JSON.stringify({ question: data.question, criteria: data.criteriaObjects }));

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      if(data.status==='Failure')
      {
        alert(`Submission Failed: ${data.data.message}`);
      }
      else {
        console.log("Success:", data);
        alert("Submission successful");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while submitting");
    });
}
