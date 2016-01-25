/**
 *  This object manages user requests. It is responsible for answering 
 *  the information requested from the view layer delegating other 
 *  responsabilities to the rest of objects.
 */
function controller() {
    var input, dataValidated, output;
    input = document.getElementById("input").value;
    var parsedData = parseData(input)
    if (parsedData.status) {
        output = "Input OK";
        // console.log(" controller parsedData.data: \n",parsedData.data);
        createArrow(parsedData.data);
    } else {
        alert(parseData.error + "\n" + input);
        newCalculation();
    }
    document.getElementById("output").innerHTML = output;
}

/**
 *  Sends the command to the view to reload a new UI.
 */
function newCalculation() {
    location.reload();
}

/**
 *  Validates if a variable is a positive integer.
 */
function isPositiveInteger(num){
    // console.log("typeof num: ",typeof num);
    // console.log("num: ",num);
    if (!isNaN(num) || num > 0) {
        return Number(num) % 1 === 0;
    } else {
        return false;
    }
}

/**
 *  This object parses the user input: Validates the number of test-cases,
 *  the dimension of the matrix and the number of operations, then sets 
 *  up and returns an object with the information of every operation to be 
 *  calculated over the matrix.
 */
function parseData(data) {
    var response = {'status':true,
            'error': '',
            'data':[]
        }
    var dimensionAndOperations, 
        dimension, 
        operationsPerTest, 
        index = 1,
        commands = data.split('\n');
    // console.log("commands: \n", commands);
    var totalTests = commands[0];
    if (!isPositiveInteger(totalTests)) {
        response.status = false;
        response.error = "Invalid input data."
        // console.log("response0: \n", response);
        return response;
    } else {
        totalTests = parseInt(totalTests);
    }
    do {
        dimensionAndOperations = commands[index].split(' ');
        // console.log("parseData dimensionAndOperations: \n", dimensionAndOperations);
        dimension = dimensionAndOperations[0];
        operationsPerTest = dimensionAndOperations[1];
        lastQueryIndex = index + parseInt(operationsPerTest);
        if (!isPositiveInteger(dimension) || !isPositiveInteger(operationsPerTest)) {
            response.status = false;
            // console.log("parseData response1: \n", response);
            return response;
        }
        var testCase = {
            'dimension': dimension,
            'queries': []
        };
        for(var i = index + 1; i <= lastQueryIndex; i++) {
            testCase.queries.push(commands[i]);
        }
        response.data.push(testCase);
        index = lastQueryIndex + 1;
        totalTests--;
    }
    while (totalTests >= 1);
    // console.log("parseData response2: \n", response);
    return response;
}

function createArrow(testCase) {
    console.log('testCase: \n',testCase);
    return true;
}