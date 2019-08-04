import { CakoViewConfig, defaultCakoViewConfig } from './view';
import { CakoController, defaultCakoControllerConfig, CakoControllerConfig, CakoControllerDefine } from './controller';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { CakoView } from './view';
import { CakoModel, CakoModelConfig, defaultCakoModelConfig, CakoModelDefine, CakoRelationDefine, CakoModels } from './model';
import * as extend from 'extend';
import { defaultCakoMiddlewareConfig, CakoMiddlewareConfig, CakoMiddleware, CakoMiddlewareProxy } from './middleware';

export interface CakoServerConfig {
    /**
     * http listen port
     */
    port: number
}

export interface CakoConfig {
    /**
     * cako model config
     */
    model?: CakoModelConfig,

    /**
     * cako controller config
     */
    controller?: CakoControllerConfig,

    /**
     * cako view config
     */
    view?: CakoViewConfig,

    /**
     * cako server config
     */
    server?: CakoServerConfig,

    /**
     * cako middleware config
     */
    middleware: CakoMiddlewareConfig
}

const defaultCakoServerConfig: CakoServerConfig = {
    port: 25000
};

const defaultCakoConfig: CakoConfig = {
    model: defaultCakoModelConfig,
    controller: defaultCakoControllerConfig,
    view: defaultCakoViewConfig,
    server: defaultCakoServerConfig,
    middleware: defaultCakoMiddlewareConfig
};

export class Cako {
    private config: CakoConfig;

    private server: Koa;
    private router: KoaRouter;
    
    private model: CakoModel;
    private controller: CakoController;
    private middleware: CakoMiddleware;
    private view: CakoView;

    /**
     * constructor of Cako class
     * 
     * ```javascript
     * const cako = new Cako();
     * const cako = new Cako(config);
     * ```
     * 
     * where `config` is a `CakoConfig` object
     * @param config 
     */
    constructor(config?: CakoConfig) {
        this.server = null;
        this.router = null;

        if (config) {
            this.config = defaultCakoConfig;
            this.config = extend(true, this.config, config);
        } else {
            this.config = defaultCakoConfig;
        }

        this.server = new Koa();
        this.router = new KoaRouter();
        this.model = new CakoModel(this.config.model);
        this.controller = new CakoController(this.config.controller);
        this.middleware = new CakoMiddleware(this.config.middleware, this.server);
        this.view = new CakoView(this.config.view, this.model, this.controller, this.router);
    }

    private init(): Cako {
        return this;
    }

    private loadModel(): Cako {
        this.model.load();
        return this;
    }

    private loadController(): Cako {
        this.controller.load();
        return this;
    }

    private loadMiddleware(): Cako {
        this.middleware.load();
        return this;
    }

    private loadView(): Cako {
        this.view.load();
        this.server.use(this.router.routes());
        return this;
    }

    private listen(): Cako {
        this.server.listen(this.config.server.port);
        console.log('cako > server is running ......');
        console.log(`cako > working port is ${this.config.server.port}`);
        return this;
    }

    /**
     * define a new model
     * 
     * ```javascript
     * cako.defineModel(modelDefine);
     * ```
     * 
     * where `modelDefine` is a `CakoModelDefine` object
     * @param modelDefine model define object
     * @returns this `Cako` instance
     */
    public defineModel(modelDefine: CakoModelDefine): Cako {
        this.model.defineModel(modelDefine);
        return this;
    }

    /**
     * define a new relation between models
     * 
     * ```javascript
     * cako.defineRelation(relationDefine);
     * ```
     * 
     * where `relationDefine` is a `CakoRelationDefine` object
     * @param relationDefine relation define object
     * @returns this `Cako` instance
     */
    public defineRelation(relationDefine: CakoRelationDefine): Cako {
        this.model.defineRelation(relationDefine);
        return this;
    }

    /**
     * usage:
     * ```javascript
     * cako.defineController({
     *      url: '/home',
     *      get: (database, models) => {
     *          return async (context, next) => {
     *              await next();
     * 
     *              // ......
     *          } 
     *      },
     *      // post: ...
     * });
     * ```
     * 
     * where `controllerDefine` is a `CakoControllerDefine` object
     * @param controllerDefine controller define object
     * @returns this `Cako` instance
     */
    public defineController(controllerDefine: CakoControllerDefine): Cako {
        this.controller.defineController(controllerDefine);
        return this;
    }

    /**
     * usage:
     * ```javascript
     * cako.defineMiddleware(() => {
     *      return // ... koa middleware
     * });
     * ```
     * @param middlewareDefine middleware define proxy
     * @returns this `Cako` instance
     */
    public defineMiddleware(middlewareDefine: CakoMiddlewareProxy): Cako {
        this.middleware.defineMiddleware(middlewareDefine);
        return this;
    }

    /**
     * start cako server
     * 
     * ```javascript
     * cako.start();
     * ```
     * @returns this `Cako` instance
     */
    public start(): Cako {
        return this
            .init()
            .loadModel()
            .loadMiddleware()
            .loadController()
            .loadView()
            .listen();
    }

    /**
     * do not start server ,just sync the database
     * 
     * ```javascript
     * cako.sync(true);
     * ```
     */
    public sync(force: boolean): never {
        this.loadModel();
        this.model.sync(force);
        return process.exit(0);
    }
}