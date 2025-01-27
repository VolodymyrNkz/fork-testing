import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/_components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        primaryDark: 'var(--color-primary-dark)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        accentDark: 'var(--color-accent-dark)',
        lightGreen: 'var(--color-light-green)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        textDisabled: 'var(--color-text-disabled)',
        background: 'var(--color-background)',
        backgroundGreenLight: 'var(--color-background-green-light)',
        backgroundLight: 'var(--color-background-light)',
        backgroundDark: 'var(--color-background-dark)',
        disabled: 'var(--color-disabled)',
        borderPrimary: 'var(--color-border-primary)',
        borderSecondary: 'var(--color-border-secondary)',
        borderDisabled: 'var(--color-border-disabled)',
        borderDark: 'var(--color-border-dark)',
        borderLight: 'var(--color-border-light)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },
      spacing: {
        xxs: 'var(--spacing-xxs)',
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        mlg: 'var(--spacing-mlg)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        xxl: 'var(--spacing-xxl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        xl: 'var(--radius-xl)',
        lg: 'var(--radius-lg)',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
      fontSize: {
        h2: ['24px', { lineHeight: '32px', fontWeight: '800' }],
        h3: ['18px', { lineHeight: '24px', fontWeight: '800' }],
        h4: ['16px', { lineHeight: '24px', fontWeight: '700' }],
        text: ['14px', { lineHeight: '21px', fontWeight: '500' }],
        light: ['12px', { lineHeight: '18px', fontWeight: '300' }],
        helperText: ['14px', { lineHeight: '21px', fontWeight: '400' }],
        button: ['16px', { lineHeight: '24px', fontWeight: '500' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'skeleton-loading': 'skeleton-loading 1.5s infinite ease-in-out',
        rotate: 'rotate 2s linear infinite',
        dash: 'dash 1.5s ease-in-out infinite, color 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '20%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'skeleton-loading': {
          '0%': { backgroundColor: '#e0e0e0' },
          '50%': { backgroundColor: '#f0f0f0' },
          '100%': { backgroundColor: '#e0e0e0' },
        },
        rotate: {
          '100%': { transform: 'rotate(360deg)' },
        },
        dash: {
          '0%': { strokeDasharray: '1, 200', strokeDashoffset: '0' },
          '50%': { strokeDasharray: '89, 200', strokeDashoffset: '-35px' },
          '100%': { strokeDasharray: '89, 200', strokeDashoffset: '-124px' },
        },
        color: {
          '0%, 100%': { stroke: '#00665a' },
          '40%': { stroke: '#05c15c' },
          '66%': { stroke: '#00665a' },
          '80%, 90%': { stroke: '#05c15c' },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-primary': {
          'text-shadow': '0px 0px 20px #000',
        },
      });
    }),
  ],
} satisfies Config;