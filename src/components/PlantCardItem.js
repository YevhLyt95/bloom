import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../theme/tokens';

export default function PlantCardItem({ plant, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.row}>
        {/* Місце під фото / іконку рослини зліва */}
        <View style={styles.thumb}>
          <Ionicons name="leaf" size={22} color={colors.green} />
        </View>

        {/* Назва і частота/статус поливу */}
        <View style={styles.info}>
          <Text style={typography.h2} numberOfLines={1}>
            {plant.name}
          </Text>
          <Text style={typography.caption}>
            Every {plant.water_frequency_days} days
          </Text>
        </View>

        {/* Синя крапля праворуч як на макеті */}
        <Ionicons name="water" size={18} color={colors.blue} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  cardPressed: {
    opacity: 0.9,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
});