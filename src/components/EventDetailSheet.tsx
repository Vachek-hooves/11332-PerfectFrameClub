import React, { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { Sheet } from './Sheet';
import { Badge } from './Badge';
import { Icon, IconName } from './Icon';
import { GradientButton } from './GradientButton';
import { colors, fontSize, radius, scale, typography } from '../theme';
import { ClubEvent, PlanState } from '../types';

interface EventDetailSheetProps {
  event: ClubEvent | null;
  plan?: PlanState;
  onClose: () => void;
  onToggleGoing: () => void;
  onToggleInterested: () => void;
}

export function EventDetailSheet({
  event,
  plan,
  onClose,
  onToggleGoing,
  onToggleInterested,
}: EventDetailSheetProps): React.JSX.Element {
  const [shareNote, setShareNote] = useState<string | null>(null);
  const going = plan === 'going';
  const interested = plan === 'interested';

  const share = async () => {
    if (!event) {
      return;
    }
    try {
      await Share.share({
        message: `${event.title} — ${event.dateLabel}, ${event.timeLabel}. ${event.venue}. Perfect Frame Club.`,
      });
      setShareNote(null);
    } catch {
      setShareNote('Sharing is unavailable on this device.');
    }
  };

  return (
    <Sheet visible={event !== null} onClose={onClose} scrollable maxHeightRatio={0.88}>
      {event ? (
        <View style={styles.body}>
          <View style={styles.head}>
            <Badge label={event.category} tone="primary" />
            {event.badge ? <Badge label={event.badge} tone="gold" /> : null}
          </View>

          <Text style={[typography.title, styles.title]}>{event.title}</Text>

          <View style={styles.facts}>
            <FactRow icon="calendar" text={`${event.dateLabel} · ${event.timeLabel}`} />
            <FactRow icon="pin" text={event.venue} />
            {event.format ? <FactRow icon="clock" text={event.format} last /> : null}
          </View>

          <Text style={[typography.body, styles.description]}>{event.description}</Text>

          <GradientButton
            label={going ? 'Remove from my plans' : 'Add to my plans'}
            variant={going ? 'neutral' : 'primary'}
            glow={!going}
            style={styles.primary}
            onPress={onToggleGoing}
          />

          <Pressable
            accessibilityRole="button"
            onPress={onToggleInterested}
            style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}>
            <Text style={[typography.button, styles.secondaryLabel]}>
              {interested ? 'Remove from interested' : 'Mark as interested'}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={share}
            style={({ pressed }) => [styles.shareRow, pressed && styles.pressed]}>
            <Icon name="share" size={scale(16)} color={colors.textMuted} />
            <Text style={[typography.small, styles.shareLabel]}>Share with a member</Text>
          </Pressable>

          {shareNote ? (
            <Text style={[typography.tiny, styles.shareNote]}>{shareNote}</Text>
          ) : null}
        </View>
      ) : null}
    </Sheet>
  );
}

function FactRow({
  icon,
  text,
  last = false,
}: {
  icon: IconName;
  text: string;
  last?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.factRow, last && styles.factRowLast]}>
      <View style={styles.factIcon}>
        <Icon name={icon} size={scale(16)} color={colors.textSecondary} />
      </View>
      <Text style={[typography.bodyStrong, styles.factText]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingBottom: scale(10),
  },
  head: {
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: scale(14),
  },
  title: {
    marginBottom: scale(18),
  },
  facts: {
    marginBottom: scale(18),
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
    paddingVertical: scale(9),
  },
  factRowLast: {
    paddingBottom: scale(2),
  },
  factIcon: {
    width: scale(34),
    height: scale(34),
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factText: {
    flex: 1,
    fontSize: fontSize(14),
  },
  description: {
    marginBottom: scale(22),
    fontSize: fontSize(14),
  },
  primary: {
    marginBottom: scale(4),
  },
  secondary: {
    alignSelf: 'center',
    paddingVertical: scale(16),
  },
  secondaryLabel: {
    color: colors.primary,
    fontSize: fontSize(14),
  },
  pressed: {
    opacity: 0.65,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(8),
    paddingVertical: scale(6),
  },
  shareLabel: {
    color: colors.textMuted,
  },
  shareNote: {
    textAlign: 'center',
    marginTop: scale(8),
    color: colors.danger,
  },
});
