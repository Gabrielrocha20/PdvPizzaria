/*
  Warnings:

  - You are about to drop the column `desconto` on the `Promocao` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Promocao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor" REAL NOT NULL DEFAULT 0,
    "categoriaId" INTEGER,
    CONSTRAINT "Promocao_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Promocao" ("descricao", "id", "nome") SELECT "descricao", "id", "nome" FROM "Promocao";
DROP TABLE "Promocao";
ALTER TABLE "new_Promocao" RENAME TO "Promocao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
