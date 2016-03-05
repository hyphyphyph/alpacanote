import Joi from 'joi';

import FileController from './controllers/file';
import KeyController from './controllers/key';
import UserController from './controllers/user';

const Routes = [
  {
    method: 'GET',
    path: '/publickey',
    handler: (request, reply) => {
      new KeyController().servePublicKey(request, reply);
    }
  },

  {
    method: 'POST',
    path: '/encrypt',
    handler: (request, reply) => {
      new KeyController().encryptMessage(request, reply);
    }
  },

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
          encryptedPassword: Joi.string().required()
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
  },

  {
    method: 'GET',
    path: '/file/{username}/{filename}',
    handler: (request, reply) => {
      new FileController().getFile(request, reply);
    }
  }
];

export default Routes;
