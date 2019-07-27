const Sequelize = require('sequelize');
const Cako = require('../index');

const server = new Cako({
    server: {
        port: 68910
    } ,
    model: {
        useModel: true,
        database: 'cako',
        username: 'development',
        password: 'development',
        options: {
            dialect: 'mssql',
            host: '134.175.59.165',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging: false,
            operatorsAliases: false
        }
    }
});

server
    .defineModel({
        name: 'user',
        attributes: {
            id: {
                type: Sequelize.BIGINT
            }
        }
    })
    .defineController({
        url: '/',
        get: (database, models) => {
            return async (context, next) => {
                return context.response.body('hello');
            };
        }
    })
    .start();