import { Request, Response } from 'express';
import weightService from '@services/weight';

class ListWeightController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing.' });

            const { id } = req.params;

            const weight = await weightService.listWeight(req.user_id, Number(id));

            res.status(200).json({ weight });
        } catch (error) {
            console.error(error);

            res.status(500).json({ error });
        }
    }
}

export default new ListWeightController();