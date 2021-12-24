import { Request, Response } from 'express';
import exerciseService from '@services/exercise';

class DeleteExerciseController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing.' });

            const { id } = req.params;

            const exercise = await exerciseService.delete(id);

            res.status(200).json({ exercise });
        } catch (error) {
            console.error(error);

            res.status(500).json({ error });
        }
    }
}

export default new DeleteExerciseController();