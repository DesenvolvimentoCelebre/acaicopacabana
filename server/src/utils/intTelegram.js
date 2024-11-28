const axios = require('axios');
const dotenv = require('dotenv').config()
const pool = require('../database/connection')

const botToken = process.env.token;
const chatId = process.env.chatid;

const sendErrorMessage = async (errorMessage) => {
  const query = "SELECT bairro FROM empresa";
  const [results] = await pool.query(query);
  const filial = results[0].bairro;
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: `Problema na filial: ${filial}\n${errorMessage}`,
      disable_web_page_preview: true,
      parse_mode: 'html'
    });
  } catch (error) {
  }
};

const errorMiddleware = (err, req, res, next) => {
  const errorMessage = `Erro na rota ${req.path}:\nMensagem: ${err.message}\nStack: ${err.stack}`;
  sendErrorMessage(errorMessage);
  res.status(500).json({ message: 'Ocorreu um erro interno. Estamos trabalhando nisso.' });
};

module.exports = { errorMiddleware, sendErrorMessage };
