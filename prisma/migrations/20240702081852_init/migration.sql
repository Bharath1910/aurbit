-- CreateTable
CREATE TABLE "users" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pfp" TEXT,
    "aura" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "communities" (
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "communities_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "community_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "members" (
    "community_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("username","community_id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_username_fkey" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
