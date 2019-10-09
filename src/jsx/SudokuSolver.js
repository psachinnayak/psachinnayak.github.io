class SudokuSolver {


    constructor(values) {
        this.values = values;
        this.buildValidationArrays(values);
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
        // console.log(this.evaluationArrays);
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


    getPossibilities(possibilities = null) {
        let newPossibilites = [];


        if (!possibilities) {
            possibilities = [];
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
        }
        // console.log(this.values)

        for (let idx in possibilities) {
            let possib = [];
            possibilities[idx].forEach((val) => {
                possib.push(val);
            });
            newPossibilites.push(possib);
        }
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
            possibilities: newPossibilites,
        };

    }
    solve(possibilities) {

        let preCountOfValues = this.countNumberOfValues(this.values);
        this.attemptToCalculateValues(this.values, possibilities);
        let postCountOfValues = this.countNumberOfValues(this.values);
        return {
            values: this.values,
            is_solved: (postCountOfValues == 81),
            unsolvable: (postCountOfValues == preCountOfValues)
        }
    }
}