/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'light-switch-blue': 'lightSwitchBlue 2s ease-in-out infinite alternate',
        'light-switch-green': 'lightSwitchGreen 2s ease-in-out infinite alternate',
        'light-switch-yellow': 'lightSwitchYellow 2s ease-in-out infinite alternate', // New animation for Premium
      },
      keyframes: {
        lightSwitchBlue: {
          '0%': { 
            backgroundColor: '#1E40AF', // Tailwind's blue-500 color
            color: '#FFFFFF', // White text color for contrast
          },
          '100%': { 
            backgroundColor: '#BFDBFE', // Light blue color for a more subtle effect
            color: '#1E40AF', // Dark blue text for contrast
          },
        },
        lightSwitchGreen: {
          '0%': { 
            backgroundColor: '#10B981', // Tailwind's green-500 color
            color: '#FFFFFF', // White text color for contrast
          },
          '100%': { 
            backgroundColor: '#6EE7B7', // Light green color for smooth transition
            color: '#10B981', // Dark green text for contrast
          },
        },
        lightSwitchYellow: { // New keyframe animation for Premium
          '0%': { 
            backgroundColor: '#F59E0B', // Tailwind's yellow-500 color
            color: '#000000', // Black text for contrast
          },
          '100%': { 
            backgroundColor: '#FDE68A', // Light yellow color
            color: '#F59E0B', // Dark yellow text for contrast
          },
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
