import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			bg: {
  				base: 'var(--bg-base)',
  				surface: 'var(--bg-surface)',
  				elevated: 'var(--bg-elevated)',
  				overlay: 'var(--bg-overlay)',
  				subtle: 'var(--bg-subtle)'
  			},
  			text: {
  				primary: 'var(--text-primary)',
  				secondary: 'var(--text-secondary)',
  				tertiary: 'var(--text-tertiary)',
  				disabled: 'var(--text-disabled)'
  			},
  			border: {
  				DEFAULT: 'var(--border-default)',
  				strong: 'var(--border-strong)',
  				focus: 'var(--border-focus)'
  			},
  			accent: {
  				from: 'var(--accent-from)',
  				to: 'var(--accent-to)',
  				text: 'var(--accent-text)',
  				hover: 'var(--accent-hover)'
  			},
  			semantic: {
  				success: 'var(--success)',
  				warning: 'var(--warning)',
  				error: 'var(--error)',
  				info: 'var(--info)'
  			},
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			input: 'var(--input)',
  			ring: 'var(--ring)'
  		},
  		borderRadius: {
  			sm: 'var(--radius-sm)',
  			md: 'var(--radius-md)',
  			lg: 'var(--radius-lg)',
  			xl: 'var(--radius-xl)',
  			DEFAULT: 'var(--radius)'
  		},
  		boxShadow: {
  			sm: '0 1px 2px rgba(0,0,0,0.05)',
  			md: '0 4px 6px -1px rgba(0,0,0,0.08)',
  			lg: '0 10px 15px -3px rgba(0,0,0,0.08)',
  			xl: '0 20px 25px -5px rgba(0,0,0,0.10)'
  		},
  		fontSize: {
  			'display-2xl': ["72px", { lineHeight: "90px", fontWeight: "700" }],
  			'display-xl': ["60px", { lineHeight: "72px", fontWeight: "700" }],
  			'display-lg': ["48px", { lineHeight: "60px", fontWeight: "600" }],
  			'display-md': ["36px", { lineHeight: "44px", fontWeight: "600" }],
  			'display-sm': ["30px", { lineHeight: "38px", fontWeight: "600" }],
  			'text-xl': ["20px", { lineHeight: "30px", fontWeight: "400" }],
  			'text-lg': ["18px", { lineHeight: "28px", fontWeight: "400" }],
  			'text-md': ["16px", { lineHeight: "24px", fontWeight: "400" }],
  			'text-sm': ["14px", { lineHeight: "20px", fontWeight: "400" }],
  			'text-xs': ["12px", { lineHeight: "16px", fontWeight: "400" }]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
