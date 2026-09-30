import React, { useEffect, useCallback, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { images } from '../assets';
import { Screen } from '../components/Screen';
import { GradientButton } from '../components/GradientButton';
import { Reveal } from '../components/Reveal';
import {
  colors,
  hitSlop,
  layout,
  radius,
  scale,
  typography,
} from '../theme';
import { writeValue, StorageKeys } from '../storage/storage';
import type { RootStackParamList } from '../navigation/types';

interface Slide {
  id: string;
  image: ImageSourcePropType;
  title: string;
  body: string;
  cta: string;
  imageRatio: number;
}

const slides: Slide[] = [
  {
    id: 'slide-1',
    image: images.onboard1,
    title: 'Learn the game, frame by frame',
    body:
      'Twenty guided modules on rules, scoring, cue technique and table etiquette — written for players joining the club.',
    cta: 'Continue',
    imageRatio: 1,
  },
  {
    id: 'slide-2',
    image: images.onboard2,
    title: 'Score every frame you play',
    body:
      'A proper digital scoreboard: ball-value entry, fouls and frame counts. Save each match and watch your averages build across the season.',
    cta: 'Continue',
    imageRatio: 1,
  },
  {
    id: 'slide-3',
    image: images.onboard3,
    title: 'The whole venue, in your pocket',
    body:
      'Browse the Perfect Frame Club events calendar and send table-side food and drink requests to the floor team while you play.',
    cta: 'Enter the club',
    imageRatio: 1.16,
  },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  const isCompactHeight = height < 700;
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [index, setIndex] = useState(0);

  const currentIndex = useRef(index);
  currentIndex.current = index;
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: currentIndex.current * width, animated: false });
  }, [width]);

  const finish = useCallback(() => {
    writeValue(StorageKeys.onboarding, true);
    navigation.replace('Main');
  }, [navigation]);

  const goTo = useCallback(
    (next: number) => {
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setIndex(next);
    },
    [width],
  );

  const onMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);
      setIndex(next);
    },
    [width],
  );

  const handleContinue = useCallback(() => {
    if (index >= slides.length - 1) {
      finish();
      return;
    }
    goTo(index + 1);
  }, [index, goTo, finish]);

  const imageSize = Math.min(width * 0.74, scale(isCompactHeight ? 240 : 300));

  return (
    <Screen edges={{ top: true, bottom: true }}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          {index > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={hitSlop}
              onPress={() => goTo(index - 1)}
              style={({ pressed }) => pressed && styles.pressed}>
              <Text style={[typography.button, styles.headerAction]}>Back</Text>
            </Pressable>
          ) : null}
        </View>
        <View style={[styles.headerSide, styles.headerRight]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            hitSlop={hitSlop}
            onPress={finish}
            style={({ pressed }) => pressed && styles.pressed}>
            <Text style={[typography.button, styles.headerAction]}>Skip</Text>
          </Pressable>
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollRef as never}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        style={styles.pager}>
        {slides.map((slide, slideIndex) => {
          const inputRange = [
            (slideIndex - 1) * width,
            slideIndex * width,
            (slideIndex + 1) * width,
          ];
          const imageTranslate = scrollX.interpolate({
            inputRange,
            outputRange: [width * 0.24, 0, -width * 0.24],
            extrapolate: 'clamp',
          });
          const imageScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.86, 1, 0.86],
            extrapolate: 'clamp',
          });
          const textTranslate = scrollX.interpolate({
            inputRange,
            outputRange: [width * 0.12, 0, -width * 0.12],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.25, 1, 0.25],
            extrapolate: 'clamp',
          });

          return (
            <ScrollView
              key={slide.id}
              style={{ width }}
              contentContainerStyle={styles.slide}
              showsVerticalScrollIndicator={false}
              bounces={false}>
              <View style={styles.artArea}>
                <LinearGradient
                  colors={['rgba(52,160,105,0.2)', 'rgba(52,160,105,0)']}
                  style={[
                    styles.artGlow,
                    { width: imageSize * 1.3, height: imageSize * 1.3, borderRadius: imageSize },
                  ]}
                  pointerEvents="none"
                />
                <Animated.View
                  style={{
                    opacity,
                    transform: [{ translateX: imageTranslate }, { scale: imageScale }],
                  }}>
                  <Image
                    source={slide.image}
                    style={[
                      styles.art,
                      { width: imageSize, height: imageSize / slide.imageRatio },
                      slide.imageRatio !== 1 && styles.artRounded,
                    ]}
                    resizeMode="contain"
                  />
                </Animated.View>
              </View>

              <Animated.View
                style={[
                  styles.copy,
                  { opacity, transform: [{ translateX: textTranslate }] },
                ]}>
                <Text style={[typography.display, styles.title]}>{slide.title}</Text>
                <Text style={[typography.body, styles.body]}>{slide.body}</Text>
              </Animated.View>
            </ScrollView>
          );
        })}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((slide, dotIndex) => {
            const active = dotIndex === index;
            return (
              <Pressable
                key={`dot-${slide.id}`}
                accessibilityRole="button"
                accessibilityLabel={`Go to slide ${dotIndex + 1}`}
                hitSlop={hitSlop}
                onPress={() => goTo(dotIndex)}
                style={[styles.dot, active ? styles.dotActive : styles.dotIdle]}
              />
            );
          })}
        </View>

        <Reveal key={`cta-${index}`} delay={0} duration={320} distance={10}>
          <GradientButton
            label={slides[index].cta}
            onPress={handleContinue}
            glow
            size={isCompactHeight ? 'md' : 'lg'}
          />
        </Reveal>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(6),
    minHeight: scale(34),
  },
  headerSide: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerAction: {
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.6,
  },
  pager: {
    flex: 1,
  },
  slide: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(layout.gutter + 4),
  },
  artArea: {
    flexGrow: 1,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(16),
  },
  artGlow: {
    position: 'absolute',
  },
  art: {
    alignSelf: 'center',
  },
  artRounded: {
    borderRadius: radius.lg,
  },
  copy: {
    paddingBottom: scale(12),
  },
  title: {
    marginBottom: scale(12),
  },
  body: {
    maxWidth: scale(330),
  },
  footer: {
    paddingHorizontal: scale(layout.gutter + 4),
    paddingBottom: scale(14),
    paddingTop: scale(10),
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    marginBottom: scale(22),
  },
  dot: {
    height: scale(5),
    borderRadius: radius.pill,
  },
  dotActive: {
    width: scale(22),
    backgroundColor: colors.primary,
  },
  dotIdle: {
    width: scale(5),
    backgroundColor: colors.borderStrong,
  },
});
