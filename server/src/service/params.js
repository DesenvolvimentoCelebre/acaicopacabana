const  pool  = require('../database/connection');

async function updateAcaiPrice(novoValor) {
  try {
    const query = "UPDATE sys SET val = ? WHERE id = 1";
    const values = [novoValor];

    await pool.query(query, values);
    return { success: true, message: "Valor do açaí atualizado com sucesso" };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar valor do açaí, por favor contate o administrador", details: error };
  }
}

async function getConfigById(id) {
  try {
    const query = "SELECT * FROM sys WHERE id = ?";
    const [results] = await pool.query(query, [id]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar configuração por ID:', error);
    return { success: false, error: 'Por favor contate o administrador', details: error };
  }
}

async function valueAcai(id) {
  try {
    const query = "SELECT id, name_conf, val FROM sys WHERE id = ?";
    const [results] = await pool.query(query, [id]);
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar configuração por ID:', error);
    return { success: false, error: 'Por favor contate o administrador', details: error };
  }
}

async function taxCoupon(id) {
  try {
    const query = "SELECT * FROM empresa WHERE id = ?";
    const [results] = await pool.query(query, [id]);
    return { success: true, data: results};
  } catch (error) {
    console.error('Erro ao buscar configurações do cupom', error);
    return { success: false, error: 'Por favor contate o administrador', details: error}
  }
}

async function lock() {
  try {
        const query = "SELECT t1 AS pp FROM sys WHERE id = 6";
        const [result] = await pool.query(query);

        return {
                success: result
        }
  } catch (error) {
        return {
                success: false,
                error: error
        }
}
}


module.exports = {
  updateAcaiPrice,
  getConfigById,
  valueAcai,
  taxCoupon,
  lock
};
