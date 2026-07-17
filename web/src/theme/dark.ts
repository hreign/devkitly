import type { GlobalThemeOverrides } from 'naive-ui';

export const darkThemeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#22C55E',
    primaryColorHover: '#4ADE80',
    primaryColorPressed: '#16A34A',
    primaryColorSuppl: '#86EFAC',
    bodyColor: '#0F172A',
    cardColor: '#1E293B',
    modalColor: '#1E293B',
    popoverColor: '#1E293B',
    tableColor: '#1E293B',
    inputColor: '#1E293B',
    actionColor: '#334155',
    borderColor: '#334155',
    textColorBase: '#F8FAFC',
    textColor1: '#F8FAFC',
    textColor2: '#CBD5E1',
    textColor3: '#64748B',
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
    railColor: '#334155',
  },
};
