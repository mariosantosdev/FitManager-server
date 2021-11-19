import { Request, Response } from 'express';
import heightService from '@services/height';

class CreateHeightController {
    async handle(req: Request, res: Response) {
        try {
            if (!req.user_id) return res.status(401).json({ message: 'UserID is missing' });

            const { title, date } = req.body;

            if (!String(title.trim())) return res.status(400).json({ message: '"title" is missing.' })
            if (!String(date.trim())) return res.status(400).json({ message: '"day_of_week" is missing.' })

            const createdHeight = await heightService.create(req.user_id, { title, date });

            res.status(201).json({ height: createdHeight });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error })
        }
    }
}

export default new CreateHeightController();