var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SudokuPossibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

var Default = function () {
    function Default() {
        _classCallCheck(this, Default);

        this.isInitialized = false;
    }

    _createClass(Default, [{
        key: "initializeBoard",
        value: function initializeBoard() {

            // Unset the existing Board
            this.values = [];
            Fwk._listen(Fwk._id("btnInitialize"), "click", this.btnInitialize_Click.bind(this));

            this.isInitialized = true;
        }
    }, {
        key: "btnInitialize_Click",
        value: function btnInitialize_Click() {
            this.drawBoard(JSON.parse(Fwk._id("txtInitialValues").value));
        }
    }, {
        key: "drawBoard",
        value: function drawBoard(initialValues) {
            var _this = this;

            this.values = initialValues;
            this.possibilities = initialValues.map(function (row) {
                var possibRow = [];
                row.map(function (cell) {
                    if (cell) {
                        possibRow.push([cell]);
                    } else {
                        var possibsForCell = [];
                        SudokuPossibleValues.forEach(function (val) {
                            possibsForCell.push(val);
                        });
                        possibRow.push(possibsForCell);
                    }
                });
                return possibRow;
            });
            initialValues.forEach(function (row, rowIdx) {
                var grid_row = (rowIdx - rowIdx % 3) / 3;
                row.forEach(function (cell, colIdx) {
                    var chld = Fwk._create("div", cell != 0 ? cell : null);
                    chld.setAttribute("data-row", rowIdx);
                    chld.setAttribute("data-col", colIdx);
                    chld.setAttribute("data-subgrid-col", colIdx % 3);
                    chld.setAttribute("data-subgrid-row", rowIdx % 3);
                    var grid_col = (colIdx - colIdx % 3) / 3;
                    var grid_id = "grid_" + grid_row + "_" + grid_col;
                    Fwk._id(grid_id).appendChild(chld);
                    if (cell == 0) {
                        chld.className = "col-4";
                        var possibContainer = Fwk._create('div');
                        possibContainer.className = 'row';
                        chld.appendChild(possibContainer);
                        SudokuPossibleValues.forEach(function (val) {
                            var txt = _this.possibilities[rowIdx][colIdx].indexOf(val) > -1 ? val : null;
                            var possibValueContainer = Fwk._create('div', txt);
                            possibValueContainer.className = 'col-4';
                            possibContainer.appendChild(possibValueContainer);
                        });
                    } else {
                        chld.className = 'col-4 sudoku-value-set sudoku-initial-value';
                    }
                });
            });
        }
    }]);

    return Default;
}();

Fwk._listen(window, "load", function () {
    if (!window["PageFramework"]) {
        window["PageFramework"] = new Default();
    }
    window["PageFramework"].initializeBoard();
});