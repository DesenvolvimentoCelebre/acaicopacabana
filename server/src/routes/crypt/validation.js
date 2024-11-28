const express = require("express");

const crypt = express.Router();

const { errorMiddleware } = require('../../utils/intTelegram');
const { license } = require('../../service/crypt');

crypt.get("/validation", async (req, res) => {
  try {
    const result = await license();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: ['Erro ao puxar data de expiração da licensa']
    }
  }
})


crypt.use(errorMiddleware);

module.exports = crypt;
