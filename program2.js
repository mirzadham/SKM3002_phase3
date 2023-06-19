// Attach event listener to the submit button
var submitBtn = document.getElementById("submitBtn");
submitBtn.addEventListener("click", handleButtonClick);

// Attach event listener to the matrix dimensions input fields
var rowsInput = document.getElementById("rowsInput");
rowsInput.addEventListener("change", generateMatrixInput);

var colsInput = document.getElementById("colsInput");
colsInput.addEventListener("change", generateMatrixInput);

// Get the button and target element by their respective IDs
var toggleButton = document.getElementById("toggleButton");
var toggleButton2 = document.getElementById("toggleButton2");
var targetElement = document.getElementById("targetElement");
var targetElement2 = document.getElementById("targetElement2");

// Add a click event listener to the button
toggleButton.addEventListener("click", function() {
  // Toggle the visibility of the target element
  if (targetElement.style.display === "none") {
    targetElement.style.display = "block";
  } else {
    targetElement.style.display = "none";
  }
});

toggleButton2.addEventListener("click", function() {
    // Toggle the visibility of the target element
    if (targetElement2.style.display === "none") {
      targetElement2.style.display = "block";
    } else {
      targetElement2.style.display = "none";
    }
  });

function findInverse(A) {
    var n = A.length;

    // Create augmented matrix [A | I]
    var augmentedMatrix = [];
    for (var i = 0; i < n; i++) {
        augmentedMatrix[i] = [];
        for (var j = 0; j < 2 * n; j++) {
            augmentedMatrix[i][j] = j < n ? A[i][j] : (j === (n + i) ? 1.0 : 0.0);
        }
    }

    // Perform Gaussian elimination
    for (var i = 0; i < n; i++) {
        // Find pivot row
        var pivotRow = i;
        for (var j = i + 1; j < n; j++) {
            if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[pivotRow][i])) {
                pivotRow = j;
            }
        }

        // Swap rows if necessary
        if (pivotRow !== i) {
            var temp = augmentedMatrix[i];
            augmentedMatrix[i] = augmentedMatrix[pivotRow];
            augmentedMatrix[pivotRow] = temp;
        }

        // Scale pivot row to make leading element 1
        var pivot = augmentedMatrix[i][i];
        for (var j = i; j < 2 * n; j++) {
            augmentedMatrix[i][j] /= pivot;
        }

        // Perform row operations to make other elements in the column zero
        for (var j = 0; j < n; j++) {
            if (j !== i) {
                var factor = augmentedMatrix[j][i];
                for (var k = i; k < 2 * n; k++) {
                    augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
                }
            }
        }
    }

    // Extract the inverse matrix
    var inverseMatrix = [];
    for (var i = 0; i < n; i++) {
        inverseMatrix[i] = augmentedMatrix[i].slice(n);
    }

    return inverseMatrix;
}

// Function to handle button click event
function handleButtonClick() {
    // Get user input for matrix dimensions
    var rows = parseInt(document.getElementById("rowsInput").value);
    var cols = parseInt(document.getElementById("colsInput").value);

    // Initialize the matrix
    var A = [];
    for (var i = 0; i < rows; i++) {
        A[i] = [];
        for (var j = 0; j < cols; j++) {
            // Get user input for each element of the matrix
            var value = parseFloat(document.getElementById("A_" + i + "_" + j).value);
            A[i][j] = value;
        }
    }

    // Calculate the inverse
    var inverse = findInverse(A);

    // Display the inverse matrix
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<b>Inverse Matrix:</b><br><br>" + matrixToString(inverse);
}

// Function to generate input fields for matrix elements
function generateMatrixInput() {
    var rows = parseInt(document.getElementById("rowsInput").value);
    var cols = parseInt(document.getElementById("colsInput").value);

    var matrixInputDiv = document.getElementById("matrixInput");
    matrixInputDiv.innerHTML = ""; // Clear any existing input fields

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var input = document.createElement("input");
            input.type = "number";
            input.id = "A_" + i + "_" + j;
            input.placeholder = "[" + i + "][" + j + "]";
            input.style.marginRight = "10px";
            input.classList.add("custom-input2");
            matrixInputDiv.appendChild(input);
        }
        matrixInputDiv.appendChild(document.createElement("br")); // Line break after each row
    }
}

// Function to convert a matrix to string representation
function matrixToString(matrix) {
    var str = "";
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            str += "<span class='matrix-element'>" + matrix[i][j] + "</span>&nbsp;&nbsp;";
        }
        str += "<br>";
    }
    return str;
}

function generateEquationInputs() {
    var equationCount = parseInt(document.getElementById("equationCount").value);
    var equationInputsDiv = document.getElementById("equationInputs");
  
    equationInputsDiv.innerHTML = ""; // Clear previous inputs
  
    for (var i = 1; i <= equationCount; i++) {
      var equationDiv = document.createElement("div");
      equationDiv.className = "equation-input";
  
      for (var j = 1; j <= equationCount; j++) {
        var coefficientInput = document.createElement("input");
        coefficientInput.type = "number";
        coefficientInput.id = "coefficient-" + i + "-" + j;
        coefficientInput.placeholder = "Coefficient " + j;
        equationDiv.appendChild(coefficientInput);
      }
  
      var equalsSign = document.createElement("span");
      equalsSign.innerHTML = "=";
      equationDiv.appendChild(equalsSign);
  
      var constantInput = document.createElement("input");
      constantInput.type = "number";
      constantInput.id = "constant-" + i;
      constantInput.placeholder = "Constant";
      equationDiv.appendChild(constantInput);
  
      equationInputsDiv.appendChild(equationDiv);
    }
  }
  
  function solveLinearEquations(A, b) {
    var n = A.length;
  
    // Forward elimination
    for (var k = 0; k < n - 1; k++) {
      for (var i = k + 1; i < n; i++) {
        var factor = A[i][k] / A[k][k];
        b[i] = b[i] - factor * b[k];
        for (var j = k + 1; j < n; j++) {
          A[i][j] = A[i][j] - factor * A[k][j];
        }
      }
    }
  
    // Back substitution
    var x = new Array(n);
    x[n - 1] = b[n - 1] / A[n - 1][n - 1];
    for (var i = n - 2; i >= 0; i--) {
      var sum = b[i];
      for (var j = i + 1; j < n; j++) {
        sum = sum - A[i][j] * x[j];
      }
      x[i] = sum / A[i][i];
    }
  
    return x;
  }
  
  function solveEquations() {
    var equationCount = parseInt(document.getElementById("equationCount").value);
    var A = [];
    var b = [];
  
    for (var i = 1; i <= equationCount; i++) {
      var equationCoefficients = [];
  
      for (var j = 1; j <= equationCount; j++) {
        var coefficient = parseFloat(
          document.getElementById("coefficient-" + i + "-" + j).value
        );
        equationCoefficients.push(coefficient);
      }
  
      A.push(equationCoefficients);
  
      var constant = parseFloat(document.getElementById("constant-" + i).value);
      b.push(constant);
    }
  
    var result = solveLinearEquations(A, b);
  
    // Display the solution
    var resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";
  
    if (result) {
      var resultText = "Solution:<br>";
      for (var i = 0; i < result.length; i++) {
        resultText += "x" + (i + 1) + " = " + result[i] + "<br>";
      }
      resultDiv.innerHTML = resultText;
    } else {
      resultDiv.innerHTML = "No solution or infinite solutions.";
    }
  }






