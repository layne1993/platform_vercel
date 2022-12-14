"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const fastify_1 = require("fastify");
const app_module_1 = require("./app.module");
const base_exception_filter_1 = require("./common/exceptions/base.exception.filter");
const http_exception_filter_1 = require("./common/exceptions/http.exception.filter");
const logger_1 = require("./common/logger");
const doc_1 = require("./doc");
const cookieParser = require("cookie-parser");
const cookie_1 = require("@fastify/cookie");
const catchError_1 = require("./common/logger/catchError");
(0, catchError_1.catchError)();
async function bootstrap() {
    const fastifyInstance = (0, fastify_1.default)({
        logger: logger_1.FastifyLogger,
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter(fastifyInstance));
    app.register(cookie_1.default, {
        secret: 'my-secret',
    });
    app.useGlobalFilters(new base_exception_filter_1.AllExceptionsFilter(), new http_exception_filter_1.HttpExceptionFilter());
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    (0, doc_1.generateDocument)(app);
    await app.listen(3000);
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
//# sourceMappingURL=main.js.map