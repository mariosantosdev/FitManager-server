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
            await tokenService.generateRefreshToken(user.id);

            return res.status(201).json({ user, token });
        } catch (error) {
            console.error(error);

            res.status(500).json({ message: error });
        }
    }

    async usingToken(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID não encontrado.' });

            const user = await authService.signInWithToken(req.user_id);
            const token = await tokenService.generateToken(req.user_id);

            return res.status(201).json({ user, token });
        } catch (error) {
            console.error(error);

            res.status(500).json({ message: error });
        }
    }
}

export default new SignInController();