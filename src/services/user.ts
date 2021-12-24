import { PrismaClient } from "@prisma/client";
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import authService from '@services/auth';

class UserService {
    prisma = new PrismaClient();

    update(userID: number, data: User) {
        return new Promise<User>(async (resolve, reject) => {
            try {
                if (data?.password) delete data.password;

                const user = await this.prisma.user.update({
                    where: { id: userID },
                    data: {
                        ...data,
                        updated_at: new Date(),
                    }
                });
                delete user.password;

                resolve(user);
            } catch (error) {
                reject(error);
            }
        })
    }

    updatePassword(userID: number, password: string, newPassword: string) {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const { password: passwordHash } = await this.prisma.user.findUnique({
                    where: { id: userID },
                    select: { password: true },
                });

                const matchPassword = bcrypt.compareSync(password, passwordHash);
                if (!matchPassword) return reject('Usuário ou senha inválido.');

                const user = await this.prisma.user.update({
                    where: { id: userID },
                    data: {
                        password: await authService.generatePasswordHash(newPassword),
                        updated_at: new Date(),
                    }
                });
                delete user.password;

                resolve(user);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    delete(userID: number) {
        return new Promise<Boolean>(async (resolve, reject) => {
            try {
                await this.prisma.backup.deleteMany({
                    where: { user_id: userID }
                });

                await this.prisma.exercise.deleteMany({
                    where: { user_id: userID }
                });

                await this.prisma.height.deleteMany({
                    where: { user_id: userID }
                });

                await this.prisma.weight.deleteMany({
                    where: { user_id: userID }
                });

                await this.prisma.refreshToken.deleteMany({
                    where: { user_id: userID }
                });

                await this.prisma.user.delete({
                    where: { id: userID },
                });

                resolve(true);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new UserService();