# react-SSR

## 从零开始实现一个简单的React Server Side Render(SSR)

曾几何时，页面渲染的方式一直是服务端渲染，所有逻辑都在后端写好再传给前端浏览器进行渲染，然而随着前端页面逻辑的复杂，渐渐地把渲染的业务单独拆出来去开发，从而也逐渐演变出前端开发工程师这一角色，页面渲染方式也从最早的后端渲染变为如今的前端渲染。然而前端渲染也有其局限性。最主要的两个影响因素是SEO和首屏渲染。当搜索引擎爬取网页时，会发现页面的HTML获取不到任何内容，从而影响网站的排名。（随着时代的发展，搜索引擎已经发展到可以执行网站中的js从而解析页面内容）。至于首屏渲染，原理如下。

![vArtZj](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/vArtZj.png)
我们可以看到，以往的服务端渲染，浏览器拿到后端返回的HTML可以直接解析显示在浏览器上，不需要额外的处理，然而对于客户端渲染，浏览器第一次拿到的是一个空的HTML，然后下载其中引用的js文件并解析，最终根据JS的内容生成对应的页面并被浏览器显示出来。 在浏览器下载JS文件并解析执行的过程中，页面一直是空白状态，造成了用户首次加载时间长，内容展示慢的情况，影响用户的体验。所以为了解决这个问题，新一代的SSR由此诞生。通过在服务端执行JS并生成对应HTML再传给浏览器进行展示，并在浏览器执行后续操作，从而解决了SEO和首屏加载的问题。

现在，让我们开始实现一个简单的React SSR。

### 1. 使用express启动一个server。

**npm install express —save**

在根目录下创建server文件夹并创建index文件。

```jsx
import express from 'express';

const app = express();

app.get('/', (req,res) => res.send(`
<html>
   <head>
       <title>React Server Side Render</title>
   </head>
   <body>
       Hello world
   </body>
</html>
`));

app.listen(3000, () => console.log('listening on port 3000!'))
```

注意这里我们使用的是import语法。

此时，当我们启动node server/index.js 时，发现控制台会提示我们SyntaxError: Cannot use import statement outside a module， 原因是因为node并不能识别esModule的语法，只能识别commonJS的语法规范。所以这里我们需要安装webpack和babel进行配置，从而能识别ES6语法，为了后续使用react方便，这里将react JSX转换一起配置好。

首先安装对应依赖

**npm install react --save**

**npm install react-dom --save**

**npm install webpack--save**

**npm install webpack-cli--save**

**npm install webpack-node-externals --save**

**npm install @babel/core --save**

**npm install @babel/preset-env --save**

**npm install react @babel/preset-react --save**

**npm install babel-loader --save**

安装好后，在根目录下创建webpack.server.js文件

```jsx
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target:'node',
    mode:'development',
    entry:'./server/index.js',
    output: {
        filename:'index.js',
        path:path.resolve(__dirname,'bundle')
    },
    devtool: 'inline-source-map',
    externals: [nodeExternals()],
    module: {
        rules: [{
            test:   /.js?$/,
            loader:'babel-loader',
            exclude: /node_modules/,
            options: {
                presets: ['@babel/preset-react',['@babel/preset-env', {
                    targets: {
                        chrome: '100'
                    }
                }]]
            }
        }]
    }
}
```

此时，当我们用webpack编译文件后，执行node bundle/index.js 便可通过访问localhost:3000浏览我们创建好的页面

![NDa0IU](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/NDa0IU.png)
### 2 编写React代码

创建container文件夹并在里面存放我们的React组件HomePage.js

```
import React from 'react';

const HomePage = () => {
    return (
        <div>
            HomePage
        </div>
    )
};

export default HomePage;
```

在server/index.js文件中增加以下改动。

```jsx
import express from 'express';
import React from 'react';
import { renderToString } from "react-dom/server";
import HomePage from "../container/HomePage";

const app = express();

app.get('/', (req, res) => {
    const content = renderToString(<HomePage />);
    res.send(`
        <html>
           <head>
               <title>React Server Side Render</title>
           </head>
           <body>
               ${content}
           </body>
        </html>
