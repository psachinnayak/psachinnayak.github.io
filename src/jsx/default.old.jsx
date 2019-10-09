

const SudokuPossibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Default {
    constructor() {
        this.isInitialized = false;
    }

    initializeBoard() {

        // Unset the existing Board
        this.values = [];
        Fwk._listen(Fwk._id("btnInitialize"), "click", this.btnInitialize_Click.bind(this));

        this.isInitialized = true;
    }

    btnInitialize_Click() {
        this.drawBoard(JSON.parse(Fwk._id("txtInitialValues").value))
    }
    drawBoard(initialValues) {
        this.values = initialValues;
        this.possibilities = initialValues.map((row) => {
            let possibRow = [];
            row.map((cell) => {
                if (cell) {
                    possibRow.push([cell]);
                } else {
                    let possibsForCell = [];
                    SudokuPossibleValues.forEach((val) => {
                        possibsForCell.push(val);
                    })
                    possibRow.push(possibsForCell);
                }
            });
            return possibRow;
        })
        initialValues.forEach((row, rowIdx) => {
            let grid_row = (rowIdx - (rowIdx % 3)) / 3;
            row.forEach((cell, colIdx) => {
                let chld = Fwk._create("div", (cell != 0) ? cell : null);
                chld.setAttribute("data-row", rowIdx);
                chld.setAttribute("data-col", colIdx);
                chld.setAttribute("data-subgrid-col", colIdx % 3);
                chld.setAttribute("data-subgrid-row", rowIdx % 3);
                let grid_col = (colIdx - (colIdx % 3)) / 3;
                let grid_id = `grid_${grid_row}_${grid_col}`;
                Fwk._id(grid_id).appendChild(chld);
                if (cell == 0) {
                    chld.className = "col-4";
                    let possibContainer = Fwk._create('div');
                    possibContainer.className = 'row';
                    chld.appendChild(possibContainer);
                    SudokuPossibleValues.forEach((val) => {
                        let txt = (this.possibilities[rowIdx][colIdx].indexOf(val) > -1) ? val : null;
                        let possibValueContainer = Fwk._create('div', txt);
                        possibValueContainer.className = 'col-4';
                        possibContainer.appendChild(possibValueContainer);
                    })
                } else {
                    chld.className = 'col-4 sudoku-value-set sudoku-initial-value';
                }
            });
        })
    }
}


Fwk._listen(window, "load", () => {
    if (!window["PageFramework"]) {
        window["PageFramework"] = new Default();
    }
    window["PageFramework"].initializeBoard();
});
