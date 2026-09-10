CREATE UNIQUE INDEX "Borrowing_userId_bookId_active_key"
ON "Borrowing" ("userId", "bookId")
WHERE "status" = 'ACTIVE';