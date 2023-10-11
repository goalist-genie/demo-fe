import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'main': "#1E4CC6",
        'secondary': "#5282FF",
        'secondary_light': "#D8E3FF66",
        'ink-500': "#535353",
        'gray': "#D8D8D8",
        'modal': "rgba(0, 0, 0, 0.60)",
        'green': "#31B998",
        'ink': "#777",
        'dark_green': "#168F72",
        'light_green': "#B2F9E833",
      },
    },
  },
  plugins: [],
}
export default config
