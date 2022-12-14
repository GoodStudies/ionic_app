module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx,css}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
		fontFamily:{
			Heebo: ['Heebo', 'sans-serif'],
			Catamaran: ['Catamaran', 'sans-serif'],
			OpenSans: ['OpenSans', 'sans-serif'],
			RubikGemstones: ['Rubik Gemstones', 'cursive'],
		}
	},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
