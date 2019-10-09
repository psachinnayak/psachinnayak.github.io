
(function (window, document) {
    function byId(id) {
        return document.getElementById(id);
    }
    function create(tagName) {
        return document.createElement(tagName);
    }

    function getGridId(row, col) {
        return "grid_" + ((row - (row % 3)) / 3) + "_" + ((col - (col % 3)) / 3);
    }
    function generateBoard() {
        let holder = byId("holder");
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

        for (let row = 0; row < 9; row++) {
            let gridRow = create('div');

            holder.appendChild(gridRow);
            for (let col = 0; col < 9; col++) {

                let cell = create("div");
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
            let clearer = create("div");
            clearer.className = 'clear';
            gridRow.appendChild(clearer);
        }


    }
    function setCellValue(row, column, value, isInitialValue = false) {
        let cell = byId("cell_" + row + "_" + column);
        while (cell.childNodes.length > 0) {
            cell.removeChild(cell.childNodes[0]);
        }
        let cellValue = create("div");
        cellValue.appendChild(document.createTextNode(value));
        cellValue.className = "sudoku-cell-with-value";
        if (isInitialValue) {
            cellValue.classList.add("sudoku-cell-initial-value");
        }
        cell.appendChild(cellValue);

        // cell.innerText = value;
    }


    function setPossibilities(row, column, possibilities) {
        let cell = byId("cell_" + row + "_" + column);
        while (cell.childNodes.length > 0) {
            cell.removeChild(cell.childNodes[0]);
        }

        // cell.className = "col-4 row sudoku-cell";
        for (let vals = 1; vals < 10; vals++) {

            let possibl = create("div");
            possibl.className = 'sudoku-cell-possibilities';

            if (possibilities.indexOf(vals) == -1) {
                possibl.classList.add('sudoku-cell-possibilities-hidden')
            }

            possibl.appendChild(document.createTextNode(vals));
            cell.appendChild(possibl);
        }
    }

    var solver = null;
    function attachHandlers() {
        byId('btnInitiate').addEventListener('click', () => {
            generateBoard();
            let initialValues = JSON.parse(byId("txtInitialValues").value);
            solver = new SudokuSolver(initialValues);
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (initialValues[i][j]) {
                        setCellValue(i, j, initialValues[i][j], true);
                    } else {
                        setPossibilities(i, j, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    }
                }
            }
            let values = initialValues, possibilities = null, is_solved = false, unsolvable = false;

            function execute() {

                // setTimeout(() => {
                // for (let r = 0; r < 15; r++) {
                let soln = solver.getPossibilities(possibilities);
                possibilities = soln.possibilities;
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        if (values[i][j]) {
                            setCellValue(i, j, values[i][j], (values[i][j] == initialValues[i][j]));
                        } else {
                            setPossibilities(i, j, possibilities[i][j]);
                        }
                    }
                }

                setTimeout(() => {
                    let soln = solver.solve(possibilities)
                    values = soln.values;
                    is_solved = soln.is_solved;
                    unsolvable = soln.unsolvable;
                    // console.log(values);
                    for (let i = 0; i < 9; i++) {
                        for (let j = 0; j < 9; j++) {
                            if (values[i][j]) {
                                setCellValue(i, j, values[i][j], (values[i][j] == initialValues[i][j]));
                            } else {
                                setPossibilities(i, j, possibilities[i][j]);
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
        for (let i = 0; i < 9; i++) {
            setCellValue(i, i, i + 1);
        }
        for (let j = 0; j < 9; j++) {
            console.log(j, 8 - j, j + 1);
            setCellValue(j, 8 - j, j + 1);
        }
        setPossibilities(1, 5, [3, 4, 5])
    }
    window.addEventListener('load', () => {
        attachHandlers();

    })
})(window, document)
