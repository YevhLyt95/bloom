import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import {colors, typography, spacing} from '../theme/tokens';

export default function PrimaryButton({title, onPress}) {
    return(
        <Pressable
            onPress={onPress}
            //if pressed, low opacity for visual response
            style={({pressed}) => [
                styles.button,
                pressed && styles.buttonPressed,
            ]}
        >
            <Text style={styles.label}>{title}</Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.green,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  label: {
    ...typography.button,
    color: '#FFFFFF',
  },
});