import { Request, Response } from 'express';
import exerciseService, { DayWeek } from '@services/exercise';

class ListExercisesController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing.' });
            const skip = req?.query?.skip && Number(req.query.skip);
            const take = req?.query?.take && Number(req.query.take);
            const day = req?.query?.day ? req.query.day as DayWeek : undefined;

            const exercises = await exerciseService.listExercises(req.user_id, {
                skip,
                take,
                day,
            });

            res.status(200).json({ exercises });
        } catch (error) {
            console.error(error);

            res.status(500).json({ error });
        }
    }
}

export default new ListExercisesController();