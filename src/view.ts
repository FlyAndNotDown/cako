import { CakoController } from './controller';
import { CakoModel } from './model';
import * as KoaRouter from 'koa-router';

export interface CakoViewConfig {
    /**
     * public url prefix
     * 
     * for example, if the public url prefix is `/blog` and a controller url is `/home`,
     * the url which server will listen is `/blog/home`
     */
    publicUrlPrefix?: string
}

export const defaultCakoViewConfig = {
    publicUrlPrefix: ''
};

export class CakoView {
    private config: CakoViewConfig;

    private model: CakoModel;
    private controller: CakoController;
    private router: KoaRouter;

    constructor(
        config: CakoViewConfig,
        model: CakoModel,
        controller: CakoController,
        router: KoaRouter
    ) {
        this.config = config;
        this.model = model;
        this.controller = controller;
        this.router = router;
    }

    public load(): void {
        const database = this.model.getDatabase();
        const models = this.model.getModels();
        this.controller.getControllers().forEach(define => {
            if (define.get) {
                this.router.get(define.url, define.get(database, models));
            }
            if (define.post) {
                this.router.get(define.url, define.post(database, models));
            }
            if (define.put) {
                this.router.put(define.url, define.put(database, models));
            }
            if (define.delete) {
                this.router.delete(define.url, define.delete(database, models));
            }
        });
    }
}