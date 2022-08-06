"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 26:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPaginationOptions = void 0;
const constants_1 = __webpack_require__(27);
const getPaginationOptions = (page = {
    currentPage: constants_1.defaultPaginationParams.currentPage,
    pageSize: constants_1.defaultPaginationParams.pageSize,
}) => {
    console.info(page, 'fdfdfdffdffddf');
    const limit = page.pageSize > constants_1.MAX_PAGE_SIZE ? constants_1.MAX_PAGE_SIZE : page.pageSize;
    const options = {
        page: page.currentPage,
        limit,
        metaTransformer: (meta) => {
            return new CustomPaginationMeta(meta.itemCount, meta.totalItems, meta.totalPages, meta.currentPage);
        },
    };
    return options;
};
exports.getPaginationOptions = getPaginationOptions;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("58c0998c11ed9a7cfe0d")
/******/ })();
/******/ 
/******/ }
;