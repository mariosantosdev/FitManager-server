import { PrismaClient, Weight } from '@prisma/client';

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
}

export default new WeightService();