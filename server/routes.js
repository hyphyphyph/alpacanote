import Joi from 'joi';

import FileController from './controllers/file';
import UserController from './controllers/user';

const Routes = [
  {
    method: 'POST',
    path: '/user',
    handler: (request, reply) => {
      new UserController().registerNewUser(request, reply);
    },
    config: {
      validate: {
        payload: {
          username: Joi.string().required(),
          hashedPassword: Joi.string().required()
        }
      }
    }
  },

  {
    method: 'GET',
    path: '/file/{username}',
    handler: (request, reply) => {
      new FileController().getUserDirectoryListing(request, reply);
    }
  }
];

export default Routes;

