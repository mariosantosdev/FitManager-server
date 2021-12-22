import { PrismaClient, User } from "@prisma/client";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

interface ICreateUser {
    name: string;
    email: string;
    password: string;
}

interface IDataSendMail {
    from: string;
    to: string;
    subject: string;
    html: string | Buffer;
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
                    include: {
                        weight: { take: 1, orderBy: [{ created_at: 'desc' }] },
                        height: { take: 1, orderBy: [{ created_at: 'desc' }] }
                    }
                });

                if (!user) return reject('Usuário ou senha inválido.');

                const matchPassword = bcrypt.compareSync(password, user.password);
                if (!matchPassword) reject('Usuário ou senha inválido.');

                await this.prisma.user.update({
                    where: { email },
                    data: {
                        last_login: new Date()
                    }
                })

                delete user.password;
                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    generatePasswordRecovered() {
        return Math.random().toString(36).slice(-8);
    }

    forgetPassword(email: string) {
        return new Promise<Boolean>(async (resolve, reject) => {
            try {
                // Verify is exist user
                const user = await this.prisma.user.findFirst({
                    where: { email }
                });
                if (!user) reject('Usuário inváido.')

                const newPassword = this.generatePasswordRecovered();
                const hashedPassword = await this.generatePasswordHash(newPassword);

                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        password: hashedPassword,
                        updated_at: new Date()
                    }
                });

                await this.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: 'Recuperação de senha Fit Manager',
                    html: `Olá ${user.name} sua nova senha para acessar o app Fit Manager é <b>${newPassword}<b>`
                });

                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    sendMail(data: IDataSendMail) {
        return new Promise<Boolean>((resolve, reject) => {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: true,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD_EMAIL
                    }
                });

                transporter.sendMail(data, (err) => {
                    if (err) throw err;

                    resolve(true);
                })
            } catch (error) {
                reject(error);
            }
        })
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