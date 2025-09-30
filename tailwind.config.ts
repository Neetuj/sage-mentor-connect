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
          "card-shuffle": {
            "0%": { transform: "translateX(0) translateY(0) rotate(0deg)", opacity: "0" },
            "20%": { transform: "translateX(-10px) translateY(-10px) rotate(-5deg)", opacity: "1" },
            "40%": { transform: "translateX(10px) translateY(10px) rotate(5deg)", opacity: "1" },
            "60%": { transform: "translateX(-5px) translateY(5px) rotate(-3deg)", opacity: "1" },
            "80%": { transform: "translateX(5px) translateY(-5px) rotate(3deg)", opacity: "1" },
            "100%": { transform: "translateX(0) translateY(0) rotate(0deg)", opacity: "1" }
          },
          "card-spread": {
            "0%": { transform: "translateX(0) rotate(0deg)" },
            "100%": { transform: "var(--spread-x) rotate(var(--spread-rotate))" }
          },
          "card-flip": {
            "0%": { transform: "rotateY(0deg)" },
            "50%": { transform: "rotateY(180deg)" },
            "100%": { transform: "rotateY(360deg)" }
          },
          "card-collect": {
            "0%": { transform: "var(--spread-x) rotate(var(--spread-rotate))", opacity: "1" },
            "100%": { transform: "translateX(0) rotate(0deg)", opacity: "1" }
          },
          "card-appear": {
            "0%": { transform: "scale(0.8)", opacity: "0" },
            "100%": { transform: "scale(1)", opacity: "1" }
          },
          "card-disappear": {
            "0%": { transform: "scale(1)", opacity: "1" },
            "100%": { transform: "scale(0.8)", opacity: "0" }
          },
          "backdrop-appear": {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" }
          }
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "card-shuffle": "card-shuffle 1s ease-in-out",
          "card-spread": "card-spread 0.8s ease-out forwards",
          "card-flip": "card-flip 1s ease-in-out",
          "card-collect": "card-collect 0.8s ease-in forwards",
          "card-appear": "card-appear 0.3s ease-out",
          "card-disappear": "card-disappear 0.4s ease-in forwards",
          "backdrop-appear": "backdrop-appear 0.3s ease-out"
        },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
