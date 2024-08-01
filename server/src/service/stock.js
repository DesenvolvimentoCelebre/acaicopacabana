const pool  = require('../database/connection');

async function stockList() {
  try {
    const query = `
      SELECT
        nome,
        categoria,
        codigo_produto,
        codigo_personalizado,
        preco_custo,
        tipo,
        SUM(quantidade) as quantidade,
        bit,
        img_produto
      FROM
        produto
      GROUP BY 
        nome, categoria, codigo_produto, codigo_personalizado, preco_custo, tipo, quantidade, bit, img_produto
      ORDER BY 
        codigo_produto ASC
    `;

    const [results] = await pool.query(query);

    if (results.length === 0) {
      return { success: true, message: "Você não possui itens no estoque" };
    } else {
      return { success: true, data: results };
    }
  } catch (error) {
    return { success: false, error: "Por favor contatar o administrador", details: error };
  }
}

async function registerProduct(productDate) {
  try {
    const {
      nome,
      categoria,
      codigo_personalizado,
      preco_custo,
      tipo,
      quantidade,
      img_produto,
    } = productDate;

    const query = `INSERT INTO produto (nome, categoria, codigo_personalizado, preco_custo, tipo, quantidade, img_produto, bit) VALUES (?, ?, ?, ?, ?, ?, ?,0)`;
    const values = [
      nome,
      categoria,
      codigo_personalizado,
      preco_custo,
      tipo,
      quantidade,
      img_produto,
    ];

    await pool.query(query, values);
    return { success: true, message: "Produto cadastrado com sucesso" };
  } catch (error) {
    return { success: false, error: "Erro ao cadastrar produto", details: error };
  }
}

async function allProducts() {
    try {
      const query = "SELECT * FROM estoque";
      const [results] = await pool.query(query);
  
      if (results.length === 0) {
        return { success: true, message: "Não existem produtos cadastrados" };
      } else {
        return { success: true, data: results };
      }
    } catch (error) {
      return { success: false, error: "Por favor contatar o suporte", details: error };
    }
  }
  
  async function serachProductByName(nome) {
    try {
      const query = `SELECT * FROM produto WHERE nome LIKE ? and bit != 1`;
      const values = [`${nome}%`];
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

  async function inactive(id, bit) {
    try {
      
    const query = `UPDATE set bit = ? WHERE id = ?`;
    const values = [id, bit];

    const [results] = await pool.query(query, values);

    if (results.length === 0) {
      return {
        success: true,
        error: ["Erro ao inativar produto, por favor contate o administrador"]
      }
    } else {
      return {
        success: true,
        message: results
      }
    }
    } catch (error) {
      return {
        success: false,
        error: ['Erro no servidor, por favor entrar em contato com o administrador']
      }
    }
  }

<<<<<<< HEAD
  async function productUpdate({ bit, quantidade, preco_custo, codigo_produto }) {
    try {
        let query = 'UPDATE produto SET bit = ?';
        const values = [bit];
  
        if (quantidade && quantidade.trim() !== '') {
            query += ', quantidade = ?';
            values.push(quantidade);
        }
  
        if (preco_custo && preco_custo.trim() !== '') {
            query += ', preco_custo = ?';
            values.push(preco_custo);
        }
  
        query += ' WHERE codigo_produto = ?';
        values.push(codigo_produto);
  
        await pool.query(query, values);
=======
  async function productUpdate({ bit, quantidade, codigo_produto, preco_custo }) {
    try {
        // Inicializa a consulta SQL e os valores
        let query = 'UPDATE produto SET bit = ?';
        const values = [bit];
        
        // Adiciona a condição para atualizar quantidade, se fornecida
        if (quantidade !== undefined && quantidade !== null) {
            query += ', quantidade = ?';
            values.push(quantidade);
        }

        // Adiciona a condição para atualizar preco_custo, se fornecido
        if (preco_custo !== undefined && preco_custo !== null) {
            query += ', preco_custo = ?';
            values.push(preco_custo);
        }
        
        // Completa a consulta com a condição WHERE
        query += ' WHERE codigo_produto = ?';
        values.push(codigo_produto);

        // Executa a consulta
        await pool.query(query, values);
        
>>>>>>> 95497145d8ee9bc651005392d0ec800e96824e5c
        return { success: true, message: 'Produto atualizado com sucesso' };
    } catch (error) {
        return { success: false, error: ['Erro interno do servidor'] };
    }
}

  

module.exports = {
  stockList,
  registerProduct,
  allProducts,
  serachProductByName,
  productUpdate
};
