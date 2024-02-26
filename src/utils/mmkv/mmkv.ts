import { MMKV } from 'react-native-mmkv';
import ReactNativeBlobUtil from 'react-native-blob-util'

const MMKV_KEY = `app_lnreader_996_storage`;

export const MMKVStorage = new MMKV({
  id: MMKV_KEY,
  path: `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${MMKV_KEY}`,
});

export function getMMKVObject<T>(key: string) {
  const data = MMKVStorage.getString(key);
  if (data) {
    return JSON.parse(data) as T;
  }
  return undefined;
}

export function setMMKVObject<T>(key: string, obj: T) {
  MMKVStorage.set(key, JSON.stringify(obj));
}
