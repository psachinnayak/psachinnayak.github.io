var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SudokuSolver = function () {
    function SudokuSolver(values) {
        var eventHandler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        _classCallCheck(this, SudokuSolver);

        this.values = values;
        this.buildValidationArrays(values);
        if (eventHandler) {
            this.eventHandler = eventHandler;
        } else {
            this.eventHandler = function () {
                // Ignore any events. TO prevent null exceptions this has been done.
            };
        }
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

            this.rowArr = rowArr;
            this.columnArr = columnArr;
            this.subgridArr = subgridArr;

            this.evaluationArrays = [rowArr, columnArr, subgridArr];
            // console.log(this.evaluationArrays);
        }
    }, {
        key: "attemptToCalculateValues",
        value: function attemptToCalculateValues(values, possibilities) {
            var _this = this;

            var _loop = function _loop(idx) {
                possibilities[idx].forEach(function (val, idx2) {

                    if (val.length == 1) {
                        // if (idx == 8 && idx2 == 7) {
                        //     console.log("About to set value for ", idx, idx2, val[0]);
                        // }

                        values[idx][idx2] = val[0];
                        possibilities[idx][idx2] = [val[0]];
                        _this.eventHandler({ type: "write", row: idx, column: idx2 });
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
            var _this2 = this;

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
                        _this2.eventHandler({ type: "modify-possibility", row: counts[key][0].row, column: counts[key][0].column });
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
            var _this3 = this;

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
                                var cnt = possibilities[cell.row][cell.column].length;
                                possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter(function (possibs) {
                                    return val.indexOf(possibs) == -1;
                                });
                                if (cnt != possibilities[cell.row][cell.column].length) {
                                    _this3.eventHandler({ type: "modify-possibility", row: cell.row, column: cell.column });
                                }
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
            var _this4 = this;

            var _loop4 = function _loop4(evalIdx) {
                var arr = evaluationArr[evalIdx];
                var valsInArr = arr.map(function (cell) {
                    // this.eventHandler({ type: "read", row: cell.row, column: cell.column });
                    return values[cell.row][cell.column];
                }).filter(function (val) {
                    return val > 0;
                });
                arr.forEach(function (cell) {
                    // let oldPossibs = possibilities[cell.row][cell.column;
                    possibilities[cell.row][cell.column] = possibilities[cell.row][cell.column].filter(function (possib) {
                        return valsInArr.indexOf(possib) == -1;
                    });
                    _this4.eventHandler({ type: "modify-possibility", row: cell.row, column: cell.column });
                });
            };

            for (var evalIdx in evaluationArr) {
                _loop4(evalIdx);
            }
            return possibilities;
        }
    }, {
        key: "defaultPossibilites",
        value: function defaultPossibilites() {
            var possibilities = [];
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
            return possibilities;
        }
    }, {
        key: "getPossibilities",
        value: function getPossibilities() {
            var _this5 = this;

            var possibilities = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultPossibilites();


            //         if (!possibilities) {
            // possibilities=defaultPossibilites();
            //         }
            var newPossibilites = possibilities;

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

            this.evaluationArrays.forEach(function (arr) {
                newPossibilites = _this5.removeDuplicates(_this5.values, newPossibilites, arr);
                newPossibilites = _this5.findAndClearByNSizeDuplicatesInRow(_this5.values, newPossibilites, arr, 2);
                newPossibilites = _this5.findAndClearByNSizeDuplicatesInRow(_this5.values, newPossibilites, arr, 3);
                newPossibilites = _this5.findAndClearByNSizeDuplicatesInRow(_this5.values, newPossibilites, arr, 4);
                newPossibilites = _this5.isolateUniques(_this5.values, newPossibilites, arr);
            });
            return {
                possibilities: newPossibilites
            };
        }
    }, {
        key: "solve",
        value: function solve(possibilities) {
            var soln = getPossibilities();

            possibilities = soln.possibilities;

            var preCountOfValues = this.countNumberOfValues(this.values);
            this.attemptToCalculateValues(this.values, possibilities);
            var postCountOfValues = this.countNumberOfValues(this.values);
            return {
                values: this.values,
                is_solved: postCountOfValues == 81,
                unsolvable: postCountOfValues == preCountOfValues
            };
        }
    }, {
        key: "cleanPossibilitiesByUniqueDefinitions",
        value: function cleanPossibilitiesByUniqueDefinitions(values, newPossibilites, arr) {
            var _this6 = this;

            var _loop5 = function _loop5(key) {
                var values_row = {},
                    values_col = {};
                debugger;
                _this6.subgridArr[key].forEach(function (cell) {
                    newPossibilites[cell.row][cell.column].forEach(function (possib) {
                        var rowNum = cell.row;
                        if (!values_row[possib]) {
                            values_row[possib] = [];
                        }
                        if (values_row[possib].indexOf(rowNum) == -1) {
                            values_row[possib].push(rowNum);
                        }

                        var colNum = cell.column;
                        if (!values_col[possib]) {
                            values_col[possib] = [];
                        }
                        if (values_col[possib].indexOf(colNum) == -1) {
                            values_col[possib].push(colNum);
                        }
                    });
                });

                var _loop6 = function _loop6(prop) {
                    if (values_row[prop].length == 1) {
                        var tmp = parseInt(values_row[prop][0]);
                        _this6.rowArr[values_row[prop][0]].forEach(function (cell) {
                            newPossibilites[cell.row][cell.column] = newPossibilites[cell.row][cell.column].filter(function (elem) {
                                var gridKey = "grid_" + (cell.row - cell.row % 3) / 3 + "_" + (cell.column - cell.column % 3) / 3;

                                return elem != prop || key == gridKey;
                            });
                        });
                    }
                };

                for (var prop in values_row) {
                    _loop6(prop);
                }

                var _loop7 = function _loop7(prop) {
                    if (values_col[prop].length == 1) {
                        var tmp = parseInt(values_col[prop][0]);
                        _this6.columnArr[values_col[prop][0]].forEach(function (cell) {
                            newPossibilites[cell.row][cell.column] = newPossibilites[cell.row][cell.column].filter(function (elem) {
                                var gridKey = "grid_" + (cell.row - cell.row % 3) / 3 + "_" + (cell.column - cell.column % 3) / 3;

                                return elem != prop || key == gridKey;
                            });
                        });
                    }
                };

                for (var prop in values_col) {
                    _loop7(prop);
                }
            };

            for (var key in this.subgridArr) {
                _loop5(key);
            }
            return newPossibilites;
        }
    }]);

    return SudokuSolver;
}();