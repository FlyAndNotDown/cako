import { CakoModels } from './model';
import { Sequelize } from "sequelize/types";
import { Context } from 'koa';

export interface CakoControllerConfig {}

export interface CakoControllerProxy {
    (database: Sequelize, models: CakoModels): CakoControllerDo
}

export interface CakoControllerDo {
    (context: Context, next: Function): any
}

export const defaultCakoControllerConfig = {};

export interface CakoControllerDefine {
    /**
     * url which controller listen
     */
    url: string,

    /**
     * proxy called when server get a new `get` request
     */
    get?: CakoControllerProxy,

    /**
     * proxy called when server get a new `post` request
     */
    post?: CakoControllerProxy,

    /**
     * proxy called when server get a new `put` request
     */
    put?: CakoControllerProxy,

    /**
     * proxy called when server get a new `delete` request
     */
    delete?: CakoControllerProxy
}

export class CakoController {
    private config: CakoControllerConfig;
    private controllers: CakoControllerDefine[];

    constructor(config: CakoControllerConfig) {
        this.config = config;
        this.controllers = [];
    }

    public getControllers(): CakoControllerDefine[] {
        return this.controllers;
    }

    public defineController(controllerDefine: CakoControllerDefine): void {
        this.controllers.push(controllerDefine);
    }

    public load(): void {}
}