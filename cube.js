/**
 *  This object manages user requests. It is responsible for answering 
 *  the information requested from the view layer delegating other 
 *  responsabilities to the rest of objects.
 */
function controller() {
    var dataValidated, output = '';
    var input = document.getElementById("input").value;
    var parsedData = parseInput(input)
    if (parsedData.status) {
        for (var i = 0; i < parsedData.data.length; i++) {
            var dimension = parsedData.data[i].dimension;
            var operations = parseOperation(dimension, parsedData.data[i].queries);
            // console.log("operations: \n",operations);
            var matrix = new fenwick(dimension);
            for (var j = 0; j < operations.length; j++) {
                var sum1, sum2, sum;
                if (operations[j].type == 'UPDATE') {
                    matrix.update(operations[j].x, operations[j].w);
                } else {
                    sum1 = matrix.summation(operations[j].x1 - 1);
                    sum2 = matrix.summation(operations[j].x2);
                    sum = sum2 - sum1;
                    output += sum + "\n";
                }
            }
            // fenwick(parsedData.data[i].dimension).createMatrix;
            // console.log("matrix: \n",matrix.create());
        }
    } else {
        alert(parseInput.error + "\n" + input);
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
function parseInput(data) {
    var response = {'status':true,
            'error': '',
            'data':[]
        }
    var dimensionAndOperations, 
        dimension, 
        operationsPerTest, 
        index = 1,
        commands = data.split('\n');
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
        dimension = dimensionAndOperations[0];
        operationsPerTest = dimensionAndOperations[1];
        lastQueryIndex = index + parseInt(operationsPerTest);
        if (!isPositiveInteger(dimension) || !isPositiveInteger(operationsPerTest)) {
            response.status = false;
            // console.log("parseInput response1: \n", response);
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
    // console.log("parseInput response2: \n", response);
    return response;
}

/**
 *  This function parses the user input queries per test-case.
 */
function parseOperation(dimension, queries) {
    var operation = [];
    for (var i = 0; i < queries.length; i++) {
        query = queries[i].split(" ");
        if (query[0] == 'UPDATE' || query[0] == 'Update' || query[0] == 'update') {
            operation[i] = {
                'type': 'UPDATE', 
                'x': query[1], 
                'y': query[2], 
                'z': query[3], 
                'w': query[4]
            }
        } else {
            operation[i] = {
                'type': 'QUERY', 
                'x1': query[1], 
                'y1': query[2], 
                'z1': query[3], 
                'x2': query[4],
                'y2': query[5],
                'z2': query[6]
            }
        }
    }
    return operation;
}

/**
 *  This object manages the operations of creation of a fenwick matrix, 
 *  update it with a new weight for a coordinate entered by the user
 *  as a requested operation and also calculates the summation between 
 *  two coordinates of the matrix.
 */
function fenwick(dimension) {
    // console.log('dimension: \n',dimension);
    this.dimension = dimension;
    this.fenwickMatrix = [];
    this.update = function(index, val) {
        // console.log('index: \n',index);
        // console.log('val: \n',val);
        if (this.fenwickMatrix.length == 0) {
            this.fenwickMatrix = createMatrix(this.dimension,this.fenwickMatrix);
        }
        for (var row = 0; row < this.fenwickMatrix.length; ++row) {
            this.fenwickMatrix[row][index] += parseInt(val); 
            index >>= 1; 
        } 
        // console.log('update this.fenwickMatrix: \n',this.fenwickMatrix);
    }
    this.summation = function(x) { 
        var sum = 0; 
        for (var row = 0; row < this.fenwickMatrix.length; ++row) { 
            if (x&1) {
                sum += this.fenwickMatrix[row][x - 1]; 
            }
            x >>= 1; 
        } 
        return sum; 
    }
    function createMatrix(dimension) {
        var fenwickMatrix = [];
        while (dimension >= 1) {
            var arr = [];
            for (var i = 0; i < dimension; i++) {
                arr.push(0);
            }
            fenwickMatrix.push(arr);
            dimension >>= 1;
        }
        // console.log('createMatrix fenwickMatrix: \n',fenwickMatrix);
        return fenwickMatrix;
    };
}