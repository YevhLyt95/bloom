import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { addPlant } from '../db/database';
import { colors, typography, spacing } from '../theme/tokens';
import PrimaryButton from '../components/PrimaryButton';

export default function AddPlantScreen({ navigation }) {
  const [name, setName] = useState('');
  const [plantType, setPlantType] = useState('Indoor plant');
  const [waterFrequency, setWaterFrequency] = useState('3');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const cleanName = name.trim();
    if (!cleanName) {
      Alert.alert('Missing name', 'Please enter a plant name.');
      return;
    }

    const parsedDays = Number(waterFrequency);
    const days = Number.isFinite(parsedDays) && parsedDays > 0 ? parsedDays : 3;

    setIsSaving(true);
    try {
      await addPlant({
        name: cleanName,
        plantType: plantType.trim() || 'Indoor plant',
        waterFrequencyDays: days,
        notes: notes.trim(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not save the plant.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* cross sign left and title */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={typography.h2}>Add New Plant</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        {/* placeholder for plant photo */}
        <View style={styles.photoBox}>
          <Ionicons name="camera-outline" size={28} color={colors.green} />
          <Text style={typography.caption}>Add photo</Text>
        </View>

        <Text style={styles.label}>Plant name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter plant name..."
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Plant type</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Indoor plant, Succulent"
          placeholderTextColor={colors.muted}
          value={plantType}
          onChangeText={setPlantType}
        />

        <Text style={styles.label}>Water frequency (days)</Text>
        <TextInput
          style={styles.input}
          placeholder="3"
          placeholderTextColor={colors.muted}
          value={waterFrequency}
          onChangeText={setWaterFrequency}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Notes..."
          placeholderTextColor={colors.muted}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <View style={styles.submitWrap}>
          <PrimaryButton
            title={isSaving ? 'Saving...' : 'Save Plant'}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  photoBox: {
    height: 130,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.p,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    ...typography.p,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitWrap: {
    marginTop: spacing.lg,
  },
});