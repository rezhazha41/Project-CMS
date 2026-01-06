import { createRequire } from 'module'
const require = createRequire(import.meta.url)

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.edge",
        "./resources/**/*.{js,ts,jsx,tsx,vue}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    dark: 'color-mix(in srgb, var(--color-primary), black 20%)',
                },
                secondary: '#6366F1', // indigo-500
                success: '#22C55E',   // green-500
                warning: '#F59E0B',   // amber-500
                danger: '#EF4444',    // red-500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                'bounce-slow': 'bounce 3s infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
}
