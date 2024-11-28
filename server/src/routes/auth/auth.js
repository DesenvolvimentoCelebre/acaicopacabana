const express = require("express");
const { loginUser, authlib } = require('../../service/auth');

const { errorMiddleware } = require('../../utils/intTelegram');

const auth = express.Router();

auth.post("/login", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, errors: ["Preencha os campos usuário e senha"] });
    }

    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
      return res.status(400).json({ success: false, errors: ["Missing 'usuario' or 'senha' in request body"] });
    }

    const result = await loginUser(usuario, senha);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, errors: ["Erro no servidor"], details: error });
    next(new Error(`Erro ao fazer login ${error}`));
  }
});

auth.post("/liberacao", async (req, res) => {
  try {
    if (!req.body) {
      return res.status(500).json({ success: false, error: ['Body vazio']});
    }
    
    const {senha, pedido, operador_liberacao} = req.body;
    const result = await authlib(senha, pedido, operador_liberacao);
  
    if (result.success) {
      res.status(200).json(result)
    } else {
      res.status(401).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: ["Erro no servidor"]});
    next(new Error(`Erro ao liberar pedido, ${error}`));
  }
});

auth.use(errorMiddleware)

module.exports = auth;
