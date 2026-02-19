export const Colors = {
  // Primary brand
  primary: '#F4A261',       // warm amber
  primaryLight: '#FDDCB5',
  primaryDark: '#E08040',

  // Accent
  accent: '#A8DADC',        // soft teal
  accentLight: '#D4F1F2',
  accentDark: '#6BBFC3',

  // Backgrounds
  background: '#FFF9F4',    // warm off-white
  surface: '#FFFFFF',
  surfaceAlt: '#FEF3E8',

  // Mood colors
  moodLow: '#FFCDD2',       // soft red (1-2)
  moodLowText: '#C62828',
  moodMid: '#FFF9C4',       // soft yellow (3)
  moodMidText: '#F9A825',
  moodHigh: '#C8E6C9',      // soft green (4-5)
  moodHighText: '#2E7D32',

  // Feeding types
  feedBreast: '#E1BEE7',
  feedBottle: '#B3E5FC',
  feedSolid: '#DCEDC8',

  // Text
  textPrimary: '#2D2D2D',
  textSecondary: '#6B6B6B',
  textMuted: '#A0A0A0',
  textOnPrimary: '#FFFFFF',

  // States
  error: '#EF5350',
  errorLight: '#FFEBEE',
  success: '#66BB6A',
  successLight: '#E8F5E9',
  warning: '#FFA726',
  warningLight: '#FFF3E0',

  // Borders
  border: '#EDE8E3',
  borderLight: '#F5F2EF',

  // Chart
  chart1: '#F4A261',
  chart2: '#A8DADC',
  chart3: '#C77DFF',
  chart4: '#95D5B2',
  chart5: '#FFB703',

  // Overlay
  overlay: 'rgba(0,0,0,0.4)',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const Typography = {
  displayLg: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  displayMd: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  displaySm: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  headingLg: { fontSize: 20, fontWeight: '700' as const, lineHeight: 28 },
  headingMd: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  headingSm: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  bodyLg: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  bodySm: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  label: { fontSize: 11, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.5 },
  caption: { fontSize: 10, fontWeight: '400' as const, lineHeight: 14 },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
};
