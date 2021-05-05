export const createHistoryTableQuery = `
    CREATE TABLE IF NOT EXISTS history(
    historyId INTEGER PRIMARY KEY AUTOINCREMENT,
    historyChapterId INTEGER NOT NULL,
    historyNovelId INTEGER NOT NULL UNIQUE,
    historyTimeRead DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (historyChapterId) REFERENCES chapters(chapterId)
    ON DELETE CASCADE
    )`;

export const createChapterIdIndexQuery = `CREATE INDEX IF NOT EXISTS historyChapterIdIndex ON history(historyChapterId)`;