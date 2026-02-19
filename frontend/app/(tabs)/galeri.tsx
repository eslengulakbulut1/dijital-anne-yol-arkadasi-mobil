import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useApp } from '@/hooks/useAppContext';
import type { Ani } from '@/types';
import { formatDate, generateId } from '@/utils/helpers';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm) / 2;

export default function GaleriScreen() {
  const { anilar, aniEkle, aniSil } = useApp();
  const [modalGorunu, setModalGorunu] = useState(false);
  const [detayAni, setDetayAni] = useState<Ani | null>(null);
  const [secilenImage, setSecilenImage] = useState<string | null>(null);
  const [aciklama, setAciklama] = useState('');
  const [kaydediliyor, setKaydediliyor] = useState(false);

  async function handleFotografSec() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'İzin Gerekli',
        'Fotoğraf ekleyebilmek için galeri erişim iznine ihtiyaç var.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSecilenImage(result.assets[0].uri);
    }
  }

  async function handleKameraAc() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin Gerekli', 'Fotoğraf çekebilmek için kamera iznine ihtiyaç var.', [
        { text: 'Tamam' },
      ]);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSecilenImage(result.assets[0].uri);
    }
  }

  function handleFotografEkleButon() {
    Alert.alert('Fotoğraf Ekle', 'Nasıl eklemek istersiniz?', [
      { text: 'Galeriden Seç', onPress: handleFotografSec },
      { text: 'Kamera', onPress: handleKameraAc },
      { text: 'İptal', style: 'cancel' },
    ]);
  }

  async function handleKaydet() {
    if (!secilenImage) {
      Alert.alert('Uyarı', 'Lütfen bir fotoğraf seçin.');
      return;
    }
    setKaydediliyor(true);
    try {
      const ani: Ani = {
        id: generateId(),
        imageUri: secilenImage,
        aciklama: aciklama.trim(),
        olusturulmaTarihi: new Date().toISOString(),
      };
      await aniEkle(ani);
      setModalGorunu(false);
      setSecilenImage(null);
      setAciklama('');
    } finally {
      setKaydediliyor(false);
    }
  }

  function handleSil(id: string) {
    Alert.alert('Anıyı Sil', 'Bu anıyı silmek istediğinizden emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      { text: 'Sil', style: 'destructive', onPress: () => aniSil(id) },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Anı Galerisi 📸</Text>
          <Text style={styles.subtitle}>Özel anlarını fotoğrafla sakla</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalGorunu(true)}>
          <Text style={styles.addButtonText}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {anilar.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📷</Text>
            <Text style={styles.emptyTitle}>Henüz anı yok</Text>
            <Text style={styles.emptySubtitle}>
              Bebeğinin ilk fotoğrafını ekle! Her an bir hatıradır 💛
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {anilar.map((ani) => (
              <TouchableOpacity
                key={ani.id}
                style={styles.gridCard}
                onPress={() => setDetayAni(ani)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: ani.imageUri }} style={styles.gridImage} resizeMode="cover" />
                <View style={styles.gridOverlay}>
                  {ani.aciklama ? (
                    <Text style={styles.gridAciklama} numberOfLines={2}>
                      {ani.aciklama}
                    </Text>
                  ) : null}
                  <Text style={styles.gridTarih}>{formatDate(ani.olusturulmaTarihi)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modalGorunu} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Anı Ekle</Text>
            <TouchableOpacity
              onPress={() => {
                setModalGorunu(false);
                setSecilenImage(null);
                setAciklama('');
              }}
            >
              <Text style={styles.modalCloseText}>İptal</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.modalSubtitle}>
              Bu anı asla unutmak istemiyorsun değil mi? Bir fotoğraf ekle! 💛
            </Text>

            {secilenImage ? (
              <View style={styles.previewContainer}>
                <Image
                  source={{ uri: secilenImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.changePhotoBtn}
                  onPress={handleFotografEkleButon}
                >
                  <Text style={styles.changePhotoBtnText}>Fotoğrafı Değiştir</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handleFotografEkleButon}
              >
                <Text style={styles.imagePickerEmoji}>📷</Text>
                <Text style={styles.imagePickerText}>Fotoğraf Ekle</Text>
                <Text style={styles.imagePickerSubtext}>Galeriden seç veya fotoğraf çek</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.inputLabel}>Açıklama (isteğe bağlı)</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Bu anı hakkında bir şeyler yaz..."
              multiline
              numberOfLines={3}
              value={aciklama}
              onChangeText={setAciklama}
              placeholderTextColor={Colors.textMuted}
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!secilenImage || kaydediliyor) && styles.saveButtonDisabled,
              ]}
              onPress={handleKaydet}
              disabled={!secilenImage || kaydediliyor}
            >
              <Text style={styles.saveButtonText}>
                {kaydediliyor ? 'Kaydediliyor...' : 'Kaydet'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Detay Modal */}
      <Modal visible={detayAni !== null} animationType="fade" transparent>
        <View style={styles.detayOverlay}>
          <View style={styles.detayCard}>
            {detayAni && (
              <>
                <Image
                  source={{ uri: detayAni.imageUri }}
                  style={styles.detayImage}
                  resizeMode="cover"
                />
                {detayAni.aciklama ? (
                  <Text style={styles.detayAciklama}>{detayAni.aciklama}</Text>
                ) : null}
                <Text style={styles.detayTarih}>{formatDate(detayAni.olusturulmaTarihi)}</Text>
                <View style={styles.detayButtons}>
                  <TouchableOpacity
                    style={styles.detayKapat}
                    onPress={() => setDetayAni(null)}
                  >
                    <Text style={styles.detayKapatText}>Kapat</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.detaySil}
                    onPress={() => {
                      setDetayAni(null);
                      handleSil(detayAni.id);
                    }}
                  >
                    <Text style={styles.detaySilText}>Sil</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  emptyEmoji: { fontSize: 56, marginBottom: Spacing.md },
  emptyTitle: { ...Typography.headingMd, color: Colors.textPrimary, textAlign: 'center' },
  emptySubtitle: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  gridCard: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: Spacing.sm,
    borderBottomLeftRadius: Radius.lg,
    borderBottomRightRadius: Radius.lg,
  },
  gridAciklama: {
    ...Typography.bodySm,
    color: Colors.white,
    fontWeight: '500',
    lineHeight: 16,
  },
  gridTarih: {
    ...Typography.caption,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
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
  imagePicker: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  imagePickerEmoji: { fontSize: 40 },
  imagePickerText: { ...Typography.headingSm, color: Colors.textPrimary },
  imagePickerSubtext: { ...Typography.bodySm, color: Colors.textMuted },
  previewContainer: { marginBottom: Spacing.md, gap: Spacing.sm },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: Radius.lg,
  },
  changePhotoBtn: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  changePhotoBtnText: { ...Typography.bodySm, color: Colors.primary, fontWeight: '600' },
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
  inputMultiline: { height: 80, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.xl,
    ...Shadows.md,
  },
  saveButtonDisabled: { opacity: 0.4 },
  saveButtonText: { ...Typography.headingSm, color: Colors.white },
  // Detay
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
    width: '100%',
    overflow: 'hidden',
    ...Shadows.lg,
  },
  detayImage: {
    width: '100%',
    height: SCREEN_WIDTH - Spacing.lg * 2,
  },
  detayAciklama: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    padding: Spacing.md,
    lineHeight: 22,
  },
  detayTarih: {
    ...Typography.caption,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  detayButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    paddingTop: 0,
  },
  detayKapat: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  detayKapatText: { ...Typography.headingSm, color: Colors.white },
  detaySil: {
    flex: 1,
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.full,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  detaySilText: { ...Typography.headingSm, color: Colors.error },
});
