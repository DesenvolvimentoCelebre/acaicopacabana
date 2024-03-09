const { parseISO } = require('date-fns');

function verifyLicense(licenseString) {
  const [token, expirationDateString] = licenseString.split('|');
  const expirationDate = parseISO(expirationDateString);

  if (expirationDate < new Date()) {
    return false;
  }
  return true;
}

const licenseString = "8cd5b89e018bce4831e380057886246fe105ed2efdf691a835b93cffdb844571|2024-02-26T23:19:37.602Z";

const isValid = verifyLicense(licenseString);

console.log(isValid); 

module.exports = {
    verifyLicense
}
