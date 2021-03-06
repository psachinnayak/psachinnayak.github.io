
(function (window, document) {

    var switchAutoplay, holder;

    var solver = null,
        values,
        possibilities = null,
        initialValues = null;

    var stepNumber = 0,
        is_solved = false,
        unsolvable = false;

    function byId(id) {
        return document.getElementById(id);
    }
    function create(tagName) {
        return document.createElement(tagName);
    }

    function getGridId(row, col) {
        return "grid_" + (row - row % 3) / 3 + "_" + (col - col % 3) / 3;
    }
    function generateBoard() {
        for (var row = 0; row < 9; row++) {
            var gridRow = create('div');

            holder.appendChild(gridRow);
            for (var col = 0; col < 9; col++) {

                var cell = create("div");
                cell.className = 'sudoku-cell';
                if ((row - row % 3) / 3 % 2 == 0 && (col - col % 3) / 3 % 2 == 0) {

                    cell.classList.add('sudoku-cell-alternate');
                }
                if (col % 3 == 0) {
                    cell.classList.add("sudoku-cell-left-block-end");
                }
                if (row % 3 == 0) {
                    cell.classList.add('sudoku-cell-top-block-end');
                }
                if (col == 8) {
                    cell.classList.add('sudoku-cell-right-block-end');
                }
                if (row == 8) {
                    cell.classList.add('sudoku-cell-bottom-block-end');
                }
                // sudoku-cell sudoku-cell-left-block-end sudoku-cell-top-block-end
                cell.id = "cell_" + row + "_" + col;
                // cell.appendChild(document.createTextNode(" "));
                // subgrids[getGridId(row, col)].appendChild(cell);
                gridRow.appendChild(cell);
            }
            var clearer = create("div");
            clearer.className = 'clear';
            gridRow.appendChild(clearer);
        }
    }
    function setCellValue(row, column, value) {
        var isInitialValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var cell = byId("cell_" + row + "_" + column);
        while (cell.childNodes.length > 0) {
            cell.removeChild(cell.childNodes[0]);
        }
        var cellValue = create("div");
        cellValue.appendChild(document.createTextNode(value));
        cellValue.className = "sudoku-cell-with-value";
        if (isInitialValue) {
            cellValue.classList.add("sudoku-cell-initial-value");
        }
        cell.appendChild(cellValue);

        // cell.innerText = value;
    }

    function setPossibilities(row, column, possibilities) {
        var cell = byId("cell_" + row + "_" + column);
        // let oldPossibs = 0;
        while (cell.childNodes.length > 0) {
            cell.removeChild(cell.childNodes[0]);
        }

        for (var vals = 1; vals < 10; vals++) {

            var possibl = create("div");
            possibl.className = 'sudoku-cell-possibilities';

            if (possibilities.indexOf(vals) == -1) {
                possibl.classList.add('sudoku-cell-possibilities-hidden');
            }

            possibl.appendChild(document.createTextNode(vals));
            cell.appendChild(possibl);
        }
    }

    function flash(row, column, color) {
        var cell = byId("cell_" + row + "_" + column);
        var clsName = 'flash-' + color;
        cell.classList.add(clsName);
        setTimeout(function (cell, clsName) {
            // debugger;
            cell.classList.remove(clsName);
        }.bind(null, cell, clsName), 300);
    }
    function attachHandlers() {

        switchAutoplay = byId('switchAutoplay');
        holder = byId("holder");
        var btnNext = byId("btnNext"),
            slctPresets = byId('slctPresets');
        var txtInitialValues = byId("txtInitialValues");
        var btnInitiate = byId('btnInitiate');
        btnNext.addEventListener('click', function () {
            execute();
        });
        slctPresets.addEventListener('change', function () {
            var presetName = slctPresets.value;
            if (presetName == 'custom') {
                txtInitialValues.value = "custom";
            } else {
                txtInitialValues.value = JSON.stringify(getInitialValues(presetName));
            }
        });
        btnInitiate.addEventListener('click', function () {
            $('#sectionSetup').collapse();
            byId("sectionSudokuBoard").scrollIntoView();
            generateBoard();
            initialValues = JSON.parse(txtInitialValues.value);

            values = initialValues.map(function (vals) {
                return vals.map(function (single) {
                    return single;
                });
            });

            solver = new SudokuSolver(values, function (evtObject) {
                switch (evtObject.type) {
                    case "modify-possibility":

                        console.log(evtObject.row, evtObject.column);
                        if (evtObject.column == 4) {
                            debugger;
                        }
                        flash(evtObject.row, evtObject.column, 'orange');
                        break;
                    case "read":
                        flash(evtObject.row, evtObject.column, 'blue');
                        break;
                    case "write":
                        flash(evtObject.row, evtObject.column, 'red');
                        break;
                }
            });
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (values[i][j]) {
                        setCellValue(i, j, values[i][j], true);
                    } else {
                        setPossibilities(i, j, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    }
                }
            }

            possibilities = solver.defaultPossibilites();

            if (switchAutoplay.checked) {
                setTimeout(execute, 5000);
            }
            // }, 1000);
        });
    }

    function execute() {
        solver.evaluationArrays.forEach(function (arr) {
            setStepNumberText("Step " + (stepNumber % 6 + 1));
            switch (stepNumber % 7) {
                case 0:
                    possibilities = solver.removeDuplicates(values, possibilities, arr);
                    break;
                case 1:
                    possibilities = solver.findAndClearByNSizeDuplicatesInRow(values, possibilities, arr, 2);
                    break;
                case 2:
                    possibilities = solver.findAndClearByNSizeDuplicatesInRow(values, possibilities, arr, 3);
                    break;
                case 3:
                    possibilities = solver.findAndClearByNSizeDuplicatesInRow(values, possibilities, arr, 4);
                    break;
                case 4:
                    possibilities = solver.isolateUniques(values, possibilities, arr);
                    break;
                case 5:
                    possibilities = solver.cleanPossibilitiesByUniqueDefinitions(values, possibilities, arr);
                    break;
                case 6:
                    // debugger;
                    var preCountOfValues = solver.countNumberOfValues(values);
                    values = solver.attemptToCalculateValues(values, possibilities);
                    // solver.attemptToCalculateValues(solver.values, possibilities);
                    var postCountOfValues = solver.countNumberOfValues(values);

                    is_solved = postCountOfValues == 81;
                    console.log(postCountOfValues, preCountOfValues);
                    unsolvable = postCountOfValues == preCountOfValues;

                    break;
            }
        });
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {

                if (values[i][j]) {
                    setCellValue(i, j, values[i][j], values[i][j] == initialValues[i][j]);
                } else {
                    setPossibilities(i, j, possibilities[i][j]);
                }
            }
        }

        //  && !unsolvable
        if (!is_solved) {
            if (switchAutoplay.checked) {
                setTimeout(execute, 1000);
            }
        } else {
            // if (stepNumber < 50) {
            //     setTimeout(execute, 1000);
            // }
            // debugger;
            console.log("Is Solved", is_solved);
            console.log("Unsolvable", unsolvable);
        }
        stepNumber++;
    }

    function execute2() {

        var soln = solver.getPossibilities(possibilities);
        possibilities = soln.possibilities;
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (values[i][j]) {
                    console.log(values[i][j] == initialValues[i][j], values[i][j], initialValues[i][j]);
                    // debugger;
                    setCellValue(i, j, values[i][j], values[i][j] == initialValues[i][j]);
                } else {
                    setPossibilities(i, j, possibilities[i][j]);
                }
            }
        }

        setTimeout(function () {
            var soln = solver.solve(possibilities);
            values = soln.values;
            is_solved = soln.is_solved;
            unsolvable = soln.unsolvable;
            // console.log(values);
            for (var _i = 0; _i < 9; _i++) {
                for (var _j = 0; _j < 9; _j++) {
                    if (_i == 0 && _j == 0) {
                        debugger;
                    }

                    if (values[_i][_j]) {
                        console.log(values[_i][_j] == initialValues[_i][_j], values[_i][_j], initialValues[_i][_j]);

                        setCellValue(_i, _j, values[_i][_j], values[_i][_j] == initialValues[_i][_j]);
                    } else {
                        setPossibilities(_i, _j, possibilities[_i][_j]);
                    }
                }
            }
            // }
            if (!is_solved && !unsolvable) {
                setTimeout(execute, 1000);
            } else {
                if (is_solved) {
                    setStepNumberText("Is Solved");
                } else {
                    setStepNumberText("Not solvable by current Algorithm");
                }
            }
        }, 1000);
    }

    function setStepNumberText(txt) {
        byId("spanStepNumber").innerText = txt;
    }
    function test() {
        generateBoard();
        for (var i = 0; i < 9; i++) {
            setCellValue(i, i, i + 1);
        }
        for (var j = 0; j < 9; j++) {
            console.log(j, 8 - j, j + 1);
            setCellValue(j, 8 - j, j + 1);
        }
        setPossibilities(1, 5, [3, 4, 5]);
    }
    window.addEventListener('load', function () {
        attachHandlers();
    });

    function getInitialValues(presetName) {

        return sampleData[presetName];
    }
    var sampleData = {
        initial_easy1: [[3, 0, 6, 5, 0, 8, 4, 0, 0], [5, 2, 0, 0, 0, 0, 0, 0, 0], [0, 8, 7, 0, 0, 0, 0, 3, 1], [0, 0, 3, 0, 1, 0, 0, 8, 0], [9, 0, 0, 8, 6, 3, 0, 0, 5], [0, 5, 0, 0, 9, 0, 6, 0, 0], [1, 3, 0, 0, 0, 0, 2, 5, 0], [0, 0, 0, 0, 0, 0, 0, 7, 4], [0, 0, 5, 2, 0, 6, 3, 0, 0]],

        initial_easy2: [[5, 4, 0, 0, 6, 0, 0, 7, 8], [3, 0, 6, 1, 8, 0, 0, 2, 0], [0, 9, 2, 0, 0, 4, 5, 0, 0], [6, 0, 9, 0, 0, 0, 7, 0, 5], [7, 1, 0, 4, 9, 6, 0, 0, 0], [4, 0, 8, 0, 0, 3, 1, 0, 0], [0, 0, 0, 0, 3, 0, 9, 0, 0], [1, 8, 0, 0, 0, 0, 2, 5, 7], [9, 5, 0, 0, 2, 7, 0, 0, 0]],

        initial_medium1: [[0, 0, 3, 0, 0, 0, 0, 0, 0], [0, 6, 0, 1, 3, 0, 2, 0, 0], [7, 0, 0, 9, 0, 5, 0, 1, 0], [0, 7, 0, 0, 0, 0, 1, 9, 6], [8, 2, 0, 0, 0, 0, 7, 0, 0], [0, 4, 0, 0, 0, 1, 0, 3, 2], [0, 9, 6, 0, 0, 4, 0, 7, 8], [0, 0, 0, 0, 0, 0, 0, 0, 0], [5, 0, 8, 0, 6, 0, 4, 0, 9]],
        initial_medium2: [[0, 8, 2, 3, 0, 6, 7, 0, 0], [0, 6, 0, 0, 0, 0, 0, 0, 2], [0, 3, 0, 2, 0, 4, 1, 0, 0], [4, 0, 0, 8, 3, 0, 2, 0, 0], [0, 0, 5, 0, 0, 0, 9, 0, 4], [0, 0, 0, 0, 4, 0, 6, 0, 0], [0, 0, 0, 0, 1, 0, 3, 7, 0], [0, 5, 0, 0, 6, 0, 0, 2, 9], [7, 0, 0, 0, 2, 0, 0, 0, 1]],
        initial_medium3: [[2, 4, 0, 0, 0, 0, 0, 1, 0], [6, 0, 0, 0, 0, 5, 0, 3, 0], [0, 3, 0, 4, 0, 0, 0, 5, 8], [0, 0, 0, 8, 0, 0, 0, 0, 0], [7, 0, 0, 3, 0, 0, 5, 0, 0], [0, 1, 0, 0, 5, 0, 7, 4, 0], [1, 2, 6, 0, 0, 8, 0, 0, 4], [0, 0, 0, 0, 0, 0, 8, 0, 0], [5, 0, 3, 7, 0, 0, 1, 2, 9]],
        initial_medium4: [[0, 7, 0, 0, 8, 0, 0, 0, 0], [0, 0, 0, 0, 0, 9, 0, 7, 2], [9, 0, 5, 0, 2, 4, 0, 0, 1], [0, 0, 2, 5, 0, 0, 0, 0, 0], [0, 0, 7, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 8, 9, 0, 0], [6, 0, 0, 8, 7, 0, 5, 0, 4], [8, 2, 0, 6, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 8, 0]],
        initial_hard1: [[0, 1, 0, 0, 0, 0, 0, 0, 0], [6, 8, 7, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 9, 7, 0, 0, 3], [0, 0, 0, 0, 0, 0, 0, 0, 0], [7, 0, 0, 0, 0, 0, 3, 4, 0], [0, 4, 0, 9, 2, 6, 0, 0, 0], [0, 0, 9, 6, 0, 5, 0, 0, 2], [0, 0, 2, 0, 3, 0, 0, 0, 0], [5, 0, 0, 0, 1, 9, 7, 0, 0]],

        initial_expert1: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 7, 0, 0, 0, 5, 0], [6, 0, 0, 8, 9, 0, 0, 0, 3], [5, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 4, 1, 0, 0], [0, 0, 4, 0, 0, 3, 0, 6, 8], [0, 6, 0, 0, 3, 0, 0, 0, 9], [8, 0, 5, 0, 0, 2, 7, 0, 0], [0, 0, 1, 0, 0, 0, 6, 0, 5]], initial_hard2: [[0, 0, 0, 0, 7, 2, 5, 0, 0], [0, 7, 0, 8, 0, 1, 0, 0, 0], [6, 3, 0, 0, 0, 0, 8, 2, 0], [0, 0, 0, 0, 5, 7, 4, 0, 0], [7, 0, 0, 0, 9, 0, 0, 0, 0], [0, 0, 9, 2, 8, 0, 0, 5, 0], [0, 0, 6, 0, 0, 0, 0, 0, 0], [4, 0, 2, 0, 0, 0, 0, 8, 0], [0, 0, 0, 0, 0, 5, 9, 0, 0]], initial_expert2: [[8, 0, 0, 0, 0, 0, 9, 0, 0], [0, 0, 0, 0, 9, 5, 6, 0, 0], [7, 0, 1, 0, 6, 0, 0, 0, 0], [5, 0, 0, 3, 0, 0, 0, 7, 0], [0, 3, 0, 0, 0, 8, 0, 0, 2], [0, 0, 0, 0, 0, 4, 0, 3, 0], [0, 0, 0, 0, 0, 6, 0, 9, 0], [0, 0, 0, 0, 0, 0, 0, 0, 5], [1, 0, 8, 4, 0, 0, 0, 0, 0]]
    };
})(window, document);