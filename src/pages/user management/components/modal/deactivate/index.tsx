import React from 'react';
import { useState } from 'react';
import { Modal, Group } from '@mantine/core';
import warningIcon from '../../../../../assets/images/warning.svg';

const DeactivateUser = ({ close, show }: ModalControllerType) => {
  const [successPrompt, setSuccessPrompt] = useState(false);

  return (
    <>
      <Modal opened={show} onClose={close} size='25%' centered>
        {/* Map Component */}
        <div className='flex flex-col  items-center gap-2 text-center p-5'>
          <img src={warningIcon} alt='warn' className=' w-24' />
          <p>Are you sure you would like to deactivate this user</p>
          <div className='flex w-full justify-center gap-4'>
            <button
              className='w-full bg-[#7738DD] p-4 rounded-lg text-white'
              onClick={() => {
                setSuccessPrompt(true);
                close();
              }}>
              yes, please
            </button>
            <button className='w-full p-4 rounded-lg' onClick={close}>
              no, return
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        opened={successPrompt}
        onClose={() => setSuccessPrompt(false)}
        size='25%'
        centered>
        <div className='flex flex-col  items-center gap-2 text-center p-5'>
          <img src={warningIcon} alt='warn' className=' w-24' />
          <p>User has been succcessfully deactivated</p>
          <div className='flex w-full justify-center gap-4'>
            <button
              className=' bg-[#7738DD] p-4 rounded-lg text-white'
              onClick={() => setSuccessPrompt(false)}>
              ok, got it
            </button>
          </div>
        </div>
      </Modal>

      <Group position='center'></Group>
    </>
  );
};

export default DeactivateUser;
