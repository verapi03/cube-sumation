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
            var flagForDiagonal = operations.pop();
            // console.log("operations: \n",operations);
                var matrix = flagForDiagonal ? new fenwickDiagonal(dimension) : new fenwick(dimension);
                for (var j = 0; j < operations.length; j++) {
                    if (operations[j].type == 'UPDATE') {
                        matrix.update(operations[j]);
                    } else {
                        var coordinates = [{
                                x: operations[j].x1 - 1,
                                y: operations[j].y1 - 1,
                                z: operations[j].z1 - 1
                            },{
                                x: operations[j].x2,
                                y: operations[j].y2,
                                z: operations[j].z2,
                            }];
                        output += matrix.summation(coordinates) + "\n";
                    }
                }
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
    var operation = [],
        flagForDiagonal = true,
        flagUpdate = true,
        flagQuery1 = true,
        flagQuery2 = true;
    for (var i = 0; i < queries.length; i++) {
        query = queries[i].split(" ");
        if (query[0].toLowerCase() == 'update') {
            operation[i] = {
                'type': 'UPDATE', 
                'x': query[1], 
                'y': query[2], 
                'z': query[3], 
                'w': query[4]
            }
            if (flagForDiagonal) {
                flagUpdate = validateEquidistance(query[1], query[2], query[3]);
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
            if (flagForDiagonal) {
                flagQuery1 = validateEquidistance(query[1], query[2], query[3]);
                flagQuery2 = validateEquidistance(query[4], query[5], query[6]);
            }
        }
        if (!flagUpdate || !flagQuery1 || !flagQuery2) {
            flagForDiagonal = false;
        }
    }
    operation[queries.length] = flagForDiagonal;
    return operation;
}

/**
 *  This function validates if a coordinate belongs to the diagonal 
 *  of the 3D matrix.
 */
function validateEquidistance(x, y, z) {
    if (x == y && y == z) {
        return true;
    } else {
        return false;
    }
}

/**
 *  This object does the same as "fenwick" but calculating only the 
 *  diagonal of the of the fenwick matrix, i.e. it updates the  
 *  diagonal with new weights and also calculates the sum of a prefix 
 *  given the diagonal coordinates.
 */
function fenwickDiagonal(dimension) {
    this.dimension = dimension;
    this.fenwickMatrix = [];
    this.update = function(coordinates) {
        index = coordinates.x -1;
        val = coordinates.w;
        if (this.fenwickMatrix.length == 0) {
            this.fenwickMatrix = createMatrix(this.dimension);
        }
        for (var row = 0; row < this.fenwickMatrix.length; ++row) {
            if (index >= this.fenwickMatrix[row].length) {
                index -= 1;
            }
            this.fenwickMatrix[row][index] += parseInt(val); 
            index >>= 1; 
        } 
    }
    this.summation = function(coordinates) { 
        var sums = [];
        for (coordinate in coordinates) {
            var sum = 0,
                x = coordinates[coordinate].x; 
            for (var row = 0; row < this.fenwickMatrix.length; ++row) {
                if (x&1) {
                    sum += this.fenwickMatrix[row][x - 1]; 
                }
                x >>= 1; 
            }
            sums.push(sum);
        }
        return sums[1] - sums[0]; 
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

/**
 *  This object manages the operations of creation of a fenwick matrix, 
 *  update it with a new weight for a coordinate entered by the user
 *  as a requested operation and also calculates the sum of a prefix 
 *  given its coordinates.
 */
function fenwick(dimension) {
    // console.log('matrix: \n');
    this.dimension = dimension;
    this.fenwickMatrix = [];
    this.update = function(coordinates) {
        var x = coordinates.x,
            y = coordinates.y,
            z = coordinates.z,
            val = coordinates.w;
        if (this.fenwickMatrix.length == 0) {
            this.fenwickMatrix = createMatrix(this.dimension);
        }
        while (z <= this.dimension) {
            while (x <= this.dimension) {
                while (y <= this.dimension) {
                    if (y >= this.dimension) {
                        y -= 1;
                    }
                    if (x >= this.dimension) {
                        x -= 1;
                    }
                    if (z >= this.dimension) {
                        z -= 1;
                    }
                    this.fenwickMatrix[x][y][z] += parseInt(val);
                    // console.log('update this.fenwickMatrix[x][y][z]: \n',this.fenwickMatrix[x][y][z]);
                    y |= y + 1;
                }
                x |= x + 1;
            }
            z |= z + 1;
        }
        // console.log('update this.fenwickMatrix: \n',this.fenwickMatrix);
    }
    this.summation = function(coordinates) { 
        var sums = [];
        for (coordinate in coordinates) {
            var sum = 0, 
                x = coordinates[coordinate].x,
                y = coordinates[coordinate].y,
                z = coordinates[coordinate].z; 
            while (z > 0) {
                while (x > 0) {
                    while (y > 0) {
                        sum += this.fenwickMatrix[x - 1][y - 1][z - 1]; 
                        y &= y - 1;
                    }
                    x &= x - 1;
                }
                z &= z - 1;
            }
            sums.push(sum);
        }
        return sums[1] - sums[0];
    }
    function createMatrix(dimension) {
        var fenwickMatrix = [],
            matrixY = [],
            matrixZ = [],
            dimensionY = dimension,
            dimensionZ = dimension;
        while (dimensionZ >= 1) {
            matrixZ.push(0);
            dimensionZ--;
        }
        while (dimensionY >= 1) {
            matrixY.push(matrixZ);
            dimensionY--;
        }
        while (dimension >= 1) {
            fenwickMatrix.push(matrixY);
            dimension--;
        }
        // console.log('createMatrix fenwickMatrix: \n',fenwickMatrix);
        return fenwickMatrix;
    };
}