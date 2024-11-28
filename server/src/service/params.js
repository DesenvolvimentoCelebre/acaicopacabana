const pool = require('../database/connection');
const { get } = require('../routes/params/params');

async function updateAcaiPrice(novoValor) {
  try {
    const query = "UPDATE produto SET preco_custo = ? WHERE codigo_produto = 1";
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
    return { success: true, data: results };
  } catch (error) {
    console.error('Erro ao buscar configurações do cupom', error);
    return { success: false, error: 'Por favor contate o administrador', details: error }
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

    return { success: true }
  } catch (error) {
    return {
      success: false
    }
  }
}

async function getlogo() {
  const query = "SELECT logo FROM empresa";
  const [result] = await pool.query(query);

  return [result]
}

async function getImp() {
  try {
    const query = "SELECT * FROM imp";
    const [result] = await pool.query(query);

    return {
      success: true,
      message: result
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: ["Erro ao listar impressoras"]
    }
  }
}

async function insertImp(label, ip) {
  try {
    const query = "INSERT INTO imp (label, ip) VALUES (?, ?)";
    const [result] = await pool.query(query, [label, ip]);

    return {
      success: true,
      message: "Impressora cadastrada com sucesso"
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: ["Erro ao cadastrar impressora "]
    }
  }
}

async function delImp(id) {
  try {
    const query = "DELETE FROM imp WHERE id = ?";
    const [result] = await pool.query(query, [id])

    return {
      success: true,
      message: ["Impressora deletada com sucesso"]
    }
  } catch (error) {
    return {
      success: false,
      message: ["Erro ao deletar impressora"]
    }
  }
}

async function reciviedType() {
  try {
    const query = "SELECT val FROM sys WHERE id = 8";
    const [results] = await pool.query(query);
    const result = results[0].val

    return {
      success: true,
      bit: result
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: error
    }
  }
}

async function putReciviedTpe(bit) {
  try {
    const query = "UPDATE sys SET val = ? WHERE id = 8";
    const [result] = await pool.query(query, [bit])

    return {
      success: true,
      message: [' Modo de recebimento atualizado com sucesso']
    }
  } catch (error) {
    return {
      success: false,
      error: (error)
    }
  }
}

module.exports = {
  updateAcaiPrice,
  getConfigById,
  valueAcai,
  taxCoupon,
  lock,
  unlock,
  getlogo,
  getImp,
  insertImp,
  delImp,
  reciviedType,
  putReciviedTpe
};
