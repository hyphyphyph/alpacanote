import UserController from './controllers/user';

const Routes = [
  {
    method: 'POST',
    path: '/user',
    handler: (request, reply) => {
      new UserController().registerNewUser(request, reply);
    }
  }
];

export default Routes;

