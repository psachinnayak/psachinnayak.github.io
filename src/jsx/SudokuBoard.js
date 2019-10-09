
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

        // if (this.state.value) {
        //     return <div className={clsNm}>

        //     </div>
        // } else {

        //     let possibs = ;
        //     return <div className={clsNm}>
        //         {possibs}
        //     </div>
        // }
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
    }


    removeDuplicatesInRow(values, possibilities) {
        let newPossibilites = [];
        for (let idx2 in values) {
            var valsInRows = values[idx2].filter((val) => val > 0);

            let elems = possibilities[idx2].map((elem) => {
                valsInRows.forEach((val) => {
                    elem = elem.filter((toFilter) => val != toFilter);
                });
                return elem;
            });
            newPossibilites.push(elems);
        }
        // this.setState({
        //     possibilities: newPossibilites
        // })
        return newPossibilites;
    }


    removeDuplicatesInColumn(values, possibilities) {
        let newPossibilites = [];
        for (let idx in possibilities) {
            newPossibilites.push(possibilities[idx].map(() => []));
        }


        [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((idxColumn) => {
            let colValues = [];
            for (let idx in values) {
                if (values[idx][idxColumn] > 0) {
                    colValues.push(values[idx][idxColumn]);
                }
            }

            for (let idx in possibilities) {
                newPossibilites[idx][idxColumn] = possibilities[idx][idxColumn].filter((val) => colValues.indexOf(val) == -1);
            }
        })

        // for (let idx2 in values) {
        //     var valsInRows = values[idx2].filter((val) => val > 0);

        //     let elems = possibilities[idx2].map((elem) => {
        //         valsInRows.forEach((val) => {
        //             elem = elem.filter((toFilter) => val != toFilter);
        //         });
        //         return elem;
        //     });
        //     newPossibilites.push(elems);
        // }
        // this.setState({
        //     possibilities: newPossibilites
        // })
        return newPossibilites;
    }

    removeDuplicatesInSubgrids(values, possibilities) {
        let gridVals = {};
        for (let idx in values) {
            let row = (idx - (idx % 3)) / 3;
            values[idx].forEach((val, idx2) => {
                if (val) {
                    let col = (idx2 - (idx2 % 3)) / 3;
                    if (!gridVals["grid_" + row + "_" + col]) {
                        gridVals["grid_" + row + "_" + col] = []
                    }
                    gridVals["grid_" + row + "_" + col].push(val);
                }
            });
        }


        let newPossibilites = [];

        for (let idx in possibilities) {
            let rowPoss = [];
            let row = (idx - (idx % 3)) / 3;
            possibilities[idx].forEach((val, idx2) => {
                let col = (idx2 - (idx2 % 3)) / 3;
                rowPoss.push(val.filter((eachPoss) => gridVals["grid_" + row + "_" + col].indexOf(eachPoss) == -1))
                // if (!gridVals["grid_" + row + "_" + col]) {
                //     gridVals["grid_" + row + "_" + col] = []
                // }
                // gridVals["grid_" + row + "_" + col].push(val);
            });
            newPossibilites.push(rowPoss);
        }

        return newPossibilites;
    }


    attemptToCalculateValuesByUniquesInRow(values, possibilities) {
        for (let idxRow in possibilities) {
            let locations = {};
            possibilities[idxRow].forEach((val, idxCol) => {
                val.forEach((options) => {
                    if (!locations[options]) {
                        locations[options] = [];
                    }
                    locations[options].push(idxCol);
                })
            });

            for (let idx in locations) {
                if (locations[idx].length == 1) {
                    if (idxRow == 8 && locations[idx][0] == 7) {
                        console.log("About to set value for for unique by row", idxRow, locations[idx][0], idx);
                    }
                    // Only one location the option is possible.
                    values[idxRow][locations[idx][0]] = parseInt(idx);
                    possibilities[idxRow][locations[idx][0]] = [parseInt(idx)];
                }
            }

        }
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
        this.attemptToCalculateValuesByUniquesInRow(values, possibilities);

        return values;
    }



    findAndClearByNSizeDuplicatesInRow(values, possibilities, n) {
        let newPossibilities = [];
        for (let possib in possibilities) {
            newPossibilities.push(possibilities[possib]);
        }
        // debugger;
        for (let poss in newPossibilities) {
            let nSizedArr = newPossibilities[poss].filter((val) => val.length == n);
            // let idxs = [];
            nSizedArr.forEach((val) => {
                let pos = [];

                newPossibilities[poss].forEach((val2, idx) => {
                    // If both val and val2 are the same contents
                    if (JSON.stringify(val) == JSON.stringify(val2)) {
                        pos.push(idx);
                    }
                })
                debugger;
                if (pos.length == n) {
                    newPossibilities[poss].forEach((options, idxOfOption) => {
                        if (pos.indexOf(idxOfOption) == -1) {
                            debugger;
                            // Filter those which are there in val
                            newPossibilities[poss][idxOfOption] = options.filter((possibs) => val.indexOf(possibs) == -1)
                        }
                    });
                }
            })
        }


        return newPossibilities;
    }
    countNumberOfValues(values) {
        let count = 0;
        values.forEach((val) => {
            count += val.filter((item) => item > 0).length;
        });
        return count;
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
        newPossibilites = this.removeDuplicatesInRow(values, newPossibilites);

        newPossibilites = this.removeDuplicatesInColumn(values, newPossibilites);

        newPossibilites = this.removeDuplicatesInSubgrids(values, newPossibilites);

        this.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, 2);

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
