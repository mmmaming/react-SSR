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
