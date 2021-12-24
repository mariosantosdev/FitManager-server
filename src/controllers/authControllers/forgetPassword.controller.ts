import authService from "@services/auth";
import { Request, Response } from "express";

class ForgetPassword {
    async handle(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!String(email.trim())) return res.status(400).json({ message: 'Email is missing.' });

            await authService.forgetPassword(email);

            res.status(202).json({ message: 'Email sent successfully.' })
        } catch (error) {
            console.error(error);

            res.status(500).json({ message: error });
        }
    }
}

export default new ForgetPassword();