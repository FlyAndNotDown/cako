import { Sequelize, Options, Model, ModelAttributes, ModelOptions, BuildOptions, HasManyOptions } from 'sequelize';

export interface CakoModelConfig {
    useModel?: boolean,
    database?: string,
    username?: string,
    password?: string,
    options?: Options
}

export interface CakoModelDefine {
    name: string,
    attributes: ModelAttributes,
    options?: ModelOptions
}

export interface CakoRelationDefineMany2ManyDescription {
    owner: string[],
    through?: string,
    extraAttributes?: ModelAttributes
}

export interface CakoRelationDefineOne2ManyDescription {
    owner: string,
    to: string,
    as?: string
}

export interface CakoRelationDefineHasOneDescription {
    owner: string,
    to: string,
    as?: string
}

export interface CakoRelationDefine {
    type: 'many2many' | 'one2many' | 'hasOne',
    description: CakoRelationDefineMany2ManyDescription | CakoRelationDefineOne2ManyDescription | CakoRelationDefineHasOneDescription
}

export interface CakoModels {
    [keyName: string]: AnyModel
}

export class AnyPropModel extends Model {
    [key: string]: any;
}

export type AnyModel = typeof Model & {
    new (values?: any, options?: BuildOptions): AnyPropModel;
}

export const defaultCakoModelConfig: CakoModelConfig = {
    useModel: false
}

export class CakoModel {
    private config: CakoModelConfig;
    private database: Sequelize;
    private models: CakoModels;
    
    constructor(config?: CakoModelConfig) {
        this.config = config;

        if (this.config.useModel) {
            if (this.config.database && this.config.username && this.config.password && this.config.options) {
                this.database = new Sequelize(
                    this.config.database,
                    this.config.username,
                    this.config.password,
                    this.config.options
                );
            } else if (this.config.database && this.config.username && this.config.options) {
                this.database = new Sequelize(
                    this.config.database,
                    this.config.username,
                    this.config.options
                );
            } else if (this.config.options) {
                this.database = new Sequelize(
                    this.config.options
                );
            } else {
                this.database = new Sequelize();
            }

            this.models = {};
        } else {
            this.database = null;
            this.models = null; 
        }
    }

    public defineModel(modelDefine: CakoModelDefine): void {
        if (this.config.useModel) {
            class ModelClass extends Model {};
            this.models[modelDefine.name] = ModelClass;
            this.models[modelDefine.name].init(modelDefine.attributes, { sequelize: this.database, modelName: modelDefine.name });
        }
    }

    public defineRelation(relationDefine: CakoRelationDefine): void {
        if (this.config.useModel) {
            switch (relationDefine.type) {
                case 'many2many':
                    const many2ManyDescription: CakoRelationDefineMany2ManyDescription = relationDefine.description as CakoRelationDefineMany2ManyDescription;
                    const many2ManyOwner1: string = many2ManyDescription.owner[0];
                    const many2ManyOwner2: string = many2ManyDescription.owner[1];
                    const many2ManyThrough: string = many2ManyDescription.through || `${many2ManyOwner1}${many2ManyOwner2}`;
                    const many2ManyExtraAttributes: ModelAttributes = many2ManyDescription.extraAttributes || {};
                    class Many2ManyRelationClass extends Model {};
                    Many2ManyRelationClass.init(many2ManyExtraAttributes, { sequelize: this.database, modelName: many2ManyThrough });
                    this.models[many2ManyOwner1].belongsToMany(this.models[many2ManyOwner2], { through: Many2ManyRelationClass });
                    this.models[many2ManyOwner2].belongsToMany(this.models[many2ManyOwner1], { through: Many2ManyRelationClass });
                    break;
                case 'one2many':
                    const one2ManyDescription: CakoRelationDefineOne2ManyDescription = relationDefine.description as CakoRelationDefineOne2ManyDescription;
                    const one2ManyOwner: string = one2ManyDescription.owner;
                    const one2ManyTo: string = one2ManyDescription.to;
                    if (one2ManyDescription.as) {
                        const one2ManyAs: string = one2ManyDescription.as;
                        this.models[one2ManyTo].belongsTo(this.models[one2ManyOwner], { as: one2ManyAs });
                    } else {
                        this.models[one2ManyTo].belongsTo(this.models[one2ManyOwner]);
                    }
                    this.models[one2ManyOwner].hasMany(this.models[one2ManyTo]);
                    break;
                case 'hasOne':
                    const hasOneDescription: CakoRelationDefineHasOneDescription = relationDefine.description as CakoRelationDefineHasOneDescription;
                    const hasOneOwner: string = hasOneDescription.owner;
                    const hasOneTo: string = hasOneDescription.to;
                    if (hasOneDescription.as) {
                        const hasOneAs: string = hasOneDescription.as;
                        this.models[hasOneOwner].hasOne(this.models[hasOneTo], { as: hasOneAs });
                    }
                    break;
            }
        }
    }
}