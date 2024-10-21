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
    SELECT sd AS saldo_inicial FROM cxlog WHERE userno = ? AND date = CURRENT_DATE`;
    
    const [SaldoInicial] = await pool.query(saldoInicialQuery, [userno]);
    
    const saldo_inicial = SaldoInicial[0].saldo_inicial;
    
    // Consulta para obter o total de vendas
/*    const totalVendasQuery = `
SELECT 
    SUM(pedidos.total_vendas) AS total_vendas
FROM (
    SELECT 
        SUM(pay.valor_pedido) AS total_vendas
    FROM 
        pay
    INNER JOIN
        pedidos
    ON
        pay.pedido = pedidos.pedido
    INNER JOIN
        pedno
    ON
        pay.pedido = pedno.pedido
    WHERE
        pedno.data_fechamento = CURRENT_DATE() 
        AND pedno.sta = 1
        AND pedno.userno = ?
    GROUP BY
        pedidos.pedido
) AS pedidos;

        `;
    const [totalVendasResult] = await pool.query(totalVendasQuery, [usuarioNome]);
    
  */  
    
    
    // resltado da query abaixo
    
   // const total_vendas = totalVendasResult[0].total_vendas;

    // --> Consulta para obter o total de dinheiro -- Recebido (entrada no caixa)
    const valorrecebido = `
            SELECT sum(valor_recebido) AS recebido
            FROM pay
            INNER JOIN pedidos
            ON pay.pedido = pedidos.pedido
            WHERE pedidos.data_fechamento = CURRENT_DATE AND pay.tipo = 1 AND pedidos.userno = ? AND cp = 0`
            
    const [ValorRecebido] = await pool.query(valorrecebido, [usuarioNome]);
    const Valorrecebido = ValorRecebido[0].recebido;
                    
    const valorrecebidoS = `
            SELECT sum(valor_recebido) AS recebido
            FROM pay
            INNER JOIN pedidos
            ON pay.pedido = pedidos.pedido
            WHERE pedidos.data_fechamento = CURRENT_DATE AND pay.tipo = 1 AND pedidos.userno = ? AND pedidos.bit1 != 1 AND cp = 0`
            
    const [ValorRecebidoS] = await pool.query(valorrecebidoS, [usuarioNome]);
    const ValorrecebidoS = ValorRecebidoS[0].recebido;
                    
  // --> Consulta para obter o total de dinheiro -- Troco
    const valortroco = `
            SELECT sum(bit4) AS troco
            FROM pay
            INNER JOIN pedidos
            ON pay.pedido = pedidos.pedido
            WHERE pedidos.data_fechamento = CURRENT_DATE AND pay.tipo = 1 AND pedidos.userno = ? AND cp = 0`
            
    const [ValorTroco] = await pool.query(valortroco, [usuarioNome]);
    const Valortroco = ValorTroco[0].troco
                       // ------->>>>>>>> Teste de resultado <<<<<<<<<<<----------//  
    const valortrocoS = `
            SELECT sum(bit4) AS troco
            FROM pay
            INNER JOIN pedidos
            ON pay.pedido = pedidos.pedido
            WHERE pedidos.data_fechamento = CURRENT_DATE AND pay.tipo = 1 AND pedidos.userno = ? AND pedidos.bit1 != 1 AND cp = 0`
            
    const [ValorTrocoS] = await pool.query(valortrocoS, [usuarioNome]);
    const ValortrocoS = ValorTrocoS[0].troco
    
//	--------------------->>>>>>> Valores com CP <<<<<<<<<---------------
	const cpQuery = "select sum(valor_recebido + 12 - valor_pedido) as valorcp from pay inner join pedidos on pedidos.pedido = pay.pedido where pedidos.data_fechamento = current_date and pay.tipo = 1 and pedidos.userno = ? and pedidos.bit1 !=1 and pay.cp=1"
	const [cpresult] = await pool.query(cpQuery, [usuarioNome]);
	const vcp = cpresult[0].valorcp || "0";
    // sangria
    
    const querySangria = `
      SELECT sdret AS sangria
FROM s_log
WHERE user_cx = ? AND date = CURRENT_DATE

UNION ALL

