-- CreateTable
CREATE TABLE "Hardware" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "purchaseUrl" TEXT,
    "price" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hardware_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Software" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "websiteUrl" TEXT,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Software_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hardware_category_order_idx" ON "Hardware"("category", "order");

-- CreateIndex
CREATE INDEX "Hardware_isFavorite_idx" ON "Hardware"("isFavorite");

-- CreateIndex
CREATE INDEX "Software_category_order_idx" ON "Software"("category", "order");

-- CreateIndex
CREATE INDEX "Software_isFavorite_idx" ON "Software"("isFavorite");
