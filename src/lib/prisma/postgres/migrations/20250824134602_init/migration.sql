-- AlterTable
ALTER TABLE "records" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_login_fkey" FOREIGN KEY ("login") REFERENCES "users"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
