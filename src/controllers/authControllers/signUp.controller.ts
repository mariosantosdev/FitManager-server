import { Request, Response } from 'express';
import authService from '@services/auth';
import tokenService from '@services/token';

class SignUpController {
    async handle(req: Request, res: Response) {
        try {
            const { name, email } = req.body;
            let { password } = req.body;

            if (!String(name.trim())) return res.status(400).json({ message: 'Campo nome inválido.' });
            if (!String(email.trim())) return res.status(400).json({ message: 'Campo email inválido.' })
            if (!String(password.trim())) return res.status(400).json({ message: 'Campo senha inválido.' })

            const userAlreadyExist = await authService.verifyUserAlreadyExist(email);
            if (userAlreadyExist) return res.status(400).json({ message: 'E-mail já cadastrado.' })

            const user = await authService.createUser({ email, password, name });
            const token = await tokenService.generateToken(user.id);
            const refreshToken = await tokenService.generateRefreshToken(user.id);

            return res.status(201).json({ user, token, refreshToken });
        } catch (error) {
            console.error(error);

            res.status(500).json({ message: error });
        }
    }
}

export default new SignUpController();