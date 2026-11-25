import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllPlants } from '../db/database';
import { colors, typography, spacing } from '../theme/tokens';
import PlantCardItem from '../components/PlantCardItem';

export default function OverviewScreen({ navigation }) {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlants = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllPlants();
      setPlants(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPlants();
    }, [loadPlants])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Верхня картка привітання */}
      <View style={styles.greetingCard}>
        <View>
          <Text style={typography.caption}>Good morning</Text>
          <Text style={typography.h2}>John Doe</Text>
        </View>
        <View style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={20} color={colors.text} />
        </View>
      </View>

      {/*  Your garden overview */}
      <Text style={[typography.h2, styles.sectionTitle]}>Your garden overview</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.green }]}>
            {plants.length}
          </Text>
          <Text style={typography.caption}>Plants</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.blue }]}>
            {plants.length}
          </Text>
          <Text style={typography.caption}>Need water</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.yellow }]}>
            0
          </Text>
          <Text style={typography.caption}>Need light</Text>
        </View>
      </View>

      {/* Заголовок списку + зелений плюсик */}
      <View style={styles.myPlantsHeader}>
        <Text style={typography.h2}>My plants</Text>
        <Pressable
          onPress={() => navigation.navigate('AddPlant')}
          style={({ pressed }) => [
            styles.addButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* Список рослин із SQLite */}
      <FlatList
        data={plants}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PlantCardItem
            plant={item}
            onPress={() =>
              navigation.navigate('PlantDetail', { plantId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyBox}>
              <Text style={typography.p}>No plants yet.</Text>
              <Text style={typography.caption}>
                Tap "+" above to add your first plant.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  greetingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  myPlantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  emptyBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});