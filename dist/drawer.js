var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import { Motion, spring } from "react-motion";
import Hammer from "react-hammerjs";
import assign from "1-liners/assign";
import isFunction from "1-liners/isFunction";
import styles from "./styles";

var bool = PropTypes.bool,
    number = PropTypes.number,
    array = PropTypes.array,
    object = PropTypes.object,
    string = PropTypes.string,
    func = PropTypes.func,
    oneOfType = PropTypes.oneOfType;

var Drawer = function (_React$Component) {
  _inherits(Drawer, _React$Component);

  function Drawer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Drawer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Drawer.__proto__ || Object.getPrototypeOf(Drawer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      currentState: "CLOSED"
    }, _this.isState = function (s) {
      return s === _this.state.currentState;
    }, _this.isClosed = function () {
      return _this.isState("CLOSED");
    }, _this.isOpen = function () {
      return _this.isState("OPEN");
    }, _this.isOpening = function () {
      return _this.isState("IS_OPENING");
    }, _this.isClosing = function () {
      return _this.isState("IS_CLOSING");
    }, _this.onPress = function (e) {
      if (_this.props.noTouchOpen) return;
      e.preventDefault();
      _this.peak();
    }, _this.onPressUp = function (e) {
      e.preventDefault();
      _this.close();
    }, _this.onPan = function (e) {
      if (_this.isClosed() && _this.props.noTouchOpen) return;
      if (_this.isOpen() && _this.props.noTouchClose) return;
      e.preventDefault();

      var isFinal = e.isFinal,
          pointers = e.pointers,
          direction = e.direction,
          deltaX = e.deltaX;

      if (_this.inPanTolerance(deltaX)) return;

      if (isFinal) {
        if (_this.isOpening()) _this.open();else if (_this.isClosing()) _this.close();
        return;
      }

      var currentState = _this.state.currentState;
      var _this$props = _this.props,
          right = _this$props.right,
          peakingWidth = _this$props.peakingWidth,
          handleWidth = _this$props.handleWidth;

      var _this$calculateWidth = _this.calculateWidth(),
          width = _this$calculateWidth.width;

      var clientX = pointers[0].clientX;


      var x = right ? document.body.clientWidth - clientX : clientX;

      if (x + peakingWidth >= width) x = width - peakingWidth;

      var closingOrOpening = _this.closingOrOpening(direction);
      var nextState = {
        PEAK: closingOrOpening,
        IS_OPENING: closingOrOpening,
        IS_CLOSING: closingOrOpening,
        OPEN: "IS_CLOSING",
        CLOSED: "PEAK"
      };

      _this.setState({
        currentState: nextState[currentState],
        x: _this.isClosed() ? peakingWidth : peakingWidth / 2 + x
      });
    }, _this.onOverlayTap = function (e) {
      e.preventDefault();
      if (_this.isOpen()) _this.close();
    }, _this.calculateWidth = function () {
      var width = _this.props.width;
      return (/\D/.test(width) ? document.body.clientWidth * (width.match(/\d*/) / 100) : width
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Drawer, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var open = this.props.open;
      var nextOpen = nextProps.open;


      if (nextOpen !== open) {
        if (nextOpen) this.open();else this.close();
      }
    }
  }, {
    key: "peak",
    value: function peak() {
      var _props = this.props,
          onChange = _props.onChange,
          handleWidth = _props.handleWidth;

      onChange(false);
      return this.setState({ currentState: "PEAK", x: handleWidth });
    }
  }, {
    key: "close",
    value: function close() {
      this.props.onChange(false);
      return this.setState({ currentState: "CLOSED", x: 0 });
    }
  }, {
    key: "open",
    value: function open() {
      var _props2 = this.props,
          onChange = _props2.onChange,
          width = _props2.width;

      onChange(true);

      return this.setState({ currentState: "OPEN", x: this.calculateWidth() });
    }
  }, {
    key: "isClosingDirection",
    value: function isClosingDirection(direction) {
      var right = this.props.right;

      var isClosing = direction === 2;

      if (right) return !isClosing;else return isClosing;
    }
  }, {
    key: "closingOrOpening",
    value: function closingOrOpening(direction) {
      return this.isClosingDirection(direction) ? "IS_CLOSING" : "IS_OPENING";
    }
  }, {
    key: "inPanTolerance",
    value: function inPanTolerance(deltaX) {
      var currentState = this.state.currentState;
      var panTolerance = this.props.panTolerance;


      return Math.abs(deltaX) <= panTolerance && currentState === "OPEN";
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          config = _props3.config,
          drawerStyle = _props3.drawerStyle,
          className = _props3.className,
          overlayClassName = _props3.overlayClassName,
          width = _props3.width,
          children = _props3.children,
          offset = _props3.offset;
      var _state = this.state,
          currentState = _state.currentState,
          x = _state.x;


      return React.createElement(
        Motion,
        {
          style: {
            myProp: spring(Math.min(x + offset || 0, this.calculateWidth()), config)
          }
        },
        function (interpolated) {
          var _styles = styles(interpolated.myProp, _this2.props),
              drawer = _styles.drawer,
              transform = _styles.transform,
              overlay = _styles.overlay;

          var computedStyle = assign(drawer, drawerStyle);
          if (interpolated.myProp > 0) computedStyle.display = "block";else computedStyle.display = "none";

          return React.createElement(
            "div",
            { style: transform },
            React.createElement(
              Hammer,
              {
                onPress: _this2.onPress,
                onPressUp: _this2.onPressUp,
                onPan: _this2.onPan,
                direction: Hammer.DIRECTION_HORIZONTAL
              },
              React.createElement(
                "div",
                { className: className, style: computedStyle },
                isFunction(children) ? children(interpolated.myProp) : children,
                !_this2.isClosed() && React.createElement(
                  Hammer,
                  {
                    style: overlay,
                    className: overlayClassName,
                    onTap: _this2.onOverlayTap
                  },
                  React.createElement("span", null)
                )
              )
            )
          );
        }
      );
    }
  }]);

  return Drawer;
}(React.Component);

Drawer.propTypes = {
  zIndex: number, // z-index of the drawer default is 10000
  noTouchOpen: bool, // can a user pan to open
  noTouchClose: bool, // can a user pan to close
  onChange: func, // called when the drawer is open
  drawerStyle: object, // additional drawer styles
  className: string, // additional drawer className
  overlayClassName: string, // additional overlay className
  config: array, // configuration of the react-motion animation
  open: bool, // states if the drawer is open
  width: oneOfType([number, string]), // width of the drawer
  height: oneOfType([number, string]), // height of the drawer
  handleWidth: number, // width of the handle
  peakingWidth: number, // width that the drawer peaks on press
  panTolerance: number, // tolerance until the drawer starts to move
  right: bool, // drawer on the right side of the screen
  overlayColor: string, // color of the overlay
  fadeOut: bool, // fade out
  offset: number // offset
};
Drawer.defaultProps = {
  zIndex: 10000,
  noTouchOpen: false,
  noTouchClose: false,
  onChange: function onChange() {},
  overlayColor: "rgba(0, 0, 0, 0.4)",
  config: [350, 40],
  open: false,
  width: 300,
  height: "100%",
  handleWidth: 20,
  peakingWidth: 50,
  panTolerance: 50,
  right: false,
  fadeOut: false,
  offset: 0
};
export default Drawer;