export type Mode = 'parent' | 'kid';

const base = {
  surface: '#F7F4EB',
  onSurface: '#333B31',
  surfaceSecondary: '#EBE4D5',
  onSurfaceSecondary: '#525E4F',
  surfaceTertiary: '#DFD7C4',
  onSurfaceTertiary: '#6A7566',
  surfaceInverse: '#333B31',
  onSurfaceInverse: '#F7F4EB',

  // Green forest is the dominant chrome color — used for backgrounds, chips,
  // borders, icons. Terracotta (brandPrimary) is reserved for primary CTAs only.
  brand: '#A3B899',
  brandPrimary: '#D4704B',
  onBrandPrimary: '#FFFFFF',
  brandSecondary: '#E8BA40',
  onBrandSecondary: '#333B31',
  brandTertiary: '#CDE0C3',
  onBrandTertiary: '#333B31',

  success: '#8CA87B',
  onSuccess: '#FFFFFF',
  warning: '#E8BA40',
  onWarning: '#333B31',
  error: '#D4704B',
  onError: '#FFFFFF',
  info: '#E8BA40',
  onInfo: '#333B31',

  border: '#DFD7C4',
  borderStrong: '#A3B899',
  divider: '#DFD7C4',
};

const kidOverrides = {
  surface: '#FFF9E6',
  brandPrimary: '#F2613F',
  brandSecondary: '#FFC933',
};

export function colorsFor(mode: Mode) {
  return mode === 'kid' ? { ...base, ...kidOverrides } : base;
}

export const typography = {
  displayFontFamily: 'Fraunces_500Medium',
  displayFontFamilyRegular: 'Fraunces_400Regular',
  textFontFamily: 'Nunito_400Regular',
  textFontFamilyMedium: 'Nunito_500Medium',
  scale: {
    sm: 12,
    base: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
};

// Kid mode: minimum 64x64pt touch targets, parent mode follows standard 44pt.
export const touchTarget = {
  parent: 44,
  kid: 64,
};

export const images = {
  magicalForestHero:
    'https://images.unsplash.com/photo-1698006104265-6aa28b4a7199?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTF8MHwxfHNlYXJjaHwxfHxtYWdpY2FsJTIwZm9yZXN0JTIwZ2xvd2luZyUyMG11c2hyb29tcyUyMG5pZ2h0JTIwaWxsdXN0cmF0aW9ufGVufDB8fHx8MTc4NDg5OTc5MHww&ixlib=rb-4.1.0&q=85',
  kidAvatarRabbit:
    'https://images.pexels.com/photos/4588068/pexels-photo-4588068.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  parentModeTexture:
    'https://images.pexels.com/photos/7119095/pexels-photo-7119095.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
};
