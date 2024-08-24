import * as SQLite from 'expo-sqlite';
import {
  createCategoriesTableQuery,
  createCategoryDefaultQuery,
  createCategoryTriggerQuery,
} from './tables/CategoryTable';
import { createNovelTableQuery } from './tables/NovelTable';
import { createNovelCategoryTableQuery } from './tables/NovelCategoryTable';
import {
  createChapterTableQuery,
  createChapterNovelIdIndexQuery,
} from './tables/ChapterTable';
import { dbTxnErrorCallback } from './utils/helpers';
import { noop } from 'lodash';
import { createRepositoryTableQuery } from './tables/RepositoryTable';

const dbName = 'lnreader.db';

const db = SQLite.openDatabaseSync(dbName);

export const createTables = async () => {
  await db.execAsync('PRAGMA foreign_keys = ON');
  await db.withTransactionAsync(async () => {
    await db.execAsync(createNovelTableQuery);
    await db.execAsync(createCategoriesTableQuery);
    await db.execAsync(createCategoryDefaultQuery);
    await db.execAsync(createCategoryTriggerQuery);
    await db.execAsync(createNovelCategoryTableQuery);
    await db.execAsync(createChapterTableQuery);
    await db.execAsync(createChapterNovelIdIndexQuery);
  });

  db.withTransactionAsync(async () => {
    await db.execAsync(createRepositoryTableQuery);
  });
};

/**
 * For Testing
 */
export const deleteDatabase = async () => {
  db.withTransactionAsync(
    async () => {
      await db.execAsync('DROP TABLE Category');
      await db.execAsync('DROP TABLE Novel');
      await db.execAsync('DROP TABLE NovelCategory');
      await db.execAsync('DROP TABLE Chapter');
      await db.execAsync('DROP TABLE Download');
      await db.execAsync('DROP TABLE Repository');
    },
  );
};