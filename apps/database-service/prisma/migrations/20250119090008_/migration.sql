-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentType" "PaymentType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_payment" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cash_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_payment" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "edcMachine" TEXT NOT NULL,
    "cardType" "CardType" NOT NULL,
    "cardBrand" TEXT NOT NULL,

    CONSTRAINT "card_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cash_payment_paymentId_key" ON "cash_payment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "card_payment_paymentId_key" ON "card_payment"("paymentId");

-- AddForeignKey
ALTER TABLE "cash_payment" ADD CONSTRAINT "cash_payment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_payment" ADD CONSTRAINT "card_payment_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
