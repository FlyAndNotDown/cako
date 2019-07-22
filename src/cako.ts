import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Sequelize, Options } from 'sequelize';
import { CakoModel, CakoModelConfig, defaultCakoModelConfig, CakoModelDefine, CakoRelationDefine } from './model';

export interface CakoServerConfig {
    port: number
}

export interface CakoConfig {
    model?: CakoModelConfig,
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

    constructor(config?: CakoConfig) {
        this.server = null;
        this.router = null;
        if (config) {
            // TODO change it to 'deep copy'
            this.config = config;
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

    public defineModel(modelDefine: CakoModelDefine): Cako {
        this.model.defineModel(modelDefine);
        return this;
    }

    public defineRelation(relationDefine: CakoRelationDefine): Cako {
        this.model.defineRelation(relationDefine);
        return this;
    }

    public start(): Cako {
        return this
            .init()
            .loadModel()
            .listen();
    }
}