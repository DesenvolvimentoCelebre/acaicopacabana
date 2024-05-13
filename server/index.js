const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const dotenv = require('dotenv').config

const mysql = require('./database/connection/cxx');
const routes = require('./route/crypt');

const app = express();

app.use(cors());
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));
app.use(routes)

// Mudar variável para pegar do arquivo env 
const port = 21176;


// Iniciar Servidor 
app.listen(port, (err) => {
    if (err) {
        console.error(err)
    } else {
    console.log(`Servidor rodando na porta ${port}`);
    }
})
