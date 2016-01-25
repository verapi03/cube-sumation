function controller() {
    var input, dataValidated, text;
    input = document.getElementById("input").value;
    dataValidated = validateData(input);
    if (dataValidated.status) {
        text = "Input OK";
        // console.log("dataValidated: \n",dataValidated);
    } else {
        alert("Input not valid. Copy, paste and correct your input: " + input);
        newCalculation();
    }
    document.getElementById("output").innerHTML = text;
}

function newCalculation() {
    location.reload();
}

function validateData(data) {
    var response = {'status':true,
            'data':[]
        }
    var commands = data.split('\n');
    // console.log("commands: \n", commands);
    var totalTests = commands[0];
    if (!isPositiveInteger(totalTests)) {
        response.status = false;
        console.log("response1: \n", response);
        return response;
    }
    var response = parseData(commands);
    console.log("response2: \n", response);
    return response;
    
}

function isPositiveInteger(num){
    // console.log("typeof num: ",typeof num);
    // console.log("num: ",num);
    if (!isNaN(num) || num > 0) {
        return Number(num) % 1 === 0;
    } else {
        return false;
    }
}

function parseData(commands) {
    var response = {'status':true,
            'data':[]
        }
    var tests = parseInt(commands[0]),
        index = 1,
        dimensionAndOperations, 
        dimension, 
        operationsPerTest;
    do {
        dimensionAndOperations = commands[index].split(' ');
        console.log("parseData dimensionAndOperations: \n", dimensionAndOperations);
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
            console.log("parseData i: \n", i);
            testCase.queries.push(commands[i]);
        }
        response.data.push(testCase);
        index = lastQueryIndex + 1;
        tests--;
    }
    while (tests >= 1);
    // console.log("parseData response2: \n", response);
    return response;
}