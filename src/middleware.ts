import { Middleware } from 'koa';
import * as Koa from 'koa';

export interface CakoMiddlewareConfig {}

export interface CakoMiddlewareProxy {
    (): Middleware
}

export const defaultCakoMiddlewareConfig = {};

export class CakoMiddleware {
    private config: CakoMiddlewareConfig;
    private middlewares: CakoMiddlewareProxy[];
    private server: Koa;

    constructor(config: CakoMiddlewareConfig, server: Koa) {
        this.config = config;
        this.server = server;
        this.middlewares = [];
    }

    public getMiddlewares(): CakoMiddlewareProxy[] {
        return this.middlewares;
    }

    public defineMiddleware(middlewareDefine: CakoMiddlewareProxy): void {
        this.middlewares.push(middlewareDefine);
    }

    public load(): void {
        this.middlewares.forEach(cakoMiddleware => {
            return this.server.use(cakoMiddleware());
        });
    }
}