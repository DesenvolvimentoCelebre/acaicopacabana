const Tesseract = require('tesseract.js');
const path = require('path');

const imagemPath = path.join(__dirname, './prix.png');

Tesseract.recognize(
  imagemPath,
  'eng',
  {
    logger: info => console.log(info),
  }
).then(({ data: { text } }) => {
  const numerosEncontrados = extrairNumeros(text);
  console.log('Números encontrados:', numerosEncontrados);
}).catch(error => {
  console.error('Erro ao processar a imagem:', error);
});

function extrairNumeros(texto) {
  const regexNumeros = /[-+]?\b\d+(\.\d+)?\b/g;
  return texto.match(regexNumeros) || [];
}
