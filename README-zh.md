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

# 🤔 什么是 Cako ?
`Cako` 是一个简单的基于 `MVC` 模型的 `Node.js Web` 框架，你可以认为它就是一个基于 `MVC` 模型的 `http` 服务器。`Cako` 的很多特性都与 `Koa.js` 类似。事实上，`Cako` 就是基于 `Koa.js` 构建的， 但是不同的是，`Cako` 多了很多酷炫的功能和设计理念，比如默认的 `ORM (Object Relational Mapping)` 支持 (由 `Sequelize` 驱动)。

`Cako` 的前身是 `John Kindem` 在开发新版博客网站时自行设计的简单后端框架。`Cako` 的一些设计理念参考了 `Python` 的 `Web` 框架 `Django`，使用 `Cako` 的时候，你能发现很多与 `Django` 相似的地方。当然，既然基于 `Koa.js` 和 `Sequelize` 构建，那么这两者的很多原生功能也会在 `Cako` 中被支持。

`Cako` 非常适合在小型项目中使用，因为它为你提供了一套开箱即用的架构，使用 `Cako` 进行后端构建是非常容易而且自然的。

当然，在目前，`Cako` 仍然在构建阶段，不可避免地，使用 `Cako (Beta)` 总会遇到一些小小的问题，再加上构建者现在已经参加工作了，更新频率可能会有一定问题，你可以在 `github` 写下你遇到的问题，当然，如果你愿意阅读 `Cako` 的源码并且为之修复 `bug`，那就最好不过了。最后，希望你能喜欢 `Cako`。

# 📦 安装与引用
使用 `npm` 安装：

```
npm install cako sequelize
```

或者使用 `yarn` 安装：

```
yarn add cako sequelize
```

引入 `Cako`：

```javascript
const Cako = require('cako');
const Sequelize = require('sequelize');
```

# 🧀 使用
`Cako` 使用 `TypeScript` 进行构建，你可以使用支持 `TypeScript` 的编辑器 (如 `Visual Studio Code`、`Atom` 等) 进行开发以获得完整的代码提示支持。

创建 `Cako` 实例：

```javascript
// Cako 类接受一个配置对象
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

定义一个 `Model`：

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

定义一个 `Controller`：

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

开启服务器：

```javascript
cako.start();
```

之后，你访问 `http://localhost:4000` 应该可以看到 `hello`。

顺便提一句，`Cako` 实例中的方法可以被链式调用：

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

关于 `API` 和配置的更多信息，可以参考 [Cako - API 文档](./docs/zh.md)

# 💖 关于
* 作者: `John Kindem`
* `github`: [FlyAndNotDown - cako](https://github.com/FlyAndNotDown/cako)
* `npm`: [npm - cako](https://www.npmjs.com/package/cako)
* `issues`: [FlyAndNotDown - cako - issues](https://github.com/FlyAndNotDown/cako/issues)