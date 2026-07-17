import type { GlobalThemeOverrides } from 'naive-ui';

export const lightThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#22C55E',
    primaryColorHover: '#16A34A',
    primaryColorPressed: '#15803D',
    primaryColorSuppl: '#4ADE80',
    bodyColor: '#F8FAFC',
    cardColor: '#FFFFFF',
    modalColor: '#FFFFFF',
    popoverColor: '#FFFFFF',
    tableColor: '#FFFFFF',
    inputColor: '#FFFFFF',
    actionColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    textColorBase: '#0F172A',
    textColor1: '#0F172A',
    textColor2: '#475569',
    textColor3: '#94A3B8',
    borderRadius: '12px',
    borderRadiusSmall: '8px',
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontFamilyMono:
      "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  Button: {
    borderRadiusMedium: '10px',
    borderRadiusSmall: '8px',
  },
  Card: {
    borderRadius: '16px',
    paddingMedium: '24px',
  },
  Menu: {
    borderRadius: '8px',
    itemHeight: '44px',
  },
  Input: {
    borderRadius: '10px',
  },
  Select: {
    peers: {
      InternalSelection: {
        borderRadius: '10px',
      },
    },
  },
  Progress: {
    fillColor: '#22C55E',
    railColor: '#E2E8F0',
  },
};
