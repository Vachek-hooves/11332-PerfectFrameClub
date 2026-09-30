import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors, fontSize, radius, scale, shadow, typography } from '../theme';
import { Icon, IconName } from '../components/Icon';

const icons: Record<string, IconName> = {
  Learn: 'learn',
  Dictionary: 'dictionary',
  Score: 'score',
  Events: 'events',
  Menu: 'menu',
};

export function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps): React.JSX.Element | null {
  const insets = useSafeAreaInsets();

  const focusedRoute = state.routes[state.index];
  const nestedState = focusedRoute.state;
  const isDetailScreen =
    nestedState !== undefined &&
    typeof nestedState.index === 'number' &&
    nestedState.index > 0;

  if (isDetailScreen) {
    return null;
  }

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, scale(10)) },
      ]}>
      <LinearGradient
        colors={['rgba(6,26,19,0)', 'rgba(6,26,19,0.9)', '#061A13']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.fade}
        pointerEvents="none"
      />
      <View style={styles.bar}>
        <LinearGradient
          colors={['#17253D', '#0C1423']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string' ? options.tabBarLabel : route.name;

          return (
            <TabButton
              key={route.key}
              label={label}
              icon={icons[route.name] ?? 'menu'}
              focused={focused}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabButtonProps {
  label: string;
  icon: IconName;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabButton({
  label,
  icon,
  focused,
  onPress,
  onLongPress,
}: TabButtonProps): React.JSX.Element {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.spring(progress, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 6,
    });
    animation.start();
    return () => animation.stop();
  }, [focused, progress]);

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}>
      <Animated.View
        style={[
          styles.tabInner,
          {
            transform: [
              { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) },
              { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
            ],
          },
        ]}>
        <Icon
          name={icon}
          size={scale(21)}
          color={focused ? colors.primary : colors.textFaint}
          strokeWidth={focused ? 2 : 1.7}
        />
        <Text
          numberOfLines={1}
          style={[
            typography.tiny,
            styles.label,
            { color: focused ? colors.textPrimary : colors.textFaint },
          ]}>
          {label}
        </Text>
      </Animated.View>
      <Animated.View style={[styles.indicator, { opacity: progress }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: scale(12),
    paddingTop: scale(6),
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: -scale(26),
  },
  bar: {
    flexDirection: 'row',
    height: scale(60),
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow(8),
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(3),
  },
  label: {
    fontSize: fontSize(10),
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: scale(26),
    height: scale(2),
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
