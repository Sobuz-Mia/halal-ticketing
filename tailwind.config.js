/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js,ts,jsx,tsx}", "!./node_modules/**"],
  theme: {
    extend: {
      fontFamily: {
        korla: ["Karla", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        // Custom colors from your project
        "primary-green": "#89EB8E",
        "primary-blue": "#11D8F5",
        "text-dark": "#09090B",
        "border-gray": "#404040",
      },
    },
  },
  plugins: [],
};
