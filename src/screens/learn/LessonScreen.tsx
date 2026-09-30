import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { NavHeader } from '../../components/NavHeader';
import { Badge, BallBadge, SectionLabel } from '../../components/Badge';
import { ProgressBar } from '../../components/ProgressBar';
import { GradientButton, GradientIconButton } from '../../components/GradientButton';
import { Icon } from '../../components/Icon';
import { Reveal } from '../../components/Reveal';
import { Sheet } from '../../components/Sheet';
import { lessonById, nextLesson, previousLesson } from '../../data/lessons';
import { useLearn } from '../../context/LearnContext';
import { colors, fontSize, layout, radius, scale, typography } from '../../theme';
import type { LearnStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<LearnStackParamList, 'Lesson'>;

export function LessonScreen({ route, navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { lessonId } = route.params;
  const lesson = lessonById(lessonId);
  const {
    isChecked,
    toggleSection,
    isBookmarked,
    toggleBookmark,
    markCompleted,
    resetLesson,
    markVisited,
  } = useLearn();

  const [readProgress, setReadProgress] = useState(0);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const offsets = useRef<number[]>([]);

  const sections = useMemo(() => {
    if (!lesson) {
      return [] as string[];
    }
    return [
      'Overview',
      lesson.factsTitle,
      ...lesson.body.map((block, index) => block.heading ?? `${lesson.bodyHeading} ${index + 1}`),
      'Key takeaways',
      'Section checklist',
    ];
  }, [lesson]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      const scrollable = Math.max(1, contentSize.height - layoutMeasurement.height);
      setReadProgress(Math.max(0, Math.min(1, contentOffset.y / scrollable)));

      const anchor = contentOffset.y + layoutMeasurement.height * 0.34;
      let current = 0;
      offsets.current.forEach((offset, index) => {
        if (offset <= anchor) {
          current = index;
        }
      });
      if (current !== sectionIndex) {
        setSectionIndex(current);
        markVisited(lessonId, current);
      }
    },
    [sectionIndex, markVisited, lessonId],
  );

  const registerOffset = useCallback((index: number, y: number) => {
    offsets.current[index] = y;
  }, []);

  if (!lesson) {
    return (
      <Screen>
        <NavHeader backLabel="Lessons" onBack={() => navigation.goBack()} />
        <View style={styles.missing}>
          <Text style={[typography.body, styles.missingText]}>This module is unavailable.</Text>
        </View>
      </Screen>
    );
  }

  const next = nextLesson(lessonId);
  const previous = previousLesson(lessonId);
  const bookmarked = isBookmarked(lessonId);
  const percent = Math.round(readProgress * 100);

  return (
    <Screen edges={{ top: true }}>
      <NavHeader
        backLabel="Lessons"
        onBack={() => navigation.goBack()}
        actions={[
          {
            icon: bookmarked ? 'bookmark-filled' : 'bookmark',
            accessibilityLabel: bookmarked ? 'Remove bookmark' : 'Bookmark this module',
            onPress: () => toggleBookmark(lessonId),
            tint: bookmarked ? colors.gold : colors.textSecondary,
          },
          {
            icon: 'more',
            accessibilityLabel: 'Module options',
            onPress: () => setMenuVisible(true),
          },
        ]}
      />

      <ProgressBar
        progress={readProgress}
        height={3}
        rounded={false}
        animated={false}
        trackColor={colors.surfaceMuted}
        style={styles.topBar}
      />

      <View style={styles.meta}>
        <Text style={[typography.label, styles.metaLabel]}>
          MODULE {String(lesson.index).padStart(2, '0')} · SECTION {sectionIndex + 1} OF{' '}
          {sections.length}
        </Text>
        <Text style={[typography.label, styles.metaPercent]}>{percent}%</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: scale(120) + insets.bottom },
        ]}>
        <View onLayout={event => registerOffset(0, event.nativeEvent.layout.y)}>
          <Reveal delay={40}>
            <Badge label={lesson.tag} tone="primary" style={styles.tag} />
            <Text style={[typography.display, styles.title]}>{lesson.title}</Text>
            <Text style={[typography.body, styles.intro]}>{lesson.intro}</Text>
          </Reveal>
        </View>

        <Reveal delay={110}>
          <View
            style={styles.factsCard}
            onLayout={event => registerOffset(1, event.nativeEvent.layout.y)}>
            <LinearGradient
              colors={['#16233B', '#0E1727']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <SectionLabel label={lesson.factsTitle} style={styles.factsTitle} />
            {lesson.facts.map((fact, index) => (
              <View
                key={`${fact.label}-${index}`}
                style={[styles.factRow, index === 0 && styles.factRowFirst]}>
                <View style={styles.factLeft}>
                  {fact.ball ? <BallBadge ball={fact.ball} style={styles.factBall} /> : null}
                  <Text numberOfLines={1} style={[typography.bodyStrong, styles.factLabel]}>
                    {fact.label}
                  </Text>
                </View>
                <Text numberOfLines={1} style={[typography.bodyStrong, styles.factValue]}>
                  {fact.value}
                </Text>
              </View>
            ))}
            {lesson.factsFooter ? (
              <View style={styles.factsFooter}>
                <Text style={[typography.smallStrong, styles.factsFooterText]}>
                  {lesson.factsFooter}
                </Text>
              </View>
            ) : null}
          </View>
        </Reveal>

        {lesson.body.map((block, blockIndex) => (
          <Reveal key={`block-${blockIndex}`} delay={150 + blockIndex * 60}>
            <View
              onLayout={event => registerOffset(2 + blockIndex, event.nativeEvent.layout.y)}
              style={styles.bodyBlock}>
              <Text style={[typography.heading, styles.bodyHeading]}>
                {block.heading ?? lesson.bodyHeading}
              </Text>
              {block.paragraphs.map((paragraph, paragraphIndex) => (
                <Text
                  key={`paragraph-${blockIndex}-${paragraphIndex}`}
                  style={[typography.body, styles.paragraph]}>
                  {paragraph}
                </Text>
              ))}
            </View>
          </Reveal>
        ))}

        <Reveal delay={220}>
          <View
            style={styles.takeawayCard}
            onLayout={event =>
              registerOffset(2 + lesson.body.length, event.nativeEvent.layout.y)
            }>
            <LinearGradient
              colors={['rgba(214,168,78,0.12)', 'rgba(214,168,78,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <SectionLabel label="Key takeaways" style={styles.takeawayLabel} />
            {lesson.takeaways.map((takeaway, index) => (
              <View key={`takeaway-${index}`} style={styles.takeawayRow}>
                <View style={styles.takeawayDot} />
                <Text style={[typography.body, styles.takeawayText]}>{takeaway}</Text>
              </View>
            ))}
          </View>
        </Reveal>

        <Reveal delay={280}>
          <View
            style={styles.checklistCard}
            onLayout={event =>
              registerOffset(3 + lesson.body.length, event.nativeEvent.layout.y)
            }>
            <Text style={[typography.subheading, styles.checklistTitle]}>Section checklist</Text>
            {lesson.checklist.map(item => {
              const checked = isChecked(lesson.id, item);
              return (
                <Pressable
                  key={item}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                  onPress={() => toggleSection(lesson.id, item, lesson.checklist.length)}
                  style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}>
                  <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
                    {checked ? (
                      <Icon name="check" size={scale(13)} color="#04150E" strokeWidth={2.8} />
                    ) : null}
                  </View>
                  <Text
                    style={[
                      typography.body,
                      styles.checkLabel,
                      checked && styles.checkLabelOn,
                    ]}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Reveal>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, scale(14)) }]}>
        <LinearGradient
          colors={['rgba(6,26,19,0)', 'rgba(6,26,19,0.92)', '#061A13']}
          style={styles.footerFade}
          pointerEvents="none"
        />
        <View style={styles.footerRow}>
          <GradientIconButton
            name="chevron-left"
            variant="neutral"
            size={46}
            disabled={!previous}
            onPress={() =>
              previous && navigation.replace('Lesson', { lessonId: previous.id })
            }
          />
          <GradientButton
            label={next ? `Next: ${next.listTitle}` : 'Back to lessons'}
            glow
            style={styles.footerButton}
            onPress={() => {
              if (next) {
                navigation.replace('Lesson', { lessonId: next.id });
              } else {
                navigation.goBack();
              }
            }}
          />
        </View>
      </View>

      <Sheet visible={menuVisible} onClose={() => setMenuVisible(false)}>
        <Text style={[typography.heading, styles.menuTitle]}>
          {String(lesson.index).padStart(2, '0')} · {lesson.listTitle}
        </Text>

        <MenuRow
          icon="check"
          label="Mark module as completed"
          onPress={() => {
            markCompleted(lesson.id);
            setMenuVisible(false);
          }}
        />
        <MenuRow
          icon={bookmarked ? 'bookmark-filled' : 'bookmark'}
          label={bookmarked ? 'Remove bookmark' : 'Bookmark this module'}
          onPress={() => {
            toggleBookmark(lesson.id);
            setMenuVisible(false);
          }}
        />
        <MenuRow
          icon="undo"
          label="Reset module progress"
          tint={colors.danger}
          onPress={() => {
            resetLesson(lesson.id);
            setMenuVisible(false);
          }}
        />

        <GradientButton
          label="Close"
          variant="light"
          style={styles.menuClose}
          onPress={() => setMenuVisible(false)}
        />
      </Sheet>
    </Screen>
  );
}

