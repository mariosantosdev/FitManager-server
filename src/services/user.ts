import { PrismaClient } from "@prisma/client";
import { User } from '@prisma/client';
import authService from "./auth";

class UserService {
    prisma = new PrismaClient();

    update(userID: number, data: User) {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const hashPassword = data?.password && await authService.generatePasswordHash(data.password);

                const user = await this.prisma.user.update({
                    where: { id: userID },
                    data: {
                        ...data,
                        password: hashPassword,
                        updated_at: new Date(),
                    }
                });

                resolve(user);
            } catch (error) {
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