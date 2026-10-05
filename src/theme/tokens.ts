// Design tokens: única fonte de verdade visual do app.
export const colors = {
  brand: '#76EB3C',
  brandDark: '#4FB81F',
  brandSoft: 'rgba(118,235,60,0.14)',
  black: '#000000',
  surface: '#0E0E0E',
  surfaceRaised: '#181818',
  border: '#262626',
  textPrimary: '#FFFFFF',
  textSecondary: '#A3A3A3',
  danger: '#FF5A5F',
  white: '#FFFFFF',
} as const;

// Grid de 4pt
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 16, lg: 24, pill: 999 } as const;

export const typography = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800' as const },
  title: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' as const },
};

export const layout = { minTouch: 44 } as const;