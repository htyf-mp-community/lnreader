import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import {
  FAB,
  ProgressBar,
  Appbar as MaterialAppbar,
  Menu,
  overlay,
} from 'react-native-paper';

import { useTheme } from '@hooks/persisted';

import { showToast } from '../../utils/showToast';
import { getString } from '@strings/translations';
import { Appbar, EmptyView } from '@components';
import { TaskQueueScreenProps } from '@navigators/types';
import ServiceManager, { BackgroundTask } from '@services/ServiceManager';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMMKVObject } from 'react-native-mmkv';
import { MMKVStorage } from '@utils/mmkv/mmkv';

const DownloadQueue = ({ navigation }: TaskQueueScreenProps) => {
  const theme = useTheme();
  const { bottom } = useSafeAreaInsets();
  const [taskQueue] = useMMKVObject<BackgroundTask[]>(
    ServiceManager.manager.STORE_KEY,
    MMKVStorage,
  );
  const [isRunning, setIsRunning] = useState(ServiceManager.manager.isRunning);
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  useEffect(() => {
    if (taskQueue?.length === 0) {
      setIsRunning(false);
    }
  }, [taskQueue]);

  return (
    <>
      <Appbar
        title={'Task Queue'}
        handleGoBack={navigation.goBack}
        theme={theme}
      >
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            taskQueue?.length ? (
              <MaterialAppbar.Action
                icon="dots-vertical"
                iconColor={theme.onSurface}
                onPress={openMenu}
              />
            ) : null
          }
          contentStyle={{ backgroundColor: overlay(2, theme.surface) }}
        >
          <Menu.Item
            onPress={() => {
              ServiceManager.manager.stop();
              setIsRunning(false);
              showToast(getString('downloadScreen.cancelled'));
              closeMenu();
            }}
            title={getString('downloadScreen.cancelDownloads')}
            titleStyle={{ color: theme.onSurface }}
          />
        </Menu>
      </Appbar>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        keyExtractor={(item, index) => 'task_' + index}
        data={taskQueue || []}
        renderItem={({ item, index }) => (
          <View style={{ padding: 16 }}>
            <Text style={{ color: theme.onSurface }}>
              {item.name} - {ServiceManager.manager.getTaskDescription(item)}
            </Text>
            <ProgressBar
              indeterminate={taskQueue && taskQueue.length > 0 && index === 0}
              color={theme.primary}
              style={{ marginTop: 8 }}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyView
            icon="(･o･;)"
            description={'No running tasks'}
            theme={theme}
          />
        }
      />
      {taskQueue && taskQueue.length > 0 ? (
        <FAB
          style={[styles.fab, { backgroundColor: theme.primary, bottom }]}
          color={theme.onPrimary}
          label={
            isRunning ? getString('common.pause') : getString('common.resume')
          }
          uppercase={false}
          icon={isRunning ? 'pause' : 'play'}
          onPress={() => {
            if (isRunning) {
              ServiceManager.manager.pause();
              setIsRunning(false);
            } else {
              ServiceManager.manager.resume();
              setIsRunning(true);
            }
          }}
        />
      ) : null}
    </>
  );
};

export default DownloadQueue;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 16,
  },
});
