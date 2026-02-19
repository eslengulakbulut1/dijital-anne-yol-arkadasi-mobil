import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useApp } from '@/hooks/useAppContext';
import type { Not } from '@/types';
import { formatDateTime, generateId, isToday } from '@/utils/helpers';
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

export default function NotlarScreen() {
  const { notlar, notEkle, notSil } = useApp();
  const [modalGorunu, setModalGorunu] = useState(false);
  const [detayNot, setDetayNot] = useState<Not | null>(null);
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const bugunNotlar = notlar.filter((n) => isToday(n.olusturulmaTarihi));
  const eskiNotlar = notlar.filter((n) => !isToday(n.olusturulmaTarihi));

  function resetForm() {
    setBaslik('');
    setIcerik('');
  }

  async function handleKaydet() {
    if (!baslik.trim() && !icerik.trim()) {
      Alert.alert('Uyarı', 'Lütfen en azından bir başlık veya içerik girin.');
      return;
    }
    setKaydediliyor(true);
    try {
      const not: Not = {
        id: generateId(),
        baslik: baslik.trim() || 'İsimsiz Not',
        icerik: icerik.trim(),
        olusturulmaTarihi: new Date().toISOString(),
      };
      await notEkle(not);
      setModalGorunu(false);
      resetForm();
    } finally {
      setKaydediliyor(false);
    }
  }

  function handleSil(id: string) {
    Alert.alert('Notu Sil', 'Bu notu silmek istediğinizden emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => notSil(id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notlar 📝</Text>
          <Text style={styles.subtitle}>Özel anlarını, düşüncelerini kaydet</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalGorunu(true)}>
          <Text style={styles.addButtonText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {notlar.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyTitle}>Henüz not yok</Text>
            <Text style={styles.emptySubtitle}>
              İlk notunu ekle. Küçük anlar büyük hikayeler yaratır 🌿
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {bugunNotlar.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Bugün</Text>
                {bugunNotlar.map((n) => (
                  <NotCard
                    key={n.id}
                    not={n}
                    onPress={() => setDetayNot(n)}
                    onSil={() => handleSil(n.id)}
                  />
                ))}
              </>
            )}
            {eskiNotlar.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Önceki Notlar</Text>
                {eskiNotlar.map((n) => (
                  <NotCard
                    key={n.id}
                    not={n}
                    onPress={() => setDetayNot(n)}
                    onSil={() => handleSil(n.id)}
                  />
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
            <Text style={styles.modalTitle}>Yeni Not</Text>
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
            <Text style={styles.modalSubtitle}>
              Bugün ne düşündün? Neye sevindin? Yaz, bu günler geçer ama notlar kalır. 💛
            </Text>
            <Text style={styles.inputLabel}>Başlık</Text>
            <TextInput
              style={styles.input}
              placeholder="Not başlığı..."
              value={baslik}
              onChangeText={setBaslik}
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.inputLabel}>İçerik</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Düşüncelerini, gözlemlerini, güzel anları yaz..."
              multiline
              numberOfLines={6}
              value={icerik}
              onChangeText={setIcerik}
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

      {/* Detay Modal */}
      <Modal visible={detayNot !== null} animationType="fade" transparent>
        <View style={styles.detayOverlay}>
          <View style={styles.detayCard}>
            <Text style={styles.detayBaslik}>{detayNot?.baslik}</Text>
            <Text style={styles.detayTarih}>{detayNot ? formatDateTime(detayNot.olusturulmaTarihi) : ''}</Text>
            {detayNot?.icerik ? (
              <ScrollView style={styles.detayScrollView}>
                <Text style={styles.detayIcerik}>{detayNot.icerik}</Text>
              </ScrollView>
            ) : null}
            <TouchableOpacity style={styles.detayKapat} onPress={() => setDetayNot(null)}>
              <Text style={styles.detayKapatText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

interface NotCardProps {
  not: Not;
  onPress: () => void;
  onSil: () => void;
}

function NotCard({ not, onPress, onSil }: NotCardProps) {
  const NOTE_COLORS = ['#FFF8E1', '#E8F5E9', '#E3F2FD', '#FCE4EC', '#F3E5F5'];
  const colorIndex =
    not.id.charCodeAt(0) % NOTE_COLORS.length;
  const bgColor = NOTE_COLORS[colorIndex];

  return (
    <TouchableOpacity
      style={[styles.notCard, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.notCardRow}>
        <Text style={styles.notBaslik} numberOfLines={1}>
          {not.baslik}
        </Text>
        <TouchableOpacity onPress={onSil} style={styles.silBtn}>
          <Text style={styles.silBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
      {not.icerik ? (
        <Text style={styles.notIcerik} numberOfLines={2}>
          {not.icerik}
        </Text>
      ) : null}
      <Text style={styles.notTarih}>{formatDateTime(not.olusturulmaTarihi)}</Text>
    </TouchableOpacity>
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
  notCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  notCardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  notBaslik: { ...Typography.headingSm, color: Colors.textPrimary, flex: 1, marginRight: Spacing.sm },
  notIcerik: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  notTarih: { ...Typography.caption, color: Colors.textMuted, marginTop: Spacing.sm },
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
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  inputMultiline: { height: 140, textAlignVertical: 'top' },
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
  // Detay Modal
  detayOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  detayCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    width: '100%',
    maxHeight: '80%',
    ...Shadows.lg,
  },
  detayBaslik: { ...Typography.headingMd, color: Colors.textPrimary, marginBottom: Spacing.xs },
  detayTarih: { ...Typography.caption, color: Colors.textMuted, marginBottom: Spacing.md },
  detayScrollView: { maxHeight: 300, marginBottom: Spacing.md },
  detayIcerik: { ...Typography.bodyMd, color: Colors.textSecondary, lineHeight: 24 },
  detayKapat: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  detayKapatText: { ...Typography.headingSm, color: Colors.white },
});
