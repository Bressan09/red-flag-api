import authController from './controller/authController';
import restify from 'restify';

const routes = (server: restify.Server): void => {
  server.get('/', (req, res) => {
    res.send(`Api server in running (${new Date()})`);
  });

  server.post('/auth/login', authController.login);

  server.post('/auth/verify', authController.verify);

  server.post('/auth/register', authController.register);
};

export default routes;
