import { CakoRelationDefineMany2ManyDescription, CakoRelationDefineOne2ManyDescription, CakoRelationDefineHasOneDescription } from './model';
import { Sequelize, Options, Model, ModelAttributes, ModelOptions, BuildOptions, HasManyOptions } from 'sequelize';

export interface CakoModelConfig {
    /**
     * if `useModel` option is `false`, cako will use no database
     */
    useModel?: boolean,

    /**
     * database name
     */
    database?: string,

    /**
     * login username of database
     */
    username?: string,

    /**
     * login password of database
     */
    password?: string,

    /**
     * sequelize db options, which is a `Options` object
     */
    options?: Options
}

/**
 * for example:
 * 
 * ```javascript
 * cako.defineModel({
 *     name: 'user',
 *     attributes: {
 *         id: {
 *             type: Sequelize.BIGINT,
 *             unique: true,
 *             autoIncrement: true,
 *             primaryKey: true
 *         }
 *     }
 * });
 * ```
 */
export interface CakoModelDefine {
    /**
     * model name
     */
    name: string,

    /**
     * model attributes, which is a `ModelAttributes` object
     */
    attributes: ModelAttributes,

    /**
     * model options, which is a `ModelOptions` object
     */
    options?: ModelOptions
}

/**
 * for example:
 * ```javascript
 * cako.defineRelation({
 *      type: 'many2many',
 *      description: {
 *          owner: ['user', 'role'],
 *          through: 'userRole',
 *          extraAttributes: {
 *              check: {
 *                  type: Sequelize.BOOLEAN
 *              }
 *          }
 *      }
 * });
 * ```
 */
export interface CakoRelationDefineMany2ManyDescription {
    /**
     * owner of many-to-many relation (two owner)
     */
    owner: string[],

    /**
     * through table name
     */
    through?: string,

    /**
     * extra attributes of table, where is a `ModelAttributes` object
     */
    extraAttributes?: ModelAttributes
}

/**
 * for example:
 * ```javascript
 * cako.defineRelation({
 *      type: 'one2many',
 *      description: {
 *          owner: 'user',
 *          to: 'message',
 *          as: 'creator'
 *      }
 * });
 * ```
 */
export interface CakoRelationDefineOne2ManyDescription {
    /**
     * 'one' model in one-to-many relation
     */
    owner: string,

    /**
     * 'many' model in one-to-many relation
     */
    to: string,

    /**
     * 'one' model displayed on 'many' model field
     */
    as?: string
}

export interface CakoRelationDefineHasOneDescription {
    /**
     * model which has 'one'
     */
    owner: string,

    /**
     * 'one' model in the relation
     */
    to: string,

    /**
     * 'one' model displayed on the owner model
     */
    as?: string
}

export interface CakoRelationDefine {
    /**
     * type of 'relationship':
     * * `many2many` - the many-to-many relation
     * * `one2many` - the one-to-many relation
     * * `hasOne` - the has-one relation
     */
    type: 'many2many' | 'one2many' | 'hasOne',
    
    /**
     * the detail description of relation:
     * * where relation type is `many2many`, type of description is `CakoRelationDefineMany2ManyDescription`
     * * where relation type is `one2many`, type of description is `CakoRelationDefineOne2ManyDescription`
     * * where relation type os `hasOne`, type os description is `CakoRelationDefineHasOneDescription`
     */
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