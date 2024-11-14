const pool = require('../database/connection');
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const { Client } = require("ssh2");
const axios = require('axios');
const dotenv = require('dotenv').config();

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
      return { success: true, message: "Não foi possível localizar se esse usuário abriu o caixa" };
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
            SELECT usuario.nome
            FROM usuario
            WHERE usuario.id = ? 
        `;
    const [buscaUsuarioResult] = await pool.query(buscaUsuarioQuery, [userno]);
    if (buscaUsuarioResult.length === 0) {
      throw new Error('Usuário não encontrado');
    }

    const usernoFromDB = buscaUsuarioResult[0].userno;

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

    const query = "SELECT LOWER(REPLACE(nome, ' ', '')) as empresa, LOWER(bairro) as bairro FROM empresa;";
    const [result] = await pool.query(query);
    const bairro = result[0].bairro;
    const empresa = result[0].empresa;


    const dbConfig = {
      user: process.env.user,
      password: process.env.password,
    };

    const date = new Date().toISOString().split("T")[0];
    const backupFile = path.join(__dirname, `all_databases_backup_${date}.sql`);
    const backupCommand = `mysqldump -u ${dbConfig.user} -p${dbConfig.password} --all-databases > ${backupFile}`;

    await new Promise((resolve, reject) => {
      exec(backupCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao fazer backup: ${error.message}`);
          reject(error);
        } else {
          console.log("Backup de todas as databases criado com sucesso!");
          resolve();
        }
      });
    });

    const sshConfig = {
      host: process.env.rhost,
      port: process.env.rport,
      username: process.env.ruser,
      password: process.env.rpassword,
    };

    const sshClient = new Client();
    await new Promise((resolve, reject) => {
      sshClient.on("ready", () => {
        const backuppath = process.env.backuppath;
        const remotePath = `${backuppath}/${empresa}/${bairro}/${path.basename(backupFile)}`;
        sshClient.sftp((err, sftp) => {
          if (err) {
            console.error(`Erro ao abrir SFTP: ${err.message}`);
            reject(err);
            sshClient.end();
            return;
          }

          sftp.fastPut(backupFile, remotePath, (uploadError) => {
            if (uploadError) {
              console.error(`Erro ao enviar arquivo via SFTP: ${uploadError.message}`);
              reject(uploadError);
            } else {
              console.log("Backup enviado com sucesso via SSH!");
              resolve();
            }

            // Remover o arquivo local de backup após o envio
            fs.unlink(backupFile, (unlinkError) => {
              if (unlinkError) {
                console.error(`Erro ao remover o arquivo local: ${unlinkError.message}`);
              } else {
                console.log("Arquivo local de backup removido com sucesso!");
              }
            });

            sshClient.end();
          });
        });
      }).on("error", (err) => {
        console.error(`Erro ao conectar via SSH: ${err.message}`);
        reject(err);
      }).connect(sshConfig);
    });

    const botToken = process.env.token;
    const chatId = process.env.chatid;
    const message = `Backup da filial ${bairro} realizado com sucesso no dia ${date}`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await axios.post(telegramUrl, {
      chat_id: chatId,
      text: message,
    });

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
            SELECT usuario.nome
            FROM usuario
            WHERE usuario.id =  ?
        `;
    const [usuarioNomeResult] = await pool.query(usuarioNomeQuery, [userno]);

    if (usuarioNomeResult.length === 0) {
      throw new Error("Usuário não encontrado.");
    }

    const usuarioNome = usuarioNomeResult[0].nome;

    // Consulta para obter o saldo inicial
    
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
                    
    const valortroco = `
            SELECT sum(bit4) AS troco
            FROM pay
            INNER JOIN pedidos
            ON pay.pedido = pedidos.pedido
            WHERE pedidos.data_fechamento = CURRENT_DATE AND pay.tipo = 1 AND pedidos.userno = ? AND cp = 0`
            
    const [ValorTroco] = await pool.query(valortroco, [usuarioNome]);
    const Valortroco = ValorTroco[0].troco
    
    const valortrocoS = `
            SELECT sum(bit4) AS troco
            FROM pay
            INNER JOIN pedidos
            ON pay.pedido = pedidos.pedido
            WHERE pedidos.data_fechamento = CURRENT_DATE AND pay.tipo = 1 AND pedidos.userno = ? AND pedidos.bit1 != 1 AND cp = 0`
            
    const [ValorTrocoS] = await pool.query(valortrocoS, [usuarioNome]);
    const ValortrocoS = ValorTrocoS[0].troco

    const valueCP = "SELECT val FROM sys WHERE id = 7";
    const [rvalueCP] = await pool.query(valueCP);
    const ValueCP = rvalueCP[0].val;
    
	const cpQuery = `select sum(valor_recebido + ${ValueCP} - valor_pedido) as valorcp from pay inner join pedidos on pedidos.pedido = pay.pedido where pedidos.data_fechamento = current_date and pay.tipo = 1 and pedidos.userno = ? and pedidos.bit1 !=1 and pay.cp=1`
	const [cpresult] = await pool.query(cpQuery, [usuarioNome]);
	const vcp = cpresult[0].valorcp || "0";
    
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
    
    // novo saldo inicial 
    const sdinicial = "SELECT sd_old as sdinicial FROM s_log WHERE user_cx = ? AND date = current_date";
    const [SdinicialTrue] = await pool.query(sdinicial, [userno]);
    const sdinicialFalse = "SELECT sd as sdinicial FROM cxlog WHERE date = current_date AND s0 = 1 AND userno = ?"
    const [SdinicialFalse] = await pool.query(sdinicialFalse, [userno]);
    
    let rdiario_saldoinicial
    
    if (SdinicialTrue.length > 0) {
      rdiario_saldoinicial = SdinicialTrue[0].sdinicial ?? 0
    } else {
      rdiario_saldoinicial = SdinicialFalse[0].sdinicial ?? 0
    }    
    
     const caixaDoDia = {
       recebido: Number(Valorrecebido),
       troco: Number(Valortroco),
       sangria: Number(sangria),
       rdiario_saldoinicial: Number(rdiario_saldoinicial)
     };
     
     const caixadia = caixaDoDia.recebido + caixaDoDia.rdiario_saldoinicial - caixaDoDia.troco - caixaDoDia.sangria 
     const caixaDia = parseFloat(caixadia.toFixed(2));
    
    const saldodinheiro = {
      recebido: Number(ValorrecebidoS),
      troco: Number(ValortrocoS),
      cp: Number(vcp)
    }  
    
    const rdiarioSaldoDinheiro = saldodinheiro.recebido - saldodinheiro.troco + saldodinheiro.cp

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

const QCP = `SELECT COUNT(pedido) * ${ValueCP} AS cupom_fidelidade FROM cp WHERE date = current_date`;
const  [resultCP] = await pool.query(QCP);
const cupomFidelidade = resultCP[0].cupom_fidelidade;
 
    return {
      success: true,
      usuarioNome,
      rdiario_saldoinicial,
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
      errors: ['Erro ao consultar sangria']
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
      errors: ['Erro ao consultar sangria']
    }
  }
}

async function sangria(user_cx, sdret, motivo, sdi) {
  try {
    const querySangria = `INSERT INTO s_log (sd_old, sdret, user_cx, motivo, date, time) VALUES (?,?,?,?, CURRENT_DATE, CURRENT_TIME)`;
    const valuesSangria = [sdi, sdret, user_cx, motivo];

    if (sdret == 0) {
      const errorMessage = `Erro na sangria: Não é possível realizar uma sangria no valor de R$ 0,00. Usuário: ${user_cx}`;
      await sendErrorMessage(errorMessage);
      return {
        success: false,
        error: ['Não é possível realizar uma sangria no valor de R$ 0,00']
      };
    } else if (motivo == 0 || motivo === null || motivo === "") {
      const errorMessage = `Erro na sangria: Motivo não informado. Usuário: ${user_cx}`;
      await sendErrorMessage(errorMessage);
      return {
        success: false,
        error: ['Por favor insira o motivo da sangria']
      };
    } else if (sdi < sdret) {
      const errorMessage = `Erro na sangria: Saldo insuficiente. Usuário: ${user_cx}`;
      //await sendErrorMessage(errorMessage);
      return {
        success: false,
        error: ['Saldo insuficiente']
      };
    }

    const [sangria] = await pool.query(querySangria, valuesSangria);

    return {
      success: true,
      message: ['Sangria realizada com sucesso']
    };

  } catch (error) {
    console.error(error);
    const errorMessage = `Erro no servidor durante a sangria: ${error.message}. Usuário: ${user_cx}`;
    await sendErrorMessage(errorMessage);
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
