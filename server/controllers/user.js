import BaseController from './base';
import Boom from 'boom';
import Config from '../config';
import Fs from 'fs';
import LibAlpaca from '../../libalpaca';
import LibPgp from '../../libpgp';

export default class UserController extends BaseController {

  /**
   * @method registerNewUser
   */
  registerNewUser (request, reply) {
    const username = request.payload.username;
    const encryptedPassword = request.payload.encryptedPassword;

    var privateKey = Fs.readFile('private.key', (err, privateKey) => {
      if (err) {
        reply(Boom.wrap(err), 500);
      }
      else {
        new LibPgp().decryptMessageWithPrivateKey(encryptedPassword, privateKey)
          .then((unencryptedPassword) => {
            const alpaca = new LibAlpaca({
              dataDir: Config.LibAlpaca.DataDir,
              salt: Config.LibAlpaca.Salt,
              pepper: Config.LibAlpaca.Pepper
            });
            alpaca.createUserFile(username, unencryptedPassword)
              .then(() => {

                alpaca.createUserDirectory(username)
                  .then(() => {
                    reply({
                      statusCode: 200,
                      message: 'success'
                    });
                  })
                  .catch((err) => {
                    reply(Boom.wrap(err, 500));
                  });

              })
              .catch((err) => {
                reply(Boom.wrap(err, 400));
              });
          })
          .catch((err) => {
            reply(Boom.wrap(err), 500);
          });
      }
    });
  }

}
