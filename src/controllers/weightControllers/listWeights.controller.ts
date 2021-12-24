import { Request, Response } from 'express';
import weightService from '@services/weight';

class ListWeightsController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing.' });
            const skip = req?.query?.skip && Number(req.query.skip);
            const take = req?.query?.take && Number(req.query.take);

            const weights = await weightService.listWeights(req.user_id, {
                skip,
                take
            });

            res.status(200).json({ weights });
        } catch (error) {
            console.error(error);

            res.status(500).json({ error });
        }
    }
}

export default new ListWeightsController();