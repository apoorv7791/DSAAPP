import React from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeType } from '../../theme/ThemeContext';
import { spacingUtils } from '../../theme/Spacing';

interface CardProps {
  children: React.ReactNode;
  theme: ThemeType;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  gradient?: [string, string, ...string[]];
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  theme,
  style,
  onPress,
  variant = 'default',
  gradient,
  disabled = false,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && onPress) {
      Animated.spring(animatedValue, {
        toValue: 0.96,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && onPress) {
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 16,
      overflow: 'hidden',
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: theme.bgCard,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: theme.bgCard,
          borderWidth: 1,
          borderColor: theme.border,
        };
      case 'gradient':
        return {
          ...baseStyle,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.bgCard,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 3,
        };
    }
  };

  const cardContent = (
    <View
      style={[
        styles.cardContent,
        spacingUtils.p.md,
        getCardStyle(),
        style,
      ]}
    >
      {children}
    </View>
  );

  if (variant === 'gradient' && gradient) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
          >
            {cardContent}
          </LinearGradient>
        </Animated.View>
      </Pressable>
    );
  }

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
          {cardContent}
        </Animated.View>
      </Pressable>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  cardContent: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
    borderRadius: 16,
  },
});

export default Card;
