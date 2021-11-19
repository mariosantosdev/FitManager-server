import { Request, Response } from 'express';
import exerciseService from '@services/exercise';

class UpdateExerciseController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing.' });

            const { id } = req.params;

            const exercise = await exerciseService.update(Number(id), req.body);

            res.status(200).json({ exercise });
        } catch (error) {
            console.error(error);

            res.status(500).json({ error });
        }
    }
}

export default new UpdateExerciseController();