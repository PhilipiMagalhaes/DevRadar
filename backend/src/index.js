const express = require('express');
const connection = require('./connection');
const routes = require('./routes');
const port = 3333;
const app = express();


app.use(express.json());
app.use(routes);


app.listen(3333, () => {
    console.log(`Servidor iniciado na porta ${port}`)
});
 