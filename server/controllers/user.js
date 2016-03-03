import BaseController from './base';
import Boom from 'boom';
import Config from '../config';
import LibAlpaca from '../../libalpaca';

export default class UserController extends BaseController {

  /**
   * @method registerNewUser
   */
  registerNewUser (request, reply) {
    const username = request.payload.username;
    const hashedPassword = request.payload.hashedPassword;

    const alpaca = new LibAlpaca(Config.LibAlpaca);

    alpaca.createUserFile(username, hashedPassword)
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
      .catch(() => {
        reply(Boom.wrap(new Error('User already exists.'), 400));
      });
  }

}
