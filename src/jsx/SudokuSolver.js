class SudokuSolver {


    constructor(values, eventHandler = null) {
        this.values = values;
        this.buildValidationArrays(values);
        if (eventHandler) {
            this.eventHandler = eventHandler;
        } else {
            this.eventHandler = () => {
                // Ignore any events. TO prevent null exceptions this has been done.
            }
        }
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

        this.rowArr = rowArr;
        this.columnArr = columnArr;
        this.subgridArr = subgridArr;

        this.evaluationArrays = [rowArr, columnArr, subgridArr];
        // console.log(this.evaluationArrays);
    }


    attemptToCalculateValues(values, possibilities) {
        for (let idx in possibilities) {
            possibilities[idx].forEach((val, idx2) => {

                if (val.length == 1) {
                    // if (idx == 8 && idx2 == 7) {
                    //     console.log("About to set value for ", idx, idx2, val[0]);
                    // }

                    values[idx][idx2] = val[0];
                    possibilities[idx][idx2] = [val[0]];
                    this.eventHandler({ type: "write", row: idx, column: idx2 });
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

                });
            });

            for (let key in counts) {
                if (counts[key].length == 1) {
                    possibilities[counts[key][0].row][counts[key][0].column] = [parseInt(key)];
                    this.eventHandler({ type: "modify-possibility", row: counts[key][0].row, column: counts[key][0].column });
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
                            let cnt = possibilities[cell.row][cell.column].length;
                            possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter((possibs) => {
                                return val.indexOf(possibs) == -1;
                            });
                            if (cnt != possibilities[cell.row][cell.column].length) {
                                this.eventHandler({ type: "modify-possibility", row: cell.row, column: cell.column });
                            }
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
            let valsInArr = arr.map((cell) => {
                // this.eventHandler({ type: "read", row: cell.row, column: cell.column });
                return values[cell.row][cell.column]
            }).filter((val) => val > 0);
            arr.forEach((cell) => {
                // let oldPossibs = possibilities[cell.row][cell.column;
                possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter((possib) => valsInArr.indexOf(possib) == -1);
                this.eventHandler({ type: "modify-possibility", row: cell.row, column: cell.column });
            });

        }
        return possibilities;
    }

    defaultPossibilites() {
        let possibilities = [];
        for (let i = 0; i < this.values.length; i++) {
            let row = this.values[i];
            let rowPossibs = [];
            possibilities.push(rowPossibs);
            for (let j = 0; j < row.length; j++) {
                if (this.values[i][j]) {
                    rowPossibs.push([this.values[i][j]]);
                } else {
                    rowPossibs.push([1, 2, 3, 4, 5, 6, 7, 8, 9])
                }
            }
        }
        return possibilities;
    }
    getPossibilities(possibilities = defaultPossibilites()) {


        //         if (!possibilities) {
        // possibilities=defaultPossibilites();
        //         }
        let newPossibilites = possibilities;

        // console.log(this.values)

        // for (let idx in possibilities) {
        //     let possib = [];
        //     possibilities[idx].forEach((val) => {
        //         possib.push(val);
        //     });
        //     newPossibilites.push(possib);
        // }
        // let newValues = [];
        // for (let idx in this.values) {
        //     let possib = [];
        //     this.values[idx].forEach((val) => {
        //         possib.push(val);
        //     });
        //     newValues.push(possib);
        // }


        // if (countOfValues == 9 * 9) {
        //     alert("There are no empty spots left. Stop clicking that button");
        // } else {

        this.evaluationArrays.forEach((arr) => {
            newPossibilites = this.removeDuplicates(this.values, newPossibilites, arr);
            newPossibilites = this.findAndClearByNSizeDuplicatesInRow(this.values, newPossibilites, arr, 2);
            newPossibilites = this.findAndClearByNSizeDuplicatesInRow(this.values, newPossibilites, arr, 3);
            newPossibilites = this.findAndClearByNSizeDuplicatesInRow(this.values, newPossibilites, arr, 4);
            newPossibilites = this.isolateUniques(this.values, newPossibilites, arr);
        });
        return {
            possibilities: newPossibilites
        };

    }
    solve(possibilities) {
        let soln = getPossibilities();

        possibilities = soln.possibilities;

        let preCountOfValues = this.countNumberOfValues(this.values);
        this.attemptToCalculateValues(this.values, possibilities);
        let postCountOfValues = this.countNumberOfValues(this.values);
        return {
            values: this.values,
            is_solved: (postCountOfValues == 81),
            unsolvable: (postCountOfValues == preCountOfValues)
        }
    }


    cleanPossibilitiesByUniqueDefinitions(values, newPossibilites, arr) {


        for (let key in this.subgridArr) {
            let values_row = {}, values_col = {};
            debugger;
            this.subgridArr[key].forEach((cell) => {
                newPossibilites[cell.row][cell.column].forEach((possib) => {
                    let rowNum = cell.row;
                    if (!values_row[possib]) {
                        values_row[possib] = [];
                    }
                    if (values_row[possib].indexOf(rowNum) == -1) {
                        values_row[possib].push(rowNum);
                    }

                    let colNum = cell.column;
                    if (!values_col[possib]) {
                        values_col[possib] = [];
                    }
                    if (values_col[possib].indexOf(colNum) == -1) {
                        values_col[possib].push(colNum);
                    }
                })
            });


            for (let prop in values_row) {
                if (values_row[prop].length == 1) {
                    let tmp = parseInt(values_row[prop][0]);
                    this.rowArr[values_row[prop][0]].forEach((cell) => {
                        newPossibilites[cell.row][cell.column] = newPossibilites[cell.row][cell.column].filter((elem) => {
                            let gridKey = "grid_" + ((cell.row - (cell.row % 3)) / 3) + "_" + ((cell.column - (cell.column % 3)) / 3);

                            return (elem != prop) || (key == gridKey);
                        });
                    });
                }
            }



            for (let prop in values_col) {
                if (values_col[prop].length == 1) {
                    let tmp = parseInt(values_col[prop][0]);
                    this.columnArr[values_col[prop][0]].forEach((cell) => {
                        newPossibilites[cell.row][cell.column] = newPossibilites[cell.row][cell.column].filter((elem) => {
                            let gridKey = "grid_" + ((cell.row - (cell.row % 3)) / 3) + "_" + ((cell.column - (cell.column % 3)) / 3);

                            return (elem != prop) || (key == gridKey);
                        });
                    });
                }
            }
        }
        return newPossibilites;
    }
}