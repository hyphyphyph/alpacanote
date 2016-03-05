import Server from './server';
import Config from './config';
import KeyLogic from './logic/key';

new KeyLogic({
  publicKeyFile: Config.Key.PublicKeyFile,
  privateKeyFile: Config.Key.PrivateKeyFile
}).ensureKeyExists()
  .then(() => {
    var server = new Server({
      hostname: Config.Server.Hostname,
      port: Config.Server.Port
    });

    server.init(() => {
      server.start();
    });
  })
  .catch((err) => {
    throw err;
  });
