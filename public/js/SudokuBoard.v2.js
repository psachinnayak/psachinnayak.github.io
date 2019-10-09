var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SudokuPossibilities = [1, 2, 3, 4, 5, 6, 7, 8, 9];

var SudokuSquare = function (_React$Component) {
    _inherits(SudokuSquare, _React$Component);

    function SudokuSquare(props) {
        _classCallCheck(this, SudokuSquare);

        var _this = _possibleConstructorReturn(this, (SudokuSquare.__proto__ || Object.getPrototypeOf(SudokuSquare)).call(this, props));

        _this.state = {};
        if (props.value) {
            _this.state.is_value_initial_set = true;
        }

        return _this;
    }

    _createClass(SudokuSquare, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            // console.log("State Value", this.props.row,this.props.column, this.props.value);
            var clsNm = "sudoku-cell";
            ['left', 'top', 'bottom', 'right'].map(function (pos) {
                if (_this2.props[pos + "_border_cell"]) {
                    clsNm += " " + _this2.props[pos + "_border_cell"];
                }
            });

            var clsValueCell = 'sudoku-cell-with-value';
            if (this.state.is_value_initial_set) {
                clsValueCell += " sudoku-cell-initial-value";
            } else {
                clsValueCell += " sudoku-cell-determined-value";
            }
            return React.createElement(
                'div',
                { className: clsNm },
                this.props.value ? React.createElement(
                    'div',
                    { className: clsValueCell },
                    this.props.value
                ) : [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (val) {
                    var arr = [];
                    // console.log("Val is ", val, this.props.possibilities, this.props.possibilities.indexOf(val));

                    var clsName = _this2.props.possibilities.indexOf(val) > -1 ? "sudoku-cell-possibilities" : "sudoku-cell-possibilities sudoku-cell-possibilities-hidden";
                    clsName += val % 3 ? "" : " sudoku-possibilities-row";
                    return React.createElement(
                        'div',
                        { key: "possibility_" + (_this2.props.row * 8 + _this2.props.column) + "_" + val, className: clsName },
                        val
                    );
                })
            );
        }
    }]);

    return SudokuSquare;
}(React.Component);

var SudokuBoard = function (_React$Component2) {
    _inherits(SudokuBoard, _React$Component2);

    function SudokuBoard(props) {
        _classCallCheck(this, SudokuBoard);

        var _this3 = _possibleConstructorReturn(this, (SudokuBoard.__proto__ || Object.getPrototypeOf(SudokuBoard)).call(this, props));

        _this3.state = {
            values: props.initial_values,
            possibilities: []
        };

        for (var idx2 in _this3.state.values) {
            var row = _this3.state.values[idx2].map(function (val) {
                return val ? [val] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
            });
            _this3.state.possibilities.push(row);
        }

        _this3.buildValidationArrays(props.initial_values);
        return _this3;
    }

    _createClass(SudokuBoard, [{
        key: 'buildValidationArrays',
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
            console.log(this.evaluationArrays);
        }
    }, {
        key: 'attemptToCalculateValues',
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
        key: 'isolateUniques',
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
        key: 'findAndClearByNSizeDuplicatesInRow',
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
        key: 'countNumberOfValues',
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
        key: 'removeDuplicates',
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
        key: 'solve',
        value: function solve() {
            var _this4 = this;

            var newPossibilites = [];

            var _loop5 = function _loop5(idx) {
                var possib = [];
                _this4.state.possibilities[idx].forEach(function (val) {
                    possib.push(val);
                });
                newPossibilites.push(possib);
            };

            for (var idx in this.state.possibilities) {
                _loop5(idx);
            }
            var values = [];

            var _loop6 = function _loop6(idx) {
                var possib = [];
                _this4.state.values[idx].forEach(function (val) {
                    possib.push(val);
                });
                values.push(possib);
            };

            for (var idx in this.state.values) {
                _loop6(idx);
            }

            this.attemptToCalculateValues(values, newPossibilites);
            // let countOfValues = this.countNumberOfValues(values);
            // if (countOfValues == 9 * 9) {
            //     alert("There are no empty spots left. Stop clicking that button");
            // } else {

            this.evaluationArrays.forEach(function (arr) {
                newPossibilites = _this4.removeDuplicates(values, newPossibilites, arr);
                newPossibilites = _this4.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, arr, 2);
                newPossibilites = _this4.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, arr, 3);
                newPossibilites = _this4.findAndClearByNSizeDuplicatesInRow(values, newPossibilites, arr, 4);
                newPossibilites = _this4.isolateUniques(values, newPossibilites, arr);
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
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var arr = [];

            var _loop7 = function _loop7(idx2) {
                var row = _this5.state.values[idx2].map(function (value, idx) {

                    var props = {
                        row: idx2,
                        column: idx,
                        possibilities: _this5.state.possibilities[idx2][idx],
                        left_border_cell: idx % 3 == 0 ? 'sudoku-cell-left-block-end' : '',
                        top_border_cell: idx2 % 3 == 0 ? 'sudoku-cell-top-block-end' : '',
                        right_border_cell: idx == 8 ? 'sudoku-cell-right-block-end' : '',
                        bottom_border_cell: idx2 == 8 ? 'sudoku-cell-bottom-block-end' : ''
                    };

                    return React.createElement(SudokuSquare, Object.assign({ key: "sq_" + (idx2 * 8 + idx), value: value }, props));
                });
                arr.push(React.createElement(
                    'div',
                    { key: "row_" + idx2, className: 'sudoku-row' },
                    row
                ));
            };

            for (var idx2 in this.state.values) {
                _loop7(idx2);
            }

            arr.push(React.createElement(
                'div',
                { key: 'next-step-button', className: 'pnlSolve' },
                React.createElement(
                    'button',
                    { onClick: function onClick() {
                            return _this5.solve();
                        } },
                    'Solve Next Step'
                ),
                ' '
            ));
            return arr;
        }
    }]);

    return SudokuBoard;
}(React.Component);