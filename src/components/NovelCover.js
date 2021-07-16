import React, { useCallback } from "react";
import {
    StyleSheet,
    View,
    Text,
    useWindowDimensions,
    Pressable,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import FastImage from "react-native-fast-image";

import ListView from "./ListView";

import { getDeviceOrientation } from "../services/utils/helpers";
import { useSettings } from "../hooks/reduxHooks";

const NovelCover = ({ item, onPress, libraryStatus, theme }) => {
    const { displayMode, novelsPerRow, showDownloadBadges, showUnreadBadges } =
        useSettings();

    const window = useWindowDimensions();

    const orientation = getDeviceOrientation();

    const getNovelsPerRow = () =>
        orientation === "landscape" ? 6 : novelsPerRow;

    const getHeight = useCallback(
        () => (window.width / getNovelsPerRow()) * (4 / 3),
        []
    );

    return displayMode !== 2 ? (
        <View
            style={{
                flex: 1 / getNovelsPerRow(),
                borderRadius: 4,
                overflow: "hidden",
            }}
        >
            <Pressable
                android_ripple={{ color: theme.colorAccent }}
                style={styles.opac}
                onPress={onPress}
            >
                <>
                    <View style={styles.badgeContainer}>
                        {libraryStatus && <InLibraryBadge theme={theme} />}
                        {showDownloadBadges && item.chaptersDownloaded && (
                            <DownloadBadge
                                showUnreadBadges={showUnreadBadges}
                                chaptersDownloaded={item.chaptersDownloaded}
                                chaptersUnread={item.chaptersUnread}
                            />
                        )}
                        {showUnreadBadges && item.chaptersUnread && (
                            <UnreadBadge
                                theme={theme}
                                chaptersDownloaded={item.chaptersDownloaded}
                                chaptersUnread={item.chaptersUnread}
                                showDownloadBadges={showDownloadBadges}
                            />
                        )}
                    </View>
                    <FastImage
                        source={{ uri: item.novelCover }}
                        style={[
                            { height: getHeight(), borderRadius: 4 },
                            libraryStatus && { opacity: 0.5 },
                        ]}
                    />
                    <View style={styles.compactTitleContainer}>
                        {displayMode === 0 && (
                            <CompactTitle novelName={item.novelName} />
                        )}
                    </View>
                    {displayMode === 1 && (
                        <ComfortableTitle
                            novelName={item.novelName}
                            theme={theme}
                        />
                    )}
                </>
            </Pressable>
        </View>
    ) : (
        <ListView
            item={item}
            downloadBadge={
                showDownloadBadges &&
                item.chaptersDownloaded && (
                    <DownloadBadge
                        showUnreadBadges={showUnreadBadges}
                        chaptersDownloaded={item.chaptersDownloaded}
                        chaptersUnread={item.chaptersUnread}
                    />
                )
            }
            unreadBadge={
                showUnreadBadges &&
                item.chaptersUnread && (
                    <UnreadBadge
                        theme={theme}
                        chaptersDownloaded={item.chaptersDownloaded}
                        chaptersUnread={item.chaptersUnread}
                        showDownloadBadges={showDownloadBadges}
                    />
                )
            }
            inLibraryBadge={libraryStatus && <InLibraryBadge theme={theme} />}
            theme={theme}
            onPress={onPress}
        />
    );
};

export default NovelCover;

const ComfortableTitle = ({ theme, novelName }) => (
    <Text
        numberOfLines={2}
        style={[
            styles.title,
            {
                color: theme.textColorPrimary,
                padding: 4,
            },
        ]}
    >
        {novelName}
    </Text>
);

const CompactTitle = ({ novelName }) => (
    <View style={styles.titleContainer}>
        <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.linearGradient}
        >
            <Text
                numberOfLines={2}
                style={[styles.title, { color: "rgba(255,255,255,1)" }]}
            >
                {novelName}
            </Text>
        </LinearGradient>
    </View>
);

const InLibraryBadge = ({ theme }) => (
    <Text
        style={[
            styles.inLibraryBadge,
            {
                backgroundColor: theme.colorAccent,
                color: theme.colorButtonText,
                borderRadius: 4,
            },
        ]}
    >
        In library
    </Text>
);

const UnreadBadge = ({
    chaptersDownloaded,
    chaptersUnread,
    showDownloadBadges,
    theme,
}) => (
    <Text
        style={[
            styles.unreadBadge,
            !chaptersDownloaded && {
                borderTopLeftRadius: 4,
                borderBottomLeftRadius: 4,
            },
            !showDownloadBadges && {
                borderRadius: 4,
            },
            {
                backgroundColor: theme.colorAccent,
                color: theme.colorButtonText,
            },
        ]}
    >
        {chaptersUnread}
    </Text>
);

const DownloadBadge = ({
    chaptersDownloaded,
    showUnreadBadges,
    chaptersUnread,
}) => (
    <Text
        style={[
            styles.downloadBadge,
            !chaptersUnread && {
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
            },
            !showUnreadBadges && {
                borderRadius: 4,
            },
        ]}
    >
        {chaptersDownloaded}
    </Text>
);

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        borderRadius: 4,
    },
    title: {
        fontFamily: "pt-sans-bold",
        fontSize: 14,
        padding: 8,
    },
    linearGradient: {
        bottom: -1,
        borderRadius: 4,
    },
    opac: {
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 4,
        flex: 1,
    },
    extensionIcon: {
        width: 42,
        height: 42,
        borderRadius: 4,
    },
    listView: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 4,
    },

    downloadBadge: {
        backgroundColor: "#47a84a",
        color: "#FFFFFF",
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        paddingTop: 2,
        paddingHorizontal: 4,
        fontSize: 12,
    },
    unreadBadge: {
        color: "#FFFFFF",
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4,
        paddingTop: 2,
        paddingHorizontal: 4,
        fontSize: 12,
    },
    inLibraryBadge: {
        paddingVertical: 2,
        paddingHorizontal: 4,
        fontSize: 12,
    },
    compactTitleContainer: {
        position: "absolute",
        bottom: 4,
        left: 4,
        right: 4,
    },
    badgeContainer: {
        position: "absolute",
        zIndex: 1,
        top: 8,
        left: 8,
        flexDirection: "row",
    },
});