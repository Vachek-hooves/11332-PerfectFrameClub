import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { images } from '../assets';
import { colors, fontSize, radius, scale, typography } from '../theme';
import { Badge } from './Badge';
import { QrBlock } from './QrBlock';
import { GradientButton } from './GradientButton';
import { Icon } from './Icon';
import { Profile } from '../types';
import { formatDate, formatMemberNumber } from '../utils/format';

interface MembershipCardProps {
  profile: Profile;
  onActivate: () => void;
  onShowCode: () => void;
  onEdit: () => void;
}

export function MembershipCard({
  profile,
  onActivate,
  onShowCode,
  onEdit,
}: MembershipCardProps): React.JSX.Element {
  const isActive = profile.activation === 'active';
  const isPending = profile.activation === 'pending';
  const hasDetails = profile.memberNumber.trim().length > 0;

  if (!isActive) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.inactiveCard}>
          <LinearGradient
            colors={['#16233B', '#0D1626']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.inactiveHead}>
            <View style={styles.brandRow}>
              <Image source={images.logo} style={styles.brandMarkSmall} resizeMode="contain" />
              <View style={styles.brandText}>
                <Text style={[typography.label, styles.brandTitle]}>Perfect Frame Club</Text>
                <Text style={[typography.tiny, styles.brandSub]}>SNOOKER</Text>
              </View>
            </View>
            <Badge
              label={isPending ? 'Pending' : 'Not active'}
              tone={isPending ? 'gold' : 'neutral'}
            />
          </View>

          <Text style={[typography.body, styles.inactiveCopy]}>
            {isPending
              ? 'Your activation code has been generated. Show it at the front desk and a member of staff will confirm your tier.'
              : 'Your digital tier card is waiting for activation by Perfect Frame Club staff.'}
          </Text>

          <GradientButton
            label={isPending ? 'Show activation code' : 'Activate membership'}
            variant={isPending ? 'light' : 'primary'}
            size="md"
            iconRight={isPending ? 'qr' : undefined}
            onPress={isPending ? onShowCode : onActivate}
          />

          {!hasDetails ? (
            <Pressable
              accessibilityRole="button"
              onPress={onEdit}
              style={({ pressed }) => [styles.editRow, pressed && styles.pressed]}>
              <Icon name="user" size={scale(15)} color={colors.textMuted} />
              <Text style={[typography.small, styles.editLabel]}>Add your member details</Text>
              <Icon name="chevron-right" size={scale(15)} color={colors.textFaint} />
            </Pressable>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={images.splashBg}
        style={styles.activeCard}
        imageStyle={styles.activeImage}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(8,20,42,0.66)', 'rgba(6,14,30,0.9)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.activeHead}>
          <View style={styles.brandRow}>
            <View style={styles.brandMarkWrap}>
              <Image source={images.logo} style={styles.brandMark} resizeMode="contain" />
            </View>
            <View style={styles.brandText}>
              <Text style={[typography.label, styles.brandTitle]}>Perfect Frame Club</Text>
              <Text style={[typography.tiny, styles.brandSub]}>SNOOKER</Text>
            </View>
          </View>
          <Badge label="Active" tone="success" />
        </View>

        <View style={styles.activeBody}>
          <View style={styles.numberBlock}>
            <Text style={[typography.label, styles.numberLabel]}>MEMBER NO.</Text>
            <Text style={[typography.title, styles.number]}>
              {formatMemberNumber(profile.memberNumber) || '—'}
            </Text>
            <Text style={[typography.small, styles.tier]}>
              {profile.tier} tier{profile.validTo ? ` · Valid to ${profile.validTo}` : ''}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Show member code"
            onPress={onShowCode}
            style={({ pressed }) => pressed && styles.pressed}>
            <QrBlock value={profile.memberNumber || profile.name} size={72} quietZone={6} />
          </Pressable>
        </View>
      </ImageBackground>

      <View style={styles.activeFooter}>
        <View style={styles.footerDot} />
        <Text style={[typography.tiny, styles.footerText]}>
          Activated by front desk
          {profile.activatedAt ? ` · ${formatDate(profile.activatedAt)}` : ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  activeCard: {
    minHeight: scale(140),
    padding: scale(14),
    justifyContent: 'space-between',
  },
  activeImage: {
    opacity: 0.9,
  },
  inactiveCard: {
    padding: scale(16),
    gap: scale(14),
  },
  inactiveHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inactiveCopy: {
    fontSize: fontSize(14),
    lineHeight: fontSize(20),
  },
  activeHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  brandMarkWrap: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  brandMark: {
    width: scale(28),
    height: scale(28),
  },
  brandMarkSmall: {
    width: scale(34),
    height: scale(34),
  },
  brandText: {
    marginLeft: scale(9),
    flexShrink: 1,
  },
  brandTitle: {
    color: colors.textPrimary,
    letterSpacing: 0.8,
    fontSize: fontSize(11),
  },
  brandSub: {
    color: colors.textMuted,
    letterSpacing: 2,
    fontSize: fontSize(8),
    marginTop: scale(1),
  },
  activeBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: scale(20),
  },
  numberBlock: {
    flex: 1,
    paddingRight: scale(10),
  },
  numberLabel: {
    color: 'rgba(196,214,244,0.76)',
    fontSize: fontSize(9),
  },
  number: {
    marginTop: scale(3),
    letterSpacing: 2,
  },
  tier: {
    marginTop: scale(3),
    color: 'rgba(196,214,244,0.82)',
    fontSize: fontSize(11),
  },
  activeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(8),
    backgroundColor: colors.surfaceMuted,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  footerDot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(3),
    backgroundColor: colors.success,
    marginRight: scale(7),
  },
  footerText: {
    color: colors.textMuted,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
    paddingTop: scale(2),
  },
  editLabel: {
    flex: 1,
    color: colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
});
