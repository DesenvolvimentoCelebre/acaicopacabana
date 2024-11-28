const  pool  = require('../database/connection');

async function license() {
  const query = `SELECT DATE_FORMAT(bitl1, "%d/%m/%Y") as 'Validade_Licensa' FROM sys WHERE id = 5`;
  
  const [result] = await pool.query(query)
  
  const license = result[0].Validade_Licensa
  
  return {
    success: true,
    validade: license
  }
}

module.exports = {
  license
}