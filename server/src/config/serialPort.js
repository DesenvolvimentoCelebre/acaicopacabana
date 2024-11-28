const {SerialPort} = require('serialport');

const serialPort = new SerialPort({
  path: "COM1",
  baudRate: 4800,
  autoOpen: false,
});
let weightData = "";

serialPort.on("data", (data) => {
  const dataStr = data.toString().replace(/[^\d]/g, "");
  if (dataStr) {
    weightData = Number(dataStr).toLocaleString("pt-BR");
  }
});

function openSerialPort() {
  return new Promise((resolve, reject) => {
    serialPort.open((err) => {
      if (err) {
        console.error("Erro ao abrir a porta serial:", err.message);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function getWeightData() {
  return weightData;
}

module.exports = {
  openSerialPort,
  getWeightData
};
