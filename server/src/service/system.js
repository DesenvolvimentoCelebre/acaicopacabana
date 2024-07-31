const pool  = require('../database/connection');

async function getcaixa() {
    try {
      const query = `SELECT s0 FROM cxlog WHERE date =  CURDATE()`;

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
SELECT
	sum(pedno.valor_unit) as saldo
FROM 
	pedno
INNER JOIN
	pay
ON
	pedno.pedido = pay.pedido
WHERE
	pedno.bit2 = 1 AND pay.tipo = 0`;

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
  
      const query = `INSERT INTO cxlog (s0, sd, date, time) VALUES (?,?,CURRENT_DATE(),CURRENT_TIME())`;
      const values = [ s0, sd ];
  
      await pool.query(query, values);
      return { success: true, message: "Caixa aberto" };
    } catch (error) {
      return { success: false, error: "Erro ao abrir caixa", details: error };
    }
  }

module.exports = {
    getcaixa,
    saldo,
    abrirCaixa
}