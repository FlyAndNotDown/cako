import { CakoViewConfig, defaultCakoViewConfig } from './view';
import { CakoController, defaultCakoControllerConfig, CakoControllerConfig, CakoControllerDefine } from './controller';
import * as Koa from 'koa';
import { Middleware } from 'koa';
import * as KoaRouter from 'koa-router';
import { CakoView } from './view';
import { CakoModel, CakoModelConfig, defaultCakoModelConfig, CakoModelDefine, CakoRelationDefine, CakoModels } from './model';
import * as extend from 'extend';
import { Sequelize } from 'sequelize/types';

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
}

export interface CakoLifeCycleFunction {
    (
        /**
         * koa object
         */
        server: Koa,

        /**
         * koa-router object
         */
        router: KoaRouter,

        /**
         * CakoModel object
         */
        modelLoader: CakoModel,

        /**
         * CakoController object
         */
        controllerLoader: CakoController
    ): void
}

export interface CakoLifeCycle {
    beforeLoadModel?: CakoLifeCycleFunction,
    beforeLoadController?: CakoLifeCycleFunction,
    beforeLoadView?: CakoLifeCycleFunction,
    beforeListen?: CakoLifeCycleFunction
}

const defaultCakoLifeCycle: CakoLifeCycle = {};

const defaultCakoServerConfig: CakoServerConfig = {
    port: 25000
};

const defaultCakoConfig: CakoConfig = {
    model: defaultCakoModelConfig,
    controller: defaultCakoControllerConfig,
    view: defaultCakoViewConfig,
    server: defaultCakoServerConfig
};

export class Cako {
    private config: CakoConfig;
    private lifeCycle: CakoLifeCycle;

    private server: Koa;
    private router: KoaRouter;
    
    private model: CakoModel;
    private controller: CakoController;
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

        this.lifeCycle = defaultCakoLifeCycle;
        this.server = new Koa();
        this.router = new KoaRouter();
        this.model = new CakoModel(this.config.model);
        this.controller = new CakoController(this.config.controller);
        this.view = new CakoView(this.config.view, this.model, this.controller, this.router);
    }

    private init(): Cako {
        return this;
    }

    private loadModel(): Cako {
        if (this.lifeCycle.beforeLoadModel) {
            this.lifeCycle.beforeLoadModel(this.server, this.router, this.model, this.controller);
        }

        this.model.load();
        return this;
    }

    private loadController(): Cako {
        if (this.lifeCycle.beforeLoadController) {
            this.lifeCycle.beforeLoadController(this.server, this.router, this.model, this.controller);
        }

        this.controller.load();
        return this;
    }

    private loadView(): Cako {
        if (this.lifeCycle.beforeLoadView) {
            this.lifeCycle.beforeLoadView(this.server, this.router, this.model, this.controller);
        }

        this.view.load();
        return this;
    }

    private listen(): Cako {
        if (this.lifeCycle.beforeListen) {
            this.lifeCycle.beforeListen(this.server, this.router, this.model, this.controller);
        }

        this.server.listen(this.config.server.port);
        console.log('cako > server is running ......');
        console.log(`cako > working port is ${this.config.server.port}`);
        return this;
    }

    /**
     * use life cycle function `beforeLoadModel`
     * 
     * for example:
     * ```javascript
     * cako.beforeLoadModel((server, router, modelLoader, controllerLoader) => {
     *      // do some thing
     * });
     * ```
     * @param lifeCycleFunc life cycle function
     * @returns this `Cako` instance
     */
    public beforeLoadModel(lifeCycleFunc: CakoLifeCycleFunction): Cako {
        this.lifeCycle.beforeLoadModel = lifeCycleFunc;
        return this;
    }

    /**
     * use life cycle function `beforeLoadController`
     * 
     * for example:
     * ```javascript
     * cako.beforeLoadController((server, router, modelLoader, controllerLoader) => {
     *      // do some thing
     * });
     * ```
     * @param lifeCycleFunc life cycle function
     * @returns this `Cako` instance
     */
    public beforeLoadController(lifeCycleFunc: CakoLifeCycleFunction): Cako {
        this.lifeCycle.beforeLoadController = lifeCycleFunc;
        return this;
    }

    /**
     * use life cycle function `beforeLoadView`
     * 
     * for example:
     * ```javascript
     * cako.beforeLoadView((server, router, modelLoader, controllerLoader) => {
     *      // do some thing
     * });
     * ```
     * @param lifeCycleFunc life cycle function
     * @returns this `Cako` instance
     */
    public beforeLoadView(lifeCycleFunc: CakoLifeCycleFunction): Cako {
        this.lifeCycle.beforeLoadView = lifeCycleFunc;
        return this;
    }

    /**
     * use life cycle function `beforeListen`
     * 
     * for example:
     * ```javascript
     * cako.beforeListen((server, router, modelLoader, controllerLoader) => {
     *      // do some thing
     * });
     * ```
     * @param lifeCycleFunc life cycle function
     * @returns this `Cako` instance
     */
    public beforeListen(lifeCycleFunc: CakoLifeCycleFunction): Cako {
        this.lifeCycle.beforeListen = lifeCycleFunc;
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
     * use koa middleware
     * @param middleware koa middleware
     * @returns this `Cako` instance
     */
    public useMiddleware(middleware: Middleware): Cako {
        this.server.use(middleware);
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
            .loadController()
            .loadView()
            .listen();
    }
}