const pool = require('../database/connection');
const express = require('express')
const router  = require('../routes/router');
const { crypt } = require('../routes/crypt/licenseExpired');

async function checkDate() {
    const today = new Date();
    const dia = today.getDate();
    const mes = today.getMonth() + 1;
    const ano = today.getFullYear();

    const date = `${ano}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;

    try {
        const [rows, fields] = await pool.execute(`SELECT DATE_FORMAT(bitl1, '%Y-%m-%d') as bitl1 FROM sys WHERE id = 5`);

        const license = rows[0].bitl1;
        
        if (license >= date) {
            return router;
        } else {
            return crypt;
        }
    } catch (error) {
        return crypt;
    }
}

module.exports = checkDate;
