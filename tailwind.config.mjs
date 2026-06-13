/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'primary': '#2e5e41',
				'primary-dark': '#182c21',
				'primary-light': '#e2e8da',
				'sage': '#eef1e9',
				'lime-accent': '#9bc53d',
			},
			maxWidth: {
				'8xl': '88rem',
				'9xl': '96rem',
			},
			container: {
				screens: {
					sm: '640px',
					md: '768px',
					lg: '1024px',
					xl: '1024px',
					'2xl': '1024px',
				}
			},
			fontFamily: {
				// Bosque Serif rebrand: Scandia (files were never shipped) now
				// aliases the body font so every existing class follows the theme.
				'scandia': ['Albert Sans', 'sans-serif'],
				'scandia-medium': ['Albert Sans', 'sans-serif'],
				'fraunces': ['Fraunces', 'Georgia', 'serif'],
				'albert': ['Albert Sans', 'sans-serif'],
				'poppins': ['Poppins', 'sans-serif'],
				'bebas': ['Bebas Neue', 'sans-serif'],
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'slide-left': 'slideLeft 0.5s ease-out',
				'slide-right': 'slideRight 0.5s ease-out',
				'bounce-slow': 'bounce 3s infinite',
				'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'float': 'float 6s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideLeft: {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				slideRight: {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-20px)' },
				},
			},
			boxShadow: {
				'soft': '0 2px 15px rgba(1, 134, 214, 0.1)',
				'medium': '0 4px 20px rgba(1, 134, 214, 0.15)',
				'large': '0 10px 40px rgba(1, 134, 214, 0.2)',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}