import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '../assets';
import { colors, fontSize, radius, scale, typography } from '../theme';
import { readValue, StorageKeys } from '../storage/storage';
import type { RootStackParamList } from '../navigation/types';

const SPLASH_DURATION = 4000;

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props): React.JSX.Element {
  const progress = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.86)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const captionOpacity = useRef(new Animated.Value(0)).current;
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    readValue<boolean>(StorageKeys.onboarding, false).then(setOnboardingDone);
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        speed: 6,
        bounciness: 6,
        useNativeDriver: true,
      }),
      Animated.timing(captionOpacity, {
        toValue: 1,
        duration: 600,
        delay: 520,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: SPLASH_DURATION - 260,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [logoOpacity, logoScale, captionOpacity, progress]);

  useEffect(() => {
    if (onboardingDone === null) {
      return;
    }
    const timer = setTimeout(() => {
      if (onboardingDone) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    }, SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [onboardingDone, navigation]);

  const barWidth = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['4%', '100%'],
      }),
    [progress],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.background}>
        <View style={styles.center}>
          <Animated.View
            style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
            <Image source={images.logo} style={styles.logoImage} resizeMode="contain" />
            <Text style={styles.logo}>Perfect Frame Club</Text>
          </Animated.View>

          <Animated.View style={[styles.progressBlock, { opacity: captionOpacity }]}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: barWidth }]}>
                <LinearGradient
                  colors={['#7FB2FF', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
            <Text style={[typography.small, styles.caption]}>Preparing your table…</Text>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text style={[typography.tiny, styles.footerText]}>
            Perfect Frame Club
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(28),
  },
  logoImage: {
    width: scale(220),
    height: scale(220),
    alignSelf: 'center',
    marginBottom: scale(20),
  },
  logo: {
    color: colors.textPrimary,
    fontSize: fontSize(38),
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  progressBlock: {
    width: '100%',
    maxWidth: scale(230),
    alignItems: 'center',
    marginTop: scale(30),
  },
  progressTrack: {
    width: '100%',
    height: scale(4),
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  caption: {
    marginTop: scale(14),
    color: 'rgba(226,236,255,0.82)',
    fontSize: fontSize(13),
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: scale(34),
  },
  footerText: {
    color: 'rgba(168,190,226,0.5)',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
