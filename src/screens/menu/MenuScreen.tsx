import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '../../components/Screen';
import { Chip } from '../../components/SegmentedTabs';
import { GradientButton } from '../../components/GradientButton';
import { CenterModal, Sheet } from '../../components/Sheet';
import { Icon } from '../../components/Icon';
import { Reveal, Stagger } from '../../components/Reveal';
import { SectionLabel } from '../../components/Badge';
import { dishImage } from '../../assets';
import { menuCategories, menuSections, clubTables } from '../../data/menu';
import { useOrder } from '../../context/OrderContext';
import { colors, fontSize, hitSlop, layout, radius, scale, typography } from '../../theme';
import { formatMoney } from '../../utils/format';
import { MenuCategory, MenuItem, SubmittedRequest } from '../../types';

export function MenuScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const {
    entries,
    itemCount,
    total,
    table,
    setTable,
    quantityOf,
    addItem,
    removeItem,
    clearCart,
    submitRequest,
  } = useOrder();

  const [category, setCategory] = useState<MenuCategory | null>(null);
  const [tableSheet, setTableSheet] = useState(false);
  const [cartSheet, setCartSheet] = useState(false);
  const [submitted, setSubmitted] = useState<SubmittedRequest | null>(null);

  const sections = useMemo(
    () =>
      menuSections(category ?? undefined).map(section => ({
        title: section.category,
        data: section.data,
      })),
    [category],
  );

  const trayHeight = scale(itemCount > 0 ? 128 : 104);

  const handleSubmit = () => {
    const request = submitRequest();
    if (request) {
      setCartSheet(false);
      setSubmitted(request);
    }
  };

  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: trayHeight + scale(layout.tabBarHeight + 30) },
        ]}
        ListHeaderComponent={
          <View>
            <Reveal delay={40} style={styles.header}>
              <Text style={[typography.title, styles.screenTitle]}>Menu</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Change table"
                hitSlop={hitSlop}
                onPress={() => setTableSheet(true)}
                style={({ pressed }) => [styles.tablePill, pressed && styles.pressed]}>
                <Icon name="pin" size={scale(13)} color={colors.textSecondary} />
                <Text style={[typography.tiny, styles.tableLabel]}>{table}</Text>
                <Icon name="chevron-down" size={scale(12)} color={colors.textFaint} />
              </Pressable>
            </Reveal>

            <Reveal delay={90}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}>
                <Chip label="All" active={category === null} onPress={() => setCategory(null)} />
                {menuCategories.map(option => (
                  <Chip
                    key={option}
                    label={option}
                    active={category === option}
                    onPress={() => setCategory(option)}
                  />
                ))}
              </ScrollView>
            </Reveal>
          </View>
        }
        renderSectionHeader={({ section }) => (
          <SectionLabel label={section.title} style={styles.sectionLabel} />
        )}
        renderItem={({ item, index }) => (
          <Stagger index={index} base={130} step={40} max={10} style={styles.itemWrap}>
            <MenuRow
              item={item}
              quantity={quantityOf(item.id)}
              onAdd={() => addItem(item.id)}
              onRemove={() => removeItem(item.id)}
            />
          </Stagger>
        )}
      />

      <View
        style={[
          styles.tray,
          { paddingBottom: scale(layout.tabBarHeight + 16) + insets.bottom },
        ]}>
        <LinearGradient
          colors={['rgba(6,26,19,0)', 'rgba(6,26,19,0.9)', '#061A13']}
          style={styles.trayFade}
          pointerEvents="none"
        />

        <View style={[styles.trayCard, itemCount === 0 && styles.trayCardEmpty]}>
          <Pressable
            accessibilityRole="button"
            disabled={itemCount === 0}
            onPress={() => setCartSheet(true)}
            style={({ pressed }) => [styles.trayHead, pressed && itemCount > 0 && styles.pressed]}>
            <Text style={[typography.smallStrong, styles.trayTitle]}>Table request</Text>
            <Text style={[typography.tiny, styles.trayCount]}>
              {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
            </Text>
          </Pressable>

          {itemCount === 0 ? (
            <Text style={[typography.tiny, styles.trayEmptyCopy]}>
              Nothing selected yet. Tap + on any dish to build your request — the floor team
              confirms everything at the table.
            </Text>
          ) : (
            <View style={styles.trayTotals}>
              <Text style={[typography.small, styles.trayTotalLabel]}>Estimated total</Text>
              <Text style={[typography.subheading, styles.trayTotalValue]}>
                {formatMoney(total)}
              </Text>
            </View>
          )}

          <GradientButton
            label="Submit request"
            disabled={itemCount === 0}
            glow={itemCount > 0}
            size="md"
            style={styles.trayButton}
            onPress={() => setCartSheet(true)}
          />
        </View>
      </View>

      <Sheet visible={tableSheet} onClose={() => setTableSheet(false)}>
        <Text style={[typography.heading, styles.sheetTitle]}>Where are you sitting?</Text>
        <Text style={[typography.body, styles.sheetBody]}>
          The floor team uses this to find you. You can change it at any time before submitting.
        </Text>
        <View style={styles.sheetChips}>
          {clubTables.map(option => (
            <Chip
              key={option}
              label={option}
              active={table === option}
              onPress={() => setTable(option)}
            />
          ))}
        </View>
        <GradientButton
          label="Done"
          variant="light"
          style={styles.sheetAction}
          onPress={() => setTableSheet(false)}
        />
      </Sheet>

      <Sheet visible={cartSheet} onClose={() => setCartSheet(false)} scrollable maxHeightRatio={0.86}>
        <View style={styles.cartHead}>
          <Text style={[typography.heading, styles.cartTitle]}>Table request</Text>
          <Text style={[typography.tiny, styles.cartTable]}>{table.toUpperCase()}</Text>
        </View>

        {entries.map(entry => (
          <View key={entry.item.id} style={styles.cartRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remove one ${entry.item.name}`}
              onPress={() => removeItem(entry.item.id)}
              style={({ pressed }) => [styles.cartMinus, pressed && styles.pressed]}>
              <Icon name="minus" size={scale(14)} color={colors.textSecondary} />
            </Pressable>
            <Text style={[typography.smallStrong, styles.cartQuantity]}>x{entry.quantity}</Text>
            <Text numberOfLines={2} style={[typography.bodyStrong, styles.cartName]}>
              {entry.item.name}
            </Text>
            <Text style={[typography.smallStrong, styles.cartPrice]}>
              {formatMoney(entry.lineTotal)}
            </Text>
          </View>
        ))}

        <View style={styles.cartTotalRow}>
          <Text style={[typography.body, styles.cartTotalLabel]}>Estimated total</Text>
          <Text style={[typography.heading, styles.cartTotalValue]}>{formatMoney(total)}</Text>
        </View>

        <Text style={[typography.tiny, styles.cartNote]}>
          Payment is settled at the bar — this is a venue request, not an online order.
        </Text>

        <GradientButton
          label="Submit request"
          glow
          style={styles.sheetAction}
          onPress={handleSubmit}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            clearCart();
            setCartSheet(false);
          }}
          style={({ pressed }) => [styles.cartClear, pressed && styles.pressed]}>
          <Text style={[typography.button, styles.cartClearLabel]}>Clear request</Text>
        </Pressable>
      </Sheet>

      <CenterModal visible={submitted !== null} onClose={() => setSubmitted(null)}>
        <View style={styles.doneHead}>
          <View style={styles.doneTick}>
            <Icon name="check" size={scale(22)} color={colors.success} strokeWidth={2.6} />
          </View>
          <Text style={[typography.heading, styles.doneTitle]}>Request sent</Text>
          <Text style={[typography.small, styles.doneBody]}>
            The floor team has your order for {submitted?.table} and will confirm in person.
            Payment is settled at the bar — this is a venue request, not an online order.
          </Text>
        </View>

        {submitted ? (
          <View style={styles.doneLines}>
            {submitted.lines.map(line => (
              <View key={line.name} style={styles.doneLine}>
                <Text numberOfLines={1} style={[typography.small, styles.doneLineName]}>
                  {line.quantity}× {line.name}
                </Text>
                <Text style={[typography.smallStrong, styles.doneLinePrice]}>
                  {formatMoney(line.price)}
                </Text>
              </View>
            ))}
            <View style={[styles.doneLine, styles.doneLineTotal]}>
              <Text style={[typography.bodyStrong, styles.doneLineName]}>Estimated total</Text>
              <Text style={[typography.bodyStrong, styles.doneTotalValue]}>
                {formatMoney(submitted.total)}
              </Text>
            </View>
          </View>
        ) : null}

        {submitted ? (
          <View style={styles.doneMeta}>
            <DoneMetaRow label="Status" value="Awaiting confirmation" tint={colors.gold} />
            <DoneMetaRow label="Estimated" value="15–20 min" />
            <DoneMetaRow label="Reference" value={submitted.reference} last />
          </View>
        ) : null}

        <GradientButton
          label="Close"
          variant="light"
          style={styles.doneAction}
          onPress={() => setSubmitted(null)}
        />
      </CenterModal>
    </Screen>
  );
}

function MenuRow({
  item,
  quantity,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}): React.JSX.Element {
  const source = dishImage(item.image);

  return (
    <View style={[styles.itemCard, quantity > 0 && styles.itemCardActive]}>
      <View style={styles.thumb}>
        {source ? (
          <Image source={source} style={styles.thumbImage} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={['#243657', '#16233B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.thumbFallback}>
            <Text style={[typography.smallStrong, styles.thumbInitial]}>
              {item.name.charAt(0)}
            </Text>
          </LinearGradient>
        )}
      </View>

      <View style={styles.itemBody}>
        <Text numberOfLines={2} style={[typography.bodyStrong, styles.itemName]}>
          {item.name}
        </Text>
        <Text numberOfLines={2} style={[typography.tiny, styles.itemDescription]}>
          {item.description}
        </Text>
        <Text style={[typography.smallStrong, styles.itemPrice]}>{formatMoney(item.price)}</Text>
      </View>

      {quantity > 0 ? (
        <View style={styles.stepper}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove one ${item.name}`}
            onPress={onRemove}
            style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}>
            <Icon name="minus" size={scale(14)} color={colors.textSecondary} />
          </Pressable>
          <Text style={[typography.smallStrong, styles.stepperValue]}>{quantity}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add one ${item.name}`}
            onPress={onAdd}
            style={({ pressed }) => [styles.stepperButton, pressed && styles.pressed]}>
            <Icon name="plus" size={scale(14)} color="#8CB8FF" />
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${item.name} to the table request`}
          onPress={onAdd}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
          <LinearGradient
            colors={['#4A90FF', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Icon name="plus" size={scale(17)} color="#FFFFFF" strokeWidth={2.2} />
        </Pressable>
      )}
    </View>
  );
}

