const pool = require('../database/connection');

async function getcaixa(userno) {
    try {
        const query = `
        SELECT COALESCE(
    (SELECT s0
     FROM cxlog
     WHERE date = CURRENT_DATE()
       AND userno = ?
     LIMIT 1),
    0
) AS s0;
`;
        const values = [userno]
        const [results] = await pool.query(query, values);

        if (results.length === 0) {
            return { success: true, message: "Não foi encontrado nenhum produto com esse nome" };
        } else {
            return { success: true, message: results };
        }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Erro no servidor, por favor contatar o administrador", details: error };
    }
}

async function saldo(userno) {
    try {
        const query = `
SELECT sd FROM cxlog WHERE s0 = 0 AND date = CURRENT_DATE() - INTERVAL 1 DAY and userno = ? `;
        const values = [userno]
        const [results] = await pool.query(query, values);

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
        const query = `INSERT INTO cxlog (s0, sd, date, time, userno) VALUES (?, ?, CURRENT_DATE(), CURRENT_TIME(), ?)`;
        const values = [s0, sd, userno];

        const [result] = await pool.query(query, values);

        return { success: true, message: "Caixa aberto" };
    } catch (error) {
        console.error("Erro ao abrir caixa:", error);
        return { success: false, error: "Erro ao abrir caixa", details: error };
    }
}

async function fechamento(userno) {
    try {
        const buscaUsuarioQuery = `
            SELECT pedno.userno, usuario.id
            FROM usuario
            INNER JOIN pedno
            ON pedno.userno = usuario.nome
            WHERE usuario.id = ? 
        `;

        const [buscaUsuarioResult] = await pool.query(buscaUsuarioQuery, [userno]);
        if (buscaUsuarioResult.length === 0) {
            throw new Error('Usuário não encontrado');
        }

        const userno = buscaUsuarioResult[0].userno;

        const saldoQuery = `
            SELECT 
                COALESCE(
                    (SELECT SUM(sd) FROM cxlog WHERE s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY and userno = ?), 0
                ) +
                COALESCE(
                    (SELECT SUM(valor_unit) 
                     FROM pedno 
                     INNER JOIN pay
                     ON pedno.pedido = pay.pedido
                     WHERE data_fechamento = CURRENT_DATE() AND userno = 1 AND pay.tipo = 1), 0
                ) AS saldo_fechamento
        `;

        const [saldoResult] = await pool.query(saldoQuery, [userno]);
        const saldo_fechamento = saldoResult[0].saldo_fechamento;

        const insertQuery = `
            INSERT INTO cxlog (s0, sd, date, time, userno)
            VALUES (
                0, 
                ?,
                CURRENT_DATE, 
                CURRENT_TIME,
                ?
            )
        `;

        await pool.query(insertQuery, [saldo_fechamento, usuarioId]);

        return { success: true, message: ['Caixa Fechado com Sucesso'] };
    } catch (error) {
        return { success: false, message: ['Erro ao fechar caixa', error.message] };
    }
}

async function relDiario(userno) {
    try {
        // Consulta para obter o nome do usuário
        const usuarioNomeQuery = `
            SELECT pedno.userno, usuario.nome
            FROM usuario
            INNER JOIN pedno ON pedno.userno = usuario.nome
            WHERE usuario.id = 4 
        `;
        const [usuarioNomeResult] = await pool.query(usuarioNomeQuery, [userno]);

        if (usuarioNomeResult.length === 0) {
            throw new Error("Usuário não encontrado.");
        }

        const usuarioNome = usuarioNomeResult[0].nome;

        // Consulta para obter o saldo inicial
       const saldoInicialQuery = `
            SELECT COALESCE(SUM(sd), 0) AS saldo_inicial
            FROM cxlog
            WHERE s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY AND userno = 4
        `;
        const [saldoInicialResult] = await pool.query(saldoInicialQuery, [userno]);
        const saldo_inicial = saldoInicialResult[0].saldo_inicial;

        // Consulta para obter o total recebido por tipo
        const totalRecebidoPorTipoQuery = `
            SELECT
                CASE
                    WHEN pay.tipo = 1 THEN 'Dinheiro'
                    WHEN pay.tipo = 0 THEN 'Pix'
                    WHEN pay.tipo = 2 THEN 'Crédito'
                    WHEN pay.tipo = 3 THEN 'Débito'
                    WHEN pay.tipo = 4 THEN 'Cancelado'
                    ELSE 'Desconhecido, entre em contato com o administrador'
                END AS Tipo,
                SUM(pay.valor_recebido) AS saldo
            FROM pay
            INNER JOIN pedno ON pay.pedido = pedno.pedido
            WHERE pedno.data_fechamento = CURRENT_DATE AND pedno.userno = ? and pedno.sta = 1
            GROUP BY pay.tipo
        `;
        const [totalRecebidoPorTipoResult] = await pool.query(totalRecebidoPorTipoQuery, [usuarioNome]);

        // Consulta para obter o total de vendas
        const totalVendasQuery = `
            SELECT COALESCE(SUM(pedno.valor_unit), 0) AS total_vendas
            FROM pedno
            WHERE pedno.data_fechamento = CURRENT_DATE AND pedno.userno = ? AND pedno.sta = 1
        `;
        const [totalVendasResult] = await pool.query(totalVendasQuery, [usuarioNome]);
        const total_vendas = totalVendasResult[0].total_vendas;
	
	// Consulta para obter o total de dinheiro
        const totalDinheiroQuery = `
            SELECT COALESCE(SUM(pedno.valor_unit), 0) AS total_dinheiro
            FROM pedno
            INNER JOIN pay
            ON pedno.pedido = pay.pedido
            WHERE pedno.data_fechamento = CURRENT_DATE AND pedno.userno = ? and pay.tipo = 1
        `;
        const [totalDinheiroResult] = await pool.query(totalDinheiroQuery, [usuarioNome]);
        const total_dinheiro = totalDinheiroResult[0].total_dinheiro;

      
	
	// Consulta para obter saldo diário do valor

        const saldoFechamento = {
            total_dinheiro: Number(total_dinheiro),
            saldo_inicial: Number(saldo_inicial)
          };
          

          const sdpuro = saldoFechamento.total_dinheiro + saldoFechamento.saldo_inicial;
	  const saldo_fechamento = sdpuro.toFixed(2);

        return {
            success: true,
            usuarioNome,
            saldo_inicial,
            totalRecebidoPorTipo: totalRecebidoPorTipoResult,
            total_vendas,
	    total_dinheiro,
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