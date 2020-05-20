const express = require('express');
const connection = require('./connection');
const routes = require('./routes');
const cors = require('cors');
const port = 3333;
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333, () => {
    console.log(`Servidor iniciado na porta ${port}`)
});
 