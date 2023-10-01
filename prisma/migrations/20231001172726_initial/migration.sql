-- CreateEnum
CREATE TYPE "listing_type" AS ENUM ('want', 'has');

-- CreateEnum
CREATE TYPE "exchange_type" AS ENUM ('irl', 'mail');

-- CreateTable
CREATE TABLE "listing" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "exchange" "exchange_type" NOT NULL,
    "country" TEXT NOT NULL,
    "nearestCity" TEXT NOT NULL,
    "keycapId" INTEGER NOT NULL,
    "type" "listing_type" NOT NULL,

    CONSTRAINT "listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keycap" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "keycap_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "keycap_name_key" ON "keycap"("name");

-- AddForeignKey
ALTER TABLE "listing" ADD CONSTRAINT "listing_keycapId_fkey" FOREIGN KEY ("keycapId") REFERENCES "keycap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
