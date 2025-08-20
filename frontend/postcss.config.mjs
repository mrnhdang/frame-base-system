const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
};

export default config;
