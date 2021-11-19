import { PrismaClient, Exercise } from '@prisma/client';

export interface IDataCreateExercise {
    title: string;
    day_of_week: string;
    loop?: string;
    delay_time?: string;
}

class ExerciseService {
    prisma = new PrismaClient;

    create(userID: number, data: IDataCreateExercise) {
        return new Promise<Exercise>(async (resolve, reject) => {
            try {
                const createdExercise = await this.prisma.exercise.create({
                    data: {
                        ...data,
                        user_id: userID,
                    }
                });

                resolve(createdExercise);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new ExerciseService();