interface MenuRowProps {
  icon: 'check' | 'bookmark' | 'bookmark-filled' | 'undo';
  label: string;
  tint?: string;
  onPress: () => void;
}

function MenuRow({ icon, label, tint, onPress }: MenuRowProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}>
      <Icon name={icon} size={scale(19)} color={tint ?? colors.textSecondary} />
      <Text style={[typography.bodyStrong, styles.menuLabel, tint ? { color: tint } : null]}>
        {label}
      </Text>
      <Icon name="chevron-right" size={scale(16)} color={colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: scale(8),
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(12),
    paddingBottom: scale(4),
  },
  metaLabel: {
    color: colors.textMuted,
    flex: 1,
  },
  metaPercent: {
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(8),
  },
  tag: {
    marginBottom: scale(12),
  },
  title: {
    marginBottom: scale(10),
  },
  intro: {
    marginBottom: scale(20),
  },
  factsCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    padding: scale(14),
    marginBottom: scale(22),
  },
  factsTitle: {
    marginBottom: scale(6),
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(9),
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  factRowFirst: {
    borderTopWidth: 0,
    paddingTop: scale(6),
  },
  factLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: scale(10),
  },
  factBall: {
    marginRight: scale(10),
  },
  factLabel: {
    flex: 1,
    fontSize: fontSize(14),
  },
  factValue: {
    color: colors.textSecondary,
    fontSize: fontSize(14),
  },
  factsFooter: {
    marginTop: scale(10),
    paddingTop: scale(10),
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    alignItems: 'flex-end',
  },
  factsFooterText: {
    color: colors.gold,
  },
  bodyBlock: {
    marginBottom: scale(14),
  },
  bodyHeading: {
    marginBottom: scale(10),
  },
  paragraph: {
    marginBottom: scale(12),
  },
  takeawayCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(214,168,78,0.24)',
    overflow: 'hidden',
    padding: scale(16),
    marginTop: scale(8),
    marginBottom: scale(16),
  },
  takeawayLabel: {
    color: colors.gold,
    marginBottom: scale(12),
  },
  takeawayRow: {
    flexDirection: 'row',
    marginBottom: scale(10),
  },
  takeawayDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(3),
    backgroundColor: colors.gold,
    marginTop: scale(8),
    marginRight: scale(10),
  },
  takeawayText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: fontSize(14),
  },
  checklistCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    padding: scale(16),
  },
  checklistTitle: {
    marginBottom: scale(12),
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(8),
  },
  checkBox: {
    width: scale(22),
    height: scale(22),
    borderRadius: scale(11),
    borderWidth: 1.6,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  checkBoxOn: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkLabel: {
    flex: 1,
    fontSize: fontSize(14),
  },
  checkLabelOn: {
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  footer: {
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(10),
  },
  footerFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: -scale(28),
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
  },
  footerButton: {
    flex: 1,
  },
  menuTitle: {
    marginBottom: scale(14),
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: scale(14),
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  menuRowPressed: {
    opacity: 0.6,
  },
  menuLabel: {
    flex: 1,
  },
  menuClose: {
    marginTop: scale(18),
    marginBottom: scale(4),
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    textAlign: 'center',
  },
});
