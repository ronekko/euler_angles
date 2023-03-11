"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function formatNumber(number) {
  var fixed_point = number.toFixed(2);
  var sign_corrected = fixed_point == "-0.00" ? "0.00" : fixed_point;
  return sign_corrected.replace(/.00$/, ""); // If integer then remove fractional portion.
}

function radToFormattedDeg(angle_rad) {
  var angle_deg = 180.0 * angle_rad / Math.PI;
  return formatNumber(angle_deg);
}

function degToRad(angle_deg) {
  return Math.PI * Number(angle_deg) / 180.0;
}

var EulerAngles = function (_React$Component) {
  _inherits(EulerAngles, _React$Component);

  function EulerAngles(props) {
    _classCallCheck(this, EulerAngles);

    var _this = _possibleConstructorReturn(this, (EulerAngles.__proto__ || Object.getPrototypeOf(EulerAngles)).call(this, props));

    _this.handleChangeA = function (event) {
      _this.setState({ value: event.target.value });

      var order = _this.props.order.toUpperCase();
      var frame = _this.props.frame;
      var a_rad = degToRad(event.currentTarget.value);
      if (isNaN(a_rad) == false) {
        var euler_angles = frame.rotation.reorder(order);
        var b_rad = euler_angles.y;
        var c_rad = euler_angles.z;
        frame.rotation.set(a_rad, b_rad, c_rad, order);
      }
    };

    _this.handleChangeB = function (event) {
      _this.setState({ value: event.target.value });

      var order = _this.props.order.toUpperCase();
      var frame = _this.props.frame;
      var b_rad = degToRad(event.currentTarget.value);
      if (isNaN(b_rad) == false) {
        var euler_angles = frame.rotation.reorder(order);
        var a_rad = euler_angles.x;
        var c_rad = euler_angles.z;
        frame.rotation.set(a_rad, b_rad, c_rad, order);
      }
    };

    _this.handleChangeC = function (event) {
      _this.setState({ value: event.target.value });

      var order = _this.props.order.toUpperCase();
      var frame = _this.props.frame;
      var c_rad = degToRad(event.currentTarget.value);
      if (isNaN(c_rad) == false) {
        var euler_angles = frame.rotation.reorder(order);
        var a_rad = euler_angles.x;
        var b_rad = euler_angles.y;
        frame.rotation.set(a_rad, b_rad, c_rad, order);
      }
    };

    _this.frame = props.frame;
    return _this;
  }

  _createClass(EulerAngles, [{
    key: "render",
    value: function render() {
      var order = this.props.order.toLowerCase();
      var euler_angles = this.props.frame.rotation.clone().reorder(order.toUpperCase());
      var a = radToFormattedDeg(euler_angles.x);
      var b = radToFormattedDeg(euler_angles.y);
      var c = radToFormattedDeg(euler_angles.z);

      return React.createElement(
        "div",
        { className: "euler-angles" },
        React.createElement(
          "span",
          null,
          "Intrinsic-",
          order.toUpperCase(),
          ": ",
          "(" + a + "_deg, " + b + "_deg, " + c + "_deg)"
        ),
        React.createElement(
          "p",
          null,
          React.createElement(
            "label",
            null,
            "A:",
            React.createElement("input", { type: "number", value: a, onChange: this.handleChangeA })
          ),
          React.createElement(
            "label",
            null,
            "B:",
            React.createElement("input", { type: "number", value: b, onChange: this.handleChangeB })
          ),
          React.createElement(
            "label",
            null,
            "C:",
            React.createElement("input", { type: "number", value: c, onChange: this.handleChangeC })
          )
        )
      );
    }
  }]);

  return EulerAngles;
}(React.Component);