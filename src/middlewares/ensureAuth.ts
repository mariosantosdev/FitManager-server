import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
    sub: string;
}

function verifyToken(token: string) {
    try {
        const { sub } = verify(token, process.env.SECRET_KEY) as IPayload;

        return sub
    } catch (error) {
        throw error;
    }
}

class EnsureAuthMiddleware {
    async handle(req: Request, res: Response, next: NextFunction) {
        const authToken = req.headers['authorization'];
        if (!authToken) return res.status(401).json({ message: 'Token doesn\'t found.' });

        const [, token] = authToken.split(' ');

        try {
            const sub = verifyToken(token)
            req.user_id = Number(sub);

            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ code: 'token.expired', message: 'Token expired' });
            }

            const code = error?.name || undefined;
            res.status(401).json({ code, message: 'An unexpected error occurred.' })
        }
    }
}

export default new EnsureAuthMiddleware();