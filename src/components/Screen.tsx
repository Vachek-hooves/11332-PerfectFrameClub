import React, { PropsWithChildren } from 'react';
import { StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients } from '../theme';

interface ScreenProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  edges?: { top?: boolean; bottom?: boolean };
  palette?: string[];
  glow?: boolean;
}

export function Screen({
  children,
  style,
  edges = { top: true, bottom: false },
  palette,
  glow = true,
}: ScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <LinearGradient
        colors={palette ?? gradients.screen}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {glow ? (
        <LinearGradient
          colors={['rgba(52,160,105,0.16)', 'rgba(52,160,105,0)']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.glow}
          pointerEvents="none"
        />
      ) : null}
      <View
        style={[
          styles.content,
          {
            paddingTop: edges.top ? insets.top : 0,
            paddingBottom: edges.bottom ? insets.bottom : 0,
          },
          style,
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
});