SELECT 0
WHERE NOT EXISTS (
    SELECT 1
    FROM s_log
    WHERE user_cx = ? AND date = CURRENT_DATE
);
    `;
    const [resultSangria] = await pool.query(querySangria, [userno, userno]);
    const sangria = resultSangria[0].sangria;
                       // ------->>>>>>>> Teste de resultado <<<<<<<<<<<----------//  
    
    
    // novo saldo inicial 
    const sdinicial = "SELECT sd_old as sdinicial FROM s_log WHERE user_cx = ? AND date = current_date";
    const [SdinicialTrue] = await pool.query(sdinicial, [userno]);
    const sdinicialFalse = "SELECT sd as sdinicial FROM cxlog WHERE date = current_date AND s0 = 1 AND userno = ?"
    const [SdinicialFalse] = await pool.query(sdinicialFalse, [userno]);
    
    let rdiario_saldoinicial
    
    if (SdinicialTrue.length > 0) {
      rdiario_saldoinicial = SdinicialTrue[0].sdinicial
    } else {
      rdiario_saldoinicial = SdinicialFalse[0].sdinicial
    }
    
//  ------------------------->>>>>>>>>>>>>> Retirando valor di CP  rel diario (outras formas de pagamento) <<<<<<<<<<<<<<<<<<<< -------------------------------- |
const cpquery = "";
    
    
     const caixaDoDia = {
       recebido: Number(Valorrecebido),
       troco: Number(Valortroco),
       sangria: Number(sangria),
       rdiario_saldoinicial: Number(rdiario_saldoinicial)
     };
     
     const caixadia = caixaDoDia.recebido + caixaDoDia.rdiario_saldoinicial - caixaDoDia.troco - caixaDoDia.sangria 
     const caixaDia = parseFloat(caixadia.toFixed(2));
                      // ------->>>>>>>> Teste de resultado <<<<<<<<<<<----------//
                      
    
    const saldodinheiro = {
      recebido: Number(ValorrecebidoS),
      troco: Number(ValortrocoS),
      cp: Number(vcp)
    }  
    
    const rdiarioSaldoDinheiro = saldodinheiro.recebido - saldodinheiro.troco + saldodinheiro.cp


// valores do crédito

const queryCredito = `
SELECT
	SUM(pay.valor_recebido) AS credito
FROM
	pay
INNER JOIN
	pedidos
ON
	pay.pedido = pedidos.pedido
WHERE
	pedidos.data_fechamento = CURRENT_DATE
  AND
  pay.tipo = 2
  AND
  pedidos.userno = ?`
  
  const [resultCredito] =  await pool.query(queryCredito, [usuarioNome]);
  const credito = resultCredito[0].credito


// pix

const queryPix = `
  SELECT
    sum(pay.valor_recebido) as pix
  FROM
    pay
  INNER JOIN
    pedidos
  ON
    pay.pedido = pedidos.pedido
  WHERE
    pedidos.data_fechamento = current_date
    AND
    pay.tipo = 0
    AND
    pedidos.userno = ?
`

const [resultPix] = await pool.query(queryPix, [usuarioNome]);
const pix = resultPix[0].pix

// debito 

const queryDeb = `
  SELECT
    sum(pay.valor_recebido) as debito
  FROM
    pay
  INNER JOIN
    pedidos
  ON
    pay.pedido = pedidos.pedido
  WHERE
    pedidos.data_fechamento = current_date
    AND
    pay.tipo = 3
    AND
    pedidos.userno = ?
`

const [resultDeb] = await pool.query(queryDeb, [usuarioNome]);
const debito = resultDeb[0].debito

// Total de vendas 

const query = `
  SELECT
    sum(pay.valor_recebido) as cartoes
  FROM
    pay
  INNER JOIN
    pedidos
  ON
    pay.pedido = pedidos.pedido
  WHERE
    pedidos.data_fechamento = CURRENT_DATE
    AND
    pedidos.userno = ?
    AND
    pay.tipo != 1
