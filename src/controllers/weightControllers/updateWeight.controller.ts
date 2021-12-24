import { Request, Response } from 'express';
import weightService from '@services/weight';

class UpdateWeightController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing.' });

            const { id } = req.params;

            const weight = await weightService.update(id, req.body);

            res.status(200).json({ weight });
        } catch (error) {
            console.error(error);

            res.status(500).json({ error });
        }
    }
}

export default new UpdateWeightController();