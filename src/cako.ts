import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import { Sequelize, Options } from 'sequelize';
import { CakoModel, CakoModelConfig } from './model';

export interface CakoConfig {
    model?: CakoModelConfig
}

const defaultCakoConfig: CakoConfig = {
    model: {
        useModel: false
    }
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
            this.config = config;
        } else {

        }
    }

    private init(): void {
        this.server = new Koa();
        this.router = new KoaRouter();
    }

    private loadModel(): void {
        
    }
}