`)
});

app.listen(3000, () => console.log('listening on port 3000!'))
```

这里我们通过React提供的renderToString方法，将组件渲染成字符串并传给HTML中。

重新编译并执行文件，刷新页面会看到React组件已经在页面成功渲染。

![Ofi2EC](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/Ofi2EC.png)
接下来，我们对组件进行一些小改动，增加一个click方法,点击按钮后向控制台打印一句话。

```jsx
import React from 'react';

const HomePage = () => {
    const handleClick = () => {
        console.log('oh, you clicked me');
    }
    
    return (
        <div>
            <h2>
                HomePage
            </h2>
            <button onClick={handleClick}>click me</button>
        </div>
    )
};

export default HomePage;
```

![vlMyCk](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/vlMyCk.png)
此时当我们点击按钮时，发现控制台并没有输出文字。

原因是因为，我们在服务端渲染组件时，React.renderToString方法只是把我们的组件转成字符串，并不会将事件绑定上去。这里还有个细节需要注意，服务端的组件生命周期只会执行到render就截止了，后续的例如didMount等生命周期都不会执行，所以任何卸载didMount，useEffect等的代码在服务端都不会执行。

### 3 同构

所以为了解决这个问题，我们需要在客户端执行一遍同样的React代码并绑定事件。我们把这种服务端和客户端共用一套代码的行为称为同构。

接下来，我们需要编写我们的客户端代码

首先创建client文件夹并创建index.js

```jsx
import React from'react';
import ReactDOM from 'react-dom/client';
import HomePage from "../container/HomePage";

const App = () => {
    return (
        <HomePage />
    )
}

ReactDOM.hydrateRoot(
    document.getElementById('root'), <App/>
);
```

