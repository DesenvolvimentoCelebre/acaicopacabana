const express = require("express");

const { getcaixa, saldo, abrirCaixa, fechamento, relDiario } = require('../../service/system');
const { errorMiddleware } = require('../../utils/intTelegram');

const system = express.Router();

system.get("/gcx", async (req, res) => {
    try {
      const result = await getcaixa();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: ["Erro interno do servidor", error]});
    }
});

system.get("/sd", async (req, res) => {
    try {
      const result = await saldo();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: ["Erro interno do servidor", error]});
    }
});
  
system.post("/opc", async (req, res) => {
    try {
      const {s0, sd, userno} = req.body
      const result = await abrirCaixa(s0, sd, userno);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: ["Erro interno do servidor", error]});
    }
});

system.post("/fechamento", async (req, res) => {
    try {
      const {userno} = req.body;
      const result = await fechamento(userno);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: ["Erro interno do servidor", error]});
    }
});

system.get("/rdiario", async (req, res) => {
    try {
      const result = await relDiario();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, error: ["Erro interno do servidor", error]});
    }
});

  system.use(errorMiddleware)

  module.exports = system;