/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_key" ON "employees"("cpf");
