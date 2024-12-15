/*
  Warnings:

  - Added the required column `author` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "author" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_fkey" FOREIGN KEY ("author") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
