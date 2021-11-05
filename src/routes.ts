import { Router } from "express";

import signUpController from '@controllers/authControllers/signUp.controller';

const routes = Router();

// Home page about API
routes.get('/', (req, res) => res.sendFile(`${__dirname}/view/index.html`));

// Authentication Routes
routes.post('/signup', signUpController.handle);

export default routes;