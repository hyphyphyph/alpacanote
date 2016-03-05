import BaseController from './base';
import Boom from 'boom';
import Config from '../config';
import Fs from 'fs';
import LibAlpaca from '../../libalpaca';
import LibPgp from '../../libpgp';
import KeyLogic from '../logic/key';

export default class KeyController extends BaseController {

  _getKeyLogic () {
    return new KeyLogic({
      publicKeyFile: Config.Key.PublicKeyFile,
      privateKeyFile: Config.Key.PrivateKeyFile
    })
  };

  servePublicKey (request, reply) {
    this._getKeyLogic()
      .readPublicKey()
      .then((publicKey) => {
        reply(publicKey)
        .type('text/plain');
      })
      .catch((err) => {
        reply(Boom.wrap(err), 500);
      });
  }

  encryptMessage (request, reply) {
    const message = request.payload.message;

    this._getKeyLogic()
      .readPublicKey()
      .then((publicKey) => {
        new LibPgp().encryptMessageWithPublicKey(message, publicKey)
        .then((encryptedMessage) => {
          reply(encryptedMessage)
          .type('text/plain');
        });
      })
      .catch((err) => {
        reply(Boom.wrap(err), 500);
      });
  }
}
