import BaseController from './base';
import Boom from 'boom';
import Config from '../config';
import Fs from 'fs';
import LibAlpaca from '../../libalpaca';
import LibPgp from '../../libpgp';

export default class KeyController extends BaseController {

  /**
   * @method servePublicKey
   */
  servePublicKey (request, reply) {
    Fs.readFile('public.key', (err, publicKey) => {
      if (err) {
        reply(Boom.wrap(err), 500);
      }
      else {
        reply(publicKey)
          .type('text/plain');
      }
    });
  }

  /**
   * @method encryptMessage
   */
  encryptMessage (request, reply) {
    const message = request.payload.message;

    Fs.readFile('public.key', (err, publicKey) => {
      if (err) {
        reply(Boom.wrap(err), 500);
      }
      else {
        new LibPgp().encryptMessageWithPublicKey(message, publicKey)
          .then((encryptedMessage) => {
            reply(encryptedMessage)
              .type('text/plain');
          });
      }
    })
  }

}
