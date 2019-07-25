import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Sequelize, Options } from 'sequelize';
import { CakoModel, CakoModelConfig, defaultCakoModelConfig, CakoModelDefine, CakoRelationDefine } from './model';
import * as extend from 'extend';

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
     * cako server config
     */
    server?: CakoServerConfig
}

const defaultCakoServerConfig: CakoServerConfig = {
    port: 25000
};

const defaultCakoConfig: CakoConfig = {
    model: defaultCakoModelConfig,
    server: defaultCakoServerConfig
};

export class Cako {
    private config: CakoConfig;

    private server: Koa;
    private router: KoaRouter;
    
    private model: CakoModel;

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
    }

    private init(): Cako {
        this.server = new Koa();
        this.router = new KoaRouter();
        return this;
    }

    private loadModel(): Cako {
        this.model = new CakoModel(this.config.model);
        return this;
    }

    private listen(): Cako {
        this.server.listen(this.config.server.port);
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
            .listen();
    }
}