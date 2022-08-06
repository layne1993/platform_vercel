"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 26:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPaginationOptions = exports.CustomPaginationMeta = void 0;
const constants_1 = __webpack_require__(27);
class CustomPaginationMeta {
    constructor(pageSize, totalCounts, totalPages, currentPage) {
        this.pageSize = pageSize;
        this.totalCounts = totalCounts;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
    }
}
exports.CustomPaginationMeta = CustomPaginationMeta;
const getPaginationOptions = (page = {
    currentPage: constants_1.defaultPaginationParams.currentPage,
    pageSize: constants_1.defaultPaginationParams.pageSize,
}) => {
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
/******/ 	__webpack_require__.h = () => ("41b18f0adbd3fe5fcefb")
/******/ })();
/******/ 
/******/ }
;