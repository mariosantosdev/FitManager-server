import { PrismaClient, Height } from '@prisma/client';

export interface IDataCreateHeight {
    title: string;
    date: string;
}

export interface IDataUpdateHeight {
    title?: string;
    date?: string;
}

interface IOptionsListHeights {
    skip?: number;
    take?: number;
}

class HeightService {
    prisma = new PrismaClient;

    listHeight(userID: number, heightID: number) {
        return new Promise<Height>(async (resolve, reject) => {
            try {
                const height = await this.prisma.height.findFirst({
                    where: { id: heightID, user_id: userID }
                });

                resolve(height);
            } catch (error) {
                reject(error);
            }
        });
    }

    listHeights(userID: number, options: IOptionsListHeights) {
        return new Promise<Height[]>(async (resolve, reject) => {
            try {
                const { skip } = options;
                const take = options?.take || 25;

                const heights = await this.prisma.height.findMany({
                    where: { user_id: userID },
                    skip,
                    take
                });

                resolve(heights);
            } catch (error) {
                reject(error);
            }
        })
    }

    create(userID: number, data: IDataCreateHeight) {
        return new Promise<Height>(async (resolve, reject) => {
            try {
                const createdHeight = await this.prisma.height.create({
                    data: {
                        ...data,
                        user_id: userID,
                    }
                });

                resolve(createdHeight);
            } catch (error) {
                reject(error);
            }
        })
    }

    update(heightID: number, data: IDataUpdateHeight) {
        return new Promise<Height>(async (resolve, reject) => {
            try {
                const height = await this.prisma.height.update({
                    data,
                    where: { id: heightID }
                });

                resolve(height);
            } catch (error) {
                reject(error);
            }
        });

    }

    delete(heightID: number) {
        return new Promise<Boolean>(async (resolve, reject) => {
            try {
                await this.prisma.height.delete({
                    where: { id: heightID }
                });

                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default new HeightService();