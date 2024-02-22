import React, { forwardRef } from 'react';
import Pages from '../App';
import SplashScreen from 'react-native-splash-screen';
import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

const MiniApp = forwardRef(({ dataSupper }: any) => {
  useEffect(() => {
    SplashScreen.hide();
    return () => {

    }
  }, [])
  return (
    <>
     <Pages />
     <Toast />
    </>
  );
});

export default MiniApp;