-- AlterTable
ALTER TABLE "communities" ADD COLUMN     "owner" TEXT NOT NULL DEFAULT 'test';

-- AddForeignKey
ALTER TABLE "communities" ADD CONSTRAINT "communities_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