function DoneMetaRow({
  label,
  value,
  tint,
  last = false,
}: {
  label: string;
  value: string;
  tint?: string;
  last?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.doneMetaRow, last && styles.doneMetaRowLast]}>
      <Text style={[typography.small, styles.doneMetaLabel]}>{label}</Text>
      <Text style={[typography.smallStrong, tint ? { color: tint } : styles.doneMetaValue]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: scale(layout.gutter),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: scale(12),
    marginBottom: scale(14),
    gap: scale(10),
  },
  screenTitle: {
    flex: 1,
  },
  tablePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
    height: scale(30),
    paddingHorizontal: scale(11),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  tableLabel: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.68,
  },
  chips: {
    flexDirection: 'row',
    gap: scale(8),
    paddingRight: scale(18),
    paddingBottom: scale(4),
  },
  sectionLabel: {
    marginTop: scale(18),
    marginBottom: scale(10),
  },
  itemWrap: {
    marginBottom: scale(9),
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    padding: scale(10),
    gap: scale(11),
  },
  itemCardActive: {
    borderColor: 'rgba(59,130,246,0.36)',
    backgroundColor: 'rgba(59,130,246,0.06)',
  },
  thumb: {
    width: scale(54),
    height: scale(54),
    borderRadius: radius.xs,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbInitial: {
    color: colors.textSecondary,
    fontSize: fontSize(18),
  },
  itemBody: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize(14),
  },
  itemDescription: {
    marginTop: scale(3),
    color: colors.textMuted,
    lineHeight: fontSize(15),
  },
  itemPrice: {
    marginTop: scale(5),
    color: colors.gold,
  },
  addButton: {
    width: scale(38),
    height: scale(38),
    borderRadius: radius.sm,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.38)',
    backgroundColor: 'rgba(59,130,246,0.1)',
    paddingHorizontal: scale(3),
  },
  stepperButton: {
    width: scale(28),
    height: scale(34),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    minWidth: scale(16),
    textAlign: 'center',
    color: colors.textPrimary,
  },
  tray: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: scale(layout.gutter),
    paddingTop: scale(12),
  },
  trayFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: -scale(30),
  },
  trayCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.32)',
    backgroundColor: colors.surface,
    padding: scale(13),
  },
  trayCardEmpty: {
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceMuted,
  },
  trayHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  trayTitle: {
    flex: 1,
  },
  trayCount: {
    color: colors.textFaint,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  trayEmptyCopy: {
    marginTop: scale(6),
    color: colors.textMuted,
    lineHeight: fontSize(16),
  },
  trayTotals: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(9),
    paddingTop: scale(9),
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  trayTotalLabel: {
    color: colors.textMuted,
  },
  trayTotalValue: {
    color: colors.gold,
  },
  trayButton: {
    marginTop: scale(11),
  },
  sheetTitle: {
    marginBottom: scale(8),
  },
  sheetBody: {
    fontSize: fontSize(14),
    marginBottom: scale(18),
  },
  sheetChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(8),
    marginBottom: scale(22),
  },
  sheetAction: {
    marginBottom: scale(4),
  },
  cartHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(14),
    gap: scale(10),
  },
  cartTitle: {
    flex: 1,
  },
  cartTable: {
    color: colors.textMuted,
    letterSpacing: 0.9,
    fontWeight: '700',
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    paddingVertical: scale(10),
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  cartMinus: {
    width: scale(26),
    height: scale(26),
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartQuantity: {
    color: colors.textMuted,
    minWidth: scale(22),
  },
  cartName: {
    flex: 1,
    fontSize: fontSize(14),
  },
  cartPrice: {
    color: colors.textSecondary,
  },
  cartTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: scale(6),
    paddingTop: scale(14),
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
  },
  cartTotalLabel: {
    color: colors.textSecondary,
  },
  cartTotalValue: {
    color: colors.gold,
  },
  cartNote: {
    marginTop: scale(10),
    marginBottom: scale(20),
    color: colors.textFaint,
    lineHeight: fontSize(16),
  },
  cartClear: {
    alignSelf: 'center',
    paddingVertical: scale(14),
  },
  cartClearLabel: {
    color: colors.danger,
    fontSize: fontSize(14),
  },
  doneHead: {
    alignItems: 'center',
  },
  doneTick: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: 'rgba(52,201,138,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(52,201,138,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(14),
  },
  doneTitle: {
    textAlign: 'center',
  },
  doneBody: {
    textAlign: 'center',
    marginTop: scale(8),
    color: colors.textSecondary,
  },
  doneLines: {
    marginTop: scale(18),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: scale(13),
    paddingVertical: scale(4),
  },
  doneLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(10),
    paddingVertical: scale(9),
  },
  doneLineTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    marginTop: scale(2),
  },
  doneLineName: {
    flex: 1,
    color: colors.textSecondary,
  },
  doneLinePrice: {
    color: colors.textSecondary,
  },
  doneTotalValue: {
    color: colors.gold,
  },
  doneMeta: {
    marginTop: scale(12),
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: scale(13),
  },
  doneMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    gap: scale(10),
  },
  doneMetaRowLast: {
    borderBottomWidth: 0,
  },
  doneMetaLabel: {
    color: colors.textMuted,
  },
  doneMetaValue: {
    color: colors.textPrimary,
  },
  doneAction: {
    marginTop: scale(18),
  },
});
