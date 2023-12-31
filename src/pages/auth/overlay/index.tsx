import React from 'react';
// import cuddieLogo from '../../../assets/brand/logo-white.svg';
import background from '../../../assets/brand/background.png';
import { motion } from 'framer-motion';
import cudiLogo from '../../../assets/brand/Cudi-Logo.png';

const InitialOverlay = (props: { isVisible: boolean }) => {
  return (
    <>
      {props.isVisible && (
        <motion.div
          className='w-screen h-screen absolute top-0 left-0 right-0 flex items-center justify-center'
          style={{ backgroundImage: `url(${background})` }}
          initial={{ transform: 'translateX(100%)', opacity: 0 }}
          animate={{ transform: 'translateX(0%)', opacity: 1 }}
          exit={{ opacity: 0, transform: 'translate(0,0)' }}
          transition={{ duration: 2 }}>
          <div className='w-18 bg-white rounded-lg p-4'>
            <img src={cudiLogo} alt='cudi' className='w-24' />
          </div>

          {/* <h1 className=' text-white text-[50px]'>Cudie</h1> */}
          {/* <img src={cuddieLogo} alt='Cuddie' /> */}
        </motion.div>
      )}
    </>
  );
};

export default InitialOverlay;
