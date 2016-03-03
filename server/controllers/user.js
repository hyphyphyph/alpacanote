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

    new LibAlpaca(Config.LibAlpaca).createUserFile(username, hashedPassword)
      .then(() => {
        reply({
          statusCode: 200,
          message: 'success'
        });
      })
      .catch(() => {
        reply(Boom.wrap(new Error('User already exists.'), 400));
      });
  }

}
