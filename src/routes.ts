import { Router } from "express";

import signUpController from '@controllers/authControllers/signUp.controller';
import signInController from '@controllers/authControllers/signIn.controller';
import forgetPassword from '@controllers/authControllers/forgetPassword.controller';
import tokenController from '@controllers/tokenControllers/refreshToken.controller';
import userUpdateController from '@controllers/userControllers/update.controller';
import userDeleteController from '@controllers/userControllers/delete.controller';

import middlewareAuth from "./middlewares/ensureAuth";

const routes = Router();

// Home page about API
routes.get('/', (req, res) => res.sendFile(`${__dirname}/view/index.html`));

// Token Routes
routes.post('/newToken/:token', tokenController.handle)

// Authentication Routes
routes.post('/signup', signUpController.handle);
routes.post('/signin', signInController.handle);
routes.post('/forgetPassword', forgetPassword.handle);

// User Routes
routes.put('/user', middlewareAuth.handle, userUpdateController.handle)
routes.delete('/user', middlewareAuth.handle, userDeleteController.handle)

export default routes;