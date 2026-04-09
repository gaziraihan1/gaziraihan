/*
  Warnings:

  - You are about to drop the `_BlogPostToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogPostToTag" DROP CONSTRAINT "_BlogPostToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogPostToTag" DROP CONSTRAINT "_BlogPostToTag_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTag" DROP CONSTRAINT "_ProjectToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToTag" DROP CONSTRAINT "_ProjectToTag_B_fkey";

-- DropIndex
DROP INDEX "BlogPost_publishedAt_idx";

-- DropIndex
DROP INDEX "BlogPost_published_idx";

-- DropIndex
DROP INDEX "Certification_order_idx";

-- DropIndex
DROP INDEX "ContactMessage_status_idx";

-- DropIndex
DROP INDEX "Education_order_idx";

-- DropIndex
DROP INDEX "Experience_order_idx";

-- DropIndex
DROP INDEX "Experience_startDate_idx";

-- DropIndex
DROP INDEX "Project_featured_idx";

-- DropIndex
DROP INDEX "Project_status_idx";

-- DropIndex
DROP INDEX "Skill_category_idx";

-- DropIndex
DROP INDEX "Skill_order_idx";

-- DropIndex
DROP INDEX "Subscriber_email_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropTable
DROP TABLE "_BlogPostToTag";

-- DropTable
DROP TABLE "_ProjectToTag";

-- CreateTable
CREATE TABLE "_ProjectTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BlogPostTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogPostTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectTags_B_index" ON "_ProjectTags"("B");

-- CreateIndex
CREATE INDEX "_BlogPostTags_B_index" ON "_BlogPostTags"("B");

-- CreateIndex
CREATE INDEX "BlogPost_published_publishedAt_idx" ON "BlogPost"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_published_createdAt_idx" ON "BlogPost"("published", "createdAt");

-- CreateIndex
CREATE INDEX "BlogPost_authorId_published_publishedAt_idx" ON "BlogPost"("authorId", "published", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_views_idx" ON "BlogPost"("views");

-- CreateIndex
CREATE INDEX "Certification_order_issueDate_idx" ON "Certification"("order", "issueDate");

-- CreateIndex
CREATE INDEX "Certification_expiryDate_idx" ON "Certification"("expiryDate");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_ipAddr_idx" ON "ContactMessage"("ipAddr");

-- CreateIndex
CREATE INDEX "Education_startDate_endDate_idx" ON "Education"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "Education_order_startDate_idx" ON "Education"("order", "startDate");

-- CreateIndex
CREATE INDEX "Experience_isCurrent_startDate_idx" ON "Experience"("isCurrent", "startDate");

-- CreateIndex
CREATE INDEX "Experience_order_startDate_idx" ON "Experience"("order", "startDate");

-- CreateIndex
CREATE INDEX "Experience_createdAt_idx" ON "Experience"("createdAt");

-- CreateIndex
CREATE INDEX "Project_featured_status_order_createdAt_idx" ON "Project"("featured", "status", "order", "createdAt");

-- CreateIndex
CREATE INDEX "Project_status_createdAt_idx" ON "Project"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Skill_category_order_name_idx" ON "Skill"("category", "order", "name");

-- CreateIndex
CREATE INDEX "Skill_proficiency_idx" ON "Skill"("proficiency");

-- CreateIndex
CREATE INDEX "Subscriber_email_active_idx" ON "Subscriber"("email", "active");

-- CreateIndex
CREATE INDEX "Subscriber_createdAt_idx" ON "Subscriber"("createdAt");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "User_email_role_idx" ON "User"("email", "role");

-- AddForeignKey
ALTER TABLE "_ProjectTags" ADD CONSTRAINT "_ProjectTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectTags" ADD CONSTRAINT "_ProjectTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostTags" ADD CONSTRAINT "_BlogPostTags_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogPostTags" ADD CONSTRAINT "_BlogPostTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
