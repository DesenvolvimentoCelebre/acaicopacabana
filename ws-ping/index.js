const WebSocket = require("ws");
const ping = require("ping");

const wss = new WebSocket.Server({ port: 21176 });

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado");

  const pingIP = async (ip) => {
    try {
      const res = await ping.promise.probe(ip);
      return res;
    } catch (error) {
      console.error(`Erro ao pingar ${ip}:`, error);
      return null;
    }
  };

  const ipToPing = "192.168.10.12";

  const interval = setInterval(async () => {
    const result = await pingIP(ipToPing);
    if (result) {
      ws.send(JSON.stringify(result));
    }
  }, 5000);

  ws.on("close", () => {
    console.log("Cliente desconectado");
    clearInterval(interval);
  });
});

console.log("Servidor rodando");
