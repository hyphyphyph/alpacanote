import Fs from 'fs';
import Hapi from 'hapi';

import LibPgp from '../libpgp';

import Server from './server';
import Config from './config';

var publicKeyExists = Fs.existsSync('public.key');
var privateKeyExists = Fs.existsSync('private.key');
if (!publicKeyExists || !privateKeyExists) {
  console.log('Generating Keys... Please wait.');
  new LibPgp()
    .generateKeys()
    .then((key) => {
      Fs.writeFileSync('public.key', key.publicKey);
      Fs.writeFileSync('private.key', key.privateKey);
      initServer();
    });
}
else {
  initServer();
}

function initServer () {
  var server = new Server({
    hostname: Config.Server.Hostname,
    port: Config.Server.Port
  });

  server.init(() => {
    server.start();
  });
}

