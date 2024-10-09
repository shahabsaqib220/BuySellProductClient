// components/magicui/rainbow-button.js
import { motion } from 'framer-motion';

export const RainbowButton = ({ children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, backgroundImage: "linear-gradient(90deg, #ff7eb9, #ff65a3, #7afcff)" }}
      whileTap={{ scale: 0.9 }}
      className="py-2 px-4 rounded-full text-white font-bold bg-gradient-to-r from-pink-500 to-yellow-500 hover:bg-gradient-to-l transition-all duration-300"
    >
      {children}
    </motion.button>
  );
};
