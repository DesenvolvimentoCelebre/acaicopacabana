const express = require("express");

const { getcaixa, saldo } = require('../../service/system');
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
  
  system.use(errorMiddleware)

  module.exports = system;