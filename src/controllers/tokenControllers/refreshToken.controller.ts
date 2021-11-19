import { Request, Response } from "express";
import { decode } from "jsonwebtoken";
import tokenService from '@services/token';

interface IPayload {
    sub: string;
    exp: number;
}

class RefreshTokenController {
    async handle(req: Request, res: Response) {
        try {
            const { token } = req.params;
            if (!token) return res.status(400).json({ message: 'Token is missing.' });

            const { sub, exp } = decode(token, { json: true }) as IPayload;
            if (tokenService.checkTokenIsExpiredFromDate(exp)) {
                const newToken = await tokenService.generateNewTokenFromRefreshToken(Number(sub));

                return res.status(200).json({ token: newToken });
            }

            res.status(202).json({ token });
        } catch (error) {
            const code = error?.name || undefined;
            res.status(500).json({ code, message: 'An unexpected error occurred.' })
        }
    }
}

export default new RefreshTokenController();