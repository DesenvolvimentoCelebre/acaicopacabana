const pool  = require('../database/connection');

async function getcaixa({s0, sd}) {
    try {
      const query = `SELECT s0 FROM cxlog WHERE date =  CURDATE()`;

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

module.exports = {
    getcaixa
}