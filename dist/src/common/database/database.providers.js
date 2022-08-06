"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseProviders = void 0;
const naming_strategies_1 = require("./naming.strategies");
const user_mysql_entity_1 = require("../../userCenter/user/entities/user.mysql.entity");
const utils_1 = require("../../utils");
const typeorm_1 = require("typeorm");
const { MYSQL_CONFIG } = (0, utils_1.getConfig)();
const MYSQL_DATABASE_CONFIG = Object.assign(Object.assign({}, MYSQL_CONFIG), { NamedNodeMap: new naming_strategies_1.NamingStrategy(), entities: [user_mysql_entity_1.User] });
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
//# sourceMappingURL=database.providers.js.map