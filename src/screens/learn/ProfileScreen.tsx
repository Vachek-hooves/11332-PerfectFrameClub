import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/Screen';
import { NavHeader } from '../../components/NavHeader';
import { Card } from '../../components/Card';
import { TextField } from '../../components/TextField';
import { Chip } from '../../components/SegmentedTabs';
import { GradientButton } from '../../components/GradientButton';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Reveal } from '../../components/Reveal';
import { SectionLabel } from '../../components/Badge';
import { useProfile } from '../../context/ProfileContext';
import { useLearn } from '../../context/LearnContext';
import { useQuizStats } from '../../context/QuizContext';
import { usePractice } from '../../context/PracticeContext';
import { useMatch } from '../../context/MatchContext';
import { usePlans } from '../../context/PlansContext';
import { lessons } from '../../data/lessons';
import { colors, layout, scale, typography } from '../../theme';
import { MemberTier } from '../../types';
import type { LearnStackParamList } from '../../navigation/types';

const tiers: MemberTier[] = ['Classic', 'Silver', 'Gold', 'Platinum'];

type Props = NativeStackScreenProps<LearnStackParamList, 'Profile'>;

export function ProfileScreen({ navigation }: Props): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { profile, saveProfile, resetActivation, clearProfile } = useProfile();
  const { completedCount, resetAllProgress } = useLearn();
  const { stats, resetStats } = useQuizStats();
  const { savedMatches, clearHistory } = useMatch();
  const { state: practice, dispatch: dispatchPractice } = usePractice();
  const { planCount, clearPlans } = usePlans();

  const [name, setName] = useState(profile.name);
  const [memberNumber, setMemberNumber] = useState(profile.memberNumber);
  const [tier, setTier] = useState<MemberTier>(profile.tier);
  const [validTo, setValidTo] = useState(profile.validTo);
  const [confirmReset, setConfirmReset] = useState(false);

  const save = () => {
    saveProfile({
      name: name.trim(),
      memberNumber: memberNumber.replace(/\D/g, '').slice(0, 8),
      tier,
      validTo: validTo.trim(),
    });
    navigation.goBack();
  };

  return (
    <Screen edges={{ top: true }}>
      <NavHeader title="Your details" backLabel="Back" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            { paddingBottom: scale(layout.tabBarHeight + 40) + insets.bottom },
          ]}>
          <Reveal delay={40}>
            <Text style={[typography.body, styles.lead]}>
              These details appear on your club card and greeting. Nothing is sent anywhere — they
              stay on this device.
            </Text>
          </Reveal>

          <Reveal delay={100}>
            <TextField
              label="Full name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              maxLength={40}
              style={styles.field}
            />
          </Reveal>

          <Reveal delay={150}>
            <TextField
              label="Member number"
              placeholder="8 digits"
              value={memberNumber}
              onChangeText={value => setMemberNumber(value.replace(/\D/g, '').slice(0, 8))}
              keyboardType="number-pad"
              maxLength={8}
              hint="Printed on your physical Perfect Frame Club card."
              style={styles.field}
            />
          </Reveal>

          <Reveal delay={200} style={styles.field}>
            <SectionLabel label="Tier" style={styles.tierLabel} />
            <View style={styles.tierRow}>
              {tiers.map(option => (
                <Chip
                  key={option}
                  label={option}
                  active={tier === option}
                  onPress={() => setTier(option)}
                />
              ))}
            </View>
          </Reveal>

          <Reveal delay={250}>
            <TextField
              label="Valid to"
              placeholder="MM/YY"
              value={validTo}
              onChangeText={setValidTo}
              maxLength={5}
              style={styles.field}
            />
          </Reveal>

          <Reveal delay={300}>
            <GradientButton label="Save details" glow onPress={save} style={styles.save} />
          </Reveal>

          <Reveal delay={360} style={styles.field}>
            <SectionLabel label="Your activity" style={styles.tierLabel} />
            <Card contentStyle={styles.statsCard}>
              <StatRow label="Modules completed" value={`${completedCount} of ${lessons.length}`} />
              <StatRow label="Best quiz score" value={stats.bestScore > 0 ? `${stats.bestScore} pts` : '—'} />
              <StatRow label="Matches saved" value={savedMatches.length > 0 ? String(savedMatches.length) : '—'} />
              <StatRow label="Practice sets" value={String(practice.history.length)} />
              <StatRow label="Events planned" value={planCount > 0 ? String(planCount) : '—'} last />
            </Card>
          </Reveal>

          <Reveal delay={420}>
            <GradientButton
              label="Reset all app data"
              variant="neutral"
              size="md"
              onPress={() => setConfirmReset(true)}
              style={styles.reset}
              labelStyle={styles.resetLabel}
            />
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirmReset}
        title="Reset all app data?"
        message="Your details, module progress, quiz scores, saved matches, practice sessions, event plans and table requests will be removed from this device. This cannot be undone."
        confirmLabel="Reset everything"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          clearProfile();
          resetActivation();
          resetAllProgress();
          resetStats();
          clearHistory();
          dispatchPractice({ type: 'reset' });
          clearPlans();
          setName('');
          setMemberNumber('');
          setTier('Classic');
          setValidTo('');
          setConfirmReset(false);
        }}
      />
    </Screen>
  );
}

function StatRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.statRow, last && styles.statRowLast]}>
      <Text style={[typography.small, styles.statLabel]}>{label}</Text>
      <Text style={[typography.smallStrong, styles.statValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(12),
  },
  lead: {
    marginBottom: scale(22),
  },
  field: {
    marginBottom: scale(18),
  },
  tierLabel: {
    marginBottom: scale(10),
  },
  tierRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
  },
  save: {
    marginTop: scale(4),
    marginBottom: scale(26),
  },
  statsCard: {
    paddingVertical: scale(4),
    paddingHorizontal: scale(14),
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(13),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  statRowLast: {
    borderBottomWidth: 0,
  },
  statLabel: {
    color: colors.textMuted,
    flex: 1,
    paddingRight: scale(10),
  },
  statValue: {
    color: colors.textPrimary,
  },
  reset: {
    marginTop: scale(4),
  },
  resetLabel: {
    color: colors.danger,
  },
});
