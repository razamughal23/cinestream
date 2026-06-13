import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "hsl(14,100%,57%)",
        "brand-light": "hsl(14,100%,70%)",
        bg: "hsl(220,20%,8%)",
        "bg-card": "hsl(220,18%,11%)",
        "bg-muted": "hsl(220,15%,14%)",
        border: "hsl(220,15%,18%)",
        "text-muted": "hsl(220,10%,50%)",
      },
      fontFamily: { sans: ["Inter", "sans-serif"] },
    },
  },
  plugins: [],
};
export default config;
