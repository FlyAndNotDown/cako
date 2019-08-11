<center>
    <h1>🚀 Cako (Beta Version)</h1>
    <div>
        <img alt="npm" src="https://img.shields.io/npm/v/cako">
        <img alt="license" src="https://img.shields.io/github/license/FlyAndNotDown/cako"/>
        <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/FlyAndNotDown/cako">
        <img alt="github" src="https://img.shields.io/github/stars/FlyAndNotDown/cako?style=social"/>
        <img alt="GitHub followers" src="https://img.shields.io/github/followers/FlyAndNotDown?style=social">
    </div>
    <br/>
    <div>
        <a href="./README.md">English</a>&nbsp;
        <a href="./README-zh.md">中文</a>
    </div>
</center>

---

# 🤔 What is Cako ?
`Cako` is a simple MVC `Node.js` web framework, you can consider it as a MVC http server. Many characteristics of `Cako` are similar to `Koa.js`. In fact, `Cako` is powered by `Koa.js`, but what is different is that `Cako` has default `ORM (Object Relational Mapping)` support, which is powered by a famous `ORM` framework - `Sequelize`.

In `Cako`, there are three significant conceptions:

* `Model`
* `Controller`
* `View`

Those conceptions is similar to classics MVC model. Using `Cako` can improve javascript web backend developers' experience effectively.

I think you will love it.

# 📦 Install
use `npm`:

```
npm install cako sequelize
```

or use `yarn`:

```
yarn add cako sequelize
```

import:

```javascript
const Cako = require('cako');
const Sequelize = require('sequelize');
```

# 🧀 Usages
`Cako` was encoded by `TypeScript`, you can use the code editor which support `TypeScript` to get better experience.

To generate a `Cako` instance:

```javascript
// Cako class's constructor will receive a config object
const cako = new Cako({
    server: {
        port: 4000
    },
    model: {
        useModel: true,
        database: 'cako',
        username: 'xxx',
        password: 'xxx',
        options: {
            dialect: 'mysql',
            host: '111.111.111.111',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging: false
        }
    }
});
```

To define a new model:

```javascript
cako.defineModel({
    name: 'user',
    attributes: {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true
        }
    }
});
```

To Define a new controller:

```javascript
cako.defineController({
    url: '/',
    get: (database, models) => {
        return async (context, next) => {
            return context.response.body = 'hello';
        };
    }
});
```

To start http server:

```javascript
cako.start();
```

and then you can get `hello` when you visit the url `http://localhost:4000`.

By the way, you can call the `Cako` function using link-style method:

```javascript
cako
    .defineModel(
        // ...
    )
    .defineModel(
        // ...
    )
    .defineController(
        // ...
    )
    .defineController(
        // ...
    )
    .start();
```

Want more info about API & config? Please go to [Cako - docs](./docs/en.md)

# 💖 About
* `author`: `John Kindem`
* `github`: [FlyAndNotDown - cako](https://github.com/FlyAndNotDown/cako)
* `npm`: [npm - cako](https://www.npmjs.com/package/cako)
* `issues`: [FlyAndNotDown - cako - issues](https://github.com/FlyAndNotDown/cako/issues)
