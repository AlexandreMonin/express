/*
  Warnings:

  - Added the required column `quantity` to the `Orders_Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders_Products" ADD COLUMN     "quantity" INTEGER NOT NULL;
