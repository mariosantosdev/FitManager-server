import { Request, Response } from 'express';
import weightService from '@services/weight';

class CreateWeightController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing' });

            const { title, date } = req.body;

            if (!String(title.trim())) return res.status(400).json({ message: '"title" is missing.' })
            if (!String(date.trim())) return res.status(400).json({ message: '"day_of_week" is missing.' })

            const createdWeight = await weightService.create(req.user_id, { title, date });

            res.status(201).json({ weight: createdWeight });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error })
        }
    }
}

export default new CreateWeightController();