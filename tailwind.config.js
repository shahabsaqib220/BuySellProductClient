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
        'light-switch-yellow': 'lightSwitchYellow 2s ease-in-out infinite alternate',
        'light-switch-premium': 'lightSwitchPremium 2s ease-in-out infinite alternate', // New premium animation
      },
      keyframes: {
        lightSwitchBlue: {
          '0%': { 
            backgroundColor: '#1E40AF', // Tailwind's blue-500 color
            color: '#FFFFFF', // White text color for contrast
            boxShadow: '0 0 10px rgba(30, 64, 175, 0.5)', // Subtle shadow
            transform: 'scale(1)', // Initial scale
          },
          '100%': { 
            backgroundColor: '#BFDBFE', // Light blue color for a more subtle effect
            color: '#1E40AF', // Dark blue text for contrast
            boxShadow: '0 0 20px rgba(191, 219, 254, 0.8)', // Stronger shadow
            transform: 'scale(1.05)', // Slight scale up
          },
        },
        lightSwitchGreen: {
          '0%': { 
            backgroundColor: '#10B981', // Tailwind's green-500 color
            color: '#FFFFFF', // White text color for contrast
            boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)', // Subtle shadow
            transform: 'scale(1)', // Initial scale
          },
          '100%': { 
            backgroundColor: '#6EE7B7', // Light green color for smooth transition
            color: '#10B981', // Dark green text for contrast
            boxShadow: '0 0 20px rgba(110, 231, 183, 0.8)', // Stronger shadow
            transform: 'scale(1.05)', // Slight scale up
          },
        },
        lightSwitchYellow: {
          '0%': { 
            backgroundColor: '#F59E0B', // Tailwind's yellow-500 color
            color: '#000000', // Black text for contrast
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)', // Subtle shadow
            transform: 'scale(1)', // Initial scale
          },
          '100%': { 
            backgroundColor: '#FDE68A', // Light yellow color
            color: '#F59E0B', // Dark yellow text for contrast
            boxShadow: '0 0 20px rgba(253, 230, 138, 0.8)', // Stronger shadow
            transform: 'scale(1.05)', // Slight scale up
          },
        },
        lightSwitchPremium: { // New premium animation
          '0%': { 
            background: 'linear-gradient(135deg, #4F46E5, #9333EA)', // Gradient background
            color: '#FFFFFF', // White text color for contrast
            boxShadow: '0 0 15px rgba(79, 70, 229, 0.6)', // Subtle shadow
            transform: 'rotate(0deg) scale(1)', // Initial rotation and scale
          },
          '50%': { 
            background: 'linear-gradient(135deg, #9333EA, #4F46E5)', // Reverse gradient
            color: '#FFFFFF', // White text color for contrast
            boxShadow: '0 0 25px rgba(147, 51, 234, 0.8)', // Stronger shadow
            transform: 'rotate(2deg) scale(1.02)', // Slight rotation and scale
          },
          '100%': { 
            background: 'linear-gradient(135deg, #4F46E5, #9333EA)', // Original gradient
            color: '#FFFFFF', // White text color for contrast
            boxShadow: '0 0 15px rgba(79, 70, 229, 0.6)', // Subtle shadow
            transform: 'rotate(0deg) scale(1)', // Reset rotation and scale
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
