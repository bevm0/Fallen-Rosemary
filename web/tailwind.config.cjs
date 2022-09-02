/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,js,ts,html}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#0064A4',
          secondary: '#FFD200',
          accent: '#C149AD',
          neutral: '#e0f2fe',
          'base-100': '#FFFFFF',
          info: '#93E6FB',
          success: '#80CED1',
          warning: '#EFD8BD',
          error: '#E58B8B',
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/line-clamp'),
  ],
  variants: {
    scrollbar: ['rounded'],
  },
}
