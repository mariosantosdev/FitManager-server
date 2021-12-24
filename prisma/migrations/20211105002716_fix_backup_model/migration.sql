/*
  Warnings:

  - You are about to drop the column `backup_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Backup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_backup_id_fkey";

-- AlterTable
ALTER TABLE "Backup" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "backup_id";

-- AddForeignKey
ALTER TABLE "Backup" ADD CONSTRAINT "Backup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
