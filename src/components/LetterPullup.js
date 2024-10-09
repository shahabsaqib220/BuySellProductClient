import React from "react";
import { motion } from "framer-motion"; // Import framer-motion for animations

const LetterPullup = ({ text, delay = 0.05 }) => {
  // Split text into an array of letters
  const letters = text.split("");

  return (
    <div style={{ display: "flex", overflow: "hidden" }}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: "100%" }} // Start position (below view)
          animate={{ y: 0 }} // End position (pull up to normal)
          transition={{
            delay: index * delay, // Add delay for staggered effect
            type: "spring", // Spring animation for smoothness
            stiffness: 100,
          }}
          style={{ display: "inline-block", marginRight: "2px" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
};

export default LetterPullup;
