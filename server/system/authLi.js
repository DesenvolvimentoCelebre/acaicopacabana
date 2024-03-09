const { addDays } = require('date-fns');
const crypto = require('crypto');

const generateToken = (expirationDate) => {
  const secret = 'token'; // Utilize sua chave real aqui
  const dataString = expirationDate.toISOString();
  const hash = crypto.createHash('sha256').update(dataString + secret).digest('hex');
  return `${hash}|${dataString}`; // Formata a string de licença
};

const expirationDate = new Date();
expirationDate.setDate(26); // Define a data de expiração para 24
expirationDate.setMonth(1); // Janeiro é o mês 0
expirationDate.setFullYear(2024);

const token = generateToken(expirationDate);

console.log(token); // Imprime a licença no formato esperado
