import React from 'react';
import { motion } from 'framer-motion';

const SlideLeftContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ transform: 'translateY(100%)' }}
      animate={{ transform: 'translateY(0%)' }}
      exit={{ transform: 'translateY(100%)' }}
      transition={{ duration: 0.2 }}
      className='w-full h-full relative'>
      {children}
    </motion.div>
  );
};

export default SlideLeftContainer;
