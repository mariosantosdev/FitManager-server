import { Request, Response } from "express";
import userService from '@services/user';

class UpdateUserController {
    async handle(req: Request, res: Response) {
        try {
            const userID = req.user_id;

            if (!userID) return res.status(401).json({ message: 'UserID is missing.' });

            await userService.delete(userID);

            res.status(201).json({ message: 'User deleted successfully.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error })
        }
    }
}

export default new UpdateUserController();