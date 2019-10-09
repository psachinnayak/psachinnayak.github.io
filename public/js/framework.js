var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Framework = function () {
    function Framework() {
        _classCallCheck(this, Framework);
    }

    _createClass(Framework, null, [{
        key: "_id",
        value: function _id(id) {
            return document.getElementById(id);
        }
    }, {
        key: "_class",
        value: function _class(clsName) {
            return document.getElementsByClassName(clsName);
        }
    }, {
        key: "_listen",
        value: function _listen(context, event, func) {
            context.addEventListener(event, func);
        }
    }, {
        key: "_create",
        value: function _create(tagName) {
            var txt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            var tag = document.createElement(tagName);
            if (txt) {
                txt = document.createTextNode(txt);
                tag.appendChild(txt);
            }
            return tag;
        }
    }]);

    return Framework;
}();

window["Fwk"] = Framework;