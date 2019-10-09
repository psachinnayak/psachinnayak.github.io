
(function (window, document) {
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
        var holder = byId("holder");
        // let gridRows = [];
        // let subgrids = {};

        // for (let gridRow = 0; gridRow < 3; gridRow++) {
        //     let tmp = create("div");
        //     tmp.className = 'row grid-row-' + gridRow;
        //     for (let gridCol = 0; gridCol < 3; gridCol++) {
        //         let tmp2 = create("div");
        //         tmp2.id = "grid_" + gridRow + "_" + gridCol;
        //         // tmp2.className = 'row col-4 grid-col-' + gridCol;
        //         tmp2.className = 'sudoku-row';
        //         tmp.appendChild(tmp2);
        //         let clearer = create('div');
        //         clearer.className = 'clear';
        //         tmp.appendChild(clearer);
        //         subgrids["grid_" + gridRow + "_" + gridCol] = tmp2;
        //     }
        //     holder.appendChild(tmp);
        // }

        for (var row = 0; row < 9; row++) {
            var gridRow = create('div');

            holder.appendChild(gridRow);
            for (var col = 0; col < 9; col++) {

                var cell = create("div");
                cell.className = 'sudoku-cell';
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
        while (cell.childNodes.length > 0) {
            cell.removeChild(cell.childNodes[0]);
        }

        // cell.className = "col-4 row sudoku-cell";
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

    var solver = null;
    function attachHandlers() {
        byId('btnInitiate').addEventListener('click', function () {
            generateBoard();
            var initialValues = JSON.parse(byId("txtInitialValues").value);
            solver = new SudokuSolver(initialValues);
            for (var i = 0; i < 9; i++) {
                for (var j = 0; j < 9; j++) {
                    if (initialValues[i][j]) {
                        setCellValue(i, j, initialValues[i][j], true);
                    } else {
                        setPossibilities(i, j, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    }
                }
            }
            var values = initialValues,
                possibilities = null,
                is_solved = false,
                unsolvable = false;

            function execute() {

                // setTimeout(() => {
                // for (let r = 0; r < 15; r++) {
                var soln = solver.getPossibilities(possibilities);
                possibilities = soln.possibilities;
                for (var _i = 0; _i < 9; _i++) {
                    for (var _j = 0; _j < 9; _j++) {
                        if (values[_i][_j]) {
                            setCellValue(_i, _j, values[_i][_j], values[_i][_j] == initialValues[_i][_j]);
                        } else {
                            setPossibilities(_i, _j, possibilities[_i][_j]);
                        }
                    }
                }

                setTimeout(function () {
                    var soln = solver.solve(possibilities);
                    values = soln.values;
                    is_solved = soln.is_solved;
                    unsolvable = soln.unsolvable;
                    // console.log(values);
                    for (var _i2 = 0; _i2 < 9; _i2++) {
                        for (var _j2 = 0; _j2 < 9; _j2++) {
                            if (values[_i2][_j2]) {
                                setCellValue(_i2, _j2, values[_i2][_j2], values[_i2][_j2] == initialValues[_i2][_j2]);
                            } else {
                                setPossibilities(_i2, _j2, possibilities[_i2][_j2]);
                            }
                        }
                    }
                    // }
                    if (!is_solved && !unsolvable) {
                        setTimeout(execute, 5000);
                    }
                }, 3000);
            }
            setTimeout(execute, 5000);
            // }, 1000);
        });
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
})(window, document);