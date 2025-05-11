import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'cyber': ['JetBrains Mono', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				cyber: {
					green: '#5CD8B1',
					darkgreen: '#4BC9A2',
					lightgreen: '#7FFF00',
					black: '#111111',
					grid: '#0D2E0D',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
				},
				"glitch-1": {
					"0%, 100%": { transform: "none", opacity: "1" },
					"7%": { transform: "skew(-0.5deg, -0.9deg)", opacity: "0.75" },
					"10%": { transform: "none", opacity: "1" },
					"27%": { transform: "none", opacity: "1" },
					"30%": { transform: "skew(0.8deg, -0.1deg)", opacity: "0.75" },
					"35%": { transform: "none", opacity: "1" },
					"52%": { transform: "none", opacity: "1" },
					"55%": { transform: "skew(-1deg, 0.2deg)", opacity: "0.75" },
					"50%": { transform: "none", opacity: "1" },
					"72%": { transform: "none", opacity: "1" },
					"75%": { transform: "skew(0.4deg, 1deg)", opacity: "0.75" },
					"80%": { transform: "none", opacity: "1" },
					"92%": { transform: "none", opacity: "1" },
					"95%": { transform: "skew(-0.2deg, -0.6deg)", opacity: "0.75" },
				},
				"glitch-2": {
					"0%, 100%": { transform: "none", opacity: "0.25" },
					"7%": { transform: "translate(-2px, 3px)", opacity: "0.5" },
					"10%": { transform: "none", opacity: "0.25" },
					"27%": { transform: "none", opacity: "0.25" },
					"30%": { transform: "translate(-5px, -2px)", opacity: "0.5" },
					"35%": { transform: "none", opacity: "0.25" },
					"52%": { transform: "none", opacity: "0.25" },
					"55%": { transform: "translate(5px, 1px)", opacity: "0.5" },
					"50%": { transform: "none", opacity: "0.25" },
					"72%": { transform: "none", opacity: "0.25" },
					"75%": { transform: "translate(3px, 6px)", opacity: "0.5" },
					"80%": { transform: "none", opacity: "0.25" },
					"92%": { transform: "none", opacity: "0.25" },
					"95%": { transform: "translate(-2px, 1px)", opacity: "0.5" },
				},
				"glitch-3": {
					"0%, 100%": { transform: "none", opacity: "0.25" },
					"7%": { transform: "translate(2px, -3px)", opacity: "0.5" },
					"10%": { transform: "none", opacity: "0.25" },
					"27%": { transform: "none", opacity: "0.25" },
					"30%": { transform: "translate(5px, 2px)", opacity: "0.5" },
					"35%": { transform: "none", opacity: "0.25" },
					"52%": { transform: "none", opacity: "0.25" },
					"55%": { transform: "translate(-5px, -1px)", opacity: "0.5" },
					"50%": { transform: "none", opacity: "0.25" },
					"72%": { transform: "none", opacity: "0.25" },
					"75%": { transform: "translate(-3px, -6px)", opacity: "0.5" },
					"80%": { transform: "none", opacity: "0.25" },
					"92%": { transform: "none", opacity: "0.25" },
					"95%": { transform: "translate(2px, -1px)", opacity: "0.5" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"glitch-1": "glitch-1 4s infinite linear alternate-reverse",
				"glitch-2": "glitch-2 4s infinite linear alternate-reverse",
				"glitch-3": "glitch-3 4s infinite linear alternate-reverse",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
