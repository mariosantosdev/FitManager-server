import { Request, Response, NextFunction } from "express";
import { verify, decode } from "jsonwebtoken";
import { PrismaClient } from '@prisma/client';
import tokenService from '@services/token';

interface IPayload {
    sub: string;
}

function regenerateToken(token: string) {
    return new Promise<number>(async (resolve, reject) => {
        try {
            const { sub } = decode(token, { json: true });

            await tokenService.generateNewTokenFromRefreshToken(Number(sub));
            resolve(Number(sub));
        } catch (error) {
            reject(error);
        }
    })
}

function verifyToken(token: string) {
    try {
        const { sub } = verify(token, process.env.SECRET_KEY) as IPayload;

        return sub
    } catch (error: any) {
        throw error;
    }
}

function checkExistUserFromID(id: number) {
    return new Promise(async (resolve, reject) => {
        try {
            const prisma = new PrismaClient();

            const existUser = await prisma.user.findFirst({
                where: { id }
            });

            existUser ? resolve(true) : resolve(false);
        } catch (error) {
            reject(error);
        }
    })
}

class EnsureAuthMiddleware {
    async handle(req: Request, res: Response, next: NextFunction) {
        const authToken = req.headers['authorization'];
        if (!authToken) return res.status(401).json({ message: 'Token doesn\'t found.' });

        const [, token] = authToken.split(' ');

        try {
            const sub = verifyToken(token)
            if (!await checkExistUserFromID(Number(sub))) return res.status(401).json({ message: 'User doesn\'t found.' });

            req.user_id = Number(sub);

            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return regenerateToken(token)
                    .then((userID) => {
                        req.user_id = userID;
                        return next();
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(401).json({ code: 'token.expired', message: 'Token expired' })
                    });
            }

            const code = error?.name || undefined;
            res.status(401).json({ code, message: 'An unexpected error occurred.' })
        }
    }
}

export default new EnsureAuthMiddleware();