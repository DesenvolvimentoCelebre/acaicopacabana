const checkDate = require('../../config/checkDate');
const express = require('express');
const crypt = express.Router();

let currentRoutes = null;

const updateRoutes = async () => {
    try {
        currentRoutes = await checkDate();
        crypt.use(currentRoutes);
    } catch (error) {
        console.error('Erro ao definir rotas:', error);
    }
};

updateRoutes();  

setInterval(updateRoutes, 60000);

module.exports = crypt;
