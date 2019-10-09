var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SudokuSolver = function () {
    function SudokuSolver(values) {
        _classCallCheck(this, SudokuSolver);

        this.values = values;
        this.buildValidationArrays(values);
    }

    _createClass(SudokuSolver, [{
        key: "buildValidationArrays",
        value: function buildValidationArrays(values) {
            var rowArr = {};
            var columnArr = {};
            var subgridArr = {};
            values.forEach(function (val, idxRow) {
                return val.map(function (val2, idxColumn) {
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

                    var gridNumber = "grid_" + (idxRow - idxRow % 3) / 3 + "_" + (idxColumn - idxColumn % 3) / 3;
                    if (!subgridArr[gridNumber]) {
                        subgridArr[gridNumber] = [];
                    }

                    subgridArr[gridNumber].push({
                        row: idxRow,
                        column: idxColumn
                    });
                });
            });

            this.evaluationArrays = [rowArr, columnArr, subgridArr];
            // console.log(this.evaluationArrays);
        }
    }, {
        key: "attemptToCalculateValues",
        value: function attemptToCalculateValues(values, possibilities) {
            var _loop = function _loop(idx) {
                possibilities[idx].forEach(function (val, idx2) {
                    // console.log()
                    if (val.length == 1) {
                        if (idx == 8 && idx2 == 7) {
                            console.log("About to set value for ", idx, idx2, val[0]);
                        }

                        values[idx][idx2] = val[0];
                        possibilities[idx][idx2] = [val[0]];
                    }
                });
            };

            for (var idx in possibilities) {
                _loop(idx);
            }
            // this.attemptToCalculateValuesByUniquesInRow(values, possibilities);

            return values;
        }
    }, {
        key: "isolateUniques",
        value: function isolateUniques(values, possibilities, evalArr) {
            var _loop2 = function _loop2(evalIdx) {
                var arr = evalArr[evalIdx];
                var counts = {};
                arr.forEach(function (cell) {
                    possibilities[cell.row][cell.column].forEach(function (possib) {
                        if (!counts[possib]) {
                            counts[possib] = [];
                        }
                        counts[possib].push(cell);
                    });
                });

                for (var key in counts) {
                    if (counts[key].length == 1) {
                        possibilities[counts[key][0].row][counts[key][0].column] = [parseInt(key)];
                    }
                }
            };

            for (var evalIdx in evalArr) {
                _loop2(evalIdx);
            }
            return possibilities;
        }
    }, {
        key: "findAndClearByNSizeDuplicatesInRow",
        value: function findAndClearByNSizeDuplicatesInRow(values, possibilities, evalArr, n) {
            var _loop3 = function _loop3(key) {
                var arr = evalArr[key];
                // Find all the possibilities which have length n (example - 2);
                var allNSizedArr = arr.map(function (cell) {
                    return possibilities[cell.row][cell.column];
                }).filter(function (val) {
                    return val.length == n;
                });
                allNSizedArr.forEach(function (val) {
                    var valStr = JSON.stringify(val);
                    var idxs = [];
                    arr.forEach(function (cell) {
                        if (valStr == JSON.stringify(possibilities[cell.row][cell.column])) {
                            idxs.push(cell);
                        }
                    });
                    if (idxs.length == val.length) {
                        arr.forEach(function (cell) {
                            if (idxs.indexOf(cell) == -1) {
                                possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter(function (possibs) {
                                    return val.indexOf(possibs) == -1;
                                });
                            }
                        });
                    }
                });
            };

            for (var key in evalArr) {
                _loop3(key);
            }

            return possibilities;
        }
    }, {
        key: "countNumberOfValues",
        value: function countNumberOfValues(values) {
            var count = 0;
            values.forEach(function (val) {
                count += val.filter(function (item) {
                    return item > 0;
                }).length;
            });
            return count;
        }
    }, {
        key: "removeDuplicates",
        value: function removeDuplicates(values, possibilities, evaluationArr) {
            var _loop4 = function _loop4(evalIdx) {
                var arr = evaluationArr[evalIdx];
                var valsInArr = arr.map(function (cell) {
                    return values[cell.row][cell.column];
                }).filter(function (val) {
                    return val > 0;
                });
                arr.forEach(function (cell) {

                    possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter(function (possib) {
                        return valsInArr.indexOf(possib) == -1;
                    });
                });
            };

            for (var evalIdx in evaluationArr) {
                _loop4(evalIdx);
            }
            return possibilities;
        }
    }, {
        key: "getPossibilities",
        value: function getPossibilities() {
            var _this = this;

            var possibilities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            var newPossibilites = [];

            if (!possibilities) {
                possibilities = [];
                for (var i = 0; i < this.values.length; i++) {
                    var row = this.values[i];
                    var rowPossibs = [];
                    possibilities.push(rowPossibs);
                    for (var j = 0; j < row.length; j++) {
                        if (this.values[i][j]) {
                            rowPossibs.push([this.values[i][j]]);
                        } else {
                            rowPossibs.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                        }
                    }
                }
            }
            // console.log(this.values)

            var _loop5 = function _loop5(idx) {
                var possib = [];
                possibilities[idx].forEach(function (val) {
                    possib.push(val);
                });
                newPossibilites.push(possib);
            };

            for (var idx in possibilities) {
                _loop5(idx);
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

            this.evaluationArrays.forEach(function (arr) {
                newPossibilites = _this.removeDuplicates(_this.values, newPossibilites, arr);
                newPossibilites = _this.findAndClearByNSizeDuplicatesInRow(_this.values, newPossibilites, arr, 2);
                newPossibilites = _this.findAndClearByNSizeDuplicatesInRow(_this.values, newPossibilites, arr, 3);
                newPossibilites = _this.findAndClearByNSizeDuplicatesInRow(_this.values, newPossibilites, arr, 4);
                newPossibilites = _this.isolateUniques(_this.values, newPossibilites, arr);
            });
            return {
                possibilities: newPossibilites
            };
        }
    }, {
        key: "solve",
        value: function solve(possibilities) {

            var preCountOfValues = this.countNumberOfValues(this.values);
            this.attemptToCalculateValues(this.values, possibilities);
            var postCountOfValues = this.countNumberOfValues(this.values);
            return {
                values: this.values,
                is_solved: postCountOfValues == 81,
                unsolvable: postCountOfValues == preCountOfValues
            };
        }
    }]);

    return SudokuSolver;
}();