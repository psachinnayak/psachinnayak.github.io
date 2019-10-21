(function (window, document) {
    // if(!ga){
    //     ga = function(){
    //         //ignore
    //     }
    // }

    var holder = null;

    var solver = null,
        values,
        possibilities = null,
        initialValues = null;

    var stepNumber = 0,
        is_solved = false,
        unsolvable = false;
    var maxStepsCount = 8;

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
            gridRow.style.margin = "0px auto";
            gridRow.style.width = "300px";

            holder.appendChild(gridRow);
            // let rowNumb = create('span');
            // rowNumb.appendChild(document.createTextNode(`Row ${row + 1}`))
            // gridRow.appendChild(rowNumb);
            for (var col = 0; col < 9; col++) {
                var cell = create("div");
                cell.className = 'sudoku-cell';
                if ((row - row % 3) / 3 % 2 == 0 && (col - col % 3) / 3 % 2 == 0) {
                    cell.classList.add('sudoku-cell-alternate');
                }

                if (((row - row % 3) / 3 == 1 && (col - col % 3) / 3) == 1) {
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
            var pad = create("div");
            pad.style.clear = "both";
            gridRow.appendChild(pad);
            // pad = create("div");
            // pad.className = "col-1";
            // gridRow.appendChild(pad);
        }
    }
    function setCellValue(row, column, value) {
        var isInitialValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        var cell = byId("cell_" + row + "_" + column);
        while (cell.childNodes.length > 0) {
            cell.removeChild(cell.childNodes[0]);
        }
        var cellValue = create("div");
        var cellSpan = create("span");
        cellSpan.appendChild(document.createTextNode(value));
        cellValue.appendChild(cellSpan);
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

        var cntr = create('div');
        // cntr.className = 'row';
        cell.appendChild(cntr);
        // let gridRow = null;
        for (var vals = 1; vals < 10; vals++) {
            var possibl = create("span");
            possibl.className = 'sudoku-cell-possibilities';
            possibl.style.float = 'left';

            if (possibilities.indexOf(vals) == -1) {
                possibl.classList.add('sudoku-cell-possibilities-hidden');
            }

            possibl.appendChild(document.createTextNode(vals));
            cntr.appendChild(possibl);
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

        holder = byId("holder");
        var btnNext = byId("btnNext"),
            slctPresets = byId('slctPresets'),
            btnExecute = byId('btnExecute');
        var txtInitialValues = byId("txtInitialValues");
        var btnInitiate = byId('btnInitiate');

        // btnNext.addEventListener('click', () => {
        //     showNextStep();
        // });
        btnExecute.addEventListener('click', function () {
            execute();
        });
        byId("btnReset").addEventListener("click", function () {
            gtag('send', 'event', 'button', 'click', 'reset');

            solver = null;
            while (holder.childNodes.length > 0) {
                holder.removeChild(holder.childNodes[0]);
            }
            // If there is a timer clear timer also.

            $('#sectionSetup').show();
            setStepNumberText("Setup Step");
            // setStepDetailsText(getTextForStep(-1));
            $("#sectionSudokuBoard").collapse();
            byId("sectionSetup").scrollIntoView();
        });

        var btns = document.getElementsByClassName('btn-preset');
        for (var idx = 0; idx < btns.length; idx++) {

            btns[idx].addEventListener('click', function (evt) {
                var presetName = evt.target.getAttribute("href").substr(1);
                txtInitialValues.value = JSON.stringify(getInitialValues(presetName));
                gtag('send', 'event', 'button', 'click', 'preset', presetName.substr(0, presetName.length - 1), parseInt(presetName.substr(presetName.length - 1)));
            });
        }

        btnInitiate.addEventListener('click', function () {
            gtag('send', 'event', 'button', 'click', 'initiate');
            $('#sectionSetup').collapse();
            $("#sectionSudokuBoard").show();
            byId("sectionSudokuBoard").scrollIntoView();
            generateBoard();
            displaySetupInstructions();

            initialValues = JSON.parse(txtInitialValues.value);
            values = initialValues.map(function (vals) {
                return vals.map(function (single) {
                    return single;
                });
            });

            solver = new SudokuSolver(values, function (evtObject) {
                switch (evtObject.type) {
                    case "modify-possibility":
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
        });
    }

    function execute() {
        gtag('send', 'event', 'button', 'click', 'execute', 'step', stepNumber % maxStepsCount);

        setStepNumberText(getHeaderForStep((stepNumber + 1) % maxStepsCount));
        setStepDetailsText(getTextForStep(stepNumber % maxStepsCount));
        setNextStepDetailsText(getTextForStep((stepNumber + 1) % maxStepsCount));
        // tipStepNumber = stepNumber;

        solver.evaluationArrays.forEach(function (arr) {
            switch (stepNumber % maxStepsCount) {
                case 0:
                    possibilities = solver.removeDuplicates(values, possibilities, arr);
                    break;
                case 1:
                    possibilities = solver.isolateUniques(values, possibilities, arr);
                    break;
                case 2:
                    possibilities = solver.findAndClearByNSizeDuplicatesInRow(values, possibilities, arr, 1);
                    break;
                case 3:
                    possibilities = solver.findAndClearByNSizeDuplicatesInRow(values, possibilities, arr, 2);
                    break;
                case 4:
                    possibilities = solver.findAndClearByNSizeDuplicatesInRow(values, possibilities, arr, 3);
                    break;
                case 5:
                    possibilities = solver.findAndClearByNSizeDuplicatesInRow(values, possibilities, arr, 4);
                    break;
                case 6:
                    possibilities = solver.cleanPossibilitiesByUniqueDefinitions(values, possibilities, arr);
                    break;
                case 7:
                    var preCountOfValues = solver.countNumberOfValues(values);
                    values = solver.attemptToCalculateValues(values, possibilities);
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

        stepNumber++;
    }

    function setStepNumberText(txt) {
        byId("spanStepNumber").innerText = txt;
    }

    window.addEventListener('load', function () {
        attachHandlers();
    });

    function setStepDetailsText(txt) {
        byId("spanStepDetails").innerHTML = txt;
    }
    function setNextStepDetailsText(txt) {
        byId("spanNextStepDetails").innerHTML = txt;
        byId("spanNextStepDetails").scrollTop = '0px';
    }

    function displaySetupInstructions() {
        $('#initialSetupModal').modal();
        setNextStepDetailsText(getTextForStep(stepNumber));
        setStepDetailsText("");
    }
    function getHeaderForStep(stepNumber) {
        return "Step " + (stepNumber + 1);
    }
    function getTextForStep(stepNumber) {
        var txt = null;

        switch (stepNumber) {
            case 0:
                txt = "<p>Check all the known values, and remove those possibilities from unknown cells. </p><p><em>Why :</em> since the value is present in either the row / column / subgrid those values cannot exist in the unknown cells.</p>";
                break;
            case 1:
                txt = "<p>Check all rows, columns and sub grids to identify the possibilities which exist only once. </p><p><em>Why :</em> Since the possibilities are possible only in one cell, that possible value is unique.</p>";
                break;
            case 2:
                txt = "<p>Identify the cells where only one possibility exists. This indicates that the number is guaranteed to be in that cell. So no other cell can contain the number in the corresponding row / column / grid. Remove the possibility of that number from all the rest of the cells in the row / column / grid.</p>";
                break;
            case 3:
                txt = "<p>Usually this step occurs in harder / medium puzzles. Identify set of 2 number(s) such that this set repeats 2 times in a grid / row / column. Since the locations / possibilities for this set of numbers are already decided, they cannot exist in any other location in the row / column / subgrid. Remove them from possibilities from the corresponding row / column / grid.</p>";
                break;
            case 4:
                txt = "<p>Usually this step occurs in harder / medium puzzles. Identify set of 3 number(s) such that this set repeats 3 times in a grid / row / column. Since the locations / possibilities for this set of numbers are already decided, they cannot exist in any other location in the row / column / subgrid. Remove them from possibilities from the corresponding row / column / grid.</p>";
                break;
            case 5:
                txt = "<p>Usually this step occurs in harder / medium puzzles. Identify set of 4 number(s) such that this set repeats 4 times in a grid / row / column. Since the locations / possibilities for this set of numbers are already decided, they cannot exist in any other location in the row / column / subgrid. Remove them from possibilities from the corresponding row / column / grid.</p>";
                break;
            case 6:
                txt = "<p>Identify possibilities which are in the same row for a sub grid. Remove this possibility from the same row in all the other subgrids to the left and right of the subgrid. Similarly if a possibility is in only one column in a subgrid, clear that possibility from all the other subgrid to the top and bottom of the subgrid.</p>";
                break;
            case 7:
                txt = "<p>In the cells which have only one possibility, set the value to that possibility. Repeat if the unknowns still exist.</p>";
                break;

        }
        return txt;
    }

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