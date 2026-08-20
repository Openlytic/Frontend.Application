// Openlytic design system - single source of truth for the brand.
// Maps to CSS variables in app/globals.css and Tailwind colors in tailwind.config.js.

import type { ThemeConfig } from 'antd';

export const brand: Record<string, string> = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  primaryActive: '#3730A3',
  accent: '#8B5CF6',
  accentHover: '#7C3AED',
  accentSoft: '#EDE9FE',
  ink: '#1E1B4B',
  inkSoft: '#312E81',
  pageBg: '#F8FAFC',
  surface: '#FFFFFF',
  subtle: '#EEF2FF',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  text: '#1E293B',
  textMuted: '#64748B',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6'
};

// antd v5 token theme - primary color + a few component tweaks; the rest comes from
// CSS variables so the two systems always agree.
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: brand.primary,
    colorInfo: brand.primary,
    colorSuccess: brand.success,
    colorWarning: brand.warning,
    colorError: brand.danger,
    colorBgLayout: brand.pageBg,
    colorBgContainer: brand.surface,
    colorText: brand.text,
    colorTextSecondary: brand.textMuted,
    colorBorder: brand.border,
    colorBorderSecondary: brand.borderLight,
    borderRadius: 10,
    fontFamily:
      'var(--font-poppins), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  components: {
    Button: {
      controlHeightLG: 46,
      controlHeight: 38,
      borderRadiusLG: 12,
      borderRadius: 10,
      fontWeight: 500
    },
    Card: {
      borderRadiusLG: 16,
      paddingLG: 24
    },
    Input: {
      controlHeightLG: 46,
      borderRadiusLG: 12
    },
    Select: {
      controlHeightLG: 46,
      borderRadiusLG: 12
    },
    Menu: {
      itemBorderRadius: 10,
      itemSelectedBg: brand.subtle,
      itemSelectedColor: brand.primary
    }
  }
};