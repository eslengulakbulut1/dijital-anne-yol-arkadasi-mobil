import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useApp } from '@/hooks/useAppContext';
import { getDayOfWeek, getLast7Days, isSameDay, isToday, timeSince } from '@/utils/helpers';
import { getGunSonuMesaji, getRandomMotivasyonMesaji, getSmartSuggestion } from '@/utils/motivasyon';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnaSayfaScreen() {
  const { beslenmeKayitlari, ruhHaliKayitlari, notlar, isLoading } = useApp();

  const motivasyon = useMemo(() => getRandomMotivasyonMesaji(), []);

  const bugunBeslenme = useMemo(
    () => beslenmeKayitlari.filter((k) => isToday(k.olusturulmaTarihi)),
    [beslenmeKayitlari]
  );

  const bugunRuhHali = useMemo(
    () => ruhHaliKayitlari.filter((k) => isToday(k.olusturulmaTarihi)),
    [ruhHaliKayitlari]
  );

  const bugunNotlar = useMemo(
    () => notlar.filter((n) => isToday(n.olusturulmaTarihi)),
    [notlar]
  );

  const ruhHaliOrt = useMemo(() => {
    if (bugunRuhHali.length === 0) return null;
    const toplam = bugunRuhHali.reduce((a, k) => a + k.skor, 0);
    return Math.round((toplam / bugunRuhHali.length) * 10) / 10;
  }, [bugunRuhHali]);

  const sonBeslenmeSure = useMemo(() => {
    if (bugunBeslenme.length === 0) return null;
    const sorted = [...bugunBeslenme].sort(
      (a, b) => new Date(b.olusturulmaTarihi).getTime() - new Date(a.olusturulmaTarihi).getTime()
    );
    return timeSince(sorted[0].olusturulmaTarihi);
  }, [bugunBeslenme]);

  const gunSonuMesaji = useMemo(
    () => getGunSonuMesaji(bugunBeslenme.length, ruhHaliOrt),
    [bugunBeslenme.length, ruhHaliOrt]
  );

  const smartSuggestion = useMemo(() => {
    const son3 = ruhHaliKayitlari.slice(0, 3).map((k) => k.skor);
    return getSmartSuggestion(son3);
  }, [ruhHaliKayitlari]);

  // Weekly stats
  const last7Days = useMemo(() => getLast7Days(), []);

  const haftalikBeslenme = useMemo(
    () =>
      last7Days.map((day) => ({
        gun: getDayOfWeek(day.toISOString()),
        sayi: beslenmeKayitlari.filter((k) => isSameDay(day, k.olusturulmaTarihi)).length,
      })),
    [last7Days, beslenmeKayitlari]
  );

  const haftalikRuhHali = useMemo(
    () =>
      last7Days.map((day) => {
        const kayitlar = ruhHaliKayitlari.filter((k) => isSameDay(day, k.olusturulmaTarihi));
        if (kayitlar.length === 0) return { gun: getDayOfWeek(day.toISOString()), ort: 0 };
        const ort = kayitlar.reduce((a, k) => a + k.skor, 0) / kayitlar.length;
        return { gun: getDayOfWeek(day.toISOString()), ort: Math.round(ort * 10) / 10 };
      }),
    [last7Days, ruhHaliKayitlari]
  );

  const maxBeslenme = useMemo(
    () => Math.max(...haftalikBeslenme.map((d) => d.sayi), 1),
    [haftalikBeslenme]
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Merhaba 👋</Text>
          <Text style={styles.headerTitle}>Dijital Yol Arkadaşın</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </Text>
        </View>

        {/* Motivasyon Kartı */}
        <View style={styles.motivasyonCard}>
          <Text style={styles.motivasyonEmoji}>✨</Text>
          <Text style={styles.motivasyonText}>{motivasyon}</Text>
        </View>

        {/* Smart Suggestion */}
        {smartSuggestion && (
          <View style={styles.suggestionCard}>
            <Text style={styles.suggestionIcon}>💛</Text>
            <Text style={styles.suggestionText}>{smartSuggestion}</Text>
          </View>
        )}

        {/* Bugünün Özeti */}
        <Text style={styles.sectionTitle}>Bugünün Özeti</Text>

        <View style={styles.cardsRow}>
          <SummaryCard
            emoji="🍼"
            value={bugunBeslenme.length.toString()}
            label="Beslenme"
            color={Colors.primaryLight}
          />
          <SummaryCard
            emoji="💭"
            value={ruhHaliOrt !== null ? ruhHaliOrt.toString() : '—'}
            label="Ruh Hali"
            color={Colors.accentLight}
          />
        </View>

        <View style={styles.cardsRow}>
          <SummaryCard
            emoji="📝"
            value={bugunNotlar.length.toString()}
            label="Not"
            color="#E8F5E9"
          />
          <SummaryCard
            emoji="⏰"
            value={
              sonBeslenmeSure
                ? sonBeslenmeSure.saat > 0
                  ? `${sonBeslenmeSure.saat}s ${sonBeslenmeSure.dakika}d`
                  : `${sonBeslenmeSure.dakika}d`
                : '—'
            }
            label="Son Beslenme"
            color="#FFF3E0"
          />
        </View>

        {/* Gün Sonu Mesajı */}
        <View style={styles.gunSonuCard}>
          <Text style={styles.gunSonuText}>{gunSonuMesaji}</Text>
        </View>

        {/* Haftalık İstatistik */}
        <Text style={styles.sectionTitle}>Haftalık Beslenme</Text>
        <View style={styles.chartCard}>
          <View style={styles.barChart}>
            {haftalikBeslenme.map((item, i) => (
              <View key={i} style={styles.barItem}>
                <Text style={styles.barValue}>{item.sayi > 0 ? item.sayi : ''}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: item.sayi === 0 ? 2 : (item.sayi / maxBeslenme) * 100,
                        backgroundColor: i === 6 ? Colors.primary : Colors.primaryLight,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, i === 6 && styles.barLabelActive]}>{item.gun}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Haftalık Ruh Hali */}
        <Text style={styles.sectionTitle}>Haftalık Ruh Hali</Text>
        <View style={styles.chartCard}>
          <View style={styles.moodWeekRow}>
            {haftalikRuhHali.map((item, i) => (
              <View key={i} style={styles.moodDayItem}>
                <View
                  style={[
                    styles.moodDot,
                    {
                      backgroundColor:
                        item.ort === 0
                          ? Colors.borderLight
                          : item.ort <= 2
                            ? Colors.moodLow
                            : item.ort <= 3
                              ? Colors.moodMid
                              : Colors.moodHigh,
                    },
                  ]}
                >
                  <Text style={styles.moodDotText}>
                    {item.ort > 0 ? item.ort.toFixed(1) : '—'}
                  </Text>
                </View>
                <Text style={[styles.barLabel, i === 6 && styles.barLabelActive]}>{item.gun}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface SummaryCardProps {
  emoji: string;
  value: string;
  label: string;
  color: string;
}

function SummaryCard({ emoji, value, label, color }: SummaryCardProps) {
  return (
    <View style={[styles.summaryCard, { backgroundColor: color }]}>
      <Text style={styles.summaryEmoji}>{emoji}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  greeting: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
  },
  headerTitle: {
    ...Typography.displaySm,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  headerDate: {
    ...Typography.bodyMd,
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  motivasyonCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    ...Shadows.md,
  },
  motivasyonEmoji: {
    fontSize: 20,
    marginTop: 1,
  },
  motivasyonText: {
    ...Typography.bodyMd,
    color: Colors.white,
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  suggestionCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  suggestionIcon: {
    fontSize: 16,
  },
  suggestionText: {
    ...Typography.bodyMd,
    color: '#6D4C00',
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    ...Typography.headingSm,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'flex-start',
    ...Shadows.sm,
  },
  summaryEmoji: {
    fontSize: 22,
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    ...Typography.headingLg,
    color: Colors.textPrimary,
  },
  summaryLabel: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  gunSonuCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  gunSonuText: {
    ...Typography.bodyMd,
    color: '#2D6B6D',
    lineHeight: 22,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barValue: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  barTrack: {
    width: 28,
    height: 100,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.xs,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: Radius.xs,
    minHeight: 2,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  barLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  moodWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodDayItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  moodDot: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodDotText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
