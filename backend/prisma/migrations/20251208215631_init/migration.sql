-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imie" TEXT NOT NULL,
    "nazwisko" TEXT,
    "mail" TEXT NOT NULL,
    "telefon" TEXT,
    "rola" TEXT NOT NULL DEFAULT 'user',
    "haslo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nazwa" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "data_utworzenia" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opis" TEXT,
    "uzytkownik_id" INTEGER NOT NULL,
    CONSTRAINT "Order_uzytkownik_id_fkey" FOREIGN KEY ("uzytkownik_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");