其中[ReactDom.hydrateRoot()](https://reactjs.org/docs/react-dom-client.html#hydrateroot)方法的作用是将通过ReactDOMServer渲染出来的组件进行hydrate并尝试添加event listeners。具体介绍可见[官网](https://reactjs.org/docs/react-dom-client.html#hydrateroot)。

注意这里我们使用了hydrateRoot方法并将组件挂在到了root节点上，所以需要在对应的html上增加id=root的节点.

修改server文件

```jsx
import express from 'express';
import React from 'react';
import { renderToString } from "react-dom/server";
import HomePage from "../container/HomePage";

const app = express();

app.use(express.static("public")); // 将静态文件路由指向public文件夹

app.get('/', (req, res) => {
    const content = renderToString(<HomePage />);
    res.send(`
        <html>
           <head>
               <title>React Server Side Render</title>
           </head>
           <body>
               <div id="root">${content}</div>
               <script src="./index.js"></script>
           </body>
        </html>
`)
});

app.listen(3000, () => console.log('listening on port 3000!'))
```

> 这里有个细节需要注意，当我们增加了id=root的这个div后，需要删除内容的前后空格和换行，保证后端渲染的内容和前端渲染的内容完全一样，否则控制台会报错，我们需要将这种不一致的情况视为bug去解决。
>

为了让React代码能顺利执行，还需要将客户端的代码通过webpack进行打包和编译。

创建webpack.client.js文件

```jsx
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './client/index.js',
    output: {
        filename:'index.js',
        path:path.resolve(__dirname,'public') // 将打包后的文件放入在server中指定的public静态文件夹中
    },
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test:   /.js?$/,
            loader:'babel-loader',
            exclude: /node_modules/,
            options: {
                presets: ['@babel/preset-react',['@babel/preset-env', {
                    targets: {
                        chrome: '100'
                    }
                }]]
            }
        }]
    }
}
```

重新编译并执行后，控制台已经可以正常输出我们的内容。

![id4xos](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/id4xos.png)
由于每次改动完需要分别编译server端和client端的代码再启动服务，比较麻烦，到这里，我们进行一些调整，优化运行流程。

首先，安装两个所需依赖

**npm install nodemon -g**

**npm install npm-run-all -g**

其中，nodemon的作用是监听文件变化并重启服务器，npm-run-all帮助我们一键启动所需要的命令。

安装完后，将package.json里的script命令修改如下：

```jsx
"scripts": {
    "build:server": "webpack --config webpack.server.js",
    "build:client": "webpack --config webpack.client.js",
    "start:server": "nodemon --watch build --exec node './bundle/index.js'",
    "start": "npm-run-all  -p build:server build:client start:server"
  },
```

build:server和build:client分别负责编译server和client的文件，通过start:server监听并自动重启服务，最终通过npm start一键启动这三条命令。

到此为止，一个最最基本的服务端渲染已经完成了，回顾一下整体流程，其实并不难，通过renderToString方法将组件渲染好之后通过请求传给浏览器，浏览器拿到页面并加载JS，执行前端部分的逻辑完成绑定事件等操作。

### 4 使用路由

接下来，我们继续完善这个代码，目前的情况，代码只支持单页面，并不支持页面跳转等操作，所以需要配置路由。

常规来讲，当前端接管页面时，则不需要后端再进行任何支持，前端此时变为单页面应用，所有的页面跳转逻辑都在前端配置好即可。

首先，安装路由所需要的依赖。

**npm install `react-router` —save**

**npm install `react-router`-dom —save**

接着，在根目录下创建routes文件.

```jsx
import React from 'react';
import { Route } from "react-router-dom";
import { Routes } from "react-router";
import HomePage from "./container/HomePage";

export default (
    <div>
        <Routes>
            <Route exact path="/" element={<HomePage />} />
        </Routes>
    </div>
),

```

client/index.js的内容修改为

```jsx
import React from'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import routes from "../routes";

const App = () => {
    return (
        <Router>
            {routes}
        </Router>
    )
}

ReactDOM.hydrateRoot(
    document.getElementById('root'), <App/>
);
```

接下来我们访问页面会发现,页面虽然会正常显示，但是控制台会有报错

![UjReti](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/UjReti.png)
回顾我们刚才的代码，我们在routes文件中，外层增加了一层div，此时只有客户端有这一层div结构，服务端并没有，所以就会报UI内容不匹配的错误，要解决这个问题，最好的方式是在服务端也配置一次路由。

修改server/index.js文件

```jsx
import express from 'express';
import React from 'react';
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import HomePage from "../container/HomePage";
import routes from "../routes";

const app = express();

app.use(express.static("public"));

app.get('/', (req, res) => {
    const content = renderToString(
        <StaticRouter location={req.path}>
            {routes}
        </StaticRouter>
    );

    res.send(`
        <html>
           <head>
               <title>React Server Side Render</title>
           </head>
           <body>
               <div id="root">${content}</div>
               <script src="./index.js"></script>
           </body>
        </html>
`)
});

app.listen(3000, () => console.log('listening on port 3000!'))
```

> 这里我们不适用BrowserRouter而是使用从server导出的StaticRouter路由，原因也很简单，server端没有browser。
>

StaticRouter接受一个location参数，传入req.path，用来感知url的变化从而渲染对应的页面。

再次访问页面，可以看到已经没有报错了。

接下来，我们再增加一下跳转功能。

新增一个Park组件并配置好路由。

routes.js

```jsx
// 将这行代码插入到Routes里面
<Route exact path="/park" element={<Park />} />
// Park代码简单，这里不做特别的展示

```

container/HomePage.js

```jsx
// 在HomePage中加入这行代码，实现点击跳转到/park路径
<div>
    <Link to="/park">Go to Park</Link>
</div>
```

打开页面，发现已经可以正常跳转到/park地址并正确显示了。

![j6rn6M](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/j6rn6M.png)
然而，这里还有一个问题，当我们刷新页面的时候

![ejagBg](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/ejagBg.png)
会发现报错了，原因显而易见，由于刷新了页面，相当于我们直接访问的是/localhost:3000/park地址，但是我们并没有在server端配置这个url。 所以要解决这个问题，需要在server端配置/park这个地址，从而支持刷新功能。

简单起见，我们将这里直接换成星号

![BGHgtf](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/BGHgtf.png)
接下来再刷新，即可正常显示了

到这里，一个简单的路由系统就基本完成了，接下来最后一个比较重要的功能就是获取数据。

### 5 获取数据

先装个axios方便获取数据

**npm install axios —save**

按照以往的开发模式，我们会在组件挂载到页面上后拉起请求并渲染得到的内容。 接下来，我们修改组件

container/HomePage.js

```jsx
import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
    const [ state, setState ] = useState(null);
    const handleClick = () => {
        console.log('oh, you clicked me');
    }

    useEffect(() => {
        axios.get("https://api.apiopen.top/api/getHaoKanVideo?page=0&size=2").then(res => {
            setState(res?.data?.result?.list)
        })
    }, []);
    return (
        <div>
            <h2>
                HomePage
            </h2>
            <button onClick={handleClick}>click me</button>
            <div>
                <Link to="/park">Go to Park</Link>
            </div>
            <h3>
                here is some video
            </h3>
            <ul>
                {
                    state && state.map(item => <li key={item.id}>{item.title}</li>)
                }
            </ul>

        </div>
    )
};

export default HomePage;
```

我们在useEffect中发起一个get请求并在下面渲染了拿到的数据。

接下来刷新页面，可以看到，我们获取的内容已经可以正常的显示在了页面上。

![o6ZwrO](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/o6ZwrO.png)
不过，当我们打开控制台，查看服务端给我们返回的html时，发现后端给我们返回的内容是这样的

```jsx
// 截取了部分内容
</div><h3>here is some video</h3><ul></ul></div>
```

我们发现，服务端给我们返回的页面上并没有携带我们在页面上渲染的内容，这也就意味着，我们在页面上看到的那个ul的list，并不是SSR的。想一想这是为什么。

前面提到了，我们在server端使用的ReactDOM.RenderToString()方法，在执行渲染组件时，组件的生命周期执行到render就停止了，并不会继续走后面的didMount等的生命周期，也就意味着，我们在useEffect里写的内容，并不会被server端执行，这也就是为什么server端这里显示的内容是空的原因。

为了这个解决这个问题，我们需要在server端返回给client端对应的页面之前，先将数据获取到，再传给页面。具体做法是

client/index.js

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Routes } from "react-router";
import routes from "../routes";

