const pool = require('../database/connection');

async function getcaixa() {
    try {
        const query = `select s0 from cxlog where s0 = 0 and date = current_date() - interval 1 day`;

        const [results] = await pool.query(query);

        if (results.length === 0) {
            return { success: true, message: "Não foi encontrado nenhum produto com esse nome" };
        } else {
            return { success: true, message: results };
        }
    } catch (error) {
        return { success: false, error: "Erro no servidor, por favor contatar o administrador", details: error };
    }
}

async function saldo() {
    try {
        const query = `
SELECT sd FROM cxlog WHERE s0 = 0 AND date = CURRENT_DATE() - INTERVAL 1 DAY `;

        const [results] = await pool.query(query);

        if (results.length === 0) {
            return { success: true, message: "Não foi encontrado nenhum produto com esse nome" };
        } else {
            return { success: true, message: results };
        }
    } catch (error) {
        return { success: false, error: "Erro no servidor, por favor contatar o administrador", details: error };
    }
}

async function abrirCaixa(s0, sd) {
    try {

        const query = `INSERT INTO cxlog (s0, sd, date, time) VALUES (? ,?, CURRENT_DATE(), CURRENT_TIME())`;
        const values = [s0, sd];

        await pool.query(query, values);
        return { success: true, message: "Caixa aberto" };
    } catch (error) {
        return { success: false, error: "Erro ao abrir caixa", details: error };
    }
}

async function fechamento() {
    try {
        const saldoQuery = `
       SELECT 
           COALESCE(
               (SELECT SUM(sd) FROM cxlog WHERE s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY), 0
           ) +
           COALESCE(
               (SELECT SUM(valor_unit) FROM pedno WHERE data_fechamento = CURRENT_DATE()), 0
           ) AS saldo_fechamento
   `;

        const [saldoResult] = await pool.query(saldoQuery);
        const saldo_fechamento = saldoResult[0].saldo_fechamento;

        const insertQuery = `
       INSERT INTO cxlog (s0, sd, date, time)
       VALUES (
           0, 
           ?,
           CURRENT_DATE, 
           CURRENT_TIME
       )
   `;
        await pool.query(insertQuery, [saldo_fechamento]);
        return { success: true, message: ['Caixa Fechado com Sucesso'] }
    } catch (error) {
        return { success: false, message: ['Erro ao fechar caixa', error] }
    }
}

module.exports = {
    getcaixa,
    saldo,
    abrirCaixa,
    fechamento
}