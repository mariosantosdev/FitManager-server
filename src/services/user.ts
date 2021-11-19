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
}

export default new UserService();