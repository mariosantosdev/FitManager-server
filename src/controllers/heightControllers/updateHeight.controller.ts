import { Request, Response } from 'express';
import heightService from '@services/height';

class UpdateHeightController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing.' });

            const { id } = req.params;

            const height = await heightService.update(Number(id), req.body);

            res.status(200).json({ height });
        } catch (error) {
            console.error(error);

            res.status(500).json({ error });
        }
    }
}

export default new UpdateHeightController();