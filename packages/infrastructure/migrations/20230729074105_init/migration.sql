-- CreateEnum
CREATE TYPE "SpecificationStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "SpecificationLinkSource" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "feedUrl" TEXT,

    CONSTRAINT "SpecificationLinkSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecificationLink" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sourceId" UUID NOT NULL,
    "specificationId" UUID,

    CONSTRAINT "SpecificationLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecificationElement" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "versionId" UUID NOT NULL,

    CONSTRAINT "SpecificationElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecificationPublisher" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "SpecificationPublisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecificationVersion" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "SpecificationStatus" NOT NULL,
    "url" TEXT NOT NULL,
    "revisionDate" TIMESTAMP(3) NOT NULL,
    "publishDate" TIMESTAMP(3),
    "specificationId" UUID,

    CONSTRAINT "SpecificationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specification" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "alternativeName" TEXT,
    "url" TEXT NOT NULL,
    "publisherId" UUID NOT NULL,
    "updateDate" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],

    CONSTRAINT "Specification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SpecificationLinkSource_url_key" ON "SpecificationLinkSource"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SpecificationLink_url_key" ON "SpecificationLink"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SpecificationElement_url_key" ON "SpecificationElement"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SpecificationPublisher_key_key" ON "SpecificationPublisher"("key");

-- CreateIndex
CREATE UNIQUE INDEX "SpecificationPublisher_url_key" ON "SpecificationPublisher"("url");

-- CreateIndex
CREATE UNIQUE INDEX "SpecificationVersion_url_key" ON "SpecificationVersion"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Specification_url_key" ON "Specification"("url");

-- AddForeignKey
ALTER TABLE "SpecificationLink" ADD CONSTRAINT "SpecificationLink_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "SpecificationLinkSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecificationLink" ADD CONSTRAINT "SpecificationLink_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecificationElement" ADD CONSTRAINT "SpecificationElement_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "SpecificationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecificationVersion" ADD CONSTRAINT "SpecificationVersion_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "SpecificationPublisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
