import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
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
import { ProgressBar } from '../../components/ProgressBar';
import { GradientButton, GradientIconButton } from '../../components/GradientButton';
import { Reveal } from '../../components/Reveal';
import { SectionLabel } from '../../components/Badge';
import { Icon } from '../../components/Icon';
import { Sheet } from '../../components/Sheet';
import {
  buildQuizSet,
  QUIZ_POINTS_PER_MATCH,
  QUIZ_ROUNDS_PER_GAME,
} from '../../data/quizRounds';
import { useQuizStats } from '../../context/QuizContext';
import { colors, fontSize, layout, radius, scale, shadow, typography } from '../../theme';
import { formatClock } from '../../utils/format';
import type { DictionaryStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<DictionaryStackParamList, 'Quiz'>;

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragState {
  optionId: string;
  label: string;
  origin: Rect;
}

export function QuizScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { stats, recordAttempt } = useQuizStats();

  const [rounds, setRounds] = useState(() => buildQuizSet(QUIZ_ROUNDS_PER_GAME));
  const [roundIndex, setRoundIndex] = useState(0);
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [correctTotal, setCorrectTotal] = useState(0);
  const [missedTopics, setMissedTopics] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);

  const dragOffset = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const dropRefs = useRef<Record<string, View | null>>({});
  const dropRects = useRef<Record<string, Rect>>({});
  const pendingDrag = useRef<DragState | null>(null);

  const timing = useRef({ base: 0, resumedAt: Date.now() });

  const round = rounds[roundIndex];

  const matchedCount = useMemo(
    () =>
      round.statements.filter(statement => placements[statement.id] === statement.answerId).length,
    [round, placements],
  );

  const placedCount = useMemo(
    () => round.statements.filter(statement => placements[statement.id]).length,
    [round, placements],
  );

  const answeredStatements = roundIndex * 3;
  const accuracySoFar =
    answeredStatements > 0 ? Math.round((correctTotal / answeredStatements) * 100) : 0;

  const elapsedSeconds = () => {
    const { base, resumedAt } = timing.current;
    return Math.round((base + (Date.now() - resumedAt)) / 1000);
  };

  const measureZones = useCallback(() => {
    round.statements.forEach(statement => {
      const node = dropRefs.current[statement.id];
      node?.measureInWindow((x, y, width, height) => {
        dropRects.current[statement.id] = { x, y, width, height };
      });
    });
  }, [round]);

  const place = useCallback((statementId: string, optionId: string) => {
    setPlacements(previous => {
      const next: Record<string, string> = {};
      Object.entries(previous).forEach(([key, value]) => {
        if (value !== optionId) {
          next[key] = value;
        }
      });
      next[statementId] = optionId;
      return next;
    });
    setSelectedOption(null);
  }, []);

  const clearSlot = useCallback((statementId: string) => {
    setPlacements(previous => {
      const next = { ...previous };
      delete next[statementId];
      return next;
    });
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5,
        onPanResponderGrant: () => {
          measureZones();
          dragOffset.setValue({ x: 0, y: 0 });
          if (pendingDrag.current) {
            setDrag(pendingDrag.current);
          }
        },
        onPanResponderMove: (_event, gesture) => {
          dragOffset.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (_event, gesture) => {
          const optionId = pendingDrag.current?.optionId;
          const target = Object.entries(dropRects.current).find(([, rect]) => {
            return (
              gesture.moveX >= rect.x &&
              gesture.moveX <= rect.x + rect.width &&
              gesture.moveY >= rect.y &&
              gesture.moveY <= rect.y + rect.height
            );
          });

          if (optionId && target) {
            place(target[0], optionId);
          }

          dragOffset.setValue({ x: 0, y: 0 });
          pendingDrag.current = null;
          setDrag(null);
        },
        onPanResponderTerminate: () => {
          dragOffset.setValue({ x: 0, y: 0 });
          pendingDrag.current = null;
          setDrag(null);
        },
      }),
    [dragOffset, measureZones, place],
  );

  const beginDrag = useCallback(
    (optionId: string, label: string, node: View | null) => {
      if (checked) {
        return;
      }
      node?.measureInWindow((x, y, width, height) => {
        pendingDrag.current = { optionId, label, origin: { x, y, width, height } };
      });
    },
    [checked],
  );

  const cancelDrag = useCallback(() => {
    pendingDrag.current = null;
    setDrag(null);
  }, []);

  const check = () => {
    const correct = round.statements.filter(
      statement => placements[statement.id] === statement.answerId,
    ).length;

    setScore(previous => previous + correct * QUIZ_POINTS_PER_MATCH);
    setCorrectTotal(previous => previous + correct);
    if (correct < round.statements.length) {
      setMissedTopics(previous => [...previous, round.title]);
    }
    setChecked(true);
  };

  const advance = () => {
    if (roundIndex >= rounds.length - 1) {
      finish();
      return;
    }
    setRoundIndex(previous => previous + 1);
    setPlacements({});
    setChecked(false);
    setSelectedOption(null);
  };

  const finish = () => {
    const totalStatements = rounds.length * 3;
    const duration = elapsedSeconds();
    const accuracy = Math.round((correctTotal / totalStatements) * 100);
    const { isBest, previousBest } = recordAttempt({
      score,
      correct: correctTotal,
      total: totalStatements,
      accuracy,
      durationSeconds: duration,
    });

    navigation.replace('QuizResult', {
      score,
      correct: correctTotal,
      total: totalStatements,
      accuracy,
      durationSeconds: duration,
      isBest,
      previousBest,
      weakestTopic: weakestTopic(missedTopics),
    });
  };

  const restart = () => {
    setRounds(buildQuizSet(QUIZ_ROUNDS_PER_GAME));
    setRoundIndex(0);
    setPlacements({});
    setChecked(false);
    setScore(0);
    setCorrectTotal(0);
    setMissedTopics([]);
    setSelectedOption(null);
    timing.current = { base: 0, resumedAt: Date.now() };
    setPaused(false);
  };

  const pause = () => {
    timing.current.base += Date.now() - timing.current.resumedAt;
    setPaused(true);
  };

  const resume = () => {
    timing.current.resumedAt = Date.now();
    setPaused(false);
  };

  const usedOptionIds = new Set(Object.values(placements));

  return (
    <Screen edges={{ top: true }}>
      <NavHeader
        title="Match Quiz"
        backLabel="Exit"
        onBack={() => setExitVisible(true)}
        center
      />

      <View style={styles.statsRow}>
        <StatTile label="Question" value={`${roundIndex + 1} / ${rounds.length}`} />
        <StatTile label="Score" value={`${score} pts`} highlight />
        <StatTile
          label="Matched"
          value={`${checked ? matchedCount : placedCount} of ${round.statements.length}`}
          sub={checked ? 'matched' : 'placed'}
        />
        <View style={styles.pauseSlot}>
          <GradientIconButton
            name="pause"
            variant="neutral"
            size={36}
            iconSize={14}
            onPress={pause}
          />
        </View>
      </View>

      <ProgressBar
        progress={(roundIndex + (checked ? 1 : 0)) / rounds.length}
        height={3}
        rounded={false}
        style={styles.progress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={drag === null}
        onScrollEndDrag={measureZones}
        onMomentumScrollEnd={measureZones}
        contentContainerStyle={styles.content}>
        <Reveal delay={40}>
          <Text style={[typography.small, styles.instruction]}>
            Drag each term onto the statement it defines. One card is a decoy — leave it in the
            tray.
          </Text>
        </Reveal>

        {round.statements.map((statement, index) => {
          const placedId = placements[statement.id];
          const placedOption = round.options.find(option => option.id === placedId);
          const isCorrect = checked && placedId === statement.answerId;
          const isWrong = checked && placedId !== undefined && placedId !== statement.answerId;
          const isMissing = checked && placedId === undefined;
          const answerLabel = round.options.find(
            option => option.id === statement.answerId,
          )?.label;

          return (
            <Reveal
              key={statement.id}
              delay={80 + index * 70}
              style={styles.statementWrap}>
              <View
                style={[
                  styles.statementCard,
                  isCorrect && styles.statementCorrect,
                  isWrong && styles.statementWrong,
                  isMissing && styles.statementMissing,
                ]}>
                <Text style={[typography.body, styles.statementText]}>{statement.text}</Text>

                <Pressable
                  ref={node => {
                    dropRefs.current[statement.id] = node as unknown as View | null;
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    placedOption
                      ? `${placedOption.label} placed. Tap to remove.`
                      : 'Empty answer slot. Tap after selecting a card to place it.'
                  }
                  onLayout={measureZones}
                  onPress={() => {
                    if (checked) {
                      return;
                    }
                    if (selectedOption) {
                      place(statement.id, selectedOption);
                    } else if (placedId) {
                      clearSlot(statement.id);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.dropZone,
                    placedOption ? styles.dropZoneFilled : styles.dropZoneEmpty,
                    isCorrect && styles.dropZoneCorrect,
                    isWrong && styles.dropZoneWrong,
                    selectedOption && !checked && !placedOption && styles.dropZoneTarget,
                    pressed && !checked && styles.pressed,
                  ]}>
                  <Text
                    numberOfLines={2}
                    style={[
                      typography.bodyStrong,
                      placedOption ? styles.dropFilledText : styles.dropEmptyText,
                    ]}>
                    {placedOption ? placedOption.label : 'Drop a term here'}
                  </Text>
                  {placedOption && !checked ? (
                    <Icon name="close" size={scale(15)} color={colors.textMuted} />
                  ) : null}
                </Pressable>

                {checked ? (
                  <Text
                    style={[
                      typography.tiny,
                      styles.feedback,
                      isCorrect ? styles.feedbackGood : styles.feedbackBad,
                    ]}>
                    {isCorrect
                      ? `Correct — that's ${placedOption?.label.toLowerCase()}. +${QUIZ_POINTS_PER_MATCH} pts`
                      : `Not quite — the answer is ${answerLabel}.`}
                  </Text>
                ) : null}
              </View>
            </Reveal>
          );
        })}
      </ScrollView>

      <View style={[styles.tray, { paddingBottom: Math.max(insets.bottom, scale(12)) }]}>
        <LinearGradient
          colors={['rgba(6,26,19,0)', 'rgba(6,26,19,0.94)', '#061A13']}
          style={styles.trayFade}
          pointerEvents="none"
        />

        <View style={styles.trayHead}>
          <SectionLabel label={`Answer tray · ${round.options.length} cards`} />
          {selectedOption && !checked ? (
            <Text style={[typography.tiny, styles.trayHint]}>Tap a slot to place</Text>
          ) : null}
        </View>

        <View style={styles.trayGrid}>
          {round.options.map(option => {
            const used = usedOptionIds.has(option.id);
            const isDecoy =
              checked && !round.statements.some(statement => statement.answerId === option.id);
            const selected = selectedOption === option.id;

            if (used && !checked) {
              return <View key={option.id} style={[styles.trayCard, styles.trayCardEmpty]} />;
            }

            return (
              <TrayCard
                key={option.id}
                label={option.label}
                selected={selected}
                decoy={isDecoy}
                disabled={checked}
                dragging={drag?.optionId === option.id}
                panHandlers={panResponder.panHandlers}
                onBeginDrag={node => beginDrag(option.id, option.label, node)}
                onPress={() => {
                  if (checked) {
                    return;
                  }
                  cancelDrag();
                  setSelectedOption(previous => (previous === option.id ? null : option.id));
                }}
              />
            );
          })}
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={checked || placedCount === 0}
            onPress={() => {
              setPlacements({});
              setSelectedOption(null);
            }}
            style={({ pressed }) => [
              styles.clearButton,
              (checked || placedCount === 0) && styles.clearDisabled,
              pressed && styles.pressed,
            ]}>
            <Text style={[typography.smallStrong, styles.clearLabel]}>Clear</Text>
          </Pressable>

          <GradientButton
            label={
              checked
                ? roundIndex >= rounds.length - 1
                  ? 'See results'
                  : 'Next question'
                : 'Check answers'
            }
            disabled={!checked && placedCount === 0}
            glow
            style={styles.primaryAction}
            onPress={checked ? advance : check}
          />

          {!checked ? (
            <GradientIconButton
              name="chevron-right"
              variant="neutral"
              size={44}
              onPress={() => {
                setChecked(true);
                setMissedTopics(previous => [...previous, round.title]);
              }}
            />
          ) : null}
        </View>
      </View>

      {drag ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View
            style={[
              styles.dragGhost,
              {
                left: drag.origin.x,
                top: drag.origin.y,
                width: drag.origin.width,
                height: drag.origin.height,
                transform: [
                  { translateX: dragOffset.x },
                  { translateY: dragOffset.y },
                  { scale: 1.04 },
                ],
              },
            ]}>
            <LinearGradient
              colors={['#2E4A7C', '#1B2C4A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text numberOfLines={2} style={[typography.smallStrong, styles.dragGhostLabel]}>
              {drag.label}
            </Text>
          </Animated.View>
        </View>
      ) : null}

      <Sheet visible={paused} onClose={resume} dismissOnBackdrop={false}>
        <View style={styles.pauseIcon}>
          <Icon name="pause" size={scale(22)} color={colors.primary} />
        </View>
        <Text style={[typography.heading, styles.pauseTitle]}>Quiz paused</Text>
        <Text style={[typography.body, styles.pauseBody]}>
          Your progress and score are held. Resume whenever you are ready to play the next round.
        </Text>

        <View style={styles.pauseStats}>
          <PauseRow label="Progress" value={`Question ${roundIndex + 1} of ${rounds.length}`} />
          <PauseRow label="Current score" value={`${score} pts`} />
          <PauseRow
            label="Accuracy so far"
            value={answeredStatements > 0 ? `${accuracySoFar}%` : '—'}
          />
          <PauseRow label="Time" value={formatClock(elapsedSeconds())} last />
        </View>

        <GradientButton label="Resume quiz" glow onPress={resume} style={styles.pauseAction} />
        <GradientButton
          label="Restart from question 1"
          variant="neutral"
          size="md"
          onPress={restart}
          style={styles.pauseAction}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setPaused(false);
            navigation.goBack();
          }}
          style={({ pressed }) => [styles.endQuiz, pressed && styles.pressed]}>
          <Text style={[typography.button, styles.endQuizLabel]}>End quiz</Text>
        </Pressable>
      </Sheet>

      <Sheet visible={exitVisible} onClose={() => setExitVisible(false)}>
        <Text style={[typography.heading, styles.pauseTitle]}>Leave this quiz?</Text>
        <Text style={[typography.body, styles.pauseBody]}>
          You are on question {roundIndex + 1} of {rounds.length} with {score} points. Leaving now
          discards this round — your best score stays at {stats.bestScore || 0}.
        </Text>
        <GradientButton
          label="Keep playing"
          glow
          style={styles.pauseAction}
          onPress={() => setExitVisible(false)}
        />
        <GradientButton
          label="Leave quiz"
          variant="neutral"
          size="md"
          style={styles.pauseAction}
          labelStyle={styles.leaveLabel}
          onPress={() => {
            setExitVisible(false);
            navigation.goBack();
          }}
        />
      </Sheet>
    </Screen>
  );
}

interface TrayCardProps {
  label: string;
  selected: boolean;
  decoy: boolean;
  disabled: boolean;
  dragging: boolean;
  panHandlers: ReturnType<typeof PanResponder.create>['panHandlers'];
  onBeginDrag: (node: View | null) => void;
  onPress: () => void;
}

function TrayCard({
  label,
  selected,
  decoy,
  disabled,
  dragging,
  panHandlers,
  onBeginDrag,
  onPress,
}: TrayCardProps): React.JSX.Element {
  const ref = useRef<View | null>(null);

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        styles.trayCard,
        selected && styles.trayCardSelected,
        decoy && styles.trayCardDecoy,
        dragging && styles.trayCardDragging,
      ]}
      onTouchStart={() => {
        if (!disabled) {
          onBeginDrag(ref.current);
        }
      }}
      {...(disabled ? {} : panHandlers)}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}. Drag to a statement or tap to select.`}
        disabled={disabled}
        onPress={onPress}
        style={styles.trayCardInner}>
        <Text numberOfLines={2} style={[typography.smallStrong, styles.trayCardLabel]}>
          {label}
        </Text>
        <Text numberOfLines={1} style={[typography.tiny, styles.trayCardHint]}>
          {decoy ? 'Decoy card' : disabled ? 'Answer card' : 'Drag to a statement'}
        </Text>
      </Pressable>
    </View>
  );
}

function StatTile({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.statTile, highlight && styles.statTileHighlight]}>
      <Text style={[typography.label, styles.statTileLabel]}>{label.toUpperCase()}</Text>
      <Text numberOfLines={1} style={[typography.smallStrong, styles.statTileValue]}>
        {value}
      </Text>
      {sub ? (
        <Text numberOfLines={1} style={[typography.tiny, styles.statTileSub]}>
          {sub}
        </Text>
      ) : null}
    </View>
  );
}

function PauseRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.pauseRow, last && styles.pauseRowLast]}>
      <Text style={[typography.small, styles.pauseRowLabel]}>{label}</Text>
      <Text style={[typography.smallStrong, styles.pauseRowValue]}>{value}</Text>
    </View>
  );
}

function weakestTopic(missed: string[]): string | null {
  if (missed.length === 0) {
    return null;
  }
  const counts = new Map<string, number>();
  missed.forEach(title => counts.set(title, (counts.get(title) ?? 0) + 1));
  const [topic] = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
  return topic.replace(/^Match the /i, '').replace(/s$/, '');
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: scale(8),
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(10),
    paddingBottom: scale(12),
  },
  statTile: {
    flex: 1,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingVertical: scale(8),
    paddingHorizontal: scale(9),
  },
  statTileHighlight: {
    borderColor: 'rgba(59,130,246,0.4)',
    backgroundColor: 'rgba(59,130,246,0.1)',
  },
  statTileLabel: {
    fontSize: fontSize(8),
    color: colors.textFaint,
  },
  statTileValue: {
    marginTop: scale(3),
    fontSize: fontSize(13),
  },
  statTileSub: {
    color: colors.textFaint,
    fontSize: fontSize(9),
  },
  pauseSlot: {
    justifyContent: 'center',
  },
  progress: {
    marginBottom: scale(4),
  },
  content: {
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(14),
    paddingBottom: scale(20),
  },
  instruction: {
    marginBottom: scale(16),
    lineHeight: fontSize(19),
  },
  statementWrap: {
    marginBottom: scale(12),
  },
  statementCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    padding: scale(13),
  },
  statementCorrect: {
    borderColor: 'rgba(52,201,138,0.42)',
    backgroundColor: 'rgba(52,201,138,0.07)',
  },
  statementWrong: {
    borderColor: 'rgba(229,84,79,0.42)',
    backgroundColor: 'rgba(229,84,79,0.07)',
  },
  statementMissing: {
    borderColor: 'rgba(232,163,61,0.4)',
  },
  statementText: {
    fontSize: fontSize(14),
    lineHeight: fontSize(20),
    color: colors.textPrimary,
  },
  dropZone: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(8),
    minHeight: scale(44),
    marginTop: scale(11),
    paddingHorizontal: scale(13),
    paddingVertical: scale(10),
    borderRadius: radius.sm,
  },
  dropZoneEmpty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  dropZoneFilled: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceAlt,
  },
  dropZoneTarget: {
    borderColor: 'rgba(59,130,246,0.6)',
    backgroundColor: 'rgba(59,130,246,0.1)',
    borderStyle: 'solid',
  },
  dropZoneCorrect: {
    borderColor: 'rgba(52,201,138,0.5)',
    backgroundColor: 'rgba(52,201,138,0.1)',
  },
  dropZoneWrong: {
    borderColor: 'rgba(229,84,79,0.5)',
    backgroundColor: 'rgba(229,84,79,0.1)',
  },
  dropFilledText: {
    flex: 1,
    fontSize: fontSize(14),
  },
  dropEmptyText: {
    flex: 1,
    fontSize: fontSize(13),
    color: colors.textFaint,
    fontWeight: '500',
  },
  feedback: {
    marginTop: scale(9),
  },
  feedbackGood: {
    color: colors.success,
  },
  feedbackBad: {
    color: colors.danger,
  },
  pressed: {
    opacity: 0.7,
  },
  tray: {
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(10),
  },
  trayFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: -scale(26),
  },
  trayHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(9),
  },
  trayHint: {
    color: colors.primary,
  },
  trayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  trayCard: {
    width: '48.4%',
    minHeight: scale(52),
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  trayCardInner: {
    flex: 1,
    paddingHorizontal: scale(11),
    paddingVertical: scale(9),
    justifyContent: 'center',
  },
  trayCardEmpty: {
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.015)',
  },
  trayCardSelected: {
    borderColor: 'rgba(59,130,246,0.6)',
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  trayCardDecoy: {
    borderColor: 'rgba(232,163,61,0.4)',
  },
  trayCardDragging: {
    opacity: 0.25,
  },
  trayCardLabel: {
    fontSize: fontSize(13),
  },
  trayCardHint: {
    marginTop: scale(2),
    color: colors.textFaint,
    fontSize: fontSize(10),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    marginTop: scale(12),
  },
  clearButton: {
    height: scale(48),
    paddingHorizontal: scale(16),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearDisabled: {
    opacity: 0.45,
  },
  clearLabel: {
    color: colors.textSecondary,
  },
  primaryAction: {
    flex: 1,
  },
  dragGhost: {
    position: 'absolute',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(122,168,255,0.7)',
    overflow: 'hidden',
    paddingHorizontal: scale(11),
    justifyContent: 'center',
    ...shadow(10),
  },
  dragGhostLabel: {
    fontSize: fontSize(13),
  },
  pauseIcon: {
    alignSelf: 'center',
    width: scale(50),
    height: scale(50),
    borderRadius: scale(25),
    backgroundColor: 'rgba(59,130,246,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.36)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(14),
  },
  pauseTitle: {
    textAlign: 'center',
  },
  pauseBody: {
    textAlign: 'center',
    marginTop: scale(8),
    fontSize: fontSize(14),
  },
  pauseStats: {
    marginTop: scale(18),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: scale(14),
  },
  pauseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(11),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  pauseRowLast: {
    borderBottomWidth: 0,
  },
  pauseRowLabel: {
    color: colors.textMuted,
  },
  pauseRowValue: {
    color: colors.textPrimary,
  },
  pauseAction: {
    marginTop: scale(12),
  },
  endQuiz: {
    alignSelf: 'center',
    paddingVertical: scale(16),
  },
  endQuizLabel: {
    color: colors.textMuted,
    fontSize: fontSize(14),
  },
  leaveLabel: {
    color: colors.danger,
  },
});
