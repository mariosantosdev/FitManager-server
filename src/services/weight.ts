import { PrismaClient, Weight } from '@prisma/client';

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
}

export default new WeightService();