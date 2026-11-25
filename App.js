import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { initDatabase, getAllPlants, addPlant } from './src/db/database';
import { colors, typography, spacing } from './src/theme/tokens';

export default function App() {
  const [plants, setPlants] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function setup() {
      await initDatabase();
      const existingPlants = await getAllPlants();
      if(existingPlants.length === 0) {
        await addPlant({
          name: 'Monstera deliciosa',
          plantType: 'Indoor plant',
          waterFrequencyDays: 3,
          notes: 'Test plant from SQLite',
        });
      }
      const updatePlants = await getAllPlants();
      if (isMounted) {
        setPlants(updatePlants);
        setIsReady(true);
      }
    }
    setup();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!isReady) {
    return(
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Loading database...</Text>
        <StatusBar style="auto"/>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={typography.h1}>Bloom</Text>
      <Text style={[typography.caption, {marginBottom: spacing.md}]}>
        Plants in SQLite: {plants.length}
      </Text>

      <FlatList
        data={plants}
        keyExtractor={(item) => String(item.id)}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={typography.h2}>{item.name}</Text>
            <Text style={typography.caption}>
              Every {item.water_frequency_days} days · {item.plant_type}
            </Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing.lg,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.p,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
});
