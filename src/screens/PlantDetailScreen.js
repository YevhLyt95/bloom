import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllPlants, markPlantWatered } from '../db/database';
import { colors, typography, spacing } from '../theme/tokens';
import PrimaryButton from '../components/PrimaryButton';

export default function PlantDetailScreen({ route, navigation }) {
  const { plantId } = route.params;
  const [plant, setPlant] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const loadPlant = useCallback(async () => {
    const allPlants = await getAllPlants();
    const found = allPlants.find((item) => item.id === plantId) || null;
    setPlant(found);
  }, [plantId]);

  useFocusEffect(
    useCallback(() => {
      loadPlant();
    }, [loadPlant])
  );

  async function handleWatered() {
    if (!plant) return;
    setIsUpdating(true);
    try {
      await markPlantWatered(plant.id);
      await loadPlant();
      Alert.alert('Watered', `${plant.name} marked as watered today.`);
    } catch (error) {
      Alert.alert('Error', 'Could not update watering status.');
    } finally {
      setIsUpdating(false);
    }
  }

  if (!plant) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.centered}>
          <Text style={typography.p}>Plant not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Верхня зона з фото/іконкою та кнопкою назад */}
        <View style={styles.heroBox}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.75 }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Ionicons name="leaf" size={76} color={colors.green} />
        </View>

        {/* main card */}
        <View style={styles.detailCard}>
          <Text style={styles.plantTitle}>{plant.name}</Text>
          <Text style={typography.caption}>
            {plant.plant_type || 'Indoor plant'}
          </Text>

          <View style={styles.metaList}>
            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Ionicons name="water-outline" size={18} color={colors.blue} />
                <Text style={typography.p}>Water</Text>
              </View>
              <Text style={typography.p}>
                Every {plant.water_frequency_days} days
              </Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Ionicons name="sunny-outline" size={18} color={colors.yellow} />
                <Text style={typography.p}>Light</Text>
              </View>
              <Text style={typography.p}>Bright indirect light</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Ionicons name="analytics-outline" size={18} color={colors.blue} />
                <Text style={typography.p}>Humidity</Text>
              </View>
              <Text style={typography.p}>60–70%</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaLeft}>
                <Ionicons name="thermometer-outline" size={18} color={colors.green} />
                <Text style={typography.p}>Temperature</Text>
              </View>
              <Text style={typography.p}>18–27°C</Text>
            </View>
        </View>

          {/* Нотатки з бази даних */}
          <View style={styles.notesBox}>
            <Text style={typography.caption}>Notes</Text>
            <Text style={[typography.p, { marginTop: 4 }]}>
              {plant.notes ? plant.notes : 'No notes yet.'}
            </Text>
          </View>

          {/* Кнопка Watered */}
          <View style={styles.actionWrap}>
            <PrimaryButton
              title={isUpdating ? 'Updating...' : 'Watered'}
              onPress={handleWatered}
            />
          </View>
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
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBox: {
    height: 210,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCard: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  plantTitle: {
    ...typography.h1,
    color: colors.green,
    marginBottom: 4,
  },
  metaList: {
    marginTop: spacing.lg,
    gap: spacing.sm + 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notesBox: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  actionWrap: {
    marginTop: spacing.lg,
  },
});