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
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					light: 'hsl(var(--secondary-light))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					light: 'hsl(var(--accent-light))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			backgroundImage: {
				'hero-gradient': 'var(--gradient-hero)',
				'card-gradient': 'var(--gradient-card)'
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'card-hover': 'var(--shadow-card-hover)'
			},
			transitionProperty: {
				'smooth': 'var(--transition-smooth)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          // Easter egg animations
          "bounce-scale": {
            "0%, 100%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.05)" },
          },
          "wiggle": {
            "0%, 100%": { transform: "rotate(-3deg)" },
            "50%": { transform: "rotate(3deg)" },
          },
          "party-spin": {
            "0%": { transform: "rotate(0deg) scale(1)" },
            "25%": { transform: "rotate(90deg) scale(1.1)" },
            "50%": { transform: "rotate(180deg) scale(1)" },
            "75%": { transform: "rotate(270deg) scale(1.1)" },
            "100%": { transform: "rotate(360deg) scale(1)" },
          },
          "flamenco-spin": {
            "0%": { transform: "rotate(0deg)" },
            "25%": { transform: "rotate(-10deg) scale(1.1)" },
            "50%": { transform: "rotate(10deg) scale(1.2)" },
            "75%": { transform: "rotate(-5deg) scale(1.1)" },
            "100%": { transform: "rotate(0deg) scale(1)" },
          },
          "card-shuffle": {
            "0%": { transform: "translateX(0) rotate(0deg)" },
            "25%": { transform: "translateX(-10px) rotate(-5deg)" },
            "50%": { transform: "translateX(10px) rotate(5deg)" },
            "75%": { transform: "translateX(-5px) rotate(-2deg)" },
            "100%": { transform: "translateX(0) rotate(0deg)" },
          },
          "snowboard": {
            "0%": { transform: "rotate(0deg) translateY(0)" },
            "25%": { transform: "rotate(-15deg) translateY(-10px)" },
            "50%": { transform: "rotate(15deg) translateY(-5px)" },
            "75%": { transform: "rotate(-5deg) translateY(-15px)" },
            "100%": { transform: "rotate(0deg) translateY(0)" },
          },
          "float-up": {
            "0%": { transform: "translateY(0) opacity(1)" },
            "100%": { transform: "translateY(-50px) opacity(0)" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          // Easter egg animations
          "bounce-scale": "bounce-scale 0.3s ease-in-out",
          "wiggle": "wiggle 0.5s ease-in-out",
          "party-spin": "party-spin 1s ease-in-out",
          "flamenco-spin": "flamenco-spin 0.8s ease-in-out",
          "card-shuffle": "card-shuffle 0.6s ease-in-out",
          "snowboard": "snowboard 0.7s ease-in-out",
          "float-up": "float-up 1.5s ease-out forwards",
        },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
