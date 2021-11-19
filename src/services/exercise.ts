import { PrismaClient, Exercise } from '@prisma/client';

export interface IDataCreateExercise {
    title: string;
    day_of_week: string;
    loop?: string;
    delay_time?: string;
}

export type DayWeek = 'seg' | 'tec' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';

interface IOptionsListExercises {
    skip?: number;
    take?: number;
    day?: DayWeek;
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

    listExercises(userID: number, options: IOptionsListExercises) {
        return new Promise<Exercise[]>(async (resolve, reject) => {
            try {
                const { day, skip } = options;
                const take = options?.take || 25;

                const exercises = await this.prisma.exercise.findMany({
                    where: { user_id: userID, day_of_week: day },
                    skip,
                    take
                });

                resolve(exercises);
            } catch (error) {
                reject(error);
            }
        })
    }
}

export default new ExerciseService();