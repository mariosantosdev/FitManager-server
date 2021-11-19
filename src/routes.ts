import { Router } from "express";

import signUpController from '@controllers/authControllers/signUp.controller';
import tokenController from '@controllers/tokenControllers/refreshToken.controller';
import middlewareAuth from "./middlewares/ensureAuth";

const routes = Router();

// Home page about API
routes.get('/', (req, res) => res.sendFile(`${__dirname}/view/index.html`));

// Token Routes
routes.post('/newToken/:token', tokenController.handle)

// Authentication Routes
routes.post('/signup', signUpController.handle);

export default routes;