const App = () => {
    return (
        <Router>
            <Routes>
                {routes.map(route => {
                    const Component = route.element;
                    return (
                        <Route {...route} element={<Component />}/>
                    )
                })}
            </Routes>
        </Router>
    )
}

ReactDOM.hydrateRoot(
    document.getElementById('root'), <App/>
);
```

container/HomePage.js

```jsx
import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

export const fetchServerData = () => {
    return axios.get("https://api.apiopen.top/api/getHaoKanVideo?page=0&size=2");
}

const HomePage = (props) => {
    const [ state, setState ] = useState(props?.serverData);
    const handleClick = () => {
        console.log('oh, you clicked me');
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchServerData();
            setState(res?.data?.result?.list);
        };
        fetchData();
    }, []);
    return (
        <div>
            <h2>
                HomePage
            </h2>
            <button onClick={handleClick}>click me</button>
            <div>
                <Link to="/park">Go to Park</Link>
            </div>
            <h3>
                here is some video
            </h3>
            <ul>
                {
                    state && state.map(item => <li key={item.id}>{item.title}</li>)
                }
            </ul>

        </div>
    )
};

export default HomePage;
```

routes.js

```jsx
import React from 'react';
import HomePage, {fetchServerData} from "./container/HomePage";
import Park from "./container/Park";

export default [
    {
        path: "/",
        element: HomePage,
        loadData: fetchServerData,
        exact: true,
        key: "homepage"
    },
    {
        path: "/park",
        element: Park,
        exact: true,
        key: "park"
    }
]
```

server/index.js

```jsx
import express from 'express';
import React from 'react';
import {renderToString} from "react-dom/server";
import {StaticRouter} from "react-router-dom/server";
import routes from "../routes";
import { matchPath, Routes } from "react-router";
import { Route } from "react-router-dom";

