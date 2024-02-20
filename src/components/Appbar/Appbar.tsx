import React from 'react';
import { StatusBar } from 'react-native';

import { Appbar as PaperAppbar } from 'react-native-paper';
import { ThemeColors } from '../../theme/types';

interface AppbarProps {
  title: string;
  handleGoBack: () => void;
  theme: ThemeColors;
  mode?: 'small' | 'medium' | 'large' | 'center-aligned';
}

const Appbar: React.FC<AppbarProps> = ({
  title,
  handleGoBack,
  theme,
  mode = 'large',
  children,
}) => (
  <PaperAppbar.Header
    style={{ backgroundColor: theme.surface, marginRight: 106 }}
    statusBarHeight={StatusBar.currentHeight}
    mode={mode}
  >
    {handleGoBack && (
      <PaperAppbar.BackAction
        onPress={handleGoBack}
        iconColor={theme.onSurface}
      />
    )}
    <PaperAppbar.Content
      title={title}
      titleStyle={{ color: theme.onSurface }}
    />
    {children}
  </PaperAppbar.Header>
);

export default Appbar;
