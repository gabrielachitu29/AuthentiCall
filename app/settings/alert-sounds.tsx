import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { loadAlertSound, saveAlertSound } from '../../src/utils/settings';
import { useEffect, useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';

const SOUNDS = ['Default', 'Chime', 'Alert', 'Signal'];

export default function AlertSoundsScreen() {
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  useEffect(() => {
    const loadSound = async () => {
      const sound = await loadAlertSound();
      setSelectedSound(sound ?? SOUNDS[0]);
    };
    loadSound();
  }, []);

  const handleSelectSound = (sound: string) => {
    setSelectedSound(sound);
    saveAlertSound(sound);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Alert Sounds</ThemedText>
      <View style={styles.list}>
        {SOUNDS.map((sound) => (
          <Pressable key={sound} onPress={() => handleSelectSound(sound)}>
            <ThemedView
              style={[
                styles.item,
                selectedSound === sound && styles.selectedItem,
              ]}>
              <ThemedText>{sound}</ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    gap: 16,
  },
  list: {
    gap: 8,
  },
  item: {
    padding: 16,
    borderRadius: 8,
  },
  selectedItem: {
    backgroundColor: '#007AFF',
  },
});