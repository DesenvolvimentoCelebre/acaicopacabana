const  pool  = require('../database/connection');

async function updateAcaiPrice(novoValor) {
  try {
    const query = "UPDATE produto SET preco_custo = ? WHERE id = 1";
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
    const query = "SELECT codigo_produto as id, nome as name_conf, preco_custo as val FROM produto WHERE codigo_produto = ?";
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

async function unlock(pp) {
  try {	
	const query = "UPDATE sys SET t1 = ? WHERE id = 6";
	const [result] = await pool.query(query, [pp]);

	return { success: true}
  } catch (error) {    
	return {
	success: false
	} 
    }
}

module.exports = {
  updateAcaiPrice,
  getConfigById,
  valueAcai,
  taxCoupon,
  lock,
  unlock
};
