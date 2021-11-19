import { Request, Response } from "express";
import userService from '@services/user';
import { User } from '@prisma/client';

class UpdateUserController {
    async handle(req: Request, res: Response) {
        try {
            const userID = req.user_id;

            if (!userID) return res.status(401).json({ message: 'UserID is missing.' });

            const data: User = req.body;

            const user = await userService.update(userID, data);

            res.status(201).json({ user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error })
        }
    }
}

export default new UpdateUserController();