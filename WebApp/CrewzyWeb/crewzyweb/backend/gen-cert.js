import selfsigned from 'selfsigned';
import fs from 'fs';

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

fs.writeFileSync('./cert.pem', pems.cert);
fs.writeFileSync('./key.pem', pems.private);

console.log('✅ Certificatele key.pem și cert.pem au fost generate cu succes!');