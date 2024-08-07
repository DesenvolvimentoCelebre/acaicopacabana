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
    // Consulta para obter as informações do usuário
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

    // Extrai o userno do resultado
    const usernoFromDB = buscaUsuarioResult[0].userno;

    // Consulta para calcular o saldo de fechamento
    const saldoQuery = `
            SELECT 
                COALESCE(
                    (SELECT SUM(sd) 
                     FROM cxlog 
                     WHERE s0 = 0 
                       AND date = CURRENT_DATE - INTERVAL 1 DAY 
                       AND userno = ?), 
                    0
                ) +
                COALESCE(
                    (SELECT SUM(valor_unit) 
                     FROM pedno 
                     INNER JOIN pay
                     ON pedno.pedido = pay.pedido
                     WHERE pedno.data_fechamento = CURRENT_DATE() 
                       AND pedno.userno = ? 
                       AND pay.tipo = 1), 
                    0
                ) AS saldo_fechamento
        `;

    const [saldoResult] = await pool.query(saldoQuery, [userno, usernoFromDB]);
    const saldo_fechamento = saldoResult[0].saldo_fechamento;

    // Consulta para inserir o saldo de fechamento na tabela cxlog
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

    await pool.query(insertQuery, [saldo_fechamento, userno]);

    return { success: true, message: ['Caixa Fechado com Sucesso'] };
  } catch (error) {
    console.error(error);
    return { success: false, message: ['Erro ao fechar caixa', error.message] };
  }
}


async function relDiario(userno) {
  try {
    // Consulta para obter o nome do usuário
    const usuarioNomeQuery = `
            SELECT pedno.userno as nome, usuario.nome
            FROM usuario
            INNER JOIN pedno ON pedno.userno = usuario.nome
            WHERE usuario.id =  ?
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
            WHERE s0 = 0 AND date = CURRENT_DATE - INTERVAL 1 DAY AND userno =  ?
        `;
    const [saldoInicialResult] = await pool.query(saldoInicialQuery, [userno]);
    const saldo_inicial = saldoInicialResult[0].saldo_inicial;

    // Consulta para obter o total recebido por tipo
    const totalRecebidoPorTipoQuery = `
            WITH PaymentTypes AS (
    SELECT 1 AS tipo, 'Dinheiro' AS descricao
    UNION ALL
    SELECT 0, 'Pix'
    UNION ALL
    SELECT 2, 'Crédito'
    UNION ALL
    SELECT 3, 'Débito'
),

PayData AS (
    SELECT
        pay.tipo,
        COALESCE(SUM(pay.valor_recebido), 0) AS saldo
    FROM pay
    INNER JOIN pedno ON pay.pedido = pedno.pedido
    WHERE pedno.data_fechamento = CURRENT_DATE
      AND pedno.userno = ?
      AND pedno.sta = 1
    GROUP BY pay.tipo
)

SELECT 
    pt.descricao AS Tipo,
    COALESCE(pd.saldo, 0) AS saldo
FROM PaymentTypes pt
LEFT JOIN PayData pd ON pt.tipo = pd.tipo
ORDER BY pt.tipo;
        `;
    const [totalRecebidoPorTipoResult] = await pool.query(totalRecebidoPorTipoQuery, [usuarioNome]);

    // Consulta para obter o total de vendas
    const totalVendasQuery = `
            SELECT 
	SUM(pay.valor_recebido) as total_vendas
FROM 
	pay
INNER JOIN
	pedno
ON
	pay.pedido = pedno.pedido
WHERE
	pedno.data_fechamento = CURRENT_DATE() AND pedno.sta = 1 and pedno.userno = ?
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

// Busca por sangrias no dia 
    const buscaSangria = `SELECT COALESCE(SUM(sdret), 0) AS sangria
      FROM s_log
      WHERE date = CURRENT_DATE AND user_cx = ?`;

     const [totalSangria] = await pool.query(buscaSangria, [userno]);
     const total_sangria = totalSangria[0].sangria;

    return {
      success: true,
      usuarioNome,
      saldo_inicial,
      totalRecebidoPorTipo: totalRecebidoPorTipoResult,
      total_vendas: Number(total_vendas),
      total_dinheiro,
      saldo_fechamento,
      total_sangria
    };
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: ['Erro ao realizar fechamento', error]
    };
  }
}

async function getOperador() {
  try {

    const getCaixa = `SELECT * FROM cxlog WHERE s0 = 1 and date = CURRENT_DATE`;

    const [resultsUser] = await pool.query(getCaixa);
    const user = resultsUser[0].userno;
    const query = `
    WITH PaymentTypes AS (
SELECT 1 AS tipo, 'Dinheiro' AS descricao
UNION ALL
SELECT 0, 'Pix'
UNION ALL
SELECT 2, 'Crédito'
UNION ALL
SELECT 3, 'Débito'
),

PayData AS (
SELECT
  pay.tipo,
  COALESCE(SUM(pay.valor_recebido), 0) AS saldo
FROM pay
INNER JOIN pedno ON pay.pedido = pedno.pedido
WHERE pedno.data_fechamento = CURRENT_DATE
AND pedno.userno = ?
AND pedno.sta = 1
GROUP BY pay.tipo
)

SELECT 
pt.descricao AS Tipo,
COALESCE(pd.saldo, 0) AS saldo
FROM PaymentTypes pt
LEFT JOIN PayData pd ON pt.tipo = pd.tipo
ORDER BY pt.tipo;
  `;

  const [results] = await pool.query(query, [user]);

  if (results.length === 0) {
    return {
      success: false,
      errors: ['Erro ao realizar sangria']
    }
  } else {
    return {
      success: true,
      message: [results]
    }
  }
  } catch (error) {
    return {
      success: false,
      errors: ['Erro ao realizar sangria']
    }
  }
}

module.exports = {
  getcaixa,
  saldo,
  abrirCaixa,
  fechamento,
  relDiario,
  getOperador
}