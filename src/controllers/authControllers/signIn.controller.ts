import { Request, Response } from 'express';
import authService from '@services/auth';
import tokenService from '@services/token';

class SignInController {
    async handle(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!String(email.trim())) return res.status(400).json({ message: 'Email is missing.' })
            if (!String(password.trim())) return res.status(400).json({ message: 'Password is missing.' })

            const user = await authService.signIn(email, password);
            const token = await tokenService.generateToken(user.id);
            const refreshToken = await tokenService.generateRefreshToken(user.id);

            return res.status(201).json({ user, token, refreshToken });
        } catch (error) {
            console.error(error);

            res.status(500).json({ message: error });
        }
    }
}

export default new SignInController();