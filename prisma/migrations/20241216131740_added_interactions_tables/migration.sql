-- CreateEnum
CREATE TYPE "Interaction" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- CreateTable
CREATE TABLE "post_interactions" (
    "post_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "Interaction" NOT NULL,

    CONSTRAINT "post_interactions_pkey" PRIMARY KEY ("post_id","user_id","type")
);

-- CreateTable
CREATE TABLE "comment_interactions" (
    "comment_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "Interaction" NOT NULL,

    CONSTRAINT "comment_interactions_pkey" PRIMARY KEY ("comment_id","user_id","type")
);

-- AddForeignKey
ALTER TABLE "post_interactions" ADD CONSTRAINT "post_interactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_interactions" ADD CONSTRAINT "post_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_interactions" ADD CONSTRAINT "comment_interactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_interactions" ADD CONSTRAINT "comment_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
