import express from 'express';
import React from 'react';
import { renderToString } from "react-dom/server";
import HomePage from "../container/HomePage";

const app = express();

app.use(express.static("public"));

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