const app = express();

app.use(express.static("public"));

app.get('*', (req, res) => {
    let matchedRoute = {};
    routes.forEach(route => {
        if(matchPath(route, req.path)) {
            matchedRoute = matchPath(route, req.path);
        }
    });

    matchedRoute.pattern.loadData().then(resData => {
        const content = renderToString(
            <StaticRouter location={req.path}>
                <Routes>
                    {routes.map(route => {
                        const Component = route.element;
                        return (
                            <Route {...route} element={<Component serverData={resData?.data?.result?.list}/>}/>
                        )

                    })}
                </Routes>
            </StaticRouter>
        );
        res.send(`
        <html>
           <head>
               <title>React Server Side Render</title>
           </head>
           <body>
               <div id="root">${content}</div>
               <script src="./index.js"></script>
           </body>
        </html>
`)
    })

});

app.listen(3000, () => console.log('listening on port 3000!'))
```

这里将routes文件中返回的内容修改为返回一个route的数组，方便后面的使用，在HomePage.js组件中state的初始值修改为从props上获取。主要改动在server/index.js这里。我们遍历routes并获取到当前页面所需要调用的数据接口，调用获取到数据后传给对应组件。

**这里注意一个细节，由于请求是异步的，所以需要等待请求执行结束，拿到结果后，再返回给client端页面内容。**

接下来我们再检查后端返回给前端的HTML中就已经有对应数据了。

但是如果仔细看的话，会发现一些不一致的地方

![6er79d](https://cdn.jsdelivr.net/gh/mmmaming/cloud-picture@master/uPic/6er79d.png)
我们找的这个API，每次调用返回的结果不一样，于是会出现server端返回的内容跟client端不一致的情况。

为了解决这个问题，我们需要将在server端获取到的数据传给client端，而不是让client端再发请求获取一遍新的数据。具体做法如下

server/index.js

```jsx
// 接口返回的模板部分，给window上挂载获取到的数据
<html>
   <head>
       <title>React Server Side Render</title>
   </head>
   <body>
       <div id="root">${content}</div>
       
     <script>
        window.serverData = ${JSON.stringify(resData?.data?.result?.list)}
      </script>
      <script src="./index.js"></script>
   </body>
</html>
```

client/index.js

```jsx
// 在原来的Route上增加从window上获取到的serverData
<Route {...route} element={<Component serverData={window.serverData} />}/>
```

最后，移除HomePage中在useEffect发请求的那部分代码。 如果这里不移除的话，会出现客户端发一遍请求，服务端发一遍请求的情况。

container/HomePage.js

```jsx
import React, { useState} from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

export const fetchServerData = () => {
    return axios.get("https://api.apiopen.top/api/getHaoKanVideo?page=0&size=2");
}

const HomePage = (props) => {

    const [ state, setState ] = useState(props?.serverData);
    const handleClick = () => {
        console.log('oh, you clicked me');
    }

    return (
        <div>
            <h2>
                HomePage
            </h2>
            <button onClick={handleClick}>click me</button>
            <div>
                <Link to="/park">Go to Park</Link>
            </div>
            <h3>
                here is some video
            </h3>
            <ul>
                {
                    state && state.map(item => <li key={item.id}>{item.title}</li>)
                }
            </ul>

        </div>
    )
};

export default HomePage;
```

至此，一个简单的SSR基本就完成了。其中的代码并不能作为最佳实践，只是为了帮助读者学习了解SSR的基本原理，实际开发中需要对代码做优化来简化开发。

最后，本文中使用到的library版本如下：

- Router v6
- babel v7
- webpack v5
- react v18

由于用到的这几个library每个大版本都有一些改动，本文基于当前写作时的最新版本来演示demo，如果在实际执行的过程中有一些报错，注意检查使用的库版本是否一致。
