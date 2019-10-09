
const SudokuPossibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class SudokuSquare extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
        if (props.value) {
            this.state.is_value_initial_set = true;
        }

    }
    render() {
        // console.log("State Value", this.props.row,this.props.column, this.props.value);
        let clsNm = "sudoku-cell";
        ['left', 'top', 'bottom', 'right'].map((pos) => {
            if (this.props[pos + "_border_cell"]) {
                clsNm += " " + this.props[pos + "_border_cell"];
            }
        });

        let clsValueCell = 'sudoku-cell-with-value';
        if (this.state.is_value_initial_set) {
            clsValueCell += " sudoku-cell-initial-value";
        } else {
            clsValueCell += " sudoku-cell-determined-value";
        }
        return <div className={clsNm}>
            {
                this.props.value ? <div className={clsValueCell}>
                    {this.props.value}
                </div>
                    :
                    [1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => {
                        let arr = [];
                        // console.log("Val is ", val, this.props.possibilities, this.props.possibilities.indexOf(val));

                        let clsName = (this.props.possibilities.indexOf(val) > -1) ? "sudoku-cell-possibilities" : "sudoku-cell-possibilities sudoku-cell-possibilities-hidden";
                        clsName += (val % 3) ? "" : " sudoku-possibilities-row";
                        return <div key={"possibility_" + (this.props.row * 8 + this.props.column) + "_" + val} className={clsName}>{val}</div>;
                    })
            }
        </div>


    }
}
class SudokuBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.initial_values,
            possibilities: []
        }

        for (let idx2 in this.state.values) {
            let row = this.state.values[idx2].map((val) => val ? [val] : [1, 2, 3, 4, 5, 6, 7, 8, 9]);
            this.state.possibilities.push(row);
        }


        this.buildValidationArrays(props.initial_values);
    }

    buildValidationArrays(values) {
        let rowArr = {};
        let columnArr = {};
        let subgridArr = {};
        values.forEach((val, idxRow) => val.map((val2, idxColumn) => {
            if (!rowArr[idxRow]) {
                rowArr[idxRow] = [];
            }
            rowArr[idxRow].push({
                row: idxRow,
                column: idxColumn
            });
            if (!columnArr[idxColumn]) {
                columnArr[idxColumn] = [];
            }
            columnArr[idxColumn].push({
                row: idxRow,
                column: idxColumn
            });


            let gridNumber = "grid_" + ((idxRow - (idxRow % 3)) / 3) + "_" + ((idxColumn - (idxColumn % 3)) / 3);
            if (!subgridArr[gridNumber]) {
                subgridArr[gridNumber] = [];
            }

            subgridArr[gridNumber].push({
                row: idxRow,
                column: idxColumn
            });
        }));

        this.evaluationArrays = [rowArr, columnArr, subgridArr];
        console.log(this.evaluationArrays);
    }


    attemptToCalculateValues(values, possibilities) {
        for (let idx in possibilities) {
            possibilities[idx].forEach((val, idx2) => {
                // console.log()
                if (val.length == 1) {
                    if (idx == 8 && idx2 == 7) {
                        console.log("About to set value for ", idx, idx2, val[0]);
                    }
                    values[idx][idx2] = val[0];
                    possibilities[idx][idx2] = [val[0]];
                }
            });
        }
        // this.attemptToCalculateValuesByUniquesInRow(values, possibilities);

        return values;
    }

    isolateUniques(values, possibilities, evalArr) {
        for (let evalIdx in evalArr) {
            let arr = evalArr[evalIdx];
            let counts = {};
            arr.forEach((cell) => {
                possibilities[cell.row][cell.column].forEach((possib) => {
                    if (!counts[possib]) {
                        counts[possib] = [];
                    }
                    counts[possib].push(cell);
                })
            });

            for (let key in counts) {
                if (counts[key].length == 1) {
                    possibilities[counts[key][0].row][counts[key][0].column] = [parseInt(key)];
                }
            }
        }
        return possibilities;
    }


    findAndClearByNSizeDuplicatesInRow(values, possibilities, evalArr, n) {
        for (let key in evalArr) {
            const arr = evalArr[key];
            // Find all the possibilities which have length n (example - 2);
            let allNSizedArr = arr.map((cell) => {
                return possibilities[cell.row][cell.column];
            }).filter((val) => val.length == n);
            allNSizedArr.forEach((val) => {
                let valStr = JSON.stringify(val);
                let idxs = [];
                arr.forEach((cell) => {
                    if (valStr == JSON.stringify(possibilities[cell.row][cell.column])) {
                        idxs.push(cell);
                    }
                });
                if (idxs.length == val.length) {
                    arr.forEach((cell) => {
                        if (idxs.indexOf(cell) == -1) {
                            possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter((possibs) => {
                                return val.indexOf(possibs) == -1;
                            });
                        }
                    });
                }
            })
        }


        return possibilities;
    }
    countNumberOfValues(values) {
        let count = 0;
        values.forEach((val) => {
            count += val.filter((item) => item > 0).length;
        });
        return count;
    }

    removeDuplicates(values, possibilities, evaluationArr) {
        for (let evalIdx in evaluationArr) {
            let arr = evaluationArr[evalIdx];
            let valsInArr = arr.map((cell) => values[cell.row][cell.column]).filter((val) => val > 0);
            arr.forEach((cell) => {

                possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter((possib) => valsInArr.indexOf(possib) == -1);

            });

        }
        return possibilities;
    }


    solve() {
        let newPossibilites = [];

        for (let idx in this.state.possibilities) {
            let possib = [];
            this.state.possibilities[idx].forEach((val) => {
                possib.push(val);
            });
            newPossibilites.push(possib);
        }
        let values = [];
        for (let idx in this.state.values) {
            let possib = [];
            this.state.values[idx].forEach((val) => {
                possib.push(val);
            });
            values.push(possib);
        }


        this.attemptToCalculateValues(values, newPossibilites);
        // let countOfValues = this.countNumberOfValues(values);
        // if (countOfValues == 9 * 9) {
        //     alert("There are no empty spots left. Stop clicking that button");
        // } else {

        this.evaluationArrays.forEach((arr) => {
            newPossibilites = this.removeDuplicates(values, newPossibilites, arr);
            newPossibilites = this.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, arr, 2);
            newPossibilites = this.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, arr, 3);
            newPossibilites = this.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, arr, 4);
            newPossibilites = this.isolateUniques(values, newPossibilites, arr);
        });


        // newPossibilites = 
        // newPossibilites = this.removeDuplicates(values, newPossibilites);

        // newPossibilites = this.removeDuplicatesInColumn(values, newPossibilites);

        // newPossibilites = this.removeDuplicatesInSubgrids(values, newPossibilites);

        // this.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, 2);

        this.setState({
            values: values,
            possibilities: newPossibilites
        });

        // }

    }
    render() {
        var arr = []
        for (let idx2 in this.state.values) {
            let row = this.state.values[idx2].map((value, idx) => {

                let props = {
                    row: idx2,
                    column: idx,
                    possibilities: this.state.possibilities[idx2][idx],
                    left_border_cell: (idx % 3 == 0) ? 'sudoku-cell-left-block-end' : '',
                    top_border_cell: (idx2 % 3 == 0) ? 'sudoku-cell-top-block-end' : '',
                    right_border_cell: (idx == 8) ? 'sudoku-cell-right-block-end' : '',
                    bottom_border_cell: (idx2 == 8) ? 'sudoku-cell-bottom-block-end' : ''
                }

                return <SudokuSquare key={"sq_" + (idx2 * 8 + idx)} value={value} {...props} />

            });
            arr.push(<div key={"row_" + idx2} className="sudoku-row">{row}</div>);
        }

        arr.push(<div key="next-step-button" className="pnlSolve"><button onClick={() => this.solve()}>Solve Next Step</button> </div>)
        return arr;
    }
}
