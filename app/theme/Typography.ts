import { TextStyle } from 'react-native';

export interface TypographyScale {
  // Heading styles
  h1: TextStyle;
  h2: TextStyle;
  h3: TextStyle;
  h4: TextStyle;
  // Body text styles
  bodyLarge: TextStyle;
  bodyMedium: TextStyle;
  bodySmall: TextStyle;
  // Label and caption styles
  labelLarge: TextStyle;
  labelMedium: TextStyle;
  labelSmall: TextStyle;
  caption: TextStyle;
}

export const createTypography = (theme: any): TypographyScale => ({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: theme.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    color: theme.text,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: theme.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: theme.text,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
    color: theme.text,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: theme.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: theme.textSecondary,
  },
  labelLarge: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: theme.text,
  },
  labelMedium: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: theme.text,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: theme.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: theme.textTertiary,
  },
});

export default createTypography;
