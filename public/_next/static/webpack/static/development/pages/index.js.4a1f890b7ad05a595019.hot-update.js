webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/browsing/lumesectionBroweser.tsx":
/*!*****************************************************!*\
  !*** ./components/browsing/lumesectionBroweser.tsx ***!
  \*****************************************************/
/*! exports provided: LumesectionBrowser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LumesectionBrowser", function() { return LumesectionBrowser; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/index.js");
/* harmony import */ var _ant_design_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ant-design/icons */ "./node_modules/@ant-design/icons/es/index.js");
/* harmony import */ var _hooks_useRequest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useRequest */ "./hooks/useRequest.tsx");
/* harmony import */ var _config_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../config/config */ "./config/config.ts");
/* harmony import */ var _viewDetailsMenu_styledComponents__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../viewDetailsMenu/styledComponents */ "./components/viewDetailsMenu/styledComponents.tsx");
/* harmony import */ var _styledComponents__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styledComponents */ "./components/styledComponents.ts");
/* harmony import */ var _hooks_useChangeRouter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useChangeRouter */ "./hooks/useChangeRouter.tsx");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/router */ "./node_modules/next/dist/client/router.js");
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_8__);
var _this = undefined,
    _jsxFileName = "/mnt/c/Users/ernes/Desktop/test/dqmgui_frontend/components/browsing/lumesectionBroweser.tsx";

var __jsx = react__WEBPACK_IMPORTED_MODULE_0__["createElement"];









var Option = antd__WEBPACK_IMPORTED_MODULE_1__["Select"].Option;
var LumesectionBrowser = function LumesectionBrowser(_ref) {
  var color = _ref.color,
      currentLumisection = _ref.currentLumisection,
      handler = _ref.handler,
      currentRunNumber = _ref.currentRunNumber,
      currentDataset = _ref.currentDataset;

  //getting all run lumisections 
  var _useRequest = Object(_hooks_useRequest__WEBPACK_IMPORTED_MODULE_3__["useRequest"])(Object(_config_config__WEBPACK_IMPORTED_MODULE_4__["getLumisections"])({
    run_number: currentRunNumber,
    dataset_name: currentDataset,
    lumi: -1
  }), {}, [currentRunNumber, currentDataset]),
      data = _useRequest.data,
      isLoading = _useRequest.isLoading,
      errors = _useRequest.errors;

  var router = Object(next_router__WEBPACK_IMPORTED_MODULE_8__["useRouter"])();
  var query = router.query;
  var all_runs_with_lumi = data ? data.data : []; //extracting just lumisections from data object

  var lumisections = all_runs_with_lumi.length > 0 ? all_runs_with_lumi.map(function (run) {
    return run.lumi;
  }) : []; //-1 - it represents ALL lumisections. If none lumisection is selected, then plots which are displaid 
  //consist of ALL lumisections. 
  //*TO DO** change -1 to ALL

  lumisections.unshift(-1); //if lumisection is not setted to url, we set lumisection to -1

  Object(_hooks_useChangeRouter__WEBPACK_IMPORTED_MODULE_7__["useChangeRouter"])({
    lumi: lumisections[0]
  }, [], !query.lumi);
  var currentLumiIndex = lumisections.indexOf(currentLumisection);
  return __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Col"], {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 54,
      columnNumber: 5
    }
  }, __jsx(_styledComponents__WEBPACK_IMPORTED_MODULE_6__["StyledFormItem"], {
    labelcolor: color,
    name: 'lumi',
    label: "Lumi",
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 55,
      columnNumber: 7
    }
  }, __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Row"], {
    justify: "center",
    align: "middle",
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56,
      columnNumber: 9
    }
  }, __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Col"], {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57,
      columnNumber: 11
    }
  }, __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    disabled: !lumisections[currentLumiIndex - 1],
    icon: __jsx(_ant_design_icons__WEBPACK_IMPORTED_MODULE_2__["CaretLeftFilled"], {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 60,
        columnNumber: 21
      }
    }),
    type: "link",
    onClick: function onClick() {
      handler(lumisections[currentLumiIndex - 1]);
    },
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58,
      columnNumber: 13
    }
  })), __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Col"], {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68,
      columnNumber: 11
    }
  }, __jsx(_viewDetailsMenu_styledComponents__WEBPACK_IMPORTED_MODULE_5__["StyledSelect"], {
    dropdownMatchSelectWidth: false,
    value: currentLumisection,
    onChange: function onChange(e) {
      handler(parseInt(e));
    },
    showSearch: true,
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 69,
      columnNumber: 13
    }
  }, lumisections && lumisections.map(function (current_lumisection) {
    return __jsx(Option, {
      value: current_lumisection.toString(),
      key: current_lumisection.toString(),
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 79,
        columnNumber: 19
      }
    }, isLoading ? __jsx(_viewDetailsMenu_styledComponents__WEBPACK_IMPORTED_MODULE_5__["OptionParagraph"], {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 81,
        columnNumber: 23
      }
    }, __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Spin"], {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 82,
        columnNumber: 25
      }
    })) : __jsx("p", {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 85,
        columnNumber: 25
      }
    }, current_lumisection));
  }))), __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Col"], {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93,
      columnNumber: 11
    }
  }, __jsx(antd__WEBPACK_IMPORTED_MODULE_1__["Button"], {
    icon: __jsx(_ant_design_icons__WEBPACK_IMPORTED_MODULE_2__["CaretRightFilled"], {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 95,
        columnNumber: 21
      }
    }),
    disabled: !lumisections[currentLumiIndex + 1],
    type: "link",
    onClick: function onClick() {
      handler(lumisections[currentLumiIndex + 1]);
    },
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 94,
      columnNumber: 13
    }
  })))));
};

/***/ })

})
//# sourceMappingURL=index.js.4a1f890b7ad05a595019.hot-update.js.map