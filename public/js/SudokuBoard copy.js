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
        return _this3;
    }

    _createClass(SudokuBoard, [{
        key: 'removeDuplicatesInRow',
        value: function removeDuplicatesInRow(values, possibilities) {
            var newPossibilites = [];
            for (var idx2 in values) {
                var valsInRows = values[idx2].filter(function (val) {
                    return val > 0;
                });

                var elems = possibilities[idx2].map(function (elem) {
                    valsInRows.forEach(function (val) {
                        elem = elem.filter(function (toFilter) {
                            return val != toFilter;
                        });
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
    }, {
        key: 'removeDuplicatesInColumn',
        value: function removeDuplicatesInColumn(values, possibilities) {
            var newPossibilites = [];
            for (var idx in possibilities) {
                newPossibilites.push(possibilities[idx].map(function () {
                    return [];
                }));
            }

            [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(function (idxColumn) {
                var colValues = [];
                for (var _idx in values) {
                    if (values[_idx][idxColumn] > 0) {
                        colValues.push(values[_idx][idxColumn]);
                    }
                }

                for (var _idx2 in possibilities) {
                    newPossibilites[_idx2][idxColumn] = possibilities[_idx2][idxColumn].filter(function (val) {
                        return colValues.indexOf(val) == -1;
                    });
                }
            });

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
    }, {
        key: 'removeDuplicatesInSubgrids',
        value: function removeDuplicatesInSubgrids(values, possibilities) {
            var gridVals = {};

            var _loop = function _loop(idx) {
                var row = (idx - idx % 3) / 3;
                values[idx].forEach(function (val, idx2) {
                    if (val) {
                        var col = (idx2 - idx2 % 3) / 3;
                        if (!gridVals["grid_" + row + "_" + col]) {
                            gridVals["grid_" + row + "_" + col] = [];
                        }
                        gridVals["grid_" + row + "_" + col].push(val);
                    }
                });
            };

            for (var idx in values) {
                _loop(idx);
            }

            var newPossibilites = [];

            var _loop2 = function _loop2(idx) {
                var rowPoss = [];
                var row = (idx - idx % 3) / 3;
                possibilities[idx].forEach(function (val, idx2) {
                    var col = (idx2 - idx2 % 3) / 3;
                    rowPoss.push(val.filter(function (eachPoss) {
                        return gridVals["grid_" + row + "_" + col].indexOf(eachPoss) == -1;
                    }));
                    // if (!gridVals["grid_" + row + "_" + col]) {
                    //     gridVals["grid_" + row + "_" + col] = []
                    // }
                    // gridVals["grid_" + row + "_" + col].push(val);
                });
                newPossibilites.push(rowPoss);
            };

            for (var idx in possibilities) {
                _loop2(idx);
            }

            return newPossibilites;
        }
    }, {
        key: 'attemptToCalculateValuesByUniquesInRow',
        value: function attemptToCalculateValuesByUniquesInRow(values, possibilities) {
            var _loop3 = function _loop3(idxRow) {
                var locations = {};
                possibilities[idxRow].forEach(function (val, idxCol) {
                    val.forEach(function (options) {
                        if (!locations[options]) {
                            locations[options] = [];
                        }
                        locations[options].push(idxCol);
                    });
                });

                for (var idx in locations) {
                    if (locations[idx].length == 1) {
                        if (idxRow == 8 && locations[idx][0] == 7) {
                            console.log("About to set value for for unique by row", idxRow, locations[idx][0], idx);
                        }
                        // Only one location the option is possible.
                        values[idxRow][locations[idx][0]] = parseInt(idx);
                        possibilities[idxRow][locations[idx][0]] = [parseInt(idx)];
                    }
                }
            };

            for (var idxRow in possibilities) {
                _loop3(idxRow);
            }
        }
    }, {
        key: 'attemptToCalculateValues',
        value: function attemptToCalculateValues(values, possibilities) {
            var _loop4 = function _loop4(idx) {
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
                _loop4(idx);
            }
            this.attemptToCalculateValuesByUniquesInRow(values, possibilities);

            return values;
        }
    }, {
        key: 'findAndClearByNSizeDuplicatesInRow',
        value: function findAndClearByNSizeDuplicatesInRow(values, possibilities, n) {
            var newPossibilities = [];
            for (var possib in possibilities) {
                newPossibilities.push(possibilities[possib]);
            }
            // debugger;

            var _loop5 = function _loop5(poss) {
                var nSizedArr = newPossibilities[poss].filter(function (val) {
                    return val.length == n;
                });
                // let idxs = [];
                nSizedArr.forEach(function (val) {
                    var pos = [];

                    newPossibilities[poss].forEach(function (val2, idx) {
                        // If both val and val2 are the same contents
                        if (JSON.stringify(val) == JSON.stringify(val2)) {
                            pos.push(idx);
                        }
                    });
                    debugger;
                    if (pos.length == n) {
                        newPossibilities[poss].forEach(function (options, idxOfOption) {
                            if (pos.indexOf(idxOfOption) == -1) {
                                debugger;
                                // Filter those which are there in val
                                newPossibilities[poss][idxOfOption] = options.filter(function (possibs) {
                                    return val.indexOf(possibs) == -1;
                                });
                            }
                        });
                    }
                });
            };

            for (var poss in newPossibilities) {
                _loop5(poss);
            }

            return newPossibilities;
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
        key: 'solve',
        value: function solve() {
            var _this4 = this;

            var newPossibilites = [];

            var _loop6 = function _loop6(idx) {
                var possib = [];
                _this4.state.possibilities[idx].forEach(function (val) {
                    possib.push(val);
                });
                newPossibilites.push(possib);
            };

            for (var idx in this.state.possibilities) {
                _loop6(idx);
            }
            var values = [];

            var _loop7 = function _loop7(idx) {
                var possib = [];
                _this4.state.values[idx].forEach(function (val) {
                    possib.push(val);
                });
                values.push(possib);
            };

            for (var idx in this.state.values) {
                _loop7(idx);
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
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var arr = [];

            var _loop8 = function _loop8(idx2) {
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
                _loop8(idx2);
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