// components/magicui/sparkles-text.js
import React from 'react';
import { motion } from 'framer-motion';

const SparklesText = ({ text }) => {
  return (
    <motion.h1
      className="text-4xl font-bold text-center text-[#5046e6]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {text}
      <motion.span
        className="inline-block animate-sparkle"
        initial={{ scale: 1 }}
        animate={{ scale: 1.2 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.5,
          ease: "easeInOut"
        }}
      >
        ✨
      </motion.span>
    </motion.h1>
  );
};

export default SparklesText;
