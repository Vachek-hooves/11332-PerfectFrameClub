export const colors = {
  background: '#061A13',
  backgroundElevated: '#0B281D',
  surface: '#101A2B',
  surfaceAlt: '#16223A',
  surfaceMuted: '#0D1626',
  surfaceSheet: '#111C2F',
  border: '#1D2C45',
  borderStrong: '#27395A',
  borderSoft: '#16233A',

  textPrimary: '#F3F7FF',
  textSecondary: '#A8B8D4',
  textMuted: '#7486A6',
  textFaint: '#4E5F7C',

  primary: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryDeep: '#12306F',
  primarySoft: 'rgba(59,130,246,0.16)',

  gold: '#D6A84E',
  goldSoft: 'rgba(214,168,78,0.14)',
  goldDeep: '#8A6520',

  success: '#34C98A',
  successSoft: 'rgba(52,201,138,0.14)',
  successDeep: '#1B7A55',

  danger: '#E5544F',
  dangerSoft: 'rgba(229,84,79,0.14)',

  warning: '#E8A33D',

  red: '#E0453F',
  yellow: '#E8C547',
  green: '#3FA860',
  brown: '#8B5E36',
  blue: '#3B7DDD',
  pink: '#E682A8',
  black: '#1A1A20',
  white: '#F2EEE2',

  overlay: 'rgba(3,7,15,0.74)',
  transparent: 'transparent',
} as const;

export const gradients = {
  primary: ['#4A90FF', '#2563EB'] as string[],
  primaryPressed: ['#3277E6', '#1B4FC4'] as string[],
  primaryDisabled: ['#1B2740', '#162033'] as string[],
  light: ['#FBFCFF', '#E7ECF7'] as string[],
  gold: ['#E6BC6A', '#B4843A'] as string[],
  success: ['#3FD79A', '#22996C'] as string[],
  danger: ['#F0635E', '#C23934'] as string[],
  card: ['#16233B', '#0E1727'] as string[],
  cardHighlight: ['#1B2E4E', '#101B2E'] as string[],
  screen: ['#103A2A', '#061A13'] as string[],
  screenTop: ['#164A35', '#082319'] as string[],
  sheet: ['#16243C', '#0D1626'] as string[],
  ghost: ['rgba(59,130,246,0.18)', 'rgba(59,130,246,0.06)'] as string[],
  neutral: ['#1B2740', '#131D30'] as string[],
} as const;

export const ballColors: Record<string, string> = {
  red: colors.red,
  yellow: colors.yellow,
  green: colors.green,
  brown: colors.brown,
  blue: colors.blue,
  pink: colors.pink,
  black: colors.black,
  white: colors.white,
};
