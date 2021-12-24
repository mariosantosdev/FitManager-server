import { Request, Response } from 'express';
import exerciseService from '@services/exercise';

class CreateExerciseController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing' });

            const { title, day_of_week, loop, delay_time } = req.body;

            if (!String(title.trim())) return res.status(400).json({ message: '"title" is missing.' })
            if (!String(day_of_week.trim())) return res.status(400).json({ message: '"day_of_week" is missing.' })

            const createdExercise = await exerciseService.create(
                req.user_id,
                {
                    title,
                    day_of_week,
                    delay_time,
                    loop
                }
            );

            res.status(201).json({ exercise: createdExercise });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error })
        }
    }
}

export default new CreateExerciseController();