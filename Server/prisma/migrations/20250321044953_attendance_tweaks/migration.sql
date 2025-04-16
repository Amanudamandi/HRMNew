/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `qualification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `reporting_manager` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `qualification_name_key` ON `qualification`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `reporting_manager_name_key` ON `reporting_manager`(`name`);
