"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 36:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseProviders = void 0;
const typeorm_1 = __webpack_require__(23);
const naming_strategies_1 = __webpack_require__(37);
const user_mysql_entity_1 = __webpack_require__(31);
const utils_1 = __webpack_require__(10);
const goods_mysql_entity_1 = __webpack_require__(74);
const { MYSQL_CONFIG } = (0, utils_1.getConfig)();
const MYSQL_DATABASE_CONFIG = Object.assign(Object.assign({}, MYSQL_CONFIG), { NamedNodeMap: new naming_strategies_1.NamingStrategy(), entities: [user_mysql_entity_1.User, goods_mysql_entity_1.Goods] });
const MYSQL_DATA_SOURCE = new typeorm_1.DataSource(MYSQL_DATABASE_CONFIG);
exports.DatabaseProviders = [
    {
        provide: 'MYSQL_DATA_SOURCE',
        useFactory: async () => {
            if (!MYSQL_DATA_SOURCE.isInitialized)
                await MYSQL_DATA_SOURCE.initialize();
            return MYSQL_DATA_SOURCE;
        },
    },
];


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("df668105371c45fe5352")
/******/ })();
/******/ 
/******/ }
;