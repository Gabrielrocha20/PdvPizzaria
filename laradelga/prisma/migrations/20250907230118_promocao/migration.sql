-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PromocaoItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "promocaoId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "PromocaoItem_promocaoId_fkey" FOREIGN KEY ("promocaoId") REFERENCES "Promocao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PromocaoItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PromocaoItem" ("id", "itemId", "promocaoId") SELECT "id", "itemId", "promocaoId" FROM "PromocaoItem";
DROP TABLE "PromocaoItem";
ALTER TABLE "new_PromocaoItem" RENAME TO "PromocaoItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
