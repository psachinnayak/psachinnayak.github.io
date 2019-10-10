(function () {

    var sampleData = {
        initial_easy1: [[3, 0, 6, 5, 0, 8, 4, 0, 0], [5, 2, 0, 0, 0, 0, 0, 0, 0], [0, 8, 7, 0, 0, 0, 0, 3, 1], [0, 0, 3, 0, 1, 0, 0, 8, 0], [9, 0, 0, 8, 6, 3, 0, 0, 5], [0, 5, 0, 0, 9, 0, 6, 0, 0], [1, 3, 0, 0, 0, 0, 2, 5, 0], [0, 0, 0, 0, 0, 0, 0, 7, 4], [0, 0, 5, 2, 0, 6, 3, 0, 0]],

        initial_easy2: [[5, 4, 0, 0, 6, 0, 0, 7, 8], [3, 0, 6, 1, 8, 0, 0, 2, 0], [0, 9, 2, 0, 0, 4, 5, 0, 0], [6, 0, 9, 0, 0, 0, 7, 0, 5], [7, 1, 0, 4, 9, 6, 0, 0, 0], [4, 0, 8, 0, 0, 3, 1, 0, 0], [0, 0, 0, 0, 3, 0, 9, 0, 0], [1, 8, 0, 0, 0, 0, 2, 5, 7], [9, 5, 0, 0, 2, 7, 0, 0, 0]],

        initial_medium1: [[0, 0, 3, 0, 0, 0, 0, 0, 0], [0, 6, 0, 1, 3, 0, 2, 0, 0], [7, 0, 0, 9, 0, 5, 0, 1, 0], [0, 7, 0, 0, 0, 0, 1, 9, 6], [8, 2, 0, 0, 0, 0, 7, 0, 0], [0, 4, 0, 0, 0, 1, 0, 3, 2], [0, 9, 6, 0, 0, 4, 0, 7, 8], [0, 0, 0, 0, 0, 0, 0, 0, 0], [5, 0, 8, 0, 6, 0, 4, 0, 9]],
        initial_medium2: [[0, 8, 2, 3, 0, 6, 7, 0, 0], [0, 6, 0, 0, 0, 0, 0, 0, 2], [0, 3, 0, 2, 0, 4, 1, 0, 0], [4, 0, 0, 8, 3, 0, 2, 0, 0], [0, 0, 5, 0, 0, 0, 9, 0, 4], [0, 0, 0, 0, 4, 0, 6, 0, 0], [0, 0, 0, 0, 1, 0, 3, 7, 0], [0, 5, 0, 0, 6, 0, 0, 2, 9], [7, 0, 0, 0, 2, 0, 0, 0, 1]],
        initial_medium3: [[2, 4, 0, 0, 0, 0, 0, 1, 0], [6, 0, 0, 0, 0, 5, 0, 3, 0], [0, 3, 0, 4, 0, 0, 0, 5, 8], [0, 0, 0, 8, 0, 0, 0, 0, 0], [7, 0, 0, 3, 0, 0, 5, 0, 0], [0, 1, 0, 0, 5, 0, 7, 4, 0], [1, 2, 6, 0, 0, 8, 0, 0, 4], [0, 0, 0, 0, 0, 0, 8, 0, 0], [5, 0, 3, 7, 0, 0, 1, 2, 9]],
        initial_medium4: [[0, 7, 0, 0, 8, 0, 0, 0, 0], [0, 0, 0, 0, 0, 9, 0, 7, 2], [9, 0, 5, 0, 2, 4, 0, 0, 1], [0, 0, 2, 5, 0, 0, 0, 0, 0], [0, 0, 7, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 8, 9, 0, 0], [6, 0, 0, 8, 7, 0, 5, 0, 4], [8, 2, 0, 6, 0, 0, 0, 0, 0], [0, 0, 0, 0, 4, 0, 0, 8, 0]],
        initial_hard1: [[0, 1, 0, 0, 0, 0, 0, 0, 0], [6, 8, 7, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 9, 7, 0, 0, 3], [0, 0, 0, 0, 0, 0, 0, 0, 0], [7, 0, 0, 0, 0, 0, 3, 4, 0], [0, 4, 0, 9, 2, 6, 0, 0, 0], [0, 0, 9, 6, 0, 5, 0, 0, 2], [0, 0, 2, 0, 3, 0, 0, 0, 0], [5, 0, 0, 0, 1, 9, 7, 0, 0]],

        initial_expert1: [[0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 7, 0, 0, 0, 5, 0], [6, 0, 0, 8, 9, 0, 0, 0, 3], [5, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 4, 1, 0, 0], [0, 0, 4, 0, 0, 3, 0, 6, 8], [0, 6, 0, 0, 3, 0, 0, 0, 9], [8, 0, 5, 0, 0, 2, 7, 0, 0], [0, 0, 1, 0, 0, 0, 6, 0, 5]], initial_hard2: [[0, 0, 0, 0, 7, 2, 5, 0, 0], [0, 7, 0, 8, 0, 1, 0, 0, 0], [6, 3, 0, 0, 0, 0, 8, 2, 0], [0, 0, 0, 0, 5, 7, 4, 0, 0], [7, 0, 0, 0, 9, 0, 0, 0, 0], [0, 0, 9, 2, 8, 0, 0, 5, 0], [0, 0, 6, 0, 0, 0, 0, 0, 0], [4, 0, 2, 0, 0, 0, 0, 8, 0], [0, 0, 0, 0, 0, 5, 9, 0, 0]], initial_expert2: [[8, 0, 0, 0, 0, 0, 9, 0, 0], [0, 0, 0, 0, 9, 5, 6, 0, 0], [7, 0, 1, 0, 6, 0, 0, 0, 0], [5, 0, 0, 3, 0, 0, 0, 7, 0], [0, 3, 0, 0, 0, 8, 0, 0, 2], [0, 0, 0, 0, 0, 4, 0, 3, 0], [0, 0, 0, 0, 0, 6, 0, 9, 0], [0, 0, 0, 0, 0, 0, 0, 0, 5], [1, 0, 8, 4, 0, 0, 0, 0, 0]]
    };
    var dropDown = document.getElementById('slctInitialData');
    var txtInitialValues = document.getElementById("txtInitialValues");
    var btnLoadInitialData = document.getElementById('btnLoadInitialData');
    dropDown.addEventListener("change", function () {
        if (dropDown.value != "initial_custom") {
            txtInitialValues.innerText = JSON.stringify(sampleData[dropDown.value]);
        }
    });
    txtInitialValues.innerText = JSON.stringify(sampleData[dropDown.value]);

    btnLoadInitialData.addEventListener('click', function () {
        // debugger;
        var data = JSON.parse(txtInitialValues.value);
        ReactDOM.render(React.createElement(SudokuBoard, { initial_values: data }), document.getElementById('root'));
    });
})();