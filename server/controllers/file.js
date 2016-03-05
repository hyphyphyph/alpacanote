import BaseController from './base';
import Boom from 'boom';
import Config from '../config';
import LibAlpaca from '../../libalpaca';

export default class FileController extends BaseController {

  _getLibAlpaca () {
    return new LibAlpaca({
      dataDir: Config.LibAlpaca.DataDir,
      salt: Config.LibAlpaca.Salt,
      pepper: Config.LibAlpaca.Pepper
    });
  }

  getUserDirectoryListing (request, reply) {
    const username = request.params.username;

    const alpaca = this._getLibAlpaca();
    alpaca.readUserFile(username)
      .then((userData) => {

        alpaca.getEncryptedUserDirectoryListing(username)
          .then((encryptedListing) => {
            reply({
              statusCode: 200,
              encryptedListing: encryptedListing,
              encryptedUuid: userData.encryptedUuid
            });
          })
          .catch((err) => {
            reply(Boom.wrap(err, 400));
          });

      })
      .catch((err) => {
        reply(Boom.wrap(err, 404));
      });
  }

  getFile(request, reply) {
    const username = request.params.username;
    const filename = request.params.filename;

    const alpaca = this._getLibAlpaca();
    alpaca.getFile(username, filename)
      .then((encryptedFile) => {
        reply({
          statusCode: 200,
          encryptedFile: encryptedFile
        });
      })
      .catch((err) => {
        reply(Boom.wrap(err, 404));
      });
  }

}
