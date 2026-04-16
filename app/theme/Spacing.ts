export interface SpacingScale {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export const spacing: SpacingScale = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const createSpacingUtils = (scale: SpacingScale) => ({
  // Padding utilities
  px: {
    xs: { paddingHorizontal: scale.xs },
    sm: { paddingHorizontal: scale.sm },
    md: { paddingHorizontal: scale.md },
    lg: { paddingHorizontal: scale.lg },
    xl: { paddingHorizontal: scale.xl },
  },
  py: {
    xs: { paddingVertical: scale.xs },
    sm: { paddingVertical: scale.sm },
    md: { paddingVertical: scale.md },
    lg: { paddingVertical: scale.lg },
    xl: { paddingVertical: scale.xl },
  },
  p: {
    xs: { padding: scale.xs },
    sm: { padding: scale.sm },
    md: { padding: scale.md },
    lg: { padding: scale.lg },
    xl: { padding: scale.xl },
  },
  // Margin utilities
  mx: {
    xs: { marginHorizontal: scale.xs },
    sm: { marginHorizontal: scale.sm },
    md: { marginHorizontal: scale.md },
    lg: { marginHorizontal: scale.lg },
    xl: { marginHorizontal: scale.xl },
  },
  my: {
    xs: { marginVertical: scale.xs },
    sm: { marginVertical: scale.sm },
    md: { marginVertical: scale.md },
    lg: { marginVertical: scale.lg },
    xl: { marginVertical: scale.xl },
  },
  m: {
    xs: { margin: scale.xs },
    sm: { margin: scale.sm },
    md: { margin: scale.md },
    lg: { margin: scale.lg },
    xl: { margin: scale.xl },
  },
  // Gap utilities
  gap: {
    xs: { gap: scale.xs },
    sm: { gap: scale.sm },
    md: { gap: scale.md },
    lg: { gap: scale.lg },
    xl: { gap: scale.xl },
  },
});

export const spacingUtils = createSpacingUtils(spacing);

export default spacing;
