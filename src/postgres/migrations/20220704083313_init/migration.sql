-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "age" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Data" (
    "id" UUID NOT NULL,
    "counter" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);
