import { Request, Response } from "express";
import userService from '@services/user';

class UpdatePasswordController {
    async handle(req: Request, res: Response) {
        try {
            const userID = req.user_id;

            if (!userID) return res.status(401).json({ message: 'UserID não encontrado.' });

            if (!req.body?.password) return res.status(400).json({ message: '"Senha" não informada.' });
            if (!req.body?.newPassword) return res.status(400).json({ message: '"Nova Senha" não informada.' });

            const { password, newPassword } = req.body;

            const user = await userService.updatePassword(userID, password, newPassword);

            res.status(201).json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error })
        }
    }
}

export default new UpdatePasswordController();