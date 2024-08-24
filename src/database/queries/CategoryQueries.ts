import * as SQLite from 'expo-sqlite';
import { noop } from 'lodash';
import { BackupCategory, Category, NovelCategory, CCategory } from '../types';
import { showToast } from '@utils/showToast';
import { txnErrorCallback } from '../utils/helpers';
import { getString } from '@strings/translations';

const db = SQLite.openDatabaseAsync('lnreader.db');

const getCategoriesQuery = `
  SELECT * FROM Category ORDER BY sort
`;

export const getCategoriesFromDb = async (): Promise<Category[]> => {
  try {
    const result = await db.withTransactionAsync(async tx => {
      const [queryResult] = await tx.executeSqlAsync(getCategoriesQuery, []);
      return (queryResult.rows as any)._array;
    });
    return result;
  } catch (error) {
    txnErrorCallback('', error);
  }
};

export const getCategoriesWithCount = async (
  novelIds: number[],
): Promise<CCategory[]> => {
  const getCategoriesWithCountQuery = `
    SELECT *, novelsCount 
    FROM Category LEFT JOIN 
    (
      SELECT categoryId, COUNT(novelId) as novelsCount 
      FROM NovelCategory WHERE novelId in (${novelIds.join(
        ',',
      )}) GROUP BY categoryId 
    ) as NC ON Category.id = NC.categoryId
    WHERE Category.id != 2
    ORDER BY sort
  `;

  try {
    const result = await db.withTransactionAsync(async tx => {
      const [queryResult] = await tx.executeSqlAsync(getCategoriesWithCountQuery, []);
      return (queryResult.rows as any)._array;
    });
    return result;
  } catch (error) {
    txnErrorCallback(error);
  }
};

const createCategoryQuery = 'INSERT INTO Category (name) VALUES (?)';

export const createCategory = async (categoryName: string): Promise<void> => {
  try {
    await db.withTransactionAsync(async tx => {
      await tx.executeSqlAsync(createCategoryQuery, [categoryName]);
    });
  } catch (error) {
    txnErrorCallback(error);
  }
};

const beforeDeleteCategoryQuery = `
  UPDATE NovelCategory SET categoryId = (SELECT id FROM Category WHERE sort = 1)
  WHERE novelId IN (
    SELECT novelId FROM NovelCategory
    GROUP BY novelId
    HAVING COUNT(categoryId) = 1
  )
  AND categoryId = ?;
`;

const deleteCategoryQuery = 'DELETE FROM Category WHERE id = ?';

export const deleteCategoryById = async (category: Category): Promise<void> => {
  if (category.sort === 1 || category.id === 2) {
    return showToast(getString('categories.cantDeleteDefault'));
  }

  try {
    await db.withTransactionAsync(async tx => {
      await tx.executeSqlAsync(beforeDeleteCategoryQuery, [category.id]);
      await tx.executeSqlAsync(deleteCategoryQuery, [category.id]);
    });
  } catch (error) {
    txnErrorCallback(error);
  }
};

const updateCategoryQuery = 'UPDATE Category SET name = ? WHERE id = ?';

export const updateCategory = async (
  categoryId: number,
  categoryName: string,
): Promise<void> => {
  try {
    await (await db).withTransactionAsync(async tx => {
      await tx.executeSqlAsync(updateCategoryQuery, [categoryName, categoryId]);
    });
  } catch (error) {
    txnErrorCallback(error);
  }
};

const isCategoryNameDuplicateQuery = `
  SELECT COUNT(*) as isDuplicate FROM Category WHERE name = ?
`;

export const isCategoryNameDuplicate = async (
  categoryName: string,
): Promise<boolean> => {
  try {
    const result = await db.withTransactionAsync(async tx => {
      const [queryResult] = await tx.executeSqlAsync(isCategoryNameDuplicateQuery, [categoryName]);
      const { _array } = queryResult.rows as any;
      return Boolean(_array[0]?.isDuplicate);
    });
    return result;
  } catch (error) {
    txnErrorCallback(error);
  }
};

const updateCategoryOrderQuery = 'UPDATE Category SET sort = ? WHERE id = ?';

export const updateCategoryOrderInDb = async (categories: Category[]): Promise<void> => {
  if (categories.length && categories[0].id === 2) {
    return;
  }

  try {
    await db.withTransactionAsync(async tx => {
      for (const category of categories) {
        await tx.executeSqlAsync(updateCategoryOrderQuery, [category.sort, category.id]);
      }
    });
  } catch (error) {
    txnErrorCallback(error);
  }
};

export const getAllNovelCategories = async (): Promise<NovelCategory[]> => {
  try {
    const result = await db.withTransactionAsync(async tx => {
      const [queryResult] = await tx.executeSqlAsync('SELECT * FROM NovelCategory', []);
      return (queryResult.rows as any)._array;
    });
    return result;
  } catch (error) {
    txnErrorCallback(error);
  }
};

export const _restoreCategory = async (category: BackupCategory): Promise<void> => {
  try {
    await db.withTransactionAsync(async tx => {
      await tx.executeSqlAsync('DELETE FROM Category WHERE id = ? OR sort = ?', [
        category.id,
        category.sort,
      ]);

      await tx.executeSqlAsync('INSERT INTO Category (id, name, sort) VALUES (?, ?, ?)', [
        category.id,
        category.name,
        category.sort,
      ]);

      for (const novelId of category.novelIds) {
        await tx.executeSqlAsync(
          'INSERT INTO NovelCategory (categoryId, novelId) VALUES (?, ?)',
          [category.id, novelId],
        );
      }
    });
  } catch (error) {
    txnErrorCallback(error);
  }
};
