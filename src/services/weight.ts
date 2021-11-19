import { PrismaClient, Weight } from '@prisma/client';

export interface IDataCreateWeight {
    title: string;
    date: string;
}

export interface IDataUpdateWeight {
    title?: string;
    date?: string;
}

interface IOptionsListWeights {
    skip?: number;
    take?: number;
}

class WeightService {
    prisma = new PrismaClient;

    listWeight(userID: number, weightID: number) {
        return new Promise<Weight>(async (resolve, reject) => {
            try {
                const weight = await this.prisma.weight.findFirst({
                    where: { id: weightID, user_id: userID }
                });

                resolve(weight);
            } catch (error) {
                reject(error);
            }
        });
    }

    listWeights(userID: number, options: IOptionsListWeights) {
        return new Promise<Weight[]>(async (resolve, reject) => {
            try {
                const { skip } = options;
                const take = options?.take || 25;

                const weights = await this.prisma.weight.findMany({
                    where: { user_id: userID },
                    skip,
                    take
                });

                resolve(weights);
            } catch (error) {
                reject(error);
            }
        })
    }

    create(userID: number, data: IDataCreateWeight) {
        return new Promise<Weight>(async (resolve, reject) => {
            try {
                const createdWeight = await this.prisma.weight.create({
                    data: {
                        ...data,
                        user_id: userID,
                    }
                });

                resolve(createdWeight);
            } catch (error) {
                reject(error);
            }
        })
    }

    update(weightID: number, data: IDataUpdateWeight) {
        return new Promise<Weight>(async (resolve, reject) => {
            try {
                const weight = await this.prisma.weight.update({
                    data,
                    where: { id: weightID }
                });

                resolve(weight);
            } catch (error) {
                reject(error);
            }
        });

    }
}

export default new WeightService();