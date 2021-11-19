import { Router } from "express";

import signUpController from '@controllers/authControllers/signUp.controller';
import signInController from '@controllers/authControllers/signIn.controller';
import forgetPassword from '@controllers/authControllers/forgetPassword.controller';

import userUpdateController from '@controllers/userControllers/update.controller';
import userDeleteController from '@controllers/userControllers/delete.controller';

import createExerciseController from "@controllers/exerciseControllers/createExercise.controller";
import listExercisesController from "@controllers/exerciseControllers/listExercises.controller";
import listExerciseController from "@controllers/exerciseControllers/listExercise.controller";
import updateExerciseController from "@controllers/exerciseControllers/updateExercise.controller";
import deleteExerciseController from "@controllers/exerciseControllers/deleteExercise.controller";

import tokenController from '@controllers/tokenControllers/refreshToken.controller';

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

// Exercises Routes
routes.post('/exercises', middlewareAuth.handle, createExerciseController.handle)
routes.get('/exercises', middlewareAuth.handle, listExercisesController.handle)
routes.get('/exercises/:id', middlewareAuth.handle, listExerciseController.handle)
routes.put('/exercises/:id', middlewareAuth.handle, updateExerciseController.handle)
routes.delete('/exercises/:id', middlewareAuth.handle, deleteExerciseController.handle)

// Weight Routes
routes.get('/weight', middlewareAuth.handle, listExercisesController.handle)
export default routes;