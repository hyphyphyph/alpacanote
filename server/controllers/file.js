import BaseController from './base';
import Boom from 'boom';
import Config from '../config';
import LibAlpaca from '../../libalpaca';

export default class FileController extends BaseController {

  /**
   * @method getUserDirectoryListing
   */
  getUserDirectoryListing (request, reply) {
    const username = request.params.username;

    const alpaca = new LibAlpaca(Config.LibAlpaca);

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

}