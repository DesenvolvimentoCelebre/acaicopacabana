const express = require("express");

const { stockList, registerProduct, allProducts, serachProductByName, productUpdate, deleteProduto } = require('../../service/stock');
const { errorMiddleware } = require('../../utils/intTelegram');

const stock = express.Router();

stock.get("/estoque", async (req, res, next) => {
  try {
    const result = await stockList();
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    const err = error;
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: err });
    console.error(err);
    // next(new Error(`Erro ao listar estoque. ${err}`))
  }
});

stock.post("/produto", async (req, res, next) => {
  try {
    const productDate = req.body;
    const result = await registerProduct(productDate);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    const err = error;
    next(new Error(`Erro ao cadastrar produto, ${err}`))
  }
});

stock.get("/produto", async (req, res, next) => {
    try {
      const result = await allProducts();
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
      const err = error;
      next(new Error(`Erro ao listar todos os produtos ${err}`))
    }
});

stock.get("/busca", async (req, res) => {
  try {
    const { nome } = req.query;
    const result = await serachProductByName(nome);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
  }
});

stock.put("/attestoque", async (req, res, next) => {
  try {
    const { codigo_produto, quantidade, bit, categoria, nome, preco_custo } = req.body;
    const result = await productUpdate({codigo_produto, quantidade, bit, categoria, nome, preco_custo});
    if (result.success) {
      res.status(201).json({ success: true, message: 'Estoque atualizado com sucesso', details: result});
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Erro ao atualizar o estoque:', error);
    res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    next(new Error(`Erro ao atualizar estoque, ${error}`))
  }
});

stock.delete("/dell", async (req, res, next) => {
  try {

    const { id } = req.body;
    const result = await deleteProduto(id);

    if (result.success) {
      res.status(200).json({ success: true, message: 'Estoque deletado com sucesso'})
    } else {
      res.status(500).json({ success: false, error: [' Erro ao deleter produto']})
    }
  } catch (erro) {
    return {
      success: false,
      error: "Erro interno do servidor"
    }
  }
})

stock.use(errorMiddleware)

module.exports = stock;
