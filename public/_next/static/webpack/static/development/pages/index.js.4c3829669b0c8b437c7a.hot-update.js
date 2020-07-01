webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/plots/zoomedPlots/zoomedPlots/zoomedJSROOTPlot.tsx":
/*!***********************************************************************!*\
  !*** ./components/plots/zoomedPlots/zoomedPlots/zoomedJSROOTPlot.tsx ***!
  \***********************************************************************/
/*! exports provided: ZoomedJSROOTPlot */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ZoomedJSROOTPlot", function() { return ZoomedJSROOTPlot; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../config/config */ "./config/config.ts");
/* harmony import */ var _hooks_useRequest__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../hooks/useRequest */ "./hooks/useRequest.tsx");
/* harmony import */ var _containers_display_styledComponents__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../containers/display/styledComponents */ "./containers/display/styledComponents.tsx");
/* harmony import */ var _plot_singlePlot_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../plot/singlePlot/utils */ "./components/plots/plot/singlePlot/utils.ts");
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/index.js");


var _this = undefined,
    _jsxFileName = "/mnt/c/Users/ernes/Desktop/test/dqmgui_frontend/components/plots/zoomedPlots/zoomedPlots/zoomedJSROOTPlot.tsx";

var __jsx = react__WEBPACK_IMPORTED_MODULE_1___default.a.createElement;









var drawJSROOT = function drawJSROOT(query, data) {
  return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.async(function drawJSROOT$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.awrap(JSROOT.cleanup("".concat(selected_plot.name).concat(query.run_number).concat(query.lumi)));

        case 2:
          //@ts-ignore
          JSROOT.draw("".concat(selected_plot.name).concat(query.run_number).concat(query.lumi), JSROOT.parse(JSON.stringify(data)), 'hist');

        case 3:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, null, Promise);
};

var ZoomedJSROOTPlot = function ZoomedJSROOTPlot(_ref) {
  var selected_plot = _ref.selected_plot,
      params_for_api = _ref.params_for_api;
  var router = Object(next_router__WEBPACK_IMPORTED_MODULE_3__["useRouter"])();
  var query = router.query;

  var _useRequest = Object(_hooks_useRequest__WEBPACK_IMPORTED_MODULE_5__["useRequest"])(Object(_config_config__WEBPACK_IMPORTED_MODULE_4__["get_jroot_plot"])(params_for_api), {}, [selected_plot.name]),
      data = _useRequest.data;

  var Image = __jsx(_containers_display_styledComponents__WEBPACK_IMPORTED_MODULE_6__["ImageDiv"], {
    id: "".concat(selected_plot.name).concat(query.run_number).concat(query.lumi),
    width: params_for_api.width,
    height: params_for_api.height,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46,
      columnNumber: 17
    }
  });

  Object(react__WEBPACK_IMPORTED_MODULE_1__["useEffect"])(function () {
    console.log('ss'); //@ts-ignore

    react_dom__WEBPACK_IMPORTED_MODULE_2___default.a.render(Image, document.getElementById(selected_plot.name));
    drawJSROOT(query, data);
  }, [data, params_for_api]);
  return __jsx(_containers_display_styledComponents__WEBPACK_IMPORTED_MODULE_6__["StyledCol"], {
    space: 2,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 62,
      columnNumber: 5
    }
  }, __jsx(_containers_display_styledComponents__WEBPACK_IMPORTED_MODULE_6__["StyledPlotRow"], {
    minheight: params_for_api.height,
    width: params_for_api.width,
    is_plot_selected: true.toString(),
    nopointer: true.toString(),
    id: selected_plot.name,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 63,
      columnNumber: 7
    }
  }, __jsx(_containers_display_styledComponents__WEBPACK_IMPORTED_MODULE_6__["PlotNameCol"], {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70,
      columnNumber: 9
    }
  }, selected_plot.name), __jsx(_containers_display_styledComponents__WEBPACK_IMPORTED_MODULE_6__["Column"], {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 71,
      columnNumber: 9
    }
  }, __jsx(antd__WEBPACK_IMPORTED_MODULE_8__["Button"], {
    type: "link",
    onClick: function onClick() {
      return Object(_plot_singlePlot_utils__WEBPACK_IMPORTED_MODULE_7__["removePlotFromRightSide"])(query, selected_plot);
    },
    icon: __jsx(_containers_display_styledComponents__WEBPACK_IMPORTED_MODULE_6__["MinusIcon"], {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 75,
        columnNumber: 19
      }
    }),
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 72,
      columnNumber: 11
    }
  }))));
};

/***/ })

})
//# sourceMappingURL=index.js.4c3829669b0c8b437c7a.hot-update.js.map