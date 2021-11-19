import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcryptjs'

interface ICreateUser {
    name: string;
    email: string;
    password: string;
}

class AuthServices {
    prisma = new PrismaClient();

    createUser(data: ICreateUser) {
        const promise = new Promise<User>(async (resolve, rejest) => {
            try {
                data.password = await this.generatePasswordHash(data.password);

                const user = await this.prisma.user.create({
                    data: data
                });
                delete user.password;

                resolve(user);
            } catch (error) {
                rejest(error);
            }
        });

        return Promise.resolve(promise);
    }

    signIn(email: string, password: string) {
        return new Promise<User>(async (resolve, reject) => {
            try {
                const user = await this.prisma.user.findFirst({
                    where: { email },
                    rejectOnNotFound: true,
                    include: {
                        weight: { take: 1 },
                        height: { take: 1 }
                    }
                });

                const matchPassword = bcrypt.compareSync(password, user.password);
                if (!matchPassword) reject('User or password is wrong.');

                delete user.password;
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    generatePasswordHash(password: string) {
        const promise = new Promise<string>((resolve, rejest) => {
            try {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);

                resolve(hash);
            } catch (error) {
                resolve(error);
            }
        });

        return Promise.resolve(promise);
    }

    verifyUserAlreadyExist(email: string) {
        const promise = new Promise<boolean>(async (resolve, rejest) => {
            try {
                const user = await this.prisma.user.findUnique({
                    where: { email }
                });

                user ? resolve(true) : resolve(false);
            } catch (error) {
                rejest(error);
            }
        });

        return Promise.resolve(promise);
    }
}

export default new AuthServices();