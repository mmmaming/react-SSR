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
               
             <script>
                window.serverData = ${JSON.stringify(resData?.data?.result?.list)}
              </script>
              <script src="./index.js"></script>
           </body>
        </html>
`)
    })




});

app.listen(3000, () => console.log('listening on port 3000!'))
