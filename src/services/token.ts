import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { PrismaClient } from '@prisma/client';

class TokenService {
    prisma = new PrismaClient();

    checkTokenIsExpiredFromDate(dateUnix: number) {
        return dayjs().isBefore(dateUnix);
    }

    generateToken(userID: number) {
        const expiresIn = dayjs().add(1, 'day').unix();

        return new Promise((resolve, reject) => {
            try {
                const token = jwt.sign({}, process.env.SECRET_KEY, {
                    subject: String(userID),
                    expiresIn,
                })

                resolve(token);
            } catch (error) {
                reject(error);
            }
        })
    }

    generateRefreshToken(userID: number) {
        const expiresIn = dayjs().add(15, 'day').unix();

        return new Promise(async (resolve, reject) => {
            try {
                const token = jwt.sign({}, process.env.SECRET_KEY, {
                    subject: String(userID),
                    expiresIn,
                })

                const existRefreshToken = await this.verifyHasAlreadyExistRefreshToken(userID);

                if (existRefreshToken) {
                    resolve(existRefreshToken)
                } else {
                    await this.prisma.refreshToken.create({
                        data: {
                            user_id: userID,
                            expires_in: expiresIn
                        }
                    });

                    resolve(token);
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    generateNewTokenFromRefreshToken(userID: number) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!userID) reject('Autorização inválida.');

                const prisma = new PrismaClient();

                prisma.$connect();

                const existRefreshToken = await prisma.refreshToken.findFirst({
                    where: { user_id: userID },
                    rejectOnNotFound: true
                });

                if (this.checkTokenIsExpiredFromDate(existRefreshToken.expires_in)) {
                    await this.generateRefreshToken(userID);

                    await prisma.refreshToken.delete({
                        where: { id: existRefreshToken.id }
                    });
                }

                const newToken = await this.generateToken(userID);

                resolve(newToken);
            } catch (error) {
                reject(error);
            }
        })
    }

    verifyHasAlreadyExistRefreshToken(userID: number) {
        return new Promise(async (resolve, reject) => {
            try {
                const refreshToken = await this.prisma.refreshToken.findFirst({
                    where: {
                        user_id: userID
                    }
                });

                refreshToken ? resolve(refreshToken) : resolve(false);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new TokenService();