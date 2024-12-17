/*
  Warnings:

  - The primary key for the `comment_interactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `post_interactions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "comment_interactions" DROP CONSTRAINT "comment_interactions_pkey",
ADD CONSTRAINT "comment_interactions_pkey" PRIMARY KEY ("comment_id", "user_id");

-- AlterTable
ALTER TABLE "post_interactions" DROP CONSTRAINT "post_interactions_pkey",
ADD CONSTRAINT "post_interactions_pkey" PRIMARY KEY ("post_id", "user_id");
