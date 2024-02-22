import { ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';

export const showToast = (message: string) => {
  // ToastAndroid.show(message, ToastAndroid.SHORT)
  Toast.show({
    text1: '提示',
    text2: message,
    type: 'info',
    position: 'bottom',
    autoHide: true,
  });
};
