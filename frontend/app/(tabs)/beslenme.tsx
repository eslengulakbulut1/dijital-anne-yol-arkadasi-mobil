import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useApp } from '@/hooks/useAppContext';
import type { BeslenmeFiltresi, BeslenmeKaydi, BeslenmeTuru } from '@/types';
import { formatDateTime, generateId, getFeedingEmoji, getFeedingLabel, isToday } from '@/utils/helpers';
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

const FILTRELER: { key: BeslenmeFiltresi; label: string }[] = [
  { key: 'tumu', label: 'Tümü' },
  { key: 'emzirme', label: 'Emzirme' },
  { key: 'biberon', label: 'Biberon' },
  { key: 'mama', label: 'Mama' },
];

const BESLENME_TURLERI: { key: BeslenmeTuru; label: string; emoji: string; color: string }[] = [
  { key: 'emzirme', label: 'Emzirme', emoji: '🤱', color: Colors.feedBreast },
  { key: 'biberon', label: 'Biberon', emoji: '🍼', color: Colors.feedBottle },
  { key: 'mama', label: 'Mama', emoji: '🥣', color: Colors.feedSolid },
];

export default function BeslenmeScreen() {
  const { beslenmeKayitlari, beslenmeEkle, beslenmeSil } = useApp();
  const [filtre, setFiltre] = useState<BeslenmeFiltresi>('tumu');
  const [modalGorunu, setModalGorunu] = useState(false);

  // Form state
  const [secilenTur, setSecilenTur] = useState<BeslenmeTuru>('emzirme');
  const [miktar, setMiktar] = useState('');
  const [sure, setSure] = useState('');
  const [not, setNot] = useState('');
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const filtrelenmis = beslenmeKayitlari.filter((k) => {
    if (filtre === 'tumu') return true;
    return k.tur === filtre;
  });

  const bugunKayitlar = filtrelenmis.filter((k) => isToday(k.olusturulmaTarihi));
  const eskiKayitlar = filtrelenmis.filter((k) => !isToday(k.olusturulmaTarihi));

  function resetForm() {
    setSecilenTur('emzirme');
    setMiktar('');
    setSure('');
    setNot('');
  }

  async function handleKaydet() {
    setKaydediliyor(true);
    try {
      const kayit: BeslenmeKaydi = {
        id: generateId(),
        tur: secilenTur,
        miktar: miktar ? parseInt(miktar, 10) : undefined,
        sure: sure ? parseInt(sure, 10) : undefined,
        not: not.trim() || undefined,
        olusturulmaTarihi: new Date().toISOString(),
      };
      await beslenmeEkle(kayit);
      setModalGorunu(false);
      resetForm();
    } finally {
      setKaydediliyor(false);
    }
  }

  function handleSil(id: string) {
    Alert.alert('Kaydı Sil', 'Bu beslenme kaydını silmek istediğinizden emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => beslenmeSil(id),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Beslenme 🍼</Text>
          <Text style={styles.subtitle}>Bebeğinin beslenmesini takip et</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalGorunu(true)}>
          <Text style={styles.addButtonText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Filtre */}
      <View style={styles.filtreContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtreRow}>
            {FILTRELER.map((f) => (
              <TouchableOpacity
                key={f.key}
                style={[styles.filtreBtn, filtre === f.key && styles.filtreBtnActive]}
                onPress={() => setFiltre(f.key)}
              >
                <Text style={[styles.filtreBtnText, filtre === f.key && styles.filtreBtnTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtrelenmis.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍼</Text>
            <Text style={styles.emptyTitle}>Henüz kayıt yok</Text>
            <Text style={styles.emptySubtitle}>
              Bebeğinin ilk beslenmesini eklemek için sağ üstteki butona dokun 💛
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {bugunKayitlar.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Bugün</Text>
                {bugunKayitlar.map((k) => (
                  <BeslenmeKayitCard key={k.id} kayit={k} onSil={() => handleSil(k.id)} />
                ))}
              </>
            )}
            {eskiKayitlar.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Önceki Kayıtlar</Text>
                {eskiKayitlar.map((k) => (
                  <BeslenmeKayitCard key={k.id} kayit={k} onSil={() => handleSil(k.id)} />
                ))}
              </>
            )}
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalGorunu} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Beslenme Ekle</Text>
            <TouchableOpacity
              onPress={() => {
                setModalGorunu(false);
                resetForm();
              }}
            >
              <Text style={styles.modalCloseText}>İptal</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <Text style={styles.inputLabel}>Beslenme Türü</Text>
            <View style={styles.turRow}>
              {BESLENME_TURLERI.map((t) => (
                <TouchableOpacity
                  key={t.key}
                  style={[
                    styles.turCard,
                    { backgroundColor: t.color },
                    secilenTur === t.key && styles.turCardActive,
                  ]}
                  onPress={() => setSecilenTur(t.key)}
                >
                  <Text style={styles.turEmoji}>{t.emoji}</Text>
                  <Text style={styles.turLabel}>{t.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {secilenTur === 'emzirme' && (
              <View>
                <Text style={styles.inputLabel}>Süre (dakika)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Örn: 15"
                  keyboardType="numeric"
                  value={sure}
                  onChangeText={setSure}
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            )}

            {(secilenTur === 'biberon' || secilenTur === 'mama') && (
              <View>
                <Text style={styles.inputLabel}>
                  {secilenTur === 'biberon' ? 'Miktar (ml)' : 'Miktar (gram)'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={secilenTur === 'biberon' ? 'Örn: 120' : 'Örn: 80'}
                  keyboardType="numeric"
                  value={miktar}
                  onChangeText={setMiktar}
                  placeholderTextColor={Colors.textMuted}
                />
              </View>
            )}

            <Text style={styles.inputLabel}>Not (isteğe bağlı)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Beslenme ile ilgili bir not ekle..."
              multiline
              numberOfLines={3}
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

interface BeslenmeKayitCardProps {
  kayit: BeslenmeKaydi;
  onSil: () => void;
}

function BeslenmeKayitCard({ kayit, onSil }: BeslenmeKayitCardProps) {
  const turRenk: Record<BeslenmeTuru, string> = {
    emzirme: Colors.feedBreast,
    biberon: Colors.feedBottle,
    mama: Colors.feedSolid,
  };

  return (
    <View style={[styles.kayitCard, { borderLeftColor: turRenk[kayit.tur] }]}>
      <View style={[styles.kayitEmojiWrapper, { backgroundColor: turRenk[kayit.tur] }]}>
        <Text style={styles.kayitEmoji}>{getFeedingEmoji(kayit.tur)}</Text>
      </View>
      <View style={styles.kayitInfo}>
        <Text style={styles.kayitTur}>{getFeedingLabel(kayit.tur)}</Text>
        <Text style={styles.kayitDetay}>
          {kayit.tur === 'emzirme' && kayit.sure ? `${kayit.sure} dk` : ''}
          {kayit.tur === 'biberon' && kayit.miktar ? `${kayit.miktar} ml` : ''}
          {kayit.tur === 'mama' && kayit.miktar ? `${kayit.miktar} g` : ''}
        </Text>
        {kayit.not && <Text style={styles.kayitNot}>{kayit.not}</Text>}
        <Text style={styles.kayitTarih}>{formatDateTime(kayit.olusturulmaTarihi)}</Text>
      </View>
      <TouchableOpacity style={styles.silBtn} onPress={onSil}>
        <Text style={styles.silBtnText}>🗑️</Text>
      </TouchableOpacity>
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
  filtreContainer: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  filtreRow: { flexDirection: 'row', gap: Spacing.sm },
  filtreBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filtreBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filtreBtnText: { ...Typography.bodySm, color: Colors.textSecondary },
  filtreBtnTextActive: { color: Colors.white, fontWeight: '600' },
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
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  kayitEmojiWrapper: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  kayitEmoji: { fontSize: 20 },
  kayitInfo: { flex: 1 },
  kayitTur: { ...Typography.headingSm, color: Colors.textPrimary },
  kayitDetay: { ...Typography.bodySm, color: Colors.textSecondary, marginTop: 2 },
  kayitNot: {
    ...Typography.bodySm,
    color: Colors.textMuted,
    marginTop: 2,
    fontStyle: 'italic',
  },
  kayitTarih: { ...Typography.caption, color: Colors.textMuted, marginTop: 4 },
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
  inputLabel: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  turRow: { flexDirection: 'row', gap: Spacing.sm },
  turCard: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 2,
    borderColor: Colors.transparent,
  },
  turCardActive: { borderColor: Colors.primary },
  turEmoji: { fontSize: 28 },
  turLabel: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600' },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  inputMultiline: { height: 80, textAlignVertical: 'top' },
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
