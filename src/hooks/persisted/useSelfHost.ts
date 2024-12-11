import { MMKVStorage } from '@utils/mmkv/mmkv';
import { useMMKVString } from 'react-native-mmkv';

export const SELF_HOST_BACKUP = 'SELF_HOST_BACKUP';

export const useSelfHost = () => {
  const [host = '', setHost] = useMMKVString(SELF_HOST_BACKUP, MMKVStorage);
  return {
    host,
    setHost,
  };
};
