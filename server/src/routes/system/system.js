const express = require("express");

const { getcaixa, saldo, abrirCaixa, fechamento, relDiario } = require('../../service/system');
const { errorMiddleware } = require('../../utils/intTelegram');

const system = express.Router();

system.get("/gcx", async (req, res) => {
    try {
        const { userno } = req.query
        const result = await getcaixa(userno);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.get("/sd", async (req, res) => {
    try {
        const { userno } = req.query;
        const result = await saldo(userno);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.post("/opc", async (req, res) => {
    try {
<<<<<<< HEAD
      const {s0, sd, userno} = req.body
      const result = await abrirCaixa(s0, sd, userno);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
=======
        const { s0, sd, userno } = req.body
        const result = await abrirCaixa(s0, sd, userno);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
>>>>>>> 95497145d8ee9bc651005392d0ec800e96824e5c
    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.post("/fechamento", async (req, res) => {
  try {
      const { userno } = req.body;
      
      if (!userno) {
          return res.status(400).json({ success: false, error: ["userno é necessário"] });
      }
      
      const result = await fechamento(userno);
      
      if (result.success) {
          res.status(200).json(result);
      } else {
          res.status(500).json(result);
      }
  } catch (error) {
      res.status(500).json({ success: false, error: ["Erro interno do servidor", error.message] });
  }
});

system.get("/rdiario", async (req, res) => {
    try {
<<<<<<< HEAD
      const result = await relDiario();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
=======
        const { userno } = req.body
        const result = await fechamento(userno);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
>>>>>>> 95497145d8ee9bc651005392d0ec800e96824e5c
    } catch (error) {
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.get("/rdiario", async (req, res) => {
    try {

        const { userno } = req.query;
        const result = await relDiario(userno);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: ["Erro interno do servidor", error] });
    }
});

system.use(errorMiddleware)

module.exports = system;