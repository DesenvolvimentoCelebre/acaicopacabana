const express = require("express");
const {SerialPort} = require('serialport');
const config = express.Router();

const serialPort = new SerialPort({
  path: 'COM3', 
  baudRate: 4800, 
  autoOpen: false, 
});

serialPort.open((err) => {
  if (err) {
      console.error('Erro ao abrir a porta serial:', err.message);
  }
});

let weightData = '';

serialPort.on('data', (data) => {
  const dataStr = data.toString().replace(/[^\d]/g, '');

  if (dataStr) {
      weightData = Number(dataStr).toLocaleString('pt-BR'); 
  }
});

config.get('/peso', (req, res) => {
  res.send({ peso: weightData }); 
});

module.exports = config;
