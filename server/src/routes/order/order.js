const express = require("express");
const order = express.Router();

const { sendErrorMessage } = require('../../utils/intTelegram');
const { nextOrder, createOrder, infoNextOrder, findProductById } = require('../../service/order');

order.get("/nped", async (req, res) => {
    try {
        const result = await nextOrder();
        if (result.success) {
            res.status(200).json(result);
        } else {
            sendErrorMessage(`Erro na rota /nped: ${JSON.stringify(result)}`);
            res.status(500).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /nped: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

order.post("/ped", async (req, res) => {
    try {
        if (!req.body || !req.body.pedido || !req.body.pedido.produtos || !req.body.pedido.pagamentos) {
            return res.status(400).send("Formato de pedido inválido");
        }
        
        const order = req.body.pedido;
        const result = await createOrder(order);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            sendErrorMessage(`Erro na rota /ped: ${JSON.stringify(result)}`);
            res.status(500).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /ped: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

order.get("/nextped", async (req, res) => {
    try {
        const result = await infoNextOrder();
        if (result.success) {
            res.status(200).json(result);
        } else {
            sendErrorMessage(`Erro na rota /nextped: ${JSON.stringify(result)}`);
            res.status(500).json(result);
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /nextped: ${error.message}`);
        res.status(500).json({ success: false, error: "Erro interno do servidor", details: error });
    }
});

order.get("/produtoid", async (req, res) => {
    try {
        const { codigo_produto } = req.query;
        const result = await findProductById(codigo_produto);

        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /produtoid: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /produtoid: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

module.exports = order;