`;

const [result] = await pool.query(query, [usuarioNome]); 
const cartoes = result[0].cartoes;

const vendas = {
  cartoes: Number(cartoes), 
  dinheiro: Number(rdiarioSaldoDinheiro)
}

const tvendas = vendas.cartoes + vendas.dinheiro;

// Cupom fidelidade

const QCP = "SELECT COUNT(pedido) * 12 AS cupom_fidelidade FROM cp WHERE date = current_date";
const  [resultCP] = await pool.query(QCP);
const cupomFidelidade = resultCP[0].cupom_fidelidade;



 
    return {
      success: true,
      usuarioNome,
      rdiario_saldoinicial,
      //total_vendas,
      rdiarioSaldoDinheiro,
      caixaDia,
      sangria,
      credito,
      pix,
      debito,
      tvendas,
      cupomFidelidade
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

async function sangria (user_cx, sdret, motivo){
  try {
    
    // Busca do usuário por nome
    const buscaUser = `SELECT usuario FROM usuario where id = ?`
    const [buscauser] = await pool.query(buscaUser, [user_cx]);
    const usuario = buscauser[0].usuario;
    
    const saldoinicial = `SELECT sd FROM cxlog WHERE userno = ? AND date = CURRENT_DATE`;
    const [SaldoInicial] = await pool.query(saldoinicial, [user_cx]);
    
    const saldo_inicial = SaldoInicial[0].sd;
    
    
    
    const querySangria = `INSERT INTO s_log (sd_old, sdret, user_cx, motivo, date, time) VALUES (?,?,?,?, CURRENT_DATE, CURRENT_TIME)`;
    const valuesSangria = [saldo_inicial, sdret, user_cx, motivo];
    
    if (sdret == 0) {
      return {
        success: false,
        error: ['Não é possível realizar uma sangria no valor de R$ 0,00']
      } 
    } else if (motivo == 0 || motivo === null || motivo === "") {
      return {
          success: false,
          error: ['Por favor insira o motivo da sangria']
      }
    } else if (saldo_inicial < sdret ) {
      return {
        success: false,
        error: ['Saldo insuficiente']
      }
    }
    
    const [sangria] = await pool.query(querySangria, valuesSangria);
    
    return {
      success: true,
      message: ['Sangria realizada com sucesso']
    };
    
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: ['Erro no servidor, por favor contate o administrador', error]
    };
  }
}


async function ssd(userno) {
  try {
    const sinicial = `SELECT sd FROM cxlog WHERE s0 = 1 and date = current_date and userno = ?`;
    const [SInicial] = await pool.query(sinicial, [userno]);
    
    const s_inicial = SInicial[0].sd;
    
    const vendasdia = `SELECT sum(pay.valor_recebido) as recebido from pay
                      inner join 
                      pedidos
                      on pay.pedido = pedidos.pedido
                      where pedidos.data_fechamento = CURRENT_DATE and pay.tipo = 1 AND bit4 = 0`;
                      
    const [Vendasdia] = await pool.query(vendasdia);
    const v_dia = Vendasdia[0].recebido;
    
    const trocodia = `SELECT sum(pay.bit3) as troco from pay
                      inner join 
                      pedidos
                      on pay.pedido = pedidos.pedido
                      where pedidos.data_fechamento = CURRENT_DATE and pay.tipo = 1 and bit4 = 0`;
                      
    const [Trocodia] = await pool.query(trocodia);
    const t_dia = Trocodia[0].troco;
    
    const si_sv = {
      s_inicial: Number(s_inicial),
      v_dia: Number(v_dia),
      t_dia: Number(t_dia)
    };
    
    const sg = si_sv.v_dia + si_sv.t_dia + si_sv.s_inicial;
    const sangria = sg.toFixed(2);
    
    return {
      success: true,
      sangria
    };
    
  } catch (error) {
    return {
      success: false,
      message: ['Erro ao puxar saldo', error]
    };
  }
}


async function cpUpdate({ bit, valor }) {
 try {
  const query = "UPDATE sys SET cp = ?, val = ? WHERE id = 7";
  const values = [bit, valor]

 const [result] = await pool.query(query, values);
 console.log(bit, valor)

 return {
  success: true,
  message: "Parâmetros do cupom atualizados com sucesso"
 }
 } catch (error) {
  console.error(error)
  return "Erro ao atualizar parâmetros do cupom"
 }
}





module.exports = {
  getcaixa,
  saldo,
  abrirCaixa,
  fechamento,
  relDiario,
  getOperador,
  sangria,
  ssd,
  cpUpdate
}
