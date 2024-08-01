const pool = require('../database/connection');

async function getcaixa() {
    try {
        const query = `
        SELECT 
    COALESCE(
        (
            SELECT 
                CASE s0 
                    WHEN '0' THEN '0'
                    WHEN '1' THEN '1'
                    ELSE '0'
                END AS s0
            FROM cxlog 
            WHERE date = CURRENT_DATE()
            ORDER BY time DESC
            LIMIT 1
        ),
        '0'
    ) AS s0;

`;

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

async function abrirCaixa(s0, sd, userno) {
    try {

        const query = `INSERT INTO cxlog (s0, sd, date, time, userno) VALUES (? ,?, CURRENT_DATE(), CURRENT_TIME(), ?)`;
        const values = [s0, sd, userno];

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
            (SELECT COALESCE(SUM(sd), 0) 
        FROM 
            cxlog 
        WHERE 
        s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY) +
        (SELECT COALESCE(SUM(pedno.valor_unit), 0) 
        FROM pedno 
        INNER JOIN pay ON pedno.pedido = pay.pedido 
        WHERE pedno.data_fechamento = CURRENT_DATE AND pay.tipo = 0)
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

async function relDiario() {
    try {
        const saldoInicialQuery = `
            SELECT COALESCE(SUM(sd), 0) AS saldo_inicial
            FROM cxlog
            WHERE s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY
        `;
        const [saldoInicialResult] = await pool.query(saldoInicialQuery);
        const saldo_inicial = saldoInicialResult[0].saldo_inicial;

        const totalRecebidoPorTipoQuery = `
            SELECT
                CASE
                    WHEN pay.tipo = 1 THEN 'Dinheiro'
                    WHEN pay.tipo = 0 THEN 'Pix'
                    WHEN pay.tipo = 2 THEN 'Crédito'
                    WHEN pay.tipo = 3 THEN 'Débito'
                    WHEN pay.tipo = 4 THEN 'Cancelado'
                    ELSE 'Desconhecido, entre contato com administrador'
                END AS Tipo,
                SUM(pay.valor_recebido) AS total_valor_recebido
            FROM pay
            INNER JOIN pedno ON pay.pedido = pedno.pedido
            WHERE pedno.data_fechamento = CURRENT_DATE
            GROUP BY pay.tipo
        `;
        const [totalRecebidoPorTipoResult] = await pool.query(totalRecebidoPorTipoQuery);

        const totalVendasQuery = `
            SELECT COALESCE(SUM(pedno.valor_unit), 0) AS total_vendas
            FROM pedno
            WHERE pedno.data_fechamento = CURRENT_DATE
        `;
        const [totalVendasResult] = await pool.query(totalVendasQuery);
        const total_vendas = totalVendasResult[0].total_vendas;

        const saldoFechamentoQuery = `
            SELECT 
                (SELECT COALESCE(SUM(sd), 0) 
                FROM cxlog 
                WHERE s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY) +
                (SELECT COALESCE(SUM(pedno.valor_unit), 0)
                FROM pedno 
                INNER JOIN pay ON pedno.pedido = pay.pedido 
                WHERE pedno.data_fechamento = CURRENT_DATE AND pay.tipo = 0) AS saldo_fechamento
        `;
        const [saldoFechamentoResult] = await pool.query(saldoFechamentoQuery);
        const saldo_fechamento = saldoFechamentoResult[0].saldo_fechamento;

        return {
            success: true,
            saldo_inicial,
            totalRecebidoPorTipo: totalRecebidoPorTipoResult,
            total_vendas,
            saldo_fechamento
        };
    } catch (error) {
        return { 
            success: false, 
            message: ['Erro ao realizar fechamento', error.message] 
        };
    }
}


module.exports = {
    getcaixa,
    saldo,
    abrirCaixa,
    fechamento,
    relDiario
}