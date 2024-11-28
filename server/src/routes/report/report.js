const express = require("express");
const report = express.Router();
const { findVendasByPedido, findVendasPorIntervaloDatas, findVendasPorIntervaloDatasCancelados, detailsPagamento } = require('../../service/report');
const { sendErrorMessage } = require('../../utils/intTelegram');

report.get("/lvendas", async (req, res, next) => {
    try {
        const { pedido } = req.query;
        const result = await findVendasByPedido(pedido);
        
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /lvendas: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /lvendas: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

report.get("/rvendas", async (req, res) => {
    try {
        const { data_inicial, data_final } = req.query;
        const result = await findVendasPorIntervaloDatas(data_inicial, data_final);

        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /rvendas: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /rvendas: ${error.message}`);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

report.get("/cvendas", async (req, res) => {
    try {
        const { data_inicial, data_final } = req.query;
        const result = await findVendasPorIntervaloDatasCancelados(data_inicial, data_final);

        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /cvendas: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: ['Erro ao buscar pedidos cancelados'] });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /cvendas: ${error.message}`);
        res.status(500).json({ success: false, error: ['Erro ao buscar pedidos cancelados'] });
    }
});

report.get("/dvendas", async (req, res) => {
    try {
        const { pedido } = req.query;
        const result = await detailsPagamento(pedido);

        if (result.success) {
            res.status(200).json(result.data);
        } else {
            sendErrorMessage(`Erro na rota /dvendas: ${JSON.stringify(result)}`);
            res.status(500).json({ success: false, error: ['Erro ao buscar detalhes do pagamento do pedido'] });
        }
    } catch (error) {
        sendErrorMessage(`Erro na rota /dvendas: ${error.message}`);
        res.status(500).json({ success: false, error: ['Erro ao buscar detalhes do pagamento'] });
    }
});

module.exports = report;
