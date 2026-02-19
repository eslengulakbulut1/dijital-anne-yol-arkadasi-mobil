import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useApp } from '@/hooks/useAppContext';
import type { RuhHaliKaydi, RuhHaliSkor } from '@/types';
import { formatDateTime, generateId, getMoodColor, getMoodEmoji, getMoodLabel, isToday } from '@/utils/helpers';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SKORLAR: RuhHaliSkor[] = [1, 2, 3, 4, 5];

export default function RuhHaliScreen() {
  const { ruhHaliKayitlari, ruhHaliEkle, ruhHaliSil } = useApp();
  const [modalGorunu, setModalGorunu] = useState(false);
  const [secilenSkor, setSecilenSkor] = useState<RuhHaliSkor>(3);
  const [not, setNot] = useState('');
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const bugunKayitlar = ruhHaliKayitlari.filter((k) => isToday(k.olusturulmaTarihi));
  const eskiKayitlar = ruhHaliKayitlari.filter((k) => !isToday(k.olusturulmaTarihi));

  const bugunOrt = bugunKayitlar.length > 0
    ? Math.round((bugunKayitlar.reduce((a, k) => a + k.skor, 0) / bugunKayitlar.length) * 10) / 10
    : null;

  async function handleKaydet() {
    setKaydediliyor(true);
    try {
      const kayit: RuhHaliKaydi = {
        id: generateId(),
        skor: secilenSkor,
        not: not.trim() || undefined,
        olusturulmaTarihi: new Date().toISOString(),
      };
      await ruhHaliEkle(kayit);
      setModalGorunu(false);
      setSecilenSkor(3);
      setNot('');
    } finally {
      setKaydediliyor(false);
    }
  }

  function handleSil(id: string) {
    Alert.alert('Kaydı Sil', 'Bu ruh hali kaydını silmek istiyor musunuz?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => ruhHaliSil(id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Ruh Hali 💭</Text>
          <Text style={styles.subtitle}>Bugün nasıl hissediyorsun?</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalGorunu(true)}>
          <Text style={styles.addButtonText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Bugün'ün Özeti */}
      {bugunOrt !== null && (
        <View style={[styles.ortCard, { backgroundColor: getMoodColor(Math.round(bugunOrt) as RuhHaliSkor).bg }]}>
          <Text style={styles.ortEmoji}>{getMoodEmoji(Math.round(bugunOrt) as RuhHaliSkor)}</Text>
          <View>
            <Text style={[styles.ortValue, { color: getMoodColor(Math.round(bugunOrt) as RuhHaliSkor).text }]}>
              Bugün: {bugunOrt}/5
            </Text>
            <Text style={styles.ortSubtext}>
              {bugunKayitlar.length} kayıt · {getMoodLabel(Math.round(bugunOrt) as RuhHaliSkor)}
            </Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {ruhHaliKayitlari.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💭</Text>
            <Text style={styles.emptyTitle}>Henüz kayıt yok</Text>
            <Text style={styles.emptySubtitle}>
              Nasıl hissettiğini kaydetmek için sağ üstteki butona dokun. Her his önemlidir 💛
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {bugunKayitlar.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Bugün</Text>
                {bugunKayitlar.map((k) => (
                  <RuhHaliCard key={k.id} kayit={k} onSil={() => handleSil(k.id)} />
                ))}
              </>
            )}
            {eskiKayitlar.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Önceki Kayıtlar</Text>
                {eskiKayitlar.map((k) => (
                  <RuhHaliCard key={k.id} kayit={k} onSil={() => handleSil(k.id)} />
                ))}
              </>
            )}
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      <Modal visible={modalGorunu} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ruh Halini Kaydet</Text>
            <TouchableOpacity
              onPress={() => {
                setModalGorunu(false);
                setSecilenSkor(3);
                setNot('');
              }}
            >
              <Text style={styles.modalCloseText}>İptal</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalSubtitle}>
              Şu an nasıl hissediyorsun? Dürüst ol, bu sadece senin için 🌿
            </Text>

            <Text style={styles.inputLabel}>Ruh Hali Skoru</Text>
            <View style={styles.skorRow}>
              {SKORLAR.map((skor) => {
                const colors = getMoodColor(skor);
                const selected = secilenSkor === skor;
                return (
                  <TouchableOpacity
                    key={skor}
                    style={[
                      styles.skorCard,
                      { backgroundColor: colors.bg, borderColor: colors.border },
                      selected && styles.skorCardActive,
                    ]}
                    onPress={() => setSecilenSkor(skor)}
                  >
                    <Text style={styles.skorEmoji}>{getMoodEmoji(skor)}</Text>
                    <Text style={[styles.skorNum, { color: colors.text }]}>{skor}</Text>
                    <Text style={[styles.skorLabel, { color: colors.text }]}>
                      {getMoodLabel(skor)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>Not (isteğe bağlı)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Bu hissin arkasındaki hikayeyi yaz... veya boş bırak."
              multiline
              numberOfLines={4}
              value={not}
              onChangeText={setNot}
              placeholderTextColor={Colors.textMuted}
            />

            <TouchableOpacity
              style={[styles.saveButton, kaydediliyor && styles.saveButtonDisabled]}
              onPress={handleKaydet}
              disabled={kaydediliyor}
            >
              <Text style={styles.saveButtonText}>
                {kaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

interface RuhHaliCardProps {
  kayit: RuhHaliKaydi;
  onSil: () => void;
}

function RuhHaliCard({ kayit, onSil }: RuhHaliCardProps) {
  const colors = getMoodColor(kayit.skor);
  return (
    <View
      style={[
        styles.kayitCard,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <Text style={styles.kayitEmoji}>{getMoodEmoji(kayit.skor)}</Text>
      <View style={styles.kayitInfo}>
        <View style={styles.kayitRow}>
          <Text style={[styles.kayitSkor, { color: colors.text }]}>
            {kayit.skor}/5 · {getMoodLabel(kayit.skor)}
          </Text>
          <TouchableOpacity onPress={onSil} style={styles.silBtn}>
            <Text style={styles.silBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        {kayit.not && (
          <Text style={[styles.kayitNot, { color: colors.text }]}>{kayit.not}</Text>
        )}
        <Text style={[styles.kayitTarih, { color: colors.text }]}>
          {formatDateTime(kayit.olusturulmaTarihi)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { ...Typography.headingLg, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySm, color: Colors.textSecondary, marginTop: 2 },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    ...Shadows.sm,
  },
  addButtonText: { ...Typography.headingSm, color: Colors.white },
  ortCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadows.sm,
  },
  ortEmoji: { fontSize: 32 },
  ortValue: { ...Typography.headingMd },
  ortSubtext: { ...Typography.bodySm, color: Colors.textSecondary, marginTop: 2 },
  scroll: { flex: 1 },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.huge,
    paddingHorizontal: Spacing.xxxl,
  },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.headingMd, color: Colors.textPrimary, textAlign: 'center' },
  emptySubtitle: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  listContainer: { paddingHorizontal: Spacing.lg },
  sectionLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  kayitCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
  },
  kayitEmoji: { fontSize: 28 },
  kayitInfo: { flex: 1 },
  kayitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kayitSkor: { ...Typography.headingSm },
  kayitNot: { ...Typography.bodyMd, marginTop: 4, fontStyle: 'italic', opacity: 0.8 },
  kayitTarih: { ...Typography.caption, marginTop: 4, opacity: 0.6 },
  silBtn: { padding: Spacing.xs },
  silBtnText: { fontSize: 16 },
  // Modal
  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { ...Typography.headingMd, color: Colors.textPrimary },
  modalCloseText: { ...Typography.bodyMd, color: Colors.primary, fontWeight: '600' },
  modalScroll: { flex: 1, padding: Spacing.lg },
  modalSubtitle: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  skorRow: { flexDirection: 'row', gap: Spacing.sm },
  skorCard: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 2,
    borderWidth: 2,
  },
  skorCardActive: {
    borderColor: Colors.primary,
    transform: [{ scale: 1.05 }],
  },
  skorEmoji: { fontSize: 22 },
  skorNum: { ...Typography.headingSm },
  skorLabel: { fontSize: 8, fontWeight: '600', textAlign: 'center' },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  inputMultiline: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
    ...Shadows.md,
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { ...Typography.headingSm, color: Colors.white },
});
