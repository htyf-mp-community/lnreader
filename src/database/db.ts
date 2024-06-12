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
import {
  createRepositoryTableQuery,
  insertDefaultRepository,
} from './tables/RepositoryTable';

const dbName = 'lnreader.db';

let db: SQLite.SQLiteDatabase;

export const createTables = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(dbName);
  }
  db.execAsync('PRAGMA foreign_keys = ON', false, () => {});
  db.transaction(tx => {
    tx.executeSql(createNovelTableQuery);
    tx.executeSql(createCategoriesTableQuery);
    tx.executeSql(createCategoryDefaultQuery);
    tx.executeSql(createCategoryTriggerQuery);
    tx.executeSql(createNovelCategoryTableQuery);
    tx.executeSql(createChapterTableQuery);
    tx.executeSql(createChapterNovelIdIndexQuery);
  });

  db.transaction(tx => {
    tx.executeSql(createRepositoryTableQuery);
    tx.executeSql(insertDefaultRepository);
  });
};

/**
 * For Testing
 */
export const deleteDatabase = async () => {
  db.transaction(
    tx => {
      tx.executeSql('DROP TABLE Category');
      tx.executeSql('DROP TABLE Novel');
      tx.executeSql('DROP TABLE NovelCategory');
      tx.executeSql('DROP TABLE Chapter');
      tx.executeSql('DROP TABLE Download');
      tx.executeSql('DROP TABLE Repository');
    },
    dbTxnErrorCallback,
    noop,
  );
};
