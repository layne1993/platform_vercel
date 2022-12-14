"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastifyLogger = void 0;
const path_1 = require("path");
const logger_1 = require("./logger");
const logOptions = {
    console: process.env.NODE_ENV !== 'production',
    level: 'info',
    serializers: {
        req: (req) => {
            return {
                method: req.method,
                url: req.url,
            };
        },
    },
    fileName: (0, path_1.join)(process.cwd(), 'logs/platform.log'),
    maxBufferLength: 4096,
    flushInterval: 1000,
    logRotator: {
        byHour: true,
        byDay: false,
        hourDelimiter: '_',
    },
};
exports.FastifyLogger = (0, logger_1.fastLogger)(logOptions);
//# sourceMappingURL=index.js.map