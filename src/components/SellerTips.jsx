import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tips = [
  "Update your inventory daily to maintain accurate stock levels",
  "Respond to customer queries promptly to improve satisfaction",
  "Highlight seasonal products to boost sales",
  "Offer discounts to attract new customers",
  "Use high-quality images for your product listings"
];

export default function SellerTips() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <motion.div 
      className="bg-gradient-to-r from-agri-green to-agri-green-dark text-white p-4 rounded-xl shadow-md mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-2">
        <h2 className="font-bold text-lg">Seller Tips</h2>
        <div className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">Pro</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentTipIndex}
          className="text-sm font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {tips[currentTipIndex]}
        </motion.p>
      </AnimatePresence>
      <div className="flex justify-center mt-3">
        {tips.map((_, index) => (
          <motion.span
            key={index}
            className={`block h-2 w-2 bg-white rounded-full mx-1.5 ${index === currentTipIndex ? 'opacity-100' : 'opacity-25'}`}
            whileHover={{ scale: 1.2 }}
          ></motion.span>
        ))}
      </div>
    </motion.div>
  );
}
