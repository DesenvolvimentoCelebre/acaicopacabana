const express = require("express");
const { stockList, registerProduct, allProducts, serachProductByName, productUpdate, deleteProduto, postsaldo } = require('../../service/stock');
const { sendErrorMessage } = require('../../utils/intTelegram');

const stock = express.Router();

stock.get("/estoque", async (req, res, next) => {
    try {
        const result = await stockList();
        if (result.success) {
            res.status(200).json(result);
        } else {
            sendErrorMessage(`Erro na rota /estoque: ${JSON.stringify(result)}`);
            res.status(404).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /estoque: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

stock.post("/produto", async (req, res, next) => {
    try {
        const productData = req.body;
        const result = await registerProduct(productData);
        if (result.success) {
            res.status(201).json(result);
        } else {
            sendErrorMessage(`Erro na rota /produto: ${JSON.stringify(result)}`);
            res.status(400).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /produto: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

stock.get("/produto", async (req, res, next) => {
    try {
        const result = await allProducts();
        if (result.success) {
            res.status(200).json(result);
        } else {
            sendErrorMessage(`Erro na rota /produto (GET): ${JSON.stringify(result)}`);
            res.status(500).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /produto (GET): ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

stock.get("/busca", async (req, res) => {
    try {
        const { nome } = req.query;
        const result = await serachProductByName(nome);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            sendErrorMessage(`Erro na rota /busca: ${JSON.stringify(result)}`);
            res.status(500).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /busca: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

stock.put("/attestoque", async (req, res, next) => {
    try {
        const { codigo_produto, quantidade, bit, categoria, nome, preco_custo } = req.body;
        const result = await productUpdate({ codigo_produto, quantidade, bit, categoria, nome, preco_custo });
        
        if (result.success) {
            res.status(201).json({ success: true, message: 'Estoque atualizado com sucesso', details: result });
        } else {
            sendErrorMessage(`Erro na rota /attestoque: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /attestoque: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

stock.delete("/dell", async (req, res, next) => {
    try {
        const { id } = req.body;
        const result = await deleteProduto(id);

        if (result.success) {
            res.status(200).json({ success: true, message: 'Estoque deletado com sucesso' });
        } else {
            sendErrorMessage(`Erro na rota /dell: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: ['Erro ao deletar produto'] });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /dell: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

stock.post("/stock/sd", async (req, res) => {
    const { saldo, fornecedor, productid } = req.body;

    const results = await postsaldo({ saldo, fornecedor, productid})
    
    if (results.success === true) {
        res.status(200).json(results)
    } else {
        sendErrorMessage(`Erro na rota /stock/saldo POST: ${JSON.stringify(results)}`)
        res.status(500).json(results)
    }
})

module.exports = stock;
